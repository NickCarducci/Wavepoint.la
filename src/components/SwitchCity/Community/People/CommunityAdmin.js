import React from "react";
import Profiler from "../../../.././widgets/Profiler";
import firebase from "../../../.././init-firebase.js";

class CommunityAdmin extends React.Component {
  render() {
    let drawerClasses = "eventtypes closedmap";
    let drawerClasses1 = "Etypebackdropclosedmap";
    if (this.props.show) {
      drawerClasses = "eventtypesmap";
      drawerClasses1 = "Etypebackdropmap";
    }
    return (
      <div
        style={{
          zIndex: this.props.show ? "9999" : "0",
          display: this.props.show ? "flex" : "none",
          position: "fixed",
          overflowX: "hidden",
          overflowY: "auto",
          height: "100%",
          width: "100%"
        }}
      >
        <div className={drawerClasses1} onClick={this.props.close} />
        <div className={drawerClasses}>
          Owner
          <div className="eventtypessetmap">
            {this.props.community && this.props.community.author && (
              <Profiler
                key={this.props.community.author.id}
                user={this.props.user}
                x={this.props.community.author}
                auth={this.props.auth}
              />
            )}
          </div>
          <br />
          Admin
          <div className="eventtypessetmap">
            {this.props.community &&
              this.props.community.adminProfiled &&
              this.props.community.adminProfiled.map((user) => {
                return (
                  <Profiler
                    key={user.id}
                    user={this.props.user}
                    x={user}
                    auth={this.props.auth}
                  />
                );
              })}
          </div>
          <br />
          Faculty
          <div className="eventtypessetmap">
            {this.props.community &&
              this.props.community.delegatesProfiled &&
              this.props.community.delegatesProfiled.map((user) => {
                return (
                  <Profiler
                    key={user.id}
                    user={this.props.user}
                    x={user}
                    auth={this.props.auth}
                  />
                );
              })}
          </div>
          <br />
          Members
          <div className="eventtypessetmap">
            {this.props.community &&
              this.props.community.members &&
              this.props.community.members.map((user) => {
                return (
                  <Profiler
                    key={user.id}
                    user={this.props.user}
                    x={user}
                    auth={this.props.auth}
                  />
                );
              })}
          </div>
          <br />
          Judges
          <div className="eventtypessetmap">
            {this.props.community &&
              this.props.community.judgesProfiled &&
              this.props.community.judgesProfiled.map((user) => {
                return (
                  <Profiler
                    key={user.id}
                    user={this.props.user}
                    x={user}
                    auth={this.props.auth}
                  />
                );
              })}
          </div>
          <br />
          Representatives
          <div className="eventtypessetmap">
            {this.props.community &&
              this.props.community.representativesProfiled &&
              this.props.community.representativesProfiled.map((user) => {
                return (
                  <div key={user.id}>
                    <Profiler
                      user={this.props.user}
                      x={user}
                      auth={this.props.auth}
                    />

                    {this.props.auth !== undefined &&
                    (this.props.community.authorId === this.props.auth.uid ||
                      (this.props.community.admin &&
                        this.props.community.admin.includes(
                          this.props.auth.uid
                        )) ||
                      (this.props.community.memberMakers &&
                        this.props.community.memberMakers.includes(
                          this.props.auth.uid
                        ))) ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          var answer = this.state[user.id + "newTitle"];
                          if (answer && answer !== "") {
                            firebase
                              .firestore()
                              .collection("users")
                              .doc(user.id)
                              .update({
                                [this.props.community.id]: this.state[
                                  user.id + "newTitle"
                                ]
                              });
                          }
                        }}
                      >
                        <input
                          defaultValue={user[this.props.community.id]}
                          className="input"
                          placeholder="title"
                          onChange={(e) =>
                            this.setState({
                              [user.id + "newTitle"]: e.target.value
                            })
                          }
                        />
                      </form>
                    ) : (
                      <div style={{ color: "grey", fontSize: "14px" }}>
                        {user[this.props.community.id]}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}
export default CommunityAdmin;
