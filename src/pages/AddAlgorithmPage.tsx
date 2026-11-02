import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { CompressionAlgorithmsService } from '../api/client';

interface AddAlgorithmPageProps {
  onPublished: () => void;
}

export const AddAlgorithmPage: React.FC<AddAlgorithmPageProps> = ({ onPublished }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<number | null>(null);

  // Шаг 1: Название, превью и видео
  const [algorithmName, setAlgorithmName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Шаг 2: Характеристики для публикации
  const [description, setDescription] = useState('');
  const [ratio, setRatio] = useState<number>(2.5);
  const [speed, setSpeed] = useState<number>(300);

  useEffect(() => {
    const checkDraft = async () => {
      try {
        const res: any = await CompressionAlgorithmsService.compressionAlgorithmsControllerGetDraft();
        if (res && res.algorithm_id) {
          setDraftId(res.algorithm_id);
          setAlgorithmName(res.algorithm_name || '');
        }
      } catch {
        // Нет черновика
      }
    };
    checkDraft();
  }, []);

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res: any = await CompressionAlgorithmsService.compressionAlgorithmsControllerCreateService({
        algorithm_name: algorithmName,
        image: imageFile as any,
        video: videoFile as any,
      });
      setDraftId(res.algorithm_id);
    } catch (err: any) {
      setError(err?.body?.message || err?.message || 'Ошибка создания черновика');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftId) return;
    setLoading(true);
    setError(null);

    try {
      await CompressionAlgorithmsService.compressionAlgorithmsControllerPublishService(draftId, {
        algorithm_description: description,
        compression_ratio: Number(ratio),
        compression_speed_mbps: Number(speed),
      });
      onPublished();
    } catch (err: any) {
      setError(err?.body?.message || err?.message || 'Ошибка публикации');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDraft = () => {
    setDraftId(null);
    setAlgorithmName('');
    setImageFile(null);
    setVideoFile(null);
  };

  return (
    <div className="py-4" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h2 className="mb-4">Добавление алгоритма сжатия</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {!draftId ? (
        <Card className="shadow-sm">
          <Card.Header as="h5">Шаг 1. Название и медиафайлы</Card.Header>
          <Card.Body>
            <Form onSubmit={handleCreateDraft}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Название алгоритма</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Например: Brotli-Stream"
                  value={algorithmName}
                  onChange={(e) => setAlgorithmName(e.target.value)}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Фото / Превью графика</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e: any) => setImageFile(e.target.files[0] || null)}
                    disabled={loading}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Демонстрационное видео</Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/*"
                    onChange={(e: any) => setVideoFile(e.target.files[0] || null)}
                    disabled={loading}
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Далее ➔'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
            <span>Шаг 2. Публикация характеристик (Черновик #{draftId}: {algorithmName})</span>
            <Button variant="outline-secondary" size="sm" onClick={handleResetDraft} disabled={loading}>
              Начать сначала
            </Button>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handlePublish}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Описание алгоритма</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Опишите принцип компрессии и целевые сценарии..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={loading}
                />
              </Form.Group>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Степень сжатия (Ratio)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={ratio}
                    onChange={(e) => setRatio(parseFloat(e.target.value))}
                    required
                    disabled={loading}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label className="fw-semibold">Скорость работы (МБ/с)</Form.Label>
                  <Form.Control
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                    required
                    disabled={loading}
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-end">
                <Button variant="success" type="submit" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Опубликовать алгоритм'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};