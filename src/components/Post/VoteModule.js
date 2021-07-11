import React from "react";
import firebase from "../.././init-firebase.js";
import VoteModuleResults from "./VoteModuleResults.js";
import { Link } from "react-router-dom";
import { randomString } from "../../widgets/authdb.js";
import { politicalParties } from "../../widgets/arraystrings";

class VoteModule extends React.Component {
  state = {
    votes: [],
    closeFilter: true,
    availableEntities: [],
    chosenCommunity: { message: "" },
    city: "",
    chosenEntity: null,
    p: 0,
    deletedVotes: [],
    lastDeletedVotes: [],
    noLink: false
  };
  registerVoter = () => {
    const abstractAuthorId = randomString(4, "aA#");
    const userDatas = firebase.firestore().collection("userDatas");
    const createAVI = (abstractAuthorId) =>
      userDatas.doc(this.props.auth.uid).update({
        abstractAuthorId
      });
    userDatas
      .where("abstractAuthorId", "==", abstractAuthorId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const abstractAuthorId = randomString(4, "aA#");
          userDatas
            .where("abstractAuthorId", "==", abstractAuthorId)
            .get()
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                window.alert(
                  "please notify nick@thumbprint.us if this problem persists" +
                    " (key is not random enough)"
                );
              } else createAVI(randomString(4, "aA#"));
            });
        } else createAVI(randomString(4, "aA#"));
      });
  };
  componentDidUpdate = (prevProps) => {
    /* if (
      this.state.chosenEntity &&
      this.state.chosenEntity !== this.state.lastChosenEntity
    ) {
      if (!this.state.chosenEntity) {
        this.setState({
          votes: this.state.fullVotes,
          lastChosenEntity: this.state.chosenEntity
        });
      } else {
        var votes = this.state.votes.filter(
          (parent) =>
            (this.state.chosenEntity.members &&
              this.state.chosenEntity.members.includes(parent.authorId)) ||
            (this.state.chosenEntity.admin &&
              this.state.chosenEntity.admin.includes(parent.authorId)) ||
            (this.state.chosenEntity.faculty &&
              this.state.chosenEntity.faculty.includes(parent.authorId))
        );
        this.setState({
          votes,
          fullVotes: votes,
          lastChosenEntity: this.state.chosenEntity
        });
      }
    }*/
    if (
      this.props.auth !== undefined &&
      this.props.parent !== prevProps.parent
    ) {
      this.getVote();
    }
  };
  getVote = () => {
    /*var answer = window.confirm(
      "good choice! (we say this for everyone). Would "+
    "you like to vote publicly?")*/
    const { parent, auth, user } = this.props;
    const handleQuery = (querySnapshot) =>
      querySnapshot.docs.forEach((doc) => {
        if (doc.exists) {
          var vote = doc.data();
          vote.id = doc.id;
          this.setState({ vote });
        }
      });
    const votes = firebase.firestore().collection("votes");
    votes
      .where("authorId", "==", auth.uid)
      .where("collection", "==", parent.collection)
      .where("postId", "==", parent.id)
      .onSnapshot(
        (querySnapshot) => {
          if (!querySnapshot.empty) {
            handleQuery(querySnapshot);
          } else {
            //"no-proud-vote"
            votes
              .where("magicVoterId", "==", user.abstractAuthorId)
              .where("collection", "==", parent.collection)
              .where("postId", "==", parent.id)
              .onSnapshot(
                (querySnapshot) => {
                  if (!querySnapshot.empty) {
                    handleQuery(querySnapshot);
                  } else {
                    //"no-vote"
                  }
                },
                (e) => console.log(e.message)
              );
          }
        },
        (e) => console.log(e.message)
      );
  };
  render() {
    const canIVote = () => {
      if (this.props.user.party) {
        var answer = window.prompt(
          "please type your party to vote, this is not shared by default: " +
            partyList +
            `.  Google will be able to see it, as we use Firebase Auth ` +
            `without Google Functions as we start-up (saving about $50/mo)`
        );
        if (answer) {
          const party = politicalParties.find(
            (x) => x === answer.charAt(0).toUpperCase() + answer.slice(1)
          );
          if (party)
            firebase
              .firestore()
              .collection("userDatas")
              .doc(this.props.auth.uid)
              .update({
                party
              })
              .then(() => {})
              .catch((err) => console.log(err.message));
        }
        return false;
      } else if (!this.props.user.abstractAuthorId) {
        this.registerVoter();
        return false;
      } else return true;
    };
    const partyList = politicalParties.map(
      (x, i) => `${x}${i !== politicalParties.length && ", "}`
    );
    const { parent, isMember, user, vote } = this.props;
    var idShown = null;
    if (this.props.auth !== undefined && user !== undefined)
      idShown =
        user.publicAuthorId && vote && vote.authorId
          ? this.props.auth.uid
          : user.abstractAuthorId;

    const docRef = firebase
      .firestore()
      .collection(parent.collection)
      .doc(parent.id);
    const notExpired = !["oldBudget", "oldCases"].includes(parent.collection);
    const { skills } = user !== undefined ? user : {};
    var downvotesNumber = parent.downvotes ? parent.downvotes.length : 0;
    var upvotesNumber = parent.upvotes ? parent.upvotes.length : 0;
    var downvoted =
      downvotesNumber !== 0 &&
      this.props.auth !== undefined &&
      parent.downvotes.includes(idShown);
    var upvoted =
      upvotesNumber !== 0 &&
      this.props.auth !== undefined &&
      parent.upvotes.includes(idShown);
    var totalVotes = downvotesNumber + upvotesNumber;
    var downCalc = downvotesNumber / totalVotes;
    var percentageDown = !isNaN(downCalc) ? downCalc : 0;

    var upCalc = upvotesNumber / totalVotes;
    var percentageUp = !isNaN(upCalc) ? upCalc : 0;
    const voteNow = (up) => {
      if (canIVote && notExpired) {
        //vote event ok
        var newVote = {};
        const way = up ? "Up" : "Down";
        const undo = up ? upvoted : downvoted;
        const store = up ? "upvotes" : "downvotes";
        (undo ? vote.skills : skills).map(
          (x) =>
            (vote["skill" + way + x] = firebase.firestore.FieldValue.increment(
              undo ? -1 : 1
            ))
        );
        var func = null;
        if (!vote) {
          func = docRef.add(newVote);
        } else {
          if (vote.skills !== skills) {
            newVote.skills = skills;
          }
          newVote[store] = firebase.firestore.FieldValue.increment(
            undo ? -1 : 1
          );
          newVote[
            "party" + way + user.party
          ] = firebase.firestore.FieldValue.increment(undo ? -1 : 1);
          if (vote.party !== user.party) {
            vote[
              "party" + way + vote.party
            ] = firebase.firestore.FieldValue.increment(-1);
            vote[
              "party" + way + user.party
            ] = firebase.firestore.FieldValue.increment(1);
          }
          func = docRef.update(newVote);
        }
        func
          .then(() => {
            const votes = firebase.firestore().collection("votes");
            if (this.state.vote) {
              votes.doc(this.state.vote.id).update({ ...doc, way });
            } else {
              votes.add({ ...doc, way });
            }
          })
          .catch((err) => console.log(err.message));
      }
    };
    const doc = user !== undefined && {
      reference: parent.electionType + "/" + parent.message + "/" + parent.body,
      collection: parent.collection,
      postId: parent.id,
      authorId: user.publicAuthorId ? this.props.auth.uid : false,
      magicVoterId: user.abstractAuthorId,
      party: user.party,
      skills
    };
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
              votes
            </div>
          </div>
        ) : (
          <div>
            {parent.date && (
              <div
                style={{
                  right: "0px",
                  padding: "2px",
                  borderRadius: "4px",
                  borderTopRightRadius: "2px",
                  borderBottomRightRadius: "2px",
                  borderBottom: "1px solid",
                  borderLeft: "1px solid",
                  boxShadow: "-1px 1px 1px .1px black",
                  backgroundColor: "blue",
                  color: "white",
                  display: "flex",
                  width: "min-content",
                  height: "min-content",
                  position: "absolute",

                  fontSize: "15px"
                }}
              >
                {new Date(parent.date.seconds * 1000).toLocaleDateString()}
                {["oldBudget", "oldCases"].includes(this.props.collection) &&
                  " - expired"}
              </div>
            )}
            <div
              style={{
                flexDirection: "column",
                display: "flex",
                position: "relative",
                justifyContent: "flex-end",
                width: "100%",
                height: "100%",
                alignItems: "center",
                opacity: ["oldBudget", "oldCases"].includes(
                  this.props.collection
                )
                  ? "1"
                  : ".7"
              }}
            >
              <VoteModuleResults
                parent={parent}
                closeFilter={this.props.closeFilter}
                setShowing={this.props.setShowing}
                availableEntities={this.state.availableEntities}
                selectEntity={(e) =>
                  this.setState({ chosenEntity: e.target.id })
                }
                choosecity={(prediction) =>
                  this.setState({
                    city: prediction.place_name,
                    center: prediction.center,
                    locOpen: false,
                    chosenEntity: null,
                    chosenCommunity: { message: "" }
                  })
                }
                chosenTile={this.state.chosenTile}
                selectTiletype={(e) => {
                  var chosenTile = e.target.value;
                  this.setState(
                    { chosenTile },
                    () =>
                      this.state.find &&
                      firebase
                        .firestore()
                        .collection(chosenTile)
                        .where(
                          ...(this.state.find === "community"
                            ? [
                                "communityId",
                                "==",
                                this.state.chosenCommunity.id
                              ]
                            : ["city", "==", this.state.city])
                        )
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
                        )
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
                  chosenCommunity &&
                    this.setState({
                      chosenCommunity,
                      chosenEntity: null,
                      city: ""
                    });
                }}
                individualTypes={this.props.individualTypes}
                percentageDown={percentageDown}
                percentageUp={percentageUp}
              />
              {this.props.auth !== undefined ? (
                !this.props.community || isMember ? (
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      flexDirection: "column",
                      height: "100%",
                      alignItems: "center",
                      padding: "0px 30px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        flexDirection: "column",
                        height: "100%",
                        alignItems: "center",
                        zIndex: "9999",
                        color: upvoted ? "black" : "grey"
                      }}
                      onClick={() => voteNow(true)}
                    >
                      Up
                    </div>
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        flexDirection: "column",
                        height: "100%",
                        alignItems: "center",
                        zIndex: "9999",
                        color: downvoted ? "black" : "grey"
                      }}
                      onClick={() => voteNow()}
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
                      padding: "0px 30px",
                      fontSize: "12px"
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
        )}
      </div>
    );
  }
}
export default VoteModule;
