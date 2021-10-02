import axios from "axios";

let baseUrl = 'http://test-intaweb.loc.com/api/';

axios.defaults.baseURL = baseUrl;

const methodsApi = {
    postApi (url, credentials, headers = null) {
        return axios.post(url, credentials, headers);
    },
    getApi (url, credentials, headers = null) {
        return axios.get(url, credentials, headers);
    },
    baseUrl
};

export default methodsApi;