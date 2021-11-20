import React from "react";
import { withRouter } from "react-router-dom";
import Data from "./data";
import firebase from "./init-firebase";
import PromptAuth from "react-local-firebase";
import { ADB, standardCatch } from "./widgets/authdb"; //default export would require no '{}' braces

class Auth extends React.Component {
  constructor(props) {
    super(props);
    var storedAuth = undefined;
    this.state = {
      auth: undefined,
      user: undefined,
      meAuth: {},
      storedAuth,
      tickets: [],
      myCommunities: [],
      folders: [],
      storableAuth: []
    };
    this.pa = React.createRef();
    this.fwd = React.createRef();
    this.Vintages = React.createRef();
  }
  /*getParents = () => {
    firebase
      .firestore()
      .collection("parents")
      .onSnapshot((querySnapshot) => {
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
        if (querySnapshot.docs.length === p && this.state.parents !== parents) {
          this.setState({ parents });
        }
      }, standardCatch);
  };*/
  getEntities = (meAuth) => {
    const runRoles = () => {
      let iAmRepresentative = [];
      let iAmJudge = [];
      let iAmCandidate = [];
      communities
        .where("representatives", "array-contains", meAuth.uid)
        .onSnapshot(
          (querySnapshot) =>
            querySnapshot.docs.forEach((doc, i) => {
              var foo = doc.data();
              foo.id = doc.id;
              if (querySnapshot.docs.length === i) iAmRepresentative.push(foo);
            }),
          standardCatch
        );
      communities.where("judges", "array-contains", meAuth.uid).onSnapshot(
        (querySnapshot) =>
          querySnapshot.docs.forEach((doc, i) => {
            var foo = doc.data();
            foo.id = doc.id;
            if (querySnapshot.docs.length === i) iAmJudge.push(foo);
          }),
        standardCatch
      );
      firebase
        .firestore()
        .collection("elections")
        .where("candidates", "array-contains", meAuth.uid)
        .onSnapshot(
          (querySnapshot) =>
            querySnapshot.docs.forEach((doc, i) => {
              var foo = doc.data();
              foo.id = doc.id;
              if (querySnapshot.docs.length === i) iAmCandidate.push(foo);
            }),
          standardCatch
        );
      //snapshots cannot return without 'state', which uses DOM, or props:{}
    };
    const runCommunities = () =>
      communities
        .where("authorId", "==", meAuth.uid)
        .onSnapshot((querySnapshot) => {
          let p = 0;
          let myCommunities = [];
          querySnapshot.docs.forEach((doc) => {
            p++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              if (foo.authorId === meAuth.uid) myCommunities.push(foo);
            }
          });
          if (p === querySnapshot.docs.length)
            communities
              .where("admin", "array-contains", meAuth.uid)
              .onSnapshot((querySnapshot) => {
                let pp = 0;
                querySnapshot.docs.forEach((doc) => {
                  pp++;
                  if (doc.exists) {
                    var foo = doc.data();
                    foo.id = doc.id;
                    if (foo.authorId === meAuth.uid) {
                      myCommunities.push(foo);
                    }
                  }
                });
                if (pp === querySnapshot.docs.length)
                  this.setState({
                    myCommunities
                  });
              }, standardCatch);
        }, standardCatch);

    const communities = firebase.firestore().collection("communities");
    runCommunities();

