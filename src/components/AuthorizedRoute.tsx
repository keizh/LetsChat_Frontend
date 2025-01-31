import { jwtDecode, JwtPayload } from "jwt-decode";
import { Navigate } from "react-router-dom";

// ⚠️ IF JWT is with valid timeFrame will navigate to actual page or else will present login page
function AuthorizedRoute({ children }) {
  const token: string | null = localStorage.getItem(`LetsChat`);
  console.log(token);
  const decoded = token ? jwtDecode<JwtPayload>(token) : false;
  console.log(decoded);

  if (decoded != false) {
    const exp = decoded?.exp ?? 0;
    // Date.now
    if (exp * 1000 < Date.now()) {
      return <Navigate to="/user/login" replace />;
    } else {
      return <div className="fit-height fit-width">{children}</div>;
    }
  } else {
    return <Navigate to="/user/login" replace />;
  }
}

export default AuthorizedRoute;
