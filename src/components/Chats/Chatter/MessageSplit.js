import React from "react";
import MessageClean from "./MessageClean";
import Message from "./Message";

class MessageSplit extends React.Component {
  render() {
    const { message, sender, authorCount, noteList, noteTitles } = this.props;
    return (
      <div
        /*ref={(ref) => {
          // Callback refs are preferable when
          // dealing with dynamic refs
          this.refsArray[message.id] = ref;
        }}*/
        style={{
          width: "min-content",
          maxWidth: "calc(100% - 20px)"
        }}
      >
        {
          //authorCount % 6 !== 1 &&
          this.props.recentChats &&
          this.props.recentChats !== [] &&
          this.props.recentChats[this.props.recentChats.length - 1].id !==
            message.id &&
          //&& jol[message.authorId] !== message.id
          !this.props.dop.includes(message.id) ? (
            <MessageClean
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
              onDrag={this.props.onDrag}
              onDragStart={this.props.onDragStart}
              offDrag={this.props.offDrag}
              onDelete={this.props.onDelete}
              handleSave={this.props.handleSave}
              notes={this.props.notes}
              users={this.props.users}
              shareDoc={this.props.shareDoc}
              s={this.props.s}
              message={message}
              contents={this.props.contents}
              auth={this.props.auth}
              listHiddenMsgs={this.props.listHiddenMsgs}
              listDeletedMsgs={this.props.listDeletedMsgs}
              filteredSenders={this.props.filteredSenders}
              contentLinker={this.props.contentLinker}
              signedIn={this.props.signedIn}
              sender={sender}
            />
          ) : (
            <Message
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
              moveDoc={this.props.moveDoc}
              onDrag={this.props.onDrag}
              onDragStart={this.props.onDragStart}
              offDrag={this.props.offDrag}
              onDelete={this.props.onDelete}
              handleSave={this.props.handleSave}
              notes={this.props.notes}
              contentLinker={this.props.contentLinker}
              shareDoc={this.props.shareDoc}
              s={this.props.s}
              message={message}
              authorCount={authorCount}
              auth={this.props.auth}
              listHiddenMsgs={this.props.listHiddenMsgs}
              listDeletedMsgs={this.props.listDeletedMsgs}
              recentChats={this.props.recentChats}
              users={this.props.users}
              sender={sender}
              contents={this.props.contents}
              signedIn={this.props.signedIn}
              filteredSenders={this.props.filteredSenders}
            />
          )
        }
      </div>
    );
  }
}
export default MessageSplit;
