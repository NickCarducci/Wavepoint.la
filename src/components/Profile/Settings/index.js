import React from "react";
import firebase from "../../.././init-firebase";
import PhoneInput from "react-phone-number-input";
import { Link } from "react-router-dom";
import { specialFormatting } from "../../../widgets/authdb";
import {
  reserveWords,
  pagesNamesTaken,
  individualTypes
} from "../../../widgets/arraystrings";
//import VideoRecorder from "../../../widgets/Video/VideoRecorder";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      name: "",
      contents: {},
      usernameTaken: false,
      loading: false,
      working: true,
      me: "",
      chosenSetting: null,
      showNewPInput: false,
      newPhone: "",
      textgood: false
    };
    this.recaptcha = React.createRef();
  }
  confirmCode = (e) => {
    e.preventDefault();
    window.confirmationResult
      .confirm(this.state.textedCode)
      .then((result) => {
        //var user = result.user;
        //console.log(user);
        this.setState({ textgood: true, working: false });
        //this.props.history.push("/plan");
        //if (this.props.auth.uid) return <Redirect to={from} />;
      })
      .catch((err) => console.log(err.message));
  };
  handleCode = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  requestTextCodeBox = () => {
    firebase
      .auth()
      .signInWithPhoneNumber(this.state.phone, this.state.appVerifier)
      .then((confirmationResult) => {
        //console.log(confirmationResult);
        window.confirmationResult = confirmationResult;
        console.log("yo");
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loading: false,
          noUserPleaseSignUp: null,
          showrecaptcha: false,
          recaptchaGood: false,
          authError: err.message
        });
      });
  };
  editProfileChange = async (e) => {
    var value = e.target.value;
    var id = e.target.id;

    if (id === "username") {
      value.toLowerCase();
      if (
        !value.includes(" ") &&
        !value.includes("_") &&
        value.match(/[a-z0-9]/g)
      ) {
        this.setState({
          [id]: value
            .toLowerCase()
            .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
            .join(" ")
        });
      }
    } else {
      this.setState({
        [id]: specialFormatting(value)
      });
    }
  };
  submitProfileChange = (e) => {
    e.preventDefault();
    var usernameAsArray = [];
    const c = this.state.username.toLowerCase();
    for (let i = 1; i < c.length + 1; i++) {
      usernameAsArray.push(c.substring(0, i));
    }
    var nameAsArray = [];
    const d = this.state.name.toLowerCase();
    for (let i = 1; i < d.length + 1; i++) {
      nameAsArray.push(d.substring(0, i));
    }
    firebase
      .firestore()
      .collection("users")
      .doc(this.props.auth.uid)
      .update({
        usernameAsArray,
        nameAsArray,
        username: this.state.username,
        name: this.state.name
      })
      .catch((err) => console.log(err.message));
  };
  usernameTaken(e) {
    e.preventDefault();
    this.setState({ notSameNumber: true });
    return false;
  }
  componentDidUpdate = (prevProps) => {
    if (
      this.props.user !== undefined &&
      this.props.user.profilergb &&
      prevProps.user !== this.props.user
    ) {
      this.setState({
        profilergb: this.props.user.profilergb,
        swatches: ["rgb(157, 41, 177)", this.props.user.profilergb],
        color: this.props.user.profilergb
      });
    }
    if (
      this.state.showrecaptcha &&
      this.state.showrecaptcha !== this.state.lastShowRecaptcha
    ) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        this.recaptcha.current,
        {
          size: "normal",
          callback: (response) => {
            this.setState({
              recaptchaGood: true,
              showrecaptcha: false
            });
            this.requestTextCodeBox();
            return response;
          },
          "expired-callback": (err) => {
            this.setState({ showrecaptcha: false, recaptchaGood: false });
            console.log(err);
            return err;
          }
        }
      );

      const appVerifier = window.recaptchaVerifier;
      appVerifier && appVerifier.render();
      if (this.state.appVerifier !== appVerifier) {
        this.setState({ appVerifier });
      }
    }
    if (this.state.username !== this.state.lastUserName) {
      setTimeout(async () => {
        var newIndTypes = individualTypes.map((x) => x.replace(/[ ,-]/g, ""));
        const pagesNamesTaken1 = [...newIndTypes, pagesNamesTaken];
        const curses = ["bitch", "cunt", "pussy", "pussies", "fuck", "shit"];
        const hasCurse = curses.find((x) =>
          this.state.username.toLowerCase().includes(x)
        );
        if (
          !hasCurse &&
          !reserveWords.includes(this.state.username.toLowerCase()) &&
          !pagesNamesTaken1.includes(this.state.username.toLowerCase())
        ) {
          var user = await this.props.hydrateUserFromUserName(
            this.state.username
          );
          if (user) {
            if (!this.state.usernameTaken) {
              return this.setState({ usernameTaken: true });
            }
          } else {
            firebase
              .firestore()
              .collection("communities")
              .where(
                "message",
                "==",
                this.state.username.charAt(0).toUpperCase() +
                  this.state.username.substring(1)
              )
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  this.setState({ newUserPlease: false });
                } else
                  querySnapshot.docs.forEach((doc) => {
                    if (doc.exists) {
                      this.setState({ newUserPlease: "community" });
                    } else {
                      fetch(
                        //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${b.toLowerCase()}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
                      )
                        .then(async (response) => await response.json())
                        .then((body) => {
                          var predictions = body.features;
                          var listPlaceNames = [];
                          predictions.map((x) =>
                            listPlaceNames.push(x.place_name.split(",")[0])
                          );
                          if (
                            listPlaceNames.includes(
                              this.state.username[0].toUpperCase() +
                                this.state.username.substring(1)
                            )
                          ) {
                            if (!this.state.usernameTaken) {
                              return this.setState({ usernameTaken: true });
                            }
                          } else if (this.state.usernameTaken) {
                            this.setState({ usernameTaken: false });
                          }
                        });
                    }
                  });
              });
          }
        } else
          window.alert(
            "reserve word '" + this.state.username + "', please choose another"
          );
      }, 1000);
      this.setState({ lastUserName: this.state.username });
    }
  };
  deleteEverything = async () => {
    if (this.state.chosenSetting === "delete") {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION);
      firebase
        .firestore()
        .collection("chats")
        .where("authorId", "==", this.props.auth.uid)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            doc.ref.delete();
          });
          console.log("User successfully deleted!");
        })
        .catch((e) => {
          console.log(e.message);
        });
      firebase
        .firestore()
        .collection("chats")
        .where("recipients", "in", this.props.auth.uid)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            doc.ref.update({
              recipients: firebase.firestore.FieldValue.arrayRemove(
                this.props.auth.uid
              )
            });
          });
          console.log("User successfully deleted!");
        })
        .catch((e) => {
          console.log(e.message);
        });
      firebase
        .firestore()
        .collection("messages")
        .where("authorId", "==", this.props.auth.uid)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            doc.ref.delete();
          });
          console.log("User successfully deleted!");
        })
        .catch((e) => {
          console.log(e.message);
        });
      firebase
        .firestore()
        .collection("planner")
        .where("authorId", "==", this.props.auth.uid)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            doc.ref.delete();
          });
          console.log("User successfully deleted!");
        })
        .catch((e) => {
          console.log(e.message);
        });
      firebase
        .firestore()
        .collection("jobs")
        .where("authorId", "==", this.props.auth.uid)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            doc.ref.delete();
          });
          console.log("User successfully deleted!");
        })
        .catch((e) => {
          console.log(e.message);
        });
      firebase
        .firestore()
        .collection("planner")
        .where("authorId", "==", this.props.auth.uid)
        .get()
        .then(function (docs) {
          docs.forEach((doc) => {
            doc.ref.delete();
          });
          console.log("User successfully deleted!");
        })
        .catch((e) => {
          console.log(e.message);
        });
      firebase
        .firestore()
        .collection("users")
        .doc(this.props.auth.uid)
        .delete()
        .then(() => {
          console.log("User successfully deleted!");
        })
        .catch((e) => {
          console.log(e.message);
        });

      firebase
        .firestore()
        .collection("numbers")
        .doc(this.props.auth.phoneNumber)
        .delete()
        .then(() => {
          console.log("User successfully deleted!");
        })
        .catch((e) => {
          console.log(e.message);
        });
      return this.props.auth
        .delete()
        .then(() => {
          window.location.reload();
        })
        .catch((e) => {
          console.log(e.message);
        });
    } else if (this.state.chosenSetting === "edit") {
      firebase
        .firestore()
        .collection("numbers")
        .doc(this.state.newPhone)
        .get()
        .then((doc) => {
          if (doc.exists) {
            window.alert(
              "We have a user with that number already, but we're not going to tell you who..." +
                " if you can figure it out, email nick@thumbprint.us, please. " +
                "Until then, if you want to change your number from " +
                `(((${this.props.auth.phoneNumber})))` +
                " to " +
                this.state.newPhone +
                "_they_ will have to choose another unused number to keep " +
                "'keys' to their account. Please tell your ISP to adopt government ID " +
                "for Sim Switching instead of your mother's maiden name"
            );
          } else {
            this.props.auth
              .updatePhoneNumber(this.state.newPhone, this.state.appVerifier)
              .then(() => {
                firebase
                  .firestore()
                  .collection("numbers")
                  .doc(this.state.newPhone)
                  .set({ uid: this.props.auth.uid })
                  .then(() => {
                    console.log("Phone successfully updated!");
                  })
                  .catch((e) => {
                    console.log(e.message);
                  });
              })
              .catch((e) => {
                console.log(e.message);
              });
          }
        })
        .catch((e) => console.log(e.message));
    }
  };
  render() {
    var loop = this.state.showNewPInput ? "New Phone" : "Enter phone number";
    this.picker2 = window.picker2 && window.picker2;
    return (
      <div
        style={
          this.props.settingsOpen
            ? {
                marginTop: "20px",
                color: "black",
                display: "flex",
                position: "relative",
                flexDirection: "column",
                maxHeight: "min-content",
                transition: "maxHeight .3s ease-in .3s"
              }
            : {
                color: "black",
                display: "flex",
                position: "relative",
                flexDirection: "column",
                maxHeight: "0px",
                transition: "maxHeight .3s ease-out"
              }
        }
      >
        <div
          style={
            this.props.settingsOpen
              ? {
                  display: "flex",
                  position: "relative",
                  opacity: "1",
                  flexDirection: "column",
                  transition: "opacity .3s ease-in"
                }
              : {
                  display: "flex",
                  opacity: "0",
                  position: "relative",
                  flexDirection: "column",
                  transition: "opacity .3s ease-out"
                }
          }
        >
          {/**<ColorPicker/> */}
          <br />
          <form
            style={{ height: "min-content" }}
            onSubmit={
              this.state.usernameTaken ||
              (this.state.username === "" && this.state.username.length < 3) ||
              (this.state.name === "" && this.state.name.length < 3)
                ? (e) => {
                    e.preventDefault();
                  }
                : this.submitProfileChange
            }
          >
            <div>
              {this.state.savingPrompt &&
                "Try re-entering your desired name & username"}
            </div>
            {this.props.user !== undefined &&
            this.props.user.username === this.state.username
              ? "this username is yours already"
              : this.state.usernameTaken
              ? "this username is taken"
              : this.state.username !== "" && this.state.username.length > 2
              ? "this username is available!"
              : this.state.username !== "" && this.state.username.length < 3
              ? "too short"
              : null}
            <br />
            <label>
              username{" "}
              <input
                className="inputforname"
                minLength="3"
                maxLength="30"
                id="username"
                onChange={this.editProfileChange}
                value={this.state.username}
                placeholder={this.props.user && this.props.user.username}
              />
            </label>
            <br />
            <label>
              name
              <input
                className="inputforname"
                minLength="3"
                maxLength="30"
                id="name"
                onChange={this.editProfileChange}
                value={this.state.name}
                placeholder={this.props.user && this.props.user.name}
              />
            </label>
            <button>save</button>
          </form>
          <br />
          <br />
          {/*<VideoRecorder
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
            />*/}
          <div
            onClick={() => {
              this.state.openPicSettings &&
                this.setState({ openPicSettings: false });
              this.state.openBlockSettings &&
                this.setState({ openBlockSettings: false });
              this.state.openNameSettings
                ? this.setState({ openNameSettings: false })
                : this.setState({ openNameSettings: true });
            }}
            style={{
              display: "flex",
              borderTop: "2px solid black",
              width: "100%",
              padding: "20px 0px",
              zIndex: "8888"
            }}
          >
            <h1>Delete or Change Number</h1>
            <div
              style={
                this.state.openNameSettings
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
              this.state.openNameSettings
                ? {
                    display: "flex",
                    transition: "height .1s ease-in",
                    zIndex: "8888",
                    height: "min-content",
                    marginBottom: "20px"
                  }
                : {
                    display: "flex",
                    height: "0px",
                    transition: "height .1s ease-out",
                    zIndex: "8888"
                  }
            }
          >
            <div
              style={
                this.state.openNameSettings
                  ? {
                      display: "flex",
                      opacity: "1",
                      transition: "opacity .1s ease-in",
                      height: "min-content"
                    }
                  : {
                      display: "flex",
                      opacity: "0",
                      transition: "opacity .1s ease-out",
                      height: "min-content"
                    }
              }
            >
              {this.state.notSameNumber ? (
                <div onClick={() => this.setState({ phone: undefined })}>
                  &#8634;
                </div>
              ) : null}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "min-content"
                }}
              >
                {this.state.authError !== undefined ? (
                  this.state.authError
                ) : (
                  <form
                    onSubmit={
                      //this.this.props.user.phoneNumber === this.state.phone
                      //? () => this.requestTextCodeBox()
                      !this.state.textgood || !this.state.showNewPInput
                        ? () => this.usernameTaken()
                        : () => this.deleteEverything()
                    }
                  >
                    <label>
                      {this.state.showNewPInput
                        ? "enter your new phone number"
                        : "enter your phone number to delete account (or change phone number)"}
                    </label>
                    <PhoneInput
                      country="US"
                      required
                      placeholder={loop}
                      value={
                        !this.state.showNewPInput
                          ? this.state.phone
                          : this.state.newPhone
                      }
                      onChange={
                        !this.state.showNewPInput
                          ? (e) => this.setState({ phone: e })
                          : (value) => this.setState({ newPhone: value })
                      }
                      onSubmit={(e) => e.preventDefault()}
                      type="tel"
                      //countrySelectComponent={CustomCountrySelect}
                    />
                  </form>
                )}
                {!this.state.recaptchaGood &&
                !this.state.showrecaptcha &&
                !this.state.authError &&
                this.props.auth &&
                this.props.auth.phoneNumber === this.state.phone ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <button
                      type="submit"
                      className="loginbtn1"
                      style={
                        !this.state.showNewPInput ? null : { display: "none" }
                      }
                      onClick={() => this.setState({ showrecaptcha: true })}
                    >
                      Authenticate
                    </button>
                  </div>
                ) : null}
                <button
                  type="submit"
                  className="loginbtn1"
                  style={!this.state.textgood ? { display: "none" } : null}
                  onClick={
                    !this.state.showNewPInput
                      ? () =>
                          this.setState({
                            showNewPInput: true,
                            chosenSetting: "edit"
                          })
                      : () =>
                          this.setState({
                            showNewPInput: false,
                            chosenSetting: "delete"
                          })
                  }
                >
                  {!this.state.showNewPInput ? "Delete" : "Edit"}
                  <div style={{ fontSize: "15px" }}>
                    {!this.state.showNewPInput ? "Edit" : "Delete"}
                  </div>
                </button>
                <div
                  ref={this.recaptcha}
                  className={
                    this.state.showrecaptcha ? "showrecaptcha" : "hiderecaptcha"
                  }
                />
                {this.state.recaptchaGood &&
                this.state.authError === undefined ? (
                  <form
                    className="showphonecodeform"
                    onSubmit={(e) => {
                      this.confirmCode(e);
                    }}
                  >
                    <input
                      className="phonecodeinput"
                      placeholder="Verification Code"
                      id="textedCode"
                      onChange={this.handleCode}
                    />
                    <button className="showphonecodeformbtn" type="submit">
                      Confirm
                    </button>
                  </form>
                ) : null}
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              this.state.openNameSettings &&
                this.setState({ openNameSettings: false });
              this.state.openPicSettings &&
                this.setState({ openPicSettings: false });
              this.state.openBlockSettings
                ? this.setState({ openBlockSettings: false })
                : this.setState({ openBlockSettings: true });
            }}
            style={{
              display: "flex",
              borderTop: "2px solid black",
              width: "100%",
              padding: "20px 0px",
              zIndex: "9999"
            }}
          >
            <h1>Blocks & Mutes</h1>
            <div
              style={
                this.state.openBlockSettings
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
              this.state.openBlockSettings
                ? {
                    display: "flex",
                    height: "200px",
                    transition: "height .1s ease-in",
                    zIndex: "9999"
                  }
                : {
                    display: "flex",
                    height: "0px",
                    transition: "height .1s ease-out",
                    zIndex: "9999"
                  }
            }
          >
            <div
              style={
                this.state.openBlockSettings
                  ? {
                      display: "flex",
                      opacity: "1",
                      transition: "opacity .1s ease-in",
                      flexDirection: "column"
                    }
                  : {
                      display: "flex",
                      opacity: "0",
                      transition: "opacity .1s ease-out",
                      flexDirection: "column"
                    }
              }
            >
              {this.props.user && this.props.user.vendorId ? (
                <div>{this.props.user.vendorId}</div>
              ) : null}
              {this.props.user !== undefined &&
                this.props.user.blockedUsersAdmined && (
                  <div>
                    Blocked Users: what I admin
                    {this.props.user.blockedUsersAdmined.map((x) => {
                      var user = this.props.users.find((y) => y.id === x);
                      return <Link to={"/at/" + user.id}>{user.username}</Link>;
                    })}
                  </div>
                )}
              <br />
              {this.props.user !== undefined &&
                this.props.user.blockedUsersAuthored && (
                  <div>
                    Blocked Users: what I post
                    {this.props.user.blockedUsersAuthored.map((x) => {
                      var user = this.props.users.find((y) => y.id === x);
                      return <Link to={"/at/" + user.id}>{user.username}</Link>;
                    })}
                  </div>
                )}
              <br />
              {this.props.user !== undefined && this.props.user.mutedUsers && (
                <div>
                  Muted Users
                  {this.props.user.mutedUsers.map((x) => {
                    var user = this.props.users.find((y) => y.id === x);
                    return <Link to={"/at/" + user.id}>{user.username}</Link>;
                  })}
                </div>
              )}
            </div>
          </div>
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}
export default Settings;
/*
if (
  this.props.filePreparedToSend[0] &&
  this.props.filePreparedToSend[0] !== this.state.lastFiletosend
) {
  console.log("whatttt");
  var file = this.props.filePreparedToSend[0].embedUrl;

  if (file) {
    var fileid = file.substring(
      file.lastIndexOf("/d/") + 3,
      file.lastIndexOf("/") // /edit or /preview
    );
    var thumbnail = `https://drive.google.com/thumbnail?id=${fileid}`;
    var couple = {};
    couple.content = this.props.filePreparedToSend[0];
    couple.thumbnail = thumbnail;
    couple.id = fileid;
    //console.log(couple);
    this.setState({
      lastFiletosend: this.props.filePreparedToSend[0],
      stop: true,
      contents: couple,
      photoSrc: file,
      photoThumbnail: thumbnail
    });
  } else {
    this.setState({
      lastFiletosend: this.props.filePreparedToSend[0],
      stop: true,
      contents: {},
      photoSrc: null,
      photoThumbnail: null
    });
  }
}*/
