/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthCredentialsDto } from '../models/AuthCredentialsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class Service {
    /**
     * Каталог опубликованных алгоритмов (публичный доступ без авторизации)
     * @param minCompressionRatio
     * @returns any Список опубликованных алгоритмов сжатия
     * @throws ApiError
     */
    public static compressionAlgorithmsControllerGetCatalog(
        minCompressionRatio?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/compression-algorithms',
            query: {
                'min_compression_ratio': minCompressionRatio,
            },
        });
    }
    /**
     * Создание черновика алгоритма (автозаполнение creator_id из сессии)
     * @param formData
     * @returns any Черновик алгоритма создан с привязкой к текущей сессии
     * @throws ApiError
     */
    public static compressionAlgorithmsControllerCreateService(
        formData: {
            algorithm_name: string;
            /**
             * Изображение/график степени сжатия
             */
            image?: Blob;
            /**
             * Демонстрационный видеоролик компрессии
             */
            video?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/compression-algorithms',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Некорректные параметры запроса`,
                401: `Требуется авторизация в системе`,
            },
        });
    }
    /**
     * Лента опубликованных алгоритмов (публичный доступ без авторизации)
     * @param algorithmId
     * @param next
     * @returns any Алгоритм ленты
     * @throws ApiError
     */
    public static compressionAlgorithmsControllerGetFeed(
        algorithmId?: number,
        next?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/compression-algorithms/feed',
            query: {
                'algorithm_id': algorithmId,
                'next': next,
            },
            errors: {
                404: `Алгоритмы не найдены`,
            },
        });
    }
    /**
     * Получение полей текущего черновика (только для авторизованного автора)
     * @returns any
     * @throws ApiError
     */
    public static compressionAlgorithmsControllerGetDraft(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/compression-algorithms/draft',
        });
    }
    /**
     * Публикация алгоритма (только для автора создателя)
     * @param id
     * @param requestBody
     * @returns any Алгоритм успешно опубликован
     * @throws ApiError
     */
    public static compressionAlgorithmsControllerPublishService(
        id: number,
        requestBody: {
            algorithm_description: string;
            compression_ratio: number;
            compression_speed_mbps: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/compression-algorithms/{id}/publish',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Опубликовать можно только объект в статусе draft`,
                401: `Требуется авторизация в системе`,
                403: `Редактировать и публиковать алгоритм может только его создатель`,
            },
        });
    }
    /**
     * Мягкое удаление алгоритма автором (статус deleted)
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static compressionAlgorithmsControllerDeleteService(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/compression-algorithms/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Требуется авторизация в системе`,
                403: `Удалять алгоритм может только его создатель`,
            },
        });
    }
    /**
     * Поставить (1) или снять (0) отметку «Нравится»
     * @param id
     * @param requestBody
     * @returns any Лайк успешно обновлен
     * @throws ApiError
     */
    public static compressionAlgorithmsControllerSetLike(
        id: number,
        requestBody: {
            is_liked: 0 | 1;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/compression-algorithms/{id}/like',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Требуется авторизация в системе`,
            },
        });
    }
    /**
     * Регистрация пользователя по логину и паролю
     * @param requestBody
     * @returns any Пользователь успешно зарегистрирован
     * @throws ApiError
     */
    public static usersControllerRegister(
        requestBody: AuthCredentialsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Пользователь с таким логином уже существует`,
            },
        });
    }
    /**
     * Вход в систему по логину и паролю (установка сессии)
     * @param requestBody
     * @returns any Успешная авторизация, выдана сессионная cookie connect.sid
     * @throws ApiError
     */
    public static usersControllerLogin(
        requestBody: AuthCredentialsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Неверный логин или пароль`,
            },
        });
    }
    /**
     * Выход из системы (уничтожение сессии)
     * @returns any Сессия успешно завершена
     * @throws ApiError
     */
    public static usersControllerLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/logout',
        });
    }
}
