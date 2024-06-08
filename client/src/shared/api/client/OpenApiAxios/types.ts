/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios';
import { ConditionalPick } from 'type-fest';

export type MethodType = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options';
export type FieldType = 'parameters' | 'requestBody' | 'responses';
type MediaType = `${string}/${string}`;
type UnionType<T> = T[keyof T];

/** 2XX statuses */
type OkStatus = 200 | 201 | 202 | 203 | 204 | 206 | 207 | '2XX';
// prettier-ignore
/** 4XX and 5XX statuses */
export type ErrorStatus = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511 | '5XX' | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 429 | 431 | 444 | 450 | 451 | 497 | 498 | 499 | '4XX' | 'default';

export interface IOpenApiAxiosOptions {
    validStatus: ValidStatusType;
}

export type SchemaType = {
    [route in keyof object]: {
        [method in MethodType]?: {
            parameters: {
                query?: object;
                path?: object;
            };
            requestBody?: {
                content: {
                    [content in MediaType]: unknown;
                };
            };
            responses?: {
                [code: number]: {
                    content: {
                        [content in MediaType]: unknown;
                    };
                };
            };
        };
    };
};

/**
 * @description Выборка всех параметров
 */
type ParametersPathType<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = CurrentFieldType<Schema, Method, Route, Field> extends Partial<Record<'path', object>>
    ? CurrentFieldType<Schema, Method, Route, Field>['path']
    : never;

/**
 * @description Выборка всех query
 */
type ParametersQueryType<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = CurrentFieldType<Schema, Method, Route, Field> extends Partial<Record<'query', object>>
    ? CurrentFieldType<Schema, Method, Route, Field>['query']
    : never;

/**
 * @description Опции с параметрами и тд
 */
export type OptionsType<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
> = {
    params?: ParametersPathType<Schema, Method, Route, 'parameters'>;
    query?: ParametersQueryType<Schema, Method, Route, 'parameters'>;
    axios?: AxiosRequestConfig;
    responseType?: ResponseType;
    validStatus?: ValidStatusType;
};

export type ValidStatusType = 'all' | 'axios';

/**
 * @description Выборка всех маршрутов в интерфейсе схемы openapi
 */
export type RoutesType<Schema extends SchemaType, Method extends MethodType> = keyof ConditionalPick<
    Schema,
    Partial<Record<Method, unknown>>
>;

/**
 * @description Проверяет наличия внутреннего поля. Если есть, то берет его
 */
export type CurrentFieldType<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = Method extends keyof Schema[Route]
    ? Required<Schema[Route]>[Method] extends Partial<Record<Field, unknown>>
    ? Required<Required<Schema[Route]>[Method]>[Field]
    : never
    : never;

/**
 * @description Берет поле content из body
 */
type BodyDataContentType<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = CurrentFieldType<Schema, Method, Route, Field> extends Partial<Record<'content', unknown>>
    ? CurrentFieldType<Schema, Method, Route, Field>['content']
    : never;

/**
 * @description Берет поле multipart/form-data из body
 */
type FormDataType<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = BodyDataContentType<Schema, Method, Route, Field> extends Partial<Record<'multipart/form-data', unknown>>
    ? BodyDataContentType<Schema, Method, Route, Field>['multipart/form-data']
    : never;

/**
 * @description Берет поле application/json из body
 */
type JsonDataType<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = BodyDataContentType<Schema, Method, Route, Field> extends Partial<Record<'application/json', unknown>>
    ? BodyDataContentType<Schema, Method, Route, Field>['application/json']
    : never;

/**
 * @description Берет тело запроса
 */
export type BodyType<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = FormDataType<Schema, Method, Route, Field> | JsonDataType<Schema, Method, Route, Field>;

/** Получение response */

type FilterKeys<Obj, Matchers> = {
    [K in keyof Obj]: K extends Matchers ? Obj[K] : never;
}[keyof Obj];

type ResponseContent<T> = T extends { content: any } ? T['content'] : unknown;

type SuccessResponse<T> = ResponseContent<FilterKeys<T, OkStatus>>;
type ErrorResponse<T> = ResponseContent<FilterKeys<T, ErrorStatus>>;

type SuccessData<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = FilterKeys<SuccessResponse<CurrentFieldType<Schema, Method, Route, Field>>, MediaType>;

type ErrorData<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = FilterKeys<ErrorResponse<CurrentFieldType<Schema, Method, Route, Field>>, MediaType>;

type FlattenResponse<
    Type,
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = {
        [Key in keyof Type]: Key extends OkStatus
        ? SuccessData<Schema, Method, Route, Field>
        : Key extends ErrorStatus
        ? ErrorData<Schema, Method, Route, Field>
        : never;
    };

/**
 * @example
 * {
 *  200: data,
 *  400: data
 * }
 */
export type StatusCodeData<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = FlattenResponse<CurrentFieldType<Schema, Method, Route, Field>, Schema, Method, Route, Field>;

export type AllResponseResult<T> = {
    [Key in keyof T]: {
        status: Key;
        data: Key extends OkStatus ? T[Key] : never;
        error: Key extends ErrorStatus ? T[Key] : never;
        response: AxiosResponse<T>;
    };
};

export type ResponseDataType<
    Schema extends SchemaType,
    Method extends MethodType,
    Route extends RoutesType<Schema, Method>,
    Field extends FieldType,
> = UnionType<AllResponseResult<StatusCodeData<Schema, Method, Route, Field>>>;

/**
 * @publicApi
 */
export enum HttpStatus {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    EARLYHINTS = 103,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    MISDIRECTED = 421,
    UNPROCESSABLE_ENTITY = 422,
    FAILED_DEPENDENCY = 424,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505
}