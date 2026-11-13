import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmployeeList from "./pages/EmployeeList";
import EmployeeFormPage from "./pages/EmployeeForm";
import EmployeeDetails from "./pages/EmployeeDetails";

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token } = useAuth();

  return token ? <Navigate to="/employees" replace /> : children;
}

export default function App() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="bg-light min-vh-100">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container gap-3">
          <Link
            className="navbar-brand"
            to={token ? "/employees" : "/login"}
          >
            TeamSpace
          </Link>

          {token ? (
            <div className="d-flex align-items-center gap-3">
              <Link className="text-white" to="/employees">
                Employees
              </Link>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link
                className="btn btn-outline-light btn-sm"
                to="/login"
              >
                Log in
              </Link>
              <Link className="btn btn-light btn-sm" to="/signup">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={token ? "/employees" : "/login"} replace />
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <EmployeeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/add"
          element={
            <ProtectedRoute>
              <EmployeeFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/:id"
          element={
            <ProtectedRoute>
              <EmployeeDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees/:id/edit"
          element={
            <ProtectedRoute>
              <EmployeeFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <main className="container py-5">
              <h1>Page not found</h1>
              <p>The requested page could not be found.</p>
              <Link to="/">Return home</Link>
            </main>
          }
        />
      </Routes>
    </div>
  );
}