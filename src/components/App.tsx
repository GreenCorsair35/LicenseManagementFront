import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
//import Register from "../pages/Register";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import CreateRequest from "./CreateRequest";
import ViewRequest from "./ViewRequest";
import UpdateRequest from "./UpdateRequest";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

/*function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-request"
          element={
            <ProtectedRoute>
              <CreateRequest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-request/:id"
          element={
            <ProtectedRoute>
              <UpdateRequest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-request/:id"
          element={
            <ProtectedRoute>
              <ViewRequest />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        {/* <Route path="/register" element={<RegisterAndLogout />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
