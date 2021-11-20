import React from "react";
//import Slider from "react-input-slider";
import Claim from "./Display/Claim";
import SearchPowers from "./SearchPowers";
import Search from "./Search";
import Suggest from "./Suggest";
import ".././Icons/Headerstyles.css";
import "./CitiesMap.css";
import BuyCommunity from "./Community/BuyCommunity";
import { specialFormatting } from "../../widgets/authdb";

class SwitchCity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryCity: "",
      marginTop: 200,
      hasResults: false,
      y: this.props.distance,
      scrollingRadius: false
    };
    this.header = React.createRef();
    this.switch = React.createRef();
  }
  search = (e) =>
    this.setState({
      queryCity: specialFormatting(e.target.value)
    });

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
  componentDidMount = () => {
    //this.props.community && this.getBills();
    this.refresh();
    window.addEventListener("resize", this.refresh);
  };
  componentDidUpdate = (prevProps) => {
    if (this.props.switchCityOpen !== prevProps.switchCityOpen) {
      this.props.setFoundation({
        switchHeight: !this.props.switchCityOpen
          ? 0
          : this.switch.current.offsetHeight
      });
    }
  };
  componentWillUnmount = () => {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
  };
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.props.setFoundation({
        switchHeight: this.switch.current.offsetHeight
      });
    }, 200);
  };
  render() {
    var close =
      this.state.queryCity !== ""
        ? () => this.setState({ queryCity: "" })
        : this.props.switchCMapCloser;

    const { predictions } = this.state;
    const { displayPreferences, switchCityOpen } = this.props;
    const { backgroundColor } = displayPreferences;
    var buyerClosed = !this.state.openBuyer;
    return (
      <div
        ref={this.switch}
        onDrag={(e) => {
          this.handleTooltipMove(e);
        }}
        onDragExit={() => this.setState({ tooltipTop: null })}
        style={{
          zIndex: "1",
          opacity: switchCityOpen ? 1 : 0,
          backgroundColor: switchCityOpen ? "" : "rgb(20,50,30)",
          overflow: "hidden",
          height: switchCityOpen ? "min-content" : "0px",
          position: "relative",
          width: "100%",
          transition: ".7s ease-in",
          top: this.state.tooltipTop ? this.state.tooltipTop : 0
        }}
      >
        <div
          style={{
            opacity: switchCityOpen ? 1 : 0,
            bottom: "0px",
            position: "absolute",
            width: "100%",
            overflow: "hidden",
            height: switchCityOpen ? "100%" : "0%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            transition: ".4s ease-in"
          }}
          onClick={close}
        />

        <Claim
          clear={() => this.setState({ showReqMayorForm: "" })}
          showReqMayorForm={this.state.showReqMayorForm}
          user={this.props.user}
        />

        <BuyCommunity
          individualTypes={this.props.individualTypes}
          getCommunity={this.props.getCommunity}
          getUserInfo={this.props.getUserInfo}
          user={this.props.user}
          closeBuyer={() => this.setState({ openBuyer: false })}
          openBuyer={this.state.openBuyer}
          auth={this.props.auth}
        />

        <form
          style={{
            overflow: "hidden",
            transition: ".3s ease-in",
            marginLeft: "100px",
            //marginTop: `${this.state.tooltipTop ? this.state.tooltipTop : 0}px`,
            width: "calc(100% - 100px)",
            display: "flex",
            position: "relative",
            height: switchCityOpen ? "56px" : "0px"
          }}
          onSubmit={(e) => {
            e.preventDefault();
            this.onSearchChange();
          }}
        >
          <input
            //className="Switch_CMap_Header"
            autoComplete="off"
            autoCorrect="off"
            placeholder="Try somewhere else"
            ref={this.header}
            style={{
              textIndent: "10px",
              border: "none",
              fontSize: "20px",
              width: "100%",
              height: "min-content",
              minHeight: "100%",
              //backgroundColor: "rgb(180,200,255)"
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              transition: ".3s ease-in-out"
            }}
            value={this.state.queryCity}
            onChange={this.search}
          />
        </form>

        <SearchPowers neww={this.state.new} queryCity={this.state.queryCity} />

        <Search
          openOptionsForThis={(x) => {
            this.setState({
              options: true,
              comm: x,
              comms: false
            });
          }}
          chooseCommunity={this.props.chooseCommunity}
          predictions={predictions}
          queryCity={this.state.queryCity}
          getUserInfo={this.props.getUserInfo}
          showReqMayorForm={this.state.showReqMayorForm}
          auth={this.props.auth}
          user={this.props.user}
          clickCityGifmap={this.props.clickCityGifmap}
          new={this.state.new}
        />

        <Suggest
          switchCityOpen={this.props.switchCityOpen}
          backgroundColor={backgroundColor}
          openOptionsForThis={(x) => {
            this.setState({
              options: true,
              comm: x,
              comms: false
            });
          }}
          auth={this.props.auth}
          user={this.props.user}
          chooseCommunity={this.props.chooseCommunity}
          height={this.state.height}
          queryCity={this.state.queryCity}
          switchCMapCloser={this.props.switchCMapCloser}
          comm={this.state.comm}
          show={
            !this.state.openRadiusThing &&
            (!this.state.new || this.state.queryCity !== this.state.new)
          }
          clickCityGifmap={this.props.clickCityGifmap}
          setHovered={(x) => this.setState(x)}
        />
        <div
          onClick={() => this.setState({ openBuyer: !this.state.openBuyer })}
          style={{
            color: "white",
            top: "0px",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center",
            right: buyerClosed ? "56px" : "0px",
            position: "fixed",
            display: switchCityOpen ? "flex" : "none",
            backgroundColor: buyerClosed
              ? "rgba(30,20,30,.4)"
              : "rgba(0,0,0,.5)",
            width: buyerClosed ? "56px" : "100%",
            height: buyerClosed ? "56px" : "100%"
          }}
        >
          {buyerClosed && "+"}
        </div>
        {/*<div
            style={{ display: this.state.openRadiusThing ? "flex" : "none" }}
          >
            <div className="radiusExpectedToolbar">
              <div className="radiusnumber">
                {this.props.y}
                <br />
                km
              </div>
              <Slider
                axis="y"
                y={this.props.y}
                onChange={this.props.sliderchange}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              position: "fixed",
              borderRadius: "45px",
              border: "1px white solid",
              right: "4.5px",
              top: "4.5px",
              width: "46px",
              height: "46px",
              alignItems: "center",
              justifyContent: "center",
              color: "white"
            }}
            onClick={
              this.state.openRadiusThing
                ? () => this.setState({ openRadiusThing: false })
                : () => this.setState({ openRadiusThing: true })
            }
          >
            {this.state.y}
          </div>*/}
      </div>
    );
  }
}

export default SwitchCity;

/*<img
src={back}
className="backSWback"
alt="error"
onClick={this.props.switchCMapCloser}
/>*/
/*<img src={search} className="searchSWsearch" alt="error" />*/

/*this.state.search ? (
    <div className="yrnotagline">
      Weather forecast from Yr delivered by the Norwegian
      Meteorological Institute and NRK www.yr.no
    </div>
  ) : null}
</div>
{this.state.search ? (
  <div className="yrnotagline">
    Weather forecast from Yr delivered by the Norwegian Meteorological
    Institute and NRK www.yr.no
  </div>
) : null*/
/*this.state.queryingWait ? (
  <div className="queryWaitLoading">loading</div>
) : null*/
