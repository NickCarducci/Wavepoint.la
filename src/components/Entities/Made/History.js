import React from "react";
import ForumPagination from "../.././Forum/ForumPagination";
import Filter from "../.././Forum/Person/Filter";
import Card from "../../Forum/Card";
import { FilterButton } from "../../Forum/Topsort";
import { RegisterCurseWords } from "../../../Forum";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deletedForumPosts: [],
      commtype: "new",
      community: { message: "" },
      city: ""
    };
    this.stinker = React.createRef();
    this.forum = React.createRef();
    for (let i = 0; i < 40; i++) {
      this[i] = React.createRef();
    }
  }
  render() {
    const { forumPosts, postHeight, commtype, chosenPostId } = this.props;
    var budgetType = this.props.community
      ? this.props.community.budgetTypo === "school"
        ? [
            { name: "class & campus", code: "a" }, //a
            { name: "records & preservation", code: "c" }, //c
            { name: "events & recreation", code: "d" }, //d
            { name: "engineering arts & science", code: "f" }, //f
            { name: "health & safety", code: "b" }, //b
            { name: "tuition & finance", code: "e" } //e
          ]
        : this.props.community.budgetTypo === "town"
        ? [
            { name: "engineering & variance", code: "f" }, //f
            { name: "records & preservation", code: "c" }, //c
            { name: "events parks & recreation", code: "d" }, //d
            { name: "education", code: "a" }, //a
            { name: "public health", code: "b" }, //b
            { name: "fire safety & stormweather", code: "h" },
            { name: "sanitation", code: "i" },
            { name: "power", code: "g" }, //g
            { name: "custodial & taxes", code: "e" } //e
          ]
        : this.props.community.budgetTypo === "state"
        ? [
            { name: "custodial & spending", code: "e" }, //e
            { name: "education & services", code: "a" }, //a
            { name: "food, drug & safety", code: "b" }, //b
            { name: "human & civic rights", code: "f" }, //f
            { name: "records & preservation", code: "c" }, //c
            { name: "international", code: "d" } //d
          ]
        : [
            { name: "class & campus", code: "a" }, //a
            { name: "records & preservation", code: "c" }, //c
            { name: "events & recreation", code: "d" }, //d
            { name: "engineering arts & science", code: "f" }, //f
            { name: "health & safety", code: "b" }, //b
            { name: "tuition & finance", code: "e" } //e
          ]
      : [];
    var ordinanceType = [
      { name: "food, drug & safety", code: "b" }, //a
      { name: "education & services", code: "a" }, //c
      { name: "custodial rights", code: "e" }, //e
      { name: "international", code: "d" }, //d
      { name: "records & preservation", code: "c" }, //c
      { name: "civil rights", code: "f" } //b
    ];
    var caseType = [
      { name: "food, drug & safety", code: "b" }, //a
      { name: "education & services", code: "a" }, //c
      { name: "custodial rights", code: "e" }, //e
      { name: "international", code: "d" }, //d
      { name: "records & preservation", code: "c" }, //c
      { name: "civil rights", code: "f" } //b
    ];
    var columncount =
      this.props.width > 1600
        ? 5
        : this.props.width > 1200
        ? 4
        : this.props.width > 900
        ? 3
        : this.props.width > 600
        ? 2
        : 1;
    let res = {};
    for (let i = 0; i < 14; i++) {
      res[i] = (i / 14) * 0.3;
    }
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(230,230,230,.9)",
          transform: "translateY(0%) scaleY(1)",
          transition: ".5s ease-in-out"
        }}
      >
        <div
          ref={this.stinker}
          style={{
            left: "0px",
            display: "flex",
            position: "relative",
            overflowY:
              columncount !== 1 && (this.state.left > 100 || postHeight === 0)
                ? "hidden"
                : "auto",
            overflowX:
              this.state.left > 100 || postHeight === 0 ? "auto" : "hidden",
            height: `100%`,
            width: "100%"
          }}
        >
          <div
            ref={this.forum}
            style={{
              top: "0px",
              width: "100%",
              height:
                columncount === 1 || postHeight > 0 ? "max-content" : "100%",
              columnCount: columncount,
              columnGap: "0",
              position: "absolute",
              overflowY: "auto"
              //overflowX: "hidden" DON'T DO THIS
            }}
          >
            <div
              style={{
                breakInside: "avoid",
                height: "max-content",
                maxWidth: `calc(100vw/${columncount})`
              }}
            >
              <select style={{ width: "100%", height: "min-content" }}>
                {["new", "lessons", "shows", "games"].map((parent) => {
                  return <option key={parent}>{parent}</option>;
                })}
              </select>

              <ForumPagination
                swipe={"forum"}
                findPost={this.props.findPost}
                getCommunity={this.props.getCommunity}
                hydrateUser={this.props.hydrateUser}
                chosenEntity={this.props.chosenEntity}
                inTopSort={true}
                isProfile={true}
                scrollTop={
                  this.stinker.current && this.stinker.current.scrollTop > 150
                }
                lastCommPost={this.props.groupLast}
                undoCommPost={this.props.groupUndo}
                late={this.props.lastPostsAs}
                back={this.props.undoPostsAs}
                forumPosts={forumPosts}
                tagsOpen={this.state.tagsOpen}
                tagResults={this.state.tagResults}
                city={this.props.city}
                community={this.props.community}
                toggleTags={
                  this.state.tagsOpen
                    ? () => this.setState({ tagsOpen: false })
                    : () => this.setState({ tagsOpen: true })
                }
              />

              <div
                onClick={this.props.toggleFilter}
                style={{
                  width: "min-content",
                  zIndex: "3",
                  backgroundColor: "rgb(200,200,200)",
                  position: "relative",
                  height: "min-content",
                  justifyContent: "flex-end",
                  display: "flex",
                  color: "grey",
                  opacity:
                    this.props.community.message || this.props.city !== ""
                      ? "1"
                      : ".9"
                }}
              >
                Filter
                <FilterButton
                  openFilters={this.props.toggleFilter}
                  inTopSort={true}
                  inProfile={true}
                />
              </div>
              {!this.state.closeHeader && (
                <Filter
                  choosecity={(prediction) => {
                    var city = prediction.place_name;
                    this.setState({
                      city,
                      center: [prediction.center[1], prediction.center[0]],
                      locOpen: false
                    });
                    this.props.dropCityIssues(city);
                  }}
                  commtype={this.state.commtype}
                  selectCommtype={(e) =>
                    this.setState({ commtype: e.target.value })
                  }
                  city={this.state.city}
                  community={this.state.community}
                  communities={this.props.communities}
                  selectFind={(e) => this.setState({ find: e.target.value })}
                  find={this.state.find}
                  clearCommunity={() =>
                    this.setState({ community: { message: "" } })
                  }
                  selectCommunity={(e) => {
                    var value = e.target.value;
                    var community = this.props.communities.find(
                      (parent) => parent.message === value
                    );
                    this.setState({ community });
                  }}
                />
              )}
              {this.props.forumPosts.map((parent, i) => {
                var community = parent.community;
                var isLoggedAndInComm =
                  community && this.props.auth !== undefined;
                var isAuthor =
                  isLoggedAndInComm &&
                  this.props.auth.uid === community.authorId;
                var isAdmin =
                  isAuthor ||
                  (isLoggedAndInComm &&
                    community.admin &&
                    community.admin.includes(this.props.auth.uid));
                var isDelegate =
                  isLoggedAndInComm &&
                  community.faculty &&
                  community.faculty.includes(this.props.auth.uid);
                var isAdminOrDelegate = isAdmin || isDelegate;

                var mTTT = this.props.forumPosts[i].message.substring(
                  0,
                  this.props.forumPosts[i].message.length
                );

                var isGood =
                  this.props.auth !== undefined &&
                  this.props.user !== undefined &&
                  !this.props.user.under13 &&
                  this.props.user.showCurses;
                var mTT = RegisterCurseWords(mTTT, isGood);

                return (
                  <div
                    onScrollCapture={(e) => e.stopPropagation()}
                    ref={this[i]}
                    key={parent.id}
                    style={{
                      breakInside: "avoid",
                      zIndex: i + 6,
                      width: "100%",
                      maxHeight:
                        columncount === 1 || postHeight > 0
                          ? ""
                          : "calc(100% - 1px)",
                      height: `min-content`,
                      position: "relative",
                      display: "flex",
                      color: "black",
                      flexDirection: "column",
                      opacity: "1",
                      borderBottom: "1px solid grey",
                      overflowX: "hidden",
                      overflowY: columncount === 1 ? "hidden" : "auto"
                    }}
                  >
                    {!parent.author ? (
                      "no author error"
                    ) : (
                      <Card
                        forumOpen={true}
                        hydrateUserFromUserName={
                          this.props.hydrateUserFromUserName
                        }
                        mTT={mTT}
                        myCommentsPreview={
                          parent.comments && parent.comments.length
                        }
                        res={res}
                        linkDrop={this.props.linkDrop}
                        dropId={this.props.dropId}
                        droppedCommentsOpen={this.props.droppedCommentsOpen}
                        goCard={false}
                        goPost={true}
                        editingSomeText={this.state.editingSomeText}
                        postHeight={postHeight}
                        deletedForumPosts={this.state.deletedForumPosts}
                        community={community}
                        isAuthor={isAuthor} //in forum of community already found...
                        isAdminOrDelegate={isAdminOrDelegate}
                        parent={parent}
                        i={i}
                        openWhen={this.state.openWhen}
                        isClass={
                          false //commtype === "classes"
                        }
                        isDepartment={
                          false //commtype === "department"
                        }
                        isHousing={
                          false //subForum && this.props.tileChosen === "housing"
                        }
                        isRestaurant={
                          false //subForum && this.props.tileChosen === "restaurant"
                        }
                        isService={
                          false //subForum && this.props.tileChosen === "service"
                        }
                        isShop={
                          false //subForum && this.props.tileChosen === "shop"
                        }
                        isPage={
                          false //subForum && this.props.tileChosen === "page"
                        }
                        isVenue={
                          false //subForum && this.props.tileChosen === "venue"
                        }
                        isJob={
                          false //subForum && this.props.tileChosen === "job"
                        }
                        userMe={this.props.user}
                        user={this.props.profile}
                        auth={this.props.auth}
                        cityapi={this.props.cityapi}
                        communities={this.props.communities}
                        //
                        unloadGreenBlue={this.props.unloadGreenBlue}
                        loadGreenBlue={this.props.loadGreenBlue}
                        setEditing={(parent) => this.setState(parent)}
                        getUserInfo={this.props.getUserInfo}
                        columncount={columncount}
                        storageRef={this.props.storageRef}
                        issues={this.props.issues}
                        budgetType={budgetType}
                        ordinanceType={ordinanceType}
                        caseType={caseType}
                        rebeat={this.props.rebeat}
                        meAuth={this.props.meAuth}
                        collection={parent.collection}
                        getVideos={this.props.getVideos}
                        getFolders={this.props.getFolders}
                        folders={this.props.folders}
                        videos={this.props.videos}
                        individualTypes={this.props.individualTypes}
                        city={this.props.city}
                        isAdmin={isAdmin}
                        etypeChanger={this.props.etypeChanger}
                        commtype={commtype}
                        chosenPostId={chosenPostId}
                        yes={
                          this.state.openNewComment &&
                          chosenPostId === parent.id
                        }
                        helper={(x) => {
                          var input = x ? x : null;
                          this.props.helper(input);
                          var postHeight = this[i].current.offsetHeight;
                          this.props.setProfileComment({
                            chosenPostId: input.id,
                            postHeight
                          });
                          this[i].current.scrollIntoView("smooth");
                        }}
                        delete={() =>
                          this.setState({
                            deletedForumPosts: [
                              ...this.state.deletedForumPosts,
                              parent.id
                            ]
                          })
                        }
                        comments={this.props.comments}
                        clear={() => {
                          var answer = window.confirm(
                            "are you sure you want to clear this comment?"
                          );
                          if (answer) {
                            this.setState({ comment: "" });
                          }
                        }}
                        height={this.props.height}
                        globeChosen={this.props.globeChosen}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default History;
