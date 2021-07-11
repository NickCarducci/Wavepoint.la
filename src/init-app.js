import React from "react";
import firebase from "./init-firebase";
import { functions, functionRefs } from "./jail";
import { SDB, DODB } from "./widgets/authdb";
import { suggestions } from "./widgets/arraystrings";
import Auth from "./auth";
import { Helmet } from "react-helmet";

const signOut = () =>
  (window.location.href =
    "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=https://wavepoint.la");

const handlePinch = (e) => {
  var tSX /*touchScreenX*/,
    tSY /**touchScreenY */,
    dS /*disableScroll*/,
    sB = {}; //scrollBounds
  const tT = e.targetTouches;
  //e=>handlePinch.eitherFunc(e,document.body)
  return {
    touchstart: (e, dB) => {
      //scroll/client
      const tTt = tT[0].target; //touchTarget
      // a boolean map indicating if the e (or either of e parents, excluding the dB) can be scrolled to the X direction.

      const bDs = (
        //bounDs, (non)iteratedConditional
        e,
        cC //callbackConditional
      ) => (e === dB ? false : cC(e) ? true : bDs(e.parentNode, cC));

      const sw = e.scrollWidth;
      const sh = e.scrollHeight;
      const cw = e.clientWidth;
      const ch = e.clientHeight;
      const st = e.scrollTop;
      const sl = e.scrollLeft;
      sB.left = bDs(tTt, (e) => sl > 0);
      sB.top = bDs(tTt, (e) => st > 0);
      sB.right = bDs(tTt, (e) => sw > cw && sw - cw > sl);
      sB.bottom = bDs(tTt, (e) => sh > ch && sh - ch > st);

      tSX = tTt.screenX; //touchScreenX
      tSY = tTt.screenY; //touchScreenY
      dS = false; //disableScroll
    },
    touchmove: (e) => {
      //move/screen
      const tT = e.targetTouches[0];
      const mSX = tT[0].screenX; //moveScreenX
      const mSY = tT[0].screenY; //moveScreenY
      if (dS) return e.preventDefault(); //disableScroll
      if (
        //tight pinch pinching tighten tightening
        mSX < tSX && //moveScreenX < touchScreenX
        sB.left && //scrollBounds
        mSY > tSY && //moveScreenY > touchScreenY
        sB.bottom && //scrollBounds
        mSX > tSX && //moveScreenX > touchScreenY
        sB.right && //scrollBounds
        mSY < tSY && //moveScreenY < touchScreenX
        sB.top //scrollBounds
      ) {
        // disableScroll.
        e.preventDefault();
        dS = true;
      }
    }
  };
};
class WakeSnapshot extends React.Component {
  freshen = (call) => {
    //var idx = null;
    var name = null;
    const thisFunc = functionRefs.find((x, i) => {
      //idx = i;
      name = call.constructor === String ? call : String(call);
      return x.id === name;
    });
    if (thisFunc) window.confirm("start " + name) && thisFunc.Refresh(); //functions[idx].refresh()
  };
  flush = () =>
    functions.forEach((animal) => {
      animal.Refresh();
    });

