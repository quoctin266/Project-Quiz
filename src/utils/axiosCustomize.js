import axios from "axios";
import nprogress from "nprogress";
import { store } from "../redux/store";
import axiosRetry from "axios-retry";
import { postRefreshToken } from "../services/APIService";
import { renewToken } from "../redux/action/userAction";

nprogress.configure({ showSpinner: false, trickleSpeed: 40 }); //config loading bar

const instance = axios.create({
  baseURL: "http://localhost:8081/",
});

axiosRetry(instance, {
  retries: 3,
  retryDelay: () => 4000,
  retryCondition: () => true,
  onRetry: async () => {
    // retrieve refresh token and email from redux
    const refresh_token =
      store?.getState()?.userAccount?.account?.refresh_token;
    const email = store?.getState()?.userAccount?.account?.email;
    // get new access token
    let data = await postRefreshToken(email, refresh_token);

    if (data && data.EC === 0) {
      let newAccessToken = data.DT.access_token;
      let newRefreshToken = data.DT.refresh_token;
      // store new tokens to redux
      store.dispatch(
        renewToken({
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        })
      );
    }
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const access_token = store?.getState()?.userAccount?.account?.access_token;
    config.headers["Authorization"] = "Bearer " + access_token; //add token to request header

    nprogress.start(); //start running loading bar
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    nprogress.done();

    return response && response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error && error.response && error.response.data
      ? error.response.data
      : Promise.reject(error);
  }
);

export default instance;
