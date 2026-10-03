import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { toast } from "sonner";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import useAuth from "@/features/auth/hook/useAuth";
import Input from "@/shared/ui/components/Input";
import Button from "@/shared/ui/components/Button";

export default function LoginForm() {
  const { login } = useAuth();
  const [banner, setBanner] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    setBanner("");
    try {
      const result = await login(values);
      toast.success(`Welcome back, ${result.user.name}`);
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        for (const [field, message] of Object.entries(err.fieldErrors)) {
          setError(field, { message });
        }
      } else {
        setBanner(err.message || "Something went wrong");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      {banner && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {banner}
        </div>
      )}

      <Button type="submit" loading={isSubmitting} className="w-full">
        Log in
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-neutral-900 hover:underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
