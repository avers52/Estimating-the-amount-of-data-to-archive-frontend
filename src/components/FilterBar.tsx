import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

export interface FilterBarProps {
  initialRatio: number;
  onFilterChange: (ratio: number) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ initialRatio, onFilterChange }) => {
  const [ratio, setLocalRatio] = useState<number>(initialRatio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(Number(ratio));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {/* Стили для принудительной перекраски ползунка Bootstrap */}
      <style>{`
        .custom-range::-webkit-slider-thumb {
          background-color: #2D7A63 !important;
        }
        .custom-range::-moz-range-thumb {
          background-color: #2D7A63 !important;
        }
        .custom-range:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 1px #fff, 0 0 0 0.25rem rgba(45, 122, 99, 0.25) !important;
        }
      `}</style>

      <div
        className="p-3 bg-white shadow-sm"
        style={{
          borderRadius: '16px',
          border: '1px solid #ECEFF1',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
              Сжатие от:
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
              x{Number(ratio).toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            className="form-range custom-range"
            min={1.0}
            max={10.0}
            step={0.1}
            value={ratio}
            onChange={(e) => setLocalRatio(parseFloat(e.target.value))}
            style={{ accentColor: '#2D7A63', height: '6px' }}
          />
        </div>

        <Button
          type="submit"
          className="fw-bold px-4 py-2 shadow-none border-0"
          style={{
            backgroundColor: '#2D7A63',
            borderRadius: '10px',
            fontSize: '13px',
            whiteSpace: 'nowrap',
          }}
        >
          Найти
        </Button>
      </div>
    </form>
  );
};