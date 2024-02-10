import axios from 'axios';

const URL = window.location.origin;

const api = axios.create({
    baseURL: `${URL}/api/`,
    headers: {'Authorization': localStorage.getItem('token')}
});

api.interceptors.response.use(undefined, (err) => {
    try {
        const errorCode = err.response.status;
        switch (true) {
            case errorCode === 401:
                localStorage.setItem('token', '');
                window.location.href = `${URL}/login`;
                break;
            default:
                return Promise.reject(err);
        }
    } catch (axiosErr) {
        console.log(axiosErr);
        localStorage.setItem('token', '');
        window.location.href = `${URL}/login`;
    }
});

export default api
