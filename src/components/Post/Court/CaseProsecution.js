import React from "react";
import firebase from "../../.././init-firebase.js";
import AddProsecution from "./AddProsecution";
import { Link } from "react-router-dom";

class CaseProsecution extends React.Component {
  render() {
    const { x, court } = this.props;
    if (x) {
      return (
        <div>
          {court && (
            <AddProsecution
              auth={this.props.auth}
              collection={x.collection}
              x={x}
              users={this.props.users}
              community={this.props.community}
            />
          )}
          {x.prosecution &&
            x.prosecution.map((pr) => {
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
                    if (this.props.x.prosecution.includes(x)) {
                      var answer1 = window.confirm(
                        `remove ${x.name}@${x.username} as prosecution of ${x.message}?`
                      );

                      if (answer1)
                        firebase
                          .firestore()
                          .collection(this.props.collection)
                          .doc(this.props.x.id)
                          .update({
                            prosecution: firebase.firestore.FieldValue.arrayRemove(
                              x
                            )
                          })
                          .catch((err) => console.log(err.message));
                    }
                  }}
                >
                  <img
                    style={{ height: "30px", width: "30px" }}
                    src={pr.photoThumbnail}
                    alt={pr.username}
                  />
                  {pr.name}@{pr.username}&nbsp;
                  {this.props.x.prosecution.includes(x) &&
                    (this.props.auth.uid === x.authorId ||
                      (x.admin && x.admin.includes(this.props.auth.uid)) ||
                      (x.judges && x.judges.includes(this.props.auth.uid)) ||
                      (x.prosecution &&
                        x.prosecution.includes(this.props.auth.uid))) && (
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
            !x.prosecution ||
            (x.prosecution &&
              !x.prosecution.includes(this.props.auth.uid))) && (
            /*!(
            this.props.auth.uid === this.props.community.authorId ||
            (this.props.community.admin &&
              this.props.community.admin.includes(this.props.auth.uid)) ||
            x.authorId === this.props.auth.uid ||
            (x.admin && x.admin.includes(this.props.auth.uid)) ||
            (x.judges && x.judges.includes(this.props.auth.uid))
          ) && */

            <Link
              //to={this.props.auth === undefined ? "/login" : "/"}
              onClick={
                this.props.auth === undefined
                  ? () => this.props.getUserInfo()
                  : x.requestingProsecution &&
                    x.requestingProsecution.includes(this.props.auth.uid)
                  ? () =>
                      firebase
                        .firestore()
                        .collection(x.collection)
                        .doc(x.id)
                        .update({
                          requestingProsecution: firebase.firestore.FieldValue.arrayRemove(
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
                          requestingProsecution: firebase.firestore.FieldValue.arrayUnion(
                            this.props.auth.uid
                          )
                        })
                        .catch((err) => console.log(err.message))
              }
              style={
                this.props.auth !== undefined &&
                x.requestingProsecution &&
                x.requestingProsecution.includes(this.props.auth.uid)
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
                  ? "sign in to request to be part of the prosecution"
                  : x.requestingProsecution &&
                    x.requestingProsecution.includes(this.props.auth.uid)
                  ? "Recind request to be part of the prosecution"
                  : "Request Access"}
              </div>
            </Link>
          )}
        </div>
      );
    } else return null;
  }
}
export default CaseProsecution;
