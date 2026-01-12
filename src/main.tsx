import { useEffect } from "react";
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

// Discord RPC
import { RpcStart, RpcStop } from "@/utils/rpc";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const App = () => {
  const location = useLocation();


  useEffect(() => {
    RpcStart();

    return () => {
      RpcStop();
    };
  }, []);

  useEffect(() => {
    const updateRpcForPage = async () => {
      switch (location.pathname) {
        case "/":
          await RpcStart({
            details: "Logging in",
            state: "Authentication",
            enable_timer: false,
          });
          break;
        case "/home":
          await RpcStart({
            details: "In home",
            enable_timer: true,
          });
          break;
        case "/library":
          await RpcStart({
            details: "In Library",
            enable_timer: true,
          });
          break;
        case "/settings":
          await RpcStart({
            details: "In Settings",
            enable_timer: true,
          });
          break;
        default:
          await RpcStart({
            details: "Using Erbium Launcher",
            state: "Looking",
            enable_timer: true,
          });
      }
    };

    updateRpcForPage();
  }, [location.pathname]);

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