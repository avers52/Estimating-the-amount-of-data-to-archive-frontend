import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

interface FilterBarProps {
  initialRatio: number;
  onSearch: (value: number) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ initialRatio, onSearch }) => {
  const [tempRatio, setTempRatio] = useState<number>(initialRatio);

  const handleApply = () => {
    onSearch(tempRatio);
  };

  return (
    <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border border-light">
      <Row className="align-items-center g-2">
        <Col xs={12} sm={4}>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>
            Мин. сжатие: <span style={{ color: '#0096c7' }}>{tempRatio.toFixed(1)}x</span>
          </span>
        </Col>
        <Col xs={8} sm={5}>
          <Form.Range
            min={1.0}
            max={5.0}
            step={0.1}
            value={tempRatio}
            onChange={(e) => setTempRatio(parseFloat(e.target.value))}
            style={{ accentColor: '#00b4d8' }}
          />
        </Col>
        <Col xs={4} sm={3} className="text-end">
          <Button
            size="sm"
            className="w-100 rounded-pill fw-bold text-white"
            style={{ backgroundColor: '#00b4d8', border: 'none' }}
            onClick={handleApply}
          >
            Найти
          </Button>
        </Col>
      </Row>
    </div>
  );
};