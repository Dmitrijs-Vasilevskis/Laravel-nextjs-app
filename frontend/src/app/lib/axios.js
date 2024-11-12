import Axios from "axios";

const axios = Axios.create({
  baseURL: "http://localhost:80",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
  withXSRFToken: true,
});

// Set the Bearer auth token.
const setBearerToken = (token) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export { axios, setBearerToken }
