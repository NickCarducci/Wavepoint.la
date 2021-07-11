import React from "react";
import { stateCity } from "../../widgets/arraystrings";
import Display from "../SwitchCity/Display";
import WeatherCitySky from "../SwitchCity/WeatherCitySky";

class Find extends React.Component {
  state = {};
  render() {
    const {
      favoriteCities,
      auth,
      backgroundColor,
      predictions,
      lastCommunity,
      undoCommunity,
      browsedCommunities
    } = this.props;

    if (auth !== undefined)
      browsedCommunities.sort(
        (a, b) =>
          (a.members.includes(auth.uid) ||
            a.admin.includes(auth.uid) ||
            a.authorId === auth.uid) - b
      );
    var filteredCommunities = browsedCommunities.filter((x) =>
      x.message.includes(this.props.searching)
    );
    /*var lastFavorited =
      favoriteCities &&
      favoriteCities.constructor === Array &&
      favoriteCities.length > 0 &&
      favoriteCities[favoriteCities.length - 1];*/
    const partBurger = {
      backgroundColor: "white",
      borderRadius: "1px",
      width: "6px",
      height: "2px",
      margin: "4px 0px"
    };

    let hello = (this.state.favorites
      ? favoriteCities
      : filteredCommunities
    ).filter(
      (x) =>
        !this.state.favorites ||
        (this.props.auth !== undefined &&
          this.props.user.faveComm &&
          this.props.user.faveComm.includes(x.id))
    );
    hello = predictions.length > 0 ? predictions : hello;
    return (
      <div
        onMouseEnter={() => clearTimeout(this.blurring)}
        onMouseLeave={() =>
          (this.blurring = setTimeout(this.props.blurSearching, 1200))
        }
        style={{
          transition: ".3s ease-in",
          height:
            this.props.focusSuggest && !this.props.started ? "94px" : "0px",
          overflow: "hidden",
          display: "flex",
          width: this.props.focusSuggest && !this.props.started ? "100%" : "0%"
        }}
      >
        <div
          style={{
            height:
              this.props.focusSuggest && !this.props.started ? "88px" : "0px",
            overflow: "hidden",
            position: "relative",
            display: "flex"
          }}
        >
          <div
            style={{
              height: "100%",
              width: "44px",
              backgroundImage: "radial-gradient(rgb(160,160,255),rgb(10,10,50))"
            }}
          >
            <div
              onClick={() => this.setState({ favorites: true })}
              style={{
                transition: ".3s ease-in",
                display: "flex",
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bolder",
                color: "white",
                width: "44px",
                height: "50%",
                boxShadow: this.state.favorites
                  ? "inset 0px 0px 10px 3px rgb(50,215,130)"
                  : ""
              }}
            >
              &#9734;
            </div>
            <div
              onClick={() => this.setState({ favorites: false })}
              style={{
                transition: ".3s ease-in",
                display: "flex",
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bolder",
                color: "white",
                width: "44px",
                height: "50%",
                boxShadow: !this.state.favorites
                  ? "inset 0px 0px 10px 3px rgb(50,215,130)"
                  : ""
              }}
            >
              <div>
                <div style={partBurger}></div>
                <div style={partBurger}></div>
                <div style={partBurger}></div>
              </div>
            </div>
          </div>
          <div
            onClick={() => this.props.browseCommunities("undo")}
            style={{
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              color: "white",
              height: "100%",
              width: this.props.focusSuggest && undoCommunity ? "44px" : "0px",
              transition: ".3s ease-in",
              backgroundImage: "radial-gradient(rgb(10,10,50),rgb(160,160,255))"
            }}
          >
            {"<"}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            position: "relative",
            width: `calc(100% - ${
              !this.props.focusSuggest
                ? "0px"
                : lastCommunity && undoCommunity
                ? "88px"
                : lastCommunity || undoCommunity
                ? "44px"
                : "0px"
            })`,
            height:
              this.props.focusSuggest && !this.props.started ? "110px" : "0px",
            overflow: "hidden",
            overflowX: "auto",
            overflowY: "hidden",
            transition: ".3s ease-in",
            backgroundImage: `radial-gradient(rgb(160,160,255),rgb(${backgroundColor}))`
          }}
        >
          <div
            style={{
              display: "flex",
              position: "absolute",
              height: "100%",
              width: "min-content"
            }}
          >
            {hello.length === 0 ? (
              <div
                style={{
                  paddingLeft: "10px",
                  width: "200px",
                  color: "rgb(130,130,130)"
                }}
              >
                No communities match
              </div>
            ) : (
              hello.map((x) => {
                var thiscity = null;
                if (!x.isCommunity) {
                  thiscity =
                    x.place_name.split(",")[1] &&
                    stateCity.find((y) =>
                      x.place_name.split(",")[1].includes(y.name)
                    );
                }
                return (
                  <div
                    onMouseOver={(e) => {
                      e.stopPropagation();
                      if (this.state.showhover !== x.id) {
                        this.setState({ showhover: x.id });
                      }
                    }}
                    onMouseLeave={() => {
                      clearTimeout(this.leave);

                      this.leave = setTimeout(
                        () => this.setState({ showhover: false }),
                        2789
                      );
                    }}
                    onClick={() => {
                      this.props.resetSearch();
                      if (x.isCommunity) {
                        this.props.openOptionsForThis(x);
                      } else {
                        this.props.switchCMapCloser();
                        this.props.resetPathAlias();
                        setTimeout(() => {
                          this.props.findCity(x);
                        }, 200);
                      }
                    }}
                    key={x.id}
                    style={{
                      top: "2px",
                      paddingLeft: "10px",
                      display: "flex",
                      position: "relative",
                      flexDirection: "column",
                      paddingRight: "5px",
                      width: "min-content",
                      borderLeft:
                        this.props.comm && this.props.comm.id === x.id
                          ? "4px solid pink"
                          : "",
                      color:
                        this.props.comm && this.props.comm.id === x.id
                          ? "grey"
                          : "white"
                    }}
                  >
                    <div
                      style={{
                        borderBottomRightRadius: "3px",
                        borderBottomLeftRadius: "3px",
                        padding: "3px",
                        backgroundColor: "rgb(20,20,25)",
                        boxShadow: "0px 5px 5px -3px black"
                      }}
                    >
                      {
                        (x.isCommunity
                          ? x.message
                          : x.place_name
                          ? x.place_name
                          : ""
                        ).split(",")[0]
                      }
                    </div>
                    {thiscity && (
                      <div
                        style={{
                          right: "0px",
                          top: "60px",
                          position: "absolute",
                          borderBottomRightRadius: "3px",
                          borderBottomLeftRadius: "3px",
                          padding: "3px",
                          backgroundColor: "rgb(20,20,25)",
                          boxShadow: "0px 5px 5px -3px black"
                        }}
                      >
                        {thiscity.abbreviation}
                      </div>
                    )}
                    {!x.isCommunity ? (
                      <WeatherCitySky
                        hovering={this.state.showhover === x.id}
                        city={x.place_name}
                        forProfile={true}
                        height={48}
                      />
                    ) : (
                      /*<City
                      key={x.place_name}
                      getUserInfo={this.props.getUserInfo}
                      showThisForm={this.props.showThisForm}
                      showReqMayorForm={this.props.showReqMayorForm}
                      prediction={x}
                      auth={this.props.auth}
                      user={this.props.user}
                      findCity={this.props.findCity}
                    />*/
                      <Display
                        openOptionsForThis={
                          () => {} //this.props.openOptionsForThis(x)
                        }
                        chooseCommunity={
                          this.props.comm === x.id
                            ? this.props.chooseCommunity
                            : () => {}
                        }
                        showhover={this.state.showhover === x.id}
                        auth={auth}
                        user={this.props.user}
                        x={x}
                        height={50}
                        infind={true}
                      />
                    )}
                  </div>
                );
              })
            )}
            <div
              onClick={() => this.props.browseCommunities("last")}
              style={{
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                color: "white",
                height: "94px",
                width:
                  this.props.focusSuggest && lastCommunity ? "44px" : "0px",
                transition: ".3s ease-in",
                backgroundImage:
                  "radial-gradient(rgb(10,10,50),rgb(160,160,255))"
              }}
            >
              {">"}
            </div>
          </div>
        </div>
        {/*lastFavorited && (
          <div
            onClick={() => {
              lastFavorited ? this.props.off() : this.props.on();
            }}
            style={{
              top: "0px",
              right: "0px",
              display: "flex",
              position: "relative",
              maxWidth: "30vw",
              width: "max-content",
              height: "100px",
              padding: "0px 20px",
              backgroundColor: "rgb(220,220,220)",
              color: "black"
            }}
          >
            <div
              style={{
                display: "flex",
                left: "0px",
                top: "0px",
                position: "relative"
              }}
            >
              {auth !== undefined &&
                ((lastFavorited.members &&
                  lastFavorited.members.includes(auth.uid)) ||
                  (lastFavorited.admin &&
                    lastFavorited.admin.includes(auth.uid)) ||
                  lastFavorited.authorId === auth.uid) && (
                  <div
                    style={{
                      position: "absolute",
                      display: "flex",
                      width: "100px",
                      left: "5px",
                      top: "5px",
                      height: "2px",
                      backgroundColor: "blue"
                    }}
                  />
                )}
            </div>
            <Display
              chooseCommunity={() => {}}
              blacktext={true}
              auth={auth}
              user={this.props.user}
              x={lastFavorited}
            />
          </div>
        )*/}
      </div>
    );
  }
}
export default Find;
