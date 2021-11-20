import React from "react";
import firebase from "./init-firebase";
import Napkin from "./napkin";
import VoterQuery from "./components/Map/Civics/VoterQuery";
import TV from "./components/Forum/TV";
import { Link } from "react-router-dom";

class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryingWait: false
    };
  }
  render() {
    const { forumOpen, appHeight, width, loadingMessage, type } = this.props;
    const { rebeat } = this.state;
    var open =
      !this.props.switchCityOpen &&
      !this.props.createSliderOpen &&
      (!this.props.chatsopen || !this.props.achatopen);
    const person = {
      profile: this.props.profile,
      isProfile: this.props.isProfile,
      findPost: this.props.findPost,
      lastComments: this.props.lastComments,
      undoComments: this.props.undoComments,
      lastPostOfComment: this.props.lastPostOfComment,
      undoPostOfComment: this.props.undoPostOfComment,
      lastPosts: this.props.lastPosts,
      lastPost: this.props.lastPost,
      undoPosts: this.props.undoPosts,
      undoPost: this.props.undoPost
    };
    return (
      <div
        style={{
          position: "relative",
          width: "100%"
        }}
      >
        {
          //this.state.queryingWait ? <div className="queryWaitLoading">loading</div> : null
        }
        <Napkin
              setAuth={this.props.setAuth}
          getRoomKeys={this.props.getRoomKeys}
          setToUser={this.props.setToUser}
          standbyMode={this.props.standbyMode}
          type={type}
          setFoundation={this.props.setFoundation}
          setIndex={this.props.setIndex}
          forumOpen={this.props.forumOpen}
          rebeat={rebeat}
          setRebeat={this.props.setRebeat}
          loadingMessage={loadingMessage}
          displayPreferences={this.props.displayPreferences}
          setDisplayPreferences={this.props.setDisplayPreferences}
          commtype={this.props.commtype}
          tileChosen={this.props.tileChosen}
          favoriteCities={this.props.favoriteCities}
          getUserInfo={this.props.getUserInfo}
          showingRadius={this.state.showingRadius}
          switchCMapCloser={this.props.switchCMapCloser}
          switchCityOpen={this.props.switchCityOpen}
          chooseCitypoint={(
            location,
            distance,
            city,
            cityapi,
            stateapi,
            tile
          ) => {
            tile &&
              this.props.setIndex({
                tileChosen: tile
              });
            this.props.handleNewCity(city);
          }}
          chooseCommunity={(s, x) => {
            this.props.setFoundation({
              started: true
            });
            if (
              [
                "new",
                "lesson",
                "show",
                "game",
                "forms & permits",
                "ordinance",
                "budget & proposal",
                "election",
                "court case",
                "classes",
                "department"
              ].includes(x)
            ) {
              this.props.setFoundation({
                switchCityOpen: false
              });
              this.props.setIndex({ commtype: x, forumOpen: true });
              this.chooseCommunity(s);
            } else {
              this.props.setFoundation({
                switchCityOpen: false
              });
              this.props.setIndex({
                forumOpen: false,
                tileChosen: x
              });
              this.chooseCommunity(s);
            }
          }}
          startQueryCity={this.startQueryCity}
          eventsOpen={this.state.eventsOpen}
          chosenCity={this.state.chosenCity}
          chooseCenter={this.chooseCenter}
          switchCMapOpener={this.props.switchCMapOpener}
          y={this.state.y}
          sliderchange={({ y }) => {
            this.setState({ y, distance: y });
          }}
          input={<input />}
          onClose={() => {}}
          locationLocation
          distance={this.state.distance}
          auth={this.props.auth}
          user={this.props.user}
          city={this.props.city}
          //

          profileEntities={this.props.profileEntities}
          //

          getCommunity={this.props.getCommunity}
          //
          calToggle={this.props.calToggle}
          openCal={this.props.openCal}
          appHeight={appHeight}
          allowDeviceToRead={this.props.allowDeviceToRead}
          manuallyDeleteKeyBox={this.props.manuallyDeleteKeyBox}
          go={this.props.go}
          recipientsProfiled={this.props.recipientsProfiled}
          keyBoxes={this.props.keyBoxes}
          unloadGreenBlue={this.props.unloadGreenBlue}
          loadGreenBlue={this.props.loadGreenBlue}
          getDrop={this.props.getDrop}
          parent={this.props.parent}
          droppedPost={this.props.droppedPost}
          dropId={this.props.dropId}
          hydrateUser={this.props.hydrateUser}
          storageRef={this.props.storageRef}
          getVideos={this.props.getVideos}
          getFolders={this.props.getFolders}
          folders={this.props.folders}
          videos={this.props.videos}
          onDeleteVideo={this.props.onDeleteVideo}
          handleSaveVideo={this.props.handleSaveVideo}
          width={width}
          openChatWithGroup={this.props.openChatWithGroup}
          myEvents={this.props.myEvents}
          myClubs={this.props.myClubs}
          myJobs={this.props.myJobs}
          myVenues={this.props.myVenues}
          myServices={this.props.myServices}
          myClasses={this.props.myClasses}
          myDepartments={this.props.myDepartments}
          myRestaurants={this.props.myRestaurants}
          myShops={this.props.myShops}
          myPages={this.props.myPages}
          myHousing={this.props.myHousing}
          thisentity={this.props.thisentity}
          entityTitle={this.props.entityTitle}
          entityType={this.props.entityType}
          entityId={this.props.entityId}
          setTopic={this.props.setTopic}
          threadId={this.props.threadId}
          chosenTopic={this.props.chosenTopic}
          oktoshowchats={this.props.oktoshowchats}
          showChatsOnce={this.props.showChatsOnce}
          accessToken={this.props.accessToken}
          communities={this.props.communities}
          recipients={this.props.recipients}
          rangeChosen={this.props.rangeChosen}
          againBackMessages={this.props.againBackMessages}
          moreMessages={this.props.moreMessages}
          onDelete={this.props.onDelete}
          handleSave={this.props.handleSave}
          clearFilesPreparedToSend={this.props.clearFilesPreparedToSend}
          filesPreparedToSend={this.props.filesPreparedToSend}
          loadYoutubeApi={this.props.loadYoutubeApi}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          signedIn={this.props.signedIn}
          s={this.props.s}
          loadGapiApi={this.props.loadGapiApi}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          switchCMap={this.props.switchCityOpen}
          addPic={this.props.addPic}
          hiddenMsgs={this.props.hiddenMsgs}
          deletedMsgs={this.props.deletedMsgs}
          listHiddenMsgs={this.props.listHiddenMsgs}
          listDeletedMsgs={this.props.listDeletedMsgs}
          notes={this.props.notes}
          profileOpener={this.props.profileOpener}
          profileOpen={this.props.profileOpen}
          chatsopen={this.props.chatsopen}
          chatscloser={this.props.chatscloser}
          users={this.props.users}
          firebase={this.props.firebase}
          openAChat={this.props.achatopen}
          achatisopen={this.props.achatisopen}
          achatisopenfalse={this.props.achatisopenfalse}
          chats={this.props.chats}
          //
          scrolling={this.props.scrolling}
          apple={this.props.apple}
          resetPathAlias={this.props.resetPathAlias}
          clickZoomer={this.props.clickZoomer}
          drop={this.props.drop}
          statePathname={this.props.statePathname}
          isProfile={this.props.isProfile}
          person={person}
          setCommunity={this.props.setCommunity}
          chosenPost={this.props.chosenPost}
          chosenPostId={this.props.chosenPostId}
          postHeight={this.props.postHeight}
          setData={this.props.setData}
          monthCalOpen={this.props.monthCalOpen}
          invites={this.props.invites}
          selfvites={this.props.selfvites}
          fonish={this.props.fonish}
          materialDateOpen={this.props.materialDateOpen}
          pathname={this.props.pathname}
          started={this.props.started}
          tilesMapOpen={this.props.tilesMapOpen}
          achatopen={this.props.achatopen}
          unreadChatsCount={this.props.unreadChatsCount}
          go1={this.props.go1}
          hydrateEntity={this.props.hydrateEntity}
          forumPosts={this.props.forumPosts}
          profilePosts={this.props.profilePosts}
          setForumDocs={this.props.setForumDocs}
          current={this.props.current}
          current1={this.props.current1}
          following={this.props.following}
          comments={this.props.comments}
          postMessage={this.props.postMessage}
          openWhen={this.props.openWhen}
          helper2={this.props.helper2}
          helper={this.props.helper}
          searchEvents={this.props.searchEvents}
          searcherEventer={this.props.searcherEventer}
          setStatee={(x) => this.setState(x)}
          createSliderOpener={this.props.createSliderOpener}
          open={open}
          lastGlobalPost={this.props.lastGlobalPost}
          undoGlobalPost={this.props.undoGlobalPost}
          lastGlobalForum={this.props.lastGlobalForum}
          undoGlobalForum={this.props.undoGlobalForum}
          //
          lastCityPost={this.props.lastCityPost}
          undoCityPost={this.props.undoCityPost}
          lastCityForum={this.props.lastCityForum}
          undoCityForum={this.props.undoCityForum}
          //
          lastCommPost={this.props.lastCommPost}
          undoCommPost={this.props.undoCommPost}
          lastCommForum={this.props.lastCommForum}
          undoCommForum={this.props.undoCommForum}
          setDrop={this.props.setDrop}
          meAuth={this.props.meAuth}
          logoutofapp={this.props.logoutofapp}
          goToRadius={this.props.goToRadius}
          trueZoom={this.props.trueZoom}
          toggleCloseStuff={this.props.toggleCloseStuff}
          showNew={this.state.showNew}
          individualTypes={this.props.individualTypes}
          unSubForum={this.props.unSubForum}
          birdsEyeZoomOn={this.props.birdsEyeZoomOn}
          birdsEyeZoomOff={this.props.birdsEyeZoomOff}
          officialResults={this.props.officialResults}
          officialLevel={this.props.officialLevel}
          selectOfficialLevel={this.props.selectOfficialLevel}
          officialRole={this.props.officialRole}
          selectOfficialRole={this.props.selectOfficialRole}
          clearErrorVoter={this.props.clearErrorVoter}
          errorVoter={this.props.errorVoter}
          voterResults={this.props.voterResults}
          handleVoterQuery={this.props.handleVoterQuery}
          address={this.props.address}
          openFilters={this.props.openFilters}
          showFilters={this.props.showFilters}
          toggleEditing={this.props.toggleEditing}
          editingCommunity={this.props.editingCommunity}
          openCommunityAdmin={this.props.openCommunityAdmin}
          issues={this.props.issues}
          oldBudget={this.props.oldBudget}
          oldElections={this.props.oldElections}
          oldCases={this.props.oldCases}
          oldClasses={this.props.oldClasses}
          followingMe={this.props.followingMe}
          createSliderOpen={this.props.createSliderOpen}
          closeSurrounds={this.props.closeSurrounds}
          openSurrounds={this.props.openSurrounds}
          openStart={this.props.openStart}
          boink={this.props.boink}
          waitForMove={this.props.waitForMove}
          chooseEdmevent={this.props.chooseEdmevent}
          budget={this.props.budget}
          ordinances={this.props.ordinances}
          edmTrainevents={this.props.edmTrainevents}
          events={this.props.events}
          jobs={this.props.jobs}
          clubs={this.props.clubs}
          restaurants={this.props.restaurants}
          shops={this.props.shops}
          services={this.props.services}
          housing={this.props.housing}
          pages={this.props.pages}
          departments={this.props.departments}
          classes={this.props.classes}
          eventTypes={this.props.eventTypes}
          ptype={this.props.ptype}
          vtype={this.props.vtype}
          servtype={this.props.servtype}
          htype={this.props.htype}
          stype={this.props.stype}
          etype={this.props.etype}
          ctype={this.props.ctype}
          jtype={this.props.jtype}
          ftype={this.props.ftype}
          rtype={this.props.rtype}
          materialDateOpener={this.props.materialDateOpener}
          materialDate={this.props.materialDate}
          clearMaterialDate={this.props.clearMaterialDate}
          listplz={this.props.listplz}
          listplzToggle={this.props.listplzToggle}
          addPicTrue={this.props.addPicTrue}
          addPicFalse={this.props.addPicFalse}
          subForum={this.props.subForum}
          subForumPosts={this.props.subForumPosts}
          clearFilePreparedToSend={this.props.clearFilePreparedToSend}
          showpicker2={this.props.showpicker2}
          picker2={this.props.picker2}
          filePreparedToSend={this.props.filePreparedToSend}
          chooseEvents={this.props.chooseEvents}
          openchat={this.props.openchat}
          forumOrdinances={this.props.forumOrdinances}
          community={this.props.community}
          center={this.props.center}
          cityapi={this.props.cityapi}
          chooseGlobe={this.props.chooseGlobe}
          globeChosen={this.props.globeChosen}
          openForum={this.props.openForum}
          closeForum={this.props.closeForum}
          openthestuff={this.props.openthestuff}
          tileToggler={this.props.tileToggler}
          zoomIn={this.props.zoomIn}
          scrollingRadius={this.props.scrollingRadius}
          zoomChoose1={this.props.zoomChoose1}
          zoomChoose2={this.props.zoomChoose2}
          zoomChoose3={this.props.zoomChoose3}
          zoomChoose4={this.props.zoomChoose4}
          description={this.props.description}
          humidity={this.props.humidity}
          search={this.props.search}
          eventCloser={this.props.eventCloser}
          eventOpener={this.props.eventOpener}
          zoomChosen={this.props.zoomChosen}
          mapChanged={this.props.mapChanged}
          changeCity={this.props.changeCity}
          myVariable={this.props.myVariable}
          chooseJob={this.props.chooseJob}
          chooseClub={this.props.chooseClub}
          chooseEvent={this.props.chooseEvent}
          haltMapCityChoose={this.props.haltChooseCity}
          tilesOpener={this.props.tilesOpener}
          queryDate={this.props.queryDate}
          range={this.props.range}
          queriedDate={this.props.queriedDate}
          searchJobs={this.props.searchJobs}
          unStart={this.props.unStart}
          start={this.props.start}
          dayliked={this.props.dayliked}
          allTimer={this.props.allTimer}
          alltime={this.props.alltime}
          targetid={this.props.targetid}
          closeSwitch={this.props.closeSwitch}
          openNewForum={this.props.openNewForum}
          globalForumPosts={this.props.globalForumPosts}
          openFollowing={() => this.setState({ showFollowing: true })}
          showFollowing={this.state.showFollowing}
          clickCityGifmap={this.props.clickCityGifmap}
          //
          cancelRebeat={(x) => this.setState(x)}
          collection={this.props.collection}
          closeNewForum={this.props.closeNewForum}
        />
        {this.props.mapOpen && this.props.auth === undefined && (
          <div onClick={this.props.getUserInfo}>
            This community is private. want to login?
          </div>
        )}
        {this.state.openTv && (
          <TV
            getCommunity={this.props.getCommunity}
            hydrateEntity={this.props.hydrateEntity}
            getDrop={this.props.getDrop}
            hydrateUser={this.props.hydrateUser}
            width={width}
            users={this.props.users}
            height={appHeight}
            getVideos={this.props.getVideos}
            getFolders={this.props.getFolders}
            user={this.props.user}
            auth={this.props.auth}
            communities={this.props.communities}
            globeChosen={this.props.globeChosen}
            setTV={(x) => this.setState(x)}
          />
        )}
        {this.state.showFollowing && (
          <div
            style={{
              zIndex: "2",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              position: "fixed",
              width: "100%",
              height: "100%"
            }}
          >
            {this.props.auth !== undefined ? (
              this.props.user.following.length > 0 ? (
                <div>
                  following
                  {this.props.following.map((z) => {
                    return (
                      <div
                        key={z}
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          backgroundColor: "white",
                          borderRadius: "50px",
                          width: "min-content"
                        }}
                      >
                        <Link
                          style={{
                            display: "flex",
                            alignItems: "flex-end"
                          }}
                          to={`/at/${z.username}`}
                        >
                          <img
                            style={{
                              height: "30px",
                              width: "30px",
                              borderTopLeftRadius: "50px",
                              borderBottomLeftRadius: "50px"
                            }}
                            src={z.photoThumbnail}
                            alt={z.username}
                          />
                          {z.name}@{z.username}
                        </Link>
                        <div
                          onClick={() => {
                            var answer1 = window.confirm(
                              `want to follow ${z.name}@${z.username}?`
                            );

                            if (answer1) {
                              firebase
                                .firestore()
                                .collection("users")
                                .doc(this.props.auth.uid)
                                .update({
                                  following: firebase.firestore.FieldValue.arrayUnion(
                                    z.id
                                  )
                                })
                                .catch((err) => console.log(err.message));
                            }
                          }}
                          style={
                            this.props.user &&
                            this.props.user.following &&
                            this.props.following.includes(z.id)
                              ? {
                                  display: "flex",
                                  left: "10px",
                                  zIndex: "9999",
                                  border: "navy"
                                }
                              : {
                                  display: "flex",
                                  left: "10px",
                                  zIndex: "9999"
                                }
                          }
                        >
                          {z.smiley}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null /*(
        <div>
          start following some people
          <br />
          {suggested.map((z) => {
            var x = this.props.users.find((y) => y.id === z);
            return (
              <Profiler
                user={this.props.user}
                x={x}
                auth={this.props.auth}
              />
            );
          })}
          {communitiesThatPartOf.length === 0 && (
            <div>
              &bull;&nbsp;you arent part of any communities
              <br /> Want to join one of these?{" "}
              {this.props.communties &&
                this.props.communties.map((x) => {
                  return (
                    <div>
                      {x.message}
                      {this.state.community.requestingMembership(
                        this.props.auth.uid
                      ) ? (
                        <div
                          onClick={() => {
                            var answer = window.confirm(
                              "recind request for membership?"
                            );
                            if (answer) {
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.state.community.id)
                                .update({
                                  requestingMembership: firebase.firestore.FieldValue.arrayRemove(
                                    this.props.auth.uid
                                  )
                                });
                            }
                          }}
                        >
                          Requesting...
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            var answer = window.confirm(
                              "request membership?"
                            );
                            if (answer) {
                              firebase
                                .firestore()
                                .collection("communities")
                                .doc(this.state.community.id)
                                .update({
                                  requestingMembership: firebase.firestore.FieldValue.arrayUnion(
                                    this.props.auth.uid
                                  )
                                });
                            }
                          }}
                        >
                          Join
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )*/
            ) : (
              <div
                onClick={this.props.getUserInfo} //to="/login"
              >
                login to join
              </div>
            )}
          </div>
        )}
        <div
          onClick={() => this.setState({ showFollowing: false })}
          style={{
            zIndex: "2",
            color: "blue",
            justifyContent: "center",
            alignItems: "center",
            display: this.state.showFollowing ? "flex" : "none",
            position: "fixed",
            top: "0px",
            left: "0px",
            width: "56px",
            height: "56px",
            borderRadius: "45px",
            border: "5px solid #78f8fff2",
            backgroundColor: "white",
            transition: "ease-in .3s"
          }}
        >
          &times;
        </div>
        {window.location.pathname === "/" &&
          !this.props.chatsopen &&
          !forumOpen &&
          !this.props.switchCityOpen && (
            <VoterQuery
              openTvgo={() => this.setState({ openTv: true })}
              openTv={this.state.openTv}
              officialResults={this.props.officialResults}
              officialLevel={this.props.officialLevel}
              selectOfficialLevel={this.props.selectOfficialLevel}
              officialRole={this.props.officialRole}
              selectOfficialRole={this.props.selectOfficialRole}
              clearErrorVoter={this.props.clearErrorVoter}
              errorVoter={this.props.errorVoter}
              voterResults={this.props.voterResults}
              handleVoterQuery={this.props.handleVoterQuery}
            />
          )}
      </div>
    );
  }
}
export default Links;
