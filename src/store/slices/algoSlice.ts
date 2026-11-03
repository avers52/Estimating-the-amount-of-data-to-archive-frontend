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
        return MOCK_ALGORITHMS.filter((a) => a.compression_ratio >= minRatio);
      }
      return rejectWithValue(err?.body?.message || err?.message || 'Ошибка загрузки каталога');
    }
  }
);

// Загрузка карточки ленты (GET /api/compression-algorithms/feed)
export const fetchFeedThunk = createAsyncThunk(
  'algorithms/fetchFeed',
  async (
    { id, next }: { id?: number; next?: boolean },
    { getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const isGuest = !state.auth.isAuthenticated;

    try {
      const data = await CompressionAlgorithmsService.compressionAlgorithmsControllerGetFeed(id, next);
      if (data) return data as unknown as Algorithm;
      throw new Error('Пустой ответ');
    } catch (err: any) {
      if (isGuest) {
        if (!MOCK_ALGORITHMS.length) return null;
        if (id !== undefined) {
          const found = MOCK_ALGORITHMS.find((a) => a.algorithm_id === id);
          if (found) {
            if (next) {
              const idx = MOCK_ALGORITHMS.indexOf(found);
              const nextIdx = (idx + 1) % MOCK_ALGORITHMS.length;
              return MOCK_ALGORITHMS[nextIdx];
            }
            return found;
          }
        }
        return MOCK_ALGORITHMS[0];
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