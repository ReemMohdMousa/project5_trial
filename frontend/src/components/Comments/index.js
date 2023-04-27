import React, { useEffect, useState } from "react";
import "./style.css";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBInput,
  MDBTypography,
} from "mdb-react-ui-kit";
// import { format } from "timeago.js";
import Modal from "react-bootstrap/Modal";
import { MDBFile } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import InputEmoji from "react-input-emoji";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import posts, {
  setComments,
  addComment,
  removeComment,
  setNestedComments,
  addNested,
} from "../redux/reducers/posts/index";
import UpdateComment from "./UpdateComment";
const Comments = ({ id, firstname, lastname, socket }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [selectedimage, setSelectedImage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const [comments, setcomments] = useState(null);
  const [emoji, setEmoji] = useState(false);
  const [text, setText] = useState("");
  const [currentEmoji, setCurrentEmoji] = useState("");
  const [allnested, setAllNested] = useState(null);
  const [newnrested, setNewNested] = useState({});
  function handleOnEnter(text) {}
  const [nemcomment, setNewComment] = useState({});


  const { userinfo, token, userId, posts } = useSelector((state) => {
    return {
      userinfo: state.auth.userinfo,
      token: state.auth.token,
      userId: state.auth.userId,
      posts: state.posts.posts,
    };
  });

  const uploadImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "kowezfsv");
    data.append("cloud_name", "deqwvkyth");
    fetch("  https://api.cloudinary.com/v1_1/deqwvkyth/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        //setpost()

        setNewComment((image) => {
          setDisabled(false);

          return { ...image, image: data.url };
        });
      })
      .catch((err) => console.log(err));
  };
  const getAllNestedCommentsBycommentId = (post_id, comment_id) => {
    axios
      .get(
        `http://localhost:5000/comments/getnested?comment_id=${comment_id}&post_id=${post_id}`
      )

      .then((Response) => {
        let nestedcomments = Response.data.result;
        //this is for local use state
        console.log(Response.data.result);
        setAllNested(Response.data.result);
        //this is for redux
        dispatch(setNestedComments({ post_id, comment_id, nestedcomments }));

        //console.log(allnested);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const createNestedComment = (post_id, comment_id) => {
    axios
      .post(
        `http://localhost:5000/comments/nested?comment_id=${comment_id}&post_id=${post_id}`,
        { ...newnrested },
        { headers: { Authorization: token } }
      )
      .then((Response) => {
        let nestedcomment = Response.data.result;
        console.log(Response.data.result);
        dispatch(addNested({ post_id, comment_id, nestedcomment }));
        getAllNestedCommentsBycommentId(post_id, comment_id);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getAllCommentsByPostId = (id) => {
    axios
      .get(`http://localhost:5000/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((Response) => {
        let comments = Response.data.result;
        //this is for local use state
        console.log(Response.data.result);
        setcomments(comments);
        //this is for redux
        dispatch(setComments({ id, comments }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewComment = () => {
    axios
      .post(
        `http://localhost:5000/comments/${id}`,
        {
          ...nemcomment,
        },
        { headers: { Authorization: token } }
      )
      .then((Response) => {
        console.log(Response.data);
        let newComment = Response.data.result;

        socket.emit("aaa", {
          A:11
        })
        socket &&
          socket.emit("SEND_NOTIFICATION", {
            firstname: Response.data.firstname,
            lastname: Response.data.lastname,
            avatar: Response.data.avatar,
            receiver: Response.data.receiver,
            messagecontent: Response.data.messagecontent,
          });
        dispatch(addComment({ id, newComment }));
        getAllCommentsByPostId(id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = async (post_id, comment_id) => {
    try {
      await axios
        .delete(`http://localhost:5000/comments/comment/${comment_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          dispatch(removeComment({ post_id, comment_id }));
        });
      getAllCommentsByPostId(id);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCommentsByPostId(id);
  }, []);

  return (
    <>
      <section className="gradient-custom vh-100">
        <MDBContainer className="py-5" style={{ maxWidth: "1000px" }}>
          <MDBRow className="justify-content-center">
            <MDBCol md="12" lg="10" xl="8">
              <MDBCard>
                <MDBCardBody className="p-4">
                  <MDBRow>
                    <MDBCol>
                      <div
                        className="d-flex flex-start"
                        style={{ border: "solid red", marginTop: "-40px" }}
                      >
                        <MDBCardImage
                          className="rounded-circle shadow-1-strong me-3"
                          src={
                            userinfo.avatar
                              ? userinfo.avatar
                              : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                          }
                          alt="img"
                          width="65"
                          height="65"
                        />

                        <div className="flex-grow-1 flex-shrink-1">
                          <div>
                            <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-1">
                                {userinfo.firstname} {userinfo.lastname}
                              </p>
                            </div>
                            <MDBInput
                              style={{ height: "80px" }}
                              wrapperClass="mb-4"
                              placeholder="write a comment..."
                              id="mytextarea"
                              type="text"
                              onChange={(e) => {
                                setNewComment((content) => {
                                  setDisabled(false);

                                  return {
                                    ...content,
                                    content: e.target.value + text,
                                  };
                                });
                              }}
                            />
                            <div className="d-flex justify-content-between align-items-center">
                              {nemcomment.image && (
                                <img
                                  style={{ width: "100px", marginLeft: "20%" }}
                                  variant="success"
                                  src={nemcomment.image}
                                  alt="img"
                                />
                              )}
                              {disabled && (
                                <div>
                                  <p variant="warning">
                                    Please wait untile file uploaded
                                  </p>
                                  <img src="https://media.tenor.com/67b631tr-g0AAAAC/loading-now-loading.gif" alt="img"/>
                                </div>
                              )}
                              {text && text}
                            </div>

                            <div className="commentbtn">
                              <div style={{ margin: "3px" }}>
                                <button
                                  onClick={(e) => {
                                    handleShow();
                                  }}
                                  style={{
                                    border: "none",
                                    backgroundColor: "white",
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="19"
                                    color="gray"
                                    fill="currentColor"
                                    className="bi bi-file-image"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
                                  </svg>
                                </button>

                                <a href="#!">
                                  {/* <MDBIcon fas icon="reply fa-xs" />
                                  <span onClick={()=>{setEmoji(true)}}> 😃</span> */}
                                </a>
                              </div>

                              <button
                                onClick={() => {
                                  addNewComment();
                                }}
                              >
                                comment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {emoji && (
                        <InputEmoji
                          value={text}
                          onChange={setText}
                          cleanOnEnter
                          onEnter={handleOnEnter}
                          selector="#mytextarea"
                          placeholder="Type a message"
                        />
                      )}
                      {comments?.length > 0 &&
                        comments.map((element) => {
                          return (
                            <div
                              className="d-flex flex-start mt-4"
                              key={element.comment_id}
                            >
                              <MDBCardImage
                                className="rounded-circle shadow-1-strong me-3"
                                src={
                                  element.avatar
                                    ? userinfo.avatar
                                    : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                                }
                                alt="avatar"
                                width="65"
                                height="65"
                              />

                              <div className="flex-grow-1 flex-shrink-1">
                                <div>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <p className="mb-1">
                                      {`${element.firstname}   ${element.lastname}`}
                                      <span className="small">
                                        {/* - {format(element.created_at)} */}
                                      </span>
                                    </p>

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
                                            setShowEdit(true);
                                          }}
                                        >
                                          Edit
                                        </Dropdown.Item>

                                        <Dropdown.Item
                                          onClick={() => {
                                            deleteComment(
                                              id,
                                              element.comment_id
                                            );
                                          }}
                                        >
                                          Delete{" "}
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                  {element.content && (
                                    <p className="small mb-0">
                                      {element.content}
                                    </p>
                                  )}
                                  <div className="d-flex justify-content-between align-items-center">
                                    {element.image && (
                                      <img
                                        style={{
                                          width: "100px",
                                          marginLeft: "20%",
                                        }}
                                        variant="success"
                                        src={element.image} alt="img"
                                      />
                                    )}
                                    {disabled && (
                                      <div>
                                        <p variant="warning">
                                          Please wait untile file uploaded
                                        </p>
                                        <img src="https://media.tenor.com/67b631tr-g0AAAAC/loading-now-loading.gif" alt="img" />
                                      </div>
                                    )}
                                    <button
                                      onClick={() => {
                                        getAllNestedCommentsBycommentId(
                                          element.post_id,
                                          element.comment_id
                                        );
                                      }}
                                    >
                                      all replies
                                    </button>
                                  </div>
                                </div>

                                <div className="d-flex flex-start mt-4">
                                  <a className="me-3" href="#">
                                    <MDBCardImage
                                      className="rounded-circle shadow-1-strong me-3"
                                      src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(31).webp"
                                      alt="avatar"
                                      width="65"
                                      height="65"
                                    />
                                  </a>

                                  <div className="flex-grow-1 flex-shrink-1">
                                    <div>
                                      <div className="d-flex justify-content-between align-items-center">
                                        <p className="mb-1">
                                          {userinfo.firstname}{" "}
                                          {userinfo.lastname}
                                          <br></br>{" "}
                                          <span className="small">
                                            {/* {format(Date())} */}
                                          </span>
                                        </p>
                                      </div>
                                      <MDBInput
                                        style={{ height: "40px" }}
                                        wrapperClass="mb-4"
                                        placeholder="replay the comment..."
                                        id="mytextarea"
                                        type="text"
                                        onChange={(e) => {
                                          setNewNested((content) => {
                                            return {
                                              ...content,
                                              content: e.target.value,
                                            };
                                          });
                                        }}
                                      />
                                      <button
                                        onClick={() => {
                                          createNestedComment(
                                            element.post_id,
                                            element.comment_id
                                          );
                                        }}
                                      >
                                        reply
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {allnested?.length > 0 &&
                                  allnested.map((elementnested) => {
                                    return (
                                      <div
                                        className="d-flex flex-start mt-4"
                                        key={elementnested.comment_id}
                                      >
                                        <a className="me-3" href="#">
                                          <MDBCardImage
                                            className="rounded-circle shadow-1-strong me-3"
                                            src={
                                              elementnested.avatar
                                                ? elementnested.avatar
                                                : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                                            }
                                            alt="avatar"
                                            width="65"
                                            height="65"
                                          />
                                        </a>

                                        <div className="flex-grow-1 flex-shrink-1">
                                          <div>
                                            <div className="d-flex justify-content-between align-items-center">
                                              <p className="mb-1">
                                                {elementnested.firstname}{" "}
                                                {elementnested.lastname}
                                                <br></br>{" "}
                                                <span className="small">
                                                  {/* {format(
                                                    elementnested.created_at
                                                  )} */}
                                                </span>
                                              </p>
                                            </div>
                                            {elementnested.content && (
                                              <p>{elementnested.content}</p>
                                            )}
                                            {elementnested.image && (
                                              <img
                                                src={elementnested.image}
                                                style={{ width: "200px" }}
                                                alt="img"
                                              />
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}

                                {showEdit ? (
                                  <UpdateComment
                                    showModal={showEdit}
                                    comment={element}
                                    setShowModal={setShowEdit}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="modalcontainer">
            <MDBFile
              label=""
              size="sm"
              id="formFileSm"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setSelectedImage(URL.createObjectURL(e.target.files[0]));
              }}
            />
            <div className="imgarea">
              <svg
                className="icon bi bi-cloud-arrow-up-fill"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z" />
              </svg>
              <h3>Upload Image</h3>
              <img src={selectedimage} alt="img"/>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={(e) => {
              uploadImage();
              if (image) {
                if (!nemcomment.image) {
                  setDisabled(true);
                }
              }
              handleClose();
            }}
          >
            SelectImage
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Comments;
