import React from "react";
import sky from ".././Icons/Images/sky.png";
//import border from ".././Icons/Images/border.png";
import sky2 from ".././Icons/Images/sky2.png";
import sky3 from ".././Icons/Images/sky3.png";
import stars from ".././Icons/Images/stars.gif";


class MenuWeatherCitySkyMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().getHours(),
      //city: props.city
    };
  }
/*
  getWeather = async e => {
    e.preventDefault();
    const cityname = this.props.city;
    //const city = e.target.elements.city.value;
    const api_call = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}&units=metric`
    );
    const data = await api_call.json();
    //console.log(data);
    this.setState({
      description: data.main.description,
      humidity: data.main.humidity,
      city: data.name
    });
  };
  // timezone - javascript
  currentTime() {
    this.setState({
      time: new Date().getHours
    });
  }
  componentDidMount() {
    setInterval(() => this.currentTime.getHours(), 3600000);
  }
  componentWillUnmount() {
    clearInterval(this.currentTime);
  }*/

  render(props) {
    /*console.log(window.location.pathname);
    console.log(this.state.page);
    console.log(this.state.time.toLocaleTimeString);
    console.log(this.state.time);
    console.log(this.state.city);*/
    return (
      <div>
        <div>
          {this.state.time === 4 || this.state.time === 5 ? (
            <img
              src={sky3}
              onClick={this.handleClick2}
              className="sky_headermenu"
              alt="error"
            />
          ) : this.state.time === 6 ||
            this.state.time === 7 ||
            this.state.time === 8 ||
            this.state.time === 9 ||
            this.state.time === 10 ||
            this.state.time === 11 ||
            this.state.time === 12 ||
            this.state.time === 13 ||
            this.state.time === 14 ||
            this.state.time === 15 ||
            this.state.time === 16 ||
            this.state.time === 17 ||
            this.state.time === 18 ||
            this.state.time === 19 ? (
            <img
              src={sky}
              className="sky_headermenu"
              alt="error"
            />
          ) : (
            <img src={sky2} className="sky_headermenu" alt="error" />
          )}
          {this.state.city === "New York" ? (
            <img src="https://www.dl.dropboxusercontent.com/s/w6d0vb32ggf0udx/City%28Feather%29%20%283%29.gif?dl=0" className="city_headermenu" alt="error" />
          ) : (
            <img src="https://www.dl.dropboxusercontent.com/s/yz6bh9f1wqbk4k6/Plain%28Feather%29%20%283%29.gif?dl=0" className="city_headermenu" alt="error" />
          )}

          {this.state.time === 4 ||
          this.state.time === 5 ||
          this.state.time === 6 ||
          this.state.time === 7 ||
          this.state.time === 8 ||
          this.state.time === 9 ||
          this.state.time === 10 ||
          this.state.time === 11 ||
          this.state.time === 12 ||
          this.state.time === 13 ||
          this.state.time === 14 ||
          this.state.time === 15 ||
          this.state.time === 16 ||
          this.state.time === 17 ||
          this.state.time === 18 ||
          this.state.time === 19 ? null : (
            <img src={stars} className="stars_headermenu" alt="error" />
          )}
          {/*<img src={border} className="border_header" alt="error" />*/}
          {/*{this.state.weather === "light storm" ? (
            <img 
            src={lightening_light})}
            />
          ) : (null)*/}
        </div>
      </div>
    );
  }
}

export default MenuWeatherCitySkyMap;
