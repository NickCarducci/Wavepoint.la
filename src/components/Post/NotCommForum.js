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
          height: "min-content"
        }}
      >
        {/*<div style={{ display: opened === "" ? "flex" : "none" }}>
          <div
            style={{
              width: "max-content",
              marginLeft: "4px",
              marginTop: "4px",
              color: "grey",
              fontSize: "10px",
              border: "1px solid grey",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: "12px",
              right: "0px",
              wordBreak: "break-all",
              padding: "0px 2px"
            }}
          >
            {parent.collection ? parent.collection : "forum"}
          </div>
          <div
            style={{
              width: "max-content",
              marginLeft: "2px",
              marginTop: "4px",
              color: "grey",
              fontSize: "10px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: "12px",
              right: "0px",
              wordBreak: "break-all",
              padding: "0px 2px"
            }}
          >
            :
          </div>
          <div
            onClick={() => {
              if (
                this.props.auth !== undefined &&
                this.props.auth.uid === parent.authorId
              ) {
                this.setState({ changeIssue: true });
              }
            }}
            style={{
              width: "max-content",
              marginLeft: "4px",
              marginTop: "4px",
              color: "grey",
              fontSize: "10px",
              border: "1px solid grey",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: "12px",
              right: "0px",
              wordBreak: "break-all",
              padding: "0px 2px"
            }}
          >
            {parent.issue}
            {go && parent.budgetType}
            {go && parent.caseType}
            {go && parent.electionType}
            {go && parent.ordinanceType}
          </div>
          </div>*/}
        <div
          style={{
            height: "min-content"
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
              opened !== "" &&
              this.props.setChain({ opened: this.props.chainId })
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
            {user.username}{" "}
            {parent.community
              ? parent.community.authorId === parent.authorId
                ? "owns"
                : parent.community.admin &&
                  parent.community.admin.includes(parent.authorId)
                ? "is a admin of"
                : parent.community.faculty &&
                  parent.community.faculty.includes(parent.authorId)
                ? "is faculty of"
                : parent.community.members &&
                  parent.community.members.includes(parent.authorId)
                ? "is a member of"
                : "visited"
              : "visited"}{" "}
            {parent.community
              ? parent.community.message
              : communityMessageToShow
              ? communityMessageToShow
              : ""}
          </Link>
        </div>
      </div>
    );
  }
}
export default NotCommForum;
