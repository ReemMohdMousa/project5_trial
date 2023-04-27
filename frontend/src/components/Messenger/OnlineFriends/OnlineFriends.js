import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import "./OnlineFriends.css";

const OnlineFriends = ({ onlineUsers }) => {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [theFriendId, setTheFriendId] = useState(null);
  const [friendsInfo, setFriendsInfo] = useState([]);
  const [onliners, setOnliners] = useState([]);

  const { token, userId, conversationFriendInfo, friends, conversations } =
    useSelector((state) => {
      return {
        token: state.auth.token,
        userId: state.auth.userId,
        conversationFriendInfo: state.messenger.conversationFriendInfo,
        friends: state.friends.friends,
        conversations: state.messenger.conversations,
      };
    });

  const getOnlineUsersIds = () => {
    setOnliners([]);
    onlineUsers.forEach((element) => {
      onliners.push(Number(element.userId));
      setOnliners(onliners);
    });
  };

  const checkIfAFriendIsOnline = () => {
    const results = friends.filter((frd) => {
      console.log("************", frd.user_id);
      console.log(onliners.includes(frd.user_id));

      if (onliners.includes(frd.user_id)) {
        return frd;
      }
    });
    console.log(results);
    setOnlineFriends(results);
  };

  useEffect(() => {
    getOnlineUsersIds();
  }, [onlineUsers]);

  useEffect(() => {
    checkIfAFriendIsOnline();
  }, [onliners, onlineUsers]);

  console.log("onlineUsers", onlineUsers);
  console.log("onliners", onliners);
  console.log("friends", friends);
  console.log("onlineFriends", onlineFriends);

  // const onlineFriendss = () => {
  //   friends.filter((f) => onlineUsers.some((u) => u.userId === f.userId));
  // };

  // const getFriendId = () => {
  //   let userFriendId = onlineUsers.find((element) => {
  //     return element.userId != userId;
  //   });
  //   setTheFriendId(userFriendId);
  // };

  // const getFriendInfo = () => {
  //   console.log(theFriendId);
  //   theFriendId &&
  //     axios
  //       .get(`http://localhost:5000/users/others/info/${theFriendId.userId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then(function (response) {
  //         console.log(response.data.result);
  //         //   friendsInfo.push(response.data.result);
  //         setFriendsInfo([...friendsInfo, response.data.result]);

  //         //   friendsInfo.forEach((element) => {
  //         //     console.log(element.user_id);
  //         //     console.log(theFriendId.userId);
  //         //     if (element.user_id == theFriendId.userId) {
  //         //       setFriendsInfo(friendsInfo);
  //         //     } else {
  //         //       setFriendsInfo([...friendsInfo, response.data.result]);
  //         //     }
  //         //   });
  //       })
  //       .catch(function (error) {
  //         throw error;
  //       });
  // };

  // // useEffect(() => {
  // //   getFriendId();
  // //   getFriendInfo();
  // // }, [theFriendId]);

  // console.log(friendsInfo);

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div
          key={o.user_id}
          className="chatOnlineFriend"
          // onClick={() => handleClick(o)}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.avatar ||
                "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
              }
              alt="img"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{`${o && o.firstname} ${
            o.lastname
          }`}</span>
        </div>
      ))}
    </div>
  );
};

export default OnlineFriends;
