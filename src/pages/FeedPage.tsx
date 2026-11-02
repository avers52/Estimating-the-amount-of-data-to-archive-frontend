import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFeedThunk } from '../store/slices/algoSlice';

interface FeedPageProps {
  targetAlgorithmId?: number;
}

export const FeedPage: React.FC<FeedPageProps> = ({ targetAlgorithmId }) => {
  const dispatch = useAppDispatch();
  const { feedItem, loading } = useAppSelector((state) => state.algorithms);

  const [isExpanded, setIsExpanded] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<number>(0);

  // 1. Загрузка целевого алгоритма (если кликнули в плитке) либо первого в ленте
  useEffect(() => {
    if (targetAlgorithmId) {
      dispatch(fetchFeedThunk({ id: targetAlgorithmId, next: false }));
    } else {
      dispatch(fetchFeedThunk({ next: true }));
    }
  }, [dispatch, targetAlgorithmId]);

  // 2. Синхронизация с учетом гостевых лайков из localStorage
  useEffect(() => {
    if (feedItem) {
      const storedGuestLikes: number[] = JSON.parse(localStorage.getItem('guest_liked_algo_ids') || '[]');
      const isLocallyLiked = storedGuestLikes.includes(feedItem.algorithm_id);

      const serverIsLiked = feedItem.is_liked === 1;
      const effectiveLiked = isLocallyLiked || serverIsLiked ? 1 : 0;

      setIsLiked(effectiveLiked);
      setLikesCount((feedItem.likes_count ?? 0) + (isLocallyLiked && !serverIsLiked ? 1 : 0));
      setIsExpanded(false);
    }
  }, [feedItem]);

  const handleNext = () => {
    setIsExpanded(false);
    if (feedItem) {
      dispatch(fetchFeedThunk({ id: feedItem.algorithm_id, next: true }));
    }
  };

  const handleLike = async () => {
    if (!feedItem) return;
    const nextState = isLiked === 1 ? 0 : 1;

    // Мгновенный UI отклик
    setIsLiked(nextState);
    setLikesCount((prev) => (nextState === 1 ? prev + 1 : Math.max(0, prev - 1)));

    // Сохраняем в localStorage для гостя, чтобы лайк не пропадал при перелистывании
    const storedGuestLikes: number[] = JSON.parse(localStorage.getItem('guest_liked_algo_ids') || '[]');
    if (nextState === 1) {
      if (!storedGuestLikes.includes(feedItem.algorithm_id)) {
        storedGuestLikes.push(feedItem.algorithm_id);
      }
    } else {
      const index = storedGuestLikes.indexOf(feedItem.algorithm_id);
      if (index > -1) {
        storedGuestLikes.splice(index, 1);
      }
    }
    localStorage.setItem('guest_liked_algo_ids', JSON.stringify(storedGuestLikes));

    // Пробуем отправить на бэкенд
    try {
      await fetch(`/api/compression-algorithms/${feedItem.algorithm_id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_liked: nextState }),
      });
    } catch {
      // Игнорируем сетевые ошибки, локальный лайк остаётся сохранённым
    }
  };

  if (loading && !feedItem) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '70vh' }}>
        <Spinner animation="border" variant="dark" />
      </div>
    );
  }

  if (!feedItem) {
    return (
      <div className="text-center py-5">
        <h5>Алгоритмы не найдены</h5>
        <button className="btn btn-outline-dark btn-sm mt-3" onClick={() => dispatch(fetchFeedThunk({ next: true }))}>
          Обновить
        </button>
      </div>
    );
  }

  const imageSrc = feedItem.image_url
    ? feedItem.image_url.startsWith('http://localhost:9000/')
      ? feedItem.image_url.replace('http://localhost:9000/', '/s3/')
      : feedItem.image_url
    : '/gzip_draft.png';

  const videoSrc = feedItem.video_url
    ? feedItem.video_url.startsWith('http://localhost:9000/')
      ? feedItem.video_url.replace('http://localhost:9000/', '/s3/')
      : feedItem.video_url
    : null;

  return (
    <div className="d-flex justify-content-center align-items-center py-2" style={{ userSelect: 'none' }}>
      <div
        style={{
          position: 'relative',
          width: '390px',
          height: '680px',
          borderRadius: '28px',
          overflow: 'hidden',
          backgroundColor: '#000',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
      >
        {videoSrc ? (
          <video
            key={videoSrc}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <img
            src={imageSrc}
            alt={feedItem.algorithm_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e: any) => {
              e.target.src = '/gzip_draft.png';
            }}
          />
        )}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.85) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              color: '#FFFFFF',
              padding: '6px 20px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '13.5px',
              backdropFilter: 'blur(8px)',
            }}
          >
            {feedItem.algorithm_name}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 14,
            bottom: 22,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            zIndex: 15,
          }}
        >
          {/* Молния */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(6px)',
              fontSize: '10.5px',
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: '13px', lineHeight: 1, marginBottom: '2px' }}>⚡</span>
            <span>x{Number(feedItem.compression_ratio).toFixed(2)}</span>
          </div>

          {/* Ракета */}
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(6px)',
              fontSize: '10px',
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: '12px', lineHeight: 1, marginBottom: '2px' }}>🚀</span>
            <span>{feedItem.compression_speed_mbps}M</span>
          </div>

          {/* Лайк */}
          <div
            onClick={handleLike}
            role="button"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: isLiked === 1 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(15, 23, 42, 0.65)',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              fontSize: '10.5px',
              fontWeight: 700,
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '14px', lineHeight: 1, marginBottom: '2px' }}>❤️</span>
            <span>{likesCount}</span>
          </div>

          {/* Кнопка "➔ След." */}
          <div
            onClick={handleNext}
            role="button"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#357C64',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '9.5px',
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: '14px', lineHeight: 1, marginBottom: '1px' }}>➔</span>
            <span>След.</span>
          </div>
        </div>

        {/* Описание */}
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 76,
            bottom: 22,
            zIndex: 15,
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              lineHeight: 1.4,
              textShadow: '0 1px 3px rgba(0,0,0,0.9)',
              maxHeight: isExpanded ? '180px' : '38px',
              overflow: 'hidden',
              display: isExpanded ? 'block' : '-webkit-box',
              WebkitLineClamp: isExpanded ? undefined : 2,
              WebkitBoxOrient: 'vertical',
              transition: 'max-height 0.25s ease',
            }}
          >
            <strong>{feedItem.algorithm_name}</strong> — {feedItem.algorithm_description || 'Описание отсутствует.'}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginTop: '4px',
              color: '#60A5FA',
              fontWeight: 600,
              fontSize: '12.5px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {isExpanded ? 'Скрыть' : 'Еще'}
          </button>
        </div>
      </div>
    </div>
  );
};