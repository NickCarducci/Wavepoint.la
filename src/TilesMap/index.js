import React from "react";
import "./TilesMap.css";
import Claim from ".././components/SwitchCity/Display/Claim";
import { withRouter } from "react-router-dom";
import {
  ClubImg,
  EventImg,
  HousingImg,
  JobImg,
  PageImg,
  RestaurantImg,
  ServiceImg,
  ShopImg,
  VenueImg
} from "../widgets/aphoto";
import EventTypeTop from "../EventTypesMap/EventTypeTop";

class TilesMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marginTop: 200
      //marginTop: window.innerWidth * (window.innerHeight / window.innerWidth)
    };
    this.header = React.createRef();
  }
  socialOpener = () => {
    this.setState({
      socialOpen: !this.state.socialOpen
    });
  };
  componentDidMount = () => {
    window.addEventListener("resize", this.resize);
    this.resize();
  };
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resize);
  };
  resize = () => {
    this.setState({
      marginTop: this.header.current.offsetHeight
    });
  };
  handleTooltipMove = (ev) => {
    const e = ev.touches ? ev.touches[0] : ev;
    const tooltipTop = e.pageY - this.header.current.offsetTop;
    this.setState(
      {
        tooltipMove: true,
        tooltipTop
      },
      () => {
        clearTimeout(this.stopTooltip);
        this.stopTooltip = setTimeout(
          () =>
            this.setState({
              tooltipMove: false,
              tooltipTop: 0
            }),
          200
        );
      }
    );
  };
  handleClerk = () => {
    var answer = window.confirm("Are you a town clerk?");
    if (answer && this.props.auth === undefined) {
      var sendtologin = window.confirm("You need to login");
      if (sendtologin) {
        //this.props.history.push("/login");
        this.props.getUserInfo();
      }
    } else if (answer) {
      this.setState({ showReqMayorForm: this.props.city });
    }
  };
  render() {
    const {
      show,
      tileChosen,
      width,
      forumOpen,
      subForum,
      commtype,
      community,
      type
    } = this.props;
    var tiles = [
      "event",
      "club",
      "shop",
      "restaurant",
      "service",
      "job",
      "housing",
      "page",
      "venue"
    ];
    const loadedQuery =
      this.state.loadedQuery && tileChosen !== this.state.loadedQuery;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          zIndex: !this.props.forumOpen && show ? "1" : "-9",
          overflow: "hidden",
          height: show ? "min-content" : "0px",
          position: "relative",
          wordBreak: "break-word",
          width: "100%",
          transition: ".3s ease-in"
        }}
      >
        <div
          ref={this.header}
          style={{
            position: "absolute",
            width: "100%",
            height: show ? "100%" : "0%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            transition: ".7s ease-in"
          }}
          onClick={this.props.eventTypes}
        />
        {/*<div
          onDrag={(e) => {
            this.handleTooltipMove(e);
          }}
          onDragExit={() => this.setState({ tooltipTop: null })}
          style={{
            height: "min-content",
            overflow: "hidden",
            transition: ".3s ease-in",
            backgroundColor: "white"
          }}
        >*/}

        <EventTypeTop
          setEventTypes={(x) => this.setState(x)}
          tileChosen={tileChosen}
          forumOpen={forumOpen}
          subForum={subForum}
          commtype={commtype}
          eventTypes={this.props.eventTypes}
          openFilters={this.props.openFilters}
          auth={this.props.auth}
          city={this.props.city}
          showReqMayorForm={this.state.showReqMayorForm}
          community={community}
          type={type}
        />
        <div
          className="eventtypessetmap"
          onClick={(e) => {
            if (e.target.id) {
              this.setState({ loadedQuery: e.target.id.split("/")[1] });
            }
          }}
          style={{
            width: "calc(100% - 2px)",
            display: "flex"
          }}
        >
          <EventImg
            tileChosen={loadedQuery ? this.state.loadedQuery : tileChosen}
            maxWidth={width}
          />
          <ClubImg
            tileChosen={loadedQuery ? this.state.loadedQuery : tileChosen}
            maxWidth={width}
          />
          <ShopImg
            tileChosen={loadedQuery ? this.state.loadedQuery : tileChosen}
            maxWidth={width}
          />
          <RestaurantImg
            tileChosen={loadedQuery ? this.state.loadedQuery : tileChosen}
            maxWidth={width}
          />
          <ServiceImg
            tileChosen={loadedQuery ? this.state.loadedQuery : tileChosen}
            maxWidth={width}
          />
          <JobImg
            tileChosen={loadedQuery ? this.state.loadedQuery : tileChosen}
            maxWidth={width}
          />
          <HousingImg
            tileChosen={loadedQuery ? this.state.loadedQuery : tileChosen}
            maxWidth={width}
          />
          <PageImg
            tileChosen={loadedQuery ? this.state.loadedQuery : tileChosen}
            maxWidth={width}
          />
          <VenueImg
            tileChosen={loadedQuery ? this.state.loadedQuery : tileChosen}
            maxWidth={width}
          />
        </div>
        <div
          style={{
            width: "calc(100% - 2px)",
            display: "flex"
          }}
        >
          <div
            onClick={() =>
              this.setState({ loadedQuery: null }, () =>
                this.props.eventTypes()
              )
            }
            style={{
              padding: "10px 0px",
              textAlign: "center",
              fontSize: "20px",
              position: "relative",
              width: "calc(100% - 2px)",
              color: "white",
              border: "1px solid white",
              backgroundImage:
                "radial-gradient(rgba(14, 47, 56, 0.279),rgba(25, 81, 97, 0.948))"
            }}
          >
            Close
          </div>
          <div
            style={{
              padding: loadedQuery ? "10px 0px" : "0px 0px",
              textAlign: "center",
              fontSize: loadedQuery ? "20px" : "0px",
              position: "relative",
              width: loadedQuery ? "calc(100% - 2px)" : "0px",
              color: "white",
              border: "1px solid white",
              backgroundImage:
                "radial-gradient(rgba(14, 47, 56, 0.279),rgba(25, 81, 97, 0.948))"
            }}
            onClick={() => {
              this.props.tileChanger(this.state.loadedQuery, true);
              this.props.eventTypes();
            }}
          >
            {loadedQuery && "Start"} Search {this.state.loadedQuery}
          </div>
        </div>
        <Claim
          clear={() => this.setState({ showReqMayorForm: "" })}
          showReqMayorForm={this.state.showReqMayorForm}
          user={this.props.user}
        />
      </div>
    );
  }
}
export default withRouter(TilesMap);
