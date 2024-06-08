import Axios from 'axios';
import { OpenApiAxios } from './OpenApiAxios';
import { paths } from './types';

export const axios = Axios.create({
    baseURL: 'http://localhost:3000',
});


export const baseAxios = new OpenApiAxios<paths>(axios);