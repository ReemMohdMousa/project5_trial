import React, { useEffect } from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import Comments from "../Comments";
import "bootstrap/dist/css/bootstrap.min.css";
import Posts from "../Posts/index";
import { useDispatch, useSelector } from "react-redux";
import { setHomePosts } from "../redux/reducers/posts/index";
import AddPost from "../AddPost";
import { MDBFile } from "mdb-react-ui-kit";
import { useNavigate, useParams } from "react-router-dom";
import HomePosts from "./HomePosts";
import { io } from "socket.io-client";
import { useSocket } from "../../App";

const Home = () => {
  const dispatch = useDispatch();
  const socket = useSocket(io);
  //redux states
  const { token, userId, homePosts } = useSelector((state) => {
    return {
      token: state.auth.token,
      userId: state.auth.userId,
      homePosts: state.posts.homePosts,
    };
  });

  // get all the user's and his friends posts orderd DESC
  const getAllHomePosts = () => {
    axios
      .get(`https://project5-trial2.onrender.com/home/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // console.log("*******", response.data.result);
        dispatch(setHomePosts(response.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    getAllHomePosts();

    socket.connect();
    socket.emit("NEW_USER", userId);
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    console.log(socket);
    socket.on("RECEIVE_NOTIFICATION", (data) => {
      console.log("HI", data);
      setNotification((current) => {
        return { ...current, data };
      });
      socket.on("eee", (data) => {
        console.log(data);
      });

      // setNotification((pre)=>
      // {return [
      //   ...pre,
      //  data
      // ]});
    });
  }, []);

  // useEffect(() => {
  //   socket?.on("GET_USERS", (OnlineUsers) => {
  //     console.log(OnlineUsers);
  //   });
  // }, [userId]);

  const notify = () =>
    toast(`${notification.avatar} ${notification.messagecontent}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  notification !== null && notify();

  return (
    <div>
      <div className="gradient-custom-2" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="9" xl="7">
              <MDBCard>
                <MDBCardBody className="text-black p-4">
                  <MDBRow className="g-2">
                    <MDBCol className="mb-2">
                      <AddPost />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol className="mb-2">
                      {/* dispaly the posts */}
                      {homePosts &&
                        homePosts.map((elem) => {
                          return (
                            <HomePosts
                              post={elem}
                              socket={socket}
                              key={elem.post_id}
                            />
                          );
                        })}
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <div>
        {" "}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default Home;
