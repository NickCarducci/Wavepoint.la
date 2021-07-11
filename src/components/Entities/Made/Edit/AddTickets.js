import React from "react";
import firebase from "../../../.././init-firebase";
import { GeoFirestore } from "geofirestore";
import StadiumBuilder from "./StadiumBuilder";

class AddTickets extends React.Component {
  state = {};
  render() {
    const { ticketCategories } = this.props;
    return (
      <div style={{ display: "flex", position: "relative" }}>
        <StadiumBuilder auth={this.props.auth} />
        {ticketCategories &&
          ticketCategories.map((x, idx) => {
            let y = ticketCategories ? ticketCategories : [];
            if (x) {
              return (
                <div className="addticketformonedit">
                  {x.ticketName}
                  <br />
                  {x.ticketQuant - x.attendeeQuant}&nbsp;left
                  <br />${x.ticketPrice}
                  <br />
                  <button
                    type="button"
                    onClick={() => {
                      delete y[idx];
                      console.log(y);
                      const geoFirestore = new GeoFirestore(
                        firebase.firestore()
                      );
                      const geocollection = geoFirestore.collection("planner");
                      geocollection.doc(this.props.eventID).update({
                        ticketCategories: firebase.firestore.FieldValue.arrayRemove(
                          {
                            ticketName: x.ticketName,
                            ticketQuant: x.ticketQuant,
                            ticketPrice: x.ticketPrice,
                            attendeeQuant: 0
                          }
                        )
                      });
                    }}
                  >
                    (-)
                  </button>
                </div>
              );
            } else return null;
          })}
        <div className="ticketwidget">
          <input
            placeholder="Ticket Category"
            autoComplete="off"
            value={this.state.ticketNameNew}
            id="ticketName"
            onChange={(e) =>
              this.setState({
                ticketNameNew: e.target.value
              })
            }
            required
          />
          <input
            placeholder="Amount of Tickets"
            autoComplete="off"
            value={this.state.ticketQuantNew}
            id="ticketQuant"
            onChange={(e) =>
              this.setState({
                ticketQuantNew: e.target.value
              })
            }
            required
          />
          <input
            placeholder="Price for Category"
            autoComplete="off"
            value={this.state.ticketPriceNew}
            id="ticketPrice"
            onChange={(e) =>
              this.setState({
                ticketPriceNew: e.target.value
              })
            }
            required
          />
          <button
            style={{
              display: "flex",
              position: "relative",
              width: "120px"
            }}
            type="button"
            onClick={() => {
              const geoFirestore = new GeoFirestore(firebase.firestore());
              const geocollection = geoFirestore.collection("planner");
              this.state.ticketNameNew !== "" &&
                this.state.ticketQuantNew !== "" &&
                this.state.ticketPriceNew !== "" &&
                geocollection.doc(this.state.eventID).update({
                  ticketCategories: firebase.firestore.FieldValue.arrayUnion({
                    ticketName: this.state.ticketNameNew,
                    ticketQuant: this.state.ticketQuantNew,
                    ticketPrice: this.state.ticketPriceNew,
                    attendeeQuant: 0
                  })
                });
              this.setState({
                ticketNameNew: "",
                ticketQuantNew: "",
                ticketPriceNew: ""
              });
            }}
          >
            Add Category
          </button>
        </div>
      </div>
    );
  }
}
export default AddTickets;
