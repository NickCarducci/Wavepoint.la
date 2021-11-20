import React from "react";
import search1 from ".././Icons/Images/search1.png";
import sort from ".././Icons/Images/sort.png";
import firebase from "../.././init-firebase";
import * as geofirestore from "geofirestore";
import { Link } from "react-router-dom";

class ChatsHeader extends React.Component {
  state = {};
  render() {
    const { standbyMode } = this.props;
    var placeholdersearch =
      this.props.chatFilterChosen === "users"
        ? "Usernames"
        : this.props.chatFilterChosen === "clubs"
        ? "Clubs"
        : this.props.chatFilterChosen === "shops"
        ? "Shops"
        : this.props.chatFilterChosen === "restaurants"
        ? "Restaurants"
        : this.props.chatFilterChosen === "services"
        ? "Services"
        : this.props.chatFilterChosen === "classes"
        ? "Classes"
        : this.props.chatFilterChosen === "departments"
        ? "Departments"
        : "what?";
    var t = {};
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (this.props.chatFilterChosen === "users") {
            return false;
          } else if (
            !["classes", "departments"].includes(this.props.chatFilterChosen)
          ) {
            const firestore = firebase.firestore();
            const GeoFirestore = geofirestore.initializeApp(firestore);
            const geocollection = GeoFirestore.collection(
              this.props.chatFilterChosen
            );
            t.center = t.center
              ? t.center
              : new firebase.firestore.GeoPoint(0, 0);
            t.center1 = t.center1
              ? t.center1
              : new firebase.firestore.GeoPoint(0, 72);
            t.center2 = t.center2
              ? t.center2
              : new firebase.firestore.GeoPoint(0, 144);
            t.center3 = t.center3
              ? t.center3
              : new firebase.firestore.GeoPoint(0, -144);
            t.center4 = t.center4
              ? t.center4
              : new firebase.firestore.GeoPoint(0, -72);
            [t.center, t.center1, t.center2, t.center3, t.center4].map((x) =>
              geocollection
                .near({ center: x, radius: 8587 })
                .where(
                  "titleAsArray",
                  "array-contains",
                  this.props.userQuery.toLowerCase()
                )
                //.orderBy("titleAsArray")
                .limit(25)
                .onSnapshot((querySnapshot) => {
                  let clubResults = [];
                  let p = 0;
                  if (querySnapshot.empty) {
                    console.log("empty");
                  } else {
                    querySnapshot.docs.forEach((doc) => {
                      p++;
                      if (doc.exists) {
                        var foo = doc.data();
                        foo.id = doc.id;
                        clubResults.push(foo);
                        if (p === querySnapshot.docs.length) {
                          this.props.pushEntityResults(clubResults);
                        }
                      }
                    });
                  }
                })
            );
            this.setState({ hideMore: false });
          } else {
            firebase
              .firestore()
              .collection(this.props.chatFilterChosen)
              .where(
                "titleAsArray",
                "array-contains",
                this.props.userQuery.toLowerCase()
              )
              //.limit(25)
              .onSnapshot(
                (querySnapshot) => {
                  let clubResults = [];
                  let p = 0;
                  if (querySnapshot.empty) {
                    console.log("empty");
                    if (this.props.chatFilterChosen === "classes") {
                      let i = 0;
                      let clubResults = [];
                      firebase
                        .firestore()
                        .collection("oldClasses")
                        .where(
                          "titleAsArray",
                          "array-contains",
                          this.props.userQuery.toLowerCase()
                        )
                        //.orderBy("titleAsArray")
                        .limit(25)
                        .onSnapshot(
                          (querySnapshot) => {
                            querySnapshot.docs.forEach((doc) => {
                              i++;
                              if (doc.exists) {
                                var result = doc.data();
                                result.id = doc.id;
                                clubResults.push(result);
                                if (i === querySnapshot.docs.length)
                                  this.props.pushEntityResults(clubResults);
                              }
                            });
                          },
                          (e) => console.log(e.message)
                        );
                    }
                  } else {
                    querySnapshot.docs.forEach((doc) => {
                      p++;
                      if (doc.exists) {
                        var foo = doc.data();
                        foo.id = doc.id;
                        clubResults.push(foo);
                        if (p === querySnapshot.docs.length) {
                          this.props.pushEntityResults(clubResults);
                        }
                      }
                    });
                  }
                },
                (e) => console.log(e.message)
              );
            this.setState({ hideMore: false });
          }
        }}
        style={{
          display:
            !this.props.chatsopen || this.props.pathname === "/login"
              ? "none"
              : "flex",
          position: "relative",
          zIndex: 5,
          border: "none",
          height: "56px",
          width: "100%",
          backgroundColor: "#844fff",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "26px"
        }}
      >
        <div
          onClick={() =>
            this.props.user !== undefined && this.props.profileOpener()
          }
          style={{
            position: "relative",
            width: "56px",
            height: "100%"
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,.6)",
              height: "100%",
              position: "absolute",
              zIndex: "1",
              width: "100%"
            }}
          >
            <div
              style={{
                boxShadow: `0px 0px ${standbyMode ? 10 : 0}px ${
                  standbyMode ? 10 : 0
                }px rgb(150,200,255)`,
                textAlign: "center",
                top: "calc(50% - 10px)",
                position: "absolute",
                zIndex: "1",
                width: "100%"
              }}
            >
              <i
                className="fas fa-key"
                style={{
                  position: "absolute",
                  WebkitTextStroke: "1px rgb(240,240,180)",
                  margin: "auto",
                  color: "rgb(150,150,250)"
                }}
              ></i>
              &nbsp;.&nbsp;
              <i
                className="fas fa-box"
                style={{
                  fontSize: "20px",
                  color: "rgb(150,150,250)",
                  WebkitTextStroke: "1px rgb(240,240,180)"
                }}
              ></i>
            </div>
          </div>
          {this.props.user !== undefined ? (
            !this.props.chatsopen || this.props.pathname === "/login" ? null : (
              <img
                src={this.props.user.photoThumbnail}
                alt="error"
                style={{
                  height: "100%",
                  width: "56px"
                }}
              />
            )
          ) : (
            <Link
              to={{
                state: {
                  openChatWhenClose: true
                },
                pathname: "/login"
              }}
            >
              Login
            </Link>
          )}
        </div>
        &nbsp;
        <div>
          <div>search</div>
          <div style={{ display: "flex" }}>
            <img
              src={search1}
              style={{
                zIndex: "1",
                display: this.props.achatisopen ? "flex" : "none",
                position: "relative",
                height: "42px",
                width: "42px"
              }}
              alt="error"
            />
            <input
              value={this.props.userQuery}
              style={{
                display: "flex",
                position: "relative",
                backgroundColor: "rgba(0,0,0,0)",
                color: "rgba(255, 255, 255, 0.644)",
                fontSize:
                  this.props.width < 300
                    ? "16px"
                    : this.props.width < 600
                    ? "20px"
                    : "26px",
                left: "0px",
                width: "100%",
                border: "none"
              }}
              onChange={this.props.editUserQuery}
              placeholder={placeholdersearch}
            />
          </div>
        </div>
        {this.props.showclear && (
          <div
            onClick={this.props.clearQuery}
            style={{
              top: "11px",
              fontSize: this.props.userQuery === "" ? "" : "14px",
              right: "120px",
              justifyContent: "flex-end",
              alignItems: "center",
              display: "flex",
              position: "fixed",
              borderRadius: "10px",
              height: "20px",
              width: "20px",
              backgroundColor: "rgb(255, 255, 255)",
              color: "#844fff",
              opacity: this.props.userQuery === "" ? ".1" : ".9"
            }}
          >
            <div>&times;&nbsp;</div>
          </div>
        )}
        {/*<img
            onClick={this.props.chatscloser}
            src="https://www.dl.dropboxusercontent.com/s/zw3yisjvrkdwm03/switch%20accounts%20icon%20%281%29.png?dl=0"
            className="switch_accounts"
            alt="error"
          />*/}
        <img
          onClick={this.props.openCommsSort}
          src={sort}
          style={{
            display: this.props.showsort ? "flex" : "none",
            position: "absolute",
            top: "0px",
            right: "56px",
            height: "56px",
            width: "56px",
            zIndex: "9990"
          }}
          alt="error"
        />
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            top: "5px",
            right: "10px",
            textDecoration: "none",
            display: "flex",
            position: "absolute",
            backgroundColor: "rgb(230, 240, 250)",
            width: "36px",
            height: "46px",
            borderRadius: "20px",
            color: "navy",
            transition: ".3s ease-in",
            zIndex: "1"
          }}
          onClick={() => {
            this.props.setFoundation({
              chatsopen: !this.props.chatsopen,
              closeAllStuff: true,
              started: false
            });
            !this.props.forumOpen && this.props.setIndex({ forumOpen: true });
          }}
        >
          <div
            style={{
              left: "8px",
              position: "absolute",
              width: "10px",
              height: "10px",
              transform: "rotate(45deg)",
              borderTop: "3px solid",
              borderRight: "3px solid"
            }}
          ></div>
        </div>
      </form>
    );
  }
}

export default ChatsHeader;
