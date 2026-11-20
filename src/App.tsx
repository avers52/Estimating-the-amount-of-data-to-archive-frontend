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
    <div className="app-wrapper">
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
        <div className="app-shell app-shell--narrow">
          <div className="flex-grow-1 overflow-auto p-3 p-md-4">
            <AddAlgorithmPage onPublished={() => handlePageChange('catalog')} />
          </div>
          <NavigationBar currentPage="add" onPageChange={handlePageChange} darkTheme={false} />
        </div>
      )}

      {currentPage === 'auth' && (
        <div className="app-shell app-shell--narrow">
          <div className="flex-grow-1 d-flex align-items-center justify-content-center p-3">
            <AuthPage onSuccess={() => handlePageChange('catalog')} />
          </div>
          <NavigationBar currentPage="auth" onPageChange={handlePageChange} darkTheme={false} />
        </div>
      )}
    </div>
  );
}

export default App;