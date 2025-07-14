import React from "react";
import SignupForm from "../features/authentication/SignupForm";
import Heading from "../ui/Heading";
import Logo from "../ui/Logo";

function Signup() {
  return (
    <main className="min-h-screen grid grid-cols-[48rem] place-content-center justify-items-center gap-8 bg-[#262a32]">
      <Logo />
      <Heading as="h4">Sign Up</Heading>
      <SignupForm />
    </main>
  );
}

export default Signup;
