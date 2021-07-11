import React from "react";

class OldProfile extends React.Component {
  state = {};
  render() {
    return (
      <div>
        <div
          onClick={() => {
            this.state.openNameSettings &&
              this.setState({ openNameSettings: false });
            this.state.openBlockSettings &&
              this.setState({ openBlockSettings: false });
            this.state.openPicSettings
              ? this.setState({ openPicSettings: false })
              : this.setState({ openPicSettings: true });
          }}
          style={{
            display: "flex",
            borderTop: "2px solid black",
            width: "100%",
            padding: "20px 0px",
            zIndex: "7777"
          }}
        >
          <h1>Change Profile Picture</h1>
          <div
            style={
              this.state.openPicSettings
                ? {
                    display: "flex",
                    position: "absolute",
                    right: "10px",
                    width: "26px",
                    height: "26px",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(0deg)",
                    borderRadius: "50px",
                    backgroundColor: "grey",
                    transition: "transform .1s ease-in"
                  }
                : {
                    display: "flex",
                    position: "absolute",
                    right: "10px",
                    width: "26px",
                    height: "26px",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "rotate(180deg)",
                    borderRadius: "50px",
                    backgroundColor: "grey",
                    transition: "transform .1s ease-in"
                  }
            }
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: "3.8px",
                right: "9.4px",
                color: "white"
              }}
            >
              ^
            </div>
          </div>
        </div>
        <div
          style={
            this.state.openPicSettings
              ? {
                  display: "flex",
                  height: "min-content",
                  transition: "height .1s ease-in",
                  zIndex: "7777"
                }
              : {
                  display: "flex",
                  height: "0px",
                  transition: "height .1s ease-out",
                  zIndex: "7777"
                }
          }
        >
          <div
            style={
              this.state.openPicSettings
                ? {
                    display: "flex",
                    opacity: "1",
                    height: "min-content",
                    transition: "opacity .1s ease-in"
                  }
                : {
                    display: "flex",
                    opacity: "0",
                    height: "min-content",
                    transition: "opacity .1s ease-out"
                  }
            }
          >
            {/*this.props.user !== undefined &&
            !this.props.user.photoThumbnail &&
            !this.state.contents &&
            !this.state.contents.thumbnail && (
              <div>
                <ReactColorPicker
                  // Set the size of the color picker
                  width="160"
                  // Set the initial color to pure red
                  color={this.state.color}
                  user={this.props.user}
                  onColorChange={(e) =>
                    this.setState({ color: e.hexString })
                  }
                />
                <br />
                <div
                  onClick={() => {
                    this.setState({ temprgb: this.state.profilergb });
                    firebase
                      .firestore()
                      .collection("users")
                      .doc(this.props.auth.uid)
                      .update({ profilergb: this.state.color })
                      .catch((err) => console.log(err.message));
                  }}
                >
                  {this.state.temprgb !== this.state.color ? (
                    "Save"
                  ) : (
                    <div>&times;</div>
                  )}
                </div>
                <br />
                <div
                  onClick={
                    () =>
                      this.setState({ color: this.props.user.profilergb })
                    //this.colourWheel.clear(() => console.log("cleared color"))
                  }
                >
                  Reset
                </div>
                <br />
              </div>
                )*/}
            {this.state.contents && this.state.contents.thumbnail && (
              <div>
                <div
                  onClick={() => {
                    firebase
                      .firestore()
                      .collection("users")
                      .doc(this.props.auth.uid)
                      .update({
                        photoThumbnail: this.state.photoThumbnail,
                        photoSrc: this.state.photoSrc
                      })
                      .catch((err) => console.log(err.message));
                    this.props.clearFilePreparedToSend();
                    this.setState({ contents: {} });
                  }}
                >
                  save as profile photo
                </div>
                <br />
                <div onClick={() => this.props.s.showSettingsDialog()}>
                  Change sharing preference (must be set to public!)
                </div>
              </div>
            )}
            {this.state.contents && this.state.contents.thumbnail && (
              <div
                style={{
                  position: "relative",
                  width: "86px",
                  height: "86px",
                  display: "flex",
                  borderRadius: "45px",
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
                  src={this.state.contents.thumbnail}
                  alt="error"
                />
              </div>
            )}
            <br />

            {/*



  //start picker
  */}
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                width: "100%",
                height: "min-content",
                alignItems: "center"
              }}
            >
              <br />
              {this.props.filePreparedToSend.length > 0 ? (
                <div
                  onClick={() => {
                    this.setState({ contents: {} });
                    this.props.clearFilePreparedToSend();
                  }}
                >
                  &times;Clear selection
                </div>
              ) : (
                <div
                  onClick={() =>
                    window.picker2
                      ? window.picker2.setVisible(true)
                      : window.alert("one more moment please")
                  }
                  style={{
                    display: "flex",
                    zIndex: "9999",
                    width: "100%"
                  }}
                >
                  Open/upload file for drive
                </div>
              )}
              {/*this.state.filePreparedToSend.length > 0 && (
      <div>
        <div
          style={
            this.state.filePreparedToSend.length > 1
              ? {
                  display: "flex",
                  padding: "0px 20px",
                  border: "1px solid #222",
                  borderRadius: "5px",
                  flexDirection: "row",
                  justifyContent: "center",
                  height: "112px",
                  alignItems: "center"
                }
              : {
                  display: "flex",
                  padding: "0px 20px",
                  border: "0px solid #222",
                  borderRadius: "5px",
                  flexDirection: "row",
                  justifyContent: "center",
                  height: "112px",
                  alignItems: "center"
                }
          }
        >
          {this.state.filePreparedToSend.map(x => {
            return (
              <div
                style={{
                  display: "flex",
                  padding: "0px 20px",
                  border: "1px solid #222",
                  borderRadius: "5px",
                  flexDirection: "row",
                  height: "56px",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <img src={x.iconUrl} alt="error" />
                &nbsp;&nbsp;&nbsp;
                <div>{x.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    )*/}
              <br />
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  zIndex: "9999",
                  width: "100%",
                  height: "min-content",
                  flexDirection: "column"
                }}
              >
                {/*<input type="file" accept="image/*" multiple="false" />*/}
                <GoogleLoginButton
                  profileOpen={this.props.profileOpen}
                  loadGapiApi={this.props.loadGapiApi}
                />
                <div
                  style={
                    this.props.signedIn === true
                      ? {
                          display: "flex",
                          position: "relative",
                          zIndex: "9999",
                          height: "56px",
                          padding: "0px 20px",
                          width: "max-content",
                          border: "1px solid black",
                          justifyContent: "center",
                          alignItems: "center"
                        }
                      : {
                          display: "none"
                        }
                  }
                  onClick={this.props.switchAccount}
                >
                  Sign Out
                </div>
                <div
                  style={
                    this.props.signedIn === true
                      ? {
                          display: "flex",
                          position: "relative",
                          zIndex: "9999",
                          minHeight: "56px",
                          height: "min-content",
                          padding: "20px 20px",
                          border: "1px solid black",
                          justifyContent: "center",
                          flexDirection: "column"
                        }
                      : {
                          display: "none"
                        }
                  }
                  onClick={() => {
                    var answer = window.confirm(
                      "Are you sure you want to sign out of all Google apps?"
                    );
                    if (answer) {
                      this.props.signOut();
                    }
                  }}
                >
                  Hard Sign Out
                  <br />
                  <div style={{ color: "grey" }}>
                    This will delete your cached passwords
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  zIndex: "9999",
                  fontSize: "15px",
                  height: "min-content",
                  width: "100%"
                }}
              >
                <br />
                You can update this file directly in your drive
                <br />
                we just show the thumbnail
                <br />
              </div>
              <br />
            </div>
            {/*



//End picker
*/}
          </div>
        </div>
      </div>
    );
  }
}
export default OldProfile;
