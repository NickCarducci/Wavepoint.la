import React from "react";
import Foundation from "./foundation";
import { specialFormatting, uriParser } from "./widgets/authdb";

class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openWhen: "new",
      issues: []
    };
    this.justthisonce = null;
  }
  componentDidMount = () => {
    const { pathname } = this.props;
    this.checkPathname(pathname);
  };
  componentDidUpdate = async (prevProps) => {
    const { pathname } = this.props;
    if (pathname !== prevProps.pathname) {
      this.checkPathname(pathname);
      console.log("••• " + pathname);
    }
  };
  checkPathname = async (pathname) => {
    this.props.chosenPost && this.props.helper();
    const entity = (foundIt, id) => {
      console.log(foundIt + " " + id);
      this.props.setIndex({
        isEntity: id
      });
      showPage().entity();
    };
    const user = (isProfile, id) => {
      //this.props.loadGreenBlue("getting profile of " + id);
      this.props.setIndex({
        isProfile: true,
        profile: isProfile
      });
      if (
        !this.props.profile ||
        this.props.profile.username !== id ||
        [] !== this.props.lastProfilePosts
      ) {
        console.log(isProfile.username + " profile");

        this.props.loadGreenBlue("getting entities by " + isProfile.username);
        this.props.getProfileEntities(isProfile);
      } else {
        console.log(isProfile.username + " again");
        this.props.setForumDocs({
          forumOpen: true,
          profilePosts: this.props.lastProfilePosts
        });
      }
    };
    const drop = (forumDoc, id) => {
      console.log(forumDoc + " " + id);
      this.setState(
        {
          dropToCheck: id
        },
        () =>
          this.props.setIndex({
            isPost: id
          })
      );
    };
    const entities = [
      "event",
      "club",
      "shop",
      "restaurant",
      "service",
      "departments",
      "class",
      "oldClass",
      "job",
      "housing",
      "page",
      "venue"
    ];
    const drops = [
      "forum",
      "oldElection",
      "elections",
      "case",
      "oldCase",
      "budget",
      "oldBudget",
      "ordinance"
    ];
    const discoverCreateOrPersonalPages = [
      //DISCOVER CREATE ENTITY
      "/newevent",
      "/newclub",
      "/newshop",
      "/newrestaurant",
      "/newservice",
      "/newjob",
      "/newhousing",
      "/newpage",
      "/newvenue",
      "/newplan",
      "/doc",
      //DISCOVER GLOBAL FORUMS
      "/events/edmtrain/",
      "/calendar", //calendar
      "/forums",
      "/oldElections",
      "/elections",
      "/cases",
      "/oldCases",
      "/budgets",
      "/oldBudgets",
      "/ordinances",
      //DISCOVER GLOBAL ENTITIES
      "/events",
      "/jobs",
      "/clubs",
      "/shops",
      "/restaurants",
      "/services",
      "/departments",
      "/classes",
      "/oldClasses",
      "/housing",
      "/pages",
      "/venues",
      //personal pages
      "/plan",
      "/sd/",
      "/bk/",
      "/invites",
      "/plans/",
      "/login"
    ];
    const showPage = () => {
      return {
        communityOrCity: async (id) => {
          id = specialFormatting(id).replace(/_/g, " ");
          var resComm = await this.props.getCommunityByName(id);
          if (resComm.constructor === Object) {
            if (Object.keys(resComm).length !== 0) {
              console.log("community " + id);
              this.props.setIndex({
                community: resComm,
                isCommunity: id
              });
            } else {
              const letterEntered = /^[\W\D]/;
              if (letterEntered.test(id) && id.includes(",")) {
                console.log("with commas, probably city " + id);
                if (this.state.newCityToQuery === id) {
                  this.props.unloadGreenBlue();
                } else
                  this.setState({
                    newCityToQuery: id
                  });
              } else {
                window.alert(
                  "pathname " +
                    id +
                    " not recognized. (1) City  requires comma, " +
                    "(2) descriptive, community, user has not taken this name"
                );
                this.props.history.push("/");
              }
            }
          }
        },
        entity: async () => {
          var p = pathname.split("/");
          var chosenEntity = false;
          if (p.length > 2) {
            //[collection,name,community]
            const pos = [p[1], p[2], p[3].replace(/_/g, " ")];
            chosenEntity = await this.props.hydrateEntityFromName(...pos);
            if (chosenEntity) {
              var collection = [
                "housing",
                "oldClasses",
                "classes",
                "restaurants",
                "departments",
                "services",
                "shops",
                "pages",
                "venues",
                "jobs",
                "clubs"
              ].find((x) => x.includes(p[1]));
              var id = p.split(collection)[1];
              this.setState({ chosenEntity }, () =>
                this.props.getPostsAs(chosenEntity)
              );
            }
          } else {
            //[id,collection]
            chosenEntity = await this.props.hydrateEntity(id, collection);
            if (chosenEntity) {
              this.setState({ chosenEntity }, () =>
                this.props.getPostsAs(chosenEntity)
              );
            }
          }
        }
      };
    };
    if (this.state.pathAliasDiffCity && !this.justthisonce) {
      console.log(window.location.pathname);
      this.justthisonce = true;
    } else {
      this.setState({ pathAliasDiffCity: null }, async () => {
        this.props.setIndex({
          community: null,
          isProfile: null,
          isEntity: null,
          isPost: null,
          isCommunity: null
        });
        this.justthisonce = false;
        var isHome = pathname === "/";
        if (!isHome) {
          var discoverCreateOrPersonalPage = discoverCreateOrPersonalPages.find(
            (x) => pathname.includes(x.toLowerCase())
          );
          if (!discoverCreateOrPersonalPage) {
            this.props.loadGreenBlue("parsing " + pathname);
            var path = uriParser(pathname);
            if (path !== pathname) {
              console.log(path);
              return this.sustainPath(path, true);
            }
            var id = path.split("/")[1];
            ///[a-zA-Z0-9-]/g.test(profileUsername)
            //var noPunc =
            //!profileUsername.includes(" ") && !profileUsername.match(/[^\w\s]+/);

            var isPostEntityCommunityOrUser = /[a-zA-Z0-9_]/g.test(id);
            if (isPostEntityCommunityOrUser) {
              var isProfile =
                id && (await this.props.hydrateUserFromUserName(id));

              if (isProfile && isProfile.constructor === Object) {
                if (Object.keys(isProfile).length !== 0) {
                  user(isProfile, id);
                } else {
                  var forumDoc = drops.find((x) =>
                    id.toLowerCase().startsWith(x)
                  );
                  if (forumDoc) {
                    drop(forumDoc, id);
                  } else {
                    var foundIt = entities.find((x) =>
                      id.toLowerCase().startsWith(x)
                    );
                    if (foundIt) {
                      //entities work as signular or plural startWiths
                      entity(); //extra path in entity func means
                      //within a city/comm, named
                    } else {
                      //if no entity prefix, checks if comm/city
                      showPage().communityOrCity(id);
                    }
                  }
                }
              }
            } else {
              const remainder = id.replace(/[ +-_]+/g, " ");
              window.alert(remainder + " is not recognized");
              this.setState(
                {
                  dropToCheck: null
                },
                () => {
                  this.sustainPath("/", true);
                  this.props.setIndex({
                    community: null,
                    isProfile: null,
                    isPost: null,
                    isEntity: null,
                    isCommunity: null
                  });
                }
              );
            }
          } else {
            console.log(
              "discoverCreateOrPersonalPage " +
                discoverCreateOrPersonalPage +
                " handled by Router"
            );
            this.setState(
              {
                dropToCheck: null
              },
              () =>
                this.props.setIndex({
                  community: null,
                  isProfile: null,
                  isPost: null,
                  isEntity: null,
                  isCommunity: null
                })
            );
          }
        } else {
          console.log("no path, suggested city " + this.props.item.place_name);
          this.setState(
            {
              dropToCheck: null
            },
            () => {
              this.sustainPath("/", true);
              this.props.setIndex({
                community: null,
                isProfile: null,
                isPost: null,
                isEntity: null,
                isCommunity: null
              });
            }
          );
        }
      });
    }
  };

  sustainPath = (city, once) => {
    if (this.justthisonce) {
      this.setState(
        {
          pathAliasDiffCity: false
        },
        () => (this.justthisonce = null)
      );
    }
    clearTimeout(this.susPath);
    this.susPath = setTimeout(() => {
      this.setState(
        {
          pathAliasDiffCity: once ? city : this.state.pathAliasDiffCity
        },
        () => this.props.history.push(city.replace(/[ +-]+/g, "_"))
      );
    }, 200);
  };
  render() {
    const {
      user,
      auth,
      width,
      showChatsOnce,
      containerStyle,
      appHeight,
      ordinances,
      budget,
      cases,
      elections,
      oldBudget,
      oldCases,
      oldElections,
      notes,
      city,
      profileEntities,
      lastComments,
      undoComments,
      lastPostOfComment,
      undoPostOfComment,
      groupLast,
      groupUndo,
      lastPosts,
      lastPost,
      undoPosts,
      undoPost,
      //
      lastGlobalPost,
      undoGlobalPost,
      lastGlobalForum,
      undoGlobalForum,
      //
      lastCityPost,
      undoCityPost,
      lastCityForum,
      undoCityForum,
      //
      lastCommForum,
      undoCommForum,
      fetchCommEvents,
      fetchEvents,
      timeFilterEvents,
      timeFilterJobs,
      range,
      queriedDate,
      cityapisLoaded,
      edmStore,
      cityapi,
      stateapi,
      getGlobalForum,
      onDelete,
      handleSave,
      setData,
      loadingMessage,
      //
      current,
      current1,
      commtype,
      item
    } = this.props;
    const { keyBoxes, issues, openWhen } = this.state;
    var last = false;
    var undo = false;
    var lastOld = false;
    var undoOld = false;
    if (["new", "lesson", "show", "game"].includes(commtype)) {
      last = "lastCommPost";
      undo = "undoCommPost";
    } else if (commtype === "ordinances") {
      last = "lastCommOrd";
      undo = "undoCommOrd";
    } else if (commtype === "departments") {
      last = "lastCommDept";
      undo = "undoCommDept";
    } else if (commtype === "budget") {
      last = "lastBudget";
      undo = "undoBudget";
      lastOld = "lastOldBudget";
      undoOld = "undoOldBudget";
    } else if (commtype === "elections") {
      last = "lastElections";
      undo = "undoElections";
      lastOld = "lastOldElections";
      undoOld = "undoOldElections";
    } else if (commtype === "cases") {
      last = "lastCases";
      undo = "undoCases";
      lastOld = "lastOldCases";
      undoOld = "undoOldCases";
    } else if (commtype === "classes") {
      last = "lastClasses";
      undo = "undoClasses";
      lastOld = "lastOldClasses";
      undoOld = "undoOldClasses";
    } else if (commtype === "forms & permits") {
      last = "lastCommForm";
      undo = "undoCommForm";
    }
    return !item ? null : (
      <Foundation
      setAuth={this.props.setAuth}
        profilePosts={this.props.profilePosts}
        getRoomKeys={this.props.getRoomKeys}
        setToUser={this.props.setToUser}
        standbyMode={null}
        width={width}
        setFolder={(folder) => this.setState(folder)}
        containerStyle={containerStyle}
        appHeight={appHeight}
        apple={this.props.apple}
        resetPathAlias={() =>
          this.setState(
            { pathAliasDiffCity: null },
            () => (this.justthisonce = false)
          )
        }
        location={this.props.location}
        statePathname={this.props.statePathname}
        sustainPath={this.sustainPath}
        setIndex={this.props.setIndex}
        displayPreferences={this.props.displayPreferences}
        setDisplayPreferences={this.props.setDisplayPreferences}
        allowDeviceToRead={() => {}}
        manuallyDeleteKeyBox={() => {}}
        isPost={this.props.isPost}
        isCommunity={this.props.isCommunity}
        isProfile={this.props.isProfile}
        isEntity={this.props.isEntity}
        keyBoxes={keyBoxes}
        dropToCheck={this.state.dropToCheck}
        newCityToQuery={this.state.newCityToQuery}
        chosenEntity={this.state.chosenEntity}
        forumPosts={this.props.forumPosts}
        setForumDocs={this.props.setForumDocs}
        checkPathname={this.checkPathname}
        pathname={this.props.pathname}
        postHeight={this.props.postHeight}
        chosenPostId={this.props.chosenPostId}
        community={this.props.community}
        ordinances={ordinances}
        budget={budget}
        cases={cases}
        elections={elections}
        oldBudget={oldBudget}
        oldCases={oldCases}
        oldElections={oldElections}
        //
        commtype={this.props.commtype}
        tileChosen={this.props.tileChosen}
        //
        departments={this.props.departments}
        classes={this.props.classes}
        oldClasses={this.props.oldClasses}
        events={this.props.events}
        clubs={this.props.clubs}
        jobs={this.props.jobs}
        venues={this.props.venues}
        services={this.props.services}
        restaurants={this.props.restaurants}
        shops={this.props.shops}
        pages={this.props.pages}
        housing={this.props.housing}
        setCommunity={this.props.setCommunity}
        forumOpen={this.props.forumOpen}
        following={this.props.following}
        getProfile={this.props.getProfile}
        openOptions={this.props.openOptions}
        openEntity={this.props.openEntity}
        chooseCity={this.props.chooseCity}
        dropCityIssues={this.props.dropCityIssues}
        profile={this.props.profile}
        issues={issues}
        notes={notes}
        openWhen={openWhen}
        item={item}
        city={city}
        setCommtype={this.props.setCommtype}
        //
        favoriteCities={this.props.favoriteCities}
        parents={this.props.parents}
        storageRef={this.props.storageRef}
        meAuth={this.props.meAuth}
        logoutofapp={this.props.logoutofapp}
        saveAuth={this.props.saveAuth}
        getUserInfo={this.props.getUserInfo}
        //
        myDocs={this.props.myDocs}
        moreDocs={this.props.moreDocs}
        againBackDocs={this.props.againBackDocs}
        tickets={this.props.tickets}
        myCommunities={this.props.myCommunities}
        profileEntities={profileEntities}
        auth={this.props.auth}
        user={this.props.user}
        //
        iAmCandidate={this.props.iAmCandidate}
        iAmJudge={this.props.iAmJudge}
        iAmRepresentative={this.props.iAmRepresentative}
        followingMe={this.props.followingMe}
        //
        getFolders={this.props.getFolders}
        getVideos={this.props.getVideos}
        folders={this.props.folders}
        videos={this.props.videos}
        oktoshowchats={this.props.oktoshowchats}
        showChatsOnce={showChatsOnce}
        //

        stripeKey={this.props.stripeKey}
        setGoogleLoginRef={this.props.loginButton}
        spotifyAccessToken={this.props.spotifyAccessToken}
        deleteScopeCode={this.props.deleteScopeCode}
        setScopeCode={this.props.setScopeCode}
        accessToken={this.props.accessToken}
        twitchUserAccessToken={this.props.twitchUserAccessToken}
        communities={this.props.communities}
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
        comments={this.props.comments}
        postMessage={this.props.postMessage}
        chosenPost={this.props.chosenPost}
        helper={this.props.helper} //promise
        parent={this.state.parent}
        getDrop={this.props.getf}
        findPost={this.props.findPost}
        dropId={this.props.dropId}
        chats={this.props.chats}
        invites={this.props.invites}
        selfvites={this.props.selfvites}
        fetchForum={this.props.fetchForum}
        fetchCommForum={this.props.fetchCommForum}
        lastComments={lastComments}
        undoComments={undoComments}
        lastPostOfComment={lastPostOfComment}
        undoPostOfComment={undoPostOfComment}
        groupLast={groupLast}
        groupUndo={groupUndo}
        lastPosts={lastPosts}
        lastPost={lastPost}
        undoPosts={undoPosts}
        undoPost={undoPost}
        //
        lastGlobalPost={lastGlobalPost}
        undoGlobalPost={undoGlobalPost}
        lastGlobalForum={lastGlobalForum}
        undoGlobalForum={undoGlobalForum}
        //
        lastCityPost={lastCityPost}
        undoCityPost={undoCityPost}
        lastCityForum={lastCityForum}
        undoCityForum={undoCityForum}
        //
        lastCommPost={
          openWhen === "new" ? this.props[last] : this.props[lastOld]
        }
        undoCommPost={
          openWhen === "new" ? this.props[undo] : this.props[undoOld]
        }
        lastCommForum={lastCommForum}
        undoCommForum={undoCommForum}
        fetchCommEvents={fetchCommEvents}
        fetchEvents={fetchEvents}
        timeFilterEvents={timeFilterEvents}
        timeFilterJobs={timeFilterJobs}
        range={range}
        queriedDate={queriedDate}
        getCommunity={this.props.getCommunity}
        hydrateUserFromUserName={this.props.hydrateUserFromUserName}
        hydrateUser={this.props.hydrateUser}
        hydrateEntity={this.props.hydrateEntity}
        hydrateEntityFromName={this.props.hydrateEntityFromName}
        cityapisLoaded={cityapisLoaded}
        edmStore={edmStore}
        cityapi={cityapi}
        stateapi={stateapi}
        getGlobalForum={getGlobalForum}
        onDelete={onDelete}
        handleSave={handleSave}
        setData={setData}
        loadingMessage={loadingMessage}
        //
        current={current}
        current1={current1}
      />
    );
  }
}
export default Folder;
