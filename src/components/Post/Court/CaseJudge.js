import React from "react";
import firebase from "../../.././init-firebase.js";

class CaseJudge extends React.Component {
  state = {};
  render() {
    const { x } = this.props;
    return (
      <div>
        {this.props.auth !== undefined &&
          this.props.community &&
          (this.props.community.authorId === this.props.auth.uid ||
            this.props.community.admin.includes(this.props.auth.uid) ||
            this.props.community.faculty.includes(this.props.auth.uid)) && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                firebase
                  .firestore()
                  .collection(x.collection)
                  .doc(x.id)
                  .update({
                    judges: firebase.firestore.arrayUnion(this.state.judge)
                  })
                  .then(() => {
                    console.log(
                      "assigned judge " + this.state.judge + "to " + x.message
                    );
                    this.setState({ judge: "" });
                  })
                  .catch((err) => console.log(err.message));
              }}
            >
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
                assign judge{" "}
                {!this.props.community.judges ||
                this.props.community.judges.length === 0
                  ? "/none"
                  : this.props.community.judges.length}
                <select
                  value={this.state.judge}
                  onChange={(e) => {
                    this.setState({ judge: e.target.value });
                  }}
                >
                  <option value=""></option>
                  {this.props.community.judges &&
                    this.props.community.judges.map((x) => {
                      var thisone = this.props.users.find((y) => y.id === x);
                      return <option value={x.id}>{thisone.username}</option>;
                    })}
                </select>
              </div>
            </form>
          )}
        {x &&
          x.judges &&
          x.judges.map((jd) => {
            return (
              <div
                key={x}
                style={{
                  display: "flex",
                  padding: "20px",
                  width: "100%",
                  height: "min-content",
                  flexDirection: "row",
                  alignItems: "center"
                }}
                onClick={() => {
                  if (this.props.x.judges.includes(x)) {
                    var answer1 = window.confirm(
                      `remove ${x.name}@${x.username} as judge of ${x.message}?`
                    );

                    if (answer1)
                      firebase
                        .firestore()
                        .collection(this.props.collection)
                        .doc(this.props.x.id)
                        .update({
                          judges: firebase.firestore.FieldValue.arrayRemove(x)
                        })
                        .catch((err) => console.log(err.message));
                  }
                }}
              >
                <img
                  style={{ height: "30px", width: "30px" }}
                  src={jd.photoThumbnail}
                  alt={jd.username}
                />
                {jd.name}@{jd.username}&nbsp;
                {this.props.x.jury.includes(x) &&
                  (this.props.auth.uid === x.authorId ||
                    (x.admin && x.admin.includes(this.props.auth.uid))) && (
                    <div
                      style={{
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
                      }}
                    >
                      &times;
                    </div>
                  )}
              </div>
            );
          })}
      </div>
    );
  }
}
export default CaseJudge;
