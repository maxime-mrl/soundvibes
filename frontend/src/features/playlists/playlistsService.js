import axios from "axios";

const API_URL = "http://192.168.1.100:80/api/playlists";
export async function post(endpoint, token, data) {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const resp = await axios.post(API_URL + endpoint, data, config);
    if (resp.data && resp.data.error) throw new Error(resp.data.error);
    return resp.data;
}
