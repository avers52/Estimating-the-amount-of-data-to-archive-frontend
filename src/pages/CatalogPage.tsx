import React, { useState, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MOCK_ALGORITHMS } from '../mocks/algorithms.mock';
import { FilterBar } from '../components/FilterBar';
import { AlgorithmCard } from '../components/AlgorithmCard';

export const CatalogPage: React.FC = () => {
  // Хук useState: хранение текущего порога фильтрации
  const [minRatio, setMinRatio] = useState<number>(1.0);

  // Хук useMemo: мемоизация отфильтрованного списка мок-алгоритмов
  const filteredAlgorithms = useMemo(() => {
    return MOCK_ALGORITHMS.filter((algo) => algo.compression_ratio >= minRatio);
  }, [minRatio]);

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <div className="mb-3">
        <h4 style={{ fontWeight: 800, color: '#0f172a' }}>Каталог алгоритмов сжатия</h4>
        <p className="text-muted" style={{ fontSize: '13px', margin: 0 }}>
          Просмотр и фильтрация характеристик компрессии данных (Mock-режим)
        </p>
      </div>

      <FilterBar minRatio={minRatio} onFilterChange={setMinRatio} />

      {filteredAlgorithms.length === 0 ? (
        <div className="text-center py-5 text-muted">
          Нет алгоритмов со степенью сжатия выше {minRatio}x
        </div>
      ) : (
        <Row xs={1} sm={2} className="g-3">
          {filteredAlgorithms.map((algo) => (
            <Col key={algo.algorithm_id}>
              <AlgorithmCard algorithm={algo} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};