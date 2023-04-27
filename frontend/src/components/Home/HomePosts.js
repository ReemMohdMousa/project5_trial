import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Comments from "../Comments";
// import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
// import { format } from "timeago.js";
import UpdatePost from "../AddPost/UpdatePost";
import Likes from "../Posts/Likes";
const HomePosts = ({ post ,socket}) => {
  const [show, setShow] = useState(false);
  // const handleShow = () => setShow(true);
  const [openComments, setopenComments] = useState(false);

  // const dispatch = useDispatch();

  // const { userinfo, token, userId } = useSelector((state) => {
  //   return {
  //     userinfo: state.auth.userinfo,
  //     token: state.auth.token,
  //     userId: state.auth.userId,
  //   };
  // });

  return (
    post && (
      <div className="posts">
        <div className="container">
          <div className="user">
            <div className="userInfo">
              <img
                src={
                  post.avatar
                    ? post.avatar
                    : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                }
                alt="img"
              />
              <div className="details">
                <Link
                  to={`/profile/${post.user_id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">
                    {post.firstname} {post.lastname}
                  </span>
                </Link>
                {/* <span className="date">{format(post.created_at)}</span> */}
              </div>
            </div>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-three-dots"
                  viewBox="0 0 16 16"
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
                  Edit Post
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">Delete Post</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="contant">
            <p>{post.content}</p>
            <img src={post.image} alt="img" />
            <embed className="embed" type="video/webm" src={post.video} />
          </div>

          <div className="infomation">
            {post.post_id && <Likes post_id={post.post_id} post={post} />}

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
            <div className="item">
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
            </div>
          </div>
          {/*condition comments  */}

          {openComments && <Comments id={post.post_id} socket={socket}/>}

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

export default HomePosts;
