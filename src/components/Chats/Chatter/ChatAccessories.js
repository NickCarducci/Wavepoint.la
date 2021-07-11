import React from "react";
import FilterSenders from "./FilterSenders";
import AddRemoveSenders from "./AddRemoveSenders";

class ChatAccessories extends React.Component {
  render() {
    var placeholderusersearch = this.props.filterBySender ? "Search" : "Search";
    //console.log(this.props.profileChecker);
    return (
      <div
        style={
          this.props.profileChecker && !this.props.openusersearch
            ? {
                display: "flex",
                position: "fixed",
                backgroundColor: "rgba(35, 108, 255, 0.121)",
                flexDirection: "column",
                color: "white",
                zIndex: "9999",
                width: "100%",
                height: "100%"
              }
            : this.props.openusersearch
            ? {
                display: "flex",
                position: "fixed",
                backgroundColor: "rgba(35, 108, 255, 0.121)",
                flexDirection: "column",
                top: "0px",
                right: "0px",
                color: "white",
                zIndex: "9999",
                width: "300px",
                height: "500px"
              }
            : { display: "none" }
        }
      >
        <div
          onClick={this.props.opentheusersearch2}
          style={
            this.props.openusersearch
              ? {
                  display: "flex",
                  position: "fixed",
                  flexDirection: "column",
                  color: "white",
                  backgroundColor: "rgba(35, 108, 255, 0.721)",
                  top: "0px",
                  right: "0px",
                  zIndex: "9999",
                  width: "300px",
                  height: "500px"
                }
              : { display: "none" }
          }
        />
        {/*<div
          onClick={this.props.opentheusersearch}
          style={
            this.props.openusersearch
              ? {
                  display: "flex",
                  position: "fixed",
                  flexDirection: "column",
                  backgroundColor: "rgba(22, 22, 27, 0.787)",
                  color: "white",
                  zIndex: "9999",
                  width: "100%",
                  height: "100%"
                }
              : {
                  display: "none"
                }
          }
        />*/}
        <form
          onSubmit={e => {
            e.preventDefault();
            return false;
          }}
          style={
            this.props.openusersearch
              ? {
                  display: "flex",
                  position: "fixed",
                  flexDirection: "column",
                  backgroundColor: "rgba(35, 108, 255, 0.721)",
                  color: "white",
                  zIndex: "9999",
                  top: "30px",
                  right: "100px",
                  width: "200px",
                  height: "200px"
                }
              : {
                  display: "none"
                }
          }
        >
          <input
            value={this.props.userQuery}
            placeholder={placeholderusersearch}
            style={{
              display: "flex",
              position: "relative",
              flexDirection: "column",
              backgroundColor: "#333",
              border: "3px solid #333",
              borderRadius: "0px",
              height: "20px",
              color: "white",
              zIndex: "9999",
              fontSize: "18px"
            }}
            maxLength="30"
            onChange={this.props.changeUserQuery}
          />
          {/*




// filter + empty query
*/}
          <FilterSenders
            removeSelf={this.props.removeSelf}
            filterBySender={this.props.filterBySender}
            userQuery={this.props.userQuery}
            changeFilteredSenders={this.props.changeFilteredSenders}
            recipients={this.props.recipients}
            users={this.props.users}
            auth={this.props.auth}
            filteredSenders={this.props.filteredSenders}
            user={this.props.user}
            openusersearch={this.props.openusersearch}
          />
          <AddRemoveSenders
            alterRecipients={this.props.alterRecipients}
            entityId={this.props.entityId}
            entityType={this.props.entityType}
            usersforaddrem={this.props.usersforaddrem}
            userQuery={this.props.userQuery}
            auth={this.props.auth}
            removeUserfromRec={this.props.removeUserfromRec}
            addUsertoRec={this.props.addUsertoRec}
            recipients={this.props.recipients}
            filterBySender={this.props.filterBySender}
            user={this.props.user}
            users={this.props.users}
            openusersearch={this.props.openusersearch}
          />
        </form>
        <div
          //onClick={this.props.filterBySenderToggle}
          style={
            this.props.openusersearch
              ? {
                  display: "flex",
                  position: "absolute",
                  zIndex: "9999",
                  height: "36px",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px white solid",
                  borderRadius: "45px",
                  padding: "5px 0px",
                  color: "rgba(250,250,250,.687)",
                  flexDirection: "column",
                  backgroundColor: "rgba(51,51,51,.687)",
                  top: "230px",
                  right: "98px",
                  width: "200px"
                }
              : {
                  display: "none"
                }
          }
        >
          {this.props.userQuery === ""
            ? "Filter by author"
            : "Add/remove users"}
          <div style={{ fontSize: "12px", color: "rgba(119,136,153,.687)" }}>
            {this.props.userQuery === ""
              ? "ADD/REMOVE USERS"
              : "FILTER BY AUTHOR"}
          </div>
        </div>
      </div>
    );
  }
}
export default ChatAccessories;
