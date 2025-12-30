import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installAdminFetchInterceptor } from "./lib/admin-session";

installAdminFetchInterceptor();

createRoot(document.getElementById("root")!).render(<App />);
