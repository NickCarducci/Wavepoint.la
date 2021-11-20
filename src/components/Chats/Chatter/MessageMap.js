import React from "react";
import MessageSplit from "./MessageSplit";

class MessageMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { foo: [], dop: [], creationDate: "" };
    // create a ref to store the textInput DOM element
    //this.grabbottomofchat = React.createRef();
    //this.refsArray = [];
  }
  /*isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  }*/
  componentDidUpdate = (prevProps) => {
    if (
      this.props.recipients &&
      this.props.recentChats &&
      this.props.recentChats !== prevProps.recentChats
    ) {
      var x =
        this.props.recipients.constructor === Array
          ? this.props.recipients
          : [this.props.recipients];
      let dop = [];
      x.map((hj) => {
        var jot = this.props.recentChats.sort((a, b) => {
          return b.time.seconds - a.time.seconds;
        });
        var jol = jot.find(({ authorId }) => authorId === hj)
          ? jot.find(({ authorId }) => authorId === hj)
          : false;
        dop.push(jol.id);
        if (jot.length > 0 && dop.length === this.props.recipients.length) {
          this.setState({ jot, dop });
        }
        return dop;
      });
    }
    if (
      this.state.jot &&
      this.state.jot.length > 0 &&
      this.state.lastDop !== this.state.dop
    ) {
      var datethis = this.state.jot[0].time.seconds * 1000;
      var goo = new Date(datethis).toLocaleString();
      this.setState({
        lastDop: this.state.dop,
        creationDate: goo
      });
    }
  };
  render() {
    const { noteList, noteTitles } = this.props;
    let authorCount = 0;
    var chatsWithinTopic = this.props.recentChats.filter((x) => {
      return x.topic === this.props.chosenTopic;
    });
    var filteredSenders =
      this.props.auth !== undefined
        ? this.props.recipients.constructor === Array
          ? [...this.props.recipients, this.props.auth.uid]
          : [this.props.recipients, this.props.auth.uid]
        : null;
    return (
      <div
        style={{
          backgroundColor: "rgb(250,250,250)",
          height: "min-content",
          display: "flex",
          position: "relative",
          margin: "0px 5px",
          marginRight: "5px",
          flexDirection: "column",
          justifyContent: "flex-end",
          top: "20px",
          alignItems: "flex-start"
        }}
      >
        {this.props.n < this.props.recentChats ? (
          <div
            onClick={this.props.addThirty}
            style={{
              color: "black"
            }}
          >
            Grab more
          </div>
        ) : (
          <div
            style={{ width: "max-content", color: "grey", fontSize: "14px" }}
          >
            Chat started {this.state.creationDate}
          </div>
        )}
        <div
          style={{
            borderRadius: "3px",
            padding: "1px",
            fontSize: "10px",
            backgroundColor: "rgb(100,100,100)",
            color: "black"
          }}
          onClick={this.props.moreMessages}
        >
          More
        </div>
        {this.state.dop !== [] &&
          chatsWithinTopic &&
          chatsWithinTopic !== [] &&
          chatsWithinTopic
            .sort((a, b) => {
              return a.time.seconds - b.time.seconds;
            })
            .map((message) => {
              authorCount++;
              // eslint-disable-next-line
              if (
                filteredSenders === [] ||
                filteredSenders === null ||
                !filteredSenders ||
                filteredSenders === "" ||
                filteredSenders.includes(message.authorId) ||
                filteredSenders === message.authorId
              ) {
                if (
                  this.props.recentChats.findIndex((x) => x.id === message.id) >
                  this.props.recentChats.length - this.props.n
                ) {
                  if (
                    this.props.deletedMsgs.includes(message.id) === false &&
                    this.props.hiddenMsgs.includes(message.id) === false
                  ) {
                    return (
                      <MessageSplit
                        noteList={noteList}
                        noteTitles={noteTitles}
                        parent={this.props.parent}
                        droppedPost={this.props.droppedPost}
                        linkDrop={this.props.linkDrop}
                        dropId={this.props.dropId}
                        droppedCommentsOpen={this.props.droppedCommentsOpen}
                        //
                        communities={this.props.communities}
                        threadId={this.props.threadId}
                        openTopics={this.props.openTopics}
                        closeTheTopics={this.props.closeTheTopics}
                        chosenTopic={this.props.chosenTopic}
                        onDelete={this.props.onDelete}
                        handleSave={this.props.handleSave}
                        notes={this.props.notes}
                        openAChat={this.props.openAChat}
                        //
                        dop={this.state.dop}
                        users={this.props.users}
                        auth={this.props.auth}
                        listHiddenMsgs={this.props.listHiddenMsgs}
                        listDeletedMsgs={this.props.listDeletedMsgs}
                        filteredSenders={this.props.filteredSenders}
                        contentLinker={this.props.contentLinker}
                        signedIn={this.props.signedIn}
                        key={message.id}
                        shareDoc={this.props.shareDoc}
                        s={this.props.s}
                        authorCount={authorCount}
                        contents={this.props.contents}
                        message={message}
                        recentChats={this.props.recentChats}
                      />
                    );
                  } else return null;
                } else return null;
              } else return null;
            })}
        <div
          style={{
            borderRadius: "3px",
            padding: "1px",
            fontSize: "10px",
            backgroundColor: "rgb(100,100,100)",
            color: "black"
          }}
          onClick={this.props.againBackMessages}
        >
          Back
        </div>
        {/*<div ref={this.grabbottomofchat} />
        !this.props.closeTopics && (
          <div
            style={{
              backgroundColor: "rgba(51,51,51,0)",
              display: "flex",
              position: "absolute",
              width: "100%",
              height: `calc(100% + 1200px)`,
              zIndex: "9999"
            }}
            className="closetopicforeground"
            onClick={this.props.closeTheTopics}
          />
          )*/}
      </div>
    );
  }
}
export default MessageMap;
