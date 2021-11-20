import React from "react";
import firebase from "../../.././init-firebase";
//import GooglePickerAuth from "../../../.././widgets/GooglePickerAuth";
import LocOpen from "../.././Forum/Tools/LocOpen";
import ".././CitiesMap.css";
import { specialFormatting, arrayMessage } from "../../../widgets/authdb";
import {
  reserveWords,
  pagesNamesTaken,
  individualTypes
} from "../../../widgets/arraystrings";

class BuyCommunity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      justForum: true,
      extraFeatures: [],
      openDescript: true,
      filePreparedToSend: [],
      openDrivePicker: false,
      gapiReady: false,
      signedIn: false,
      tract: "school"
    };
  }
  render() {
    return (
      <div
        style={{
          userSelect: "none",
          height: "100%",
          display: this.props.openBuyer ? "flex" : "none",
          position: "relative",
          width: "100%",
          overflow: "auto"
        }}
      >
        <form
          className="buyerthestuff"
          style={{
            left: "10px",
            bottom: "10px",
            maxWidth: "600px",
            maxHeight: "900px",
            width: "calc(100% - 20px)",
            height: "calc(100% - 20px)",
            display: "flex",
            position: "absolute",
            flexDirection: "column",
            backgroundColor: "white",
            borderRadius: "30px",
            overflow: "auto"
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            var b = this.state.message;
            if (
              (!this.state.center || !this.state.place_name) &&
              !this.state.noLocation
            ) {
              alert("please choose a location");
            } else if (this.props.auth !== undefined) {
              var newIndTypes = individualTypes.map((x) =>
                x.replace(/[ ,-]/g, "")
              );
              const pagesNamesTaken1 = [...newIndTypes, pagesNamesTaken];
              const curses = [
                "bitch",
                "cunt",
                "pussy",
                "pussies",
                "fuck",
                "shit"
              ];
              const hasCurse = curses.find((x) => b.toLowerCase().includes(x));
              if (
                !hasCurse &&
                !reserveWords.includes(b.toLowerCase()) &&
                !pagesNamesTaken1.includes(b.toLowerCase())
              ) {
                firebase
                  .firestore()
                  .collection("communities")
                  .where("message", "==", this.state.message) //is already formatted/cased
                  .get()
                  .then(async (querySnapshot) => {
                    if (querySnapshot.empty) {
                      await fetch(
                        //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${b.toLowerCase()}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
                      )
                        .then(async (response) => await response.json())
                        .then((body) => {
                          var predictions = body.features;
                          var listPlaceNames = [];
                          predictions.map((x) =>
                            listPlaceNames.push(x.place_name)
                          );
                          if (listPlaceNames.includes(b)) {
                            console.log(b + " already there, as a mapbox city");

                            var answer = window.confirm("Are you town clerk?");
                            if (answer)
                              this.setState({ showReqMayorForm: true });
                            this.setState({ useOtherName: "place_name" });
                          } else {
                            this.setState(
                              {
                                contents: {},
                                photoSrc: null,
                                continueNewComm: false,
                                openDescript: true
                              },
                              () => {
                                console.log(b + " is being made");

                                firebase
                                  .firestore()
                                  .collection("communities")
                                  .add({
                                    isCommunity: true,
                                    tract: this.state.tract,
                                    createdAt: new Date(),
                                    place_name: !this.state.noLocation
                                      ? this.state.place_name
                                      : false,
                                    center: !this.state.noLocation
                                      ? this.state.center
                                      : false,
                                    authorId: this.props.auth.uid,
                                    blockedForum: [],
                                    blockedTiles: [],
                                    issues: [],
                                    admin: [],
                                    faculty: [],
                                    members: [],
                                    message: b,
                                    messageLower: b.toLowerCase(),
                                    messageAsArray: arrayMessage(b),
                                    body: this.state.body
                                  })
                                  .then(() => {
                                    this.props.closeBuyer();
                                  });
                              }
                            );
                          }
                        })
                        .catch((err) => console.log(err.message));
                    } else this.setState({ useOtherName: true });
                  });
              } else {
                window.alert("that's a good one.  we're gonna hold onto it");
              }
            }
          }}
        >
          <div
            onClick={
              this.state.continueNewComm && !this.state.justForum
                ? () => this.setState({ continueNewComm: false })
                : this.state.justForum && !this.state.openDescript
                ? () => {
                    this.setState({
                      openDescript: true,
                      continueNewComm: false
                    });
                  }
                : this.state.justForum && this.state.openDescript
                ? this.props.closeBuyer
                : !this.state.openDescript
                ? () =>
                    this.setState({
                      openDescript: true,
                      continueNewComm: false
                    })
                : this.props.closeBuyer
            }
            style={{
              zIndex: "1",
              display: "flex",
              position: "absolute",
              top: "10px",
              right: "20px",
              justifyContent: "center",
              alignItems: "center",
              color: "black"
            }}
          >
            <div
              style={{
                fontSize: "30px",
                padding: "8px",
                backgroundColor: "white",
                position: "absolute",
                borderRadius: "20px"
              }}
            >
              &times;
            </div>
          </div>

          {!this.state.openDescript && false && (
            <div
              style={{
                flexDirection: "column",
                position: "relative",
                width: "100%",
                display: "flex",
                wordBreak: "break-word"
              }}
            >
              descript
            </div>
          )}
          {!this.state.continueNewComm && (
            <div>
              <div
                onClick={
                  this.state.openDescript
                    ? () =>
                        this.setState({
                          openDescript: false,
                          continueNewComm: false
                        })
                    : () => this.setState({ openDescript: true })
                }
                style={
                  this.state.hoverthis
                    ? { color: "grey" }
                    : { color: "black", width: "max-content" }
                }
                onMouseOver={() =>
                  !this.state.hoverthis && this.setState({ hoverthis: true })
                }
                onMouseLeave={() =>
                  this.state.hoverthis && this.setState({ hoverthis: false })
                }
              >
                <br />
                {this.state.openDescript ? null : "Become a Host"}
              </div>
              {!this.state.openDescript && (
                <p
                  style={{
                    color: "black",
                    fontSize: "17px",
                    marginTop: "10px",
                    wordBreak: "break-word"
                  }}
                >
                  Assign admin roles to institutional heads you trust to
                  delegate faculty keys. Assign other executives to edit,
                  delete, or manage payments for your community
                </p>
              )}
            </div>
          )}
          <div
            style={{
              display: "flex",
              width: "100%",
              backgroundColor: "rgb(230,30,250)"
            }}
          >
            <img
              style={{ width: "20px" }}
              src="https://www.dl.dropboxusercontent.com/s/m2w91txozlavw5i/ezgif.com-gif-maker%20%2812%29%20%281%29.gif?dl=0"
              alt="https://www.dl.dropboxusercontent.com/s/m2w91txozlavw5i/ezgif.com-gif-maker%20%2812%29%20%281%29.gif?dl=0"
            />
            <img
              style={{ width: "20px" }}
              src="https://www.dl.dropboxusercontent.com/s/8audv00r8d99g0g/02-final.gif?dl=0"
              alt="https://www.dl.dropboxusercontent.com/s/8audv00r8d99g0g/02-final.gif?dl=0"
            />
            <img
              style={{ width: "20px" }}
              src="https://www.dl.dropboxusercontent.com/s/85bk28byg93cvf6/01-final.gif?dl=0"
              alt="https://www.dl.dropboxusercontent.com/s/85bk28byg93cvf6/01-final.gif?dl=0"
            />
          </div>
          {this.state.openDescript ? (
            <div style={{ marginLeft: "10px" }}>
              <p
                style={{
                  color: "black",
                  fontSize: "17px",
                  marginTop: "10px"
                }}
                onClick={
                  this.state.justForum
                    ? () =>
                        this.setState({
                          openDescript: false,
                          continueNewComm: true
                        })
                    : this.state.openDescript
                    ? () =>
                        this.setState({
                          openDescript: false,
                          continueNewComm: false
                        })
                    : () => this.setState({ openDescript: true })
                }
              >
                {/*create a community this.state.openDescript ? null : "HOST YOUR OWN MAP"*/}
                Continue
              </p>
              <p>
                {this.state.justForum ? (
                  <span
                    style={{
                      color: "black",
                      fontSize: "17px",
                      marginTop: "10px"
                    }}
                  >
                    "Your own virtual sanctuary"
                    <span>
                      Members-only. No frills, just
                      <br />
                      • file-upload
                      <br />
                      • forum
                      <br />
                      • voting
                      <br />
                    </span>
                  </span>
                ) : (
                  <span
                    style={{
                      color: "black",
                      fontSize: "17px",
                      marginTop: "10px",
                      wordBreak: "break-word"
                    }}
                  >
                    "Same world, clean slate"
                    <br />
                    <span
                      style={{
                        wordBreak: "break-word"
                      }}
                    >
                      Accept or reject clubs, shops, services,
                      <br />
                      restaurants into your community
                    </span>{" "}
                    Standard rates apply
                    <span
                      style={{
                        wordBreak: "break-word"
                      }}
                    >
                      <br />
                      • Storage limitations will apply, price TBD
                      <br />
                      • Event ticket fee 3% + credit card / stripe fee
                      <br />
                      • Job $4.99/post
                      <br />
                      • Auto fee $9.99/post
                      <br />
                      • Housing fee $19.99/post
                      <br />
                      • Subscribe classes & departments to allow
                      <br />
                      certain members create them
                    </span>
                  </span>
                )}
              </p>
            </div>
          ) : this.state.continueNewComm ? null : (
            <span>
              <span>
                <input
                  onChange={(s) => {
                    var g = s.target.id;
                    if (!this.state.extraFeatures.includes(g)) {
                      this.setState({
                        extraFeatures: [...this.state.extraFeatures, g]
                      });
                    } else {
                      var h = this.state.extraFeatures.filter((x) => x !== g);
                      this.setState({ extraFeatures: h });
                    }
                  }}
                  type="checkbox"
                  id="classes"
                  name="classes"
                  value="classes"
                />
                <div
                  className="optionbuy2"
                  style={{
                    wordBreak: "break-word"
                  }}
                >
                  Subscribe classes
                  <p>
                    Faculty & staff can create, edit or delete groups on your
                    classes' directory
                  </p>
                  <div className="pricetag" />
                  {/*<p>x = when a member joins at least one class</p>
                    <p>{this.state.infoMethis ? "Examples" : "Rates"}</p>
                    {this.state.infoMethis ? (
                      <div
                        onClick={() => this.setState({ infoMethis: false })}
                        className="pricetag"
                      >
                        <div>500x</div>
                        <div>10,000x</div>
                        <div>40,000x</div>
                        <div>0¢/MONTH</div>
                        <div>$5,000/MONTH</div>
                        <div>$12,500/MONTH</div>
                      </div>
                    ) : (
                      <div
                        onClick={() => this.setState({ infoMethis: true })}
                        className="pricetag"
                      >
                        <div>0¢/x/MONTH</div>
                        <div>50¢/x/MONTH</div>
                        <div>25¢/x/MONTH</div>
                        <div>first 500x</div>
                        <div>next 10,000x</div>
                        <div>after 10,500x</div>
                      </div>
                    )}*/}
                </div>
              </span>
              <span>
                <input
                  onChange={(s) => {
                    var g = s.target.id;
                    if (!this.state.extraFeatures.includes(g)) {
                      this.setState({
                        extraFeatures: [...this.state.extraFeatures, g]
                      });
                    } else {
                      var h = this.state.extraFeatures.filter((x) => x !== g);
                      this.setState({ extraFeatures: h });
                    }
                  }}
                  type="checkbox"
                  id="departments"
                  name="departments"
                  value="departments"
                />
                <div
                  className="optionbuy2"
                  style={{
                    wordBreak: "break-word"
                  }}
                >
                  Subscribe departments
                  <p>
                    Faculty & staff can create, edit or delete groups on your
                    departments' directory
                  </p>
                  {/*<p>x = when a member follows your departments</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;same as above</p>*/}
                </div>
              </span>
              <span />
              <div
                onClick={() =>
                  this.props.auth.uid &&
                  this.setState({ continueNewComm: true })
                }
                style={{
                  display: "flex",
                  position: "relative",
                  color: "blue",
                  justifyContent: "center",
                  margin: "20px 30px",
                  marginBottom: "0px"
                }}
              >
                Next
              </div>
            </span>
          )}
          {this.state.continueNewComm && (
            <span style={{ marginLeft: "10px" }}>
              <div
                onClick={
                  this.state.continueNewComm && !this.state.justForum
                    ? () => this.setState({ continueNewComm: false })
                    : this.state.justForum
                    ? () =>
                        this.setState({
                          openDescript: true,
                          continueNewComm: false
                        })
                    : null
                }
              >
                <br />
                <div
                  style={{
                    color: "blue"
                  }}
                >
                  {!this.state.justForum ? (
                    <div>Fully-featured</div>
                  ) : (
                    <div>Just the forum</div>
                  )}
                  <div style={{ color: "grey" }}>Free</div>
                </div>
                <div
                  style={{
                    marginTop: "10px"
                  }}
                >
                  {" "}
                  back{" "}
                </div>
              </div>
              {this.state.useOtherName && (
                <div>
                  Name taken&nbsp;
                  {this.state.useOtherName !== true &&
                    "by mapbox place, press launch to claim"}
                  <div
                    onClick={() => this.setState({ popupcontact: true })}
                    style={{
                      display: "flex",
                      border: "1px solid black",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    ?
                  </div>
                </div>
              )}
              <br />
              <select
                onChange={(e) => {
                  if (e.target.value === "location-based") {
                    this.setState({ noLocation: false });
                  } else {
                    this.setState({ noLocation: true });
                  }
                }}
              >
                {["location-based", "virtual"].map((x) => (
                  <option key={x}>{x}</option>
                ))}{" "}
              </select>
              <br />
              {!this.state.noLocation && (
                <select
                  value={this.state.tract}
                  onChange={(e) => {
                    this.setState({ tract: e.target.value });
                  }}
                >
                  {["school", "town/county", "country/providence/state"].map(
                    (x) => (
                      <option key={x}>{x}</option>
                    )
                  )}{" "}
                </select>
              )}
              <span
                style={{
                  color: "grey",
                  fontSize: "10px",
                  width: "min-content"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    color: "grey",
                    fontSize: "10px",
                    width: "max-content"
                  }}
                >
                  subject to copyright, auto-formatting & caps
                  {/*<span
                    style={{
                      display: "inline-block",
                      color: "grey",
                      fontSize: "10px",
                      width: "max-content"
                    }}
                  >
                    <span
                      style={{
                        color: "grey",
                        fontSize: "10px",
                        width: "max-content"
                      }}
                    >
                      subject to copyright, auto-formatting & caps,{" "}
                    </span>
                    <span
                      style={{
                        fontWeight: "bolder",
                        color: "grey",
                        fontSize: "10px",
                        width: "max-content"
                      }}
                    >
                      {" "}
                      choose once
                    </span>
                  </span>
                  <br />
                  <span style={{ color: "grey", fontSize: "10px" }}>
                    a future update may allow alias for links and profiles, but
                    don't tell anyone
                  </span>
                  <span style={{ color: "grey", fontSize: "10px" }}>
                    otherwise, we will be charging-slosh like ICANN
                  </span>*/}
                </span>
              </span>
              <input
                onChange={(e) => {
                  e.preventDefault();
                  (this.state.useOtherName || this.state.popupcontact) &&
                    this.setState({
                      useOtherName: false,
                      popupcontact: false
                    });
                  var message = specialFormatting(e.target.value);
                  if (!message.startsWith(" ")) this.setState({ message });
                }}
                value={this.state.message}
                placeholder="Title"
                className="input"
                style={{
                  fontSize: "18px",
                  padding: "5px",
                  margin: "5px",
                  border: "0.3px solid #333",
                  position: "relative"
                }}
                required
                minLength="3"
              />
              {!this.state.noLocation && (
                <div
                  onClick={() => this.setState({ locOpen: true })}
                  style={{
                    width: "100px",
                    overflowWrap: "break-word",
                    position: "relative"
                  }}
                >
                  {this.state.place_name ? this.state.place_name : "location"}
                </div>
              )}
              <textarea
                onChange={(e) => {
                  e.preventDefault();
                  this.setState({ body: e.target.value });
                }}
                value={this.state.body}
                placeholder="Description"
                className="inputbuyertitle"
                required
              />
              {this.props.auth !== undefined && this.props.auth.uid ? (
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    position: "relative",
                    color: "blue",
                    justifyContent: "center",
                    margin: "20px 30px",
                    marginBottom: "0px"
                  }}
                >
                  Launch
                </button>
              ) : (
                <div
                  onClick={this.props.getUserInfo} //to="/login"
                >
                  Login
                </div>
              )}
            </span>
          )}
          {/*this.state.openDescript && (
            <div
              style={{
                height: "56px",
                display: "flex",
                position: "absolute",
                bottom: "0px",
                width: "100%",
                textIndent: "36px"
              }}
              onClick={
                this.state.justForum
                  ? () => this.setState({ justForum: false })
                  : () => this.setState({ justForum: true })
              }
            >
              {this.state.justForum
                ? "All features please"
                : "Just the forum, voting items"}
            </div>
          )*/}
        </form>
        <LocOpen
          inBuy={true}
          choosePrediction={(prediction) =>
            this.setState({
              place_name: prediction.place_name,
              center: [prediction.center[1], prediction.center[0]],
              locOpen: false
            })
          }
          locOpen={this.state.locOpen}
          closeLoc={() => this.setState({ locOpen: false })}
          openLoc={() => this.setState({ locOpen: true })}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            transform: this.state.popupcontact
              ? "translateY(0%)"
              : "translateY(100%)",
            transition: ".3s ease-in",
            left: "0",
            top: "0",
            bottom: "0px",
            height: "100%",
            backgroundColor: "rgba(0,0,0,.8)",
            wordWrap: "break-word",
            flexDirection: "column"
          }}
        >
          <div
            onClick={() => this.setState({ popupcontact: false })}
            style={{
              color: "white",
              position: "absolute",
              right: "10px",
              top: "10px"
            }}
          >
            &times;
          </div>
          <div style={{ color: "rgb(220,220,250)", wordBreak: "break-word" }}>
            Is this your institution's legitimate name? Contact me here so we
            can look into it...
            <br />
            Or, add this{" "}
            {`<meta name="webmaster" content="${
              this.props.user !== undefined && this.props.user.username
            }">`}{" "}
            to your html header
          </div>
          <div
            className="formbkgd"
            style={{ overflowY: "auto", overflowX: "hidden" }}
          >
            <form
              className="emailform"
              style={{ position: "absolute", width: "100%" }}
              onSubmit={(e) => {
                e.preventDefault();
                window.open(
                  `mailto:nick@thumbprint.us?subject=${this.state.subject}&body=${this.state.body}`
                );
              }}
            >
              <input
                onChange={(e) => this.setState({ subject: e.target.value })}
                placeholder={`topic`}
              />
              <textarea
                placeholder={`body`}
                onChange={(e) => this.setState({ body: e.target.value })}
              />
            </form>
            <div
              style={{
                position: "relative",
                color: "rgb(200,200,250)"
              }}
            >
              nick@thumbprint.us
            </div>
          </div>
        </div>
        <div
          style={{
            overflow: "hidden",
            display: "flex",
            position: "absolute",
            transition: ".3s ease-in",
            height: this.state.showReqMayorForm ? "min-content" : "0px",
            maxHeight: "calc(100% - 86px)",
            backgroundColor: "rgba(0,0,0,.8)",
            wordWrap: "break-word",
            flexDirection: "column"
          }}
        >
          <div
            onClick={() => this.setState({ showReqMayorForm: false })}
            style={{
              color: "white",
              position: "absolute",
              right: "10px",
              top: "10px"
            }}
          >
            &times;
          </div>
          <div style={{ color: "rgb(220,220,250)", wordBreak: "break-word" }}>
            enter your town email, I will ask for your reply from that email to
            give your user admin role
            <br />
            Or, add this{" "}
            {`<meta name="clerk" content="${
              this.props.user !== undefined && this.props.user.username
            }">`}{" "}
            to your html header
          </div>
          <div className="formbkgd">
            <form
              className="emailform"
              style={{ position: "absolute", width: "100%" }}
              onSubmit={(e) => {
                e.preventDefault();
                window.open(
                  `mailto:nick@thumbprint.us?subject=${this.state.subject}&body=${this.state.body}`
                );
              }}
            >
              <input
                onChange={(e) => this.setState({ subject: e.target.value })}
                placeholder={`${
                  this.props.user !== undefined && this.props.user.username
                } is ${this.props.showReqMayorForm} clerk`}
              />
              <textarea
                placeholder={`I will confirm using my town-email, or add the meta tag to my town website`}
                onChange={(e) => this.setState({ body: e.target.value })}
              />
            </form>
            <div
              style={{
                position: "relative",
                color: "rgb(200,200,250)"
              }}
            >
              nick@thumbprint.us
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default BuyCommunity;

