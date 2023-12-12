import axios from "axios";

export default class RequestServices {
    constructor (APIEndPoint) {
        this.API_URL = `http://${window.location.hostname}:80/${APIEndPoint}`;
    }

    get = async (endpoint, token) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        }
        const resp = await axios(this.API_URL + endpoint, config);
        if (resp.data && resp.data.error) throw new Error(resp.data.error);
        return resp.data;
    }

    post = async (endpoint, token, data) => {
        const config = {}
        if (token) config.headers = { Authorization: `Bearer ${token}` }
        const resp = await axios.post(this.API_URL + endpoint, data, config);
        if (resp.data && resp.data.error) throw new Error(resp.data.error);
        return resp.data;
    }

    put = async (endpoint, token, data) => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const resp = await axios.put(this.API_URL + endpoint, data, config);
        if (resp.data && resp.data.error) throw new Error(resp.data.error);
        return resp.data;
    }

    del = async (endpoint, token) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        const resp = await axios.delete(this.API_URL + endpoint, config);
        if (resp.data && resp.data.error) throw new Error(resp.data.error);
        return resp.data;
    }
}