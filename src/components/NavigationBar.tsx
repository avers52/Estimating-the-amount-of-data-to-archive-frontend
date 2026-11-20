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

  const tabStyle = (active: boolean, disabled = false): React.CSSProperties => ({
    flex: '1 1 0',
    minWidth: 0,
    fontSize: '10.5px',
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : loading ? 'wait' : 'pointer',
    opacity: disabled ? 0.35 : 1,
    color: active ? '#2ec4b6' : darkTheme ? '#94a3b8' : '#64748b',
    fontWeight: active ? 700 : 500,
  });

  return (
    <div
      className="d-flex justify-content-between align-items-center w-100 py-2 px-1"
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
        className="text-center py-0 px-1"
        style={tabStyle(currentPage === 'feed')}
      >
        <div style={{ fontSize: '15px', lineHeight: 1.1, marginBottom: '2px' }}>🎬</div>
        <span>Лента</span>
      </Nav.Link>

      {/* 2. Плитка */}
      <Nav.Link
        onClick={() => !loading && onPageChange('catalog')}
        className="text-center py-0 px-1"
        style={tabStyle(currentPage === 'catalog')}
      >
        <div style={{ fontSize: '15px', lineHeight: 1.1, marginBottom: '2px' }}>🗂️</div>
        <span>Плитка</span>
      </Nav.Link>

      {/* 3. Добавление */}
      <Nav.Link
        onClick={() => !loading && isAuthenticated && onPageChange('add')}
        className="text-center py-0 px-1"
        style={tabStyle(currentPage === 'add', !isAuthenticated)}
      >
        <div style={{ fontSize: '15px', lineHeight: 1.1, marginBottom: '2px' }}>➕</div>
        <span>Добавление</span>
      </Nav.Link>

      {/* 4. Вход / Выход */}
      {isAuthenticated ? (
        <Nav.Link
          onClick={() => !loading && handleLogout()}
          className="text-center py-0 px-1"
          title={`Вошли как: ${loginName}`}
          style={{
            ...tabStyle(false),
            color: darkTheme ? '#ef4444' : '#dc2626',
            fontWeight: 700,
          }}
        >
          <div style={{ fontSize: '15px', lineHeight: 1.1, marginBottom: '2px' }}>🚪</div>
          <span>Выход</span>
        </Nav.Link>
      ) : (
        <Nav.Link
          onClick={() => !loading && onPageChange('auth')}
          className="text-center py-0 px-1"
          style={tabStyle(currentPage === 'auth')}
        >
          <div style={{ fontSize: '15px', lineHeight: 1.1, marginBottom: '2px' }}>👤</div>
          <span>Войти</span>
        </Nav.Link>
      )}
    </div>
  );
};