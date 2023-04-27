import { LOGIN_SUCCESS_FETCH_USER, USER_LOGOUT } from "../action/userAction";

const initState = {
  account: {
    access_token: "",
    refresh_token: "",
    email: "",
    username: "",
    role: "",
    image: "",
    rememberLogin: false,
  },
  isAuthenticated: false,
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS_FETCH_USER:
      return {
        ...state,
        account: {
          access_token: action?.payload?.access_token,
          refresh_token: action?.payload?.refresh_token,
          email: action?.payload?.email,
          username: action?.payload?.username,
          role: action?.payload?.role,
          image: action?.payload?.image,
          rememberLogin: action?.payload?.rememberLogin,
        },
        isAuthenticated: true,
      };

    case USER_LOGOUT:
      console.log("check state", state);
      return {
        account: {
          access_token: "",
          refresh_token: "",
          email: state.account.email, // store email for remember-login feature
          username: "",
          role: "",
          image: "",
          rememberLogin: state.account.rememberLogin, //store remember-login option
        },
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default userReducer;
