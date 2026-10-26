import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ModulePage from "./pages/ModulePage";
import NotFoundPage from "./pages/NotFoundPage";
import RouteEffects from "./components/RouteEffects";

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/modules/:slug" element={<ModulePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
