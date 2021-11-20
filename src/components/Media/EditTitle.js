import React from "react";
import firebase from "../.././init-firebase.js";
import { arrayMessage } from "../../widgets/authdb.js";

class EditTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editingTitle: props.editingTitle };
    this.textBoxTitle = React.createRef();
  }
  componentDidMount = () => this.size();
  size = () => {
    if (this.textBoxTitle && this.textBoxTitle.current) {
      var textBoxHeight = this.textBoxTitle.current.offsetHeight;
      this.setState({
        textBoxHeight
      });
    }
  };
  render() {
    const { editingTitle } = this.state;
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
          if (editingTitle !== parent.message) {
            var answer = window.confirm(
              "submit edit? no going back: " + editingTitle
            );
            if (answer) {
              var messageAsArray = arrayMessage(editingTitle);
              firebase
                .firestore()
                .collection(parent.collection)
                .doc(parent.id)
                .update({
                  messageAsArray,
                  message: editingTitle
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
            padding: "0px 5px",
            border: "2px solid",
            minHeight: "30px",
            width: "calc(100% - 14px)",
            position: "absolute",
            zIndex: "-9999"
          }}
        >
          {editingTitle
            .replace(/(\r\n|\r|\n)/g, "\n")
            .split("\n")
            .map((item, i) => (
              <span style={{ fontSize: "14px" }} key={i}>
                {item}
                <br />
              </span>
            ))}
          <br />
          <br />
          <br />
        </div>
        <textarea
          defaultValue={parent.message}
          value={this.state.editingTitle}
          onChange={(e) => {
            var editingTitle = e.target.value;
            if (
              editingTitle !== "" &&
              !["oldElections", "oldCases", "oldBudget"].includes(
                parent.collection
              )
            ) {
              this.setState({ editingTitle }, this.size);
            }
          }}
          style={{
            fontFamily: "inherit",
            fontSize: "inherit",

            width: "calc(100% - 14px)",
            padding: "0px 5px",
            border: "2px solid",
            height: this.state.textBoxHeight,
            position: "relative",
            resize: "none"
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
