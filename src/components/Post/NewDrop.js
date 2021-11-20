import React from "react";
import DropId from "../.././widgets/DropId";

class NewDrop extends React.Component {
  state = {};
  render() {
    const { closeDrop, parent } = this.props;
    return (
      <div
        onMouseEnter={() => this.setState({ hoverDrop: true })}
        onMouseLeave={() => this.setState({ hoverDrop: false })}
        style={{
          display: "flex",
          color: "grey",
          opacity: this.state.hoverDrop ? "1" : ".3",
          transition: ".1s ease-in"
        }}
      >
        {this.props.auth !== undefined &&
          (closeDrop ? (
            <div
              onClick={() => this.props.openDrop({ closeDrop: false })}
              style={{
                height: "25px",
                width: "25px",
                backgroundColor: "rgba(20,20,20,.4)",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                transition: ".3s ease-out"
              }}
            />
          ) : (
            <div
              onClick={() => this.props.openDrop({ closeDrop: true })}
              style={{
                color: "white",
                backgroundColor: "rgb(30,30,30)",
                padding: "2px",
                fontSize: "12px",
                borderRadius: "5px",
                border: "1px solid grey"
              }}
            >
              close
            </div>
          ))}
        {this.props.auth !== undefined && (
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              transition: closeDrop ? ".3s ease-out" : ".1s ease-in"
            }}
          >
            {!closeDrop && (
              <DropId
                linkDrop={this.props.linkDrop}
                dropId={this.props.dropId}
                parent={parent}
                getCommunity={this.props.getCommunity}
                hydrateUser={this.props.hydrateUser}
                ughChats={this.props.ughChats}
                ugh={this.props.ugh}
                getUserInfo={this.props.getUserInfo}
                optionalDrop={true}
                height={this.props.height}
                width={this.props.width}
                users={this.props.users}
                user={this.props.user}
                auth={this.props.auth}
                communities={this.props.communities}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}
export default NewDrop;
