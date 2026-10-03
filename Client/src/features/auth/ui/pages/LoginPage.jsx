import LoginForm from "@/features/auth/ui/components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Log in to your account to continue.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </>
  );
}
