import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Title from "./pages/Title";
import Setup from "./pages/Setup";
import SetChara from "./pages/SetChara";
import Play from "./pages/Play";
import Result from "./pages/Result";
import useDirection from "./features/camera/hooks/useDirection";
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";
// import heroImg from "./assets/hero.png";
import "./App.css";
// import Title from "./pages/Title";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Title />} />
        <Route path="/Setup" element={<Setup />} />
        <Route path="/SetChara" element={<SetChara />} />
        <Route path="/Play" element={<Play />} />
        <Route path="/Result" element={<Result />} />
        {/* 404ページ（どのパスにも一致しない場合） */}
        <Route path="*" element={<Title />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
