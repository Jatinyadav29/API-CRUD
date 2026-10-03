import RegisterForm from "@/features/auth/ui/components/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-neutral-900">Create an account</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Sign up to get started.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </>
  );
}
