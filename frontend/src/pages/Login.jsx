import React from "react";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";

function Login() {
  return (
    <main className="min-h-screen grid grid-cols-[48rem] place-content-center justify-items-center gap-8 bg-[#262a32]">
      <Logo />
      <Heading as="h4">Log in to your account</Heading>
      <LoginForm />
    </main>
  );
}

export default Login;
