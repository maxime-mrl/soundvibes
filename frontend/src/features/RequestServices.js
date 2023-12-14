import axios from "axios";
// handle every needed request type (GET POST PUT DELETE)
export default class RequestServices {
    constructor (APIEndPoint) {
        this.API_URL = `http://${window.location.hostname}:80/${APIEndPoint}`; // window.location.hostname used for dev -> when hosting the backend and frontend at the same place no matter where you host it, the backend while be at the same place than the host url
    }

    get = async (endpoint, token) => {
        // request header
        const config = RequestServices.#config(token);
        // send request
        const resp = await axios(this.API_URL + endpoint, config);
        // check for error
        if (resp.data && resp.data.error) throw new Error(resp.data.error);
        // return the data
        return resp.data;
    }

    post = async (endpoint, token, data) => {
        // request header
        const config = RequestServices.#config(token);
        // send request
        const resp = await axios.post(this.API_URL + endpoint, data, config);
        // check for error
        if (resp.data && resp.data.error) throw new Error(resp.data.error);
        // return the data
        return resp.data;
    }

    put = async (endpoint, token, data) => {
        // request header
        const config = RequestServices.#config(token);
        // send request
        const resp = await axios.put(this.API_URL + endpoint, data, config);
        // check for error
        if (resp.data && resp.data.error) throw new Error(resp.data.error);
        // return the data
        return resp.data;
    }

    del = async (endpoint, token) => {
        // request header
        const config = RequestServices.#config(token);
        // send request
        const resp = await axios.delete(this.API_URL + endpoint, config);
        // check for error
        if (resp.data && resp.data.error) throw new Error(resp.data.error);
        // return the data
        return resp.data;
    }

    static #config = (token) => {
        const config = {};
        if (token) config.headers = { Authorization: `Bearer ${token}` };
        return config;
    }
}
