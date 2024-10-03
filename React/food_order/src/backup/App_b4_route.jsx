// import React, { useState, useEffect } from "react";
// import api from "./api";

import React from "react";

import Day from "./components/day"
import Menu from "./components/menu"
import Checkout from "./components/checkout"

const App = () => {  

  return (    
    <div>    
      {/* <nav className="nav navbar-dark bg-primary"> */}
        {/* <div className="container-fluid"> */}
        {/* <div className="container"> */}
          {/* <a className="navbar-brand" href="/">
            兩餸飯
          </a> */}
          {/* <h5 className="navbar-brand">兩餸飯</h5>
        </div>
      </nav> */}

      <div className="container">
        <br />
        <Day />
        <br />
        <Menu/>
        <br />
        <Checkout />
        <br />
      </div>

    </div>
  );
};

export default App;
