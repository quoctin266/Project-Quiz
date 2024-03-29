export const LOGIN_SUCCESS_FETCH_USER = "LOGIN_SUCCESS_FETCH_USER";
export const USER_LOGOUT = "USER_LOGOUT";
export const RENEW_TOKEN = "RENEW_TOKEN";
export const USER_UPDATE_PROFILE = "USER_UPDATE_PROFILE";

export const userLogin = (data) => {
  return {
    type: LOGIN_SUCCESS_FETCH_USER,
    payload: data,
  };
};

export const userLogout = () => {
  return {
    type: USER_LOGOUT,
  };
};

export const renewToken = (data) => {
  return {
    type: RENEW_TOKEN,
    payload: data,
  };
};

export const userUpdateProfile = (data) => {
  return {
    type: USER_UPDATE_PROFILE,
    payload: data,
  };
};
