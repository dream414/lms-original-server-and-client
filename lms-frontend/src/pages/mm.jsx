
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
// Other Pages
// ==========================================

import UserManagement from "./pages/users/UserManagement";
import Profile from "./pages/profile";

import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import Staff from "./pages/Staff";
import Librarians from "./pages/Librarians";
import HOD from "./pages/HOD";

// ==========================================
// Course Pages
// ==========================================

import CourseList from "./pages/courses/CourseList";
import CreateCourse from "./pages/courses/CreateCourse";
import CourseDetails from "./pages/courses/CourseDetails";
import EditCourse from "./pages/courses/EditCourse";

// ==========================================
// Department Pages
// ==========================================

import Departments from "./pages/departments/Departments";
import CreateDepartment from "./pages/departments/CreateDepartment";

// ==========================================
// Library / Book Pages
// ==========================================

import Books from "./pages/library/Books";
import AddBook from "./pages/library/AddBook";
import EditBook from "./pages/library/EditBook";
import BookDetails from "./pages/library/BookDetails";

// ==========================================
// Book Request Pages
// ==========================================

import BookRequest from "./pages/requests/BookRequest";
import ManageRequests from "./pages/requests/ManageRequests";
import ViewRequest from "./pages/requests/ViewRequest";

// ==========================================
// Issue Book Pages
// ==========================================

import IssueBooks from "./pages/IssueBooks/IssueBooks";
import ViewIssuedBook from "./pages/IssueBooks/ViewIssuedBook";

// ==========================================
// STUDENT ISSUED BOOK PAGE
// Student Receive / Return Request
// ==========================================

import MyIssuedBooks from "./pages/IssueBooks/MyIssuedBooks";

// ==========================================
// RETURN BOOK PAGE
// ==========================================

import ReturnBooks from "./pages/ReturnBooks";

// ==========================================
// FINE PAGE
// ==========================================

import Fines from "./pages/Fines";

// ==========================================
// NOTIFICATION PAGE
// ==========================================

import Notifications from "./pages/Notifications";

// ==========================================
// APP
// ==========================================

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==========================================
            PART 1 — WELCOME
        ========================================== */}

        <Route
          path="/"
          element={<Welcome />}
        />

        {/* ==========================================
            PART 2 — AUTHENTICATION
        ========================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ==========================================
            PART 3 — PROTECTED LMS AREA
        ========================================== */}

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

          {/* ==========================================
              DASHBOARD LAYOUT
          ========================================== */}

          <Route
            element={<DashboardLayout />}
          >

            {/* ========================================
                USER MANAGEMENT
            ======================================== */}

            <Route
              path="users"
              element={<UserManagement />}
            />

            {/* ========================================
                PROFILE
            ======================================== */}

            <Route
              path="profile"
              element={<Profile />}
            />

            {/* ========================================
                TEACHERS
            ======================================== */}

            <Route
              path="teachers"
              element={<Teachers />}
            />

            {/* ========================================
                STUDENTS
            ======================================== */}

            <Route
              path="students"
              element={<Students />}
            />

            {/* ========================================
                STAFF
            ======================================== */}

            <Route
              path="staff"
              element={<Staff />}
            />

            {/* ========================================
                LIBRARIANS
            ======================================== */}

            <Route
              path="librarians"
              element={<Librarians />}
            />

            {/* ========================================
                HOD
            ======================================== */}

            <Route
              path="hod"
              element={<HOD />}
            />

            {/* ========================================
                COURSES
            ======================================== */}

            <Route
              path="courses"
              element={<CourseList />}
            />

            <Route
              path="courses/create"
              element={<CreateCourse />}
            />

            <Route
              path="courses/:id"
              element={<CourseDetails />}
            />

            <Route
              path="courses/:id/edit"
              element={<EditCourse />}
            />

            {/* ========================================
                DEPARTMENTS
            ======================================== */}

            <Route
              path="departments"
              element={<Departments />}
            />

            <Route
              path="departments/create"
              element={<CreateDepartment />}
            />

            {/* ========================================
                LIBRARY — BOOKS
            ======================================== */}

            <Route
              path="library/books"
              element={<Books />}
            />

            <Route
              path="library/books/add"
              element={<AddBook />}
            />
