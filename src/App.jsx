import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ModulePage from "./pages/ModulePage";
import SignInPage from "./pages/SignInPage";
import NotFoundPage from "./pages/NotFoundPage";
import RouteEffects from "./components/RouteEffects";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route
          path="/modules/:slug"
          element={
            <RequireAuth>
              <ModulePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
