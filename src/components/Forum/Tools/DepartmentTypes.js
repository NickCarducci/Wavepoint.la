import React from "react";
import firebase from "../../.././init-firebase.js";

class DepartmentTypes extends React.Component {
  state = {};
  render() {
    return (
      <div style={{ breakInside: "avoid" }}>
        <div
          style={{
            display: "flex",
            width: "calc(100%)",
            backgroundColor: "navy",
            color: "white",
            height: "min-content"
          }}
        >
          {this.state.edit ? (
            <div
              style={{
                margin: "10px 50px",
                display: "flex",
                width: "calc(100% - 20px)",
                justifyContent: "space-between"
              }}
            >
              <div
                onClick={() => {
                  firebase
                    .firestore()
                    .collection("communities")
                    .doc(this.props.community.id)
                    .update({ departmentType: "school" })
                    .catch((err) => console.log(err.message));

                  this.setState({ edit: false });
                }}
                style={
                  this.props.community.departmentType === "school"
                    ? {
                        display: "flex",
                        position: "relative",
                        borderBottom: "4px solid white"
                      }
                    : {
                        display: "flex",
                        position: "relative"
                      }
                }
              >
                school
              </div>
              <div
                onClick={() => {
                  firebase
                    .firestore()
                    .collection("communities")
                    .doc(this.props.community.id)
                    .update({ departmentType: "town" })
                    .catch((err) => console.log(err.message));

                  this.setState({ edit: false });
                }}
                style={
                  this.props.community.departmentType === "town"
                    ? {
                        display: "flex",
                        position: "relative",
                        borderBottom: "4px solid white"
                      }
                    : {
                        display: "flex",
                        position: "relative"
                      }
                }
              >
                town
              </div>
              <div
                onClick={() => {
                  firebase
                    .firestore()
                    .collection("communities")
                    .doc(this.props.community.id)
                    .update({ departmentType: "state" })
                    .catch((err) => console.log(err.message));
                  this.setState({ edit: false });
                }}
                style={
                  this.props.community.departmentType === "state"
                    ? {
                        display: "flex",
                        position: "relative",
                        borderBottom: "4px solid white"
                      }
                    : {
                        display: "flex",
                        position: "relative"
                      }
                }
              >
                state
              </div>
            </div>
          ) : (
            <div
              style={{
                margin: "10px 10px",
                display: "flex",
                width: "calc(100% - 20px)",
                justifyContent: "space-between"
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  borderBottom: "2px solid white"
                }}
                onClick={() => this.setState({ edit: true })}
              >
                typeset: {this.props.community.departmentType}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            width: "calc(100%)",
            backgroundColor: "navy",
            color: "white",
            height: "min-content"
          }}
        >
          <div
            style={{
              padding: "10px",
              position: "relative",
              color: "rgb(200,240,220)"
            }}
          >
            Specify the department type-set you want to display above{" "}
            <div style={{ color: "rgb(170,220,190)", fontSize: "12px" }}>
              admins control
            </div>
            {(this.props.community.departmentType === "school"
              ? [
                  { name: "class", code: "a" }, //a
                  { name: "campus", code: "g" }, //g
                  { name: "records & preservation", code: "c" }, //c
                  { name: "events & recreation", code: "d" }, //d
                  { name: "engineering arts & science", code: "f" }, //f
                  { name: "health & safety", code: "b" }, //b
                  { name: "tuition & finance", code: "e" } //e
                ]
              : this.props.community.departmentType === "town"
              ? [
                  { name: "engineering & variance", code: "f" }, //f
                  { name: "records & preservation", code: "c" }, //c
                  { name: "events parks & recreation", code: "d" }, //d
                  { name: "education", code: "a" }, //a
                  { name: "public health", code: "b" }, //b
                  { name: "fire safety & stormweather", code: "h" },
                  { name: "sanitation", code: "i" },
                  { name: "power", code: "g" }, //g
                  { name: "finances & taxes", code: "e" } //e
                ]
              : this.props.community.departmentType === "state"
              ? [
                  { name: "budget & finance", code: "e" }, //e
                  { name: "education", code: "a" }, //a
                  { name: "health & safety", code: "b" }, //b
                  { name: "legal rights", code: "f" }, //f
                  { name: "records & preservation", code: "c" }, //c
                  { name: "foreign relation", code: "g" } //g
                ]
              : []
            ).map((x) => {
              return (
                <div
                  key={x.code}
                  style={{
                    width: "max-content",
                    margin: "5px 0px",
                    padding: "0px 5px",
                    color: "#844fff",
                    backgroundColor: "rgb(200,200,240)",
                    transition: ".3s ease-in"
                  }}
                >
                  {x.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default DepartmentTypes;
