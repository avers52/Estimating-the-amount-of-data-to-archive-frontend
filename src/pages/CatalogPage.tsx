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
    <div className="d-flex justify-content-center align-items-center py-2">
      <div
        className="position-relative bg-white rounded-4 shadow-lg overflow-hidden d-flex flex-column justify-content-between"
        style={{ width: '390px', height: '690px' }}
      >
        {/* Прокручиваемый контент каталога */}
        <div className="p-3 flex-grow-1" style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
          <div className="mb-3">
            <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '18px', marginBottom: '2px' }}>
              Каталог алгоритмов сжатия
            </h4>
            <p className="text-muted" style={{ fontSize: '11.5px', margin: 0 }}>
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
            <Row xs={2} className="g-2 pb-2">
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
    </div>
  );
};