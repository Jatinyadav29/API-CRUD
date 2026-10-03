import { APP_NAME } from "@/config/constants";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-6">
      <p className="text-center text-sm text-neutral-400">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>
    </footer>
  );
}
