import React from "react";
import firebase from "../../.././init-firebase.js";
import { arrayMessage } from "../../../widgets/authdb.js";

class EditTitle extends React.Component {
  render() {
    const { parent } = this.props;
    return (
      <form
        style={{
          borderTop: "1px solid rgb(160,160,160)",
          top: "0px",
          display: "flex",
          position: "relative",
          width: "100%",
          minHeight: "30px",
          color: "black",
          flexDirection: "column",
          fontSize: "15px"
        }}
        onSubmit={(e) => {
          e.preventDefault();
          if (this.props.editingTitle !== parent.message) {
            var answer = window.confirm(
              "submit edit? no going back: " + this.state.editingTitle
            );
            if (answer) {
              var messageAsArray = arrayMessage(this.props.editingTitle);
              firebase
                .firestore()
                .collection(parent.collection)
                .doc(parent.id)
                .update({
                  messageAsArray,
                  message: this.props.editingTitle
                })
                .then(() => {
                  this.props.setEditing({
                    editingTitle: null
                  });
                })
                .catch((err) => console.log(err.message));
            }
          } else {
            this.props.setEditing({ editingTitle: null });
          }
        }}
      >
        <div
          ref={this.textBoxTitle}
          style={{
            fontFamily: "'Lato', sans-serif",
            minHeight: "30px",
            border: "2px solid",
            width: "calc(100% - 14px)",
            position: "absolute",
            zIndex: "-9999",
            overflowWrap: "break-word"
          }}
        >
          {this.props.editingTitle
            .replace(/(\r\n|\r|\n)/g, "\n")
            .split("\n")
            .map((item, i) => (
              <span style={{ fontSize: "14px" }} key={i}>
                {item}
                <br />
              </span>
            ))}
        </div>
        <textarea
          className="input"
          defaultValue={parent.message}
          onChange={(e) => {
            var editingTitle = e.target.value;
            if (
              editingTitle !== "" &&
              !["oldElections", "oldCases", "oldBudget"].includes(
                parent.collection
              )
            ) {
              this.props.setEditing({ editingTitle }, () => {
                if (this.textBoxTitle && this.textBoxTitle.current) {
                  var textBoxHeight = this.textBoxTitle.current.offsetHeight;
                  this.setState({
                    textBoxHeight
                  });
                }
              });
            }
          }}
          style={{
            width: "calc(100% - 14px)",
            padding: "0px 5px",
            border: "2px solid",
            fontFamily: "'Lato', sans-serif",
            height: this.state.textBoxHeight,
            position: "relative",
            resize: "none",
            overflowWrap: "break-word"
          }}
        />
        <div>
          <div
            style={{
              padding: "10px",
              backgroundColor: "rgb(150,200,250)"
            }}
            onClick={() => this.props.setEditing({ editingTitle: null })}
          >
            &times;
          </div>
          <button type="submit">save</button>
        </div>
      </form>
    );
  }
}
export default EditTitle;
