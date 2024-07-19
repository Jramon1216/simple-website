import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ec2-3-142-240-212.us-east-2.compute.amazonaws.com:80',
});

export default api;