import React, { useState } from 'react';
import { CatalogPage } from './pages/CatalogPage';
import { FeedPage } from './pages/FeedPage';
import { PageType } from './components/NavigationBar';
import 'bootstrap/dist/css/bootstrap.min.css';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('catalog');
  const [selectedAlgoId, setSelectedAlgoId] = useState<number | undefined>(undefined);

  const handleSelectAlgorithm = (id: number) => {
    setSelectedAlgoId(id);
    setCurrentPage('feed');
  };

  const handlePageSelect = (page: PageType) => {
    if (page === 'feed') {
      setSelectedAlgoId(undefined);
    }
    setCurrentPage(page);
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f1f5f9' }}>
      {currentPage === 'catalog' && (
        <CatalogPage
          onSelectAlgorithm={handleSelectAlgorithm}
          onPageSelect={handlePageSelect}
        />
      )}
      {currentPage === 'feed' && (
        <FeedPage
          initialAlgorithmId={selectedAlgoId}
          onPageSelect={handlePageSelect}
        />
      )}
    </div>
  );
};

export default App;