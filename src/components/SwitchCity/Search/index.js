import React from "react";
import Display from "../Display";
import City from "./City";

class Search extends React.Component {
  state = {};
  render() {
    const { predictions, queryCity } = this.props;
    return (
      <div
        style={{
          opacity: this.state.lowerOpacity ? ".7" : "1",
          flexDirection: "column",
          display: queryCity !== "" ? "flex" : "none",
          position: "relative",
          border: "1px solid",
          height:
            predictions &&
            predictions.length > 0 &&
            queryCity === this.props.new
              ? "calc(100% - 56px)"
              : "0%",
          overflowX: "hidden",
          overflowY: "auto",
          width: "100%",
          color: "rgba(255, 255, 255, 0.644)",
          fontSize: "26px",
          transition: "ease-out 0.1s",
          right: "0px"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "min-content",
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap-reverse",
            position: "absolute",
            color: "rgba(255, 255, 255, 0.644)",
            fontSize: "26px",
            transition: "ease-out 0.1s"
          }}
        >
          {predictions && predictions.length > 0 && queryCity === this.props.new
            ? predictions.map((prediction) =>
                !prediction.isCommunity ? (
                  <City
                    key={prediction.place_name}
                    getUserInfo={this.props.getUserInfo}
                    showThisForm={this.props.showThisForm}
                    showReqMayorForm={this.props.showReqMayorForm}
                    prediction={prediction}
                    auth={this.props.auth}
                    user={this.props.user}
                    clickCityGifmap={this.props.clickCityGifmap}
                  />
                ) : (
                  <div key={prediction.message} className="onecity">
                    <Display
                      openOptionsForThis={() =>
                        this.props.openOptionsForThis(prediction)
                      }
                      chooseCommunity={this.props.chooseCommunity}
                      auth={this.props.auth}
                      user={this.props.user}
                      x={prediction}
                    />
                  </div>
                )
              )
            : "no results"}
        </div>
      </div>
    );
  }
}
export default Search;
