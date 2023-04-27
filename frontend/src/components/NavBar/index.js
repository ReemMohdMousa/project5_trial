import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBCollapse,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLogout } from "../redux/reducers/auth";
import NavFriendReq from "./NavFriendReq";
import SocketNotifications from "./SocketNotifications";
import Notifications from "./Notifications";
import { io } from "socket.io-client";
import { useSocket } from "../../App";
const NavBar = () => {
  const [showBasic, setShowBasic] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const socket = useSocket(io);
  //useNavigate
  const navigate = useNavigate();

  //useDispatch
  const dispatch = useDispatch();

  //redux login states
  const { token, userId, isLoggedIn, roleId, newMsg } = useSelector((state) => {
    //return object contains the redux states
    return {
      token: state.auth.token,
      isLoggedIn: state.auth.isLoggedIn,
      userId: state.auth.userId,
      roleId: state.auth.roleId,
      newMsg: state.messenger.newMsg,
    };
  });

  //get user info, so i could use user info, such as name and pic
  //! to be used in advance
  useEffect(() => {
    axios
      .get(`https://project5-trial33.onrender.com/users/info`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        // console.log(response.data.info);
      })
      .catch(function (error) {
        throw error;
      });
  }, []);

  //navigations functions
  const goToMyProfile = () => {
    navigate(`/profile/${userId}`);
    setShowBasic(false);
  };

  const login = () => {
    navigate(`/login`);
    setShowBasic(false);
  };

  const register = () => {
    navigate(`/register`);
    setShowBasic(false);
  };

  const goToHome = () => {
    navigate(`/home`);
    setShowBasic(false);
  };

  const searchNow = () => {
    navigate(`/home/${searchValue}`);
    setShowBasic(false);
  };

  const goToMessenger = () => {
    navigate(`/messenger`);
    setShowBasic(false);
  };

  return (
    <div>
      {roleId == 1 ? (
        ""
      ) : isLoggedIn ? (
        <MDBNavbar expand="lg" light bgColor="light">
          <MDBContainer fluid>
            <MDBNavbarBrand href="#">Brand</MDBNavbarBrand>

            <MDBNavbarToggler
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{ border: " 1px solid black" }}
              onClick={() => setShowBasic(!showBasic)}
            >
              <MDBIcon icon="bars" fas />
            </MDBNavbarToggler>

            <MDBCollapse navbar show={showBasic}>
              <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
                <MDBNavbarItem
                  onClick={() => {
                    goToHome();
                  }}
                >
                  <MDBNavbarLink active aria-current="page" href="#">
                    Home
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem
                  onClick={() => {
                    goToMyProfile();
                  }}
                >
                  <MDBNavbarLink href="#">Profile</MDBNavbarLink>
                </MDBNavbarItem>

                <MDBNavbarItem
                  onClick={() => {
                    goToMessenger();
                  }}
                >
                  <MDBNavbarLink href="#" className={newMsg ? "newMsg" : ""}>
                    Messenger
                  </MDBNavbarLink>
                </MDBNavbarItem>

                <MDBNavbarItem>
                  <MDBNavbarLink href="#">
                    <NavFriendReq />
                  </MDBNavbarLink>
                </MDBNavbarItem>

                <MDBNavbarItem>
                  <MDBNavbarLink>
                    <Notifications />
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem
                  onClick={() => {
                    dispatch(setLogout());
                    setShowBasic(false);
                    navigate("/login");
                  }}
                >
                  <MDBNavbarLink href="#">Logout</MDBNavbarLink>
                </MDBNavbarItem>
              </MDBNavbarNav>

              <form className="d-flex input-group w-auto">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
                <MDBBtn color="primary" onClick={searchNow}>
                  Search
                </MDBBtn>
              </form>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      ) : (
        <MDBNavbar expand="lg" light bgColor="light">
          <MDBContainer fluid>
            <MDBNavbarBrand href="#">Brand</MDBNavbarBrand>

            <MDBNavbarToggler
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{ border: " 1px solid black" }}
              onClick={() => setShowBasic(!showBasic)}
            >
              <MDBIcon icon="bars" fas />
            </MDBNavbarToggler>

            <MDBCollapse navbar show={showBasic}>
              <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
                <MDBNavbarItem
                  onClick={() => {
                    login();
                  }}
                >
                  <MDBNavbarLink active aria-current="page" href="#">
                    Login
                  </MDBNavbarLink>
                </MDBNavbarItem>

                <MDBNavbarItem
                  onClick={() => {
                    register();
                  }}
                >
                  <MDBNavbarLink active>Register</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <SocketNotifications socket={socket} />
                </MDBNavbarItem>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      )}
    </div>
  );
};

export default NavBar;
