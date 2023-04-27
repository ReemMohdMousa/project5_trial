import React, { useState } from "react";
import "./message.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
// import { useNavigate, useParams, Outlet } from "react-router-dom";

const Messages = ({ mine, message }) => {

  // console.log("************", message);
  const [friendInfo, setFriendInfo] = useState(null);

  //dispatch
  const dispatch = useDispatch();

  const { userinfo} = useSelector((state) => {
    return {
      userinfo: state.auth.userinfo,
    };
  });

  return (
    <div>
      <div className={mine ? "my message" : "message"}>
        <div className="messageTop">
          <img
            className="messageImg"
            src={
              mine
                ? userinfo
                  ? userinfo.avatar
                  : friendInfo
                  ? friendInfo.avatar
                  : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
            }
            alt="img"
          />
          <p className="messageText">{message.text}</p>
        </div>
        <div className="messageBottom"> {message.createdAt}</div>
      </div>
    </div>
  );
};

export default Messages;
