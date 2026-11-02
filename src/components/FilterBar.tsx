import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

interface FilterBarProps {
  minRatio: number;
  onFilterChange: (value: number) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ minRatio, onFilterChange }) => {
  return (
    <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border border-light">
      <Form.Group as={Row} className="align-items-center m-0">
        <Form.Label column xs={12} sm={5} className="p-0 mb-2 mb-sm-0" style={{ fontSize: '13px', fontWeight: 600 }}>
          Мин. коэффициент сжатия: <span style={{ color: '#0096c7' }}>{minRatio}x</span>
        </Form.Label>
        <Col xs={12} sm={7} className="p-0">
          <Form.Range
            min={1.0}
            max={5.0}
            step={0.1}
            value={minRatio}
            onChange={(e) => onFilterChange(parseFloat(e.target.value))}
            style={{ accentColor: '#00b4d8' }}
          />
        </Col>
      </Form.Group>
    </div>
  );
};