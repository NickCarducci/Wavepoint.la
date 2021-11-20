import React from "react";
import firebase from "../.././init-firebase.js";
import LocOpen from "./Tools/LocOpen";

class Stuff extends React.Component {
  state = {};
  render() {
    const {
      editingCommunity,
      community,
      auth,
      commtype,
      highAndTight
    } = this.props;
    return (
      <div>
        {!this.props.globeChosen &&
        this.props.users &&
        editingCommunity &&
        commtype === "new" &&
        auth !== undefined &&
        community &&
        (auth.uid === community.authorId ||
          community.admin.includes(auth.uid) ||
          community.faculty.includes(auth.uid)) ? (
          //community edit button & Loc
          <div>
            <LocOpen
              choosePrediction={(prediction) => {
                this.props.setLoc({ locOpen: false });
                this.setState({
                  place_name: prediction.place_name,
                  center: [prediction.center[1], prediction.center[0]]
                });
              }}
              locOpen={this.props.locOpen}
              closeLoc={() => this.props.setLoc({ locOpen: false })}
              openLoc={() => this.props.setLoc({ locOpen: true })}
            />
            {((this.state.place_name !== "" &&
              this.props.community.place_name !== this.state.place_name) ||
              (this.state.center !== "" &&
                this.props.community.center !== this.state.center)) && (
              <div
                onClick={() =>
                  firebase
                    .firestore()
                    .collection("communities")
                    .doc(this.props.community.id)
                    .update({
                      place_name: this.state.place_name,
                      center: this.state.center
                    })
                    .catch((err) => console.log(err.message))
                }
                style={{
                  backgroundColor: "rgb(0,30,60)",
                  display: "flex",
                  position: "relative",
                  boxShadow: "6px 3px 50px #222",
                  border: "none",
                  margin: "10px",
                  breakInside: "avoid",
                  textIndent: "10px",
                  alignItems: "center",
                  color: "grey"
                }}
              >
                Change to
                <br />
                {this.state.place_name}
                <br />
                {this.state.center}
              </div>
            )}
            {(this.state.place_name !== "" || this.state.center !== "") && (
              <div
                onClick={() => this.setState({ place_name: "", center: "" })}
                style={{
                  display: "flex",
                  border: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                Clear
              </div>
            )}
            {/*<form
              onSubmit={async (e) => {
                e.preventDefault();

                if (auth !== undefined) {
                  var theri = false;
                  await fetch(
                    //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.message.toLowerCase()}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
                  )
                    .then(async (response) => await response.json())
                    .then(
                      (body) => {
                        var predictions = body.features;
                        if (predictions.includes(this.state.message)) {
                          console.log("already there");
                          return (theri = true);
                        }
                      },
                      (err) => console.log(err)
                    );
                  if (
                    this.props.communities.find(
                      (x) => x.messageLower !== this.state.message.toLowerCase()
                    )
                  ) {
                    theri = true;
                  }
                  if (theri) {
                    this.setState({ useOtherName: true });
                  } else {
                    var there = this.props.communities.find(
                      (x) => x.message === this.state.message
                    );
                    if (there) {
                      this.setState({ useOtherName: true });
                    } else
                      auth &&
                        auth.uid &&
                        firebase
                          .firestore()
                          .collection("communities")
                          .doc(community.id)
                          .update({
                            message:
                              this.state.message !== ""
                                ? this.state.message
                                : community.id,
                            messageLower:
                              this.state.message !== ""
                                ? this.state.message.toLowerCase()
                                : community.messageLower,
                            body:
                              this.state.body !== ""
                                ? this.state.body
                                : community.body
                          })
                          .catch((err) => console.log(err.message));
                  }
                }
              }}
            >
              <input
                className="input"
                onChange={(e) => {
                  e.preventDefault();
                  this.state.useOtherName &&
                    this.setState({
                      useOtherName: false
                    });
                  this.setState({ message: e.target.value });
                }}
                value={this.state.message}
                minLength="3"
                style={
                  editingCommunity
                    ? {
                        display: "flex",
                        position: "relative",
                        boxShadow: "6px 3px 50px #222",
                        border: "none",
                        margin: "10px",
                        height: "36px",
                        breakInside: "avoid",
                        textIndent: "10px"
                      }
                    : { display: "none" }
                }
                placeholder={community.id}
              />
              {this.state.useOtherName && (
                <div>
                  {community.id === this.props.message
                    ? "Already yours"
                    : "Name taken"}
                </div>
              )}
              {(this.state.message || this.state.body) && (
                <div
                  onClick={() => this.setState({ place_name: "", center: "" })}
                  style={{
                    display: "flex",
                    border: "1px solid black",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  Clear
                </div>
              )}
              <textarea
                onChange={(e) => {
                  e.preventDefault();
                  this.setState({ body: e.target.value });
                }}
                value={this.state.body}
                placeholder={community.body}
                style={
                  editingCommunity
                    ? {
                        display: "flex",
                        position: "relative",
                        boxShadow: "6px 3px 50px #222",
                        border: "none",
                        margin: "10px",
                        height: "120px",
                        breakInside: "avoid",
                        textIndent: "10px",
                        marginBottom: "20px",
                        paddingTop: "4px"
                      }
                    : { display: "none" }
                }
              />
              </form>*/}
          </div>
        ) : null}
        <div
          onClick={this.props.scrollBackToTheLeft}
          style={{
            display: "flex",
            position: "fixed",
            bottom: "0px",
            right: "0px",
            width: !highAndTight && this.props.forumOpen ? "56px" : "0px",
            height: !highAndTight && this.props.forumOpen ? "56px" : "0px",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "50px",
              color: "grey",
              backgroundColor: "white",
              positon: "absolute",
              display: "flex",
              width: !highAndTight && this.props.forumOpen ? "46px" : "0px",
              fontSize: !highAndTight && this.props.forumOpen ? "" : "0px",
              height: !highAndTight && this.props.forumOpen ? "46px" : "0px",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(270deg)"
            }}
          >
            {">"}
          </div>
        </div>
      </div>
    );
  }
}
export default Stuff;

/*this.props.users &&
        !this.props.subForum &&
        postHeight === 0 &&
        !["department", "ordinance", "forms & permits"].includes(
          commtype
        ) && (
          /*((!this.props.globeChosen && this.props.forumPosts.length > 24) ||
          (this.props.globeChosen &&
            this.props.globalForumPosts.length > 24)) &&
            *
          <ForumPagination
            editingCommunity={editingCommunity}
            scrollTop={
              this.stinker.current && this.stinker.current.scrollTop > 150
            }
            headerScrolling={
              postHeight === 0 && headerScrolling
            }
            globeChosen={this.state.globeChosen}
            lastGlobalPost={this.props.lastGlobalPost}
            undoGlobalPost={this.props.undoGlobalPost}
            undoForumPost={this.props.undoForumPost}
            lastForumPost={this.props.lastForumPost}
            undoWeekCommPost={this.props.undoWeekCommPost}
            lastWeekCommPost={this.props.lastWeekCommPost}
            users={this.props.users}
            late={
              this.props.globeChosen
                ? this.props.lastGlobalCommForum
                : this.props.lastWeekCommForum
            }
            back={
              this.props.globeChosen
                ? this.props.undoGlobalCommForum
                : this.props.undoWeekCommForum
            }
            forumPosts={
              //filter on ? filter for
              this.props.globeChosen
                ? this.props.globalForumPosts
                : this.props.subForum ||
                  commtype === "classes" ||
                  commtype === "department"
                ? []
                : commtype === "budget" &&
                  this.state.openWhen === "expired"
                ? this.props.oldBudget
                : commtype === "election" &&
                  this.state.openWhen === "expired"
                ? this.props.oldElections
                : commtype === "cases" &&
                  this.state.openWhen === "expired"
                ? this.props.oldCases
                : this.props.forumPosts
            }
            tagsOpen={this.state.tagsOpen}
            tagResults={this.state.tagResults}
            city={this.props.city}
            community={community}
            toggleTags={
              this.state.tagsOpen
                ? () => this.setState({ tagsOpen: false })
                : () => this.setState({ tagsOpen: true })
            }
          />
          )*/
/*<div
        style={{
          display: "flex",
          position: "relative",
          backgroundColor: "rgba(20,20,40,.5)",
          top: "0px",
          width: "100%",
          zIndex: "9999",
          height: "130vh"
        }}
      />*/
