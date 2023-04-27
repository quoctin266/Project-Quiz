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

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [username, setUsername] = useState("");
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

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
  };

  const handleSignup = async () => {
    if (!username || !password || !email) {
      toast.error("Missing one or more fields!");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format!");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters!");
      return;
    }
    if (!checked) {
      toast.error(
        "Please accept the terms and conditions to finish the signup"
      );
      return;
    }

    let data = await postRegister(email, password, username);
    if (data && data.EC === 0) {
      toast.success(data.EM);
    } else {
      toast.error(data.EM);
    }
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="header">
        <span>Already have an account?</span>

        <Button variant="outline-secondary" type="button" onClick={handleLogin}>
          Log in
        </Button>
        <Language className="language" />
      </div>
      <div className="title">Learn By Quiz</div>
      <div className="welcome">Free and always will be</div>
      <div className="form-content">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <div className="password-container">
              <Form.Control
                type={passwordType}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />
              <span className="password-toogle" onClick={togglePassword}>
                {passwordType === "password" ? <BiShow /> : <BiHide />}
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="I agree to LearnByQuiz’s Terms of Service, Privacy Policy and Data Processing Agreement."
              onClick={handleCheck}
            />
          </Form.Group>

          <Button variant="dark" type="button" onClick={handleSignup}>
            Create my free account
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

export default Register;
