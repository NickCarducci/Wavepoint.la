import React from "react";
import firebase from ".././init-firebase";
import { specialFormatting, standardCatch } from "./authdb";
import { reserveWords, pagesNamesTaken, individualTypes } from "./arraystrings";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import { CDB } from "./authdb";
import { Link } from "react-router-dom";
import "./login.css";

const initialState = {
  uid: "",
  phone: "",
  lastAttemptedPhone: "",
  password: "",
  username: "",
  name: "",
  id: "",
  tickets: [],
  events: [],
  clubs: [],
  jobs: [],
  housing: [],
  shops: [],
  restaurants: [],
  bars: [],
  services: [],
  proposals: [],
  authError: "",
  textedCode: "",
  alertExistingUser: false,
  noUserPleaseSignUp: null,
  recaptchaGood: false,
  showrecaptcha: false,
  recaptchaResponse: "",
  normalFinish: false,
  loading: false,
  working: true,
  under13: true,
  volume: 0,
  time: 0,
  playing: false,
  closeContinue: false,
  goSignupConfirm: false,
  watchingSignupVideo: false,
  warnCaptcha: null
};
class Login extends React.Component {
  constructor(props) {
    super(props);
    let cdb = new CDB();
    this.state = {
      country: "US",
      bumpedFrom: "this page",
      cdb,
      uid: "",
      phone: "",
      lastAttemptedPhone: "",
      username: "",
      name: "",
      id: "",
      tickets: [],
      events: [],
      clubs: [],
      jobs: [],
      housing: [],
      shops: [],
      restaurants: [],
      bars: [],
      services: [],
      proposals: [],
      authError: "",
      textedCode: "",
      alertExistingUser: false,
      noUserPleaseSignUp: null,
      recaptchaGood: false,
      showrecaptcha: false,
      recaptchaResponse: "",
      normalFinish: false,
      loading: false,
      working: true,
      under13: true,
      volume: 0,
      time: 0,
      playing: false,
      closeContinue: false,
      goSignupConfirm: false,
      watchingSignupVideo: false,
      user: props.user,
      warnCaptcha: null
    };
    this.recaptcha = React.createRef();
    this.video = React.createRef();
  }

