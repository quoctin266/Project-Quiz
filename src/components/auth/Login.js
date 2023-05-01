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
import { useTranslation } from "react-i18next";

const Login = () => {
  let loginStatus = useSelector(
    (state) => state.userAccount.account.rememberLogin
  ); //retrieve previous login option
  let preEmail = useSelector((state) => state.userAccount.account.email);
  //retrieve previous email to login

  const [email, setEmail] = useState(loginStatus ? preEmail : ""); //display previous email as default value if remember log in box is ticked
  const [password, setPassword] = useState("");

  const [invalidEmail, setInvalidEmail] = useState(false); //  controlling whether to display empty email warning or not
  const [invalidPassword, setInvalidPassword] = useState(false); //  controlling whether to display empty password warning or not

  const [passwordType, setPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(loginStatus);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleOnchangeEmail = (event) => {
    setEmail(event.target.value);
    setInvalidEmail(false); // stop displaying warning after typing something
  };

  const handleOnchangePassword = (event) => {
    setPassword(event.target.value);
    setInvalidPassword(false); // stop displaying warning after typing something
  };

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
    if (!email) {
      setInvalidEmail(true);
      toast.error(`${t("login.notification.missingField")}`);
      return;
    }

    if (!password) {
      setInvalidPassword(true);
      toast.error(`${t("login.notification.missingField")}`);
      return;
    }

    if (!validateEmail(email)) {
      toast.error(`${t("login.notification.invalidEmail")}`);
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
      toast.success(`${t("login.notification.loginSuccess")}`);
      setLoading(false); //stop loading
      navigate("/");
    } else {
      if (data.EC === -1)
        toast.error(`${t("login.notification.notFoundEmail")}`);
      else if (data.EC === -2)
        toast.error(`${t("login.notification.wrongPassword")}`);
      else toast.error(`${t("login.notification.error")}`);
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="header">
        <span>{t("login.header.message")}</span>

        <Button
          variant="outline-secondary"
          type="button"
          onClick={handleSignUp}
        >
          {t("login.header.signupButton")}
        </Button>

        <Language className="language" />
      </div>

      <div className="title">LearnByQuiz</div>
      <div className="welcome">{t("login.body.title")}</div>
      <div className="form-content">
        <Form onSubmit={(event) => handleLogin(event)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("login.body.emailLabel")}</Form.Label>
            <Form.Control
              type="email"
              placeholder={t("login.body.emailPlaceholder")}
              value={email}
              onChange={(event) => handleOnchangeEmail(event)}
              isInvalid={invalidEmail}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>{t("login.body.passwordLabel")}</Form.Label>
            <div className="password-container">
              <Form.Control
                type={passwordType}
                placeholder={t("login.body.passwordPlaceholder")}
                value={password}
                onChange={(event) => handleOnchangePassword(event)}
                isInvalid={invalidPassword}
              />
              {!invalidPassword && (
                <span className="password-toogle" onClick={togglePassword}>
                  {passwordType === "password" ? <BiShow /> : <BiHide />}
                </span>
              )}
            </div>
            <Form.Text className="text-muted">
              {t("login.body.resetPasswordLink")}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label={t("login.body.rememberOption")}
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
            <span>{t("login.body.loginButton")}</span>
          </Button>
          <div className="back-btn">
            <span
              onClick={() => {
                navigate("/");
              }}
            >
              {t("login.body.homeNavigate")}
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
