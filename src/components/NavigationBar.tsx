import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';

export type PageType = 'feed' | 'catalog';

interface NavigationBarProps {
  currentPage: PageType;
  onPageSelect: (page: PageType) => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ currentPage, onPageSelect }) => {
  return (
    <Navbar fixed="bottom" bg="white" className="border-top shadow-sm py-2">
      <Container className="d-flex justify-content-around">
        {/* Пункт 1: Активен */}
        <Nav.Link
          onClick={() => onPageSelect('feed')}
          className={`text-center py-1 ${currentPage === 'feed' ? 'fw-bold' : 'text-secondary'}`}
          style={{
            fontSize: '12px',
            cursor: 'pointer',
            color: currentPage === 'feed' ? '#0096c7' : undefined,
          }}
        >
          🎬<br />Лента
        </Nav.Link>

        {/* Пункт 2: Активен */}
        <Nav.Link
          onClick={() => onPageSelect('catalog')}
          className={`text-center py-1 ${currentPage === 'catalog' ? 'fw-bold' : 'text-secondary'}`}
          style={{
            fontSize: '12px',
            cursor: 'pointer',
            color: currentPage === 'catalog' ? '#0096c7' : undefined,
          }}
        >
          🗂️<br />Плитка
        </Nav.Link>

        {/* Пункт 3: Недоступен (Добавление) */}
        <Nav.Link
          disabled
          className="text-center py-1 text-muted"
          style={{ fontSize: '12px', cursor: 'not-allowed', opacity: 0.35 }}
          title="Недоступно для роли Гость"
        >
          ➕<br />Добавление
        </Nav.Link>

        {/* Пункт 4: Недоступен (Войти - крайний справа) */}
        <Nav.Link
          disabled
          className="text-center py-1 text-muted"
          style={{ fontSize: '12px', cursor: 'not-allowed', opacity: 0.35 }}
          title="Недоступно в ЛР5"
        >
          👤<br />Войти
        </Nav.Link>
      </Container>
    </Navbar>
  );
};