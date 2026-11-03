import React from 'react';
import { Nav } from 'react-bootstrap';

export type PageType = 'feed' | 'catalog';

interface NavigationBarProps {
  currentPage: PageType;
  onPageSelect: (page: PageType) => void;
  darkTheme?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentPage,
  onPageSelect,
  darkTheme = false,
}) => {
  return (
    <div
      className="d-flex justify-content-around align-items-center w-100 py-2"
      style={{
        backgroundColor: darkTheme ? 'rgba(15, 23, 42, 0.9)' : '#ffffff',
        backdropFilter: 'blur(10px)',
        borderTop: darkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        zIndex: 25,
      }}
    >
      {/* 1. Лента */}
      <Nav.Link
        onClick={() => onPageSelect('feed')}
        className="text-center py-0 px-2"
        style={{
          fontSize: '11.5px',
          cursor: 'pointer',
          color: currentPage === 'feed' ? '#2ec4b6' : darkTheme ? '#94a3b8' : '#64748b',
          fontWeight: currentPage === 'feed' ? 700 : 500,
        }}
      >
        <div style={{ fontSize: '15px', lineHeight: 1, marginBottom: '2px' }}>🎬</div>
        <span>Лента</span>
      </Nav.Link>

      {/* 2. Плитка */}
      <Nav.Link
        onClick={() => onPageSelect('catalog')}
        className="text-center py-0 px-2"
        style={{
          fontSize: '11.5px',
          cursor: 'pointer',
          color: currentPage === 'catalog' ? '#2ec4b6' : darkTheme ? '#94a3b8' : '#64748b',
          fontWeight: currentPage === 'catalog' ? 700 : 500,
        }}
      >
        <div style={{ fontSize: '15px', lineHeight: 1, marginBottom: '2px' }}>🗂️</div>
        <span>Плитка</span>
      </Nav.Link>

      {/* 3. Добавление */}
      <Nav.Link
        disabled
        className="text-center py-0 px-2"
        style={{
          fontSize: '11.5px',
          cursor: 'not-allowed',
          opacity: 0.35,
          color: darkTheme ? '#94a3b8' : '#64748b',
        }}
      >
        <div style={{ fontSize: '15px', lineHeight: 1, marginBottom: '2px' }}>➕</div>
        <span>Добавление</span>
      </Nav.Link>

      {/* 4. Войти */}
      <Nav.Link
        disabled
        className="text-center py-0 px-2"
        style={{
          fontSize: '11.5px',
          cursor: 'not-allowed',
          opacity: 0.35,
          color: darkTheme ? '#94a3b8' : '#64748b',
        }}
      >
        <div style={{ fontSize: '15px', lineHeight: 1, marginBottom: '2px' }}>👤</div>
        <span>Войти</span>
      </Nav.Link>
    </div>
  );
};