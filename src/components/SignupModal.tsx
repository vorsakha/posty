import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema, type UsernameFormData } from "../lib/validation";
import { useAuth } from "../hooks/useAuth";
import { Input, Button } from "./ui";

export const SignupModal = () => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
  });

  const formUsername = useWatch({ control, name: "username" }) ?? "";
  const isDisabled = !formUsername?.trim();

  const onSubmit = (data: UsernameFormData) => {
    login(data.username);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#E0E0E0] z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-125 shadow-lg max-h-51.25">
        <h1 className="text-[22px] font-bold mb-4">
          Welcome to CodeLeap network!
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            {...register("username")}
            label="Please enter your username"
            type="text"
            placeholder="John doe"
            error={errors.username?.message}
            autoFocus
          />

          <div className="flex w-full justify-end">
            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full p-1 max-w-27.75 max-h-8"
            >
              ENTER
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
