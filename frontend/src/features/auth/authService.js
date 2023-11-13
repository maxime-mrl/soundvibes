import axios from "axios";

const API_URL = "http://localhost:80/api/users";
async function register(userData) {
    const resp = await axios.post(API_URL + "/register", userData);
    console.log(resp)
    if (resp.data) localStorage.setItem("user", JSON.stringify(resp.data))
    return resp.data;
}

async function login(userData) {
    const resp = await axios.post(API_URL + "/login", userData);
    if (resp.data) localStorage.setItem("user", JSON.stringify(resp.data))
    return resp.data;
}

async function logout() {
    localStorage.removeItem('user');
}

export default {
    register,
    login,
    logout
}