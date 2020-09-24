import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api-formula-1.p.rapidapi.com/',
});

export default api;