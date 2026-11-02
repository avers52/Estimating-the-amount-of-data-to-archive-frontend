import { OpenAPI } from './generated';

OpenAPI.BASE = '';
OpenAPI.WITH_CREDENTIALS = true;

export * from './generated';

// Импортируйте конкретные сгенерированные сервисы из папки generated
// и сделайте их удобный алиас для использования в компонентах:
import * as Generated from './generated';

// Автоматический поиск нужных сервисов среди экспортов:
const allExports = Generated as Record<string, any>;

// Ищем сервис алгоритмов и сервис пользователей
const AlgoServiceClass =
  allExports['CompressionAlgorithmsService'] ||
  Object.values(allExports).find((item) => item?.compressionAlgorithmsControllerGetCatalog) ||
  Object.values(allExports)[0];

const UserServiceClass =
  allExports['UsersService'] ||
  Object.values(allExports).find((item) => item?.usersControllerLogin) ||
  Object.values(allExports)[1];

export const CompressionAlgorithmsService = AlgoServiceClass;
export const UsersService = UserServiceClass;