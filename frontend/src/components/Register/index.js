import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin, setUserId, setRoleId } from "../redux/reducers/auth";
import { GoogleLogin } from "@react-oauth/google";
import { setUserInfo } from "../redux/reducers/auth";

import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, token, userinfo, userId } = useSelector((state) => {
    return {
      isLoggedIn: state.auth.isLoggedIn,
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
    };
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const createAccount = () => {
    if (firstName && lastName && email && password && age && repassword) {
      if (repassword === password) {
        if (!document.getElementById("agree").checked) {
          setShow(true);
          setMessage("If you agree with the terms, check the Agree check box");
        } else {
          axios
            .post("https://project5-trial33.onrender.com/users/register", {
              firstName,
              lastName,
              email,
              password,
              age,
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
        }
      } else {
        setShow(true);
        setMessage("Password and Confirm password doesn't match");
      }
    } else {
      setShow(true);
      setMessage("Please Enter all fields");
    }
  };

  const loginGoogle = (result) => {
    const { credential, clientId } = result;
    axios
      .post("https://project5-trial33.onrender.com/users/google", {
        credential,
        clientId,
      })
      .then((res) => {
        const { family_name, given_name, email } = res.data;
        const fakePass = family_name + 123456;

        axios
          .post("https://project5-trial33.onrender.com/users/register", {
            firstName: given_name,
            lastName: family_name,
            email,
            password: fakePass,
          })
          .then((result) => {
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("userId", result.data.userId);
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("roleId", 2);
            dispatch(setRoleId(2));
            dispatch(setLogin(result.data.token));
            dispatch(setUserId(result.data.userId));
          })
          .catch((err) => {
            if (err.response.data.message === "The email already exists") {
              axios
                .post("https://project5-trial33.onrender.com/users/login", {
                  email,
                  password: fakePass,
                })
                .then((result) => {
                  localStorage.setItem("token", result.data.token);
                  localStorage.setItem("userId", result.data.userId);
                  localStorage.setItem("isLoggedIn", true);
                  dispatch(setLogin(result.data.token));
                  dispatch(setUserId(result.data.userId));
                })
                .catch((err) => {
                  setShow(true);
                  setMessage(err.response.data.message);
                });
            } else {
              setShow(true);
              setMessage(err.response.data.message);
            }
          });
      });
  };
  const getAllUserInfo = () => {
    axios
      .get(`https://project5-trial33.onrender.com/users/info`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((Response) => {
        dispatch(setUserInfo(Response.data.info));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
      getAllUserInfo();
    }
  });

  return (
    <MDBContainer
      fluid
      className="d-flex align-items-center justify-content-center bg-image"
      style={{
        backgroundImage:
          "url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)",
      }}
    >
      <div className="mask gradient-custom-3"></div>
      <MDBCard className="m-5" style={{ maxWidth: "600px" }}>
        <MDBCardBody className="px-5">
          <h2 className="text-center mb-5">Create an account</h2>
          <MDBInput
            wrapperClass="mb-4"
            label="First Name"
            size="lg"
            id="form1"
            type="text"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Last Name"
            size="lg"
            id="form12"
            type="text"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Age"
            size="lg"
            id="form2"
            type="number"
            onChange={(e) => setAge(e.target.value)}
          />

          <MDBInput
            wrapperClass="mb-4"
            label=" Email"
            size="lg"
            id="form2"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Password"
            size="lg"
            id="form3"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Repeat your password"
            size="lg"
            id="form4"
            type="password"
            onChange={(e) => setRePassword(e.target.value)}
          />
          <div className="d-flex flex-row justify-content-center mb-4">
            <MDBCheckbox
              name="flexCheck"
              id="agree"
              label="I agree all statements in Terms of service"
            />
          </div>
          <MDBBtn
            className="mb-4 w-100 gradient-custom-4"
            size="lg"
            onClick={createAccount}
          >
            Register
          </MDBBtn>
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
    </MDBContainer>
  );
};

export default Register;
