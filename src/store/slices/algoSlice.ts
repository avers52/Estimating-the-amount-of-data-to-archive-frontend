import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CompressionAlgorithmsService } from '../../api/client';
import { MOCK_ALGORITHMS } from '../../mocks/algorithms.mock';
import { Algorithm } from '../../types/algorithm';
import type { RootState } from '../index';

interface AlgoState {
  items: Algorithm[];
  feedItem: Algorithm | null;
  loading: boolean;
  error: string | null;
}

const initialState: AlgoState = {
  items: [],
  feedItem: null,
  loading: false,
  error: null,
};

// Загрузка каталога с фильтрацией (GET /api/compression-algorithms)
// Fallback на mock-объекты предусмотрен ТОЛЬКО для гостя
export const fetchAlgorithmsThunk = createAsyncThunk(
  'algorithms/fetchAll',
  async (minRatio: number, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const isGuest = !state.auth.isAuthenticated;

    try {
      const data = await CompressionAlgorithmsService.compressionAlgorithmsControllerGetCatalog(minRatio);
      return (data as unknown as Algorithm[]) || [];
    } catch (err: any) {
      if (isGuest) {
        return MOCK_ALGORITHMS.filter((a) => Number(a.compression_ratio) >= minRatio);
      }
      return rejectWithValue(err?.body?.message || err?.message || 'Ошибка загрузки каталога');
    }
  }
);

// Загрузка карточки ленты с учётом активного фильтра minRatio из Redux
export const fetchFeedThunk = createAsyncThunk(
  'algorithms/fetchFeed',
  async (
    { id, next }: { id?: number; next?: boolean },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const isGuest = !state.auth.isAuthenticated;
    const minRatio = state.filter.minRatio;

    try {
      // Если открыли конкретную карточку по клику из плитки (next === false)
      if (id !== undefined && next === false) {
        const single = await CompressionAlgorithmsService.compressionAlgorithmsControllerGetFeed(id, false);
        if (single) return single as unknown as Algorithm;
      }

      // Получаем список алгоритмов, проходящих текущий фильтр minRatio
      const rawCatalog = await CompressionAlgorithmsService.compressionAlgorithmsControllerGetCatalog(minRatio);
      const filteredList = ((rawCatalog as unknown as Algorithm[]) || []).filter(
        (item) => Number(item.compression_ratio) >= minRatio
      );

      if (!filteredList.length) {
        return null;
      }

      // Выбираем нужный элемент из отфильтрованного списка
      let targetItem: Algorithm = filteredList[0];
      if (id !== undefined) {
        const currentIndex = filteredList.findIndex((item) => item.algorithm_id === id);
        if (currentIndex !== -1) {
          const nextIndex = next ? (currentIndex + 1) % filteredList.length : currentIndex;
          targetItem = filteredList[nextIndex];
        }
      }

      // Дозапрашиваем полные данные выбранного элемента через эндпоинт ленты (для актуальных is_liked и video_url)
      try {
        const fullFeedItem = await CompressionAlgorithmsService.compressionAlgorithmsControllerGetFeed(
          targetItem.algorithm_id,
          false
        );
        if (fullFeedItem) return fullFeedItem as unknown as Algorithm;
      } catch {
        // Если одиночный запрос не сработал, возвращаем объект из каталога
      }

      return targetItem;
    } catch (err: any) {
      if (isGuest) {
        const filteredMocks = MOCK_ALGORITHMS.filter(
          (a) => Number(a.compression_ratio) >= minRatio
        );
        if (!filteredMocks.length) return null;

        if (id !== undefined) {
          const idx = filteredMocks.findIndex((a) => a.algorithm_id === id);
          if (idx !== -1) {
            const nextIdx = next ? (idx + 1) % filteredMocks.length : idx;
            return filteredMocks[nextIdx];
          }
        }
        return filteredMocks[0];
      }
      return rejectWithValue(err?.body?.message || err?.message || 'Ошибка загрузки ленты');
    }
  }
);

// Переключение лайка через кодогенерацию
export const toggleLikeThunk = createAsyncThunk(
  'algorithms/toggleLike',
  async ({ id, isLiked }: { id: number; isLiked: number }, { rejectWithValue }) => {
    try {
      await (CompressionAlgorithmsService as any).compressionAlgorithmsControllerSetLike(id, {
        is_liked: isLiked,
      });
      return { id, isLiked };
    } catch (err: any) {
      return rejectWithValue(err?.body?.message || err?.message || 'Ошибка переключения лайка');
    }
  }
);

// Удаление алгоритма (DELETE /api/compression-algorithms/:id)
export const deleteAlgorithmThunk = createAsyncThunk(
  'algorithms/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await CompressionAlgorithmsService.compressionAlgorithmsControllerDeleteService(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.body?.message || err?.message || 'Ошибка удаления');
    }
  }
);

export const algoSlice = createSlice({
  name: 'algorithms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Каталог
      .addCase(fetchAlgorithmsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlgorithmsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAlgorithmsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Лента
      .addCase(fetchFeedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feedItem = action.payload;
      })
      .addCase(fetchFeedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Лайк
      .addCase(toggleLikeThunk.fulfilled, (state, action) => {
        const { id, isLiked } = action.payload;
        if (state.feedItem && state.feedItem.algorithm_id === id) {
          state.feedItem.is_liked = isLiked;
          const currentCount = state.feedItem.likes_count || 0;
          state.feedItem.likes_count = isLiked === 1 ? currentCount + 1 : Math.max(0, currentCount - 1);
        }
      })
      // Удаление
      .addCase(deleteAlgorithmThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.algorithm_id !== action.payload);
      });
  },
});

export default algoSlice.reducer;