<Route
  path="library/books/:id"
  element={<BookDetails />}
/>

<Route
  path="library/books/:id/edit"
  element={<EditBook />}
/>

            {/* ========================================
                BOOK REQUEST — STUDENT
            ======================================== */}

            <Route
              path="requests"
              element={<BookRequest />}
            />

            {/* ========================================
                BOOK REQUEST — MANAGE
            ======================================== */}

            <Route
              path="requests/manage"
              element={<ManageRequests />}
            />

            {/* ========================================
                BOOK REQUEST — VIEW
            ======================================== */}

            <Route
              path="requests/view/:id"
              element={<ViewRequest />}
            />

            {/* ========================================
                ISSUE BOOKS — LIBRARIAN
            ======================================== */}

            <Route
              path="issues"
              element={<IssueBooks />}
            />

            {/* ========================================
                VIEW ISSUED BOOK
            ======================================== */}

            <Route
              path="issues/view/:id"
              element={<ViewIssuedBook />}
            />

            {/* ========================================
                STUDENT — MY ISSUED BOOKS
                Receive Book + Return Request
            ======================================== */}

            <Route
              path="my-issued-books"
              element={<MyIssuedBooks />}
            />

            {/* ========================================
                RETURN BOOKS — LIBRARIAN
            ======================================== */}

            <Route
              path="return-books"
              element={<ReturnBooks />}
            />

            {/* ========================================
                FINES
            ======================================== */}

            <Route
              path="fines"
              element={<Fines />}
            />

            {/* ========================================
                NOTIFICATIONS
            ======================================== */}

            <Route
              path="notifications"
              element={<Notifications />}
            />

            {/* ==========================================
                DASHBOARDS
            ========================================== */}

            {/* ========================================
                STUDENT
            ======================================== */}

            <Route
              path="dashboard/student"
              element={<StudentDashboard />}
            />

            {/* ========================================
                TEACHER
            ======================================== */}

            <Route
              path="dashboard/teacher"
              element={<TeacherDashboard />}
            />

            {/* ========================================
                ADMIN
            ======================================== */}

            <Route
              path="dashboard/admin"
              element={<AdminDashboard />}
            />

            {/* ========================================
                LIBRARIAN
            ======================================== */}

            <Route
              path="dashboard/librarian"
              element={<LibrarianDashboard />}
            />

            {/* ========================================
                SUPER ADMIN
            ======================================== */}

            <Route
              path="dashboard/superadmin"
              element={<SuperAdminDashboard />}
            />

            {/* ========================================
                HOD
            ======================================== */}

            <Route
              path="dashboard/hod"
              element={<HODDashboard />}
            />

            {/* ========================================
                STAFF
            ======================================== */}

            <Route
              path="dashboard/staff"
              element={<StaffDashboard />}
            />

            {/* ========================================
                VISITOR
            ======================================== */}

            <Route
              path="dashboard/visitor"
              element={<VisitorDashboard />}
            />

            {/* ========================================
                ACCOUNTANT
            ======================================== */}

            <Route
              path="dashboard/accountant"
              element={<AccountantDashboard />}
            />

            {/* ========================================
                RESEARCHER
            ======================================== */}

            <Route
              path="dashboard/researcher"
              element={<ResearcherDashboard />}
            />

            {/* ========================================
                DIGITAL
            ======================================== */}

            <Route
              path="dashboard/digital"
              element={<DigitalDashboard />}
            />

            {/* ========================================
                LIBRARY
            ======================================== */}

            <Route
              path="dashboard/library"
              element={<LibraryDashboard />}
            />

          </Route>

        </Route>

        {/* ==========================================
            PART 4 — UNKNOWN ROUTE
        ========================================== */}

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
