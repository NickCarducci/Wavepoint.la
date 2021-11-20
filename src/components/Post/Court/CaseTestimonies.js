import React from "react";
import firebase from "../../.././init-firebase.js";
import AddTestimoner from "./AddTestimoner";

class CaseTestimonies extends React.Component {
  render() {
    const { x, court } = this.props;
    return (
      <div>
        {court && (
          <AddTestimoner
            auth={this.props.auth}
            collection={x.collection}
            x={x}
            users={this.props.users}
            community={this.props.community}
          />
        )}
        {x.testimonies &&
          x.testimonies.map((tm) => {
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
                  if (this.props.x.testimonies.includes(x)) {
                    var answer1 = window.confirm(
                      `remove ${x.name}@${x.username} as testimony-giver of ${x.message}?`
                    );

                    if (answer1)
                      firebase
                        .firestore()
                        .collection(this.props.collection)
                        .doc(this.props.x.id)
                        .update({
                          testimonies: firebase.firestore.FieldValue.arrayRemove(
                            x
                          )
                        })
                        .catch((err) => console.log(err.message));
                  }
                }}
              >
                <img
                  style={{ height: "30px", width: "30px" }}
                  src={tm.photoThumbnail}
                  alt={tm.username}
                />
                {tm.name}@{tm.username}&nbsp;
                {this.props.x.testimonies.includes(x) &&
                  (this.props.auth.uid === x.authorId ||
                    (x.admin && x.admin.includes(this.props.auth.uid)) ||
                    (x.judges && x.judges.includes(this.props.auth.uid))) && (
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
        {(this.props.auth === undefined ||
          !x.testimonies ||
          (x.testimonies && !x.testimonies.includes(this.props.auth.uid))) && (
          <div
            //to={this.props.auth === undefined ? "/login" : "/"}
            onClick={
              this.props.auth === undefined
                ? () => this.props.getUserInfo()
                : x.requestingTestimoner &&
                  x.requestingTestimoner.includes(this.props.auth.uid)
                ? () =>
                    firebase
                      .firestore()
                      .collection(x.collection)
                      .doc(x.id)
                      .update({
                        requestingTestimoner: firebase.firestore.FieldValue.arrayRemove(
                          this.props.auth.uid
                        )
                      })
                      .catch((err) => console.log(err.message))
                : () =>
                    firebase
                      .firestore()
                      .collection(x.collection)
                      .doc(x.id)
                      .update({
                        requestingTestimoner: firebase.firestore.FieldValue.arrayUnion(
                          this.props.auth.uid
                        )
                      })
                      .catch((err) => console.log(err.message))
            }
            style={
              this.props.auth !== undefined &&
              x.requestingTestimoner &&
              x.requestingTestimoner.includes(this.props.auth.uid)
                ? {
                    height: "56px",
                    display: "flex",
                    width: "calc(100%)",
                    backgroundColor: "navy",
                    color: "white",
                    textIndent: "5px",
                    breakInside: "avoid",
                    alignItems: "center",
                    transition: "1s ease-in"
                  }
                : {
                    height: "56px",
                    display: "flex",
                    width: "calc(100%)",
                    backgroundColor: "rgb(100,150,220)",
                    color: "white",
                    textIndent: "5px",
                    breakInside: "avoid",
                    alignItems: "center",
                    transition: "1s ease-out",
                    textDecoration: "none"
                  }
            }
          >
            <div
              style={{
                display: "flex",
                width: "calc(100% - 20px)",
                justifyContent: "space-between"
              }}
            >
              {this.props.auth === undefined
                ? "sign in to request to give sworn testimony"
                : x.requestingTestimoner &&
                  x.requestingTestimoner.includes(this.props.auth.uid)
                ? "Recind request to give sworn testimony"
                : "Request Access"}
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default CaseTestimonies;
