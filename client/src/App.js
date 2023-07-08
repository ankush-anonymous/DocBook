// import logo from "./logo.svg";
import "./App.css";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";

import AdminAuth from "./Pages/AdminAuth";
import AdminPage from "./Pages/AdminPage";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginUser";
import BookAppointment from "./Pages/BookAppointment";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/authadmin" element={<AdminAuth />} />
          {/* <Route path="/admin" element={<AdminPage />} /> */}
          <Route
            path="/admin"
            element={
              <ProtectedRouteAdmin>
                <AdminPage />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/appointment"
            element={
              <ProtectedRouteUser>
                <BookAppointment />
              </ProtectedRouteUser>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

export const ProtectedRouteAdmin = ({ children }) => {
  const isAuthorised = localStorage.getItem("authorised") === "true";
  if (isAuthorised) {
    return children;
  } else {
    return <Navigate to="/authadmin" />;
  }
};
export const ProtectedRouteUser = ({ children }) => {
  const isAuthorised = localStorage.getItem("user authorised") === "true";
  if (isAuthorised) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
