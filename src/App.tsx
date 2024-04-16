import React from "react";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <div>헤더입니다.</div>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
