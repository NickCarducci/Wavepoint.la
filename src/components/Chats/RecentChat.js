import React from "react";
import PlanObject from "../Calendar/Invites/PlanObject";
import firebase from "../.././init-firebase";
import ".././Calendar/Day/DayCalBackdrop.css";

class RecentChat extends React.Component {
  state = { thisentity: false };
  componentDidMount = () => {
    this.props.ppl.entityId &&
      firebase
        .firestore()
        .collection(this.props.ppl.entityType)
        .doc(this.props.ppl.entityId)
        .get()
        .then((doc) => {
          var foo = doc.data();
          foo.id = doc.id;
          this.setState({ thisentity: foo });
        })
        .catch((err) => console.log(err.message));
    var boogie = this.props.recentChats.filter(
      (chat) =>
        (!chat.readUsers || !chat.readUsers.includes(this.props.auth.uid)) &&
        chat.threadId === this.props.ppl.threadId
    );
    if (boogie > 0) {
      this.interval = setInterval(
        () =>
          this.state.pulse
            ? this.setState({ pulse: false })
            : this.setState({ pulse: true }),
        300
      );
    }
    this.setState({ boogie });
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps !== this.props) {
      var boogie = this.props.recentChats.filter(
        (chat) =>
          (!chat.readUsers || !chat.readUsers.includes(this.props.auth.uid)) &&
          chat.threadId === this.props.ppl.threadId
      );
      if (boogie > 0) {
        this.interval = setInterval(
          () =>
            this.state.pulse
              ? this.setState({ pulse: false })
              : this.setState({ pulse: true }),
          300
        );
      }
      this.setState({ boogie });
    }
  };
  componentWillUnmount = () => {
    clearInterval(this.interval);
  };
  render() {
    const { ppl, permittedUsers, noteList, noteTitles } = this.props;
    const { boogie } = this.state;
    /*var profilergb =
      this.props.auth !== undefined &&
      permittedUsers.filter(
        x => x.id === ppl.authorId && x.id !== this.props.auth.uid
      );*/
    return (
      <div>
        <div className="chatname" onClick={this.props.achatisopen}>
          {!ppl.entity ? (
            (permittedUsers[0] ? permittedUsers[0] : permittedUsers)
              .photoThumbnail ? (
              <img
                alt="error"
                src={permittedUsers[0].photoThumbnail}
                style={{
                  width: "56px",
                  height: "auto",
                  borderRadius: "50px",
                  border: `${
                    (!boogie || boogie > 0) && this.state.pulse ? 0 : 1
                  }px solid rgb(250,220,220)`,
                  transition: ".3s ease-out"
                }}
              />
            ) : (
              <div
                style={{
                  backgroundColor: `${this.props.user.profilergb}`,
                  width: "26px",
                  height: "auto",
                  borderRadius: "50px",
                  border:
                    boogie && boogie > 0 ? `1px solid rgb(250,220,220)` : ""
                }}
              />
            )
          ) : (
            <img
              alt="error"
              src={ppl.entity.chosenPhoto.small}
              style={{
                width: "56px",
                height: "auto",
                borderRadius: "50px",
                border: `${
                  (!boogie || boogie > 0) && this.state.pulse ? 0 : 1
                }px solid rgb(250,220,220)`,
                transition: ".3s ease-out"
              }}
            />
          )}
          <div
            style={{
              marginLeft: "5px",
              display: "flex",
              position: "relative",
              flexDirection: "column",
              padding: "10px 0px"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "relative",
                flexWrap: "wrap"
              }}
            >
              {ppl.entity ? (
                <div>{ppl.entity.message}</div>
              ) : (
                permittedUsers &&
                permittedUsers.map((x) => {
                  if (
                    this.props.user !== undefined &&
                    x.username !== this.props.user.username
                  ) {
                    return <div key={x.id}>{x.username}</div>;
                  }
                  return x.username;
                })
              )}
            </div>
            <div style={{ fontSize: "15px", color: "#999" }}>{ppl.topic}</div>
            <div style={{ fontSize: "15px" }}>
              {ppl.message.match(/https:\/\//) ? (
                <img
                  src={`https://drive.google.com/thumbnail?id=${ppl.message.substring(
                    ppl.message.lastIndexOf("/d/") + 3,
                    ppl.message.lastIndexOf("/")
                  )}`}
                  alt="error"
                />
              ) : ppl.chosenPhoto ? (
                <img src={ppl.chosenPhoto.small} alt="error" />
              ) : ppl.date ? (
                <div
                  style={{
                    backgroundColor: "black",
                    display: "flex",
                    width: "300px",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    top: "0px",
                    bottom: "56px",
                    marginBottom: "10px",
                    height: "min-content",
                    textDecoration: "none"
                  }}
                >
                  <PlanObject
                    noteList={noteList}
                    noteTitles={noteTitles}
                    notes={this.props.notes}
                    auth={this.props.auth}
                    edmInitial={ppl.name}
                    eventInitial={!isNaN(ppl.date)}
                    eventsInitial={this.props.eventsInitial}
                    chooseInvite={this.props.chooseInvite}
                    //ref={this[index]}
                    //id={`${note._id}_ref`}
                    onDelete={this.props.onDelete}
                    handleSave={this.props.handleSave}
                    note={ppl}
                    users={this.props.users}
                    height={this.props.height}
                    opened={false}
                    open={(x) => {
                      this.setState({ opened: x });
                    }}
                  />
                  <div
                    style={{
                      top: "0px",
                      width: "100%",
                      height: "100%",
                      position: "absolute"
                    }}
                  ></div>
                </div>
              ) : (
                ppl.message
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: "15px",
            color: "#888",
            border: "1px solid blue",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-end"
          }}
        >
          {new Date(ppl.time.seconds * 1000).toLocaleString()}
          <div
            style={{
              width: "20px",
              margin: "7px",
              height: "20px",
              fontSize: "15px",
              color: "#888",
              border: "1px solid blue",
              right: "0px"
            }}
          ></div>
        </div>
      </div>
    );
  }
}
export default RecentChat;
