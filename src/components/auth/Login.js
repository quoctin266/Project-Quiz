import "./Login.scss";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../../services/APIService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../redux/action/userAction";
import { ImSpinner2 } from "react-icons/im";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import Language from "../header/Language";

const Login = () => {
  let loginStatus = useSelector(
    (state) => state.userAccount.account.rememberLogin
  ); //retrieve previous login option
  let preEmail = useSelector((state) => state.userAccount.account.email);
  //retrieve previous email to login

  const [email, setEmail] = useState(loginStatus ? preEmail : "");
  const [password, setPassword] = useState(""); //display previous email and password as default value if remember log in box is ticked
  const [passwordType, setPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(loginStatus);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // toogle show/hide password base on input type
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleCheckLogin = () => {
    setRememberLogin(!rememberLogin);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!password || !email) {
      toast.error("Missing one or more fields!");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format!");
      return;
    }

    setLoading(true); //start loading
    let data = await postLogin(email, password);
    if (data && data.DT) {
      let dataPayload = {
        ...data.DT,
        rememberLogin: rememberLogin,
      };
      dispatch(userLogin(dataPayload)); //send user info to redux
      toast.success(data.EM);
      setLoading(false); //stop loading
      navigate("/");
    } else {
      toast.error(data.EM);
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="header">
        <span>Don't have an account yet?</span>

        <Button
          variant="outline-secondary"
          type="button"
          onClick={handleSignUp}
        >
          Sign up
        </Button>

        <Language className="language" />
      </div>

      <div className="title">Learn By Quiz</div>
      <div className="welcome">Login</div>
      <div className="form-content">
        <Form onSubmit={(event) => handleLogin(event)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder={"Enter email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <div className="password-container">
              <Form.Control
                type={passwordType}
                placeholder={"Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password-toogle" onClick={togglePassword}>
                {passwordType === "password" ? <BiShow /> : <BiHide />}
              </span>
            </div>
            <Form.Text className="text-muted">Forgot password?</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Remember me"
              onChange={handleCheckLogin}
              checked={rememberLogin}
            />
          </Form.Group>

          <Button
            className="login-btn"
            variant="dark"
            type="submit"
            disabled={loading} // button disabled while calling API
          >
            {loading && <ImSpinner2 className="loading-icon" />}
            <span> Login</span>
          </Button>
          <div className="back-btn">
            <span
              onClick={() => {
                navigate("/");
              }}
            >
              &#60;&#60; Go to Homepage
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
