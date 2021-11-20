import React from "react";
//import GooglePickerAuth from "../../.././widgets/GooglePickerAuth";
//import Upload from "../../.././widgets/Cloud/Upload";
//import VideoRecorder from "../../../widgets/Video/VideoRecorder";

class UpdateProfilePicture extends React.Component {
  render() {
    const { columncount } = this.props;
    this.picker1 = window.picker1 && window.picker1;
    return (
      <div
        style={
          this.props.addPic
            ? {
                backgroundColor: "white",
                userSelect: this.props.editingSomeText ? "none" : "all",
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                zIndex: 6,
                width: "100%",
                maxHeight:
                  columncount === 1 || this.props.postHeight > 0 ? "" : "100%",
                height: `max-content`,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                opacity: "1",
                borderBottom: "1px solid grey",
                overflowX: "hidden",
                overflowY: columncount === 1 ? "hidden" : "auto"
              }
            : {
                display: "none"
              }
        }
      >
        <div
          style={{
            userSelect: this.props.editingCommunity ? "none" : "all",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "min-content",
            width: "100%",
            breakInside: "avoid"
          }}
        >
          {/*{this.props.filePreparedToSend.length > 0 ? (
            <div onClick={this.props.clearFiles}>&times;Clear selection</div>
          ) : (
            <div
              onClick={() =>
                window.picker1
                  ? window.picker1.setVisible(true)
                  : window.alert("one more moment please")
              }
            >
              Open/upload file for drive
            </div>
          )}
          {this.props.contents && this.props.contents.thumbnail && (
            <div onClick={() => this.props.s.showSettingsDialog()}>
              Change sharing preference: <b>this must be set to public!</b>
              <br />
              (Find the link and choose "anyone can access")
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
                  display: "flex"
                }}
                src={this.props.contents.thumbnail}
                alt="error"
              />
            </div>
          )}
          <br />
          <GooglePickerAuth
            filePreparedToSend={this.props.filePreparedToSend}
            addPic={this.props.addPic}
            switchAccount={this.props.switchAccount}
            signOut={this.props.signOut}
            signedIn={this.props.signedIn}
            loadGapiAuth={this.props.loadGapiAuth}
          />
         <div onClick={this.addPic && this.addPicFalse} className="openaddcomm2">
          {!this.props.openDescript && !this.props.addPic ? (
            <div>back</div>
          ) : this.props.addPic ? (
            ""
          ) : (
            <div style={{ transform: "translateY(100%)" }}>&times;</div>
          )}
        </div>*/}
          {
            this.props.community &&
              null /*<VideoRecorder
              unloadGreenBlue={this.props.unloadGreenBlue}
              loadGreenBlue={this.props.loadGreenBlue}
              getUserInfo={this.props.getUserInfo}
              storageRef={this.props.storageRef}
              topic={this.state.selectedFolder}
              getVideos={this.props.getVideos}
              getFolders={this.props.getFolders}
              folders={this.props.folders}
              videos={this.props.videos}
              isPost={true}
              auth={this.props.auth}
              room={{ id: `${collection + x.id}` }}
              threadId={`${collection + x.id}`}
              cancel={() => this.setState({ videoRecorderOpen: false })}
              entityType={x.entityType}
              entityId={x.entityId}
            />*/
          }
        </div>
      </div>
    );
  }
}

export default UpdateProfilePicture;
