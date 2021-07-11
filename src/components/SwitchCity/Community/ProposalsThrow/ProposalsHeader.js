import React from "react";
import search from ".././Icons/Images/search.png";
import square_dot from ".././Icons/Images/square_dot.png";
import filter from ".././Icons/Images/filter.png";
import HeaderizeWeatherCitySky from "./HeaderizeWeatherCitySky";
import { Link } from "react-router-dom";

import ".././Icons/Headerstyles.css";

class ProposalsHeader extends React.Component {
  /*constructor(){
    super();
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  };
  forceUpdateHandler(){
    this.forceUpdate();
  };*/
  stopSubmit = e => {
    e.preventDefault();
    return false;
  };

  render(props) {
    return (
      <div>
        {this.props.switchCommunitiesOpen === false ? (
          <div
            className="clicklandercity"
            onClick={this.props.switchCommunitiesOpener}
          >
            <HeaderizeWeatherCitySky
              description={this.props.description}
              humidity={this.props.humidity}
              city={this.props.city}
            />
          </div>
        ) : null}
        <form onSubmit={this.stopSubmit}>
          <input
            className="Events_Header"
            type="text"
            name="note"
            placeholder="Proposals"
            value={this.props.search}
            onChange={this.props.updateSearch}
            autoComplete="off"
          />
        </form>
        <div className="buttonboxer">
          <img
            src="https://www.dl.dropboxusercontent.com/s/beczavknfv7j6s2/square%20dot%20%282%29.png?dl=0"
            className={
              this.props.eventTypesOpen ? "square_dot_types" : "square_dot"
            }
            onClick={
              window.location.pathname === "/proposals"
                ? this.props.toggle
                : null
            }
            alt="error"
          />
        </div>
        <img
          src="https://www.dl.dropboxusercontent.com/s/szxg897vw4bwhs3/filter%20%281%29.png?dl=0"
          className="filter"
          onClick={
            window.location.pathname === "/proposals"
              ? this.props.eventTypesOpener
              : null
          }
          alt="error"
        />
      </div>
    );
  }
}

export default ProposalsHeader;
