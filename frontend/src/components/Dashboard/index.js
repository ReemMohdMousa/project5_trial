import React from "react";
import Sidebar from "./Sidebar";
import "./style.css";
import Widget from "./Widget";
import Featured from "./Featured";
import Chart from "./Chart";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
   
      <div className="homeContainer">
        <div className="widgets">
          <Widget type="user" />
          <Widget type="posts" />
          <Widget type="likes" />
          <Widget type="newUser" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Posts per hour" aspect={2 / 1} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
