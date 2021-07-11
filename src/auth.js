import React from "react";
import { withRouter } from "react-router-dom";
import Data from "./data";
import firebase from "./init-firebase";
import { ADB } from "./widgets/authdb"; //default export would require no '{}' braces

class Auth extends React.Component {
  constructor(props) {
    super(props);
    var storedAuth = undefined;
    let adb = new ADB();
    this.state = {
      adb,
      auth: undefined,
      user: undefined,
      meAuth: undefined,
      storedAuth,
      tickets: [],
      myCommunities: [],
      folders: []
    };
  }
  getParents = () => {
    firebase
      .firestore()
      .collection("parents")
      .onSnapshot(
        (querySnapshot) => {
          let p = 0;
          let parents = [];
          querySnapshot.docs.forEach((doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              parents.push(foo);
            }
          });
          if (
            querySnapshot.docs.length === p &&
            this.state.parents !== parents
          ) {
            this.setState({ parents });
          }
        },
        (e) => console.log(e.message)
      );
  };
  getEntities = (meAuth) => {
    firebase
      .firestore()
      .collection("communities")
      .where("authorId", "==", meAuth.uid)
      .onSnapshot(
        (querySnapshot) => {
          let p = 0;
          let fo = [];
          querySnapshot.docs.forEach((doc) => {
            p++;
            if (doc.exists) {
              const foo = doc.data();
              foo.id = doc.id;
              if (foo.authorId === meAuth.uid) {
                fo.push(foo);
              }
            }
          });
          if (
            p === querySnapshot.docs.length &&
            this.state.myCommunities !== fo
          ) {
            firebase
              .firestore()
              .collection("communities")
              .where("admin", "array-contains", meAuth.uid)
              .onSnapshot(
                (querySnapshot) => {
                  let p = 0;
                  let fo = [];
                  if (querySnapshot.empty) {
                    this.setState({
                      myCommunities: fo
                    });
                  } else {
                    querySnapshot.docs.forEach((doc) => {
                      p++;
                      if (doc.exists) {
                        const foo = doc.data();
                        foo.id = doc.id;
                        if (foo.authorId === meAuth.uid) {
                          fo.push(foo);
                        }
                      }
                    });
                    if (
                      p === querySnapshot.docs.length &&
                      this.state.myCommunities !== fo
                    ) {
                      this.setState({
                        myCommunities: fo
                      });
                    }
                  }
                },
                (e) => console.log(e.message)
              );
          }
        },
        (e) => console.log(e.message)
      );
    //Posts by the user
    firebase
      .firestore()
      .collection("tickets")
      .where("admittees", "array-contains", meAuth.uid)
      .onSnapshot(
        (querySnapshot) => {
          let dol = [];
          let p = 0;
          querySnapshot.docs.forEach((doc) => {
            p++;
            if (doc.exists) {
              const foo = doc.data();
              foo.id = doc.id;
              dol.push(foo);
            }
          });
          if (querySnapshot.docs.length === p) {
            this.setState({ tickets: dol });
          }
        },
        (e) => console.log(e.message)
      );

    let iAmRepresentative = [];
    let iAmJudge = [];
    let iAmCandidate = [];
    firebase
      .firestore()
      .collection("communities")
      .where("representatives", "array-contains", meAuth.uid)
      .onSnapshot(
        (querySnapshot) => {
          if (querySnapshot.empty) {
            return null;
          } else
            querySnapshot.docs.forEach((doc) => {
              var foo = doc.data();
              foo.id = doc.id;
              return iAmRepresentative.push(foo);
            });
        },
        (e) => console.log(e.message)
      );
    firebase
      .firestore()
      .collection("communities")
      .where("representatives", "array-contains", meAuth.uid)
      .onSnapshot(
        (querySnapshot) => {
          if (querySnapshot.empty) {
            return null;
          } else
            querySnapshot.docs.forEach((doc) => {
              var foo = doc.data();
              foo.id = doc.id;
              return iAmJudge.push(foo);
            });
        },
        (e) => console.log(e.message)
      );
    firebase
      .firestore()
      .collection("elections")
      .where("candidates", "array-contains", meAuth.uid)
      .onSnapshot(
        (querySnapshot) => {
          if (querySnapshot.empty) {
            return null;
          } else
            querySnapshot.docs.forEach((doc) => {
              var foo = doc.data();
              foo.id = doc.id;
              return iAmCandidate.push(foo);
            });
        },
        (e) => console.log(e.message)
      );
    return this.setState({ iAmCandidate, iAmJudge, iAmRepresentative });
  };
  getFolders = async (folderReference) => {
    console.log("folders in: ");
    console.log(folderReference);
    var listRef = this.props.storageRef.child(folderReference);
    await listRef
      .listAll()
      .then((res) => {
        console.log(res); //{prefixes: Array(0), items: Array(1)}
        let folders = [];
        let p = 0;
        res._delegate.prefixes.forEach((reference) => {
          p++;
          // All the items under listRef.
          var food = reference._location.path_;
          console.log(food);
          var foo = food.split(`personalCaptures/${this.state.auth.uid}/`)[1];
          folders.push(foo);
        });
        if (res.prefixes.length === p) {
          console.log(folders);
          this.setState({ folders });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };
  addUserDatas = (meAuth, b) => {
    firebase
      .firestore()
      .collection("userDatas")
      .doc(meAuth.uid)
      .onSnapshot(
        (doc) => {
          var userDatas = undefined;
          if (doc.exists) {
            userDatas = doc.data();
            if (userDatas.email && userDatas.email === meAuth.email) {
              firebase
                .firestore()
                .collection("userDatas")
                .doc(meAuth.uid)
                .update({
                  email: null,
                  confirmedEmails: firebase.firestore.FieldValue.arrayUnion(
                    meAuth.email
                  ),
                  defaultEmail: userDatas.defaultEmail
                    ? userDatas.defaultEmail
                    : meAuth.email
                });
              b.email = null;
            }
            if (userDatas.banked)
              firebase
                .firestore()
                .collection("banks")
                .where("owner", "==", meAuth.uid)
                .onSnapshot(
                  (querySnapshot) => {
                    let q = 0;
                    let banks = [];
                    querySnapshot.docs.forEach((doc) => {
                      q++;
                      if (doc.exists) {
                        var bank = doc.data();
                        bank.id = doc.id;
                        banks.push(bank);
                      }
                    });
                    if (querySnapshot.docs.length === q) {
                      userDatas.banks = banks;
                    }
                  },
                  (e) => console.log(e.message)
                );

            if (this.state.userDatas !== userDatas) {
              delete b.defaultEmail;
              this.setState({
                user: { ...b, ...userDatas },
                userDatas
              });
            }
          }
        },
        (e) => {
          console.log(e.message);
        }
      );
    this.getEntities(meAuth);
  };
  getInformation = (meAuth) => {
    firebase
      .firestore()
      .collection("users")
      .doc(meAuth.uid)
      .onSnapshot(
        async (doc) => {
          if (doc.exists) {
            var user = doc.data();
            user.id = doc.id;
            this.setState({
              user,
              auth: meAuth,
              loaded: true
            });
            this.addUserDatas(meAuth, user);
          }
        },
        (e) => console.log(e.message)
      );
  };
  async setAuth(storedAuth, method, logout) {
    await this.state.adb[method](storedAuth)
      .then((res) => {
        console.log(res);
        this.props.unloadGreenBlue();
        this.setState({
          storedAuth
        });
        logout && window.location.reload();
      })
      .catch((err) => console.log(err.message));
  }
  handleStoreAuth = (meAuth, logout, hasPermission) => {
    var stripped = {};
    if (meAuth.length === 0) {
      stripped._id = "none";
      this.setAuth(stripped, "setAuth", logout);
      this.setState({ meAuth: undefined });
    } else {
      console.log(meAuth.uid + " found");
      stripped._id = meAuth.uid;
      stripped.uid = meAuth.uid;
      stripped.displayName = meAuth.displayName;
      stripped.photoURL = meAuth.photoURL;
      stripped.email = meAuth.email;
      stripped.emailVerified = meAuth.emailVerified;
      stripped.phoneNumber = meAuth.phoneNumber;
      stripped.isAnonymous = meAuth.isAnonymous;
      stripped.tenantId = meAuth.tenantId;
      stripped.providerData = meAuth.providerData;
      stripped.apiKey = meAuth.apiKey;
      stripped.appName = meAuth.appName;
      stripped.authDomain = meAuth.authDomain;
      stripped.stsTokenManager = meAuth.stsTokenManager;
      stripped.refreshToken = meAuth.refreshToken;
      stripped.accessToken = meAuth.accessToken;
      stripped.expirationTime = meAuth.expirationTime;
      stripped.redirectEventId = meAuth.redirectEventId;
      stripped.lastLoginAt = meAuth.lastLoginAt;
      stripped.createdAt = meAuth.createdAt;
      stripped.multiFactor = JSON.stringify(meAuth.multiFactor);
      if (this.state.storedAuth !== stripped) {
        if (!stripped.isAnonymous) {
          var store = false;
          if (!hasPermission) {
            store = window.confirm(
              "is this a private device? if so, can we store your auth data?" +
                `(${stripped.displayName},${stripped.phoneNumber},${stripped.email})`
            );
          } else {
            store = true;
          }
          if (store) {
            //getUserData from update
            this.getInformation(meAuth);
            this.setAuth(stripped, "setAuth");
          } else {
            this.props.unloadGreenBlue();
          }
        } else {
          this.setAuth(stripped, "setAuth");
        }
        this.setState({ meAuth });
      }
    }
  };
  getUserInfo = () => {
    if (this.state.meAuth !== undefined && this.state.meAuth.isAnonymous) {
      this.props.history.push("/login");
    } else {
      this.props.loadGreenBlue("loading authentication...");
      if (this.state.storedAuth !== undefined) {
        var meAuth = { ...this.state.storedAuth };
        if (!meAuth.multiFactor) {
          this.state.adb.deleteKeys();
        } else {
          meAuth.multiFactor = JSON.parse(meAuth.multiFactor);
          if (meAuth.isAnonymous) {
            this.setState({ meAuth });
            this.props.unloadGreenBlue();
          } else {
            this.handleStoreAuth(this.state.storedAuth, false, true);
            this.setState({ meAuth });
          }
        }
      }
      this.state.auth === undefined &&
        firebase.auth().onAuthStateChanged(
          (meAuth) => {
            console.log("firebase authentication called");
            if (meAuth) {
              this.handleStoreAuth(meAuth);
              this.props.unloadGreenBlue();
              if (meAuth.isAnonymous) {
                console.log("anonymous");
              } else {
                console.log(meAuth.uid + " is logged in");
                if (
                  this.state.meAuth !== undefined &&
                  this.state.meAuth.isAnonymous
                ) {
                  this.state.meAuth
                    .delete()
                    .then(() =>
                      window.alert("successfully removed anonymous account")
                    );
                }
              }
            } else {
              console.log("getting fake user data...");
              firebase
                .auth()
                .signInAnonymously()
                .then(() => {
                  var answer = window.confirm("login?");
                  if (answer) {
                    this.props.history.push("/login");
                    this.props.unloadGreenBlue();
                  }
                })
                .catch((error) => {
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorCode);
                  console.log(errorMessage);
                });
            }
          },
          (err) => console.log(err.message)
        );
    }
  };
  componentDidMount = () => {
    this.promptAuth();
  };
  promptAuth = async () => {
    await this.state.adb
      .readAuth()
      .then((result) => {
        if (result.length === 0) {
          console.log("no user stored...");
        } else {
          var storedAuth = result[0];
          var meAuth = { ...storedAuth };
          if (!storedAuth) {
            console.log("new authdb");
          } else if (storedAuth.isAnonymous) {
            console.log("authdb is anonymous");
            meAuth.multiFactor = JSON.parse(meAuth.multiFactor);
            this.setState({
              storedAuth,
              meAuth
            });
          } else if (storedAuth._id === "none") {
            this.setState({ storedAuth });
          } else {
            console.log("authdb is identifiable");
            //getUserData from pouchDB
            this.getInformation(meAuth);
            this.setState({ storedAuth });
          }
        }
      })
      .catch((err) => console.log(err));
  };
  render() {
    const {
      forumPosts,
      ordinances,
      budget,
      cases,
      elections,
      oldBudget,
      oldCases,
      oldElections,
      lastProfilePosts,
      appHeight,
      containerStyle,
      width
    } = this.props;
    return (
      <Data
        unmountFirebase={this.props.unmountFirebase}
        containerStyle={containerStyle}
        appHeight={appHeight}
        width={width}
        apple={this.props.apple}
        history={this.props.history}
        location={this.props.location}
        statePathname={this.props.statePathname}
        setIndex={this.props.setIndex}
        displayPreferences={this.props.displayPreferences}
        setDisplayPreferences={this.props.setDisplayPreferences}
        setToUser={(key) =>
          this.setState({ user: { ...this.state.user, ...key } })
        }
        isPost={this.props.isPost}
        isCommunity={this.props.isCommunity}
        isProfile={this.props.isProfile}
        isEntity={this.props.isEntity}
        profile={this.props.profile}
        lastProfilePosts={lastProfilePosts}
        entityPosts={this.props.entityPosts}
        stateCity={this.props.stateCity}
        entityName={this.props.entityName}
        profilePosts={this.props.profilePosts}
        pathname={this.props.pathname}
        setPath={this.props.setPath}
        item={this.props.item}
        city={this.props.city}
        community={this.props.community}
        setCommunity={this.props.setCommunity}
        setCommtype={this.props.setCommtype}
        forumOpen={this.props.forumOpen}
        chosenPlace={this.props.chosenPlace}
        setPlace={this.props.setPlace}
        parents={this.state.parents}
        storageRef={this.props.storageRef}
        meAuth={this.state.meAuth}
        logoutofapp={async () => {
          var answer = window.confirm("Are you sure you want to log out?");
          if (answer) {
            await firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.SESSION);
            firebase
              .auth()
              .signOut()
              .then(() => {
                console.log("logged out");
                this.handleStoreAuth({}, true);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.getUserInfo();
          }
        }}
        saveAuth={(x, hasPermission) => {
          this.handleStoreAuth(x, true, hasPermission);
        }}
        getUserInfo={() => this.getUserInfo()}
        //
        myDocs={this.state.myDocs}
        moreDocs={this.moreDocs}
        againBackDocs={this.againBackDocs}
        tickets={this.state.tickets}
        myEvents={this.state.myEvents}
        myJobs={this.state.myJobs}
        myCommunities={this.state.myCommunities}
        myClubs={this.state.myClubs}
        myServices={this.state.myServices}
        myClasses={this.state.myClasses}
        myDepartments={this.state.myDepartments}
        myRestaurants={this.state.myRestaurants}
        myShops={this.state.myShops}
        myPages={this.state.myPages}
        myVenues={this.state.myVenues}
        myHousing={this.state.myHousing}
        auth={this.state.auth}
        user={this.state.user}
        //
        iAmCandidate={this.state.iAmCandidate}
        iAmJudge={this.state.iAmJudge}
        iAmRepresentative={this.state.iAmRepresentative}
        followingMe={this.state.followingMe}
        //
        getFolders={this.getFolders}
        getVideos={this.props.getVideos}
        folders={this.state.folders}
        videos={this.props.videos}
        //

        stripeKey={this.props.stripeKey}
        setGoogleLoginRef={this.props.loginButton}
        spotifyAccessToken={this.props.spotifyAccessToken}
        deleteScopeCode={this.props.deleteScopeCode}
        setScopeCode={this.props.setScopeCode}
        accessToken={this.props.accessToken}
        twitchUserAccessToken={this.props.twitchUserAccessToken}
        loaded={this.props.loaded}
        //
        filePreparedToSend={this.props.filePreparedToSend}
        picker={this.props.picker}
        picker1={this.props.picker1}
        picker2={this.props.picker2}
        loadGapiApi={this.props.loadGapiApi}
        signedIn={this.props.signedIn}
        switchAccount={this.props.switchAccount}
        signOut={this.props.signOut}
        //

        clearFilePreparedToSend={this.props.clearFilePreparedToSend}
        loadYoutubeApi={this.props.loadYoutubeApi}
        s={this.props.s}
        authResult={this.props.authResult}
        googlepicker={this.props.googlepicker}
        individualTypes={this.props.individualTypes}
        db={this.props.db}
        loadGreenBlue={this.props.loadGreenBlue}
        unloadGreenBlue={this.props.unloadGreenBlue}
        //
        setForumDocs={this.props.setForumDocs}
        forumPosts={forumPosts}
        ordinances={ordinances}
        budget={budget}
        cases={cases}
        elections={elections}
        oldBudget={oldBudget}
        oldCases={oldCases}
        oldElections={oldElections}
        //
        departments={this.props.departments}
        classes={this.props.classes}
        oldClasses={this.props.oldClasses}
        together={this.props.together}
        clubs={this.props.clubs}
        jobs={this.props.jobs}
        venues={this.props.venues}
        services={this.props.services}
        restaurants={this.props.restaurants}
        shops={this.props.shops}
        pages={this.props.pages}
        housing={this.props.housing}
        //
        commtype={this.props.commtype}
        tileChosen={this.props.tileChosen}
        loadingMessage={this.props.loadingMessage}
        //
        addProfilePost={this.props.addProfilePost}
        clearProfile={this.props.clearProfile}
      />
    );
  }
}
export default withRouter(Auth);

/**
 *  [
      { collection: "clubs", name: "myClubs" },
      { collection: "shops", name: "myShops" },
      { collection: "restaurants", name: "myRestaurants" },
      { collection: "services", name: "myServices" },
      { collection: "classes", name: "myClasses" },
      { collection: "departments", name: "myDepartments" },
      { collection: "pages", name: "myPages" },
      { collection: "jobs", name: "myJobs" },
      { collection: "venues", name: "myVenues" },
      { collection: "housing", name: "myHousing" },
      { collection: "planner", name: "myEvents" }
      //{ collection: "budget & proposals", name: "myBudget" },
      //{ collection: "court cases", name: "myCases" },
      //{ collection: "elections", name: "myElections" },
      //{ collection: "ordinances", name: "myOrdinances" },
      //{ collection: "forum", name: "myPosts" }
    ].map((y) => {
      let titles = [];
      if (["classes", "departments"].includes(y.collection)) {
        if ("classes" === y.collection) {
          firebase
            .firestore()
            .collection("oldClasses")
            .where("authorId", "==", meAuth.uid)
            .onSnapshot(
              (querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                  if (doc.exists) {
                    const foo = doc.data();
                    foo.id = doc.id;
                    foo.collection = y.collection;
                    if (!titles.find((x) => x.id === foo.id)) {
                      titles.push(foo);
                    }
                  }
                });
              },
              (e) => console.log(e.message)
            );
          return firebase
            .firestore()
            .collection("oldClasses")
            .where("admin", "array-contains", meAuth.uid)
            .onSnapshot(
              (querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                  if (doc.exists) {
                    const foo = doc.data();
                    foo.id = doc.id;
                    foo.collection = y.collection;
                    if (!titles.find((x) => x.id === foo.id)) {
                      titles.push(foo);
                    }
                  }
                });
              },
              (e) => console.log(e.message)
            );
        }
        firebase
          .firestore()
          .collection(y.collection)
          .where("authorId", "==", meAuth.uid)
          .onSnapshot(
            (querySnapshot) => {
              querySnapshot.docs.forEach((doc) => {
                if (doc.exists) {
                  const foo = doc.data();
                  foo.id = doc.id;
                  foo.collection = y.collection;
                  if (!titles.find((x) => x.id === foo.id)) {
                    titles.push(foo);
                  }
                }
              });
            },
            (e) => console.log(e.message)
          );
        firebase
          .firestore()
          .collection(y.collection)
          .where("admin", "array-contains", meAuth.uid)
          .onSnapshot(
            (querySnapshot) => {
              querySnapshot.docs.forEach((doc) => {
                if (doc.exists) {
                  const foo = doc.data();
                  foo.id = doc.id;
                  foo.collection = y.collection;
                  if (!titles.find((x) => x.id === foo.id)) {
                    titles.push(foo);
                  }
                }
              });
            },
            (e) => console.log(e.message)
          );
        return this.setState({
          [y.name]: titles
        });
      } else {
        const geocollection1 = firebase.firestore().collection(y.collection);
        if (
          [
            //"classes",
            "planner",
            "jobs",
            "court cases",
            "elections",
            "budget & proposals"
          ].includes(y.collection)
        ) {
          var old = "";
          if ("planner" === y.collection) {
            old = "oldPlanner";
          } else if ("jobs" === y.collection) {
            old = "oldJobs";
          } else if ("budget" === y.collection) {
            old = "oldBudget";
          } else if ("court cases" === y.collection) {
            old = "oldCases";
          } else if ("elections" === y.collection) {
            old = "oldElections";
          }
          const geocollection2 = firebase.firestore().collection(old);
          geocollection2.where("authorId", "==", meAuth.uid).onSnapshot(
            (querySnapshot) => {
              querySnapshot.docs.forEach((doc) => {
                if (doc.exists) {
                  const foo = doc.data();
                  foo.id = doc.id;
                  foo.collection = y.collection;
                  if (!titles.find((x) => x.id === foo.id)) {
                    titles.push(foo);
                  }
                }
              });
            },
            (e) => console.log(e.message)
          );

          geocollection2
            .where("admin", "array-contains", meAuth.uid)
            .onSnapshot(
              (querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                  if (doc.exists) {
                    const foo = doc.data();
                    foo.id = doc.id;
                    foo.collection = y.collection;
                    if (!titles.find((x) => x.id === foo.id)) {
                      titles.push(foo);
                    }
                  }
                });
              },
              (e) => console.log(e.message)
            );
        }
        geocollection1.where("authorId", "==", meAuth.uid).onSnapshot(
          (querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
              if (doc.exists) {
                const foo = doc.data();
                foo.id = doc.id;
                foo.collection = y.collection;
                if (!titles.find((x) => x.id === foo.id)) {
                  titles.push(foo);
                }
              }
            });
          },
          (e) => console.log(e.message)
        );

        geocollection1.where("admin", "array-contains", meAuth.uid).onSnapshot(
          (querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
              if (doc.exists) {
                const foo = doc.data();
                foo.id = doc.id;
                foo.collection = y.collection;
                if (!titles.find((x) => x.id === foo.id)) {
                  titles.push(foo);
                }
              }
            });
          },
          (e) => console.log(e.message)
        );

        return this.setState({
          [y.name]: titles
        });
      }
    });
 */
