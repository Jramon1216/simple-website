import axios from 'axios';

const api = axios.create({
    baseURL: 'https://simplesitebackend.ddns.net',
});

export default api;