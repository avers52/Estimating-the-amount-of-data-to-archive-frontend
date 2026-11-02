import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Algorithm } from '../types/algorithm';

interface AlgorithmCardProps {
  algorithm: Algorithm;
  onDelete?: (id: number) => void;
  onSelect?: (id: number) => void;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm, onDelete, onSelect }) => {
  const rawUrl = algorithm.image_url;
  const imageSrc = rawUrl
    ? (rawUrl.startsWith('http://localhost:9000/') ? rawUrl.replace('http://localhost:9000/', '/s3/') : rawUrl)
    : '/gzip_draft.png';

  return (
    <Card
      className="border-0 shadow-sm overflow-hidden h-100"
      style={{
        borderRadius: '16px',
        border: '1px solid #ECEFF1',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: '110px',
          backgroundColor: '#262626',
          cursor: onSelect ? 'pointer' : 'default',
          overflow: 'hidden',
        }}
        onClick={() => onSelect && onSelect(algorithm.algorithm_id)}
      >
        <img
          src={imageSrc}
          alt={algorithm.algorithm_name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e: any) => {
            e.target.src = '/gzip_draft.png';
          }}
        />
      </div>

      <Card.Body className="p-3 d-flex flex-column justify-content-between">
        <div>
          <div
            className="fw-bold mb-1 text-truncate"
            style={{ fontSize: '14px', color: '#1E293B' }}
            title={algorithm.algorithm_name}
          >
            {algorithm.algorithm_name}
          </div>

          <div className="fw-semibold mb-1" style={{ color: '#2D7A63', fontSize: '13px' }}>
            Сжатие: x{Number(algorithm.compression_ratio).toFixed(2)}
          </div>

          <div className="d-flex align-items-center mb-2" style={{ fontSize: '13px', color: '#64748B' }}>
            <span style={{ color: '#EF4444', marginRight: '4px' }}>❤️</span>
            <span>{algorithm.likes_count ?? 0}</span>
          </div>
        </div>

        {algorithm.is_creator === 1 && onDelete && (
          <Button
            variant="danger"
            size="sm"
            className="w-100 fw-semibold shadow-none border-0 mt-1"
            style={{
              backgroundColor: '#EF4444',
              borderRadius: '10px',
              padding: '6px 0',
              fontSize: '13px',
            }}
            onClick={() => onDelete(algorithm.algorithm_id)}
          >
            Удалить
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};