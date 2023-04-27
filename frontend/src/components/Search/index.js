import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchResult, setSearchResult] = useState("");
  const navigate = useNavigate();

  const { user } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:5000/search?firstName=${user}`)
      .then((result) => {
        setSearchResult(result.data.result);
      })
      .catch((error) => {
        throw error;
      });
  }, []);

  return (
    <div style={{ height: "20rem" }}>
      {searchResult &&
        searchResult.map((element, i) => {
          return (
            <Card
              style={{ width: "40rem", marginLeft: "4rem", marginTop: "2rem" }}
            >
              <div className="friend-list">
                <div
                  className="friend-img-name"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/profile/${element.user_id}`);
                  }}
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
            </Card>
          );
        })}
    </div>
  );
};

export default Search;
