import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
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
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import axios from "axios";
import { MDBFile } from "mdb-react-ui-kit";
import { updateComment, removeComment } from "../redux/reducers/posts";

const UpdateComment = ({ showModal, comment, setShowModal }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [showVideo, setShowVideo] = useState(false);
  const handleCloseVideo = () => setShowVideo(false);
  const handleShowVideo = () => setShowVideo(true);
  const [selectedvideo, setSelectedVideo] = useState("");
  const [Updatedpost, setUpdatedpost] = useState({});
  const [image, setImage] = useState("");
  const [video, setVedio] = useState("");
  const [selectedimage, setSelectedImage] = useState("");
  const [isdeleted, setIsDeleted] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  //const handleShow = () => setShow(true);
  const dispatch = useDispatch();

  const { token, userId, userinfo } = useSelector((state) => {
    return {
      token: state.auth.token,
      userId: state.auth.userId,
      userinfo: state.auth.userinfo,
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

        setUpdatedpost((image) => {
          setDisabled(false);

          return { ...image, image: data.url };
        });
      })
      .catch((err) => console.log(err));
  };

  /**************************************** */
  const [disabled, setDisabled] = useState(false);

  const editPost = async () => {
    axios
      .put(
        `http://localhost:5000/comments/comment/${comment.comment_id}`,
        { ...Updatedpost },
        { headers: { Authorization: token } }
      )
      .then((Response) => {
        let updatedcomment = Response.data.comment;
        dispatch(updateComment({ updatedcomment }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Your comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="posts" style={{ height: "400px" }}>
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
                      to={"/profile"}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <span className="name">
                        {userinfo.firstname} {userinfo.lastname}
                      </span>
                    </Link>
                    <span className="date">{Date()}</span>
                  </div>
                </div>
              </div>
              <div className="contant1" style={{ marginTop: "-10px" }}>
                <section>
                  <MDBContainer>
                    <MDBRow className="justify-content-center align-items-center">
                      <MDBCol>
                        <MDBCard style={{ borderRadius: "15px" }}>
                          <MDBCardBody className="p-4">
                            <MDBInput
                              style={{ height: "80px" }}
                              wrapperClass="mb-4"
                              placeholder="whats in your mind"
                              id="form1"
                              type="text"
                              onChange={(e) => {
                                setUpdatedpost((content) => {
                                  return {
                                    ...content,
                                    content: e.target.value,
                                  };
                                });
                              }}
                            />

                            {comment.image && !isdeleted && (
                              <div>
                                <svg
                                  onClick={() => {
                                    setUpdatedpost((image) => {
                                      return { ...image, image: null };
                                    });
                                    setIsDeleted(true);
                                  }}
                                  style={{
                                    marginLeft: "95%",
                                    cursor: "pointer",
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  color="red"
                                  marginTop="-50px"
                                  fill="currentColor"
                                  class="bi bi-x-circle"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                </svg>
                                <a
                                  href={comment.image}
                                  style={{ width: "100%", padding: "15px" }}
                                >
                                  {comment.image}
                                </a>
                              </div>
                            )}
                            {disabled && (
                              <div>
                                <p variant="warning">
                                  Please wait untile file uploaded
                                </p>
                                <img src="https://media.tenor.com/67b631tr-g0AAAAC/loading-now-loading.gif" alt="img"/>
                              </div>
                            )}
                            <hr className="my-4" />
                            <div className="d-flex justify-content-start align-items-center">
                              <MDBCardText className="text-uppercase mb-0">
                                <MDBIcon fas icon="cog me-2" />

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
                                    width="70"
                                    height="30"
                                    color="gray"
                                    fill="currentColor"
                                    className="bi bi-file-image"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                    <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
                                  </svg>
                                </button>
                              </MDBCardText>

                              <MDBBtn
                                outline
                                color="dark"
                                floating
                                size="sm"
                                style={{ width: "25%", marginLeft: "50px" }}
                                onClick={() => {
                                  editPost();
                                  handleCloseModal();
                                }}
                              >
                                Confirm
                                <MDBIcon fas icon="plus" />
                              </MDBBtn>
                            </div>
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
                          setSelectedImage(
                            URL.createObjectURL(e.target.files[0])
                          );
                        }}
                      />
                      <div className="imgarea">
                        <svg
                          className="icon"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          class="bi bi-cloud-arrow-up-fill"
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
                          if (!comment.image) {
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
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
};

export default UpdateComment;
