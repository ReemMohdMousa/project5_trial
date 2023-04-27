import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setLogin,
  setUserId,
  setUserInfo,
  setRoleId,
} from "../redux/reducers/auth";
import { GoogleLogin } from "@react-oauth/google";

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, token, userinfo, userId, roleId } = useSelector(
    (state) => {
      return {
        isLoggedIn: state.auth.isLoggedIn,
        userinfo: state.auth.userinfo,
        token: state.auth.token,
        userId: state.auth.userId,
        roleId: state.auth.roleId,
      };
    }
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const login = () => {
    axios
      .post("http://localhost:5000/users/login", {
        email,
        password,
      })
      .then((result) => {
         
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("userId", result.data.userId);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("roleId", result.data.roleId);
        dispatch(setRoleId(result.data.roleId));

        dispatch(setLogin(result.data.token));
        dispatch(setUserId(result.data.userId));
      })
      .catch((error) => {
        setShow(true);
        setMessage(error.response.data.message);
      });
  };

  useEffect(() => {
    if (isLoggedIn && roleId == 1) {
      navigate("/dashboard");
      getAllUserInfo();
    }
    if (isLoggedIn && roleId == 2) {
      navigate("/home");
      getAllUserInfo();
    }
  });

  const loginGoogle = (result) => {
    const { credential, clientId } = result;
    axios
      .post("http://localhost:5000/users/google", {
        credential,
        clientId,
      })
      .then((res) => {
        const { family_name, email } = res.data;
        const fakePass = family_name + 123456;

        axios
          .post("http://localhost:5000/users/login", {
            email,
            password: fakePass,
          })
          .then((result) => {
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("userId", result.data.userId);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("roleId", 2);
            dispatch(setLogin(result.data.token));
            dispatch(setUserId(result.data.userId));
            dispatch(setRoleId(2));
          })
          .catch((err) => {
            setShow(true);
            setMessage(err.response.data.message);
          });
      });
  };
  const getAllUserInfo = () => {
    axios
      .get(`http://localhost:5000/users/info`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((Response) => {
        dispatch(setUserInfo(Response.data.info));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="cont">
      <MDBContainer fluid>
        <MDBRow className="d-flex justify-content-center align-items-center h-100">
          <MDBCol col="12">
            <MDBCard
              className="bg-dark text-white my-5 mx-auto"
              style={{ borderRadius: "1rem", maxWidth: "400px" }}
            >
              <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
                <h2 className="fw-bold mb-2">Sign to your account</h2>
                <br />
                <br />

                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Email address"
                  id="formControlLg"
                  type="email"
                  size="lg"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  labelClass="text-white"
                  label="Password"
                  id="formControlLg1"
                  type="password"
                  size="lg"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <MDBBtn
                  outline
                  className="mx-2 px-5"
                  color="white"
                  size="lg"
                  onClick={(e) => {
                    login(e);
                  }}
                >
                  Login
                </MDBBtn>

                <br />
                <br />

                <div>
                  <p className="mb-0">
                    Don't have an account?{" "}
                    <a href="#!" className="text-white-50 fw-bold">
                      Sign Up
                    </a>
                  </p>
                </div>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Message</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{message}</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                <GoogleLogin
                  width={"90000px"}
                  theme={"filled_black"}
                  size={"large"}
                  onSuccess={loginGoogle}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default Login;
