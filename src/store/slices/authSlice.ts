import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
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
        await axios.post(
          '/api/register',
          { login, password },
          { headers: { 'Content-Type': 'application/json' } }
        );
      }
      await axios.post(
        '/api/login',
        { login, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      dispatch(setAuth(login));
      onSuccess();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Ошибка авторизации';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100 px-3">
      <Card className="shadow-sm border-0" style={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <Card.Body className="p-4">
          <Card.Title className="text-center fw-bolder mb-3" style={{ fontSize: '18px', color: '#0f172a' }}>
            {isRegister ? 'Регистрация' : 'Вход в систему'}
          </Card.Title>

          {error && (
            <Alert variant="danger" className="py-2" style={{ fontSize: '12px' }}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label style={{ fontSize: '12px', fontWeight: 600 }}>Логин</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                disabled={loading}
                style={{ fontSize: '13px', borderRadius: '8px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '12px', fontWeight: 600 }}>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                style={{ fontSize: '13px', borderRadius: '8px' }}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 fw-bold border-0 shadow-none mb-2"
              disabled={loading}
              style={{ backgroundColor: '#2ec4b6', borderRadius: '8px', fontSize: '13px', padding: '8px 0' }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : isRegister ? 'Зарегистрироваться' : 'Войти'}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                size="sm"
                className="text-decoration-none p-0"
                style={{ fontSize: '11.5px', color: '#0284c7' }}
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