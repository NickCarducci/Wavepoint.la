import React from "react";
import firebase from "../.././init-firebase.js";
import GooglePickerAuth from "../.././widgets/GooglePickerAuth";

class FormPicker extends React.Component {
  state = {};
  render() {
    return (
      <div
        style={
          this.props.showDriver
            ? {
                display: "flex",
                position: "fixed",
                top: "56px",
                width: "100%",
                height: "500px",
                backgroundColor: "white",
                zIndex: "9999",
                breakInside: "avoid",
                flexDirection: "column"
              }
            : {
                display: "none"
              }
        }
      >
        {this.props.filePreparedToSend.length > 0 ? (
          <div onClick={this.props.clearFiles}>&times;Clear selection</div>
        ) : (
          <div onClick={this.props.showpicker2}>Open/upload file for drive</div>
        )}
        {this.props.contents && this.props.contents.thumbnail && (
          <div
            style={{
              display: "flex",
              position: "relative",
              height: "min-content"
            }}
          >
            <div
              onClick={() => {
                firebase
                  .firestore()
                  .collection("commdocs")
                  .add({
                    thumbnail: this.props.photoThumbnail,
                    content: this.props.photoSrc,
                    authorId: this.props.auth.uid,
                    communityId: this.props.community.id
                  })
                  .catch((err) => console.log(err.message));
                this.props.clearFiles();
                this.props.closeDriver();
              }}
            >
              save to {this.props.community && this.props.community.message}{" "}
              {this.props.commtype}
            </div>
            <div onClick={() => this.props.s.showSettingsDialog()}>
              Change sharing preference: <b>this must be set to public!</b>
              <br />
              (Find the link and choose "anyone can access")
            </div>
          </div>
        )}
        {this.props.contents && this.props.contents.thumbnail && (
          <div
            style={{
              position: "relative",
              width: "86px",
              height: "86px",
              display: "flex",
              borderRadius: "45px",
              border: "1px solid black",
              zIndex: "9999",
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <img
              style={{
                width: "86px",
                height: "auto",
                display: "flex",
                zIndex: "9999"
              }}
              src={this.props.contents.thumbnail}
              alt="error"
            />
          </div>
        )}

        <br />
        <GooglePickerAuth
          filePreparedToSend={this.props.filePreparedToSend}
          clearFiles={this.props.clearFiles}
          showpicker2={this.props.showpicker2}
          picker2={this.props.picker2}
          loadGapiAuth={this.props.loadGapiAuth}
          signedIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
        />
      </div>
    );
  }
}
export default FormPicker;
