import React from "react";
import OpenToggle from "../../../.././widgets/OpenToggle";
import LivePaw from "./LivePaw";
import firebase from "../../../.././init-firebase";
import Types from "./Types";

class Vote extends React.Component {
  state = {
    neverGotten: true,
    jobDescriptions: [],
    electionHover: 0,
    myvotes: [],
    mysupports: [],
    caseTypes: [],
    budgetTypes: [],
    electionTypes: []
  };

  componentDidUpdate = (prevProps) => {
    if (
      this.props.profile &&
      this.props.profile.id &&
      (this.props.profile !== prevProps.profile || this.state.neverGotten) &&
      !this.props.profile.hideVotes
    ) {
      this.getVotingSupportData();

      this.setState({ neverGotten: false });
    }
  };
  getVotingSupportData = () => {
    firebase
      .firestore()
      .collection("votes") //budget & cases
      .where("authorId", "==", this.props.profile.id)
      //.where("collection", "==", this.props.parent.collection)
      //.where("postId", "==", this.props.parent.id)
      .onSnapshot((querySnapshot) => {
        let votes = [];
        let budgetTypess = [];
        let caseTypess = [];
        let p = 0;
        querySnapshot.docs.forEach(async (doc) => {
          p++;
          if (doc.exists) {
            var vote = doc.data();
            vote.id = doc.id;
            vote.post = await this.props.findPost(
              vote.collection + vote.postId
            );
            if (vote.post) {
              votes.push(vote);
              if (
                ["oldBudget", "budget & proposals"].includes(
                  vote.post.collection
                )
              ) {
                budgetTypess.push(vote.post.type);
              }
              if (["oldCases", "court cases"].includes(vote.post.collection)) {
                caseTypess.push(vote.post.type);
              }
            }
          }
        });
        if (querySnapshot.docs.length === p && this.state.votes !== votes) {
          this.setState({ myvotes: [] });
          this.state.votes && this.compareVotes(this.state.votes);
          var budgetTypes = [...new Set(budgetTypess)];
          var caseTypes = [...new Set(caseTypess)];
          this.setState({ budgetTypes, caseTypes, votes });
        }
      });
    firebase
      .firestore()
      .collection("supports") //only elections
      .where("authorId", "==", this.props.profile.id)
      //.where("collection", "==", this.props.parent.collection)
      //.where("postId", "==", this.props.parent.id)
      .onSnapshot(
        (querySnapshot) => {
          let supports = [];
          let electionTypess = [];
          let p = 0;
          querySnapshot.docs.forEach(async (doc) => {
            p++;
            if (doc.exists) {
              var foo = {};
              var support = doc.data();
              support.id = doc.id;
              support.post = await this.props.findPost(
                foo.collection + foo.postId
              );
              if (support.post) {
                supports.push(support);
                electionTypess.push(support.post.type);
              }
            }
          });
          if (
            querySnapshot.docs.length === p &&
            this.state.supports !== supports
          ) {
            this.setState({ mysupports: [] });
            this.state.supports && this.compareSupports(this.state.supports);

            var electionTypes = [...new Set(electionTypess)];
            this.setState({ electionTypes, supports });
          }
        },
        (e) => console.log(e.message)
      );
    let roles = {};
    [
      { noun: "faculty", verb: "delegateOf" },
      { noun: "members", verb: "memberOf" },
      { noun: "reps", verb: "repping" },
      { noun: "judges", verb: "judges" },
      { noun: "memberMakers", verb: "memberMaking" }
    ].map((x) => {
      return (
        this.props.profile[x.verb] &&
        Promise.all(
          this.props.profile[x.verb].map(async (y) => {
            var community = await this.props.getCommunity(y);
            return community && community;
          })
        ).then((communities) => {
          var community = communities.find((c) =>
            c[x.noun].includes(this.props.auth.uid)
          );
          roles[x.verb].push(community);
          this.setState({ [x.verb]: roles[x.verb] });
        })
      );
    });
    firebase
      .firestore()
      .collection("jobDescriptions")
      .where("authorId", "==", this.props.profile.id)
      .onSnapshot((querySnapshot) => {
        let jobDescriptions = [];
        let p = 0;
        querySnapshot.docs.forEach(
          (doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              jobDescriptions.push(foo);
            }
            if (
              querySnapshot.docs.length === p &&
              this.state.jobDescriptions !== jobDescriptions
            ) {
              this.setState({ jobDescriptions });
            }
          },
          (e) => console.log(e.message)
        );
      });
  };
  compareVotes = (votes) => {
    this.props.auth !== undefined &&
      votes.map((x) => {
        return firebase
          .firestore()
          .collection("votes")
          .where("authorId", "==", this.props.auth.uid)
          .where("collection", "==", x.post.collection)
          .where("collectionId", "==", x.post.collectionId)
          .where("candidateId", "==", x.post.candidateId)
          .onSnapshot((querySnapshot) => {
            let myvotes = [];
            let q = 0;
            querySnapshot.docs.forEach(async (doc) => {
              q++;
              if (doc.exists) {
                var vote = doc.data();
                if (vote.way !== null) {
                  vote.id = doc.id;
                  vote.post = await this.props.findPost(
                    vote.collection + vote.postId
                  );
                  myvotes.push(vote);
                }
              }
            });
            if (
              querySnapshot.docs.length === q &&
              this.state.myvotes !== myvotes
            ) {
              this.setState({ myvotes });
            }
          });
      });
  };
  compareSupports = (supports) => {
    this.props.auth !== undefined &&
      supports.map((x) => {
        return firebase
          .firestore()
          .collection("support")
          .where("authorId", "==", this.props.auth.uid)
          .where("collection", "==", x.post.collection)
          .where("collectionId", "==", x.post.collectionId)
          .where("candidateId", "==", x.post.candidateId)
          .onSnapshot((querySnapshot) => {
            let mysupports = [];
            let q = 0;
            querySnapshot.docs.forEach(async (doc) => {
              q++;
              if (doc.exists) {
                var support = doc.data();
                if (support.way !== null) {
                  support.id = doc.id;
                  support.post = await this.props.findPost(
                    support.collection + support.postId
                  );
                  mysupports.push(support);
                }
              }
            });
            if (
              querySnapshot.docs.length === q &&
              this.state.mysupports !== mysupports
            ) {
              this.setState({ mysupports });
            }
          });
      });
  };
  render() {
    const {
      auth, //profile,
      swipe
    } = this.props;
    return (
      <div
        style={{
          display: swipe === "paw" ? "flex" : "none",
          flexDirection: "column",
          position: "relative",
          transition: ".3s ease-out"
        }}
      >
        {/*this.props.auth !== undefined && profile.id === this.props.auth.uid ? (
          <OpenToggle
            auth={auth}
            user={profile}
            iAmCandidate={[]}
            iAmJudge={this.state.judges}
            iAmRepresentative={this.state.repping}
          />
        ) : (
          "Thumbprint"
        )*/}
        {
          /*this.props.profile.hideVotes ? (
          <div style={{ color: "grey", fontSize: "15px" }}>
            This user hides their votes, but they still count!
          </div>
        ) : */

          <div
            style={{
              height: "170px"
            }}
          >
            {auth === undefined && (
              <div
                onClick={this.props.getUserInfo}
                //to="/login"
                style={{ display: "flex", textDecoration: "none" }}
              >
                <div style={{ textDecoration: "underline" }}>
                  login to get political thumbprint affinity
                </div>{" "}
                <div>&nbsp;&#9784;</div>
              </div>
            )}
            <LivePaw
              hoverElections={this.props.hoverElections}
              hoverBills={this.props.hoverBills}
              hoverCases={this.props.hoverCases}
              supports={this.state.supports}
              votes={this.state.votes}
              electionTypes={this.state.electionTypes}
              budgetTypes={this.state.budgetTypes}
              caseTypes={this.state.caseTypes}
              mysupports={this.state.mysupports}
              myvotes={this.state.myvotes}
              //go={this.props.go}
            />
          </div>
        }{" "}
        {this.props.profile.dontShowJob ? (
          <div style={{ color: "grey", fontStyle: "italic" }}>stealth</div>
        ) : (
          <div>
            {this.state.jobDescriptions.length > 0 ? (
              <div
                className="fas fa-store-slash"
                style={{
                  color:
                    this.props.user.banked || this.state.hoverBank
                      ? "black"
                      : "grey",
                  display: "flex",
                  position: "relative",
                  backgroundColor: "rgba(250,250,250,.8)"
                }}
              />
            ) : this.props.profile.lookingForWork ? (
              " looking for work"
            ) : (
              " living/doing it"
            )}
            {this.state.jobDescriptions.map((job) => {
              return (
                <div>
                  {job.position}
                  <br />
                  {job.company}
                  <br />
                  {new Date(job.date).toLocaleDateString()}&nbsp;- current
                </div>
              );
            })}
          </div>
        )}
        {
          //!this.props.profile.hideVotes && (
          <Types
            setHover={this.props.setHover}
            width={this.props.width}
            hoverElections={this.props.hoverElections}
            hoverBills={this.props.hoverBills}
            hoverCases={this.props.hoverCases}
          />
        }
        <div
          style={{
            top: "0px",
            width: "100%",
            position: "relative",
            height: "max-content",
            columnCount: this.props.columncount,
            columnGap: "0"
          }}
        ></div>
      </div>
    );
  }
}
export default Vote;
