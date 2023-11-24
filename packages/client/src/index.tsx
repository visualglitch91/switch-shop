import { createRoot } from "react-dom/client";
import { disableEmotionWarnings } from "./utils/disableEmotionWarning";
import App from "./App";
import "./index.css";

disableEmotionWarnings();
createRoot(document.getElementById("app")!).render(<App />);
