import styled from "styled-components";
import Logout from "../features/authentication/Logout";
import ButtonIcon from "./ButtonIcon";
import { HiOutlineUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

function HeaderMenu() {
  const navigate = useNavigate();

  return (
    <div className="flex gap-[0.4rem] list-none">
      <li>
        <ButtonIcon onClick={() => navigate("/account")}>
          <HiOutlineUser color="white" />
        </ButtonIcon>
      </li>
      <li>
        <Logout />
      </li>
    </div>
  );
}

export default HeaderMenu;
