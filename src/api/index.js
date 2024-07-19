import axios from 'axios';

const api = axios.create({
    baseURL: 'AWS CLOUDFRONT DOMAIN'
});

export default api;