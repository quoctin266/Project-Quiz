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

function NavigationBar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.userAccount.isAuthenticated
  );
  const account = useSelector((state) => state.userAccount.account);

  const navigate = useNavigate();

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
    } else toast.error(data.EM);
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark pt-3">
      <Container>
        <NavLink to="/" className="navbar-brand">
          Learn By Quiz
        </NavLink>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link" end>
              Home
            </NavLink>
            ;
            <NavLink to="/user" className="nav-link">
              Users
            </NavLink>
            ;
            <NavLink to="/admin" className="nav-link" end>
              Admin
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
                  }}
                >
                  Welcome, <b>{account.username}</b>
                </span>
                <NavDropdown title="Account" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Help &amp; support
                  </NavDropdown.Item>

                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => handleLogout()}>
                    Log out
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Button variant="light" onClick={handleLogin}>
                  Log in
                </Button>
                <Button variant="dark mx-2" onClick={handleSignUp}>
                  Sign up
                </Button>
              </>
            )}
            <Language />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
