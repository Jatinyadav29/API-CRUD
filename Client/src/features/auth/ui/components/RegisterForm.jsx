import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { toast } from "sonner";
import { registerSchema } from "@/features/auth/schemas/auth.schema";
import useAuth from "@/features/auth/hook/useAuth";
import Input from "@/shared/ui/components/Input";
import Button from "@/shared/ui/components/Button";

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [banner, setBanner] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values) {
    setBanner("");
    try {
      await registerUser(values);
      toast.success("Account created");
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
        label="Name"
        type="text"
        autoComplete="name"
        placeholder="Jane Doe"
        error={errors.name?.message}
        {...register("name")}
      />

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
        autoComplete="new-password"
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
        Create account
      </Button>

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-neutral-900 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
