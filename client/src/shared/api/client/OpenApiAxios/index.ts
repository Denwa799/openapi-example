import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { Opaque } from 'type-fest';
import {
    BodyType,
    OptionsType,
    RoutesType,
    SchemaType,
    ResponseDataType,
    StatusCodeData,
    MethodType,
    ValidStatusType,
    IOpenApiAxiosOptions,
} from './types';
import { interpolateParams } from './interpolate-params';

export class OpenApiAxios<Schema extends SchemaType> {
    private axios: AxiosInstance;
    private validStatus: ValidStatusType;

    constructor(
        axios: AxiosInstance,
        options: IOpenApiAxiosOptions = {
            validStatus: 'all',
        },
    ) {
        this.axios = axios;
        this.validStatus = options.validStatus;
    }

    public async get<Route extends RoutesType<Schema, 'get'>>(
        path: Route,
        options?: OptionsType<Schema, 'get', Route>,
    ): Promise<ResponseDataType<Schema, 'get', Route, 'responses'>> {
        const { urlString, newOptions } = this.prepareOptions<'get', Route>(path, options);

        return this.axios
            .get(urlString, {
                params: newOptions?.query,
                responseType: newOptions?.responseType,
                ...newOptions?.axios,
            })
            .then((response) => {
                return this.prepareResult<'get', Route>(response);
            })
            .catch((error) => {
                if (newOptions?.validStatus === 'all' && axios.isAxiosError(Error)) {
                    return this.prepareResult<'get', Route>(null, error);
                } else throw error;
            });
    }

    public async post<
        Route extends RoutesType<Schema, 'post'>,
        Body extends BodyType<Schema, 'post', Route, 'requestBody'> | undefined,
    >(
        path: Route,
        body?: Body,
        options?: OptionsType<Schema, 'post', Route>,
    ): Promise<ResponseDataType<Schema, 'post', Route, 'responses'>> {
        const { urlString, newOptions } = this.prepareOptions<'post', Route>(path, options);

        return this.axios
            .post(urlString, body, {
                params: newOptions?.query,
                responseType: newOptions?.responseType,
                ...newOptions?.axios,
            })
            .then((response) => {
                return this.prepareResult<'post', Route>(response);
            })
            .catch((error) => {
                if (newOptions?.validStatus === 'all' && axios.isAxiosError(Error)) {
                    return this.prepareResult<'post', Route>(null, error);
                } else throw error;
            });
    }

    public async put<Route extends RoutesType<Schema, 'put'>, Body extends BodyType<Schema, 'put', Route, 'requestBody'>>(
        path: Route,
        body?: Body,
        options?: OptionsType<Schema, 'put', Route>,
    ): Promise<ResponseDataType<Schema, 'put', Route, 'responses'>> {
        const { urlString, newOptions } = this.prepareOptions<'put', Route>(path, options);

        return this.axios
            .put(urlString, body, {
                params: newOptions?.query,
                responseType: newOptions?.responseType,
                ...newOptions?.axios,
            })
            .then((response) => {
                return this.prepareResult<'put', Route>(response);
            })
            .catch((error) => {
                if (newOptions?.validStatus === 'all' && axios.isAxiosError(Error)) {
                    return this.prepareResult<'put', Route>(null, error);
                } else throw error;
            });
    }

    public async patch<
        Route extends RoutesType<Schema, 'patch'>,
        Body extends BodyType<Schema, 'patch', Route, 'requestBody'>,
    >(
        path: Route,
        body?: Body,
        options?: OptionsType<Schema, 'patch', Route>,
    ): Promise<ResponseDataType<Schema, 'patch', Route, 'responses'>> {
        const { urlString, newOptions } = this.prepareOptions<'patch', Route>(path, options);

        return this.axios
            .patch(urlString, body, {
                params: newOptions?.query,
                responseType: newOptions?.responseType,
                ...newOptions?.axios,
            })
            .then((response) => {
                return this.prepareResult<'patch', Route>(response);
            })
            .catch((error) => {
                if (newOptions?.validStatus === 'all' && axios.isAxiosError(Error)) {
                    return this.prepareResult<'patch', Route>(null, error);
                } else throw error;
            });
    }

