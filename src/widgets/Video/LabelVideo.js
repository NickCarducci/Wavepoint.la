import React from "react";
import firebase from "../../.././init-firebase";

class LabelVideo extends React.Component {
  state = {
    videoTitle: "",
    videoFolder: "*"
  };
  render() {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (this.state.videoTitle !== "") {
            var storageRef = firebase.storage().ref();
            firebase
              .firestore()
              .collection("threadCaptures")
              .where("title", "==", this.state.videoTitle)
              .where("threadId", "==", this.props.threadId)
              .get()
              .then((doc) => {
                var foo = doc.data();
                foo.id = doc.id;
                window.alert(
                  `capture exists with this name ${this.state.videoTitle} in this thread.  Please rename this`
                );
                console.log(
                  `capture exists with this name ${this.state.videoTitle} in this thread.  Please rename this`
                );
              })
              .catch((err) => {
                console.log("no doc exists: " + err.message);
                // Create a root reference
                console.log(this.props.blob);
                console.log(storageRef);
                firebase
                  .firestore()
                  .collection("threadCaptures")
                  .add({
                    folder: this.state.videoFolder,
                    title: this.state.videoTitle,
                    authorId: this.props.auth.uid,
                    threadId: this.props.threadId,
                    time: new Date()
                  })
                  .then((docRef) => {
                    //var captureId = docRef.id;

                    // Create a reference to 'mountains.jpg'
                    //var captureRef = storageRef.child("mountains.jpg");

                    // Create a reference to 'images/mountains.jpg'
                    //var captureVideoRef =
                    storageRef.child(
                      `threadCaptures/${this.props.threadId}/${this.state.videoFolder}/${this.state.videoTitle}.jpg`
                    );
                    storageRef
                      .put(this.props.blob)
                      .then((snapshot) => {
                        console.log("Uploaded a blob or file!");
                        console.log(snapshot);
                      })
                      .catch((err) => console.log(err.message));
                  });
              });
          }
        }}
      >
        <input
          placeholder="folder"
          value={this.state.videoFolder}
          onChange={(e) => this.setState({ videoFolder: e.target.value })}
        />
        <input
          placeholder="title"
          value={this.state.videoTitle}
          onChange={(e) => this.setState({ videoTitle: e.target.value })}
        />
      </form>
    );
  }
}

export default LabelVideo;
