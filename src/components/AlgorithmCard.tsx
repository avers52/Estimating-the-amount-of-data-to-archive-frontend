import React, { useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Algorithm } from '../types/algorithm';

interface AlgorithmCardProps {
  algorithm: Algorithm;
}

const DEFAULT_IMAGE = '/default-algorithm.png';

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm }) => {
  // Хук useState: инициализация изображением из мока либо дефолтным
  const [imgSrc, setImgSrc] = useState<string>(algorithm.image_url || DEFAULT_IMAGE);

  return (
    <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ height: '140px', backgroundColor: '#e2e8f0', position: 'relative' }}>
        <Card.Img
          variant="top"
          src={imgSrc}
          onError={() => setImgSrc(DEFAULT_IMAGE)}
          alt={algorithm.algorithm_name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Badge
          className="position-absolute top-0 end-0 m-2 text-white"
          style={{ backgroundColor: '#00b4d8', fontSize: '11px' }}
        >
          {algorithm.compression_ratio}x
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column justify-content-between p-3">
        <div>
          <Card.Title style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
            {algorithm.algorithm_name}
          </Card.Title>
          <Card.Text
            className="text-muted"
            style={{
              fontSize: '12px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {algorithm.algorithm_description}
          </Card.Text>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
          <small className="text-secondary fw-semibold" style={{ fontSize: '11px' }}>
            ⚡ {algorithm.compression_speed_mbps} МБ/с
          </small>
          <span style={{ fontSize: '12px', color: '#0096c7', fontWeight: 600 }}>
            ❤️ {algorithm.likes_count}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};