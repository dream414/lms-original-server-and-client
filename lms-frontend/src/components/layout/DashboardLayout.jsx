
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  // ==========================================
  // MOBILE SIDEBAR STATE
  // ==========================================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-100">

      {/* =====================================================
          HEADER
          Full width across the complete screen
      ===================================================== */}

      <Header setSidebarOpen={setSidebarOpen} />

      {/* =====================================================
          SIDEBAR
          Desktop:
          Starts BELOW the header

          Mobile:
          Opens as a responsive drawer
      ===================================================== */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* =====================================================
          MAIN CONTENT
          Desktop content starts after sidebar
          Mobile content uses full width
      ===================================================== */}

      <div
        className="
          min-h-[calc(100vh-4rem)]

          lg:ml-64
        "
      >

        <main
          className="
            min-h-[calc(100vh-4rem)]

            bg-slate-100

            p-4

            sm:p-5
            md:p-6
            lg:p-7
          "
        >

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;

