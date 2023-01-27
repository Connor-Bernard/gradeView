import axios from 'axios';

export const WEBURL = 'http://localhost:3000';
export const APIURL = 'http://localhost:8000';

const api = axios.create({
    baseURL: `${APIURL}/api/`,
    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
});

api.interceptors.response.use(undefined, (err) => {
    console.log(err);
    try {
        switch (err.response.status) {
            case 401:
                localStorage.setItem('token', '');
                console.log(err);
                window.location.href = `${WEBURL}/login`;
                break;
            default:
                case 404:
                    window.location.href = `${WEBURL}/notfound`;
                break;
        }
    } catch (axiosErr) {
        console.log(axiosErr);
        localStorage.setItem('token', '');
        window.location.href = `${WEBURL}`;
    }
});

export default api