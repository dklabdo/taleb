import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import List from "./List.jsx";
import Add from "./Add.jsx";
import AppProvider from "./AppProvider.jsx";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient} >
    <AppProvider>
      <BrowserRouter>
        <StrictMode>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/list" element={<List />} />
            <Route path="/add" element={<Add />} />
          </Routes>
        </StrictMode>
      </BrowserRouter>
    </AppProvider>
  </QueryClientProvider>
);
