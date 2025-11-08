import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import "@/css/index.css";

// Components
import Frame from "@/components/Global/Frame";
import Particles from "@/components/Global/Particles";
import Sidebar from "@/components/Global/Sidebar";

// Pages
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Library from "@/pages/Library";
import Settings from "@/pages/Settings";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const App = () => {
  const location = useLocation();

  return (
    <>
      <Frame />
      <Particles quantity={220} />

      {location.pathname !== "/" && <Sidebar />}

      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/home"
          element={<Home />}
        />
        <Route
          path="/library"
          element={<Library />}
        />
        <Route
          path="/settings"
          element={<Settings />}
        />
      </Routes>
    </>
  );
};

document.addEventListener("contextmenu", e => e.preventDefault());

root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
