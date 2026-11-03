import React from 'react';
import { Nav } from 'react-bootstrap';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { resetFilter } from '../store/slices/filterSlice';

export type PageType = 'feed' | 'catalog' | 'add' | 'auth';

interface NavigationBarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  darkTheme?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentPage,
  onPageChange,
  darkTheme = false,
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loginName } = useAppSelector((state) => state.auth);
  const loading = useAppSelector((state) => state.algorithms.loading);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
    } catch {
      // Игнорируем сетевые сбои при выходе
    }
    dispatch(logout());
    dispatch(resetFilter());
    onPageChange('catalog');
  };

  return (
    <div
      className="d-flex justify-content-around align-items-center w-100 py-2"
      style={{
        backgroundColor: darkTheme ? 'rgba(15, 23, 42, 0.95)' : '#ffffff',
        backdropFilter: 'blur(10px)',
        borderTop: darkTheme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
        zIndex: 30,
        pointerEvents: loading ? 'none' : 'auto',
      }}
    >
      {/* 1. Лента */}
      <Nav.Link
        onClick={() => !loading && onPageChange('feed')}
        className="text-center py-0 px-2"
        style={{
          fontSize: '11px',
          cursor: loading ? 'wait' : 'pointer',
          color: currentPage === 'feed' ? '#2ec4b6' : darkTheme ? '#94a3b8' : '#64748b',
          fontWeight: currentPage === 'feed' ? 700 : 500,
        }}
      >
        <div style={{ fontSize: '15px', lineHeight: 1, marginBottom: '2px' }}>🎬</div>
        <span>Лента</span>
      </Nav.Link>

      {/* 2. Плитка */}
      <Nav.Link
        onClick={() => !loading && onPageChange('catalog')}
        className="text-center py-0 px-2"
        style={{
          fontSize: '11px',
          cursor: loading ? 'wait' : 'pointer',
          color: currentPage === 'catalog' ? '#2ec4b6' : darkTheme ? '#94a3b8' : '#64748b',
          fontWeight: currentPage === 'catalog' ? 700 : 500,
        }}
      >
        <div style={{ fontSize: '15px', lineHeight: 1, marginBottom: '2px' }}>🗂️</div>
        <span>Плитка</span>
      </Nav.Link>

      {/* 3. Добавление (доступно только авторизованным) */}
      <Nav.Link
        onClick={() => !loading && isAuthenticated && onPageChange('add')}
        className="text-center py-0 px-2"
        style={{
          fontSize: '11px',
          cursor: isAuthenticated && !loading ? 'pointer' : 'not-allowed',
          opacity: isAuthenticated ? 1 : 0.35,
          color: currentPage === 'add' ? '#2ec4b6' : darkTheme ? '#94a3b8' : '#64748b',
          fontWeight: currentPage === 'add' ? 700 : 500,
        }}
      >
        <div style={{ fontSize: '15px', lineHeight: 1, marginBottom: '2px' }}>➕</div>
        <span>Добавление</span>
      </Nav.Link>

      {/* 4. Переключение Вход / Выход */}
      {isAuthenticated ? (
        <Nav.Link
          onClick={() => !loading && handleLogout()}
          className="text-center py-0 px-2"
          title={`Вошли как: ${loginName}`}
          style={{
            fontSize: '11px',
            cursor: loading ? 'wait' : 'pointer',
            color: darkTheme ? '#ef4444' : '#dc2626',
            fontWeight: 700,
          }}
        >
          <div style={{ fontSize: '15px', lineHeight: 1, marginBottom: '2px' }}>🚪</div>
          <span>Выход</span>
        </Nav.Link>
      ) : (
        <Nav.Link
          onClick={() => !loading && onPageChange('auth')}
          className="text-center py-0 px-2"
          style={{
            fontSize: '11px',
            cursor: loading ? 'wait' : 'pointer',
            color: currentPage === 'auth' ? '#2ec4b6' : darkTheme ? '#94a3b8' : '#64748b',
            fontWeight: currentPage === 'auth' ? 700 : 500,
          }}
        >
          <div style={{ fontSize: '15px', lineHeight: 1, marginBottom: '2px' }}>👤</div>
          <span>Войти</span>
        </Nav.Link>
      )}
    </div>
  );
};