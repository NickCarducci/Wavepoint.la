import React from "react";
import firebase from "../../../.././init-firebase";

class Edit extends React.Component {
  state = {
    predictions: [],
    address1:
      this.props.user !== undefined && this.props.user.address1
        ? this.props.user.address1
        : "",
    address2:
      this.props.user !== undefined && this.props.user.address2
        ? this.props.user.address2
        : "",
    city:
      this.props.user !== undefined && this.props.user.city
        ? this.props.user.city
        : "",
    state:
      this.props.user !== undefined && this.props.user.state
        ? this.props.user.state
        : "",
    ZIP:
      this.props.user !== undefined && this.props.user.ZIP
        ? this.props.user.ZIP
        : ""
  };
  render() {
    const states = [
      {
        name: "Alabama",
        abbreviation: "AL"
      },
      {
        name: "Alaska",
        abbreviation: "AK"
      },
      {
        name: "American Samoa",
        abbreviation: "AS"
      },
      {
        name: "Arizona",
        abbreviation: "AZ"
      },
      {
        name: "Arkansas",
        abbreviation: "AR"
      },
      {
        name: "California",
        abbreviation: "CA"
      },
      {
        name: "Colorado",
        abbreviation: "CO"
      },
      {
        name: "Connecticut",
        abbreviation: "CT"
      },
      {
        name: "Delaware",
        abbreviation: "DE"
      },
      {
        name: "District Of Columbia",
        abbreviation: "DC"
      },
      {
        name: "Federated States Of Micronesia",
        abbreviation: "FM"
      },
      {
        name: "Florida",
        abbreviation: "FL"
      },
      {
        name: "Georgia",
        abbreviation: "GA"
      },
      {
        name: "Guam",
        abbreviation: "GU"
      },
      {
        name: "Hawaii",
        abbreviation: "HI"
      },
      {
        name: "Idaho",
        abbreviation: "ID"
      },
      {
        name: "Illinois",
        abbreviation: "IL"
      },
      {
        name: "Indiana",
        abbreviation: "IN"
      },
      {
        name: "Iowa",
        abbreviation: "IA"
      },
      {
        name: "Kansas",
        abbreviation: "KS"
      },
      {
        name: "Kentucky",
        abbreviation: "KY"
      },
      {
        name: "Louisiana",
        abbreviation: "LA"
      },
      {
        name: "Maine",
        abbreviation: "ME"
      },
      {
        name: "Marshall Islands",
        abbreviation: "MH"
      },
      {
        name: "Maryland",
        abbreviation: "MD"
      },
      {
        name: "Massachusetts",
        abbreviation: "MA"
      },
      {
        name: "Michigan",
        abbreviation: "MI"
      },
      {
        name: "Minnesota",
        abbreviation: "MN"
      },
      {
        name: "Mississippi",
        abbreviation: "MS"
      },
      {
        name: "Missouri",
        abbreviation: "MO"
      },
      {
        name: "Montana",
        abbreviation: "MT"
      },
      {
        name: "Nebraska",
        abbreviation: "NE"
      },
      {
        name: "Nevada",
        abbreviation: "NV"
      },
      {
        name: "New Hampshire",
        abbreviation: "NH"
      },
      {
        name: "New Jersey",
        abbreviation: "NJ"
      },
      {
        name: "New Mexico",
        abbreviation: "NM"
      },
      {
        name: "New York",
        abbreviation: "NY"
      },
      {
        name: "North Carolina",
        abbreviation: "NC"
      },
      {
        name: "North Dakota",
        abbreviation: "ND"
      },
      {
        name: "Northern Mariana Islands",
        abbreviation: "MP"
      },
      {
        name: "Ohio",
        abbreviation: "OH"
      },
      {
        name: "Oklahoma",
        abbreviation: "OK"
      },
      {
        name: "Oregon",
        abbreviation: "OR"
      },
      {
        name: "Palau",
        abbreviation: "PW"
      },
      {
        name: "Pennsylvania",
        abbreviation: "PA"
      },
      {
        name: "Puerto Rico",
        abbreviation: "PR"
      },
      {
        name: "Rhode Island",
        abbreviation: "RI"
      },
      {
        name: "South Carolina",
        abbreviation: "SC"
      },
      {
        name: "South Dakota",
        abbreviation: "SD"
      },
      {
        name: "Tennessee",
        abbreviation: "TN"
      },
      {
        name: "Texas",
        abbreviation: "TX"
      },
      {
        name: "Utah",
        abbreviation: "UT"
      },
      {
        name: "Vermont",
        abbreviation: "VT"
      },
      {
        name: "Virgin Islands",
        abbreviation: "VI"
      },
      {
        name: "Virginia",
        abbreviation: "VA"
      },
      {
        name: "Washington",
        abbreviation: "WA"
      },
      {
        name: "West Virginia",
        abbreviation: "WV"
      },
      {
        name: "Wisconsin",
        abbreviation: "WI"
      },
      {
        name: "Wyoming",
        abbreviation: "WY"
      }
    ];
    return (
      <div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await fetch(
              //`https://atlas.microsoft.com/search/place_name/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.addressQuery}.json?limit=2&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
            )
              .then(async (response) => await response.json())
              .then(
                (body) => {
                  this.setState({
                    predictions: body.features
                  });
                },
                (err) => console.log(err)
              )
              .catch((err) => {
                console.log(err);
                this.setState({ place_name: "", center: [] });
                alert("please use a neighbor's place_name, none found");
              });
          }}
        >
          <label>search</label>
          <input
            required
            type="text"
            placeholder="Edit"
            value={this.state.addressQuery}
            onChange={(e) => this.setState({ addressQuery: e.target.value })}
          />
          {/*<div
          style={
            this.state.address1
              ? {
                  border: "1px solid",
                  borderRadius: "3px",
                  width: "120px",
                  height: "min-content",
                  margin: "10px 0px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  left: "50%",
                  position: "relative",
                  transform: "translateX(-50%)"
                }
              : {
                  borderRadius: "3px",
                  width: "120px",
                  height: "min-content",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  left: "50%",
                  position: "relative",
                  transform: "translateX(-50%)"
                }
          }
        >
          {this.props.user.address1}
          <br />
          {this.props.user.address2}
          <br />
          {this.props.user.city}
          {this.props.user.address1 && ", "}
          {this.props.user.state}
        </div>*/}
          <button
            type="submit"
            style={{
              left: "50%",
              top: "0px",
              position: "relative",
              transform: "translateX(-50%)",
              display: "flex",
              width: "min-content"
            }}
          >
            Search
          </button>
        </form>
        {this.state.predictions.length > 0 &&
          this.state.predictions.map((x, i) => {
            return (
              <div
                key={i}
                style={{
                  border: "1px solid",
                  borderRadius: "3px",
                  width: "200px",
                  height: "min-content",
                  margin: "10px 0px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  left: "50%",
                  position: "relative",
                  transform: "translateX(-50%)"
                }}
                onClick={() => {
                  const address1 = x.place_name.split(", ")[0];
                  const city = x.place_name.split(", ")[1].split(", ")[0];
                  const statefull = x.place_name.split(", ")[2];
                  const countryfull = x.place_name.split(", ")[3];
                  const ZIP = statefull.substr(
                    statefull.lastIndexOf(/[\d]+/) - 4,
                    statefull.length
                  );
                  const state = states.find((x) => statefull.includes(x.name));
                  const country = this.props.countries.find(
                    (x) => countryfull === x.name
                  );
                  console.log(country);
                  if (!country) {
                    window.alert(
                      "this country seems to be unsupported, please ask nick@thumbprint.us " +
                        "and I'll consider your country.  It may take extra services " +
                        "or it may be a simple error"
                    );
                  }
                  const addressUpdate = {
                    address1,
                    address2: this.state.address2,
                    city,
                    state: state.abbreviation,
                    ZIP,
                    country: country.alpha_2
                  };
                  firebase
                    .firestore()
                    .collection("userDatas")
                    .doc(this.props.auth.uid)
                    .update(addressUpdate);
                }}
              >
                {x.place_name}
              </div>
            );
          })}
      </div>
    );
  }
}
export default Edit;
