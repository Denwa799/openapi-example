import { baseAxios } from ".."

export const getText = async () => {
    return baseAxios.get('/text');
}

export const getJson = async () => {
    return baseAxios.get('/json');
}

export const getXml = async () => {
    return baseAxios.get('/xml');
}
