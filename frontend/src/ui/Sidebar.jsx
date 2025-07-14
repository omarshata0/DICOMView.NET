import React from "react";
import Logo from "./Logo";
import SearchSideBar from "./SearchSideBar";

function Sidebar() {
  return (
    <aside className="bg-[#262a32] p-2 border-r border-[#30353f] row-span-full flex flex-col gap-5">
      <Logo />
      <SearchSideBar />
    </aside>
  );
}

export default Sidebar;
