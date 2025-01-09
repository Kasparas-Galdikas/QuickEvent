import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://www.eventbriteapi.com/v3/',
    headers: {
        'Authorization': `Bearer UHBRQUQE7TUTW6WI5IYC`,// Replace with your private token
    },
});

export default axiosInstance;
