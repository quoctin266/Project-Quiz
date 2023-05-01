import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { postLogOut } from "../../services/APIService";
import { toast } from "react-toastify";
import { userLogout } from "../../redux/action/userAction";
import Language from "./Language";
import { useTranslation } from "react-i18next";
import Profile from "./Profile";
import { useState } from "react";

function NavigationBar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.userAccount.isAuthenticated
  );
  const account = useSelector((state) => state.userAccount.account);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleLogout = async () => {
    let data = await postLogOut(account.email, account.refresh_token);
    if (data?.DT) {
      dispatch(userLogout());
      navigate("/login");
    } else toast.error(`${t("header.notification.logoutError")}`);
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark pt-3">
        <Container>
          <NavLink to="/" className="navbar-brand">
            LearnByQuiz
          </NavLink>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/" className="nav-link" end>
                {t("header.homeNavigate")}
              </NavLink>
              ;
              <NavLink to="/user" className="nav-link">
                {t("header.usersNavigate")}
              </NavLink>
              ;
              <NavLink to="/admin" className="nav-link" end>
                {t("header.adminNavigate")}
              </NavLink>
              ;
            </Nav>
            <Nav style={{ width: "30%", justifyContent: "flex-end" }}>
              {isAuthenticated ? (
                <>
                  <span
                    style={{
                      color: "#cdc0c0",
                      lineHeight: "40px",
                      marginRight: "9%",
                      minWidth: "200px",
                    }}
                  >
                    {t("header.welcome")} <b>{account.username}</b>
                  </span>
                  <NavDropdown
                    title={t("header.options")}
                    id="collasible-nav-dropdown"
                  >
                    <NavDropdown.Item onClick={() => setShowModal(true)}>
                      {t("header.profileOption")}
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      {t("header.helpOption")}
                    </NavDropdown.Item>

                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => handleLogout()}>
                      {t("header.logoutOption")}
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Button variant="light" onClick={handleLogin}>
                    {t("header.loginOption")}
                  </Button>
                  <Button variant="dark mx-2" onClick={handleSignUp}>
                    {t("header.signupOption")}
                  </Button>
                </>
              )}
              <Language />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Profile showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}

export default NavigationBar;
