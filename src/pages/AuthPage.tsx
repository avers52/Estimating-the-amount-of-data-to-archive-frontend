import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { UsersService } from '../api/client';
import { useAppDispatch } from '../store/hooks';
import { setAuth } from '../store/slices/authSlice';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await UsersService.usersControllerRegister({ login, password });
      }
      await UsersService.usersControllerLogin({ login, password });
      dispatch(setAuth(login));
      onSuccess();
    } catch (err: any) {
      const msg = err?.body?.message || err?.message || 'Ошибка аутентификации';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ width: '100%', maxWidth: '420px' }} className="shadow-sm">
        <Card.Body className="p-4">
          <Card.Title className="text-center mb-4">
            {isRegister ? 'Регистрация' : 'Вход в систему'}
          </Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : isRegister ? 'Зарегистрироваться' : 'Войти'}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                disabled={loading}
              >
                {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};