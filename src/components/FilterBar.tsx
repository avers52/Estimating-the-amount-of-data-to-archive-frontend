import React, { useState } from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';

export interface FilterBarProps {
  initialRatio: number;
  onFilterChange: (ratio: number) => void;
  loading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({ initialRatio, onFilterChange, loading = false }) => {
  const [ratio, setLocalRatio] = useState<number>(initialRatio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onFilterChange(Number(ratio));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3 w-100">
      <style>{`
        .custom-teal-range::-webkit-slider-thumb {
          background-color: #2ec4b6 !important;
        }
        .custom-teal-range::-moz-range-thumb {
          background-color: #2ec4b6 !important;
        }
        .custom-teal-range:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 1px #fff, 0 0 0 0.25rem rgba(46, 196, 182, 0.25) !important;
        }
      `}</style>

      <div className="bg-white p-3 rounded-4 shadow-sm border border-light">
        <Row className="align-items-center g-2">
          <Col xs={12} sm={4}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              Мин. сжатие: <span style={{ color: '#2ec4b6', fontWeight: 700 }}>{Number(ratio).toFixed(1)}x</span>
            </span>
          </Col>
          <Col xs={8} sm={5}>
            <Form.Range
              min={1.0}
              max={5.0}
              step={0.1}
              value={ratio}
              disabled={loading}
              onChange={(e) => setLocalRatio(parseFloat(e.target.value))}
              className="custom-teal-range"
              style={{ accentColor: '#2ec4b6' }}
            />
          </Col>
          <Col xs={4} sm={3} className="text-end">
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="w-100 rounded-pill fw-bold text-white border-0 shadow-none d-flex justify-content-center align-items-center"
              style={{ backgroundColor: '#2ec4b6', fontSize: '12.5px', height: '31px' }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Найти'}
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};