import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import axios from "axios";
import "./syle.css";
import {
  setSentReq,
  setReceivedReq,
  cancelFriendReq,
  setIsAdded,
  setIsReceived,
  declineFriendReq,
  setIsFriend,
  getAlluserFriends,
} from "../redux/reducers/friends/index";

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //dispatch
  const dispatch = useDispatch();

  //redux states
  const { userId, token, sentReq, ReceivedReq, isAdded, isReceived, isFriend } =
    useSelector((state) => {
      //return object contains the redux states
      return {
        userId: state.auth.userId,
        token: state.auth.token,
        sentReq: state.friends.sentReq,
        ReceivedReq: state.friends.ReceivedReq,
        isAdded: state.friends.isAdded,
        isReceived: state.friends.isReceived,
        isFriend: state.friends.isFriend,
      };
    });

  //get all friends of the logged in user
  const getAllFriends = () => {
    axios
      .get(`https://project5-trial33.onrender.com/friends/get/all/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        dispatch(getAlluserFriends(response.data.result));
      })
      .catch(function (error) {
        // throw error
      });
  };

  const ReceivedRequests = () => {
    //*ME => receiver_id

    axios
      .get(`https://project5-trial33.onrender.com/friends/received/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        //response.data.result => array of received requests
        dispatch(setReceivedReq(response.data.result));
      })
      .catch(function (error) {
        throw error;
      });
  };

  const SentRequests = () => {
    //*ME => sender_id

    axios
      .get(`https://project5-trial33.onrender.com/friends/sent/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        // console.log(response.data.result);
        //response.data.result => array of sent requests
        dispatch(setSentReq(response.data.result));
      })
      .catch(function (error) {
        throw error;
      });
  };

  const acceptFriendReq = (sender_id) => {
    axios
      .post(
        `https://project5-trial33.onrender.com/friends/accept`,
        { user2_id: sender_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(function (response) {
        dispatch(setIsFriend(true));
        dispatch(setIsAdded(false));
        dispatch(setIsReceived(false));
      })
      .catch(function (error) {
        throw error;
      });
  };

  useEffect(() => {
    getAllFriends();
    SentRequests();
    ReceivedRequests();
  }, [isAdded, isReceived]);

  //cancel friend request
  const cancelFriendReqFun = (receiver_id) => {
    axios
      .delete(
        `https://project5-trial33.onrender.com/friends/cancel/${receiver_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(function (response) {
        dispatch(setIsAdded(false));
        dispatch(cancelFriendReq(receiver_id));

        // const newSentArr = sentReq.filter((element, i) => {
        //   return element.receiver_id !== receiver_id;
        // });
        // setSentReq(newSentArr);
      })
      .catch(function (error) {
        throw error;
      });
  };

  //decline the friend request
  // when the receiver delete or decline the request
  const declineFriendReqFun = (sender_id) => {
    axios
      .delete(
        `https://project5-trial33.onrender.com/friends/decline/${sender_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(function (response) {
        // console.log(response.data.result);
        dispatch(setIsReceived(false));
        dispatch(declineFriendReq(sender_id));
      })
      .catch(function (error) {
        throw error;
      });
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Friend Requests
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        style={{ width: "500rem" }}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Tabs
          defaultActiveKey="Add Requests"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Add Requests" title="Add Requests">
            <div className="friend-list-body">
              {ReceivedReq &&
                ReceivedReq.map((element) => {
                  return (
                    <div key={element.request_id}>
                      <div className="friend-list">
                        <div className="friend-img-name">
                          <img
                            className="friend-img"
                            alt="img"
                            src={
                              element.avatar ||
                              "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                            }
                          />

                          <p>{element.firstname + " " + element.lastname}</p>
                        </div>
                        <div className="buttons">
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => {
                              acceptFriendReq(element.sender_id);
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => {
                              declineFriendReqFun(element.sender_id);
                            }}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Tab>
          <Tab eventKey="Sent Requests" title="Sent Requests">
            <div className="friend-list-body">
              {sentReq &&
                sentReq.map((element) => {
                  return (
                    <div key={element.request_id}>
                      <div className="friend-list">
                        <div className="friend-img-name">
                          <img
                            className="friend-img"
                            alt="img"
                            src={
                              element.avatar ||
                              "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                            }
                          />

                          <p>{element.firstname + " " + element.lastname}</p>
                        </div>
                        <div className="buttons">
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => {
                              cancelFriendReqFun(element.receiver_id);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Tab>
        </Tabs>

        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Menu>
    </div>
  );
}
