import React, { useState, useEffect } from "react";
import axios from "axios";

import "./style.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
 
const Featured = () => {
  const [val, setval] = useState(0);
  const [avg, setAvg] = useState(0);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/count/newpost`)
      .then((result) => {
        const value1 = result.data.reduce((acc, elem) => {
          return Number(elem.count) - acc;
        }, 0);
        const value = result.data.reduce((acc, elem) => {
          return acc + Number(elem.count);
        }, 0);
        setval(() => {
          return Math.abs(value1 / (value / result.data.length));
        });
        setAvg(value / result.data.length);
      })
      .catch((error) => {
        //  console.log(error);
      });
  }, []);
  if (!val) {
    return (
      <h1>
        <div className="spinner-grow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </h1>
    );
  }
  return (
    <div className="featured">
      <div className="f-top">
        <h1 className="f-title">Post Precentege</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <br/>

      <div className="f-bottom">
        <div className="featuredChart">
          <CircularProgressbar
            value={val * 100}
            text={`${val * 100}%`}
            strokeWidth={5}
          />
        </div>
        
        <p className="f-title">Average posts per day</p>
        <p className="f-amount">{avg}</p>
      </div>
    </div>
  );
};

export default Featured;
