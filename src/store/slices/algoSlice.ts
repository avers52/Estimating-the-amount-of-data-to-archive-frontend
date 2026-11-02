import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CompressionAlgorithmsService } from '../../api/client';
import { MOCK_ALGORITHMS } from '../../mocks/algorithms.mock';
import { Algorithm } from '../../types/algorithm';

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
export const fetchAlgorithmsThunk = createAsyncThunk(
  'algorithms/fetchAll',
  async (minRatio: number) => {
    try {
      const data = await CompressionAlgorithmsService.compressionAlgorithmsControllerGetCatalog(minRatio);
      return (data as unknown as Algorithm[]) || [];
    } catch {
      return MOCK_ALGORITHMS.filter((a) => a.compression_ratio >= minRatio);
    }
  }
);

// Загрузка карточки ленты (GET /api/compression-algorithms/feed)
export const fetchFeedThunk = createAsyncThunk(
  'algorithms/fetchFeed',
  async ({ id, next }: { id?: number; next?: boolean }) => {
    try {
      const data = await CompressionAlgorithmsService.compressionAlgorithmsControllerGetFeed(id, next);
      return data as unknown as Algorithm;
    } catch {
      return MOCK_ALGORITHMS[0];
    }
  }
);

// Переключение лайка (POST /api/compression-algorithms/:id/like)
export const toggleLikeThunk = createAsyncThunk(
  'algorithms/toggleLike',
  async ({ id, isLiked }: { id: number; isLiked: number }) => {
    try {
      // Стандартный вызов сгенерированного метода
      await (CompressionAlgorithmsService as any).compressionAlgorithmsControllerSetLike(id, {
        is_liked: isLiked,
      });
    } catch (err: any) {
      // Альтернативная сигнатура, если генератор обернул в requestBody
      await (CompressionAlgorithmsService as any).compressionAlgorithmsControllerSetLike({
        id,
        requestBody: { is_liked: isLiked },
      });
    }
    return { id, isLiked };
  }
);

// Удаление алгоритма (DELETE /api/compression-algorithms/:id)
export const deleteAlgorithmThunk = createAsyncThunk(
  'algorithms/delete',
  async (id: number) => {
    await CompressionAlgorithmsService.compressionAlgorithmsControllerDeleteService(id);
    return id;
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
      })
      .addCase(fetchAlgorithmsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAlgorithmsThunk.rejected, (state) => {
        state.loading = false;
      })
      // Лента
      .addCase(fetchFeedThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feedItem = action.payload;
      })
      .addCase(fetchFeedThunk.rejected, (state) => {
        state.loading = false;
      })
      // Лайк (мгновенно меняем состояние в хранилище)
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