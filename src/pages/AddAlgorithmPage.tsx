import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { CompressionAlgorithmsService } from '../api/client';

interface AddAlgorithmPageProps {
  onPublished: () => void;
}

const DEFAULT_IMAGE_PREVIEW = '/gzip_draft.png';
const DEFAULT_VIDEO_PREVIEW = '/gzip_process.mp4';

export const AddAlgorithmPage: React.FC<AddAlgorithmPageProps> = ({ onPublished }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<number | null>(null);

  // Шаг 1: Видео, фото и название
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>(DEFAULT_VIDEO_PREVIEW);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(DEFAULT_IMAGE_PREVIEW);

  const [algorithmName, setAlgorithmName] = useState('');

  // Шаг 2: Характеристики для публикации
  const [compressionRatio, setCompressionRatio] = useState<string>('2.5');
  const [compressionSpeed, setCompressionSpeed] = useState<string>('300');
  const [description, setDescription] = useState('');

  // Выбор видеофайла
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Выбор изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  // Переход на Шаг 2 (создание черновика)
  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!algorithmName.trim()) {
      setError('Введите название алгоритма перед переходом к следующему шагу');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res: any = await CompressionAlgorithmsService.compressionAlgorithmsControllerCreateService({
        algorithm_name: algorithmName.trim(),
        image: imageFile as any,
        video: videoFile as any,
      });

      if (res && res.algorithm_id) {
        setDraftId(res.algorithm_id);
      }
      setStep(2);
    } catch {
      // Fallback для автономного режима без бэкенда
      setDraftId(Date.now());
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Публикация алгоритма (Шаг 2)
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (draftId) {
        await CompressionAlgorithmsService.compressionAlgorithmsControllerPublishService(draftId, {
          algorithm_description: description,
          compression_ratio: parseFloat(compressionRatio) || 2.0,
          compression_speed_mbps: parseInt(compressionSpeed, 10) || 100,
        });
      }
      onPublished();
    } catch {
      onPublished();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100" style={{ fontSize: '13px' }}>
      {/* Верхний заголовок */}
      <div className="mb-3">
        <h5 className="fw-bold mb-0" style={{ color: '#0f172a' }}>
          Параметры алгоритма
        </h5>
        <div className="text-muted" style={{ fontSize: '11.5px' }}>
          {step === 1 ? 'Шаг 1: Создание черновика' : 'Шаг 2: Публикация алгоритма'}
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="py-2" style={{ fontSize: '12px' }}>
          {error}
        </Alert>
      )}

      {/* ШАГ 1: ВИДЕО, ФОТО, НАЗВАНИЕ */}
      {step === 1 && (
        <Card className="border-0 shadow-sm rounded-4 p-3 mb-2 bg-white">
          <Form onSubmit={handleNextStep}>
            {/* 1. Блок Видео */}
            <div className="mb-3">
              <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '11px' }}>
                Видео
              </span>
              <div
                className="w-100 rounded-3 overflow-hidden bg-black position-relative shadow-sm"
                style={{ height: '95px' }}
              >
                <video
                  src={videoPreviewUrl}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  muted
                  playsInline
                />
              </div>

              <input
                type="file"
                id="videoUpload"
                accept="video/*"
                className="d-none"
                onChange={handleVideoChange}
              />
              <div className="text-center mt-1">
                <label
                  htmlFor="videoUpload"
                  className="text-decoration-underline text-dark fw-semibold"
                  style={{ cursor: 'pointer', fontSize: '11.5px' }}
                >
                  Выбрать файл видео
                </label>
              </div>
            </div>

            {/* 2. Блок Фото карточки */}
            <div className="mb-3">
              <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '11px' }}>
                Фото карточки
              </span>
              <div
                className="w-100 rounded-3 overflow-hidden bg-dark position-relative shadow-sm"
                style={{ height: '95px' }}
              >
                <img
                  src={imagePreviewUrl}
                  alt="Превью карточки"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e: any) => {
                    e.target.src = DEFAULT_IMAGE_PREVIEW;
                  }}
                />
              </div>

              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                className="d-none"
                onChange={handleImageChange}
              />
              <div className="text-center mt-1">
                <label
                  htmlFor="imageUpload"
                  className="text-decoration-underline text-dark fw-semibold"
                  style={{ cursor: 'pointer', fontSize: '11.5px' }}
                >
                  Выбрать файл фото
                </label>
              </div>
            </div>

            {/* 3. Название алгоритма (ДО кнопки далее) */}
            <Form.Group className="mb-3">
              <Form.Label className="text-secondary fw-semibold mb-1" style={{ fontSize: '11px' }}>
                Название алгоритма
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Например: Brotli-Stream"
                value={algorithmName}
                onChange={(e) => setAlgorithmName(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  fontSize: '12.5px',
                  padding: '7px 10px',
                }}
              />
            </Form.Group>

            {/* Кнопка Далее */}
            <Button
              type="submit"
              disabled={loading}
              className="w-100 fw-bold border-0 shadow-none mt-2"
              style={{
                backgroundColor: '#357c64',
                borderRadius: '10px',
                padding: '9px 0',
                fontSize: '13px',
              }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Далее'}
            </Button>
          </Form>
        </Card>
      )}

      {/* ШАГ 2: ВЫБРАННЫЕ МЕДИАФАЙЛЫ + ПАРАМЕТРЫ */}
      {step === 2 && (
        <Form onSubmit={handlePublish}>
          {/* Секция: Выбранные медиафайлы */}
          <Card className="border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
            <span
              className="fw-bold text-uppercase d-block mb-2"
              style={{ fontSize: '10.5px', letterSpacing: '0.5px', color: '#1e293b' }}
            >
              ВЫБРАННЫЕ МЕДИАФАЙЛЫ
            </span>

            {/* Видео превью */}
            <div className="mb-2">
              <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '11px' }}>
                Видео
              </span>
              <div
                className="w-100 rounded-3 overflow-hidden bg-black shadow-sm"
                style={{ height: '70px' }}
              >
                <video
                  src={videoPreviewUrl}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  muted
                  playsInline
                />
              </div>
            </div>

            {/* Фото превью */}
            <div>
              <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '11px' }}>
                Фото карточки
              </span>
              <div
                className="w-100 rounded-3 overflow-hidden bg-dark shadow-sm"
                style={{ height: '70px' }}
              >
                <img
                  src={imagePreviewUrl}
                  alt="Фото карточки"
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </Card>

          {/* Секция: Параметры */}
          <Card className="border-0 shadow-sm rounded-4 p-3 mb-3 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span
                className="fw-bold text-uppercase"
                style={{ fontSize: '10.5px', letterSpacing: '0.5px', color: '#1e293b' }}
              >
                ПАРАМЕТРЫ ({algorithmName})
              </span>
              <Button
                variant="link"
                size="sm"
                className="p-0 text-decoration-none"
                style={{ fontSize: '11px', color: '#64748b' }}
                onClick={() => setStep(1)}
              >
                Изменить медиа
              </Button>
            </div>

            {/* Коэффициент сжатия */}
            <Form.Group className="mb-2">
              <Form.Label className="text-secondary fw-semibold mb-1" style={{ fontSize: '11px' }}>
                Коэффициент сжатия
              </Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={compressionRatio}
                onChange={(e) => setCompressionRatio(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  fontSize: '12.5px',
                  padding: '7px 10px',
                }}
              />
            </Form.Group>

            {/* Скорость сжатия */}
            <Form.Group className="mb-2">
              <Form.Label className="text-secondary fw-semibold mb-1" style={{ fontSize: '11px' }}>
                Скорость сжатия (МБ/с)
              </Form.Label>
              <Form.Control
                type="number"
                value={compressionSpeed}
                onChange={(e) => setCompressionSpeed(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  fontSize: '12.5px',
                  padding: '7px 10px',
                }}
              />
            </Form.Group>

            {/* Описание */}
            <Form.Group className="mb-3">
              <Form.Label className="text-secondary fw-semibold mb-1" style={{ fontSize: '11px' }}>
                Описание
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Опишите принцип компрессии..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  fontSize: '12.5px',
                  padding: '7px 10px',
                }}
              />
            </Form.Group>

            {/* Кнопка Опубликовать */}
            <Button
              type="submit"
              disabled={loading}
              className="w-100 fw-bold border-0 shadow-none"
              style={{
                backgroundColor: '#357c64',
                borderRadius: '10px',
                padding: '9px 0',
                fontSize: '13px',
              }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Опубликовать'}
            </Button>
          </Card>
        </Form>
      )}
    </div>
  );
};