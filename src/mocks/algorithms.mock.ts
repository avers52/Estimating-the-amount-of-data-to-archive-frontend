import { Algorithm } from '../types/algorithm';

export const MOCK_ALGORITHMS: Algorithm[] = [
  {
    algorithm_id: 1,
    algorithm_name: 'Zstandard (zstd)',
    algorithm_description: 'Быстрый алгоритм сжатия без потерь от Meta, обеспечивающий высокие коэффициенты компрессии.',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    compression_ratio: 3.2,
    compression_speed_mbps: 450,
    likes_count: 12,
    is_liked: 0,
  },
  {
    algorithm_id: 2,
    algorithm_name: 'Brotli High-Density',
    algorithm_description: 'Алгоритм сжатия данных общего назначения от Google для максимальной плотности веб-контента.',
    image_url: null, // Фолбэк: подставится локальное изображение по умолчанию
    video_url: null, // Фолбэк: подставится локальное видео по умолчанию
    compression_ratio: 4.8,
    compression_speed_mbps: 180,
    likes_count: 24,
    is_liked: 1,
  },
  {
    algorithm_id: 3,
    algorithm_name: 'LZ4 Ultra-Fast',
    algorithm_description: 'Алгоритм без потерь с экстремальной скоростью декомпрессии свыше 4 ГБ/с на процессорное ядро.',
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    compression_ratio: 2.1,
    compression_speed_mbps: 780,
    likes_count: 5,
    is_liked: 0,
  },
  {
    algorithm_id: 4,
    algorithm_name: 'Deflate Standard',
    algorithm_description: 'Классическая комбинация алгоритма LZ77 и кодирования Хаффмана, используемая в ZIP и GZIP.',
    image_url: null, // Фолбэк
    video_url: null, // Фолбэк
    compression_ratio: 2.7,
    compression_speed_mbps: 220,
    likes_count: 8,
    is_liked: 0,
  },
];