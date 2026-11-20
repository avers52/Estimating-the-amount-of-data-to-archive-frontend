import React, { useEffect } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAlgorithmsThunk, deleteAlgorithmThunk } from '../store/slices/algoSlice';
import { setMinRatio } from '../store/slices/filterSlice';
import { AlgorithmCard } from '../components/AlgorithmCard';
import { FilterBar } from '../components/FilterBar';
import { NavigationBar, PageType } from '../components/NavigationBar';

interface CatalogPageProps {
  onSelectAlgorithm?: (id: number) => void;
  onPageChange: (page: PageType) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onSelectAlgorithm, onPageChange }) => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.algorithms);
  const minRatio = useAppSelector((state) => state.filter.minRatio);

  useEffect(() => {
    dispatch(fetchAlgorithmsThunk(minRatio));
  }, [dispatch, minRatio]);

  const handleFilterChange = (ratio: number) => {
    dispatch(setMinRatio(ratio));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteAlgorithmThunk(id));
  };

  return (
    <div className="app-shell">
      {/* Прокручиваемый контент каталога */}
      <div className="p-3 p-md-4 flex-grow-1" style={{ overflowY: 'auto' }}>
        <div className="mb-3">
          <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '20px', marginBottom: '2px' }}>
            Каталог алгоритмов сжатия
          </h4>
          <p className="text-muted" style={{ fontSize: '12.5px', margin: 0 }}>
            Просмотр и фильтрация характеристик компрессии
          </p>
        </div>

        <FilterBar initialRatio={minRatio} onFilterChange={handleFilterChange} loading={loading} />

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: '#2ec4b6' }} />
            <div className="small text-muted mt-2">Загрузка алгоритмов...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-5 text-muted small">
            Нет алгоритмов со степенью сжатия выше {minRatio}x
          </div>
        ) : (
          /* Адаптивная сетка:
             xs=1 (<576px) -> 1 колонка
             sm=2 (>=576px) -> 2 колонки
             md=3 (>=768px) -> 3 колонки
             lg=4 (>=992px) -> 4 колонки */
          <Row xs={2} md={3} lg={4} className="g-2 g-md-3 pb-3">
            {items.map((algo) => (
              <Col key={algo.algorithm_id}>
                <AlgorithmCard
                  algorithm={algo}
                  onSelect={onSelectAlgorithm}
                  onDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>

      <NavigationBar currentPage="catalog" onPageChange={onPageChange} darkTheme={false} />
    </div>
  );
};