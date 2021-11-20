import React from "react";
import firebase from "../.././init-firebase.js";
import VoteModuleResults from "./VoteModuleResults.js";
import { Link } from "react-router-dom";
import VoteModuleFilter from "./VoteModuleFilter.js";
import imagesl from ".././SwitchCity/Community/standardIMG.jpg";

class VoteStraw extends React.Component {
  state = {
    supports: [],
    chosenStature: "all",
    chosenIndividualType: "",
    by: "entity",
    availableEntities: [],
    chosenCommunity: { message: "" },
    city: "",
    chosenEntity: null,
    asktoRemove: "",
    p: 0,
    deletedVotes: [],
    lastDeletedVotes: [],
    noLink: false,
    candidacyRequestsIds: [],
    candidates: []
  };
  handleChangeSupport = (parent, way, candidate) => {
    if (this.state.support) {
      firebase
        .firestore()
        .collection("supports")
        .doc(this.state.support.id)
        .update({
          reference:
            parent.electionType +
            "/" +
            parent.message +
            "/" +
            parent.body +
            "/" +
            candidate.username,
          collection: parent.collection,
          postId: parent.id,
          candidateId: candidate.id,
          authorId: this.props.auth.uid,
          way
        });
    } else {
      firebase
        .firestore()
        .collection("supports")
        .add({
          reference:
            parent.electionType +
            "/" +
            parent.message +
            "/" +
            parent.body +
            "/" +
            candidate.username,
          collection: parent.collection,
          postId: parent.id,
          candidateId: candidate.id,
          authorId: this.props.auth.uid,
          way
        });
    }
  };
  handleTrue = (candidateId) => {
    if (
      !this.props.parent.upvotes ||
      !this.props.parent.upvotes.includes(this.props.auth.uid)
    ) {
      return firebase
        .firestore()
        .collection("candidates")
        .doc(candidateId)
        .update({
          upvotes: firebase.firestore.FieldValue.arrayRemove(
            this.props.auth.uid
          )
        });
    } else return null;
  };
  handleFalse = (candidateId) => {
    if (
      !this.props.parent.downvotes ||
      !this.props.parent.downvotes.includes(this.props.auth.uid)
    ) {
      return firebase
        .firestore()
        .collection("candidates")
        .doc(candidateId)
        .update({
          downvotes: firebase.firestore.FieldValue.arrayRemove(
            this.props.auth.uid
          )
        });
    } else return null;
  };
  handleNull = (candidateId) => {
    if (
      this.props.parent.upvotes &&
      this.props.parent.upvotes.includes(this.props.auth.uid) &&
      this.props.parent.downvotes &&
      this.props.parent.downvotes.includes(this.props.auth.uid)
    ) {
      return firebase
        .firestore()
        .collection("candidates")
        .doc(candidateId)
        .update({
          downvotes: firebase.firestore.FieldValue.arrayRemove(
            this.props.auth.uid
          )
        });
    } else return null;
  };
  getVotesForEachCandidate = (candidateId) => {
    firebase
      .firestore()
      .collection("supports")
      .where("authorId", "==", this.props.auth.uid)
      .where("collection", "==", this.props.parent.collection)
      .where("postId", "==", this.props.parent.id)
      .onSnapshot(
        (querySnapshot) => {
          let q = 0;
          let supports = [];
          querySnapshot.docs.forEach((doc) => {
            q++;
            if (doc.exists) {
              var support = doc.data();
              support.id = doc.id;
              supports.push(support);
            }
          });
          if (querySnapshot.docs.length === q) {
            this.setState({ supports }, () =>
              supports.map((support) => {
                if (support.way === true) {
                  return this.handleTrue(candidateId);
                } else if (support.way === false) {
                  return this.handleFalse(candidateId);
                } else if (support.way === null) {
                  return this.handleNull(candidateId);
                } else return null;
              })
            );
          }
        },
        (e) => console.log(e.message)
      );
  };
  getCandidates = () => {
    let candidates = [];
    let q = 0;
    this.props.parent.candidates.map((candidateId) =>
      firebase
        .firestore()
        .collection("candidates")
        .doc(candidateId)
        .onSnapshot(
          (doc) => {
            q++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              candidates.push(foo);
            }
          },
          (e) => console.log(e.message)
        )
    );
    if (this.props.parent.candidates.length === q) {
      this.setState({ candidates }, () =>
        candidates.map((candidate) =>
          this.getVotesForEachCandidate(candidate.id)
        )
      );
    }
  };
  componentDidMount = () =>
    this.props.parent.candidates && this.getCandidates();
  render() {
    const { parent, isMember } = this.props;
    if (this.props.community) {
      var downvotesNumber = parent.downvotes ? parent.downvotes.length : 0;
      var upvotesNumber = parent.upvotes ? parent.upvotes.length : 0;
      var downvoted =
        downvotesNumber !== 0 &&
        this.props.auth !== undefined &&
        parent.downvotes.includes(this.props.auth.uid);
      var upvoted =
        upvotesNumber !== 0 &&
        this.props.auth !== undefined &&
        parent.upvotes.includes(this.props.auth.uid);
      var totalVotes = downvotesNumber + upvotesNumber;
      var downCalc = downvotesNumber / totalVotes;
      var percentageDown = !isNaN(downCalc) ? downCalc : 0;

      var upCalc = upvotesNumber / totalVotes;
      var percentageUp = !isNaN(upCalc) ? upCalc : 0;
      return (
        <div style={{ display: "flex" }}>
          {!this.props.closeDrop ? null : this.props.closeFilter ? (
            <div
              onClick={() => this.props.setShowing({ closeFilter: false })}
              style={{
                justifyContent: "center",
                display: "flex",
                width: "100%",
                height: "26px"
                //backgroundColor: "rgb(220,170,130)"
              }}
            >
              <div style={{ display: "flex", width: "100%", height: "100%" }}>
                <div
                  style={{
                    justifyContent: "flex-start",
                    position: "relative",
                    display: "flex",
                    width: "50%",
                    height: "100%"
                  }}
                >
                  <div
                    style={{
                      padding: "2px",
                      borderRadius: "4px",
                      borderTopLeftRadius: "2px",
                      borderBottomLeftRadius: "2px",
                      borderBottom: "1px solid",
                      borderRight: "1px solid",
                      boxShadow: "1px 1px 1px .1px black",
                      backgroundColor: "red",
                      position: "absolute",
                      color: "white",
                      display: "flex",
                      width: "max-content",
                      height: "min-content"
                    }}
                  >
                    {downvotesNumber}&nbsp;{percentageDown * 100}%
                  </div>
                  <div
                    style={{
                      right: "0px",
                      transform: "rotate(180deg)",
                      width: `calc(100% * ${percentageDown})`,
                      backgroundColor: "red",
                      height: "100%"
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    justifyContent: "flex-end",
                    position: "relative",
                    display: "flex",
                    width: "50%",
                    height: "100%"
                  }}
                >
                  <div
                    style={{
                      padding: "2px",
                      borderRadius: "4px",
                      borderTopRightRadius: "2px",
                      borderBottomRightRadius: "2px",
                      borderBottom: "1px solid",
                      borderLeft: "1px solid",
                      boxShadow: "-1px 1px 1px .1px black",
                      backgroundColor: "blue",
                      position: "absolute",
                      color: "white",
                      display: "flex",
                      width: "max-content",
                      height: "min-content"
                    }}
                  >
                    {upvotesNumber}&nbsp;{percentageUp * 100}%
                  </div>
                  <div
                    style={{
                      width: `calc(100% * ${percentageUp})`,
                      backgroundColor: "blue",
                      height: "100%"
                    }}
                  ></div>
                </div>
              </div>
              <div
                style={{
                  borderBottomRightRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  padding: "2px 3px",
                  position: "absolute",
                  color: "white",
                  backgroundColor: "rgb(220,170,130)"
                }}
              >
                supports
              </div>
            </div>
          ) : (
            <div style={{ margin: "10px" }}>
              <div
                style={{
                  fontSize: "15px"
                }}
              >
                {new Date(parent.date.seconds * 1000).toLocaleDateString()}
              </div>
              {this.props.auth !== undefined &&
              this.props.collection === "elections" ? (
                this.props.auth.uid === this.props.community.authorId ||
                (this.props.community.admin &&
                  this.props.community.admin.includes(this.props.auth.uid)) ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      var subs = this.state.newCandidate.split(
                        this.props.parent.id
                      )[1];
                      firebase
                        .firestore()
                        .collection("elections")
                        .doc(this.props.parent.id)
                        .update({
                          candidates: firebase.firestore.FieldValue.arrayUnion(
                            subs
                          ),
                          candidateRequests: firebase.firestore.FieldValue.arrayRemove(
                            subs
                          )
                        })
                        .then(() => {
                          console.log(
                            "added candidate " +
                              subs +
                              " to " +
                              this.props.parent.id
                          );
                          this.setState({ newCandidate: "" });
                        })
                        .catch((err) => console.log(err));
                    }}
                  >
                    {parent.candidateRequests &&
                      parent.candidateRequests.length > 0 && (
                        <div
                          style={{
                            flexDirection: "column",
                            margin: "4px",
                            marginLeft: "4px",
                            color: "black",
                            fontSize: "12px",
                            border: "1px solid black",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            right: "0px",
                            wordBreak: "break-all",
                            paddingRight: "3px"
                          }}
                        >
                          add candidates
                          <select
                            value={this.state.newCandidate}
                            onChange={(e) => {
                              this.setState({ newCandidate: e.target.value });
                            }}
                          >
                            <option value=""></option>
                            {parent.candidateRequestsProfiled.map((parent) => {
                              return (
                                <option value={parent.id}>
                                  {parent.username}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                    <div style={{ color: "grey", fontSize: "12px" }}>
                      they have to request candidacy
                    </div>
                    {this.state.newCandidate && (
                      <button type="submit">add to "ballot"</button>
                    )}
                  </form>
                ) : parent.candidateRequests &&
                  parent.candidateRequests.includes(this.props.auth.uid) ? (
                  <div
                    onClick={() => {
                      firebase
                        .firestore()
                        .collection(this.props.parent.collection)
                        .doc(this.props.parent.id)
                        .update({
                          candidateRequests: firebase.firestore.FieldValue.arrayRemove(
                            this.props.auth.uid
                          )
                        })
                        .then(() => {
                          window.alert(
                            "removed candidacy request " +
                              this.props.parent.id +
                              this.props.auth.uid +
                              " you may need to refresh to reapply"
                          );
                        })
                        .catch((e) => console.log(e.message));
                    }}
                  >
                    adding your candidacy...
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      firebase
                        .firestore()
                        .collection(this.props.parent.collection)
                        .doc(this.props.parent.id)
                        .update({
                          candidateRequests: firebase.firestore.FieldValue.arrayUnion(
                            this.props.auth.uid
                          )
                        })
                        .then(() => {
                          console.log(
                            "requesting candidacy " +
                              this.props.parent.id +
                              this.props.auth.uid
                          );
                        })
                        .catch((e) => console.log(e.message));
                    }}
                  >
                    add your candidacy
                  </div>
                )
              ) : null}
              <div style={{ position: "relative", width: "100%" }}>
                <div
                  style={{
                    position: "absolute",
                    right: "0px",
                    top: "0px",
                    zIndex: "6"
                  }}
                  onClick={() =>
                    this.props.setShowing({
                      closeFilter: true
                    })
                  }
                >
                  &times;
                </div>
              </div>
              <select
                value={this.state.by}
                onChange={(e) => this.setState({ by: e.target.value })}
              >
                <option>entity</option>
                <option>individual</option>
              </select>

              {this.state.by === "entity" ? (
                //appelate, appeals, federal habeus corpus
                <VoteModuleFilter
                  availableEntities={this.state.availableEntities}
                  selectEntity={(e) =>
                    this.setState({ chosenEntity: e.target.id })
                  }
                  choosecity={(prediction) => {
                    var city = prediction.place_name;
                    this.setState({
                      city,
                      center: [prediction.center[1], prediction.center[0]],
                      locOpen: false,
                      chosenEntity: null,
                      chosenCommunity: { message: "" }
                    });
                    //ByEntity
                    //[city,community]
                    //entity-type
                    //ByIndividual
                    //name of entity
                    //[experience,education,hobby]
                    //name of vector
                  }}
                  chosenTile={this.state.chosenTile}
                  selectTiletype={(e) => {
                    var chosenTile = e.target.value;
                    this.setState({ chosenTile });
                    var where = ["", "", ""];
                    if (this.state.find === "community") {
                      where = [
                        "communityId",
                        "==",
                        this.state.chosenCommunity.id
                      ];
                    } else if (this.state.find === "city") {
                      where = ["city", "==", this.state.city];
                    } else {
                      where = null;
                    }
                    if (where) {
                      firebase
                        .firestore()
                        .collection(chosenTile)
                        .where(...where)
                        .onSnapshot(
                          (querySnapshot) => {
                            let q = 0;
                            let availableEntities = [];
                            querySnapshot.docs.forEach((doc) => {
                              q++;
                              if (doc.exists) {
                                var foo = doc.data();
                                foo.id = doc.id;
                                availableEntities.push(foo);
                              }
                              if (querySnapshot.docs.length === q) {
                                this.setState({ availableEntities });
                              }
                            });
                          },
                          (e) => console.log(e.message)
                        );
                    } else
                      return console.log(
                        "no find option for VoteModuleFilter.js"
                      );
                  }}
                  city={this.state.city}
                  chosenCommunity={this.state.chosenCommunity}
                  communities={this.props.communities}
                  selectFind={(e) =>
                    this.setState({
                      find: e.target.value,
                      chosenCommunity: { message: "" },
                      chosenEntity: null
                    })
                  }
                  find={this.state.find}
                  selectCommunity={(e) => {
                    var value = e.target.value;
                    var chosenCommunity = this.props.communities.find(
                      (parent) => parent.message === value
                    );
                    this.setState({
                      chosenCommunity,
                      chosenEntity: null,
                      city: ""
                    });
                  }}
                />
              ) : this.state.by === "individual" ? (
                <div>
                  <select>
                    {this.props.individualTypes.map((parent) => (
                      <option>{parent}</option>
                    ))}
                  </select>

                  {this.state.chosenIndividualType !== "" && (
                    <select
                      value={this.state.chosenStature}
                      onChange={(e) =>
                        this.setState({ chosenStature: e.target.value })
                      }
                    >
                      {["all", "experience", "education", "hobby"].map(
                        (parent) => {
                          return <option>{parent}</option>;
                        }
                      )}
                    </select>
                  )}
                </div>
              ) : null}
              {["elections", "oldElections"].includes(this.props.collection) &&
              parent.candidates &&
              parent.candidates.length > 0 ? (
                parent.candidatesProfiled.map((candidate) => {
                  return (
                    <div key={candidate.id}>
                      {this.props.auth !== undefined &&
                        (this.props.auth.uid ===
                          this.props.community.authorId ||
                          (this.props.community.admin &&
                            this.props.community.admin.includes(
                              this.props.auth.uid
                            ))) && (
                          <div
                            onMouseEnter={() =>
                              this.setState({ hoveredd: true })
                            }
                            onMouseLeave={() =>
                              this.setState({ hoveredd: false })
                            }
                            style={
                              this.state.asktoRemoveOk || this.state.hoveredd
                                ? {
                                    margin: "4px",
                                    marginLeft: "4px",
                                    color: "black",
                                    fontSize: "12px",
                                    border: "1px solid black",
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    height: "14px",
                                    right: "0px",
                                    wordBreak: "break-all",
                                    paddingRight: "3px"
                                  }
                                : {
                                    margin: "4px",
                                    marginLeft: "4px",
                                    color: "grey",
                                    fontSize: "12px",
                                    border: "1px solid grey",
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    height: "14px",
                                    right: "0px",
                                    wordBreak: "break-all",
                                    paddingRight: "3px"
                                  }
                            }
                            onClick={() => {
                              if (this.state.asktoRemoveOk) {
                                this.setState({ asktoRemoveOk: false });
                              } else {
                                var answer = window.confirm(
                                  `are you sure you'd like to remove ${candidate.name}@${candidate.username} from the ballot?`
                                );
                                if (answer) {
                                  this.setState({ asktoRemoveOk: true });
                                }
                              }
                            }}
                          >
                            remove
                          </div>
                        )}
                      {this.state.asktoRemoveOk && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (
                              this.state.asktoRemove.toLowerCase() === "remove"
                            ) {
                              firebase
                                .firestore()
                                .collection("elections")
                                .doc(this.props.parent.id)
                                .update({
                                  candidates: firebase.firestore.FieldValue.arrayRemove(
                                    this.props.auth.uid
                                  )
                                })
                                .then(() => {
                                  console.log("removed candidate " + parent);
                                })
                                .catch((err) => console.log(err));
                            }
                          }}
                        >
                          <input
                            placeholder="remove"
                            className="input"
                            value={this.state.asktoRemove}
                            onChange={(e) =>
                              this.setState({ asktoRemove: e.target.value })
                            }
                          />
                        </form>
                      )}
                      <div
                        style={{
                          flexDirection: "row",
                          top: "10px",
                          marginBottom: "10px",
                          left: "0px",
                          display: "flex",
                          position: "relative",
                          height: "100%",
                          alignItems: "center"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            position: "relative",
                            height: "60px",
                            overflowX: "auto",
                            overflowY: "hidden"
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              position: "relative",
                              height: "80px",
                              overflowX: "auto",
                              overflowY: "hidden"
                            }}
                          >
                            <Link
                              to={`/at/${candidate.username}`}
                              style={{
                                display: "flex",
                                position: "relative",
                                width: "max-content",
                                maxWidth: "30%",
                                right: "0px",
                                fontSize: "25px",
                                textDecoration: "none"
                              }}
                            >
                              <img
                                src={
                                  candidate.photoThumbnail
                                    ? candidate.photoThumbnail
                                    : imagesl
                                }
                                alt="error"
                                style={{ height: "40px", width: "40px" }}
                              />
                              {candidate.name}
                              <br />@{candidate.username}
                            </Link>
                          </div>
                        </div>
                        <VoteModuleResults
                          parent={parent}
                          isElection={true}
                          availableEntities={this.state.availableEntities}
                          percentageDown={percentageDown}
                          percentageUp={percentageUp}
                        />
                        {this.props.auth !== undefined ? (
                          isMember ? (
                            <div
                              style={{
                                left: "0px",
                                display: "flex",
                                position: "relative",
                                flexDirection: "column",
                                height: "100%",
                                width: "3%",
                                border: "1px solid black",
                                alignItems: "center",
                                padding: "0px 30px"
                              }}
                            >
                              <div
                                style={
                                  upvoted
                                    ? {
                                        display: "flex",
                                        position: "relative",
                                        flexDirection: "column",
                                        height: "100%",
                                        alignItems: "center",
                                        zIndex: "9999",
                                        color: "black"
                                      }
                                    : {
                                        display: "flex",
                                        position: "relative",
                                        flexDirection: "column",
                                        height: "100%",
                                        alignItems: "center",
                                        zIndex: "9999",
                                        color: "grey"
                                      }
                                }
                                onClick={() => {
                                  if (upvoted) {
                                    console.log("up remove");
                                    this.handleChangeSupport(
                                      parent,
                                      null,
                                      candidate
                                    );
                                  } else {
                                    console.log("up");
                                    this.handleChangeSupport(
                                      parent,
                                      true,
                                      candidate
                                    );
                                  }
                                }}
                              >
                                Up
                              </div>
                              <div
                                style={
                                  downvoted
                                    ? {
                                        display: "flex",
                                        position: "relative",
                                        flexDirection: "column",
                                        height: "100%",
                                        alignItems: "center",
                                        zIndex: "9999",
                                        color: "black"
                                      }
                                    : {
                                        display: "flex",
                                        position: "relative",
                                        flexDirection: "column",
                                        height: "100%",
                                        alignItems: "center",
                                        zIndex: "9999",
                                        color: "grey"
                                      }
                                }
                                onClick={() => {
                                  if (downvoted) {
                                    this.handleChangeSupport(
                                      parent,
                                      null,
                                      candidate
                                    );
                                  } else {
                                    console.log("up");
                                    // upvote - this event's user's profile
                                    this.handleChangeSupport(
                                      parent,
                                      false,
                                      candidate
                                    );
                                  }
                                }}
                              >
                                Down
                              </div>
                            </div>
                          ) : (
                            <Link
                              to={`/${this.props.community.message}/`}
                              style={{
                                left: "0px",
                                display: "flex",
                                position: "relative",
                                flexDirection: "column",
                                height: "100%",
                                width: "3%",
                                border: "1px solid black",
                                alignItems: "center",
                                padding: "0px 30px"
                              }}
                            >
                              Request membership to vote
                            </Link>
                          )
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              position: "relative",
                              flexDirection: "column",
                              height: "100%",
                              alignItems: "center",
                              padding: "0px 0px",
                              fontSize: "12px"
                            }}
                            onClick={this.props.getUserInfo}
                            //to="/login"
                          >
                            must login to vote
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: "grey" }}>
                  no candidates
                  {this.props.auth === undefined && (
                    <div
                      style={{
                        color: "grey",
                        display: "flex",
                        position: "relative",
                        flexDirection: "column",
                        height: "100%",
                        alignItems: "center",
                        padding: "0px 30px"
                      }}
                      onClick={this.props.getUserInfo}
                      //to="/login"
                    >
                      must login to vote
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      );
    } else return null;
  }
}
export default VoteStraw;
/**
 * 
  componentDidUpdate = (prevProps) => {
    if (
      this.state.chosenEntity &&
      this.state.chosenEntity !== this.state.lastChosenEntity
    ) {
      if (!this.state.chosenEntity) {
        this.setState({
          supports: this.state.fullVotes,
          lastChosenEntity: this.state.chosenEntity
        });
      } else {
        var supports = this.state.supports.filter(
          (parent) =>
            (this.state.chosenEntity.members &&
              this.state.chosenEntity.members.includes(parent.authorId)) ||
            (this.state.chosenEntity.admin &&
              this.state.chosenEntity.admin.includes(parent.authorId)) ||
            (this.state.chosenEntity.faculty &&
              this.state.chosenEntity.faculty.includes(parent.authorId))
        );
        this.setState({
          supports,
          fullVotes: supports,
          lastChosenEntity: this.state.chosenEntity
        });
      }
    }
    if (this.props.parent.candidates !== prevProps.parent.candidates) {
      //this.getCandidates();
    }
  };
 */
