import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Title } from "./pages/Title";
import { Setup } from "./pages/Setup";
import { Play } from "./pages/Play";
import { Result } from "./pages/Result";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Title />} />
        <Route path="/Setup" element={<Setup />} />
        <Route path="/Play" element={<Play />} />
        <Route path="/Result" element={<Result />} />
        {/* 404ページ（どのパスにも一致しない場合） */}
        <Route path="*" element={<Title />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
