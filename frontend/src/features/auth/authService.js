import axios from "axios";

const API_URL = "http://localhost:80/api/users";
export async function register(userData) {
    const resp = await axios.post(API_URL + "/register", userData);
    if (resp.data && resp.data.error) throw new Error(resp.data.error);
    if (resp.data) localStorage.setItem("user", JSON.stringify(resp.data));
    return resp.data;
}

export async function login(userData) {
    const resp = await axios.post(API_URL + "/login", userData);
    if (resp.data) localStorage.setItem("user", JSON.stringify(resp.data));
    return resp.data;
}

export async function logout() {
    localStorage.removeItem('user');
}
