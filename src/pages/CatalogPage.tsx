import React, { useState, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { MOCK_ALGORITHMS } from '../mocks/algorithms.mock';
import { FilterBar } from '../components/FilterBar';
import { AlgorithmCard } from '../components/AlgorithmCard';
import { NavigationBar, PageType } from '../components/NavigationBar';

interface CatalogPageProps {
  onSelectAlgorithm?: (id: number) => void;
  onPageSelect: (page: PageType) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onSelectAlgorithm, onPageSelect }) => {
  const [appliedRatio, setAppliedRatio] = useState<number>(1.0);

  const filteredAlgorithms = useMemo(() => {
    return MOCK_ALGORITHMS.filter((algo) => algo.compression_ratio >= appliedRatio);
  }, [appliedRatio]);

  return (
    <div className="d-flex justify-content-center align-items-center py-2">
      {/* Единый мобильный экран для плитки */}
      <div
        className="position-relative bg-white rounded-4 shadow-lg overflow-hidden d-flex flex-column justify-content-between"
        style={{ width: '390px', height: '690px' }}
      >
        {/* Прокручиваемый список карточек */}
        <div
          className="p-3 flex-grow-1"
          style={{ overflowY: 'auto', scrollbarWidth: 'none' }}
        >
          <div className="mb-3">
            <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', marginBottom: '2px' }}>
              Каталог алгоритмов сжатия
            </h4>
            <p className="text-muted" style={{ fontSize: '11.5px', margin: 0 }}>
              Просмотр и фильтрация характеристик компрессии (Mock-режим)
            </p>
          </div>

          <FilterBar initialRatio={appliedRatio} onSearch={setAppliedRatio} />

          {filteredAlgorithms.length === 0 ? (
            <div className="text-center py-5 text-muted small">
              Нет алгоритмов со степенью сжатия выше {appliedRatio}x
            </div>
          ) : (
            <Row xs={2} className="g-2 pb-2">
              {filteredAlgorithms.map((algo) => (
                <Col key={algo.algorithm_id}>
                  <AlgorithmCard
                    algorithm={algo}
                    onSelect={onSelectAlgorithm}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Встроенная навигация внизу плитки */}
        <NavigationBar currentPage="catalog" onPageSelect={onPageSelect} darkTheme={false} />
      </div>
    </div>
  );
};