import React from "react";
import WeatherCitySky from ".././SwitchCity/WeatherCitySky";

class VoteModuleFilter extends React.Component {
  state = {
    citySearch: "",
    predictions: []
  };
  render() {
    const { predictions } = this.state;
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          backgroundColor: "rgb(200,200,200)",

          height: "min-content",
          width: "100%"
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(200,200,200)",
            margin: "6px",
            border: "3px solid blue",
            height: "min-content",
            width: "min-content",
            borderRadius: "5px"
          }}
        >
          <select
            style={{
              margin: "6px",
              marginBottom: "0px",
              border: "3px solid blue",
              width: "min-content",
              borderRadius: "5px",
              opacity: ".5"
            }}
            onChange={this.props.selectFind}
          >
            <option>city</option>
            <option>community</option>
          </select>

          {this.props.find === "city" ? (
            <form
              style={{
                margin: "6px",
                border: "3px solid blue",
                width: "min-content",
                height: "min-content",
                borderRadius: "5px"
              }}
              onSubmit={async (e) => {
                e.preventDefault();

                const letterEntered = /^[\W\D]/;
                const enteredValue = this.state.citySearch;
                if (letterEntered.test(enteredValue)) {
                  await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${enteredValue}.json?limit=5&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
                  )
                    .then(async (response) => await response.json())
                    .then(
                      (body) => {
                        this.setState({ predictions: body.features });
                      },
                      (err) => console.log(err)
                    )
                    .catch((err) => {
                      console.log(err);
                      this.setState({ city: "", address: "" });
                      alert("please use a neighbor's address, none found");
                    });
                }
              }}
            >
              <div style={{ display: "flex" }}>
                <input
                  className="input"
                  style={{
                    margin: "6px",
                    border: "3px solid blue",
                    width: "min-content",
                    borderRadius: "5px"
                  }}
                  value={this.state.citySearch}
                  onChange={(e) =>
                    this.setState({ citySearch: e.target.value })
                  }
                />
                <div
                  onClick={() => {
                    if (this.state.citySearch) {
                      this.setState({ citySearch: "", predictions: [] });
                    } else {
                      this.props.selectFind({ target: { value: null } });
                    }
                  }}
                  style={{
                    margin: "6px",
                    border: "3px solid blue",
                    borderRadius: "5px",

                    width: "30px",
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  -
                </div>
              </div>
            </form>
          ) : this.props.find === "community" ? (
            <select
              style={{
                margin: "6px",
                marginBottom:
                  (this.props.find === "community" &&
                    this.props.chosenCommunity.id) ||
                  this.props.city !== ""
                    ? "0px"
                    : "6px",
                border: "3px solid blue",
                width: "min-content",
                borderRadius: "5px"
              }}
              value={this.props.chosenCommunity.message}
              onChange={this.props.selectCommunity}
            >
              {this.props.communities &&
                this.props.communities.map((parent) => {
                  if (!this.props.chosenCommunity.privateVoting) {
                    return (
                      <option key={parent.id} id={parent.id}>
                        {parent.message}
                      </option>
                    );
                  } else if (this.props.chosenCommunity.id === parent.id) {
                    return (
                      <option key={parent.id} id={parent.id}>
                        {parent.message}
                      </option>
                    );
                  } else return null;
                })}
            </select>
          ) : (
            <div
              style={{
                width: "max-content",
                border: "3px solid blue",
                backgroundColor: "blue",
                borderRadius: "7px",
                color: "white",
                padding: "0px 10px",
                margin: "6px"
              }}
              onClick={() =>
                this.props.selectFind({ target: { value: "city" } })
              }
            >
              + city
            </div>
          )}
          {this.props.find === "city" && (
            <div
              style={{
                borderRadius: "5px",
                display: "flex",
                flexWrap: "wrap",
                position: "absolute",
                width: "100%"
              }}
            >
              {this.state.citySearch !== ""
                ? predictions && predictions.length > 0
                  ? predictions.map((prediction) => (
                      <div className="onecity">
                        <div onClick={() => this.props.choosecity(prediction)}>
                          <WeatherCitySky city={prediction} />
                        </div>
                        {prediction.place_name}
                      </div>
                    ))
                  : "no results"
                : null}
            </div>
          )}
          {((this.props.find === "community" &&
            this.props.chosenCommunity.id) ||
            this.props.city !== "") && <label>&nbsp;entity-type</label>}
          {((this.props.find === "community" &&
            this.props.chosenCommunity.id) ||
            this.props.city !== "") && (
            <select
              style={{
                margin: "6px",
                border: "3px solid blue",
                width: "min-content",
                borderRadius: "5px"
              }}
              value={this.props.chosenTile}
              onChange={this.props.selectTiletype}
            >
              {[
                "clubs",
                "shops",
                "restaurants",
                "services",
                "pages",
                "venues"
              ].map((parent) => {
                return <option>{parent}</option>;
              })}
            </select>
          )}
          {this.props.availableEntities.length > 0 && (
            <select
              value={this.props.chosenEntity}
              onChange={this.props.selectEntity}
            >
              {this.props.availableEntities.map((parent) => (
                <option id={parent.id}>{parent.message}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  }
}
export default VoteModuleFilter;
