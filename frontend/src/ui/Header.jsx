import React from "react";
import HeaderMenu from "./HeaderMenu";

function Header() {
  return (
    <header className="bg-[#262a32] p-3 sm:px-12 border-b border-[#30353f] flex gap-6 items-center justify-end">
      <HeaderMenu />
    </header>
  );
}
// #262a32  #30353f
export default Header;
