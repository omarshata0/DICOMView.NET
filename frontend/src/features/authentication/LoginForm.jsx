import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRowVertical from "../../ui/FormRowVertical";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";

function LoginForm() {
  const { login, isLoading } = useLogin();
  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;

  function onSubmit({ username, password }) {
    if (!username || !password) return;
    login(
      { username, password },
      {
        onSettled: () => reset(),
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowVertical label="Username" error={errors?.username?.message}>
        <input
          className="border border-[#30353f] bg-[#30353f] rounded-sm px-3 py-2 shadow-sm focus:outline-none"
          type="text"
          id="username"
          autoComplete="username"
          disabled={isLoading}
          {...register("username", { required: "This field is required" })}
        />
      </FormRowVertical>

      <FormRowVertical label="Password" error={errors?.password?.message}>
        <input
          className="border border-[#30353f] bg-[#30353f] rounded-sm px-3 py-2 shadow-sm focus:outline-none"
          type="password"
          id="password"
          autoComplete="current-password"
          disabled={isLoading}
          {...register("password", { required: "This field is required" })}
        />
      </FormRowVertical>

      <FormRowVertical>
        <Button size="medium" variation="primary" disabled={isLoading}>
          {!isLoading ? "Log in" : <SpinnerMini />}
        </Button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
