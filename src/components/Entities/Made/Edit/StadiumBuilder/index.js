import React from "react";
import firebase from "../../../../.././init-firebase";
import SeatDiagram from "./SeatDiagram";

class StadiumBuilder extends React.Component {
  state = { stadiums: [], name: "", address: "" };
  componentDidMount = () => {
    firebase
      .firestore()
      .collection("stadiums")
      .where("admin", "array-contains", this.props.auth.uid)
      .onSnapshot((querySnapshot) => {
        let stadiums = [];
        let q = 0;
        querySnapshot.docs.forEach((doc) => {
          q++;
          if (doc.exists) {
            var foo = doc.data();
            foo.id = doc.id;
            stadiums.push(foo);
          }
        });
        if (
          querySnapshot.docs.length === q &&
          this.state.stadiums !== stadiums
        ) {
          this.setState({ stadiums });
        }
      });
  };
  componentDidUpdate = () => {
    if (this.state.chosenStadium !== this.state.lastChosenStadium) {
      firebase
        .firestore()
        .collection("seats")
        .where("stadiumId", "==", this.state.chosenStadium.id)
        .onSnapshot((querySnapshot) => {
          let seats = [];
          let q = 0;
          querySnapshot.docs.forEach((doc) => {
            q++;
            if (doc.exists) {
              var foo = doc.data();
              foo.id = doc.id;
              seats.push(foo);
            }
          });
          if (querySnapshot.docs.length === q && this.state.seats !== seats) {
            this.setState({ seats });
          }
        });
      this.setState({ lastChosenStadium: this.state.chosenStadium });
    }
  };
  render() {
    return (
      <div style={{ width: "100%", height: "min-content" }}>
        {this.state.stadiums.length > 0 && (
          <select
            value={this.state.chosenStadium}
            onChange={(e) => this.setState({ chosenStadium: e.target.id })}
          >
            {" "}
            {this.state.stadiums.map((x, i) => {
              return (
                <option key={i} id={x.id}>
                  {x.name}
                </option>
              );
            })}
          </select>
        )}
        {this.state.createNewStadium ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (this.state.name !== "" && this.state.address !== "") {
                firebase
                  .firestore()
                  .collection("stadiums")
                  .add({
                    name: this.state.name,
                    address: this.state.address
                  })
                  .then(() => {
                    this.setState({
                      name: "",
                      address: ""
                    });
                  })
                  .catch((err) => console.log(err.message));
              }
            }}
          >
            <input placeholder="name" />
            <input placeholder="address" />
          </form>
        ) : (
          <div
            style={{
              border: "rgb(200,230,255)",
              borderRadius: "12px",
              width: "100%",
              height: "56px",
              backgroundColor: "rgb(100,175,250)"
            }}
          >
            +
          </div>
        )}
        {this.state.chosenStadium && <SeatDiagram seats={this.state.seats} />}
      </div>
    );
  }
}
export default StadiumBuilder;
