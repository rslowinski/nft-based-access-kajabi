import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/">
        <NavLink to="/">🚀 Start</NavLink>
      </Menu.Item>
      <Menu.Item key="/projects">
        <NavLink to="/projects">💾 Projects</NavLink>
      </Menu.Item>
      <Menu.Item key="/create-collection">
        <NavLink to="/create-collection">🧰 Create collection</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
