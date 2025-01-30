import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar";
import Dashboard from "../../pages/Dashboard/Dashboard"; 

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Dashboard />
    </div>
  );
};

export default Home; 
