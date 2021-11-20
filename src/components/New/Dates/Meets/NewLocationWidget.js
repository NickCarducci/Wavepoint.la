import React from "react";

class NewLocationWidget extends React.Component {
  state = {
    predictions: []
  };
  render() {
    return (
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            await fetch(
              //`https://atlas.microsoft.com/search/place_name/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.locationQuery}.json?limit=2&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
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
                this.setState({ place_name: "", goodCenter: [] });
                alert("please use a neighbor's place_name, none found");
              });
          }}
          style={{
            breakInside: "avoid",
            display: "flex",
            width: "284px",
            backgroundColor: "rgb(40,30,20)",
            color: "white",
            height: "33px",
            alignItems: "center"
          }}
        >
          <input
            maxLength="15"
            value={this.state.locationQuery}
            onChange={(e) => {
              this.setState({ locationQuery: e.target.value });
            }}
            className="input"
            style={{
              height: "33px"
            }}
            placeholder="address"
          />
        </form>
        <div
          style={{
            breakInside: "avoid",
            display: "flex",
            width: "284px",
            backgroundColor: "rgb(40,30,20)",
            color: "white",
            height: "min-content",
            marginBottom: "15px",
            alignItems: "center"
          }}
        >
          {!this.props.goodCenter &&
            this.state.predictions.map((x) => {
              return (
                <div
                  onClick={() =>
                    this.props.good1(x.place_name, [x.center[1], x.center[0]])
                  }
                  style={
                    this.props.goodplace_name === x.place_name ||
                    this.props.place_name === x.place_name
                      ? { border: "1px solid white" }
                      : {}
                  }
                >
                  {x.place_name}
                </div>
              );
            })}
        </div>
        {this.props.likedCenter && (
          <div
            onClick={() => {
              this.props.good(
                this.props.place_name,
                this.props.likedCenter,
                "",
                ""
              );
            }}
            style={{ border: "1px solid black" }}
          >
            Save
          </div>
        )}
      </div>
    );
  }
}
export default NewLocationWidget;