/*componentDidUpdate = () => {
    if (
      this.props.filePreparedToSend[0] &&
      this.props.filePreparedToSend[0] !== this.state.lastFiletosend
    ) {
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
      //this.props.contentLinker(couple);
    }
  };
  

<div
  style={
    !this.state.openDescript && false
      ? {
          flexDirection: "column",
          position: "relative",
          width: "100%",
          display: "flex",
          wordBreak: "break-word"
        }
      : { display: "none" }
  }
>
  {this.props.filePreparedToSend.length > 0 ? (
    <div
      onClick={() => {
        this.props.clearFilePreparedToSend();
        this.setState({ contents: {} });
      }}
    >
      &times;Clear selection
    </div>
  ) : (
    <div
      onClick={() =>
        window.picker1
          ?()=> window.picker1.setVisible(true)
          : window.alert("one more moment please")
      }
    >
      Open/upload file for drive
    </div>
  )}
  {this.state.contents && this.state.contents.thumbnail && (
    <div
      onClick={() => this.props.s.showSettingsDialog()}
      style={{
        wordBreak: "break-word"
      }}
    >
      Change sharing preference (must be set to public!)
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
        src={this.state.contents.thumbnail}
        alt="error"
      />
    </div>
  )}
  <br />
  {/*<GooglePickerAuth
    setGoogleLoginRef={this.props.setGoogleLoginRef}
    switchAccount={this.props.switchAccount}
    signOut={this.props.signOut}
    signedIn={this.props.signedIn}
    //s={this.props.s}
    loadGapiApi={this.props.loadGapiApi}
    //authResult={this.props.authResult}
    //googlepicker={this.props.googlepicker}
  />*
  </div>
  */
