import React from "react";
import TicketDispenser from "../../.././widgets/tool/TicketDispenser";
import firebase from "../../.././init-firebase";

class Eventopeninfo extends React.Component {
  render() {
    const { event, collection } = this.props;
    return (
      <div className="eventopeninfo">
        {this.props.eventsInitial ? (
          this.props.ticketCategories ? (
            this.props.ticketCategories.map((x) => {
              return (
                <TicketDispenser
                  x={x}
                  event={event}
                  auth={this.props.auth}
                  tickets={this.props.tickets}
                  user={this.props.user}
                />
              );
            })
          ) : (
            <div>No tickets for sale</div>
          )
        ) : this.props.classInitial || this.props.clubInitial ? (
          this.props.auth !== undefined ? (
            <div
              onClick={() => {
                if (
                  event.requests &&
                  event.requests.includes(this.props.auth.uid)
                ) {
                  firebase
                    .firestore()
                    .collection(collection)
                    .doc(event.id)
                    .update({
                      requests: firebase.firestore.FieldValue.arrayRemove(
                        this.props.auth.uid
                      )
                    });
                } else {
                  firebase
                    .firestore()
                    .collection(collection)
                    .doc(event.id)
                    .update({
                      requests: firebase.firestore.FieldValue.arrayUnion(
                        this.props.auth.uid
                      )
                    });
                }
              }}
            >
              Request
              {event.requests &&
                event.requests.includes(this.props.auth.uid) &&
                "ing..."}{" "}
              membership
            </div>
          ) : (
            <div
              onClick={this.props.getUserInfo} //to="/login"
            >
              login to request membership
            </div>
          )
        ) : null}
      </div>
    );
  }
}
export default Eventopeninfo;
