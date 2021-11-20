import React from "react";

class Locate extends React.Component {
  state = {
    numberEntered: "",
    commQuery: "",
    enteredValue: "",
    predictions: []
  };
  onSearchChange = async () => {
    const { typesA = ["(place_name)"] } = this.props;
    //const { typesE = ["(establishment)"] } = this.props;
    //console.log(input)
    const numberEntered = /^[\d]/;
    //const letterEntered = /^[\W\D]/;
    const enteredValue = this.state.addressSearch; //e.target.value;
    this.setState({ enteredValue, typesA });
    console.log(this.state.addressSearch);
    if (
      enteredValue &&
      numberEntered.test(enteredValue) &&
      this.state.place_name === ""
    ) {
      this.setState({ numberEntered: true });
      clearTimeout(this.timepout);
      this.timepout = setTimeout(async () => {
        await fetch(
          //`https://atlas.microsoft.com/search/place_name/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${enteredValue}.json?limit=2&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
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
            this.props.clearlocation();
            alert("please use a neighbor's place_name, none found");
          });
      });
    } else return this.setState({ numberEntered: false });
  };
  componentDidUpdate = async () => {
    if (this.state.predictions !== "" && this.state.enteredValue === "") {
      this.setState({ predictions: "" });
    }
  };
  render() {
    const { enteredValue, place_name, locationType, predictions } = this.state;
    const numberEntered = /^[\d]/;
    return (
      <div
        className={
          numberEntered.test(enteredValue)
            ? "eventnewcitysearchfilled"
            : "eventnewcitysearch"
        }
      >
        {place_name ? (
          <div />
        ) : (
          <div
            style={{
              color: "rgb(200,120,120)",
              fontSize: "15px",
              border: "2px solid",
              borderRadius: "9px",
              padding: "4px",
              margin: "2px"
            }}
          >
            {this.props.done}
            address
          </div>
        )}
        <div className="seachboxthing">
          {place_name}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              this.onSearchChange();
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly"
              }}
            >
              <div
                style={
                  locationType === "city"
                    ? {
                        fontSize: "12px",
                        border: "2px solid",
                        borderRadius: "9px",
                        padding: "4px",
                        margin: "2px"
                      }
                    : {
                        color: "grey",
                        fontSize: "12px",
                        border: "2px solid",
                        borderRadius: "9px",
                        padding: "4px",
                        margin: "2px"
                      }
                }
                onClick={
                  locationType === "city"
                    ? () => this.setState({ locationType: null })
                    : () => this.setState({ locationType: "city" })
                }
              >
                Address
              </div>
              <div
                style={
                  locationType === "community"
                    ? {
                        fontSize: "12px",
                        border: "2px solid",
                        borderRadius: "9px",
                        padding: "4px",
                        margin: "2px"
                      }
                    : {
                        color: "grey",
                        fontSize: "12px",
                        border: "2px solid",
                        borderRadius: "9px",
                        padding: "4px",
                        margin: "2px"
                      }
                }
                onClick={
                  locationType === "community"
                    ? () => this.setState({ locationType: null })
                    : () => this.setState({ locationType: "community" })
                }
              >
                Community
              </div>
            </div>
            {locationType === "city" ? (
              <input
                value={this.state.addressSearch}
                className="searchlocationevent"
                onChange={(e) =>
                  this.setState({ addressSearch: e.target.value })
                }
              />
            ) : locationType === "community" ? (
              <input
                value={this.state.commQuery}
                className="searchlocationevent"
                onChange={(e) => this.setState({ commQuery: e.target.value })}
              />
            ) : null}
          </form>
        </div>

        {place_name === ""
          ? locationType === "community"
            ? this.props.communities.map((x) => {
                var lower = x.message.toLowerCase();
                if (
                  (!x.privateToMembers ||
                    (x.admin && x.admin.includes(this.props.auth.uid)) ||
                    (x.faculty &&
                      x.faculty.includes(this.props.auth.uid)) ||
                    (x.members && x.members.includes(this.props.auth.uid))) &&
                  (this.state.commQuery === "" ||
                    lower.includes(this.state.commQuery.toLowerCase()))
                ) {
                  return (
                    <div
                      onClick={
                        this.props.communityId === x.id
                          ? () =>
                              this.props.setCommunity({
                                communityId: null,
                                community: null
                              })
                          : () =>
                              this.props.setCommunity({
                                communityId: x.id,
                                community: x
                              })
                      }
                      className="citypredictionsevent"
                      style={
                        this.props.communityId === x.id ? {} : { color: "grey" }
                      }
                    >
                      ={x.message}
                    </div>
                  );
                } else return null;
              })
            : enteredValue === ""
            ? "Search"
            : locationType === "city"
            ? predictions && predictions.length > 0
              ? predictions.map((prediction) => {
                  return (
                    <div
                      onClick={() => this.props.selectAddress(prediction)}
                      className="citypredictionsevent"
                    >
                      ={prediction.place_name}
                    </div>
                  );
                })
              : null
            : "none, try an place_name"
          : locationType && (
              <div
                onClick={() => {
                  this.setState({ locationType: false });
                  this.props.clearlocation();
                }}
              >
                Clear location
              </div>
            )}
      </div>
    );
  }
}

export default Locate;
