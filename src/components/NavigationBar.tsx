import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { resetFilter } from '../store/slices/filterSlice';
import { UsersService } from '../api/client';

export type PageType = 'catalog' | 'feed' | 'add' | 'auth';

interface NavigationBarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ currentPage, onPageChange }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loginName } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await (UsersService as any).usersControllerLogout();
    } catch {
      // Игнорируем сетевые сбои при логауте
    }
    dispatch(logout());
    dispatch(resetFilter());
    onPageChange('catalog');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="bottom" className="border-top border-secondary py-2" style={{ zIndex: 1040 }}>
      <Container className="d-flex justify-content-between align-items-center" style={{ maxWidth: '1100px' }}>
        <Nav className="flex-row gap-3">
          <Nav.Link
            active={currentPage === 'catalog'}
            onClick={() => onPageChange('catalog')}
            className="px-2"
            style={{ fontSize: '14.5px', cursor: 'pointer', fontWeight: currentPage === 'catalog' ? 600 : 400 }}
          >
            Плитка (Каталог)
          </Nav.Link>
          <Nav.Link
            active={currentPage === 'feed'}
            onClick={() => onPageChange('feed')}
            className="px-2"
            style={{ fontSize: '14.5px', cursor: 'pointer', fontWeight: currentPage === 'feed' ? 600 : 400 }}
          >
            Лента
          </Nav.Link>
          <Nav.Link
            active={currentPage === 'add'}
            onClick={() => isAuthenticated && onPageChange('add')}
            disabled={!isAuthenticated}
            className="px-2"
            style={{ fontSize: '14.5px', cursor: isAuthenticated ? 'pointer' : 'not-allowed', fontWeight: currentPage === 'add' ? 600 : 400 }}
          >
            Добавить
          </Nav.Link>
        </Nav>

        <div>
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-light small fw-semibold">{loginName}</span>
              <Button variant="outline-light" size="sm" onClick={handleLogout} style={{ fontSize: '13px' }}>
                Выход
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="px-3 fw-semibold"
              style={{ fontSize: '13px' }}
              onClick={() => onPageChange('auth')}
            >
              Вход
            </Button>
          )}
        </div>
      </Container>
    </Navbar>
  );
};