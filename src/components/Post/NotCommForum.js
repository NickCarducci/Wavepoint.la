import React from "react";
import { Link } from "react-router-dom";

class NotCommForum extends React.Component {
  state = {
    electionsRunningIn: []
  };
  render() {
    const { parent, isDroppedIn, user, opened } = this.props;
    /*var go =
      parent.budgetType ||
      parent.caseType ||
      parent.electionType ||
      parent.ordinanceType;*/
    var communityMessageToShow = isDroppedIn
      ? isDroppedIn.community
        ? isDroppedIn.community.message
        : isDroppedIn.city
      : parent.community
      ? parent.community.message
      : parent.city;
    return (
      <div
        style={{
          overflow: "hidden",
          height: opened !== "" ? "min-content" : "0px"
        }}
      >
        {this.state.electionsRunningIn.length > 0 && (
          <div
            style={{
              height: "min-content",
              backgroundColor: "rgb(100,150,250)",
              color: "white",
              width: "100%",
              fontSize: "14px"
            }}
          >
            {this.state.electionsRunningIn.map((parent) => {
              return (
                <div>
                  {`Running for ${parent.community.message}'s ${parent.message} in ${parent.electionType}`}
                </div>
              );
            })}
          </div>
        )}
        {parent.community &&
          parent.community.judges &&
          parent.community.judges.length > 0 && (
            <div
              style={{
                height: "min-content",
                backgroundColor: "rgb(100,150,250)",
                color: "white",
                width: "100%",
                fontSize: "14px"
              }}
            >
              {parent.community.judgesProfiled.map((parent) => {
                return (
                  <div>{`${parent.community.message}'s ${
                    parent[parent.community.id]
                  }`}</div>
                );
              })}
            </div>
          )}
        {parent.community &&
          parent.community.representatives &&
          parent.community.representatives.length > 0 && (
            <div
              style={{
                height: "min-content",
                backgroundColor: "rgb(100,150,250)",
                color: "white",
                width: "100%",
                fontSize: "14px"
              }}
            >
              {parent.community.representativesProfiled.map((parent) => {
                return (
                  <div>{`${parent.community.message}'s ${
                    parent[parent.community.id]
                  }`}</div>
                );
              })}
            </div>
          )}
        <Link
          onClick={() =>
            opened !== "" && this.props.setChain({ opened: this.props.chainId })
          }
          to={
            opened === ""
              ? `/${(parent.community
                  ? parent.community.message
                  : communityMessageToShow
                  ? communityMessageToShow
                  : ""
                )
                  .replaceAll("%20", "_")
                  .replace(/[ -+]+/g, "_")}`
              : window.location.pathname
          }
          style={{
            height: "min-content",
            color:
              isDroppedIn &&
              isDroppedIn.community &&
              isDroppedIn.community.id !== parent.community.id
                ? "rgb(50,50,90)"
                : "rgb(70,70,130)",
            width: "100%",
            fontSize: "14px"
          }}
        >
          {user.username} {this.props.relationString}{" "}
          {parent.community
            ? parent.community.message
            : communityMessageToShow
            ? communityMessageToShow
            : ""}
        </Link>
      </div>
    );
  }
}
export default NotCommForum;
