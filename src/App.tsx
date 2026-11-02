import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { NavigationBar, PageType } from './components/NavigationBar';
import { CatalogPage } from './pages/CatalogPage';
import { FeedPage } from './pages/FeedPage';
import { AddAlgorithmPage } from './pages/AddAlgorithmPage';
import { AuthPage } from './pages/AuthPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('catalog');
  const [selectedAlgoId, setSelectedAlgoId] = useState<number | undefined>(undefined);

  const handleSelectAlgorithm = (id: number) => {
    setSelectedAlgoId(id);
    setCurrentPage('feed');
  };

  const handlePageChange = (page: PageType) => {
    if (page === 'feed') {
      // Если переходим по кнопке панели, сбрасываем точечный выбор
      setSelectedAlgoId(undefined);
    }
    setCurrentPage(page);
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column" style={{ paddingBottom: '76px' }}>
      {/* Верхняя строка с кнопкой «Домой» справа */}
      <header className="bg-white border-bottom shadow-sm py-2 px-3 sticky-top">
        <Container className="d-flex justify-content-end align-items-center" style={{ maxWidth: '1100px' }}>
          <Button
            variant="outline-dark"
            size="sm"
            className="fw-bold d-flex align-items-center gap-1 shadow-none"
            style={{ borderRadius: '8px', fontSize: '13px' }}
            onClick={() => handlePageChange('catalog')}
          >
            <span>🏠</span>
            <span>Домой</span>
          </Button>
        </Container>
      </header>

      {/* Контент */}
      <main className="flex-grow-1">
        {currentPage === 'catalog' && (
          <CatalogPage onSelectAlgorithm={handleSelectAlgorithm} />
        )}

        {currentPage === 'feed' && (
          <FeedPage targetAlgorithmId={selectedAlgoId} />
        )}

        {currentPage === 'add' && (
          <Container className="py-4" style={{ maxWidth: '780px' }}>
            <AddAlgorithmPage onPublished={() => handlePageChange('catalog')} />
          </Container>
        )}

        {currentPage === 'auth' && (
          <Container className="py-4" style={{ maxWidth: '420px' }}>
            <AuthPage onSuccess={() => handlePageChange('catalog')} />
          </Container>
        )}
      </main>

      {/* Нижняя панель навигации */}
      <NavigationBar currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
}

export default App;