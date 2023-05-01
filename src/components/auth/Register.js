import "./Register.scss";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { postRegister } from "../../services/APIService";
import Language from "../header/Language";
import { useTranslation } from "react-i18next";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [checked, setChecked] = useState(false);

  const [passwordType, setPasswordType] = useState("password");

  const [invalidEmail, setInvalidEmail] = useState(false); //  controlling whether to display empty email warning or not
  const [invalidPassword, setInvalidPassword] = useState(false); //  controlling whether to display empty password warning or not
  const [invalidUsername, setInvalidUsername] = useState(false); //  controlling whether to display empty username warning or not
  const [invalidCheckbox, setInvalidCheckbox] = useState(false); //  controlling whether to display not check agree warning or not

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleOnchangeEmail = (event) => {
    setEmail(event.target.value);
    setInvalidEmail(false); // stop displaying warning after typing something
  };

  const handleOnchangePassword = (event) => {
    setPassword(event.target.value);
    setInvalidPassword(false); // stop displaying warning after typing something
  };

  const handleOnchangeUsername = (event) => {
    setUsername(event.target.value);
    setInvalidUsername(false); // stop displaying warning after typing something
  };

  const handleLogin = () => {
    navigate("/login");
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

  const handleCheck = () => {
    setChecked(!checked);
    setInvalidCheckbox(false);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (!email) {
      setInvalidEmail(true);
      toast.error(`${t("register.notification.missingField")}`);
      return;
    }

    if (!password) {
      setInvalidPassword(true);
      toast.error(`${t("register.notification.missingField")}`);
      return;
    }
    if (!username) {
      setInvalidUsername(true);
      toast.error(`${t("register.notification.missingField")}`);
      return;
    }
    if (!validateEmail(email)) {
      toast.error(`${t("register.notification.invalidEmail")}`);
      return;
    }
    if (password.length < 8) {
      toast.error(`${t("register.notification.invalidPassword")}`);
      return;
    }
    if (!checked) {
      setInvalidCheckbox(true);
      toast.error(`${t("register.notification.agreeTerms")}`);
      return;
    }

    let data = await postRegister(email, password, username);
    if (data && data.EC === 0) {
      toast.success(`${t("register.notification.registerSuccess")}`);
    } else {
      if (data.EC === -1)
        toast.error(`${t("register.notification.emailTaken")}`);
      else toast.error(`${t("register.notification.error")}`);
      return;
    }
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <div className="header">
        <span>{t("register.header.message")}</span>

        <Button variant="outline-secondary" type="button" onClick={handleLogin}>
          {t("register.header.loginButton")}
        </Button>
        <Language className="language" />
      </div>
      <div className="title">LearnByQuiz</div>
      <div className="welcome">{t("register.body.title")}</div>
      <div className="form-content">
        <Form onSubmit={(event) => handleSignup(event)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>{t("register.body.emailLabel")}</Form.Label>
            <Form.Control
              type="email"
              placeholder={t("register.body.emailPlaceholder")}
              value={email}
              onChange={(event) => handleOnchangeEmail(event)}
              isInvalid={invalidEmail}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>{t("register.body.passwordLabel")}</Form.Label>
            <div className="password-container">
              <Form.Control
                type={passwordType}
                placeholder={t("register.body.passwordPlaceholder")}
                value={password}
                onChange={(event) => handleOnchangePassword(event)}
                isInvalid={invalidPassword}
                className="password-input"
              />
              {!invalidPassword && (
                <span className="password-toogle" onClick={togglePassword}>
                  {passwordType === "password" ? <BiShow /> : <BiHide />}
                </span>
              )}
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>{t("register.body.usernameLabel")}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t("register.body.usernamePlaceholder")}
              value={username}
              onChange={(event) => handleOnchangeUsername(event)}
              isInvalid={invalidUsername}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label={t("register.body.agreement")}
              onClick={() => handleCheck()}
              isInvalid={invalidCheckbox}
            />
          </Form.Group>

          <Button variant="dark" type="submit">
            {t("register.body.registerButton")}
          </Button>
          <div className="back-btn">
            <span
              onClick={() => {
                navigate("/");
              }}
            >
              {t("register.body.homeNavigate")}
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
