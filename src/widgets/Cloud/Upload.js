import React from "react";
import { Link } from "react-router-dom";
import Frame from "./Files/Frame";

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoTitle: "",
      videoFolder: "*"
    };

    this.video = React.createRef();
    this.URL = window.URL;
    this.photo = React.createRef();
  }
  videoUpload = async (x) => {
    var answer = window.confirm("begin upload?");
    if (answer) {
      if (x.title.includes("/")) return window.alert("/ forbidden in title");
      console.log(x.type);
      var filename = x.title; //+ x.type.split("/")[1].toLowerCase();
      var pathReference = `personalCaptures/${this.props.auth.uid}/${x.folder}`;
      var itemRef = this.props.storageRef.child(pathReference + "/" + filename);
      const create = () => {
        console.log("no doc exists by name of: " + x.title);
        // Create a root reference
        console.log(`adding to ${x.folder}...`);
        itemRef
          .put(x.blob)
          .then((snapshot) => {
            console.log(snapshot);
            console.log(
              `${x.title}.${x.type.split("/")[1]}` +
                " added to " +
                `personalCaptures/${this.props.auth.uid}/${x.folder}`
            );
            if (this.props.videos !== []) {
              var folderReference = `personalCaptures/${this.props.auth.uid}/${x.folder}`;
              this.props.getVideosAndFolds(pathReference, folderReference);
            } else this.props.getVideos(pathReference);
          })
          .catch((err) => console.log(err.message));
      };
      await itemRef
        .getDownloadURL()
        .then((url) => {
          window.alert(
            `capture exists with this name "${x.title}"` +
              ` in "${this.props.user.username}/personalCaptures/," Please rename this`
          );
          console.log(
            `capture exists with this name "${x.title}"` +
              ` in "${this.props.user.username}/personalCaptures/," Please rename this`
          );
        })
        .catch((error) => {
          // https://firebase.google.com/docs/storage/web/handle-errors
          if (error.code === "storage/object-not-found") {
            create();
          } else return console.log(error.code);
        });
    }
  };
  render() {
    return (
      <div>
        {this.state.video ? (
          <video
            style={{
              width: "60%",
              height: "300px",
              marginTop: "5px",
              border: "3px solid",
              borderRadius: "10px"
            }}
            width="320"
            height="240"
            controls
            ref={this.video}
          >
            <p>Video stream not available. </p>
          </video>
        ) : this.state.video === false ? (
          <img
            //id="photo"
            ref={this.photo}
            style={{
              margin: "10px",
              marginBottom: "0px",
              marginTop: "5px",
              border: "3px solid",
              borderRadius: "10px",
              height: "90px",
              width: "63px"
            }}
            src={this.state.url}
            alt={this.state.selectedFile.name}
          />
        ) : this.state.frame ? (
          <Frame
            close={() => this.setState({ frame: false })}
            send={async (blob, type) => {
              if (this.state.videoTitle) {
                if (this.props.auth !== undefined) {
                  console.log("initiating upload...");
                  console.log(this.state.url);
                  console.log(blob.size);
                  if (blob.size < 1288490188) {
                    //1,288,490,188.8 (1.2 gb / 2 hours)
                    //this.state.blob) {
                    this.videoUpload({
                      type,
                      folder: this.state.videoFolder,
                      title: this.state.videoTitle,
                      blob,
                      authorId: this.props.auth.uid,
                      date: new Date()
                    });
                  } else
                    return window.alert(
                      `${type} file is too big.  ` +
                        `Upload a file below 1,288,490,188 byte (1.2 gb / ~2 hours)`
                    );
                } else {
                  var answer1 = window.confirm("you will have to login");
                  if (answer1) this.setState({ navigate: true });
                }
              } else {
                window.alert("choose title/location");
                this.setState({ selectedFile: blob });
              }
            }}
          />
        ) : this.state.selectedFile ? (
          <iframe
            style={{
              margin: "10px",
              marginBottom: "0px",
              overflow: "auto",
              marginTop: "5px",
              border: "3px solid",
              borderRadius: "10px",
              height: "180px",
              width: "126px"
            }}
            src={this.state.url}
            title={this.state.selectedFile.name}
          />
        ) : (
          <div
            onClick={() => this.setState({ frame: true })}
            style={{
              margin: "10px",
              marginBottom: "0px",
              border: "3px solid",
              borderRadius: "10px",
              height: "60px",
              width: "42px"
            }}
          />
        )}
        {!this.state.frame && (
          <input
            key={this.state.clear ? 0 : 1}
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              margin: "10px 15px",
              borderRadius: "6px",
              border: "3px solid blue"
            }}
            type="file"
            onChange={(event) => {
              // Update the state
              // const fileReader = new window.FileReader();
              var selectedFile = event.target.files[0];
              if (selectedFile) {
                console.log(selectedFile);
                var blob;
                var url;
                if (
                  selectedFile.type.includes("video") ||
                  selectedFile.type.includes("image") ||
                  selectedFile.type.includes("application/pdf")
                ) {
                  blob = new Blob([selectedFile], {
                    type: selectedFile.type //"video/mp4"
                  });
                  url = this.URL.createObjectURL(blob);
                  console.log(url);
                  this.setState({ selectedFile, url, blob });
                  if (selectedFile.type.includes("video")) {
                    this.videoObj = this.video.current;
                    if (this.videoObj) {
                      //this.videoObj.srcObject = selectedFile.stream;
                      this.videoObj.src = this.state.url;
                      this.setState({ video: true });
                      console.log(url);
                    }
                  } else if (selectedFile.type.includes("image")) {
                    this.setState({ video: false });
                  }
                } else
                  return window.alert(
                    `unsupported file type ${selectedFile.type}`
                  );
              }
            }}
          />
        )}
        {!this.state.frame && (
          <div
            style={{ textDecoration: "none" }}
            onClick={
              this.props.auth === undefined && this.state.navigate
                ? () => this.props.getUserInfo() //"/login"
                : null //window.location.pathname
            }
          >
            <button
              onClick={async () => {
                if (this.state.navigate) return null;
                //e.stopPropagation();
                if (this.state.url) {
                  if (this.state.videoTitle) {
                    if (this.props.auth !== undefined) {
                      console.log("initiating upload...");
                      console.log(this.state.url);
                      console.log(this.state.blob.size);
                      if (this.state.blob.size < 1288490188) {
                        //1,288,490,188.8 (1.2 gb / 2 hours)
                        //this.state.blob) {
                        this.videoUpload({
                          type: this.state.selectedFile.type,
                          folder: this.state.videoFolder,
                          title: this.state.videoTitle,
                          blob: this.state.blob,
                          authorId: this.props.auth.uid,
                          date: new Date()
                        });
                      } else
                        return window.alert(
                          `${this.state.selectedFile.type} file is too big.  ` +
                            `Upload a file below 1,288,490,188 byte (1.2 gb / ~2 hours)`
                        );
                    } else {
                      var answer1 = window.confirm("you will have to login");
                      if (answer1) this.setState({ navigate: true });
                    }
                  } else return window.alert("no title");
                } else return window.alert("nothing to save");
              }}
              style={{
                color: "white",
                width: "max-content",
                margin: "10px",
                marginTop: "5px",
                display: "flex",
                flexDirection: "column",
                padding: "5px",
                borderRadius: "6px",
                backgroundColor: "blue"
              }}
            >
              {this.state.navigate ? "Login" : "Save"}
            </button>
          </div>
        )}
        {this.state.selectedFile && (
          <select
            value={this.state.videoFolder}
            onChange={(e) => this.setState({ videoFolder: e.target.value })}
            className="input"
            style={{ width: "80%" }}
          >
            {this.props.user !== undefined && this.props.user.folders ? (
              this.props.user.folders.map((x) => {
                return <option key={x}>{x}</option>;
              })
            ) : (
              <option>*</option>
            )}
          </select>
        )}
        {this.state.selectedFile && (
          <input
            value={this.state.videoTitle}
            onChange={(e) => this.setState({ videoTitle: e.target.value })}
            placeholder="name"
            className="input"
            style={{ width: "80%" }}
          />
        )}
      </div>
    );
  }
}
export default Upload;
