import React, { useState } from 'react';
import { Container, Modal, Button } from 'react-bootstrap';
import { MOCK_ALGORITHMS } from '../mocks/algorithms.mock';

const DEFAULT_VIDEO = '/gzip_process.mp4';

export const FeedPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const currentAlgo = MOCK_ALGORITHMS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % MOCK_ALGORITHMS.length);
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center py-2" style={{ minHeight: '88vh' }}>
      <div
        className="position-relative bg-black rounded-4 shadow-lg overflow-hidden"
        style={{ width: '100%', maxWidth: '390px', height: '680px' }}
      >
        {/* Видеоплеер */}
        <video
          key={currentAlgo.video_url || DEFAULT_VIDEO}
          src={currentAlgo.video_url || DEFAULT_VIDEO}
          className="w-100 h-100"
          style={{ objectFit: 'cover' }}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* 1. Верхний заголовок по центру */}
        <div className="position-absolute top-0 start-0 w-100 pt-3 d-flex justify-content-center" style={{ zIndex: 5 }}>
          <div
            className="px-4 py-1 text-white fw-bold rounded-pill shadow-sm"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
              fontSize: '13px',
              letterSpacing: '0.2px',
            }}
          >
            {currentAlgo.algorithm_name}
          </div>
        </div>

        {/* 2. Правая вертикальная панель виджетов */}
        <div
          className="position-absolute d-flex flex-column align-items-center gap-3"
          style={{ right: '14px', bottom: '28px', zIndex: 10 }}
        >
          {/* Коэффициент сжатия */}
          <div className="d-flex flex-column align-items-center text-white">
            <div
              className="d-flex flex-column justify-content-center align-items-center rounded-circle shadow-sm"
              style={{
                width: '46px',
                height: '46px',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(6px)',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '13px' }}>⚡</span>
              <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '-2px' }}>
                x{currentAlgo.compression_ratio.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Скорость обработки */}
          <div className="d-flex flex-column align-items-center text-white">
            <div
              className="d-flex flex-column justify-content-center align-items-center rounded-circle shadow-sm"
              style={{
                width: '46px',
                height: '46px',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(6px)',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '13px' }}>🚀</span>
              <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '-2px' }}>
                {currentAlgo.compression_speed_mbps}M
              </span>
            </div>
          </div>

          {/* Лайки */}
          <div className="d-flex flex-column align-items-center text-white">
            <div
              className="d-flex flex-column justify-content-center align-items-center rounded-circle shadow-sm"
              style={{
                width: '46px',
                height: '46px',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(6px)',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '14px', color: '#ff4d6d' }}>❤️</span>
              <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '-2px' }}>
                {currentAlgo.likes_count}
              </span>
            </div>
          </div>

          {/* Зеленая кнопка перехода к следующему алгоритму */}
          <div
            onClick={handleNext}
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

        {/* 3. Сплошное затемнение на всю ширину карточки */}
        <div
          className="position-absolute start-0 bottom-0 w-100 p-3 text-white"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 65%, transparent 100%)',
            zIndex: 5,
          }}
        >
          <div style={{ maxWidth: 'calc(100% - 65px)' }}>
            <div
              style={{
                fontSize: '13px',
                lineHeight: 1.35,
                fontWeight: 500,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '4px',
              }}
            >
              <b>{currentAlgo.algorithm_name}</b> — {currentAlgo.algorithm_description}
            </div>
            <span
              onClick={() => setShowDetails(true)}
              style={{
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                color: '#ffffff',
                textDecoration: 'underline',
                opacity: 0.95,
              }}
            >
              Еще
            </span>
          </div>
        </div>
      </div>

      {/* Модальное окно по клику на «Еще» */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '16px', fontWeight: 700 }}>
            {currentAlgo.algorithm_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '14px' }}>
            {currentAlgo.algorithm_description}
          </p>
          <div className="bg-light p-3 rounded-3" style={{ fontSize: '13px' }}>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Коэффициент сжатия:</span>
              <b>x{currentAlgo.compression_ratio.toFixed(2)}</b>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Скорость обработки:</span>
              <b>{currentAlgo.compression_speed_mbps} МБ/с</b>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Оценка пользователей:</span>
              <b>❤️ {currentAlgo.likes_count}</b>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Медиафайл:</span>
              <b>{currentAlgo.video_url ? 'MinIO S3' : 'Fallback (gzip_process.mp4)'}</b>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowDetails(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};