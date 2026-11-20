import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Algorithm } from '../types/algorithm';

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onDelete?: (id: number) => void;
  onSelect?: (id: number) => void;
}

const BASE_URL = import.meta.env.BASE_URL || '/';
const DEFAULT_IMAGE = `${BASE_URL}gzip_draft.png`;

// Нормализация URL с учётом базового пути GitHub Pages и MinIO
const resolvePublicUrl = (url: string | null | undefined): string => {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split('/');
      const filename = parts[parts.length - 1];
      return filename ? `${BASE_URL}${filename}` : DEFAULT_IMAGE;
    } catch {
      return url;
    }
  }
  const cleanPath = url.startsWith('/') ? url.slice(1) : url;
  return `${BASE_URL}${cleanPath}`;
};

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm, onDelete, onSelect }) => {
  const [imgSrc, setImgSrc] = useState<string>(resolvePublicUrl(algorithm.image_url));

  return (
    <Card
      className="h-100 shadow-sm border-0"
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onClick={() => onSelect && onSelect(algorithm.algorithm_id)}
    >
      <div className="algo-card-media">
        <Card.Img
          variant="top"
          src={imgSrc}
          onError={() => {
            if (imgSrc !== DEFAULT_IMAGE) setImgSrc(DEFAULT_IMAGE);
          }}
          alt={algorithm.algorithm_name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          className="position-absolute top-0 end-0 m-2 text-white fw-bold d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: '#2ec4b6',
            fontSize: '11px',
            padding: '4px 8px',
            borderRadius: '8px',
            lineHeight: 1,
            zIndex: 2,
          }}
        >
          {Number(algorithm.compression_ratio).toFixed(1)}x
        </div>
      </div>

      <Card.Body className="d-flex flex-column justify-content-between p-3">
        <div>
          <Card.Title
            className="text-truncate mb-1"
            style={{ fontSize: '14px', fontWeight: 700 }}
            title={algorithm.algorithm_name}
          >
            {algorithm.algorithm_name}
          </Card.Title>
          <Card.Text
            className="text-muted"
            style={{
              fontSize: '12px',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              marginBottom: '8px',
            }}
          >
            {algorithm.algorithm_description || 'Нет описания'}
          </Card.Text>
        </div>

        <div>
          <div
            className="d-flex justify-content-between align-items-center pt-2 border-top"
            style={{ fontSize: '11.5px' }}
          >
            <span className="text-secondary fw-semibold">
              ⚡ {algorithm.compression_speed_mbps} МБ/с
            </span>
            <span style={{ color: '#2ec4b6', fontWeight: 700 }}>
              ❤️ {algorithm.likes_count ?? 0}
            </span>
          </div>

          {algorithm.is_creator === 1 && onDelete && (
            <Button
              variant="danger"
              size="sm"
              className="w-100 fw-semibold mt-2 py-1 border-0"
              style={{ fontSize: '11px', backgroundColor: '#ef4444', borderRadius: '8px' }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(algorithm.algorithm_id);
              }}
            >
              Удалить
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};