  render() {
    const { loadingHeight, isProfile } = this.props;
    const goingSnapshots = functions && functions.constructor === Array;
    const atLeastOne =
      goingSnapshots &&
      functions.find((x) => x.aliveFor > 0 && x.aliveFor < 1200000);
    return (
      <div
        style={{
          fontSize: atLeastOne ? "" : "0px",
          height: atLeastOne ? loadingHeight : "0%",
          width: "100%",
          textAlign: "center",
          alignItems: "center",
          flexDirection: "column",
          overflowWrap: "break-word",
          zIndex: "10",
          display: "flex",
          position: isProfile ? "fixed" : "relative",
          transition: ".3s ease-in"
        }}
      >
        are you still there?
        <div
          onClick={this.flush}
          style={{
            fontSize: atLeastOne ? "" : "0px",
            border: `${atLeastOne ? 3 : 0}px green solid`,
            borderRadius: atLeastOne ? "9px" : "0px",
            padding: atLeastOne ? "4px 10px" : "0px 0px",
            marginTop: atLeastOne ? "3px" : "0px",
            transition: ".3s ease-in"
          }}
        >
          YES
        </div>
        <br />
        Ongoing Processes
        <br />
        {goingSnapshots &&
          functions.map((func) => (
            <div
              key={func.id}
              onClick={() => {
                //flush(stringCall), Jail(call) again or
                this.freshen(func);
              }}
              style={{
                opacity:
                  func.aliveFor > 0 && func.aliveFor < 1200000
                    ? func.aliveFor / 2400000
                    : 1
              }}
            >
              {func}&nbsp;-&nbsp;{func.aliveFor}
            </div>
          ))}
      </div>
    );
  }
}
class InitApp extends React.Component {
  constructor(props) {
    super(props);
    let sdb = new SDB();
    let dodb = new DODB();
    var item = suggestions[Math.floor(Math.random() * suggestions.length)];
    const city = item.place_name;
    this.state = {
      //profile: {},
      displayPreferences: { backgroundColor: [255, 255, 255] },
      item,
      city,
      commtype: "new",
      forumOpen: false,
      onMapEntities: [],
      chosenPlace: "glad ur here!",
      forumDoc: [],
      msg: "",
      recordedUsers: [],
      sdb,
      dodb,
      lastNotes: [],
      filesPreparedToSend: [],
      stripeKey: "pk_test_O3ea7BxFONiG5rAzTdEer2mA00scCjg6i4", //process.env.STRIPE_KEY

      budget: [],
      forumPosts: [],
      ordinances: [],
      elections: [],
      cases: [],
      classes: [],
      departments: [],
      jobs: [],
      clubs: [],
      events: [],
      together: [],
      shops: [],
      restaurants: [],
      services: [],
      housing: [],
      pages: [],
      tileChosen: "event",
      forumPostsThrottled: [],
      profilePostsSorted: [],
      profilePosts: [],
      entityPosts: [],
      postsOfComments: [],
      videos: []
    };
    //var bucket = "gs://thumbprint-1c31n.appspot.com";
    var storage = firebase.storage(); //firebase.app().storage(bucket);
    this.storageRef = storage.ref();
    this.loginButton = React.createRef();
  }

