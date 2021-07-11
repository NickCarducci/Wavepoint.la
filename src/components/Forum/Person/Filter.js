import React from "react";
import WeatherCitySky from "../.././SwitchCity/WeatherCitySky";
import "../../.././styles.css";

class Filter extends React.Component {
  state = {
    citySearch: "",
    predictions: []
  };
  render() {
    const { predictions } = this.state;
    return (
      <div
        style={{
          zIndex: !this.props.browseFilters ? "0" : "2",
          height: !this.props.browseFilters ? "0px" : "min-content",
          width: "100%"
        }}
      >
        <div
          onClick={this.props.closeFilters}
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(20,20,20,.4)"
          }}
        />
        <div
          style={{
            top: "0px",
            position: "relative",
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
            <div style={{ display: "flex" }}>
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
              {this.props.community.message !== "" && (
                <div
                  onClick={this.props.clearCommunity}
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
              )}
            </div>
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
                  //const { typesA = ["(place_name)"] } = this.props;
                  //const { typesE = ["(establishment)"] } = this.props;
                  //console.log(input)
                  //const numberEntered = /^[\d]/;
                  const letterEntered = /^[\W\D]/;
                  const enteredValue = this.state.citySearch;
                  if (letterEntered.test(enteredValue)) {
                    await fetch(
                      //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
                      //`https://api.mapbox.com/geocoding/v5/mapbox.places/${enteredValue}.json?limit=2&types=address&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
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
                      this.props.community.id) ||
                    this.props.city !== ""
                      ? "6px"
                      : "0px",
                  border: "3px solid blue",
                  width: "min-content",
                  borderRadius: "5px"
                }}
                value={this.props.community.message}
                onChange={this.props.selectCommunity}
              >
                {this.props.communities &&
                  this.props.communities.map((x) => {
                    if (!this.props.community.privateVoting) {
                      return (
                        <option key={x.id} id={x.id}>
                          {x.message}
                        </option>
                      );
                    } else if (this.props.community.id === x.id) {
                      return (
                        <option key={x.id} id={x.id}>
                          {x.message}
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
                          <div
                            onClick={() => this.props.choosecity(prediction)}
                          >
                            <WeatherCitySky city={prediction} />
                          </div>
                          {prediction.place_name}
                        </div>
                      ))
                    : "no results"
                  : null}
              </div>
            )}
            {
              <select
                style={{
                  margin: "6px",
                  border: "3px solid blue",
                  width: "min-content",
                  borderRadius: "5px"
                }}
                value={this.props.commtype}
                onChange={this.props.selectCommtype}
              >
                {[
                  "new",
                  "lesson",
                  "show",
                  "game",
                  "budget & proposals",
                  "elections",
                  "ordinances",
                  "court cases",
                  "oldElections",
                  "oldCases",
                  "oldBudget"
                ].map((x) => {
                  return <option key={x}>{x}</option>;
                })}
              </select>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default Filter;
