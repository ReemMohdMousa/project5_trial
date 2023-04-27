import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const NewUsers = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/count/newuser/details`)
      .then((result) => {
        setRows(result.data.detail);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="dashboard">
    <Sidebar />
    <TableContainer component={Paper} className="table">
      <Table style={{ width: "70%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Row Number</TableCell>
            <TableCell className="tableCell">User Name</TableCell>
            <TableCell className="tableCell">Age</TableCell>
            <TableCell className="tableCell">Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows &&
            rows.map((row, id) => (
              <TableRow key={id}>
                <TableCell className="tableCell">{id+1}</TableCell>
                <TableCell className="tableCell">
                  <div
                    id={row.user_id}
                    style={{ cursor: "pointer" }}
                    className="cellWrapper"
                    onClick={(e) => {
                      const id = e.target.id;
                      console.log(">>>>", id);
                      navigate(`/profile/${id}`);
                    }}
                  >
                    <img
                      id={row.user_id}
                      className="friend-img"
                      src={
                        row.avatar ||
                        "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                      }
                    />
                    &nbsp; {row.username}
                  </div>
                </TableCell>
                <TableCell className="tableCell">{row.age}</TableCell>
                <TableCell className="tableCell">{row.email}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
};

export default NewUsers;
