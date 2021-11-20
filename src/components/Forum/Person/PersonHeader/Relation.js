import React from "react";
import firebase from "../../../.././init-firebase";

class Relation extends React.Component {
  render() {
    const { thechats, user, profile, myCommunities, auth } = this.props;
    return (
      <div
        style={{
          padding: "10px",
          left: "0px",
          width: "70%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          top: "0px",
          zIndex: "9",
          backgroundColor: "rgba(250, 250, 250, 1)"
        }}
      >
        {thechats.length > 5000 ? (
          <div>5000+</div>
        ) : thechats.length > 2000 ? (
          <div>
            <div style={{ display: "flex", width: "100%" }}>
              {thechats.length}&nbsp;
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  borderRadius: "100px",
                  borderBottomLeftRadius: "0px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "rgba(200,70,20,.4)",
                  border: "3px solid rgb(200,70,20)"
                }}
              />
            </div>
            like family
          </div>
        ) : thechats.length > 300 ? (
          <div>
            <div style={{ display: "flex", width: "100%" }}>
              {thechats.length}&nbsp;
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  borderRadius: "100px",
                  borderBottomLeftRadius: "0px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "rgba(200,20,70,.4)",
                  border: "3px solid rgb(200,20,70)"
                }}
              />
            </div>
            person
          </div>
        ) : thechats.length > 50 ? (
          <div>
            <div style={{ display: "flex", width: "100%" }}>
              {thechats.length}&nbsp;
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  borderRadius: "100px",
                  borderBottomLeftRadius: "0px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "rgba(100,150,200,.4)",
                  border: "3px solid rgb(100,150,200)"
                }}
              />
            </div>
            friend
          </div>
        ) : thechats.length > 25 ? (
          <div>
            <div style={{ display: "flex", width: "100%" }}>
              {thechats.length}&nbsp;
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  borderRadius: "100px",
                  borderBottomLeftRadius: "0px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "rgba(200,200,20,.4)",
                  border: "3px solid rgb(200,200,20)"
                }}
              />
            </div>
            buddy
          </div>
        ) : thechats.length > 1 ? (
          <div>
            <div style={{ display: "flex", width: "100%" }}>
              {thechats.length}&nbsp;
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  borderRadius: "100px",
                  borderBottomLeftRadius: "0px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "rgba(20,70,200,.4)",
                  border: "3px solid rgb(20,70,200)"
                }}
              />
            </div>
            acquaintance
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", width: "100%" }}>
              {thechats.length}&nbsp;
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  borderRadius: "100px",
                  borderBottomLeftRadius: "0px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "rgba(20,70,200,.4)",
                  border: "3px solid rgb(20,70,200)"
                }}
              />
            </div>
            pedestrian
          </div>
        )}
        <div
          style={
            auth !== undefined &&
            user.blockedUsers &&
            user.blockedUsers.includes(profile.id)
              ? {
                  height: "min-content",
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  top: "10px",
                  right: "0px",
                  border: "1px solid #444",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  width: "max-content"
                }
              : {
                  height: "min-content",
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  top: "10px",
                  right: "0px",
                  color: "grey",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  width: "max-content"
                }
          }
          onClick={() => {
            if (auth !== undefined) {
              if (user.blockedUsers && user.blockedUsers.includes(profile.id)) {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(auth.uid)
                  .update({
                    blockedUsers: firebase.firestore.FieldValue.arrayRemove(
                      profile.id
                    )
                  });
              } else {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(auth.uid)
                  .update({
                    blockedUsers: firebase.firestore.FieldValue.arrayUnion(
                      profile.id
                    )
                  });
              }
            } else {
              var answer = window.confirm("login?");
              if (answer) {
                this.props.history.push("/login");
              }
            }
          }}
        >
          {user.blockedUsers && user.blockedUsers.includes(profile.id) ? (
            <span role="img" aria-label="block">
              &#128721;forum
            </span>
          ) : null}
          <div>Block</div>
        </div>
        <br />
        <div
          style={
            myCommunities &&
            myCommunities.find((h) => h.blockedForum.includes(profile.id))
              ? {
                  height: "min-content",
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  top: "10px",
                  right: "0px",
                  border: "1px solid #444",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  width: "max-content"
                }
              : {
                  height: "min-content",
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  top: "10px",
                  right: "0px",
                  color: "grey",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  width: "max-content"
                }
          }
        >
          {myCommunities &&
            myCommunities.find((h) => h.blockedForum.includes(profile.id)) &&
            "Blocked by"}{" "}
          {myCommunities.length > 0 ? (
            myCommunities.map((h) =>
              h.blockedForum && h.blockedForum.includes(profile.id) ? (
                <div
                  key={h.id}
                  onClick={() => {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(h.id)
                      .update({
                        blockedForum: firebase.firestore.FieldValue.arrayRemove(
                          profile.id
                        )
                      });
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    color: "black"
                  }}
                >
                  {h.blockedForum && h.blockedForum.includes(profile.id) ? (
                    <span role="img" aria-label="block">
                      &#128721;
                    </span>
                  ) : null}
                  - tickets & comments {h.message}
                </div>
              ) : (
                <div
                  key={h.id}
                  onClick={() => {
                    firebase
                      .firestore()
                      .collection("communities")
                      .doc(h.id)
                      .update({
                        blockedForum: firebase.firestore.FieldValue.arrayUnion(
                          profile.id
                        )
                      });
                  }}
                  style={{ color: "grey" }}
                >
                  {h.message}
                </div>
              )
            )
          ) : (
            <div>You admin nothing</div>
          )}
        </div>
        <br />
        <div
          style={
            user.mutedUsers && user.mutedUsers.includes(profile.id)
              ? {
                  height: "min-content",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  marginTop: "20px",
                  right: "0px",
                  border: "1px solid #444",
                  zIndex: "9999",
                  width: "max-content"
                }
              : {
                  height: "min-content",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  marginTop: "20px",
                  right: "0px",
                  color: "grey",
                  zIndex: "9999",
                  width: "max-content"
                }
          }
          onClick={() => {
            if (auth !== undefined) {
              if (user.mutedUsers && user.mutedUsers.includes(profile.id)) {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(auth.uid)
                  .update({
                    mutedUsers: firebase.firestore.FieldValue.arrayRemove(
                      profile.id
                    )
                  })
                  .catch((err) => console.log(err.message));
              } else {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(auth.uid)
                  .update({
                    mutedUsers: firebase.firestore.FieldValue.arrayUnion(
                      profile.id
                    )
                  })
                  .catch((err) => console.log(err.message));
              }
            } else {
              var answer = window.confirm("login?");
              if (answer) {
                this.props.history.push("/login");
              }
            }
          }}
        >
          {user.mutedUsers && user.mutedUsers.includes(profile.id) ? (
            <span role="img" aria-label="mute">
              &#x1f92b;
            </span>
          ) : null}
          {user.mutedUsers && user.mutedUsers.includes(profile.id)
            ? "Muted:chats in spam"
            : "Mute"}
        </div>
      </div>
    );
  }
}
export default Relation;
