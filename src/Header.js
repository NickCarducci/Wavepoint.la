import React from "react";
import globe from "./components/Icons/Images/globe.png";
import WeatherCitySky from "./components/SwitchCity/WeatherCitySky";
import standardIMG from "./components/SwitchCity/Community/standardIMG.jpg";
import { FilterButton } from "./components/Forum/Topsort";
import refresh from "./components/Icons/Images/refresh.png";

export class Type extends React.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          margin: "0px 14px",
          height: "56px",
          width: "56px",
          justifyContent: "center",
          alignItems: "center"
        }}
        onClick={
          this.props.subForum ? this.props.unSubForum : this.props.eventTypes
        }
      >
        {this.props.forumOpen &&
        (this.props.subForum || this.props.showFilters) ? (
          <img
            src={refresh}
            alt="error"
            style={{
              width: "26px",
              height: "26px"
            }}
          />
        ) : (
          //#333
          <div>
            <div
              style={{
                borderRadius: "6px",
                border: "1px solid rgb(50,100,250)",
                display: "flex",
                position: "relative",
                width: "33px",
                height: "3px",
                backgroundColor: "rgb(50,50,50)",
                margin: "2px 0"
              }}
            />
            <div
              style={{
                borderRadius: "6px",
                border: "1px solid rgb(50,100,250)",
                display: "flex",
                position: "relative",
                width: "30px",
                height: "3px",
                backgroundColor: "#444",
                margin: "2px 0"
              }}
            />
            <div
              style={{
                borderRadius: "6px",
                border: "1px solid rgb(50,100,250)",
                display: "flex",
                position: "relative",
                width: "35px",
                height: "3px",
                backgroundColor: "#555",
                margin: "2px 0"
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

class Words extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.delayed = React.createRef();
  }
  render() {
    const {
      type,
      focusSuggest,
      subForum,
      tileChosen,
      forumOpen,
      commtype
    } = this.props;
    return (
      <form
        style={{
          height: "56px",
          boxShadow: "-5px 0px 10px 2px rgba(30,20,230,.4)",
          paddingLeft: "4px",
          borderBottomRightRadius: "20px",
          backgroundColor: `rgba(30,20,230,${subForum ? ".7" : "1"})`
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={this.delayed}
          onClick={this.props.focusSearching}
          onFocus={this.props.focusSearching}
          //onBlur={this.props.blurSearching}
          className="editcolorheader"
          style={{
            backgroundColor: !focusSuggest ? "rgba(30,20,30,.4)" : "",
            userSelect: "text",
            display: "flex",
            position: "relative",
            color: !focusSuggest ? "white" : "blue",
            fontSize: "24px",
            width: "calc(100vw - 226px)",
            border: "0px solid grey",
            transition: ".3s ease-in"
          }}
          placeholder={
            this.props.globeChosen
              ? "Following"
              : this.props.community
              ? this.props.community.message
              : this.props.city
          }
          value={this.props.searching}
          onChange={(e) => {
            var va = e.target.value;
            this.props.searcher(e);
            clearTimeout(this.reset);
            !this.props.focusSuggest && this.props.focusSearching();
            if (this.typing && va === "") {
              this.reset = setTimeout(() => {
                this.props.blurSearching();
                this.delayed.current.blur();
                this.typing = null;
              }, 2000);
            } else this.typing = true;
          }}
        />
        <div
          style={{
            display: "flex",
            position: "relative",
            width: "max-content",
            opacity: `${subForum ? ".5" : "1"}`,
            borderBottomLeftRadius: "12px",
            transition: ".3s ease-in"
          }}
        >
          <div
            style={{
              fontSize: "20px",
              display: "flex",
              width: "max-content",
              position: "absolute",
              color: "white",
              borderBottomLeftRadius: "12px",
              paddingLeft: "2px",
              transition: ".3s ease-in"
            }}
          >
            {(subForum || !forumOpen) && `${tileChosen}: `}
            {forumOpen && !subForum ? commtype : type}
          </div>
        </div>
      </form>
    );
  }
}

class CityGif extends React.Component {
  render() {
    const { globeChosen, community, highAndTight, forumOpen } = this.props;
    const bury = !highAndTight && forumOpen;
    const gone = community && !globeChosen;
    const gif = !community && !globeChosen;
    return (
      <div
        onClick={
          globeChosen ? this.props.showFollowing : this.props.switchCMapOpener
        }
        style={{
          position: "relative",
          display: "flex",
          overflow: "hidden",
          zIndex: bury ? "-1" : "1",
          width: bury ? "0px" : "56px",
          height: bury ? "0px" : "56px",
          top: this.props.findheighter,
          transition: "0.9s ease-in"
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center",
            width: !this.props.isProfile ? "0px" : "56px",
            height: !this.props.isProfile ? "0px" : "56px"
          }}
        >
          {this.props.profile && (
            <img
              style={{
                opacity: this.props.isProfile ? "1" : ".5",
                borderTopRightRadius: this.props.isProfile ? "20px" : "",
                borderRadius: this.props.isProfile ? "" : "50px",
                borderBottomRightRadius: this.props.isProfile ? "50px" : "",
                width: this.props.isProfile ? "36px" : "10px",
                height: this.props.isProfile ? "36px" : "10px",
                padding: this.props.isProfile ? "10.5px" : "6px",
                position: "absolute",
                transition: ".3s ease-out",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white"
              }}
              alt={
                this.props.profile.photoThumbnail +
                "@" +
                this.props.profile.username
              }
              src={this.props.profile.photoThumbnail}
            />
          )}
        </div>
        <div
          style={{
            width: !gif ? "0px" : "56px",
            height: !gif ? "0px" : "56px",
            display: "flex",
            position: "relative",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <WeatherCitySky
            height={40}
            forProfile={true}
            city={this.props.city}
          />
        </div>
        <img
          style={{
            opacity: globeChosen ? "1" : ".5",
            borderTopRightRadius: globeChosen ? "20px" : "",
            borderRadius: globeChosen ? "" : "50px",
            borderBottomRightRadius: globeChosen ? "50px" : "",
            width: globeChosen ? "36px" : "10px",
            height: globeChosen ? "36px" : "10px",
            padding: globeChosen ? "10.5px" : "6px",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            transition: ".3s ease-out",
            backgroundColor: "white"
          }}
          alt="error"
          src={globe}
        />
        <div
          style={{
            borderRadius: "28px",
            overflow: "hidden",
            display: "flex",
            position: "relative",
            width: gone ? "0px" : "56px",
            height: gone ? "0px" : "56px",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              display: "flex",
              position: "relative",
              borderRadius: "28px",
              overflow: "hidden",
              width: "46px",
              height: "46px"
            }}
          >
            {community && (
              <img
                src={
                  community.photoThumbnail
                    ? community.photoThumbnail
                    : standardIMG
                }
                style={{
                  display: "flex",
                  position: "absolute",
                  width: "46px",
                  height: "auto"
                }}
                alt="error"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}
class Header extends React.Component {
  state = {};
  toggleForum = () => {
    if (this.props.tilesMapOpen !== null) {
      this.props.eventTypes();
    } else {
      this.props.openForum();
    }
  };
  render() {
    const {
      notificationReactions,
      notificationComments,
      newFollowers,
      openNotifs,
      type,
      vertical,
      highAndTight,
      typeOrder,
      //top,
      //started,
      //postHeight,
      community,
      globeChosen,
      forumOpen
    } = this.props;
    const lit =
      "https://www.dl.dropboxusercontent.com/s/756f3108r08yerc/lit%20icon%20%282%29.png?dl=0";
    const shocked =
      "https://www.dl.dropboxusercontent.com/s/vfm52e6kcelapdz/Shocked%20icon.png?dl=0";
    const laughing =
      "https://www.dl.dropboxusercontent.com/s/zznekjklhmhnw9o/Laughing%20icon%20%281%29.png?dl=0";
    const contempt =
      "https://www.dl.dropboxusercontent.com/s/ash7v6zps0e9cag/Contempt%20icon.png?dl=0";
    const love =
      "https://www.dl.dropboxusercontent.com/s/o3s4bag8xmorigh/Love%20icon.png?dl=0";

    const reactions = ["lit", "shocked", "laughing", "contempt", "love"];
    return (
      <div
        style={{
          top: this.props.findheighter,
          /*top: openNotifs
            ? "0px"
            : postHeight > 0
            ? ""
            : started || this.props.showFilters || this.props.chatsopen
            ? "-56px"
            : top || (this.props.tilesMapOpen !== null && this.props.forumOpen)
            ? "0px"
            : "calc(100% - 56px)",
          bottom: openNotifs
            ? "0px"
            : postHeight > 0
            ? "-56px"
            : started || this.props.showFilters
            ? "calc(100% + 56px)"
            : top
            ? "calc(100% - 56px)"
            : "0px",
          backgroundColor: this.state.newReaction
            ? `rgba(255,190,200,${this.state.pulsateNewReaction ? ".8" : "0"})`
            : "",*/ backgroundColor:
            "rgba(5,5,30,.4)",
          display: vertical ? "block" : "flex",
          position: vertical ? "fixed" : "relative",
          justifyContent: "space-between",
          //left: "0px",
          transform: `translateY(${this.props.started ? "-56px" : "0px"})`,
          maxHeight: this.props.isProfile || this.props.chatsopen ? "0px" : "",
          height: `calc(${vertical ? "100%" : "0%"} + ${vertical ? 0 : 56}px)`,
          width: vertical ? "56px" : "100%",
          color: "white",
          fontSize: "26px",
          transition: `.4s ease-out`
        }}
      >
        <div
          onClick={() => {
            if (this.props.searching !== "") {
              this.props.resetSearch();
            } else if (vertical) {
              this.props.setNapkin({ highAndTight: false });
            } else {
              this.props.setFoundation({
                subForum: false,
                started: true,
                switchCityOpen: false,
                chatsopen: false
              });
              this.props.setIndex({ forumOpen: false });
              setTimeout(() => {
                window.scroll(0, 0);
              }, 400);
            }
          }}
          style={{
            overflow: "hidden",
            display: "flex",
            position: "relative",
            width: this.props.forumOpen ? "56px" : "0px",
            height: this.props.forumOpen ? "56px" : "0px",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              backgroundColor: "rgb(20,20,20)",
              display: "flex",
              top: "56px",
              width: this.props.forumOpen ? "46px" : "0px",
              height: this.props.forumOpen ? "46px" : "0px",
              alignItems: "center",
              justifyContent: "center",
              borderTopRightRadius: "50px",
              borderBottomRightRadius: "50px"
            }}
          >
            &times;
          </div>
        </div>
        <CityGif
          forumOpen={forumOpen}
          globeChosen={globeChosen}
          community={community}
          highAndTight={highAndTight}
          showFollowing={this.props.showFollowing}
          switchCMapOpener={this.props.switchCMapOpener}
        />
        {/**from profile */}
        {vertical && this.props.closeBottom ? (
          <div onClick={this.props.unclose}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderTop: "5px solid",
                borderRight: "5px solid",
                transform: "rotate(45deg)"
              }}
            />
          </div>
        ) : (
          <Words
            focusSuggest={this.props.focusSuggest}
            focusSearching={this.props.focusSearching}
            blurSearching={this.props.blurSearching}
            setIndex={this.props.setIndex}
            lastForumOpen={this.props.lastForumOpen}
            searching={this.props.searching}
            searcher={this.props.searcher}
            commtype={this.props.commtype}
            subForum={this.props.subForum}
            tileChosen={this.props.tileChosen}
            type={type}
            community={this.props.community}
            globeChosen={this.props.globeChosen}
            city={this.props.city}
            forumOpen={this.props.forumOpen}
          />
        )}
        <div
          style={{
            zIndex: !highAndTight && this.props.forumOpen ? "-1" : "1",
            width: !highAndTight && this.props.forumOpen ? "0px" : "56px",
            height: !highAndTight && this.props.forumOpen ? "0px" : "56px",
            display: "flex",
            position: "relative",
            transition: "0.3s ease-in"
          }}
        >
          <Type
            eventTypes={this.props.eventTypes}
            subForum={this.props.subForum}
            unSubForum={this.props.unSubForum}
            forumOpen={this.props.forumOpen}
            showFilters={this.props.showFilters}
          />
        </div>
        <div
          onClick={() => {
            this.props[typeOrder.trigger]();
            if (!this.props.subForum) this.props.openFilters();
          }}
          style={{
            zIndex: !highAndTight && this.props.forumOpen ? "1" : "-1",
            width: !highAndTight && this.props.forumOpen ? "56px" : "0px",
            height: !highAndTight && this.props.forumOpen ? "56px" : "0px",
            display: "flex",
            position: "relative",
            transition: "0.3s ease-in"
          }}
        >
          {!this.props.showFilters ? (
            typeOrder && this.props[typeOrder.collection] ? (
              this.props[typeOrder.collection]
            ) : (
              <FilterButton openFilters={null} inTopSort={true} />
            )
          ) : null}
        </div>
        <div
          onClick={this.toggleForum}
          style={{
            transition: ".3s ease-in",
            display: !this.props.forumOpen ? "flex" : "none",
            position: "relative",
            width: "46px",
            height: "46px",
            borderRadius: "45px",
            border: "5px solid #78f8fff2",
            backgroundColor: this.state.newReaction
              ? "rgb(255,190,200)"
              : "rgb(20,20,20)",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "12px"
          }}
        >
          <div
            style={{
              display: this.props.tilesMapOpen !== null ? "flex" : "none",
              position: "absolute"
            }}
          >
            &times;
          </div>
          <div
            className="fas fa-scroll"
            style={{
              transition: ".3s ease-in",
              color: this.state.newReaction ? "rgb(255,190,200)" : "",
              display: this.props.tilesMapOpen === null ? "flex" : "none",
              position: "absolute"
            }}
          />
        </div>
        <div
          onClick={this.props.scrollBackToTheLeft}
          style={{
            display: this.props.forumOpen ? "flex" : "none",
            width: !highAndTight && this.props.forumOpen ? "0px" : "56px",
            height: !highAndTight && this.props.forumOpen ? "0px" : "56px",
            transition: ".3s ease-out",
            position: "relative",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.state.newReaction ? (
            reactions.map((reaction) => {
              var reactionSrc =
                reaction === "lit"
                  ? lit
                  : reaction === "shocked"
                  ? shocked
                  : reaction === "laughing"
                  ? laughing
                  : reaction === "contempt"
                  ? contempt
                  : reaction === "love"
                  ? love
                  : null;
              return (
                <img
                  style={{
                    width: this.state.newReaction === reaction ? "40px" : "0px",
                    height:
                      this.state.newReaction === reaction ? "40px" : "0px",
                    transition: ".3s ease-in"
                  }}
                  src={reactionSrc}
                  alt={`reaction ${reaction}`}
                />
              );
            })
          ) : (
            <div
              style={{
                fontSize: highAndTight || !this.props.forumOpen ? "" : "0px",
                transform: `rotate(${!this.props.forumOpen ? "180" : "0"}deg)`,
                transition: `.${"6"}s ease-out`,
                backgroundColor: this.state.newReaction
                  ? `rgba(140,20,30,${!this.props.forumOpen ? ".3" : ".9"})`
                  : "rgba(20,20,40,.5)",
                display: this.props.open ? "flex" : "none",
                width: !this.props.forumOpen
                  ? "23px"
                  : !highAndTight && this.props.forumOpen
                  ? "0px"
                  : "46px",
                height: !this.props.forumOpen
                  ? "23px"
                  : !highAndTight && this.props.forumOpen
                  ? "0px"
                  : "46px",
                right: "0px",
                borderRadius: "10px",
                positon: "absolute",
                paddingBottom: "3px",
                alignItems: "center",
                justifyContent: "center"
              }}
              onClick={() =>
                this.props.setNotifOpen({
                  openNotifs: !openNotifs
                })
              }
              alt="error"
            >
              {(newFollowers ? newFollowers.length : 0) +
                (notificationComments ? notificationComments.length : 0) +
                (notificationReactions ? notificationReactions.length : 0)}
            </div>
          )}
        </div>
        <div
          onClick={this.props.scrollBackToTheLeft}
          style={{
            width: !highAndTight && this.props.forumOpen ? "56px" : "0px",
            height: !highAndTight && this.props.forumOpen ? "56px" : "0px",
            display: "flex",
            position: "relative",
            transition: ".3s ease-out",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              width: !highAndTight && this.props.forumOpen ? "46px" : "0px",
              fontSize: !highAndTight && this.props.forumOpen ? "" : "0px",
              height: !highAndTight && this.props.forumOpen ? "46px" : "0px",
              border: "1px solid grey",
              borderRadius: "50px",
              color: "grey",
              backgroundColor: "white",
              positon: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(270deg)"
            }}
          >
            {">"}
          </div>
        </div>
      </div>
    );
  }
}
export default Header;

/*
  componentDidMount = () => {
    setTimeout(() => this.setFAAttr(), 4000);
  };
  /*update = (context, width, height) => {
    context.clearRect(0, 0, width, height);
    //context.fontWeight = 900;
    //context.content = "\f70e";
    //context.fontFamily = "Font Awesome 5 Free";
    context.textAlign = "center";
    context.textBaseline = "middle";
    //context.fontWeight = "normal";
    context.font = `900 14px "Font Awesome 5 Free"`;
    context.fillStyle = "white";

    context.fillText(`\uf70e`, 22, 22);
    setTimeout(
      () =>
        window.requestAnimationFrame(() => this.update(context, width, height)),
      1000
    );
  };*
  setFAAttr = () => {
    var URL = window.URL;

    /*var target = this.image.current;
    if (target) {
      var elem = `<svg width="0" xmlns="http://www.w3.org/2000/svg">${target.firstElementChild}</svg>`;

      var SVG = new Blob([elem], {
        type: "image/svg+xml;charset=utf-8"
      });*/
/* var img = new Image();
    var scrollFA = URL.createObjectURL(SVG);
    img.onload = (img) => {
      if (!this.state.madeIntoPng) {
        this.setState({ madeIntoPng: true });*
    var canvas = this.canvas.current;
    //var img = new Image();
    //var img = this.image.current;
    if (canvas) {
      var context = canvas.getContext("2d");
      //context.drawImage(img.path[0], 22, 22);
      //console.log(img.path[0]);
      canvas.width = 24;
      canvas.height = 24;
      //context.clearRect(0, 0, canvas.width, canvas.height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      //context.fontWeight = "normal";
      context.font = `900 14px "Font Awesome 5 Free"`;
      context.fillStyle = "white";

      context.fillText(`\uf70e`, 14, 14);
      canvas.onclick = () => this.toggleForum();
      //URL.revokeObjectURL(scrollFA);
      /*setTimeout(() => {
        var PNG = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        //context.clearRect(0, 0, canvas.width, canvas.height);
        var pngIMG = URL.createObjectURL(
          new Blob([PNG], { type: "image/png" })
        );
        img.onload = (img) => {
          console.log(img);
          //context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img.path[0], 22, 22);
          console.log(img.path[0]);
        };
        console.log(pngIMG);
        img.src = pngIMG;
      }, 2000);*
    }
    /*}
    };
    img.src = scrollFA;*
  };
        <canvas
          onClick={this.toggleForum}
          ref={this.canvas}
          style={{
            zIndex: "6",
            top: "10px",
            right: "10px",
            //right: "100px",
            display: this.props.tilesMapOpen === null ? "flex" : "none",
            position: "absolute"
          }}
        />
 */
