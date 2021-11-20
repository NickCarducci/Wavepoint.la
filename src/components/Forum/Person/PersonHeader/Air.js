import React from "react";
import { Link } from "react-router-dom";
import TigerPaw from ".././Vote/TigerPaw";

class Air extends React.Component {
  state = {};
  componentWillUnmount = () => {
    clearTimeout(this.close);
  };
  render() {
    const { profile, swipe } = this.props;
    return (
      <div
        style={{
          zIndex: "6",
          display: "flex",
          justifyContent: "flex-end",
          width: "100%"
        }}
      >
        <Link
          to="/"
          /*onClick={() => {
            this.props.backX();
            this.setState({ pressClose: true });
            this.close = setTimeout(() => {
              this.setState({ pressClose: false });
            }, 400);
          }}*/
          style={{
            textDecoration: "none",
            color: "white",
            backgroundColor: "rgb(250,20,20)",
            display: "flex",
            position: "absolute",
            top: "10px",
            right: "30px",
            width: "30px",
            height: "30px",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid",
            transition: ".3s ease-in",
            boxShadow: this.state.pressClose
              ? "none"
              : "1px 1.5px 5px 1px rgb(20,20,20)"
          }}
        >
          &times;
        </Link>

        <Link
          style={{
            color: "blue",
            backgroundColor: "rgb(240,240,240)",
            padding: "4px 8px",
            borderRadius: "14px",
            border: "2px solid white",
            top: "6px",
            right: "70px",
            display: "flex",
            position: "absolute",
            height: "20px",
            justifyContent: "center",
            alignItems: "center"
          }}
          to={`/bk/${profile.username}`}
        >
          Book bk/{profile.username}
        </Link>
        <div
          style={{
            transition: ".3s ease-in",
            position: "absolute",
            right: "86px",
            justifyContent: "center",
            alignItems: "center",
            top: swipe === "home" ? "43px" : "35px",
            display: "flex",
            width: "40px",
            height: "40px",
            border: "1px solid grey",
            borderRadius: "20px"
          }}
          onClick={this.props.togglePaw}
        >
          <TigerPaw swipe={swipe} />
        </div>
        <div
          className="fas fa-store-slash"
          style={{
            color: "rgba(200,200,200,.6)",
            transition: ".3s ease-in",
            borderRadius: "20px",
            border: "1px solid",
            right: "33px",
            justifyContent: "center",
            alignItems: "center",
            top: swipe === "home" ? "62px" : "55px",
            display: "flex",
            position: "absolute",
            width: "30px",
            height: "30px"
          }}
        />
      </div>
    );
  }
}
export default Air;
