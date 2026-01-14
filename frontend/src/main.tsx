// frontend/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { setTokenGetter } from "./api/token";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function TokenBridge({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  React.useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);

  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <TokenBridge>
        <App />
      </TokenBridge>
    </ClerkProvider>
  </React.StrictMode>
);
