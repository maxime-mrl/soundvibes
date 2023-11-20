import axios from "axios";

const API_URL = "http://192.168.1.100:80/api/music";
export async function get(endpoint, token) {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            // 'Access-Control-Allow-Origin': "*",
            // 'Content-Type': 'application/json',
        }
    }
    const resp = await axios(API_URL + endpoint, config);
    if (resp.data && resp.data.error) throw new Error(resp.data.error);
    return resp.data;
}
