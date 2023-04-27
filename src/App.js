import "./App.scss";
import NavigationBar from "./components/header/NavigationBar";
import { Outlet } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars-2";

function App() {
  return (
    <div className="App">
      <div className="header-container">
        <NavigationBar />
      </div>
      <div className="body-container">
        <Scrollbars
          style={{ height: "93vh" }}
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
  );
}

export default App;
