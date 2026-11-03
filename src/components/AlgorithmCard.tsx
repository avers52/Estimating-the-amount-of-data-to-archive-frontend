import React, { useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Algorithm } from '../types/algorithm';

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onSelect?: (id: number) => void;
}

const DEFAULT_IMAGE = '/gzip_draft.png';

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm, onSelect }) => {
  const [imgSrc, setImgSrc] = useState<string>(algorithm.image_url || DEFAULT_IMAGE);

  return (
    <Card
      className="h-100 shadow-sm border-0"
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'transform 0.15s ease',
      }}
      onClick={() => onSelect && onSelect(algorithm.algorithm_id)}
    >
      <div style={{ height: '95px', backgroundColor: '#e2e8f0', position: 'relative' }}>
        <Card.Img
          variant="top"
          src={imgSrc}
          onError={() => {
            if (imgSrc !== DEFAULT_IMAGE) {
              setImgSrc(DEFAULT_IMAGE);
            }
          }}
          alt={algorithm.algorithm_name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Badge
          className="position-absolute top-0 end-0 m-1 text-white"
          style={{ backgroundColor: '#2ec4b6', fontSize: '10px', padding: '3px 6px' }}
        >
          {algorithm.compression_ratio}x
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column justify-content-between p-2">
        <div>
          <Card.Title
            className="text-truncate mb-1"
            style={{ fontSize: '12.5px', fontWeight: 700 }}
            title={algorithm.algorithm_name}
          >
            {algorithm.algorithm_name}
          </Card.Title>
          <Card.Text
            className="text-muted"
            style={{
              fontSize: '11px',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '6px',
            }}
          >
            {algorithm.algorithm_description}
          </Card.Text>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-1 border-top" style={{ fontSize: '10.5px' }}>
          <span className="text-secondary fw-semibold">
            ⚡ {algorithm.compression_speed_mbps}М
          </span>
          <span style={{ color: '#2ec4b6', fontWeight: 700 }}>
            ❤️ {algorithm.likes_count}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};