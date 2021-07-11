import React from "react";
import Air from "./Air";
import Relation from "./Relation";

class PersonHeader extends React.Component {
  state = {};
  render() {
    const { thechats, swipe, auth, user, profile, showX } = this.props;
    var close = ["forum", "comments"].includes(swipe);
    var isMe = profile && auth !== undefined && profile.id === auth.uid;
    return (
      <div
        style={{
          backgroundColor: "rgba(20,20,60,.8)",
          display: "flex",
          position: "relative",
          alignItems: "flex-end",
          zIndex: close ? "-2" : "2",
          maxHeight: close ? "0px" : "min-content",
          height: "96px",
          transition: ".3s ease-out"
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            borderRight: "1px solid",
            height: "100%",
            width: "min-content"
          }}
        >
          {profile.photoThumbnail && (
            <div
              style={{
                height: "100%",
                display: "flex",
                position: "relative"
              }}
            >
              <img
                style={{
                  width: "auto",
                  height: "100%"
                }}
                src={profile.photoThumbnail}
                alt="error"
              />
            </div>
          )}
        </div>
        <div
          style={{
            color: "rgba(200,200,200,.6)",
            bottom: "0px",
            position: "relative",
            alignItems: "center",
            display: "flex",
            height: "45px"
          }}
        >
          <div
            style={{
              position: "absolute",
              zIndex: "1"
            }}
          >
            &nbsp;{profile.smiley}&nbsp;
          </div>
          <div
            style={{
              marginLeft: "2.5px",
              display: "flex",
              position: "relative",

              backgroundColor: `${profile && profile.profilergb}`,
              borderRadius: "45px",
              width: "25px",
              height: "25px"
            }}
          />
          <div
            style={{
              height: "min-content",
              marginLeft: "5px"
            }}
          >
            {profile && profile.name} @{profile && profile.username}
          </div>
        </div>
        <Air
          showX={showX}
          headerScrolling={this.props.headerScrolling}
          profile={this.props.profile}
          swipe={swipe}
          backX={this.props.backX}
          togglePaw={this.props.togglePaw}
        />
        {auth !== undefined && !isMe && (
          <Relation
            auth={auth}
            myCommunities={this.props.myCommunities}
            user={user}
            profile={profile}
            thechats={thechats}
          />
        )}
      </div>
    );
  }
}
export default PersonHeader;