  changeTime = (y) => {
    this.video.currentTime = y;
    this.setState({ time: y });
  };
  playContinue = () => {
    this.setState({ closeContinue: true });
    this.playVideo();
  };
  playVideo() {
    this.video.play();
    this.setState({ playing: true });
  }
  pauseVideo = () => {
    // Pause as well
    this.video.pause();
    this.setState({ playing: false });
  };
  handleChange = (e) => {
    var type = e.target.id;
    var value = e.target.value.toLowerCase();
    if (type === "phone") {
      this.setState({
        [type]: "+1" + value
      });
    } else if (type === "username") {
      if (
        !value.includes(" ") &&
        !value.includes("_") &&
        value.match(/[a-z0-9]/g)
      ) {
        this.setState({
          [type]: value
        });
        if (e.which !== 32) {
          this.setState({ findingSimilarNames: true });
          clearTimeout(this.typingUsername);
          this.typingUsername = setTimeout(() => {
            this.setState({ findingSimilarNames: true });
            var newIndTypes = individualTypes.map((x) =>
              x.replace(/[ ,-]/g, "")
            );
            const pagesNamesTaken1 = [...newIndTypes, ...pagesNamesTaken];
            const curses = [
              "bitch",
              "cunt",
              "pussy",
              "pussies",
              "fuck",
              "shit"
            ];
            const hasCurse = curses.find((x) =>
              value.toLowerCase().includes(x)
            );
            if (
              !hasCurse &&
              !reserveWords.includes(value.toLowerCase()) &&
              !pagesNamesTaken1.includes(value.toLowerCase())
            ) {
              const { username } = this.state;
              firebase
                .firestore()
                .collection("users")
                .where("username", "==", username)
                .get()
                .then((querySnapshot) => {
                  if (querySnapshot.empty) {
                    firebase
                      .firestore()
                      .collection("communities")
                      .where(
                        "message",
                        "==",
                        username.charAt(0).toUpperCase() + username.substring(1)
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
                                `https://api.mapbox.com/geocoding/v5/mapbox.places/${username.toLowerCase()}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
                              )
                                .then(async (response) => await response.json())
                                .then((body) => {
                                  var predictions = body.features;
                                  var listPlaceNames = [];
                                  predictions.map((x) =>
                                    listPlaceNames.push(
                                      x.place_name.split(",")[0]
                                    )
                                  );
                                  if (
                                    listPlaceNames.length === predictions.length
                                  )
                                    this.setState({
                                      newUserPlease: listPlaceNames.includes(
                                        this.state.username[0].toUpperCase() +
                                          this.state.username.substring(1)
                                      )
                                        ? "city"
                                        : false
                                    });
                                });
                            }
                          });
                      });
                  } else
                    querySnapshot.docs.forEach((doc) => {
                      if (doc.exists) {
                        this.setState({ newUserPlease: true });
                      } else {
                        this.setState({ newUserPlease: false });
                      }
                    });
                });
            } else {
              this.setState({ newUserPlease: true });
              window.alert(
                "reserve word '" + value + "', please choose another"
              );
            }
          }, 1000);
        }
      } else window.alert("no spaces");
    } else if (e.target.id === "parentEmail") {
      this.setState({
        parentEmail: e.target.value.toLowerCase()
      });
    } else {
      this.setState({
        [e.target.id]: specialFormatting(e.target.value)
      });
    }
  };
  confirmCode = async (textcode, phone) => {
    this.props.loadGreenBlue("checking numbers");
    window.confirmationResult
      .confirm(textcode)
      .then(async (result) => {
        var auth = result.user;
        console.log("Normal Finish " + auth.uid);
        const phoneNumber = parsePhoneNumber(phone);
        console.log(phoneNumber.country);
        if (phoneNumber) {
          var country = {
            _id: "country",
            country: phoneNumber.country
          };
          var done = this.setCountry(country, "setCountry");
          done &&
            (await firebase
              .firestore()
              .collection("users")
              .doc(auth.uid)
              .get()
              .then((res) => {
                if (res.exists) {
                  var user = res.data();
                  user._id = res.id;
                  user.id = res.id;
                  window.alert("user profile exists... welcome back!");
                  this.props.saveAuth(auth, true);
                } else {
                  window.alert(
                    "Welcome to Thumbprint.us - Social Calendar! Adding to firestore..."
                  );

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
                    .doc(auth.uid)
                    .set({
                      under13: this.state.under13,
                      usernameAsArray,
                      nameAsArray,
                      createdAt: new Date(),
                      username: this.state.username,
                      name: this.state.name
                    })
                    .then(() => {
                      firebase
                        .firestore()
                        .collection("numbers")
                        .doc(phoneNumber)
                        .set({ uid: auth.uid })
                        .then(() => {
                          setTimeout(() => {
                            this.props.goSignupConfirmed();
                          }, 100);
                        });
                    });
                }
                this.props.history.push("/");
                this.props.unloadGreenBlue();
              })
              .catch(standardCatch));
        }
      })
      .catch((err) => {
        this.setState({ authError: err.message });
        console.log(err.message);
      });
  };
  requestTextCodeBox = (phone) => {
    console.log(this.state.textedCode);
    console.log("ok");
    this.setState({ lastAttemptedPhone: phone });
    firebase
      .auth()
      .signInWithPhoneNumber(phone, this.state.appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        var textcode = window.prompt("what is the sms code sent to " + phone);
        if (textcode) {
          this.confirmCode(textcode, phone);
        }
        console.log("sms sent code to " + phone);
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({
          loading: false,
          noUserPleaseSignUp: null,
          showrecaptcha: false,
          recaptchaGood: false,
          authError: err.message
        });
      });
  };
  async setCountry(country, method) {
    await this.state.cdb[method](country)
      .then(() =>
        this.setState({
          country: country.country
        })
      )

      .catch((err) => console.log(err.message));
  }
  handleVol = (event) => {
    this.setState({ volume: event });
  };
  handleTime = (e) => {
    const time = e.target.currentTime;
    const timecut = time.toString().substr(0, time.toString().length - 5);
    this.setState({
      time: timecut,
      duration: e.target.duration
    });
  };
  componentWillUnmount = () => {
    clearTimeout(this.typingUsername);
    if (this.video && this.video.current) {
      this.video.current.removeEventListener("volumechange", this.handleVol);
      this.video.current.removeEventListener("timeupdate", this.handleTime);
    }
  };
  componentDidMount = async () => {
    await this.state.cdb
      .readCountry()
      .then((result) => {
        if (result.length === 0) {
          console.log(
            "no country stored [Right-Click>inspect>Application>IndexedDB]..."
          );
        }
      })
      .catch((err) => console.log(err));
    if (this.video && this.video.current) {
      this.video.current.addEventListener("volumechange", this.handleVol);

      this.video.current.addEventListener("timeupdate", this.handleTime);
    }
  };

  checkPhoneTaken = (phone, showrecaptcha) => {
    const usphone = phone;
    console.log(usphone);
    this.setState(
      { authError: "", loading: true, working: true },
      () => {
        firebase
          .firestore()
          .collection("numbers")
          .doc(usphone)
          .onSnapshot((doc) => {
            if (doc.exists) {
              //this.setState({ noUserPleaseSignUp: null });
              this.setState(
                {
                  showrecaptcha: true,
                  noUserPleaseSignUp: false,
                  loading: false
                },
                () => {
                  this.launchRecaptcha(phone, showrecaptcha);
                  console.log("user exists, here's the recaptcha");
                }
              );
            } else {
              this.setState(
                {
                  showrecaptcha: true,
                  noUserPleaseSignUp: true,
                  loading: false
                },
                () => {
                  this.launchRecaptcha(phone, showrecaptcha);
                  console.log("no user exists, please sign in");
                }
              );
            }
          });
      }
      /*await fetch(
        "https://us-central1-thumbprint-1c31n.cloudfunctions.net/doesUserPhoneExist",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/JSON",
            "Access-Control-Request-Method": "POST"
          },
          body: JSON.stringify({ usphone: usphone }),
          maxAge: 3600
        }
      )
        .then(async (response) => await response.text())
        .then((body) => {
          if (this.state.noUserPleaseSignUp) {
            //console.log(body);
            console.log("Successfully fetched user data, signup:", body);
            if (body === phone) {
              this.launchRecaptcha();
              this.setState({
                showrecaptcha: true,
                noUserPleaseSignUp: false,
                loading: false
              });
              console.log("user exists, please sign in");
            }
          } else if (!this.state.noUserPleaseSignUp) {
            console.log(body);
            console.log("Successfully fetched user data, login:", body);
            if (body === phone) {
              //this.setState({ noUserPleaseSignUp: null });
              this.launchRecaptcha();
              this.setState({
                showrecaptcha: true,
                noUserPleaseSignUp: false,
                loading: false
              });
              console.log("user exists, here's the recaptcha");
            }
          }
        })
        .catch((err) => {
        });*/
    );
  };
  launchRecaptcha = (phone, showrecaptcha) => {
    if (!showrecaptcha) {
      window.recaptchaVerifier =
        this.recaptcha &&
        this.recaptcha.current &&
        new firebase.auth.RecaptchaVerifier(this.recaptcha.current, {
          size: "normal",
          callback: (response) => {
            this.setState({
              lastAttemptedPhone: phone,
              recaptchaGood: true,
              showrecaptcha: false
            });
            this.requestTextCodeBox(phone);
            return response;
          },
          "expired-callback": (err) => {
            this.setState({ showrecaptcha: false, recaptchaGood: false });
            console.log(err.message);
            return err;
          }
        });

      const appVerifier = window.recaptchaVerifier;
      appVerifier.render();
      this.setState({ appVerifier });
    }
  };
  clickHandle = () => {
    this.props.history.push("/");
  };
  handleOptionChange = (e) => {
    if (e.target.id === "above") {
      this.setState({
        under13: e.target.value
      });
    }
    if (e.target.id === "below") {
      this.setState({
        under13: !e.target.value
      });
    }
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.location !== prevProps.location) {
      let bumpedFrom =
        this.props.location.state && this.props.location.state.bumpedFrom
          ? this.props.location.state.bumpedFrom
          : this.state.bumpedFrom;
      let openChatWhenClose =
        this.props.location.state &&
        this.props.location.state.openChatWhenClose;
      this.setState({ bumpedFrom, openChatWhenClose });
    }
  };
  loginButtonPress = (
    phone,
    warnCaptcha,
    showrecaptcha,
    authError,
    newUserPlease
  ) => {
    if (warnCaptcha === null) {
      this.setState({ warnCaptcha: true });
    } else if (!showrecaptcha && !authError) {
      if (!newUserPlease) {
        this.checkPhoneTaken(phone, showrecaptcha);
      } else {
        window.alert(
          `${this.state.username} is taken. ` +
            `email nick@thumbprint.us to claim copyright`
        );
      }
    }
  };
  render() {
    const {
      warnCaptcha,
      bumpedFrom,
      showrecaptcha,
      authError,
      phone,
      lastAttemptedPhone,
      newUserPlease,
      country
    } = this.state;
    const sites = [
      //"4vosh.csb.app",
      "wavv.art",
      "thumbprint.app",
      "thumbprint.family",
      "tpt.sh"
    ];
    return (
      <div className="login">
        <div
          style={{
            zIndex: "6",
            display: "flex",
            position: "fixed",
            width: "100%",
            height: !warnCaptcha ? "0%" : "100%",
            top: "0px",
            transform: warnCaptcha ? "translateX(0%)" : "translateX(-100%)",
            backgroundColor: warnCaptcha
              ? "rgba(250,250,250,1)"
              : "rgba(250,250,250,0)",
            transition: ".3s linear",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          <div
            onClick={() => this.setState({ warnCaptcha: false })}
            style={{
              display: "flex",
              position: "absolute",
              left: "20px",
              top: "20px",
              color: "black"
            }}
          >
            Fine, proceed to login
          </div>
          <Link
            to="/"
            style={{
              display: "flex",
              position: "absolute",
              right: "20px",
              top: "20px",
              color: "black"
            }}
          >
            Go back
          </Link>
          <div
            style={{
              display: "flex",
              position: "absolute",
              width: "80%",
              maxWidth: "600px",
              height: "min-content",
              zIndex: "9999",
              transform: "translateX(0%)",
              backgroundColor: "rgba(250,250,250,1)",
              transition: ".3s linear",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              margin: "60px 0px"
            }}
          >
            reCAPTCHA is a free service from Google that helps protect this
            web-app from spam and abuse by keeping automated software out
            <br />
            <br />
            It does this by collecting personal information about users to
            determine if they're humans and not spam bots
            <br />
            <br />
            "This ... [cookie & screenshot] information ... no longer reflects
            or references an individually-identifiable user," but informs
            marketing partners of your profile and trends for third-party users
            on Google's brand of products
            <br />
            <br />
            go ahead read their{" "}
            <a href="https://policies.google.com/privacy/google-partners">
              privacy policy
            </a>
            <br />
            <br />
            <a href="https://thumbprint.us">privacy policy & terms</a>
            <br />
            (all files and chats use on-device-encryption)
            <br />
            Features like tamper-proof-dns, gov-id-login to come
            <br />
            <br />
            last updated: 8/4/2021
          </div>
        </div>
        <img
          className="alternative"
          src="https://www.dl.dropboxusercontent.com/s/9ctrgn3angb8zz4/Screen%20Shot%202019-10-02%20at%2011.30.21%20AM.png?dl=1"
          alt="error"
        />
        <video
          ref={this.video}
          id="background-video"
          loop
          autoPlay
          playsInline
          muted
        >
          <source
            src="https://www.dl.dropboxusercontent.com/s/eqdqu6op7pa2wmg/My%20Movie%2015.mp4?dl=1"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div>
          <div
            style={{
              padding: "10px",
              width: "calc(100% - 20px)",
              color: "rgb(220,230,240)",
              backgroundColor: "rgba(0,0,0,.3)"
            }}
          >
            <label htmlFor="phone" className="spaceforphone">
              Phone{" "}
            </label>
            <div onClick={this.clickHandle} className="plusrightexit">
              &times;
            </div>
            <h1>You must log in to view {bumpedFrom}</h1>
            <br />
            <h2>standard rates apply</h2>
          </div>
          <br />
          {this.state.noUserPleaseSignUp !== true && (
            <div
              style={{
                padding: "10px",
                width: "calc(100% - 20px)",
                color: "rgb(220,230,240)",
                backgroundColor: "rgba(0,0,0,.3)"
              }}
              onClick={() =>
                window.alert(
                  `You are now posting things like username if you proceed. ` +
                    `Your number and phone are under userDatas, a collection ` +
                    `in the NoSQL database only accessible by https:// SSL certification
                ${sites.map(
                  (x, i) => `${x + (i !== sites.length - 1 ? "," : "")} `
                )}` /*+
                    `You can keep sprite to this list on thumbprint.us; ` +
                    `Firebase Database (Firestore) data is encrypted in transit, ` +
                    `it is stored on encrypted disks on the servers, and ` +
                    `may be stored in your browser's cache. ` +
                    `so use it on a private device. ` +
                    `Sim card security depends on your Internet Service Provider's ` +
                    `identification process and some identity theft happens.`*/
                )
              }
            >
              <span role="img" aria-label="hazard icon">
                {" "}
                ️⚠️
              </span>
              You are now posting username if you proceed
              <hr />
              <div
                style={{
                  width: "100%",
                  backgroundColor: "rgba(0,0,0,.8)",
                  padding: "5px 0px"
                }}
              >
                Utilize your number, phone & https:// to access&nbsp;
                {sites.map(
                  (x, i) => `${x + (i !== sites.length - 1 ? "," : "")} `
                )}
                logged-in (cors, phone, NoSQL)
              </div>
              <hr />
              <br />
              Sim card security depends on your Internet Service Provider's
              identification process and some identity theft happens. Before
              adding banking, we will require an email... but please urge our
              Representatives to put out a convict-intranet and
              PII-free-authentication with state-issued-photo-ID
            </div>
          )}
          <div>
            {authError ? () => authError.toString() : null}
            {this.state.noUserPleaseSignUp === null
              ? null
              : this.state.noUserPleaseSignUp
              ? "no user exists, use recaptcha to get firebase.auth() text"
              : "user exists, use recaptcha to get firebase.auth() text"}
          </div>
          <br />
          {this.state.noUserPleaseSignUp && !authError && (
            <label
              required
              onChange={(event) => this.handleOptionChange(event)}
            >
              No&nbsp;{" "}
              <input
                onClick={() => this.setState({ under13: true })}
                type="checkbox"
                value="below"
                checked={this.state.under13 === true}
                onChange={this.handleOptionChange}
              />
              &nbsp;are you 13 or older?
              <br />
              ■-■¬(≖_≖ )&nbsp;{" "}
              <input
                onClick={() => this.setState({ under13: false })}
                type="checkbox"
                value="above"
                checked={this.state.under13 === false}
                onChange={this.handleOptionChange}
              />
              &nbsp;Yes
            </label>
          )}
          <div
            className="input"
            style={{
              padding: "10px",
              width: "calc(100% - 20px)",
              backgroundColor: "rgba(0,0,0,.8)"
            }}
          >
            {country && country.constructor === String && (
              <div>
                {" "}
                <div
                  onClick={() => {
                    var country = { country: "US", _id: "country" };
                    this.setCountry(country, "setCountry");
                  }}
                >
                  &times;
                </div>
                <PhoneInput
                  defaultCountry={country}
                  required
                  options={{ extract: true }}
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(phone) => {
                    if (phone) {
                      this.setState(
                        {
                          phone
                        } /*, () => {
                        clearTimeout(this.parseCountry);
                        this.parseCountry = setTimeout(() => {
                          console.log(phone);
                          const country = parsePhoneNumber(phone);
                          if (country) {
                            console.log(country.country);
                            this.setState({
                              country: country.country
                            });
                          }
                        }, 1200);
                      }*/
                      );
                    } else {
                      window.alert("only numbers");
                    }
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.loginButtonPress(
                      phone,
                      warnCaptcha,
                      showrecaptcha,
                      authError,
                      newUserPlease
                    );
                  }}
                  /*countrySelectComponent={(rest) => (
                  <select {...rest} value={country} onChange={() => {}}>
                    <option>{country}</option>
                  </select>
                )}*/
                />
              </div>
            )}
            <div onClick={() => this.setState(initialState)}>&#8634;</div>
            {this.state.noUserPleaseSignUp && !authError ? (
              <div>
                {this.state.under13 === true ? (
                  <input
                    required
                    className="input-field"
                    type="email"
                    id="parentEmail"
                    placeholder="parentEmail"
                    value={this.state.parentEmail}
                    onChange={this.handleChange}
                    minLength="3"
                    maxLength="60"
                  />
                ) : null}
                {newUserPlease ? (
                  <div>
                    {newUserPlease !== true ? newUserPlease : "Username"} taken
                  </div>
                ) : (
                  this.state.username !== "" && (
                    <div style={{ fontSize: "14px", color: "grey" }}>
                      SUBJECT TO COPYRIGHT
                    </div>
                  )
                )}
                <input
                  required
                  className="input-field"
                  type="username"
                  id="username"
                  placeholder="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  minLength="3"
                  maxlength="30"
                />

                <input
                  required
                  className="input-field"
                  type="name"
                  id="name"
                  placeholder="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  minLength="3"
                  maxlength="30"
                />
              </div>
            ) : null}

            {this.state.loading ? (
              <img
                src="https://www.dl.dropboxusercontent.com/s/le41i6li4svaz0q/802%20%282%29.gif?dl=0"
                alt="error"
              />
            ) : !showrecaptcha && !authError && phone !== lastAttemptedPhone ? (
              <div
                onClick={() =>
                  this.loginButtonPress(
                    phone,
                    warnCaptcha,
                    showrecaptcha,
                    authError,
                    newUserPlease
                  )
                }
              >
                {this.state.noUserPleaseSignUp ? "Sign Up" : "Log in"}
              </div>
            ) : null}
          </div>
          <div
            ref={this.recaptcha}
            className={showrecaptcha ? "showrecaptcha" : "hiderecaptcha"}
          />
          <button className="previewbtn" onClick={this.clickHandle}>
            Preview
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