    firebase
      .firestore()
      .collection("tickets")
      .where("admittees", "array-contains", meAuth.uid)
      .onSnapshot((querySnapshot) => {
        let tickets = [];
        let p = 0;
        querySnapshot.docs.forEach((doc) => {
          p++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            tickets.push(foo);
          }
        });
        if (querySnapshot.docs.length === p) this.setState({ tickets });
      }, standardCatch);

    runRoles();
  };
  getFolders = async (folderReference) =>
    await this.props.storageRef
      .child(folderReference)
      .listAll()
      .then((res) => {
        console.log("folders in: ");
        console.log(folderReference);
        //console.log(res); //{prefixes: Array(0), items: Array(1)}
        let folders = [];
        let p = 0;
        res._delegate.prefixes.forEach((reference) => {
          p++;
          // All the items under listRef.
          var food = reference._location.path_;
          //console.log(food);
          var foo = food.split(`personalCaptures/${this.state.auth.uid}/`)[1];
          folders.push(foo);
        });
        if (res.prefixes.length === p) {
          //console.log(folders);
          this.setState({ folders });
        }
      })
      .catch(standardCatch);

  addUserDatas = (meAuth, b) => {
    const userDatas = firebase.firestore().collection("userDatas");
    userDatas.doc(meAuth.uid).onSnapshot((doc) => {
      var userDatas = undefined;
      if (doc.exists) {
        userDatas = doc.data();
        if (userDatas.email && userDatas.email === meAuth.email) {
          userDatas.doc(meAuth.uid).update({
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
            .onSnapshot((querySnapshot) => {
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
            }, standardCatch);

        if (this.state.userDatas !== userDatas) {
          delete b.defaultEmail;
          this.setState(
            {
              user: { ...b, ...userDatas },
              userDatas
            },
            () => this.getEntities(meAuth)
          );
        }
      }
    }, standardCatch);
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
      width,
      loadingHeight
    } = this.props;
    return (
      <div>
        <PromptAuth
          getRefs={() => {
            return {
              pa: this.pa,
              fwd: this.fwd
            };
          }}
          reset={this.state.resetAuth}
          storableAuth={this.state.storableAuth}
          clearAuth={() => this.setState({ storableAuth: [] })}
          resetResetAuth={() => this.setState({ resetAuth: null })}
          //pa={this.pa}
          //fwd={this.fwd}
          onPromptToLogin={() => this.props.history.push("/login")}
          verbose={true}
          onStart={() => this.props.loadGreenBlue("loading authentication...")}
          setFireAuth={(answer) => {
            if (Object.keys(answer).includes("isStored")) {
              console.log("isStored");
              answer.logout && window.location.reload();
            } else if (Object.keys(answer).includes("meAuth"))
              this.setState(
                {
                  meAuth: answer.meAuth
                },
                () => {
                  if (answer.meAuth.isAnonymous) console.log("anonymous");
                  !answer.meAuth.isAnonymous &&
                    firebase
                      .firestore()
                      .collection("users")
                      .doc(answer.meAuth.uid)
                      .onSnapshot((doc) => {
                        this.props.unloadGreenBlue();
                        if (doc.exists) {
                          var user = doc.data();
                          user.id = doc.id;
                          //console.log(user);
                          //console.log(answer.meAuth);
                          this.setState(
                            {
                              user,
                              auth: answer.meAuth,
                              loaded: true
                            },
                            () => this.addUserDatas(answer.meAuth, user)
                          );
                        }
                      }, standardCatch);
                }
              );
          }}
          onFinish={() => this.props.unloadGreenBlue()}
          meAuth={this.state.meAuth === undefined ? null : this.state.meAuth}
          auth={this.state.auth === undefined ? null : this.state.auth}
        />

        <Data
              setAuth={x=>this.setState(x)}
          meAuth={this.state.meAuth}
          getUserInfo={
            () => this.fwd.current.click()
            //this.getUserInfo()}
          } //
          saveAuth={(x, hasPermission) => {
            this.setState(
              { storableAuth: [x, true, hasPermission] },
              () => {}
              // setTimeout(() => this.pa.current.click(), 200)
            );
          }}
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
                  this.pa.current.click({}, true);
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.setState({ resetAuth: true }, () =>
                this.fwd.current.click()
              );
              // this.getUserInfo();
            }
          }}
          loadingHeight={loadingHeight}
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
          clearProfile={this.props.clearProfile}
        />
      </div>
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
      //{ collection: "budget", name: "myBudget" },
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
              standardCatch
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
              standardCatch
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
            standardCatch
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
            standardCatch
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
            "budget"
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
            standardCatch
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
              standardCatch
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
          standardCatch
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
          standardCatch
        );

        return this.setState({
          [y.name]: titles
        });
      }
    });
 */
