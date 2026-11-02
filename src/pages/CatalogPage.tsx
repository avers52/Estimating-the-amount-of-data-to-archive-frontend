import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAlgorithmsThunk, deleteAlgorithmThunk } from '../store/slices/algoSlice';
import { setMinRatio } from '../store/slices/filterSlice';
import { AlgorithmCard } from '../components/AlgorithmCard';
import { FilterBar } from '../components/FilterBar';

interface CatalogPageProps {
  onSelectAlgorithm?: (id: number) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onSelectAlgorithm }) => {
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
    <Container className="py-3" style={{ maxWidth: '900px' }}>
      {/* Заголовок */}
      <div className="mb-3">
        <h4 className="fw-bolder mb-0 text-dark">Каталог алгоритмов</h4>
        <div className="small text-secondary fw-semibold">Выбор алгоритма архивации</div>
      </div>

      {/* Фильтр */}
      <FilterBar initialRatio={minRatio} onFilterChange={handleFilterChange} />

      {/* Сетка строго в 2 столбца */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: '#2D7A63' }} />
        </div>
      ) : (
        <Row xs={2} className="g-3 pb-5">
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
    </Container>
  );
};