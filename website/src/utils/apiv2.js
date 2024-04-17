import axios from 'axios';

const URL = window.location.origin;

let apiv2;

if (localStorage.getItem('token')) {
    apiv2 = axios.create({
        baseURL: `${URL}/api/v2`,
        headers: {'Authorization': localStorage.getItem('token')}
    });
} else {
    apiv2 = axios.create({
        baseURL: `${URL}/api/v2`,
    });
}

apiv2.interceptors.response.use(undefined, (err) => {
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

export default apiv2;