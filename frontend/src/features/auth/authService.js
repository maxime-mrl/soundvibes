import axios from "axios";

const API_URL = `http://${window.location.hostname}:80/api/users`;
export async function post(endpoint, userData) {
    const resp = await axios.post(API_URL + endpoint, userData);
    if (resp.data && resp.data.error) throw new Error(resp.data.error);
    if (resp.data) localStorage.setItem("user", JSON.stringify(resp.data));
    return resp.data;
}

export async function logout() { localStorage.removeItem('user') }
