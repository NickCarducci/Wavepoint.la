import React from "react";
import RollFiles from ".././Media/RollFiles";
import FormPicker from "./FormPicker";

class ForumAccessories extends React.Component {
  state = {};
  render() {
    return (
      <div
        style={{
          zIndex: "6",
          display: "flex",
          position: "fixed",
          backgroundColor: "black"
        }}
      >
        {this.props.commtype === "forms & permits" && (
          <div
            style={{
              display: "flex",
              position: "fixed",
              bottom: "0px",
              width: "100%",
              top: "0px",
              flexDirection: "column",
              backgroundColor: "white"
              //backgroundColor: "rgb(23, 27, 32)",
            }}
          >
            {/*<div
            style={{
              display: "flex",
              position: "relative",
              height: "56px",
              width: "100%",
              border: "blue 1px solid"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                height: "56px"
              }}
            >
              <div
                style={{
                  margin: "10px",
                  display: "flex",
                  position: "relative",
                  border: "blue 1px solid"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    width: "calc(56px - 20px)",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "blue"
                  }}
                >
                  _/
                </div>
                folder
              </div>
            </div>
          </div>*/}
            {!this.props.commdocs ? (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  height: "min-content",
                  width: "300px",
                  color: "grey"
                }}
              >
                No docs to show
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  height: "100%",
                  width: "100%",
                  border: "blue 1px solid",
                  overflowX: "auto"
                }}
              >
                <RollFiles
                  user={this.props.user}
                  auth={this.props.auth}
                  showStuff={true}
                  videos={this.props.commdocs}
                  dontworry={true}
                />
              </div>
            )}
          </div>
        )}
        <FormPicker
          photoThumbnail={this.props.photoThumbnail}
          photoSrc={this.props.photoSrc}
          contents={this.props.contents}
          showpicker2={this.props.showpicker2}
          clearFiles={this.props.clearFilesPreparedToSend}
          filePreparedToSend={this.props.filePreparedToSend}
          s={this.props.s}
          community={this.props.community}
          picker2={this.props.picker2}
          loadGapiAuth={this.props.loadGapiAuth}
          signIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          commtype={this.props.commtype}
          auth={this.props.auth}
          showDriver={this.props.showDriver}
          closeDriver={this.props.closeDriver}
        />
        {this.props.commtype === "forms & permits" ? (
          this.state.showDriver ? (
            <div
              onClick={() => this.setState({ showDriver: false })}
              style={{
                display: "flex",
                position: "fixed",
                right: "40px",
                top: "86px",
                color: "black",
                height: "40px",
                width: "40px",
                zIndex: "9999"
              }}
            >
              &times;
            </div>
          ) : (
            <div
              onClick={() => this.setState({ showDriver: true })}
              style={{
                display: "flex",
                position: "fixed",
                right: "40px",
                top: "86px",
                color: "grey",
                height: "40px",
                width: "40px",
                zIndex: "9999"
              }}
            >
              +
            </div>
          )
        ) : null}
      </div>
    );
  }
}

export default ForumAccessories;
