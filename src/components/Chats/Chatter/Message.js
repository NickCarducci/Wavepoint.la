import React from "react";
import MessageClean from "./MessageClean";

class Message extends React.Component {
  render() {
    const { message, noteList, noteTitles } = this.props;
    return (
      <div
        className={{
          display: "flex",
          position: "relative",
          width: "min-content",
          maxWidth: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "min-content"
          }}
        >
          <div
            style={{
              margin: "0px 12px",
              display: "flex",
              position: "relative",
              color: "rgb(50,50,50)",
              height: "100%",
              width: "max-content",
              fontSize: "15px",
              paddingTop: "10px",
              alignItems: "center"
            }}
          >
            <div
              style={{
                position: "absolute",
                height: "26px",
                width: "26px",
                boxShadow: "inset 0px 0px 5px 1px rgb(200,200,200)",
                borderRadius: "50px"
              }}
            />
            {this.props.message.author &&
            this.props.message.author.photoThumbnail ? (
              <img
                alt="error"
                src={this.props.message.author.photoThumbnail}
                style={{ width: "26px", height: "auto", borderRadius: "50px" }}
              />
            ) : (
              <div
                style={{
                  backgroundColor: `${this.props.message.author.profilergb}`,
                  width: "26px",
                  height: "auto",
                  borderRadius: "50px"
                }}
              />
            )}
            <div
              style={{
                color: "rgb(120,160,255)",
                width: "max-content",
                display: "flex",
                position: "relative",
                fontSize: "14px",
                bottom: "10px",
                flexDirection: "column"
              }}
            >
              &nbsp;
              <div
                style={{
                  width: "max-content",
                  display: "flex",
                  position: "relative",
                  fontSize: "14px",
                  bottom: "0px"
                }}
              >
                &nbsp;{this.props.message.author.name}
              </div>
              <div
                style={{
                  width: "max-content",
                  display: "flex",
                  position: "relative",
                  fontSize: "14px",
                  bottom: "0px"
                }}
              >
                &nbsp;&nbsp;{this.props.message.author.username}
              </div>
            </div>
          </div>
        </div>
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
          listHiddenMsgs={this.props.listHiddenMsgs}
          listDeletedMsgs={this.props.listDeletedMsgs}
          message={message}
          filteredSenders={this.props.filteredSenders}
          auth={this.props.auth}
          signedIn={this.props.signedIn}
          contentLinker={this.props.contentLinker}
          contents={this.props.contents}
        />
      </div>
    );
  }
}
export default Message;