  componentDidUpdate = () => {
    const {
      isProfile,
      lastisProfile,
      profilePosts,
      lastprofilePosts,
      entityPosts,
      lastEntityPosts,
      forumPosts,
      lastForumPosts
    } = this.state;

    if (isProfile !== lastisProfile)
      this.setState({
        forumOpen: isProfile,
        lastisProfile: isProfile
      });

    if (entityPosts !== lastEntityPosts)
      this.setState({
        lastEntityPosts: entityPosts,
        entityPosts: entityPosts.sort(
          (a, b) =>
            (b.date ? b.date : b.time).seconds -
            (a.date ? a.date : a.time).seconds
        )
      });

    if (forumPosts !== lastForumPosts)
      this.setState({
        lastForumPosts: forumPosts,
        forumPostsThrottled: forumPosts.sort(
          (a, b) =>
            (b.date ? b.date : b.time).seconds -
            (a.date ? a.date : a.time).seconds
        )
      });

    if (profilePosts !== lastprofilePosts)
      this.setState(
        {
          lastprofilePosts: profilePosts
        },
        () => {
          clearTimeout(this.cP); //cancelProfile
          this.cP = setTimeout(() => {
            let set = {};
            let profilePostsUnsorted = [];
            profilePosts.map((foo) =>
              !set[foo.collection + foo.id]
                ? (set[foo.collection + foo.id] = [foo])
                : set[foo.collection + foo.id].push(foo)
            );
            Object.values(set).map((posts) => {
              var top = posts.sort((a, b) => b.isOfComment - !a.isOfComment);
              return profilePostsUnsorted.push(top[0]);
            });
            var profilePostsSorted = profilePostsUnsorted.sort(
              (a, b) =>
                (b.date ? b.date : b.time).seconds -
                (a.date ? a.date : a.time).seconds
            );
            clearTimeout(this.coP); //continueProfile
            this.coP = setTimeout(() => {
              if (profilePostsSorted.length === profilePostsUnsorted.length)
                this.setState(
                  {
                    profilePostsSorted,
                    lastProfilePosts: profilePostsSorted //to revisit profile
                  },
                  () => this.unloadGreenBlue()
                );
            }, 200);
          }, 200);
        }
      );
  };
  getVideos = async (pathReference) => {
    this.loadGreenBlue("getting videos");
    var listRef = this.storageRef.child(pathReference);
    await listRef
      .listAll()
      .then((res) => {
        let videos = [];
        let p = 0;
        //res._delegate.prefixes.forEach((folderRef) => folderRef.listAll());
        res._delegate.items.forEach(async (reference) => {
          p++;
          var ref = this.storageRef.child(reference._location.path_);
          await ref
            .getMetadata()
            .then(async (metadata) => {
              var gsUrl = await ref.getDownloadURL();
              var foo = { ...reference, ...metadata, gsUrl, ref };
              videos.push(foo);
            })
            .catch((error) => {
              console.log(error);
            });
        });
        if (res._delegate.items.length === p) {
          console.log(videos.length + " videos downloaded ");
          this.unloadGreenBlue();
          this.setState({ videos });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };

  spotifyCallback = (x) => {
    console.log(x);
    this.setState({ spotifyAccessToken: x.code });
  };
  mountApiKeys = async () => {
    const key = await this.state.sdb.readKey();
    this.setState({ scopecode: key });
    const displayPreferences = await this.state.dodb.readPreferences();
    displayPreferences &&
      displayPreferences.length > 0 &&
      this.setState({ displayPreferences });
    const pathname = window.location.pathname;
    const d = pathname.split("https://wavepoint.la/oauth2callback?code=4/")[1];
    var error = pathname.split("https://wavepoint.la/callback#code=")[1];
    if (error) console.log(error);
    if (d) console.log(d);
    if (d) this.setState({ twitchUserAccessToken: d });
    const dx = pathname.split("https://wavepoint.la/spotifyCallback?code=")[1];
    var errorx = pathname.split(
      "https://wavepoint.la/spotifyCallback#error=4/"
    )[1];
    if (errorx) console.log(error);
    if (dx) console.log(d);
    if (dx) this.setState({ spotifyAccessToken: dx });
    if (dx)
      await fetch("https://accounts.spotify.com/token", {
        Authorization: `Basic a28add4bf14e40b69dd95c6b696c85b8:0839e542509f46a9b26eac3fd2fae04c`,
        body: {
          code: dx,
          grant_type: "authorization_code",
          redirect_uri: "https://wavepoint.la"
        }
      })
        .then(async (res) => await res.json())
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err.message));
  };
  handlePinchStart = (x) => handlePinch(x).touchstart(x, document.body);
  handlePinchMove = (x) => handlePinch(x).touchmove(x, document.body);
  componentWillUnmount = () => {
    window.removeEventListener("touchstart", this.handlePinchStart);
    window.removeEventListener("touchmove", this.handlePinchMove);
  };
  componentDidMount = async () => {
    this.mountApiKeys();

    //handlePinch
    window.addEventListener("touchstart", this.handlePinchStart);
    window.addEventListener("touchmove", this.handlePinchMove);
    /**
       * 
        data.photoThumbnail = data.photoThumbnail
          ? data.photoThumbnail
          : "https://www.dl.dropboxusercontent.com/s/wef09yq3mgu8eif/profile1%20%281%29.png?dl=0";
        data.profilergb = data.profilergb
          ? data.profilergb
          : "#" + (((1 << 24) * Math.random()) | 0).toString(16);
      */

    //this.loadGoogleApi();//google drive start
    /*await this.state.vdb.getAllNotes().then((prenotes) => {
      let videos = Object.values(prenotes);

      videos.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.setState({
        videos
      });
    });*/
    this.setState({ stop: true, loaded: true });
  };

  loadGreenBlue = (msg) => {
    if (!this.cLTW)
      //cancelLoadingTimeWarning
      this.cLTW = setTimeout(
        () => this.setState({ loadingForAWhile: true }),
        8800
      );
    msg !== this.state.msg && this.setState({ msg });
  };
  unloadGreenBlue = () =>
    this.setState({ msg: "", loadingForAWhile: false }, () =>
      clearTimeout(this.cLTW)
    );

  render() {
    const {
      ordinances,
      budget,
      cases,
      elections,
      oldBudget,
      oldCases,
      oldElections,
      isProfile,
      isEntity,
      tileChosen,
      commtype,
      profilePostsSorted,
      entityPosts,
      departments,
      classes,
      forumPostsThrottled,
      together,
      clubs,
      shops,
      restaurants,
      services,
      pages,
      venues,
      jobs,
      housing,
      profile,
      city,
      msg,
      community,
      loadingForAWhile,
      profilePosts
    } = this.state;
    const { showPWAprompt, appHeight, width } = this.props;
    /*const instanceLocator = "v1:us1:5f5bd833-ed4f-483a-95ea-b8622c401a3d";
    const tokenProvider = new TokenProvider({
      url:
        "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/5f5bd833-ed4f-483a-95ea-b8622c401a3d/token"
    });

    if (this.state.this.props.auth && this.state.this.props.auth.uid) {
      return (
        <ChatkitProvider
          instanceLocator={instanceLocator}
          tokenProvider={tokenProvider}
          userId={
            this.state.loaded && this.state.this.props.auth.uid
              ?this.props.auth.uid
              : null
          }
        >
          <App
            this.props.auth={this.state.this.props.auth}
            user={this.state.user}
            loaded={this.state.loaded}
          />
        </ChatkitProvider>
      );
    } else {*/

    /*var colors = [
      { sharp: 0.0, color: { r: 0, g: 0, b: 200 } },
      { sharp: 0.5, color: { r: 0, g: 0, b: 150 } },
      { sharp: 1.0, color: { r: 0, g: 0, b: 100 } }
    ];
    var perc2color = (sharp) => {
      for (var i = 1; i < colors.length - 1; i++) {
        if (sharp < colors[i].sharp) {
          break;
        }
      }
      var pallette = colors[i].sharp - colors[i - 1].sharp;
      var sharpRight = (sharp - colors[i - 1].sharp) / pallette;
      var sharpLeft = 1 - sharpRight;
      var output =
        "rgb(" +
        [
          Math.floor(
            colors[i - 1].color.r * sharpLeft + colors[i].color.r * sharpRight
          ),
          Math.floor(
            colors[i - 1].color.g * sharpLeft + colors[i].color.g * sharpRight
          ),
          Math.floor(
            colors[i - 1].color.b * sharpLeft + colors[i].color.b * sharpRight
          )
        ].join(",") +
        ")";
      return output;
    };*/
    if (this.state.loaded) {
      var gotComments = this.state.msg.startsWith("getting posts");
      var gotEntities = this.state.msg.startsWith("getting comments");

      var forumPosts = isProfile //&& !isProfile.includes(" ") && !isProfile.match(/[^\w\s]+/)
        ? profilePostsSorted
        : isEntity
        ? entityPosts
        : commtype === "budget & proposal"
        ? budget
        : commtype === "election"
        ? elections
        : commtype === "court case"
        ? cases
        : commtype === "department"
        ? departments
        : commtype === "classes"
        ? classes
        : commtype === "ordinance"
        ? ordinances
        : forumPostsThrottled;
      var onMapEntities =
        tileChosen === "event"
          ? together
          : tileChosen === "club"
          ? clubs
          : tileChosen === "shop"
          ? shops
          : tileChosen === "restaurant"
          ? restaurants
          : tileChosen === "service"
          ? services
          : tileChosen === "page"
          ? pages
          : tileChosen === "venue"
          ? venues
          : tileChosen === "job"
          ? jobs
          : tileChosen === "housing"
          ? housing
          : together;
      const containerStyle = {
        width: "100%",
        // transition: ".3s ease-in",
        position: "relative",
        minHeight: appHeight
      };
      const loadingHeight = `calc(100% - ${
        !this.state.forumOpen || isProfile ? "0px" : "56px"
      })`;
      return (
        <div
          style={{
            ...containerStyle
          }}
        >
          <Helmet>
            <title>{`${
              this.state.forumOpen || isProfile
                ? forumPosts
                  ? forumPosts.length
                  : ""
                : onMapEntities
                ? onMapEntities.length
                : ""
            } ${
              isEntity
                ? isEntity
                : isProfile
                ? profile.name + "@" + this.state.profile.username
                : community
                ? community.message
                : city
            }`}</title>
          </Helmet>
          <WakeSnapshot loadingHeight={loadingHeight} isProfile={isProfile} />
          <div
            className="loadGreenBlue"
            style={{
              textAlign: "center",
              alignItems: "center",
              flexDirection: "column",
              overflowWrap: "break-word",
              zIndex: "10",
              display: "flex",
              position: isProfile ? "fixed" : "relative",
              justifyContent: "center",
              height: this.state.msg !== "" ? loadingHeight : "0%",
              width: "100%",
              transition: `${this.state.msg !== "" ? 1 : 0.3}s ease-in`,
              transform: this.state.msg === "" ? "scale(1,-1)" : "scale(1,1)",
              color: "white",
              fontSize: "24px"
            }}
          >
            <div
              onClick={() => this.unloadGreenBlue()}
              style={{
                display: msg !== "" ? "flex" : "none",
                position: "absolute",
                right: "10px",
                top: "20px",
                color: "white",
                transition: ".3s ease-in",
                opacity: loadingForAWhile ? 1 : 0,
                zIndex: loadingForAWhile ? 1 : -9999
              }}
            >
              quit
            </div>
            {this.state.msg !== "" && isProfile && (
              <div
                style={{
                  display: "flex",
                  opacity: ".5",
                  fontSize: gotEntities || gotComments ? "" : "0px"
                }}
              >
                entities
                <div
                  style={{
                    transition: ".3s ease-in",
                    transform: "rotate(45deg)",
                    borderRight: "5px solid",
                    borderBottom: "5px solid",
                    height: gotEntities || gotComments ? "20px" : "0px",
                    width: gotEntities || gotComments ? "10px" : "0px"
                  }}
                />
              </div>
            )}
            {this.state.msg !== "" && isProfile && (
              <div
                style={{
                  display: "flex",
                  opacity: ".5",
                  fontSize: gotComments ? "" : "0px"
                }}
              >
                comments
                <div
                  style={{
                    transition: ".3s ease-in",
                    transform: "rotate(45deg)",
                    borderRight: "5px solid",
                    borderBottom: "5px solid",
                    height: gotComments ? "20px" : "0px",
                    width: gotComments ? "10px" : "0px"
                  }}
                />
              </div>
            )}

            {this.state.msg}
          </div>
          <div
            style={{
              overflow: "hidden",
              backgroundColor: "white",
              overflowWrap: "break-word",
              zIndex: "10",
              display: "flex",
              position: "relative",
              alignItems: "center",
              justifyContent: "flex-end",
              height: showPWAprompt ? "56px" : "0px",
              width: "100%",
              transition: `${showPWAprompt ? 1 : 0.3}s ease-in`,
              color: "black"
            }}
          >
            <div
              onClick={this.props.closeWebAppPrompt}
              style={{
                fontSize: "24px",
                margin: "0px 10px",
                padding: "6px 10px",
                backgroundColor: "rgb(150,180,255)",
                color: "white"
              }}
            >
              &times;
            </div>
            add to homescreen
            <div
              style={{
                fontSize: "24px",
                margin: "0px 10px",
                padding: "6px 10px",
                backgroundColor: "blue",
                color: "white"
              }}
              onClick={this.props.addToHomescreen}
            >
              add
            </div>
          </div>
          <Auth
            unmountFirebase={this.props.unmountFirebase}
            containerStyle={containerStyle}
            appHeight={appHeight}
            width={width}
            apple={this.props.apple}
            history={this.props.history}
            location={this.props.location}
            statePathname={this.props.statePathname}
            displayPreferences={this.state.displayPreferences}
            setDisplayPreferences={async (displayPreferences) =>
              await this.state.dodb["setPreferences"]({
                _id: "preferences",
                ...displayPreferences
              })
            }
            isPost={this.props.isPost}
            isCommunity={this.props.isCommunity}
            isProfile={isProfile}
            isEntity={isEntity}
            profile={this.state.profile}
            lastProfilePosts={this.state.lastProfilePosts}
            entityPosts={this.state.entityPosts}
            pathname={this.props.pathname}
            setIndex={(pathname) => this.setState(pathname)}
            setPath={() =>
              this.setState({ pathname: window.location.pathname })
            }
            city={this.state.city}
            community={this.state.community}
            setCommtype={async (x) => {
              this.setState(x);
              return await new Promise((resolve) => resolve(true));
            }}
            setCommunity={(x) => {
              //{community:x}
              if (x.community) console.log(x.community.message + " stored");
              this.setState(x);
            }}
            forumOpen={this.state.forumOpen}
            chosenPlace={this.state.chosenPlace}
            setPlace={(x) => this.setState(x)}
            onMapEntities={this.state.onMapEntities}
            storageRef={this.storageRef}
            getVideos={this.getVideos}
            stripeKey={this.state.stripeKey}
            videos={this.state.videos}
            setGoogleLoginRef={this.loginButton}
            spotifyAccessToken={this.state.spotifyAccessToken}
            deleteScopeCode={() => this.state.sdb.deleteKeys()}
            setScopeCode={(scopecode) => this.setScopeCode(scopecode, "setKey")}
            accessToken={this.state.accessToken}
            twitchUserAccessToken={this.state.twitchUserAccessToken}
            loaded={this.state.loaded}
            //
            filePreparedToSend={this.state.filesPreparedToSend}
            picker={this.picker}
            picker1={this.picker1}
            picker2={this.picker2}
            loadGapiApi={
              () => {}
              //this.loadGapiApi
            }
            signedIn={this.state.signedIn}
            switchAccount={this.switchAccount}
            signOut={signOut}
            //
            clearFilePreparedToSend={() =>
              this.setState({ filesPreparedToSend: [] })
            }
            loadYoutubeApi={this.loadYoutubeApi}
            s={this.s}
            authResult={this.state.authResult}
            googlepicker={this.googlepicker}
            dodb={this.state.dodb}
            loadGreenBlue={this.loadGreenBlue}
            unloadGreenBlue={this.unloadGreenBlue}
            //
            profilePosts={this.state.profilePostsSorted}
            setForumDocs={(x) => {
              if (
                0 === x.completeProfileSet &&
                this.state.profilePosts !== []
              ) {
                this.setState({ profilePosts: [] });
              }
              x && this.setState(x);
            }}
            forumPosts={forumPosts}
            ordinances={ordinances}
            budget={budget}
            cases={cases}
            elections={elections}
            oldBudget={oldBudget}
            oldCases={oldCases}
            oldElections={oldElections}
            //
            departments={this.state.departments}
            classes={this.state.classes}
            oldClasses={this.state.oldClasses}
            together={this.state.together}
            clubs={this.state.clubs}
            jobs={this.state.jobs}
            venues={this.state.venues}
            services={this.state.services}
            restaurants={this.state.restaurants}
            shops={this.state.shops}
            pages={this.state.pages}
            housing={this.state.housing}
            //
            commtype={this.state.commtype}
            tileChosen={this.state.tileChosen}
            item={this.state.item}
            loadingMessage={this.state.msg} //loadingMessage
            //
            addProfilePost={(foo) => {
              // swipe comments/posts sorted in profile component
              this.setState({
                profilePosts: [...this.state.profilePosts, foo]
              });
            }}
            clearProfile={(comments) => {
              if (comments) {
                this.setState({
                  profilePosts: profilePosts.filter((x) => !x.isOfComment)
                });
              } else {
                this.setState({
                  profilePosts: profilePosts.filter((x) => x.isOfComment)
                });
              }
            }}
          />
        </div>
      );
    } else return <div />;
  }
}
export default InitApp;
