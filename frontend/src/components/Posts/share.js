// import React, { useState, useEffect } from "react";
// import "./style.css";
// import { Link } from "react-router-dom";
// import Comments from "../Comments";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { setUserInfo } from "../redux/reducers/auth/index";
// import Dropdown from "react-bootstrap/Dropdown";
// import { format } from "timeago.js";
// import Iframe from "react-iframe";
// import UpdatePost from "../AddPost/UpdatePost";
// import { removePost } from "../redux/reducers/posts/index";
// import Likes from "./Likes";
// import {
//   setComments,
//   addComment,
//   sharepost,
// } from "../redux/reducers/posts/index";

// const Share = ({ post, firstname, lastname }) => {
//   const [show, setShow] = useState(false);
//   const handleShow = () => setShow(true);

//   const dispatch = useDispatch();

//   const { userinfo, token, userId, posts } = useSelector((state) => {
//     return {
//       posts: state.posts.posts,
//       userinfo: state.auth.userinfo,
//       token: state.auth.token,
//       userId: state.auth.userId,
//     };
//   });

//   const sharePost = async (e) => {
//     const post_id = e.target.id;
//     try {
//       await axios
//         .post(
//           `https://project5-trial33.onrender.com/share`,
//           { content, post_id },
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         .then((result) => {
//           console.log(result);
//           dispatch(sharepost());
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <div className="item" id={post.post_id} onClick={sharePost}>
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="16"
//         height="16"
//         fill="currentColor"
//         className="bi bi-send"
//         viewBox="0 0 16 16"
//         id={post.post_id}
//       >
//         <path
//           id={post.post_id}
//           d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
//         />
//       </svg>
//       share
//     </div>
//   );
// };

// export default Share;
