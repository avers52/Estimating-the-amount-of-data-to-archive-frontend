import React, { useState } from 'react';
import { CatalogPage } from './pages/CatalogPage';
import { FeedPage } from './pages/FeedPage';
import { NavigationBar, PageType } from './components/NavigationBar';
import 'bootstrap/dist/css/bootstrap.min.css';

export const App: React.FC = () => {
  // Хук useState: переключение между двумя разрешенными страницами
  const [currentPage, setCurrentPage] = useState<PageType>('catalog');

  return (
    <div className="min-vh-100" style={{ paddingBottom: '75px' }}>
      {currentPage === 'catalog' && <CatalogPage />}
      {currentPage === 'feed' && <FeedPage />}

      <NavigationBar currentPage={currentPage} onPageSelect={setCurrentPage} />
    </div>
  );
};

export default App;