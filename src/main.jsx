import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import UserContextProvider from "./context/UserContextProvider.jsx";
import ProjectHeadContextProvider from "./context/ProjectHeadContextProvider.jsx";
import HodContextProvider from "./context/HodContextProvider.jsx";
import { StudentContextProvider } from "./context/StudentContextProvider.jsx";
import ChatContextProvider from "./context/ChatContextProvider.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <ProjectHeadContextProvider>
        <HodContextProvider>
          <StudentContextProvider>
            <ChatContextProvider>
            <App />
            </ChatContextProvider>
          </StudentContextProvider>
        </HodContextProvider>
      </ProjectHeadContextProvider>
    </UserContextProvider>
  </StrictMode>
);
