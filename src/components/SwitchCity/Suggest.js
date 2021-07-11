import React from "react";
import firebase from "../.././init-firebase";
import { suggestions } from "../.././widgets/arraystrings";
import Display from "./Display";
import WeatherCitySky from "./WeatherCitySky";

class Suggest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      defComms: []
    };
    this.measure = React.createRef();
  }
  queryFlow = () => {
    clearTimeout(this.pause);
    this.pause = setTimeout(() => {
      this.setState({
        overflowWidth:
          this.measure &&
          this.measure.current &&
          this.measure.current.offsetWidth > this.props.width
      });
    }, 200);
  };
  componentDidUpdate = (prevProps) => {
    /*if (this.props.width !== prevProps.width) {
      if (!this.state.overflowWidth)
        this.setState({ overflowWidth: null }, this.queryFlow);
    }*/
  };
  componentDidMount = () => {
    Promise.all(
      [
        "HsgnpZX3z50cca3IAt0E",
        "ko3CQqeyefMuRjWTewYf",
        "YqCbpISpnkLsRlXdSiak",
        "KNKt7TYwyQWPplJzYuw3",
        "HPQErn3ztJdvBJlueMXi",
        "CNGi23HMa3XviwvsnueG",
        "xtEZTYN1lAixEQjUPO9j",
        "NWeJf7jl1TTXr9CQFXXq",
        "R2BHPbl3FQAkVtwDZUKr",
        "BhwXbwv7WMvsFyFvXGci",
        "zRLEWQIwxV8wJ6sXZky6",
        "7dhovgf2MYY8WWeSEZVv",
        "MiiPoZoTVkHdFEcCcNER"
      ].map(
        async (id) =>
          await new Promise((resolve) =>
            firebase
              .firestore()
              .collection("communities")
              .doc(id) //United States of America
              .get()
              .then((doc) => {
                if (doc.exists) {
                  var comm = doc.data();
                  comm.id = doc.id;
                  comm.isCommunity = true;
                  resolve(JSON.stringify(comm));
                }
              })
              .catch((err) => {
                console.log(err.message);
                resolve(JSON.stringify({}));
              })
          )
      )
    ).then((de) => {
      var defComms = de.map((x) => JSON.parse(x));
      this.setState(
        { defComms } //,this.queryFlow
      );
    });
  };
  render() {
    var cityStyle = {
      breakInside: "avoid",
      textDecoration: "none",
      width: 100, //"100%",
      height: `min-content`
    };
    return (
      <div
        ref={this.measure}
        /*style={{
          overflow: !overflowWidth ? "auto" : "hidden",
          marginBottom: "30px",
          //backgroundColor: `rgba(${backgroundColor},1.8)`,
          columnCount: columnCount ? columnCount : "",
          position: "relative",
          width: show ? (overflowWidth ? "100%" : "min-content") : "0px",
          height: `calc(100% - 130px)`
        }}*/
        style={{
          overflow: "hidden",
          height: this.props.switchCityOpen ? "min-content" : "0px",
          flexWrap: "wrap",
          display: "flex",
          //transition: ".3s ease-in",
          position: "relative",
          width: "100%"
        }}
      >
        {[...this.state.defComms, ...suggestions].map((suggestion, i) => {
          if (Object.keys(suggestion).length > 0) {
            var color =
              this.state.hovering !== suggestion.place_name
                ? "rgb(90,90,90)"
                : "rgb(160,160,160)";
            return (
              <div
                onMouseEnter={() =>
                  this.setState({ hovering: suggestion.place_name })
                }
                onMouseLeave={() =>
                  this.setState({ hovering: suggestion.place_name })
                }
                style={{ ...cityStyle, color }}
                key={
                  (suggestion.isCommunity
                    ? suggestion.message
                    : suggestion.place_name) + i
                }
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
                  {suggestion.isCommunity
                    ? suggestion.message
                    : suggestion.place_name &&
                      suggestion.place_name.split(",")[0]}
                </div>
                {suggestion.place_name ===
                "Las Vegas, Nevada, United States" ? (
                  <div style={{ position: "relative" }}>
                    <img
                      onClick={() => {
                        this.props.setHovered({
                          comm: suggestion
                        });
                        this.props.clickCityGifmap(suggestion);
                        this.props.switchCMapCloser();
                      }}
                      style={{
                        width: "100%",
                        height: "auto",
                        backgroundColor: "rgb(100,100,200)"
                      }}
                      src="https://www.dl.dropboxusercontent.com/s/it3dr963cddy2y9/nicola-tolin-bKx2zZUvv9k-unsplash.jpg?dl=0"
                      alt="New York City"
                    />
                  </div>
                ) : suggestion.isCommunity ? (
                  <Display
                    openOptionsForThis={() =>
                      this.props.openOptionsForThis(suggestion)
                    }
                    chooseCommunity={this.props.chooseCommunity}
                    auth={this.props.auth}
                    user={this.props.user}
                    x={suggestion}
                    height={50}
                  />
                ) : Object.keys(suggestion).length !== 0 ? (
                  <WeatherCitySky
                    onClickThis={() => {
                      this.props.setHovered({
                        comm: suggestion
                      });
                      this.props.clickCityGifmap(suggestion);
                      this.props.switchCMapCloser();
                    }}
                    hovering={this.state.hovering === suggestion.place_name}
                    city={suggestion.place_name}
                    forProfile={true}
                    height={48}
                  />
                ) : null}
              </div>
            );
          } else return null;
        })}
      </div>
    );
  }
}
export default Suggest;
