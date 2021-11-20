import React from "react";
import { Link } from "react-router-dom";
import firebase from "../../.././init-firebase";
import WeatherCitySky from ".././WeatherCitySky";
import Claim from ".././Display/Claim";
//import CommunityMembersAnim from "./Community/CommunityMembersAnim";
import { Helmet } from "react-helmet";
import imagesl from "./standardIMG.jpg";

class Community extends React.Component {
  state = {
    tileChosen: undefined,
    events: [],
    deletedEvts: [],
    clubs: [],
    deletedClbs: [],
    jobs: [],
    deletedJobs: [],
    pathname: "",
    profile: {}
  };
  render() {
    const { community } = this.props;
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "rgb(250,250,250)",
          flexDirection: "column",
          zIndex: "9999"
        }}
      >
        {community && (
          <Helmet>
            <meta
              content="text/html; charset=UTF-8"
              http-equiv="Content-Type"
            />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@viaThumbprint" />
            <meta
              name="twitter:title"
              content={`${community.message}'s page`}
            />
            <meta
              name="twitter:description"
              content={`${community.message} is on ${window.location.href}`}
            />
            <meta
              name="twitter:image"
              content={
                community.photoThumbnail ? community.photoThumbnail : imagesl
              }
            />
          </Helmet>
        )}
        {community ? (
          <div
            style={{
              justifyContent: "center",
              backgroundColor: "rgb(20,20,20)",
              breakInside: "avoid",
              width: "100%"
            }}
          >
            <img src={community.photoThumbnail} alt={community.message} />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              position: "relative",
              justifyContent: "center",
              backgroundColor: "rgb(20,20,20)",
              breakInside: "avoid",
              width: "100%",
              height: "min-content"
            }}
          >
            <WeatherCitySky city={this.props.city} forProfile={true} />
          </div>
        )}
        {this.state.place_name
          ? this.state.place_name
          : community
          ? community.message
          : this.props.city}
        {this.state.alternatives && "Did you mean one of these?"}
        {this.state.alternatives &&
          this.state.alternatives.map((x) => {
            return <Link to={`/${x.place_name}`}>{x.place_name}</Link>;
          })}
        <div style={{ zIndex: "9999" }}>
          {" "}
          {this.props.auth !== undefined && community ? (
            community.authorId === this.props.auth.uid ? (
              <div>
                this in your community
                <div
                  onClick={
                    this.state.deletingCommunity === true
                      ? () =>
                          this.setState({
                            deletingCommunity: false
                          })
                      : () => {
                          var answer = window.confirm(
                            `want to really delete community ${community.message}? All forum & catalog items will turn privateToCommunity off. You cannot undo this!`
                          );
                          if (answer) {
                            this.setState({
                              deletingCommunity: true
                            });
                          }
                        }
                  }
                  style={{ color: "grey" }}
                >
                  delete
                </div>
                {this.state.deletingCommunity && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (this.state.confirmDelete.toLowerCase() === "delete") {
                        firebase
                          .firestore()
                          .collection("communities")
                          .doc(community.id)
                          .delete()
                          .then(() => {
                            console.log(
                              "deleted community" + community.message
                            );
                            this.setState({
                              deletingCommunity: ""
                            });
                            [
                              "planner",
                              "clubs",
                              "shops",
                              "classes",
                              "departments",
                              "restaurants",
                              "venues",
                              "pages",
                              "housing",
                              "jobs",
                              "services"
                            ].map(async (x) => {
                              return firebase
                                .firestore()
                                .collection(x)
                                .where("communityId", "==", community.id)
                                .get()
                                .then((docs) => {
                                  docs.forEach((doc) => {
                                    if (doc.exists) {
                                      firebase
                                        .firestore()
                                        .collection(x)
                                        .doc(doc.id)
                                        .update({
                                          communityId: false,
                                          privateToCommunity: false
                                        })
                                        .catch((e) => console.log(e.message));
                                    }
                                  });
                                })
                                .catch((e) => console.log(e.message));
                            });
                          })
                          .catch((e) => console.log(e.message));
                      }
                    }}
                  >
                    <input
                      value={this.state.confirmDelete}
                      onChange={(e) =>
                        this.setState({
                          confirmDelete: e.target.value
                        })
                      }
                    />
                  </form>
                )}
              </div>
            ) : community.admin.includes(this.props.auth.uid) ||
              community.faculty.includes(this.props.auth.uid) ||
              community.members.includes(this.props.auth.uid) ? (
              <div
                onClick={() => {
                  var answer = window.confirm(
                    `are you sure you want to leave ${community.message}?  ${
                      community.admin.includes(this.props.auth.uid) ||
                      community.faculty.includes(this.props.auth.uid)
                        ? "you will lose administrative duties"
                        : ""
                    }`
                  );
                  if (answer) {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(community.id)
                      .update({
                        requestingMembership: firebase.firestore.FieldValue.arrayRemove(
                          this.props.auth.uid
                        )
                      });
                  }
                }}
              >
                Leave community
              </div>
            ) : community.requestingMembership(this.props.auth.uid) ? (
              <div
                onClick={() => {
                  var answer = window.confirm("recind request for membership?");
                  if (answer) {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(community.id)
                      .update({
                        requestingMembership: firebase.firestore.FieldValue.arrayRemove(
                          this.props.auth.uid
                        )
                      });
                  }
                }}
              >
                Requesting...
              </div>
            ) : (
              <div
                onClick={() => {
                  var answer = window.confirm("request membership?");
                  if (answer) {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(community.id)
                      .update({
                        requestingMembership: firebase.firestore.FieldValue.arrayUnion(
                          this.props.auth.uid
                        )
                      });
                  }
                }}
              >
                Join
              </div>
            )
          ) : this.props.auth !== undefined ? (
            <div
              //onClick={this.props.getUserInfo}
              //to="/login"
              style={{ padding: "10px", display: "flex" }}
            >
              claim
              <div
                onClick={() => {
                  var answer = window.confirm(
                    `Are you a town clerk ${this.props.city}?`
                  );
                  if (answer) {
                    this.setState({ showReqMayorForm: this.props.city });
                  }
                }}
                style={{
                  padding: "2px",
                  margin: "0px 10px",
                  color: "white",
                  borderRadius: "20px",
                  display: "flex",
                  backgroundColor: "rgba(50,50,50,.8)",
                  zIndex: "9999"
                }}
              >
                ...
              </div>
            </div>
          ) : (
            <div
              onClick={this.props.getUserInfo}
              //to="/login"
              style={{ padding: "10px" }}
            >
              login to {community ? `join` : `claim`}
            </div>
          )}
        </div>
        <Link
          to="/"
          style={{
            backgroundColor: "rgba(250,250,250,.877)",
            display: "flex",
            position: "fixed",
            top: "10px",
            left: "20px",
            width: "20px",
            height: "20px",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #444"
          }}
        >
          &times;
        </Link>
        {/*} <div style={community ? {} : { display: "none" }}>
          <CommunityMembersAnim
            width={this.props.width}
            height={this.props.height}
            users={this.props.users}
            community={community}
          />
        </div>*/}
        <Claim
          clear={() => this.setState({ showReqMayorForm: "" })}
          showReqMayorForm={this.state.showReqMayorForm}
          user={this.props.user}
        />
      </div>
    );
  }
}
export default Community;
