import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = (props) => {
  let isAuthenticated = useSelector(
    (state) => state.userAccount.isAuthenticated
  );
  let role = useSelector((state) => state.userAccount.account.role);

  // prevent access to features if not log in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // prevent access to admin page if account is not admin
  if (role !== "ADMIN" && props.children.type.name === "Admin") {
    return <Navigate to="/access-not-allowed" />;
  }

  return <> {props.children} </>;
};

export default PrivateRoute;
