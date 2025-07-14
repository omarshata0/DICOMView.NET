import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useSignup() {
  const navigate = useNavigate();
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      toast.success("Account successfully created!");
      navigate("/login", { replace: true });
    },
    onError: (err) => {
      toast.error("Can't Accept New Users Right Now!");
    },
  });

  return { signup, isLoading };
}
