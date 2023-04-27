import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setTheOpenedConversation,
  setConversations,
} from "../redux/reducers/Messenger/index";

const SendMessage = ({ id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //redux states
  const { posts, userinfo, token, userId, conversations } = useSelector(
    (state) => {
      return {
        token: state.auth.token,
        userId: state.auth.userId,
        conversations: state.messenger.conversations,
      };
    }
  );

  //get all user's conversations
  const getAllUserConversations = () => {
    axios
      .get(`http://localhost:5000/conversation/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(function (response) {
        // console.log(response.data);
        dispatch(setConversations(response.data));
      })
      .catch(function (error) {
        throw error;
      });
  };

  useEffect(() => {
    getAllUserConversations();
  }, []);

  // console.log(conversations);

  const sendMessageFunc = () => {
    // dispatch(setOpenConversation(true));

    const conversation = conversations?.filter((element) => {
      if (element.members.includes(Number(id))) {
        return element;
      }
    });

    // console.log(conversation);

    if (conversation.length !== 0) {
      navigate(`/messenger`);
      dispatch(setTheOpenedConversation(conversation[0]));
    } else {
      console.log("enteeer");
      axios
        .post(
          `http://localhost:5000/conversation/`,
          { sender_id: userId, receiver_id: id },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then(function (response) {
          console.log(response.data);
          dispatch(setTheOpenedConversation(response.data));
          dispatch(setConversations([...conversations, response.data]));
          navigate(`/messenger`);
        })
        .catch(function (error) {
          throw error;
        });
    }
  };

  return (
    <div>
      {userId == id ? "" : <Button onClick={sendMessageFunc}>Message</Button>}
    </div>
  );
};

export default SendMessage;
