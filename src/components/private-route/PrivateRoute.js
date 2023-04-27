import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = (props) => {
  let isAuthenticated = useSelector(
    (state) => state.userAccount.isAuthenticated
  );
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <> {props.children} </>;
};

export default PrivateRoute;
