import React from "react";
import Post from "../.././Post";
import { RegisterCurseWords } from "../../../Forum";

class EmbeddedRebeat extends React.Component {
  state = {};
  render() {
    const { comments, rebeat, opened } = this.props;
    var mTTT = rebeat.message.substring(0, rebeat.message.length);

    var isGood =
      this.props.auth !== undefined &&
      this.props.user !== undefined &&
      !this.props.user.under13 &&
      this.props.user.showCurses;
    var mTT = RegisterCurseWords(mTTT, isGood);
    return (
      <div
        style={{
          backgroundColor: "rgb(210,210,230)",
          flexDirection: "column",
          display: opened ? "flex" : "none",
          color: "black",
          width: "99%",
          marginBottom: "2px",
          borderLeft: "3px solid",
          borderBottom: "1px solid"
        }}
      >
        {(this.props.isNew ||
          (this.props.auth !== undefined &&
            this.props.auth.uid === rebeat.authorId)) && (
          <div
            style={{
              justifyContent: "space-between",
              wordBreak: "break-word",
              height: "min-content",
              alignItems: "center",
              display: "flex"
            }}
          >
            <div
              onClick={() => {
                var answer = window.confirm("remove drop?");
                if (answer) {
                  if (
                    this.props.auth !== undefined &&
                    this.props.auth.uid === rebeat.authorId
                  ) {
                    this.setState({ confirmRemoveDrop: true });
                  } /**if(this.props.isNew) */ else {
                    this.props.setDelete();
                  }
                }
              }}
              style={{
                width: "40px",
                height: "40px",
                borderRight: "1px solid",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              &times;
            </div>
            {this.state.confirmRemoveDrop ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (this.state.removedrop.toLowerCase() === "remove drop") {
                    this.props.setDelete();
                  } else {
                    window.alert(`please enter "remove drop" to delete`);
                    this.setState({ confirmRemoveDrop: false });
                  }
                }}
              >
                <input
                  className="input"
                  style={{
                    border: "none",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    textIndent: "10px"
                  }}
                  placeholder="remove drop"
                  value={this.state.removedrop}
                  onChange={(e) =>
                    this.setState({ removedrop: e.target.value })
                  }
                />
              </form>
            ) : (
              rebeat.collection + rebeat.id
            )}
          </div>
        )}
        {/*<div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "260px",
                  backgroundColor: "rgba(20,20,20,.4)"
                }}
              />*/}
        <Post
          mTT={mTT}
          res={{}}
          i={0}
          parent={this.props.parent}
          linkDrop={this.props.linkDrop}
          dropId={this.props.dropId}
          isDroppedIn={this.props.isDroppedIn}
          city={rebeat.city}
          commtype={
            ["budget & proposals", "oldBudget"].includes(rebeat.collection)
              ? "budget & proposal"
              : ["elections", "oldElections"].includes(rebeat.collection)
              ? "election"
              : ["court cases", "oldCases"].includes(rebeat.collection)
              ? "court case"
              : ["ordinances"].includes(rebeat.collection)
              ? "ordinance"
              : "forum"
          }
          openWhen={
            ["oldElections", "oldCases", "oldBudget"].includes(
              rebeat.collection
            )
              ? "expired"
              : "new"
          }
          user={this.props.user}
          auth={this.props.auth}
          community={this.props.community} //
          chosenPostId={this.props.chosenPostId}
          //helper={this.props.helper}
          delete={this.props.delete}
          comments={comments}
          clear={this.props.clear}
          height={this.props.height}
          globeChosen={this.props.globeChosen}
          communities={this.props.communities}
        />
      </div>
    );
  }
}
export default EmbeddedRebeat;
