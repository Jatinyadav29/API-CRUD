import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-neutral-900">404</h1>
      <p className="text-neutral-600">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        to="/"
        className="text-sm font-medium text-neutral-900 underline hover:text-neutral-600"
      >
        Go back home
      </Link>
    </div>
  );
}
