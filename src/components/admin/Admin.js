import "./Admin.scss";
import { FaBars } from "react-icons/fa";
import SideBar from "./SideBar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2";

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
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
