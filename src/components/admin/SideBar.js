import "react-pro-sidebar/dist/css/styles.css";
import "./SideBar.scss";
import sidebarImage from "../../assets/image/8e6c064f57f94838263d7ba9ad80f353.jpg";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { FaGem } from "react-icons/fa";
import { DiReact } from "react-icons/di";
import { MdDashboard } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { NavLink } from "react-router-dom";

const SideBar = (props) => {
  const { collapsed, rtl, toggled, handleToggleSidebar } = props;
  return (
    <ProSidebar
      image={sidebarImage}
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: "24px",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 14,
            letterSpacing: "1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <DiReact size={"3em"} color={"00bfff"} />
          <span>Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem icon={<MdDashboard />}>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
          </MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu title="Features" icon={<FaGem />}>
            <MenuItem>
              <NavLink to="/admin/manage-users">Manage Users</NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/manage-quiz">Manage Quiz</NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/manage-qa">
                Manage Questions & Answers
              </NavLink>
            </MenuItem>
          </SubMenu>
        </Menu>
      </SidebarContent>

      <SidebarFooter style={{ textAlign: "center" }}>
        <div
          className="sidebar-btn-wrapper"
          style={{
            padding: "30px 24px",
          }}
        >
          <NavLink to="/" className="sidebar-btn">
            <AiOutlineHome />
            <span
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              Learn By Quiz
            </span>
          </NavLink>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default SideBar;
