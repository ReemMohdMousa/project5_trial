import React, { useState, useEffect } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import Comments from "../Comments";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserInfo } from "../redux/reducers/auth/index";
import Dropdown from "react-bootstrap/Dropdown";
// import {format} from "timeago.js";
import Iframe from "react-iframe";
import UpdatePost from "../AddPost/UpdatePost";
import { removePost } from "../redux/reducers/posts/index";
import Likes from "./Likes";
import { setComments, addComment } from "../redux/reducers/posts/index";
import { io } from "socket.io-client";
import { useSocket } from "../../App";
const Posts = ({ post, firstname, lastname }) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const socket = useSocket(io);
  const [openComments, setopenComments] = useState(false);
  const dispatch = useDispatch();

  const { userinfo, token, userId, posts } = useSelector((state) => {
    return {
      posts: state.posts.posts,
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
    };
  });

  const deletePost = async (id) => {
    try {
      await axios
        .delete(`http://localhost:5000/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          dispatch(removePost(id));
        });
      //getAllP();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    userinfo && (
      <div className="posts">
        <div className="containers">
          <div className="user">
            <div className="userInfo">
              <img
                src={
                  userinfo.avatar
                    ? userinfo.avatar
                    : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                }
                alt="img"
              />
              <div className="details">
                <Link
                  to={`/profile/${userId}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">
                    {firstname} {lastname}
                  </span>
                </Link>
                {/* <span className="date">{timeago.format(post.created_at)}</span> */}
              </div>
            </div>
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                id="dropdown-basic"
                style={{ backgroundColor: "inherit" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  className="bi bi-three-dots"
                  onClick={() => {}}
                >
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  Edit
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    deletePost(post.post_id);
                  }}
                >
                  Delete Post
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="contant">
            {post.content && <p>{post.content}</p>}
            {post.image && <img src={post.image} alt="img" />}
            {post.video && (
              <embed
                width="100%"
                height="300px"
                className="embed"
                type="video/webm"
                src={post.video}
              />
            )}
          </div>
          <br></br>
          <div className="infomation">
            {post.post_id && (
              <Likes post_id={post.post_id} post={post} socket={socket} />
            )}

            <div
              onClick={() => {
                setopenComments(!openComments);
              }}
              className="item"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-chat-left"
                viewBox="0 0 16 16"
              >
                <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              </svg>{" "}
              comments
            </div>
            {/*   <div className="item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-send"
                viewBox="0 0 16 16"
              >
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
              </svg>
              share
            </div> */}
          </div>
          {/*condition comments  */}

          {openComments && post.post_id && (
            <Comments
              id={post.post_id}
              firstname={firstname}
              lastname={lastname}
              socket={socket}
            />
          )}

          {show ? (
            <UpdatePost showModal={show} post={post} setShowModal={setShow} />
          ) : (
            ""
          )}
        </div>
      </div>
    )
  );
};

export default Posts;
