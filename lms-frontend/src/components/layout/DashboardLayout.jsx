import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800">

      <Sidebar />

      <div className="lg:ml-64 min-h-screen">

        <Header />

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;