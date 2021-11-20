import React from "react";
import firebase from "../.././init-firebase";
import { GeoFirestore } from "geofirestore";
import { Link } from "react-router-dom";
//import { QRCode } from "react-qr-svg";

class TicketDispenser extends React.Component {
  state = { amountoftickets: 0 };
  render() {
    const { x, event } = this.props;
    const geoFirestore = new GeoFirestore(firebase.firestore());
    let lo = [];
    return (
      <div className="addticketformonedit">
        {this.props.tickets &&
          this.props.tickets
            .filter((y) =>
              y.eventId === event.id && x.ticketName === y.ticketName
                ? lo.push(y)
                : false
            )
            .map((fo) => (
              <div>
                Here are your tickets
                {/*<QRCode
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="Q"
                  style={{ width: 256 }}
                  value={fo.id}
                />*/}
              </div>
            ))}
        {x.ticketName}
        <br />
        {x.ticketQuant - x.attendeeQuant}&nbsp;left
        <br />${x.ticketPrice}
        <br />
        {this.props.auth !== undefined &&
        this.props.users
          .filter((f) => x.admins.includes(f.id))
          .every((f) => f.blockedUsers.indexOf(this.props.auth.uid) < 1) &&
        this.props.users
          .find((f) => event.authorId === f.id)
          .blockedUsersAuthored.indexOf(this.props.auth.uid) < 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();

              let gee = [];
              for (let x = 0; x < this.state.amountoftickets; x++) {
                gee.push(this.props.auth.uid);
              }
              firebase.firestore().collection("tickets").add({
                eventId: event.id,
                ticketName: x.ticketName,
                admittees: gee,
                purchaseDate: new Date()
              });

              const geocollection1 = geoFirestore.collection("planner");
              geocollection1.doc(event.id).update({
                attendeeQuant: firebase.firestore.FieldValue.increment(
                  gee.length
                )
              });
              this.setState({ amountoftickets: 0 });
            }}
          >
            <input
              className="forplaceholderticket"
              placeholder={this.state.amountoftickets}
              onChange={(e) =>
                this.setState({
                  amountoftickets: e.target.value
                })
              }
              type="number"
            />
            <button onClick={() => {}}>+</button>
          </form>
        ) : this.props.auth.uid !== undefined &&
          this.props.users
            .filter((f) => x.admins.includes(f.id))
            .every((f) => f.blockedUsers.indexOf(this.props.auth.uid) < 1) ? (
          <div>
            one admin has blocked your permission to buy
            <div
              onClick={() => {
                this.props.users
                  .filter((f) => x.admins.includes(f.id))
                  .filter((f) => f.blockedUsers.includes(this.props.auth.uid))
                  .map((b) => {
                    if (this.props.user.requestForgivenessFrom.includes(b.id)) {
                      return firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.auth.uid)
                        .update({
                          requestForgivenessFrom: firebase.firestore.FieldValue.arrayRemove(
                            b.id
                          )
                        });
                    } else
                      return firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.auth.uid)
                        .update({
                          requestForgivenessFrom: firebase.firestore.FieldValue.arrayUnion(
                            b.id
                          )
                        });
                  });
              }}
            >
              {x.admins.find((g) =>
                this.props.user.requestForgivenessFrom.includes(g)
              )
                ? "Undo request"
                : "Request forgiveness"}
            </div>
          </div>
        ) : this.props.auth.uid !== undefined ? (
          <div>
            the author has blocked your permission to buy
            <div
              onClick={() => {
                this.props.users
                  .filter((f) => event.authorId === f.id)
                  .map((b) => {
                    if (this.props.user.requestForgivenessFrom.includes(b.id)) {
                      return firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.auth.uid)
                        .update({
                          requestForgivenessFrom: firebase.firestore.FieldValue.arrayRemove(
                            b.id
                          )
                        });
                    } else
                      return firebase
                        .firestore()
                        .collection("users")
                        .doc(this.props.auth.uid)
                        .update({
                          requestForgivenessFrom: firebase.firestore.FieldValue.arrayUnion(
                            b.id
                          )
                        });
                  });
              }}
            >
              {this.props.user.requestForgivenessFrom.includes(x.authorId)
                ? "Undo request"
                : "Request forgiveness"}
            </div>
          </div>
        ) : (
          <Link to="/login" style={{ color: "white" }}>
            Login to buy
          </Link>
        )}
        {/*<button
        type="button"
        onClick={() => {
          delete y[idx];
          this.setState({
            tickets: [...y]
          });
        }}
      >
        (-)
      </button>*/}
      </div>
    );
  }
}
export default TicketDispenser;
