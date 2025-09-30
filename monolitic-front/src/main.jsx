
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./services/keycloak";

createRoot(document.getElementById("root")).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <App />
  </ReactKeycloakProvider>
);
