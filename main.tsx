import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create the root element and render the app
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(<App />);
