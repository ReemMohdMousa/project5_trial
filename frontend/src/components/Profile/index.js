import React, { useEffect, useState } from "react";
import "./style.css";
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
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import Posts from "../Posts";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/reducers/posts/index";
import AddPost from "../AddPost";
import { useParams } from "react-router-dom";
import FriendRequests from "./FriendRequests";
import AllFriends from "./AllFriends";
import SendMessage from "./SendMessage";

const Profile = () => {
  const params = useParams();
  const id = params.id;
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const getuserdata = () => {
    axios
      .get(`https://project5-trial33.onrender.com/users/others/info/${id}`)
      .then((Response) => {
        // console.log(Response.data.result);

        setUser((firstname) => {
          return { ...firstname, firstname: Response.data.result.firstname };
        });
        setUser((lastname) => {
          return { ...lastname, lastname: Response.data.result.lastname };
        });
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  //redux states

  const { posts, userinfo, token, userId, friends, sharedPosts } = useSelector(
    (state) => {
      return {
        posts: state.posts.posts,
        userinfo: state.auth.userinfo,
        token: state.auth.token,
        userId: state.auth.userId,
        friends: state.friends.friends,
        sharedPosts: state.posts.sharedPosts,
      };
    }
  );

  const getAllPostsByUserId = () => {
    axios
      .get(`https://project5-trial33.onrender.com/posts/search_1/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((Response) => {
        dispatch(setPosts(Response.data.posts));
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  useEffect(() => {
    getuserdata();
    getAllPostsByUserId();
  }, []);

  return (
    <div>
      <SendMessage id={id} />
      {/* <FriendRequests id={id} />
      <AllFriends id={id} /> */}
      <div className="gradient-custom-2" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="9" xl="7">
              <MDBCard>
                <div
                  className="rounded-top text-white d-flex flex-row"
                  style={{ backgroundColor: "#000", height: "200px" }}
                >
                  <div
                    className="ms-4 mt-5 d-flex flex-column"
                    style={{ width: "150px" }}
                  >
                    <MDBCardImage
                      src={
                        userinfo.avatar
                          ? userinfo.avatar
                          : "https://png.pngtree.com/png-clipart/20210613/original/pngtree-gray-silhouette-avatar-png-image_6404679.jpg"
                      }
                      alt="image"
                      className="mt-4 mb-2 img-thumbnail"
                      fluid
                      style={{ width: "150px", zIndex: "1" }}
                    ></MDBCardImage>

                    {/* <MDBBtn
                      outline
                      color="dark"
                      style={{ height: "4rem", overflow: "visible" }}
                    >
                      Edit profile Info
                    </MDBBtn> */}
                    {userId == id ? (
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="light"
                          id="dropdown-basic"
                          style={{
                            backgroundColor: "inherit",
                            border: "2px solid black",
                          }}
                        >
                          Edit Profile Info
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item>Upload profile picture</Dropdown.Item>
                          <Dropdown.Item>Upload cover picture</Dropdown.Item>
                          <Dropdown.Item>Edit about</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="ms-3" style={{ marginTop: "130px" }}>
                    <MDBTypography tag="h5">
                      {user.firstname}
                      {"  "}
                      {user.lastname}
                    </MDBTypography>
                  </div>
                </div>

                <div
                  className="p-4 text-black"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <div className="d-flex justify-content-end text-center py-1">
                    <div>
                      <br />
                      <MDBCardText className="small text-muted mb-0">
                        <FriendRequests id={id} />
                      </MDBCardText>
                    </div>
                    <div className="px-3">
                      <MDBCardText className="mb-1 h6">
                        {friends ? friends.length : 0}
                      </MDBCardText>
                      <MDBCardText className="small text-muted mb-0">
                        <AllFriends id={id} />
                      </MDBCardText>
                    </div>
                  </div>
                </div>

                <MDBCardBody className="text-black p-4">
                  {userinfo.bio && (
                    <div className="mb-5">
                      <p className="lead fw-normal mb-1">About</p>
                      <div
                        className="p-4"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <MDBCardText className="font-italic mb-1">
                          {userinfo.bio}
                        </MDBCardText>
                      </div>
                    </div>
                  )}

                  <MDBRow className="g-2">
                    <MDBCol className="mb-2">
                      {id == userId && <AddPost />}
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol className="mb-2">
                      {/* dispaly the posts */}
                      {posts &&
                        posts.map((elem) => {
                          return (
                            <Posts
                              post={elem}
                              firstname={user.firstname}
                              lastname={user.lastname}
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
    </div>
  );
};

export default Profile;
