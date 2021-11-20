import React from "react";
import { Link } from "react-router-dom";
import VoteModule from "../.././Post/VoteModule";

class EventBlob extends React.Component {
  state = { closeFilter: true };
  render() {
    const { parent } = this.props;
    var thisone = parent.community && parent.community.message;
    var to =
      this.props.type === "club"
        ? "/clubs/" + thisone + "/" + parent.message
        : this.props.type === "restaurant"
        ? "/restaurants/" + thisone + "/" + parent.message
        : this.props.type === "shop"
        ? "/shops/" + thisone + "/" + parent.message
        : this.props.type === "service"
        ? "/services/" + thisone + "/" + parent.message
        : this.props.type === "page"
        ? "/pages/" + thisone + "/" + parent.message
        : this.props.type === "housing"
        ? "/housing/" + parent.id
        : this.props.type === "class"
        ? parent.endDate < new Date()
          ? {
              pathname:
                "/classes/" +
                thisone +
                "/" +
                parent.message +
                "/" +
                `${new Date(parent.endDate.seconds * 1000).getFullYear()}-${
                  new Date(parent.endDate.seconds * 1000).getMonth() + 1
                }-${new Date(parent.endDate.seconds * 1000).getDate()}`
            }
          : {
              pathname: "/classes/" + thisone + "/" + parent.message
            }
        : this.props.type === "department"
        ? {
            pathname: "/departments/" + thisone + "/" + parent.message
          }
        : this.props.type === "job"
        ? "/job/" + parent.id
        : parent.id.length > 10
        ? "/event/" + parent.id
        : "/events/edmtrain/" + parent.id;

    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          border: "2px solid #333",
          borderRadius: "15px",
          overflow: "hidden",
          width: "100%",
          alignItems: "center"
        }}
      >
        <Link to={to}>
          <img
            style={{
              display: "flex",
              position: "relative",
              width: "auto",
              height: "70px",
              overflow: "hidden",
              margin: "0px"
            }}
            src={parent.chosenPhoto.small}
            alt="error"
          />
        </Link>
        <Link
          to={to}
          style={{
            backgroundColor: "rgba(250,250,250,.7)",
            textDecoration: "none",
            color: "black",
            display: "flex",
            position: "absolute",
            justifyContent: "space-between",
            height: "min-content",
            width: "max-content",
            overflow: "hidden",
            alignItems: "center"
          }}
        >
          {parent.message.substr(0, 20)}
        </Link>
        <VoteModule
          closeDrop={true}
          closeFilter={this.state.closeFilter}
          setShowing={(parent) => this.setState(parent)}
          collection={parent.collection}
          individualTypes={this.props.individualTypes}
          community={parent.community}
          communities={this.props.communities}
          users={this.props.users}
          etypeChanger={this.props.etypeChanger}
          parent={parent}
          auth={this.props.auth}
          isMember={
            this.props.auth !== undefined &&
            parent.community &&
            (parent.community.privateVoting ||
              parent.community.members.includes(this.props.auth.uid) ||
              parent.community.admin.includes(this.props.auth.uid) ||
              parent.community.faculty.includes(this.props.auth.uid) ||
              parent.community.authorId === this.props.auth.uid)
          }
        />
      </div>
    );
  }
}
export default EventBlob;
