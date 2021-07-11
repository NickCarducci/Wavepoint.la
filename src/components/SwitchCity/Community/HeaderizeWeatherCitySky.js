import React from "react";
import sky from "../.././Icons/Images/sky.png";
//import border from ".././Icons/Images/border.png";
import sky2 from "../.././Icons/Images/sky2.png";
import sky3 from "../.././Icons/Images/sky3.png";
import stars from "../.././Icons/Images/stars.gif";

import "../.././Icons/Headerstyles.css";

class HeaderizeWeatherCitySkyMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().getHours(),
      city: props.city
    };
  }

  render() {
    return (
      <div>
        {this.state.time === 4 || this.state.time === 5 ? (
          <img src={sky3} className="sky_header" alt="error" />
        ) : ![20, 21, 22, 23, 0, 1, 2, 3].includes(this.state.time) ? (
          <img src={sky} className="sky_header" alt="error" />
        ) : (
          <img src={sky2} className="sky_header" alt="error" />
        )}
        {this.state.city === "New York" ? (
          <img
            src="https://www.dl.dropboxusercontent.com/s/w6d0vb32ggf0udx/City%28Feather%29%20%283%29.gif?dl=0"
            className="city_header"
            alt="error"
          />
        ) : (
          <img
            src="https://www.dl.dropboxusercontent.com/s/yz6bh9f1wqbk4k6/Plain%28Feather%29%20%283%29.gif?dl=0"
            className="city_header"
            alt="error"
          />
        )}

        {[20, 21, 22, 23, 0, 1, 2, 3].includes(this.state.time) && (
          <img src={stars} className="stars_header" alt="error" />
        )}
      </div>
    );
  }
}

export default HeaderizeWeatherCitySkyMap;