    public async delete<Route extends RoutesType<Schema, 'delete'>>(
        path: Route,
        options?: OptionsType<Schema, 'delete', Route>,
    ): Promise<ResponseDataType<Schema, 'delete', Route, 'responses'>> {
        const { urlString, newOptions } = this.prepareOptions<'delete', Route>(path, options);

        return this.axios
            .delete(urlString, {
                params: newOptions?.query,
                responseType: newOptions?.responseType,
                ...newOptions?.axios,
            })
            .then((response) => {
                return this.prepareResult<'delete', Route>(response);
            })
            .catch((error) => {
                if (newOptions?.validStatus === 'all' && axios.isAxiosError(Error)) {
                    return this.prepareResult<'delete', Route>(null, error);
                } else throw error;
            });
    }

    public async head<Route extends RoutesType<Schema, 'head'>>(
        path: Route,
        options?: OptionsType<Schema, 'head', Route>,
    ): Promise<ResponseDataType<Schema, 'head', Route, 'responses'>> {
        const { urlString, newOptions } = this.prepareOptions<'head', Route>(path, options);

        return await this.axios
            .head(urlString, {
                params: newOptions?.query,
                responseType: newOptions?.responseType,
                ...newOptions?.axios,
            })
            .then((response) => {
                return this.prepareResult<'head', Route>(response);
            })
            .catch((error) => {
                if (newOptions?.validStatus === 'all' && axios.isAxiosError(Error)) {
                    return this.prepareResult<'head', Route>(null, error);
                } else throw error;
            });
    }

    public async options<Route extends RoutesType<Schema, 'options'>>(
        path: Route,
        options?: OptionsType<Schema, 'options', Route>,
    ): Promise<ResponseDataType<Schema, 'options', Route, 'responses'>> {
        const { urlString, newOptions } = this.prepareOptions<'options', Route>(path, options);

        return this.axios
            .options(urlString, {
                params: newOptions?.query,
                responseType: newOptions?.responseType,
                ...newOptions?.axios,
            })
            .then((response) => {
                return this.prepareResult<'options', Route>(response);
            })
            .catch((error) => {
                if (newOptions?.validStatus === 'all' && axios.isAxiosError(Error)) {
                    return this.prepareResult<'options', Route>(null, error);
                } else throw error;
            });
    }

    public async getUri<Method extends MethodType, Route extends RoutesType<Schema, Method>>(
        method: Method,
        path: Route,
        options?: Pick<OptionsType<Schema, Method, Route>, 'params' | 'query' | 'axios'>,
    ) {
        const { urlString } = this.prepareOptions<Method, Route>(path, options);
        const uri = this.axios.getUri({
            url: urlString,
            method,
            params: options?.query,
            ...options?.axios,
        }) as Opaque<string, [Schema, Route, Method]>;
        return uri;
    }

    private prepareOptions<Method extends MethodType, Route extends RoutesType<Schema, Method>>(
        path: Route,
        options?: OptionsType<Schema, Method, Route>,
    ) {
        let urlString = path as string;
        const newOptions = { ...options };

        if (newOptions?.params) urlString = interpolateParams(urlString, newOptions.params);
        if (!newOptions.validStatus) newOptions.validStatus = this.validStatus;

        if (newOptions?.validStatus === 'all') {
            newOptions.axios = {
                validateStatus: () => true,
                ...newOptions.axios,
            };
        }

        return {
            urlString,
            newOptions,
        };
    }

    private prepareResult<Method extends MethodType, Route extends RoutesType<Schema, Method>>(
        response: AxiosResponse | null,
        error?: unknown,
    ) {
        const result = {} as ResponseDataType<Schema, Method, Route, 'responses'>;
        if (response) {
            result.status = response.status as keyof StatusCodeData<Schema, Method, Route, 'responses'>;
            result.response = response;
            if (response.status >= 400) {
                result.error = response.data;
            } else result.data = response.data;
        }

        if (error && error instanceof AxiosError) {
            result.status = error.code as keyof StatusCodeData<Schema, Method, Route, 'responses'>;
            if (error.response) result.error = error.response.data;
            if (error.response) result.response = error.response;
        }

        return result;
    }
}