import { useEffect, useState } from 'react';
import apiv2 from './apiv2';

/**
 * Hook to make API calls.
 * @param {string} stub the stub for the api endpoint you want to hit.
 * @param {String} method the HTTP method you wish to use (GET, POST, PUT...).
 * @param {AxiosInstance} api the axios api you wish to use.
 * @returns {object} values for loading, data, and error.
 */
export default function useFetch(stub, { method, api } = { method: 'GET', api: apiv2 }) {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        api[method.toLowerCase()](stub).then((res) => {
            setData(res.data);
        }).catch((err) => {
            setError(err);
        }).finally(() => {
            setLoading(false);
        });
    }, [stub, method, api]);

    return { loading, data, error };
}
