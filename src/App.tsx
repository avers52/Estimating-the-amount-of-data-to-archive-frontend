import { useState } from 'react';
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
      setSelectedAlgoId(undefined);
    }
    setCurrentPage(page);
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-2"
      style={{ backgroundColor: '#f1f5f9' }}
    >
      <main>
        {currentPage === 'catalog' && (
          <CatalogPage
            onSelectAlgorithm={handleSelectAlgorithm}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'feed' && (
          <FeedPage
            targetAlgorithmId={selectedAlgoId}
            onPageChange={handlePageChange}
          />
        )}

        {currentPage === 'add' && (
          <div
            className="position-relative bg-white rounded-4 shadow-lg overflow-hidden d-flex flex-column justify-content-between"
            style={{ width: '390px', height: '690px' }}
          >
            <div className="flex-grow-1 overflow-auto p-3" style={{ scrollbarWidth: 'none' }}>
              <AddAlgorithmPage onPublished={() => handlePageChange('catalog')} />
            </div>
            <NavigationBar currentPage="add" onPageChange={handlePageChange} darkTheme={false} />
          </div>
        )}

        {currentPage === 'auth' && (
          <div
            className="position-relative bg-white rounded-4 shadow-lg overflow-hidden d-flex flex-column justify-content-between"
            style={{ width: '390px', height: '690px' }}
          >
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
              <AuthPage onSuccess={() => handlePageChange('catalog')} />
            </div>
            <NavigationBar currentPage="auth" onPageChange={handlePageChange} darkTheme={false} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;