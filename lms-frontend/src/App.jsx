import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ==========================================
// Authentication Pages
// ==========================================

import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ==========================================
// Protected Route
// ==========================================

import ProtectedRoute from "./routes/ProtectedRoute";

// ==========================================
// Dashboard Layout
// ==========================================

import DashboardLayout from "./components/layout/DashboardLayout";

// ==========================================
// Dashboard Pages
// ==========================================

import AccountantDashboard from "./pages/dashboard/AccountantDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import DigitalDashboard from "./pages/dashboard/DigitalDashboard";
import HODDashboard from "./pages/dashboard/HODDashboard";
import LibrarianDashboard from "./pages/dashboard/LibrarianDashboard";
import LibraryDashboard from "./pages/dashboard/LibraryDashboard";
import ResearcherDashboard from "./pages/dashboard/ResearcherDashboard";
import StaffDashboard from "./pages/dashboard/StaffDashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import VisitorDashboard from "./pages/dashboard/VisitorDashboard";

// ==========================================
// App
// ==========================================

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================
            PART 1 — Welcome
        ================================== */}

        <Route
          path="/"
          element={<Welcome />}
        />

        {/* ==================================
            PART 2 — Authentication
        ================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ==================================
            PART 3 — Protected Dashboard Area
        ================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "student",
                "teacher",
                "admin",
                "librarian",
                "superadmin",
                "hod",
                "staff",
                "visitor",
                "accountant",
                "researcher",
                "digital",
                "library",
              ]}
            />
          }
        >

          {/* ==================================
              Dashboard Layout

              Sidebar
              Header
              Outlet
          ================================== */}

          <Route
            element={<DashboardLayout />}
          >

            {/* ==================================
                1. Student Dashboard
            ================================== */}

            <Route
              path="/dashboard/student"
              element={
                <StudentDashboard />
              }
            />

            {/* ==================================
                2. Teacher Dashboard
            ================================== */}

            <Route
              path="/dashboard/teacher"
              element={
                <TeacherDashboard />
              }
            />

            {/* ==================================
                3. Admin Dashboard
            ================================== */}

            <Route
              path="/dashboard/admin"
              element={
                <AdminDashboard />
              }
            />

            {/* ==================================
                4. Librarian Dashboard
            ================================== */}

            <Route
              path="/dashboard/librarian"
              element={
                <LibrarianDashboard />
              }
            />

            {/* ==================================
                5. Super Admin Dashboard
            ================================== */}

            <Route
              path="/dashboard/superadmin"
              element={
                <SuperAdminDashboard />
              }
            />

            {/* ==================================
                6. HOD Dashboard
            ================================== */}

            <Route
              path="/dashboard/hod"
              element={
                <HODDashboard />
              }
            />

            {/* ==================================
                7. Staff Dashboard
            ================================== */}

            <Route
              path="/dashboard/staff"
              element={
                <StaffDashboard />
              }
            />

            {/* ==================================
                8. Visitor Dashboard
            ================================== */}

            <Route
              path="/dashboard/visitor"
              element={
                <VisitorDashboard />
              }
            />

            {/* ==================================
                9. Accountant Dashboard
            ================================== */}

            <Route
              path="/dashboard/accountant"
              element={
                <AccountantDashboard />
              }
            />

            {/* ==================================
                10. Researcher Dashboard
            ================================== */}

            <Route
              path="/dashboard/researcher"
              element={
                <ResearcherDashboard />
              }
            />

            {/* ==================================
                11. Digital Dashboard
            ================================== */}

            <Route
              path="/dashboard/digital"
              element={
                <DigitalDashboard />
              }
            />

            {/* ==================================
                12. Library Dashboard
            ================================== */}

            <Route
              path="/dashboard/library"
              element={
                <LibraryDashboard />
              }
            />

          </Route>

        </Route>

        {/* ==================================
            PART 4 — Unknown Route
        ================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;