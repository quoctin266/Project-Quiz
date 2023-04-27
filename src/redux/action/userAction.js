export const LOGIN_SUCCESS_FETCH_USER = "LOGIN_SUCCESS_FETCH_USER";
export const USER_LOGOUT = "USER_LOGOUT";

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
