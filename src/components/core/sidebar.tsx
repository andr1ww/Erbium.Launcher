"use client";

import { HiOutlineHome, HiOutlineCog, HiOutlineFolder } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Sidebar({ page }: { page: { page: string } }) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedState = sessionStorage.getItem("sidebar");

    if (savedState !== null) {
      setIsCollapsed(savedState === "true");
    }

    setIsLoaded(true);

    const handleResize = () => {
      if (savedState === null) {
        setIsCollapsed(window.innerWidth < 768);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem("sidebar", isCollapsed.toString());
    }
  }, [isCollapsed, isLoaded]);

  const frameUpdate = (route: string) => {
    router.push("/" + route);
  };

  const navItems = [
    { route: "Home", icon: HiOutlineHome, label: "Home", path: "home" },
    {
      route: "Library",
      icon: HiOutlineFolder,
      label: "Library",
      path: "library",
    },
  ];

  const getIconClassName = (route: string) => {
    return route === page.page
      ? "text-white w-6 h-6 transition-all duration-300 group-hover:text-gray-100"
      : "text-gray-400 w-6 h-6 transition-all duration-300 group-hover:text-white";
  };

  const getItemClassName = (route: string) => {
    return `${
      route === page.page
        ? "bg-gray-700/80 shadow-md hover:bg-gray-700"
        : "hover:bg-gray-800/50"
    } p-2.5 rounded-lg transition-all duration-300 w-full flex items-center group`;
  };

  const getLabelClass = (route: string) => {
    return route === page.page
      ? "ml-3 text-white text-sm font-medium transition-all duration-300"
      : "ml-3 text-gray-400 text-sm transition-all duration-300 group-hover:text-gray-200";
  };

  if (!isLoaded) {
    return (
      <div className="h-screen bg-gradient-to-b from-black to-gray-900"></div>
    );
  }

  return (
    <div className="h-screen">
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-56"
        } bg-black/50 h-full shadow-2xl border-r  border-gray-800 transition-all duration-300 relative flex flex-col px-3 py-4`}
      >
        <div className="flex justify-center mb-12">
          <Image
            src="/Logo.png"
            alt="Icon"
            width={isCollapsed ? 50 : 70}
            height={isCollapsed ? 50 : 70}
            className="filter brightness-110 transition-all duration-300"
          />
        </div>

        <nav
          className={`flex flex-col gap-1.5 w-full transition-all duration-300 ${
            isCollapsed ? "mt-[19vh]" : "mt-1"
          }`}
        >
          {navItems.map((item) => (
            <div key={item.route} className={getItemClassName(item.route)}>
              <button
                className="flex items-center w-full ml-1.5"
                onClick={() => frameUpdate(item.path)}
              >
                <item.icon className={getIconClassName(item.route)} />
                <span
                  className={`${getLabelClass(item.route)} ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </div>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <div className={getItemClassName("Settings")}>
            <button
              className="flex items-center w-full ml-1.5"
              onClick={() => frameUpdate("settings")}
            >
              <HiOutlineCog className={getIconClassName("Settings")} />
              <span
                className={`${getLabelClass("Settings")} ${
                  isCollapsed ? "hidden" : "block"
                }`}
              >
                Settings
              </span>
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="bg-gray-800/30 p-1.5 rounded-full shadow-md hover:bg-gray-700 transition-all flex items-center space-x-1 border border-gray-700/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-gray-300 transition-all duration-300 ${
                  isCollapsed ? "rotate-0" : "rotate-180"
                }`}
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              {!isCollapsed && (
                <span className="text-gray-300 text-xs pr-1">Collapse</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
