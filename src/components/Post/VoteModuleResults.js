import React from "react";
import VoteModuleFilter from "./VoteModuleFilter";

class VoteModuleResults extends React.Component {
  state = {
    chosenStature: "all",
    chosenIndividualType: "",
    by: "entity"
  };
  abbreviateNumber(value) {
    var newValue = value;
    if (value >= 1000) {
      var suffixes = ["", "k", "m", "b", "t"];
      var suffixNum = Math.floor(("" + value).length / 3);
      var shortValue = "";
      for (var precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum !== 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        );
        var dotLessShortValue = (shortValue + "").replace(
          /[^a-zA-Z 0-9]+/g,
          ""
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(1);
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  }
  /*componentDidMount = () => {
    var usersWithTitles =
      this.props.users &&
      this.props.users.filter((parent) => {
        var experiences = parent.experiences ? parent.experiences : [];
        var education = parent.education ? parent.education : [];
        var hobbies = parent.hobbies ? parent.hobbies : [];
        var dof = experiences.concat(education).concat(hobbies);
        if (dof.includes(seekingType)) {
          return parent;
        }
      });
  };*/
  render() {
    const { percentageUp, percentageDown, parent } = this.props;
    var downvotesNumber = parent.downvotes ? parent.downvotes.length : 0;
    var upvotesNumber = parent.upvotes ? parent.upvotes.length : 0;
    return (
      <div
        style={{
          width: "min-content",
          border: "1px solid black",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          right: "0px",
          height: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
          margin: "0px 2px",
          color: "grey",
          fontSize: "15px"
        }}
      >
        {!this.props.isElection && (
          <div
            style={{
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "20px",
              height: "20px",
              backgroundColor: "rgba(0,0,0,.3)",
              position: "absolute",
              right: "0px",
              top: "0px",
              zIndex: "6"
            }}
            onClick={() =>
              this.props.setShowing({
                closeFilter: true
              })
            }
          >
            &times;
          </div>
        )}

        {!this.props.isElection && (
          <select
            value={this.state.by}
            onChange={(e) => this.setState({ by: e.target.value })}
          >
            <option>entity</option>
            <option>individual</option>
          </select>
        )}
        {!this.props.isElection ? (
          this.state.by === "entity" ? (
            //appelate, appeals, federal habeus corpus
            <VoteModuleFilter
              selectEntity={this.props.selectEntity}
              availableEntities={this.props.availableEntities}
              choosecity={this.props.choosecity}
              chosenTile={this.props.chosenTile}
              selectTiletype={this.props.selectTiletype}
              city={this.props.city}
              chosenCommunity={this.props.chosenCommunity}
              communities={this.props.communities}
              selectFind={this.props.selectFind}
              find={this.props.find}
              selectCommunity={this.props.selectCommunity}
            />
          ) : this.state.by === "individual" ? (
            <div>
              <select>
                {this.props.individualTypes.map((parent) => (
                  <option>{parent}</option>
                ))}
              </select>

              {this.state.chosenIndividualType !== "" && (
                <select
                  value={this.state.chosenStature}
                  onChange={(e) =>
                    this.setState({ chosenStature: e.target.value })
                  }
                >
                  {["all", "experience", "education", "hobby"].map((parent) => {
                    return <option>{parent}</option>;
                  })}
                </select>
              )}
            </div>
          ) : null
        ) : null}
        <div>
          {percentageDown * 100 + "%"}

          {percentageUp * 100 + "%"}
        </div>
        <div
          onClick={
            this.state.viewUps
              ? () => this.setState({ viewUps: false })
              : () => this.setState({ viewUps: true })
          }
          style={{
            width: "min-content",
            display: "flex",
            position: "relative",
            right: "0px",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            color: "grey",
            fontSize: "15px"
          }}
        >
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "inherit",
              fontSize: "13px",
              border: "1px solid black",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              backgroundColor: "rgba(210,160,160,.60",
              color: "black",
              padding: "1px 5px"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "relative",
                fontSize: "13px",
                margin: "0px 3px"
              }}
            >
              no&nbsp;
              <br />
              {this.abbreviateNumber(downvotesNumber)}/
              {this.abbreviateNumber(downvotesNumber + upvotesNumber)}
            </div>
            <div
              style={{
                display: "flex",
                position: "relative",
                top: "0px",
                width: "10px",
                height: "43.5px",
                backgroundColor: "rgba(210,160,210,.80)",
                marginLeft: "2px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  top: "0px",
                  width: "10px",
                  height: `calc(100% * ${percentageDown})`,
                  backgroundColor: "red"
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              position: "relative",
              width: "inherit",
              fontSize: "13px",
              border: "1px solid black",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              backgroundColor: "rgba(160,160,210,.60)",
              color: "black",
              padding: "1px 5px"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "relative",
                fontSize: "13px",
                margin: "0px 3px"
              }}
            >
              yes&nbsp;
              <br />
              {this.abbreviateNumber(upvotesNumber)}/
              {this.abbreviateNumber(downvotesNumber + upvotesNumber)}
            </div>
            <div
              style={{
                display: "flex",
                position: "relative",
                top: "0px",
                width: "10px",
                height: "43.5px",
                backgroundColor: "rgba(160,160,210,.80)",
                marginLeft: "2px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  bottom: "0px",
                  width: "10px",
                  height: `calc(100% * ${percentageUp})`,
                  backgroundColor: "blue"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default VoteModuleResults;
