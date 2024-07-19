import axios from 'axios';

const api = axios.create({
    baseURL: 'http://simplesitebackend.ddns.net',
});

export default api;