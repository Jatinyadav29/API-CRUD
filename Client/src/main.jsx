import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "@/app/store";
import { setupInterceptors } from "@/config/api";
import { bootstrapSession } from "@/features/auth/state/authSlice";

setupInterceptors(store);
store.dispatch(bootstrapSession());

createRoot(document.getElementById("root")).render(<App />);
