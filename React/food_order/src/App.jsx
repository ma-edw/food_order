// import React, { useState, useEffect } from "react";
// import api from "./api";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Day from "./components/day"
import Menu from "./components/menu"
import Checkout from "./components/checkout"

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Day />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
