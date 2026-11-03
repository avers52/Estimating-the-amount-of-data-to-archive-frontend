import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeedThunk, toggleLikeThunk } from '../store/slices/algoSlice';
import { NavigationBar, PageType } from '../components/NavigationBar';

const DEFAULT_VIDEO = '/gzip_process.mp4';

const resolvePublicUrl = (url: string | null | undefined, fallback: string): string => {
  if (!url) return fallback;
  if (url.startsWith('/')) return url;
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    const filename = parts[parts.length - 1];
    return filename ? `/${filename}` : fallback;
  } catch {
    return url;
  }
};

interface FeedPageProps {
  targetAlgorithmId?: number;
  onPageChange: (page: PageType) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({ targetAlgorithmId, onPageChange }) => {
  const dispatch = useAppDispatch();
  const { feedItem, loading } = useAppSelector((state) => state.algorithms);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [isExpanded, setIsExpanded] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<number>(0);

  useEffect(() => {
    if (targetAlgorithmId !== undefined) {
      dispatch(fetchFeedThunk({ id: targetAlgorithmId, next: false }));
    } else {
      dispatch(fetchFeedThunk({ next: true }));
    }
  }, [dispatch, targetAlgorithmId]);

  useEffect(() => {
    if (feedItem) {
      setIsLiked(isAuthenticated && feedItem.is_liked === 1 ? 1 : 0);
      setLikesCount(feedItem.likes_count ?? 0);
      setIsExpanded(false);
    }
  }, [feedItem, isAuthenticated]);

  const handleNext = () => {
    if (loading) return;
    setIsExpanded(false);
    if (feedItem) {
      dispatch(fetchFeedThunk({ id: feedItem.algorithm_id, next: true }));
    } else {
      dispatch(fetchFeedThunk({ next: true }));
    }
  };

  const handleLike = () => {
    if (!isAuthenticated || !feedItem || loading) return;
    const nextState = isLiked === 1 ? 0 : 1;
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState === 1 ? prev + 1 : Math.max(0, prev - 1)));
    dispatch(toggleLikeThunk({ id: feedItem.algorithm_id, isLiked: nextState }));
  };

  if (loading && !feedItem) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ width: '390px', height: '690px' }}>
        <Spinner animation="border" style={{ color: '#2ec4b6' }} />
      </div>
    );
  }

  if (!feedItem) {
    return (
      <div
        className="text-center text-white p-4 d-flex flex-column justify-content-center align-items-center"
        style={{ width: '390px', height: '690px', backgroundColor: '#000', borderRadius: '24px' }}
      >
        <h5>Алгоритмы не найдены</h5>
        <button
          className="btn btn-outline-light btn-sm mt-3"
          onClick={() => dispatch(fetchFeedThunk({ next: true }))}
        >
          Обновить
        </button>
      </div>
    );
  }

  const imageSrc = resolvePublicUrl(feedItem.image_url, '/gzip_draft.png');
  const videoSrc = resolvePublicUrl(feedItem.video_url, DEFAULT_VIDEO);

  return (
    <div className="d-flex justify-content-center align-items-center py-2" style={{ userSelect: 'none' }}>
      <div
        className="position-relative bg-black rounded-4 shadow-lg overflow-hidden d-flex flex-column justify-content-between"
        style={{ width: '390px', height: '690px' }}
      >
        <video
          key={videoSrc}
          src={videoSrc}
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: 'cover', zIndex: 1 }}
          autoPlay
          loop
          muted
          playsInline
          poster={imageSrc}
        />

        {/* Верхний заголовок */}
        <div className="w-100 pt-3 d-flex justify-content-center" style={{ zIndex: 10 }}>
          <div
            className="px-4 py-1 text-white fw-bold rounded-pill shadow-sm"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
              fontSize: '13px',
            }}
          >
            {feedItem.algorithm_name}
          </div>
        </div>

        {/* Правые виджеты */}
        <div
          className="position-absolute d-flex flex-column align-items-center gap-3"
          style={{ right: '14px', bottom: '70px', zIndex: 15 }}
        >
          {/* Молния */}
          <div
            className="d-flex flex-column justify-content-center align-items-center rounded-circle shadow-sm text-white"
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span style={{ fontSize: '13px' }}>⚡</span>
            <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '-2px' }}>
              x{Number(feedItem.compression_ratio).toFixed(2)}
            </span>
          </div>

          {/* Ракета */}
          <div
            className="d-flex flex-column justify-content-center align-items-center rounded-circle shadow-sm text-white"
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span style={{ fontSize: '13px' }}>🚀</span>
            <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '-2px' }}>
              {feedItem.compression_speed_mbps}M
            </span>
          </div>

          {/* Лайк (кликабелен строго для авторизованных) */}
          <div
            onClick={isAuthenticated && !loading ? handleLike : undefined}
            role={isAuthenticated ? 'button' : undefined}
            title={isAuthenticated ? 'Оценить алгоритм' : 'Оценивать алгоритмы могут только авторизованные пользователи'}
            className="d-flex flex-column justify-content-center align-items-center rounded-circle shadow-sm text-white"
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: isLiked === 1 ? 'rgba(239, 68, 68, 0.95)' : 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(6px)',
              cursor: isAuthenticated && !loading ? 'pointer' : 'default',
              transition: 'background-color 0.15s ease',
            }}
          >
            <span style={{ fontSize: '14px' }}>❤️</span>
            <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '-2px' }}>
              {likesCount}
            </span>
          </div>

          {/* Кнопка «Следующий» */}
          <div
            onClick={!loading ? handleNext : undefined}
            role="button"
            className="d-flex flex-column justify-content-center align-items-center rounded-circle shadow text-white"
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: '#2ec4b6',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <span style={{ fontSize: '14px', fontWeight: 900 }}>➜</span>
                <span style={{ fontSize: '9px', fontWeight: 700, marginTop: '-2px' }}>След.</span>
              </>
            )}
          </div>
        </div>

        {/* Описание + навигация */}
        <div
          className="w-100"
          style={{
            zIndex: 10,
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 70%, transparent 100%)',
          }}
        >
          <div className="px-3 pb-2 text-white" style={{ maxWidth: 'calc(100% - 65px)' }}>
            <div
              style={{
                fontSize: '13px',
                lineHeight: 1.35,
                fontWeight: 500,
                maxHeight: isExpanded ? '200px' : '36px',
                overflow: 'hidden',
                display: isExpanded ? 'block' : '-webkit-box',
                WebkitLineClamp: isExpanded ? undefined : 2,
                WebkitBoxOrient: 'vertical',
                transition: 'max-height 0.25s ease',
                marginBottom: '4px',
              }}
            >
              <b>{feedItem.algorithm_name}</b> — {feedItem.algorithm_description || 'Описание отсутствует.'}
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                color: '#60a5fa',
                outline: 'none',
              }}
            >
              {isExpanded ? 'Скрыть' : 'Еще'}
            </button>
          </div>

          <NavigationBar currentPage="feed" onPageChange={onPageChange} darkTheme={true} />
        </div>
      </div>
    </div>
  );
};