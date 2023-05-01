import "./Admin.scss";
import { FaBars } from "react-icons/fa";
import SideBar from "./SideBar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { postLogOut } from "../../services/APIService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userLogout } from "../../redux/action/userAction";
import Language from "../header/Language";
import { useTranslation } from "react-i18next";

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();
  const account = useSelector((state) => state.userAccount.account);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    let data = await postLogOut(account.email, account.refresh_token);
    if (data?.DT) {
      dispatch(userLogout()); // clear data on redux
      navigate("/login");
    } else toast.error(data.EM);
  };
  return (
    <div className="admin-container">
      <div className="sidebar-container">
        <SideBar collapsed={collapsed} />
      </div>
      <div className="admin-content">
        <div className="admin-header">
          <span className="icon-collapse">
            <FaBars onClick={() => setCollapsed(!collapsed)} />
          </span>
          <div className="setting">
            <div className="account-setting">
              <NavDropdown
                title={t("admin.header.options")}
                id="collasible-nav-dropdown"
                drop="down-centered"
              >
                {/* <NavDropdown.Item href="#action/3.1">
                  {t("admin.header.profileOption")}
                </NavDropdown.Item> */}

                <NavDropdown.Item href="#action/3.2">
                  {t("admin.header.helpOption")}
                </NavDropdown.Item>

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleLogout()}>
                  {t("admin.header.logoutOption")}
                </NavDropdown.Item>
              </NavDropdown>
            </div>
            <div className="language-setting">
              <Language />
            </div>
          </div>
        </div>
        <div className="admin-body">
          <Scrollbars
            style={{ height: "90vh" }}
            autoHide
            // Hide delay in ms
            autoHideTimeout={1000}
            // Duration for hide animation in ms.
            autoHideDuration={200}
          >
            <Outlet />
          </Scrollbars>
        </div>
      </div>
    </div>
  );
};

export default Admin;
