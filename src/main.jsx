import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserContextProvider from "./context/UserContextProvider.jsx";
import ProjectHeadContextProvider from "./context/ProjectHeadContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <ProjectHeadContextProvider>
      <App />
      </ProjectHeadContextProvider>
    </UserContextProvider>
  </StrictMode>
);
