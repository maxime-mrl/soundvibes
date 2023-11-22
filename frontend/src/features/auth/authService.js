import axios from "axios";

const API_URL = `http://${window.location.hostname}:80/api/users`;
export async function post(endpoint, userData) {
    const resp = await axios.post(API_URL + endpoint, userData);
    if (resp.data && resp.data.error) throw new Error(resp.data.error);
    return resp.data;
}

export async function get(endpoint, token) {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const resp = await axios(API_URL + endpoint, config);
    if (resp.data && resp.data.error) throw new Error(resp.data.error);
    return resp.data;
}

export async function put(endpoint, token, data) {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const resp = await axios.put(API_URL + endpoint, data, config);
    if (resp.data && resp.data.error) throw new Error(resp.data.error);
    return resp.data;
}