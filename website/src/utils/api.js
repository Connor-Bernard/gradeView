import axios from 'axios';

const URL = window.location.origin;

const api = axios.create({
    baseURL: `${URL}/api/`,
    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
});

api.interceptors.response.use(undefined, (err) => {
    console.log(err);
    try {
        switch (err.response.status) {
            case 401:
                localStorage.setItem('token', '');
                console.log(err);
                window.location.href = `${URL}/login`;
                break;
            default:
                case 404:
                    window.location.href = `${URL}/notfound`;
                break;
        }
    } catch (axiosErr) {
        console.log(axiosErr);
        localStorage.setItem('token', '');
        window.location.href = `${URL}`;
    }
});

export default api