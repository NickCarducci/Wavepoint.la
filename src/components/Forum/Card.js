import React from "react";
import CardObject from ".././Entities/CardObject";
import Post from ".././Post";

class Card extends React.Component {
  state = {};
  render() {
    const {
      postHeight,
      commtype,
      isAuthor,
      isAdminOrDelegate,
      parent,
      collection,
      isAdmin,
      columncount,
      isClass,
      isDepartment,
      isHousing,
      isRestaurant,
      isService,
      isShop,
      isPage,
      isVenue,
      isJob,
      community,
      chosenPostId,
      communities,
      goCard,
      goPost,
      i,
      res,
      mTT,
      summary
    } = this.props;
    var isAtLeastMember =
      isAuthor ||
      isAdminOrDelegate ||
      (this.props.auth !== undefined &&
        community &&
        community.members &&
        community.members.includes(this.props.auth.uid));
    if (
      goCard &&
      parent.message &&
      (!community || !community.privateToCommunity || isAtLeastMember)
    ) {
      return (
        <CardObject
          key={parent.id}
          openWhen={this.props.openWhen}
          isClass={isClass}
          isDepartment={isDepartment}
          isHousing={isHousing}
          isRestaurant={isRestaurant}
          isService={isService}
          isShop={isShop}
          isPage={isPage}
          isVenue={isVenue}
          isJob={isJob}
          community={community}
          user={this.props.user}
          parent={parent}
          auth={this.props.auth}
          cityapi={this.props.cityapi}
          communities={communities}
        />
      );
    } else if (
      goPost &&
      (!community || !community.privateToCommunity || isAtLeastMember)
    ) {
      if (!this.props.seeContents || this.props.cards.constructor === Array) {
        return (
          <Post
            chain={this.props.chainId}
            setForum={this.props.setForum}
            vintageOfKeys={this.props.vintageOfKeys}
            setNapkin={this.props.setNapkin}
            deletedForumPosts={this.props.deletedForumPosts}
            delete={this.props.delete}
            rebeat={this.props.rebeat}
            setRebeat={this.props.setRebeat}
            summary={summary}
            int={this.props.int}
            opening={this.props.opening}
            opened={this.props.opened}
            chainId={this.props.chainId}
            isProfile={this.props.isProfile}
            seeContents={this.props.seeContents}
            openChain={this.props.openChain}
            setChain={this.props.setChain}
            cards={this.props.cards}
            forumOpen={this.props.forumOpen}
            mTT={mTT}
            key={parent.id}
            myCommentsPreview={this.props.myCommentsPreview}
            res={res}
            i={i}
            linkDrop={this.props.linkDrop}
            dropId={this.props.dropId}
            parent={parent}
            unloadGreenBlue={this.props.unloadGreenBlue}
            loadGreenBlue={this.props.loadGreenBlue}
            setEditing={this.props.setEditing}
            getUserInfo={this.props.getUserInfo}
            columncount={columncount}
            storageRef={this.props.storageRef}
            issues={this.props.issues}
            meAuth={this.props.meAuth}
            getVideos={this.props.getVideos}
            getFolders={this.props.getFolders}
            folders={this.props.folders}
            videos={this.props.videos}
            individualTypes={this.props.individualTypes}
            community={parent.community}
            communities={communities}
            collection={collection}
            isAdmin={isAdmin}
            user={parent.author}
            auth={this.props.auth}
            userMe={this.props.user}
            openWhen={this.state.openWhen}
            commtype={commtype}
            chosenPostId={chosenPostId}
            helper={this.props.helper}
            thiscommunity={community}
            comments={this.props.comments}
            clear={this.props.clear}
            height={this.props.height}
            postHeight={postHeight}
            globeChosen={this.props.globeChosen}
            chosenPost={this.props.chosenPost}
            vertical={this.props.vertical}
            postMessage={this.props.postMessage}
            width={this.props.width}
            forumPosts={this.props.forumPosts}
            closeGroupFilter={this.props.closeGroupFilter}
            openGroupFilter={this.props.openGroupFilter}
          />
        );
      } else return null;
    } else return null;
  }
}

export default Card;
//ref={this.props[i]}
//export default React.forwardRef((props, ref) => <Card {...props} post={ref} />);

/*(element) => {
if (element) {
  var height = element.offsetHeight;

  this[parent.id] = height;
}
}*/
