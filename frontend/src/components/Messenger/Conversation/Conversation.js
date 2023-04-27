import axios from "axios";
import React, { useEffect, useState } from "react";
import "./conversation.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Outlet } from "react-router-dom";

import {
  setConversationFriendInfo,
  setNewMsg,
} from "../../redux/reducers/Messenger/index";

const Conversation = ({ Oneconversation, theOpenedConversation }) => {


  const [theFriendId, setTheFriendId] = useState("");
  const [friendInfo, setFriendInfo] = useState({});
  const [isNew, setIsNew] = useState(false);

  const { userinfo, token, userId, newMsg, conversationFriendInfo } =
    useSelector((state) => {
      return {
        userinfo: state.auth.userinfo,
        token: state.auth.token,
        userId: state.auth.userId,
        conversationFriendInfo: state.messenger.conversationFriendInfo,
        newMsg: state.messenger.newMsg,
      };
    });

  const dispatch = useDispatch();

  //render the friend name and picture
  const getFriendId = () => {
    let userFriendId = Oneconversation.members.find((element) => {
      // console.log("*************", element);
      return element != userId;
    });
    setTheFriendId(userFriendId);
  };

  const getFriendInfo = () => {
    theFriendId &&
      axios
        .get(`http://localhost:5000/users/others/info/${theFriendId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(function (response) {
          // console.log("***********************************", response.data);
          dispatch(setConversationFriendInfo(response.data.result));
          setFriendInfo(response.data.result);
        })
        .catch(function (error) {
          throw error;
        });
  };

  const checkIfThereAreNewMsgs = () => {
    // console.log("enterrrrrrrrrrrrr");
    theFriendId &&
      axios
        .get(
          `http://localhost:5000/conversation/new/messages/${Oneconversation._id}/${theFriendId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(function (response) {
          // console.log(response.data);
          if (response.data === true) {
            setIsNew(true);
            dispatch(setNewMsg(true));
          }
        })
        .catch(function (error) {
          throw error;
        });
  };

  const readMessages = () => {
    if (theOpenedConversation?._id === Oneconversation._id) {
      setIsNew(false);
      dispatch(setNewMsg(true));
    }
  };

  useEffect(() => {
    getFriendId();
    getFriendInfo();
    checkIfThereAreNewMsgs();
    readMessages();
  }, [theFriendId, theOpenedConversation, isNew]);

  // console.log(conversationFriendInfo);
  // console.log(theFriendId);
  // console.log(Oneconversation);

  return (
    <div>
      {friendInfo ? (
        <div className="conversation">
          <img
            className="conversationImg"
            src={
              (friendInfo && friendInfo.avatar) ||
              "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
            }
            alt="img"
          />
          <span className={isNew ? "newConvsName" : "conversationName"}>{`${
            friendInfo && friendInfo.firstname
          } ${friendInfo.lastname}`}</span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Conversation;
