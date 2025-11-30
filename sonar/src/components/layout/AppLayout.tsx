import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Główna zawartość strony */}
      <div className="flex-1 pb-16">
        {" "}
        {/* Padding bottom równy wysokości navbara, żeby treść nie wchodziła pod pasek */}
        <Outlet />
      </div>

      {/* Pasek nawigacji na dole */}
      <BottomNav />
    </div>
  );
};

export default AppLayout;
