import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="grid grid-cols-[22rem_1fr] grid-rows-[auto_1fr] h-screen bg-[#262a32]">
      <Header />
      <Sidebar />
      <main className="bg-[#262a32] overflow-y-auto">
        <div className="mx-auto flex flex-col gap-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
