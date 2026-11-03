import React, { useState, useEffect } from 'react';
import { MOCK_ALGORITHMS } from '../mocks/algorithms.mock';
import { NavigationBar, PageType } from '../components/NavigationBar';

const DEFAULT_VIDEO = '/gzip_process.mp4';

interface FeedPageProps {
  initialAlgorithmId?: number;
  onPageSelect: (page: PageType) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({ initialAlgorithmId, onPageSelect }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (initialAlgorithmId) {
      const targetIndex = MOCK_ALGORITHMS.findIndex((a) => a.algorithm_id === initialAlgorithmId);
      if (targetIndex !== -1) {
        setCurrentIndex(targetIndex);
      }
    }
  }, [initialAlgorithmId]);

  const currentAlgo = MOCK_ALGORITHMS[currentIndex];

  const handleNext = () => {
    setIsExpanded(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % MOCK_ALGORITHMS.length);
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-2" style={{ userSelect: 'none' }}>
      <div
        className="position-relative bg-black rounded-4 shadow-lg overflow-hidden d-flex flex-column justify-content-between"
        style={{ width: '390px', height: '690px' }}
      >
        {/* Видеоплеер */}
        <video
          key={currentAlgo.video_url || DEFAULT_VIDEO}
          src={currentAlgo.video_url || DEFAULT_VIDEO}
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ objectFit: 'cover', zIndex: 1 }}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* 1. Верхний заголовок по центру */}
        <div className="w-100 pt-3 d-flex justify-content-center" style={{ zIndex: 10 }}>
          <div
            className="px-4 py-1 text-white fw-bold rounded-pill shadow-sm"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
              fontSize: '13px',
            }}
          >
            {currentAlgo.algorithm_name}
          </div>
        </div>

        {/* 2. Правая вертикальная панель виджетов */}
        <div
          className="position-absolute d-flex flex-column align-items-center gap-3"
          style={{ right: '14px', bottom: '70px', zIndex: 15 }}
        >
          {/* Коэффициент сжатия */}
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
              x{currentAlgo.compression_ratio.toFixed(2)}
            </span>
          </div>

          {/* Скорость обработки */}
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
              {currentAlgo.compression_speed_mbps}M
            </span>
          </div>

          {/* Лайк (индикатор без возможности клика для гостя) */}
          <div
            title="Оценивать алгоритмы могут только авторизованные пользователи"
            className="d-flex flex-column justify-content-center align-items-center rounded-circle shadow-sm text-white"
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(6px)',
              cursor: 'default',
            }}
          >
            <span style={{ fontSize: '14px' }}>❤️</span>
            <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '-2px' }}>
              {currentAlgo.likes_count ?? 0}
            </span>
          </div>

          {/* Кнопка "➜ След." */}
          <div
            onClick={handleNext}
            role="button"
            className="d-flex flex-column justify-content-center align-items-center rounded-circle shadow text-white"
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: '#2ec4b6',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 900 }}>➜</span>
            <span style={{ fontSize: '9px', fontWeight: 700, marginTop: '-2px' }}>След.</span>
          </div>
        </div>

        {/* 3. Описание и встроенная панель навигации */}
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
              <b>{currentAlgo.algorithm_name}</b> — {currentAlgo.algorithm_description}
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

          <NavigationBar currentPage="feed" onPageSelect={onPageSelect} darkTheme={true} />
        </div>
      </div>
    </div>
  );
};