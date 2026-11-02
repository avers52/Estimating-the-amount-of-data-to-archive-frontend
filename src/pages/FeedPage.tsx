import React, { useState } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import { MOCK_ALGORITHMS } from '../mocks/algorithms.mock';

const DEFAULT_VIDEO = '/default-algorithm.mp4';

export const FeedPage: React.FC = () => {
  // Хук useState: индекс текущей отображаемой карточки из мока
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentAlgo = MOCK_ALGORITHMS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % MOCK_ALGORITHMS.length);
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center py-3" style={{ minHeight: '85vh' }}>
      <div
        className="position-relative bg-dark rounded-4 shadow-lg overflow-hidden"
        style={{ width: '100%', maxWidth: '390px', height: '640px' }}
      >
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

        {/* Верхний плавающий заголовок */}
        <div className="position-absolute top-0 start-0 p-3 w-100 d-flex justify-content-between align-items-center">
          <Badge bg="dark" className="bg-opacity-75 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '13px' }}>
            {currentAlgo.algorithm_name}
          </Badge>
          <Badge
            className="px-3 py-2 rounded-pill text-white fw-bold"
            style={{ backgroundColor: '#00b4d8', fontSize: '12px' }}
          >
            {currentAlgo.compression_ratio}x
          </Badge>
        </div>

        {/* Нижний информационный оверлей */}
        <div
          className="position-absolute bottom-0 start-0 p-3 text-white w-100"
          style={{ background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.95))' }}
        >
          <p style={{ fontSize: '13px', lineHeight: 1.4, marginBottom: '12px' }}>
            {currentAlgo.algorithm_description}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Скорость: <b className="text-white">{currentAlgo.compression_speed_mbps} МБ/с</b>
            </span>
            <Button
              className="text-white rounded-pill px-4 fw-bold"
              style={{
                backgroundColor: '#00b4d8',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 180, 216, 0.4)',
              }}
              onClick={handleNext}
            >
              Следующий →
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};