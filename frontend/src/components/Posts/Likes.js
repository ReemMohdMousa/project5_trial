import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addLike, setLike, removeLike } from "../redux/reducers/posts";
import { AiFillLike } from "react-icons/ai";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
const Likes = ({ post_id, post }) => {
  const [clicked, setClicked] = useState("no");
  const [likesNo, setLikesNo] = useState();
  const [likedUser, setLikedUser] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const dispatch = useDispatch();

  const { token, likes, userId } = useSelector((state) => {
    return {
      token: state.auth.token,
      likes: state.posts.likes,
      userId: state.auth.userId,
    };
  });

  const getLikes = () => {
    axios
      .get(`http://localhost:5000/likes/l`)
      .then((result) => {
        const user = result.data.users;
        const LikesNo2 = result.data.num;
        dispatch(setLike({ user, LikesNo2 }));
        user.map((elem) => {
          if (elem.post_id == post_id && userId == elem.user_id) {
            setClicked("yes");
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getLikes();
  }, []);

  const handleLike = (e) => {
    const id = e.target.id;
    if (clicked === "yes") {
      setClicked("no");
      axios
        .delete(`http://localhost:5000/likes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((result) => {
          getLikes();
          dispatch(removeLike(id));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setClicked("yes");
      axios
        .post(
          "http://localhost:5000/likes",
          {
            post_id: id,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((result) => {
          getLikes();
          dispatch(addLike(result.data.result));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <p id="post-info">
        <AiFillLike
          style={{ color: "blue" }}
          onClick={(e) => {
            setShow(true);
          }}
        />{" "}
        {likes.length > 0 &&
          likes[0].LikesNo2.length > 0 &&
          likes[0].LikesNo2.flat().reduce((acc, elem) => {
            if (post_id == elem.post_id) {
              return <span key={post_id}>{elem.total_likes}</span>;
            } else {
              return <span key={post_id}>{acc}</span>;
            }
          }, 0)}
      </p>

      <div className="item" onClick={handleLike} id={post_id}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className={clicked}
          id={post_id}
          viewBox="0 0 16 16"
        >
          <path
            d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"
            id={post_id}
          />
        </svg>{" "}
        likes
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <AiFillLike style={{ color: "blue", fontSize: "1.2rem" }} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {likes.length > 0 &&
            likes[0].user.flat().map((element, id) => {
              if (element.post_id == post_id) {
                return (
                  <div
                    className="friend-list"
                    key={id}
                    style={{ marginBottom: ".5rem" }}
                  >
                    <div
                      className="friend-img-name"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        className="friend-img"
                        alt="img"
                        src={
                          element.avatar ||
                          "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                        }
                      />

                      <h6>{element.firstname + " " + element.lastname}</h6>
                    </div>
                  </div>
                );
              }
            })}
          {likes.length > 0 &&
            likes[0].user.flat().reduce((acc, element) => {
              if (element.post_id !== post_id) {
                return <p key={post_id}>{acc}</p>;
              }
            }, "There is no likes on this post")}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Likes;
