import React from "react";
import Marker from "./components/Map/Marker";
import MappCluster from "./components/Map/MappCluster";
import PropTypes from "prop-types";
import MarkerCommunity from "./components/Map/MarkerCommunity";
import MappGroup from "./components/Map/MappGroup";
import Sprites from "./components/Map/Sprites";
import Accessories from "./components/Map/Accessories";
import MapGL, { FlyToInterpolator, Layer, Source } from "react-map-gl";
import { Link } from "react-router-dom";
import { canIView, handleLocation } from "./widgets/authdb";
import "./components/Icons/Headerstyles.css";
import "./components/Map/Map.css";
import "./components/Map/CalendarMap.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-calendar/dist/Calendar.css";
import { suggestions } from "./widgets/arraystrings";
import MarkerCity from "./components/Map/MarkerCity";

const getDuration = (startViewState, endViewState) => {
  const degPerSecond = 100;
  const deltaLat = Math.abs(startViewState.latitude - endViewState.latitude);
  let deltaLng = Math.abs(startViewState.longitude - endViewState.longitude);
  // Transition to the destination longitude along the smaller half of the circle
  if (deltaLng > 180) deltaLng = 360 - deltaLng;
  return (Math.max(deltaLng, deltaLat) / degPerSecond) * 1000;
};

const metersToPixels = (meters, latitude) =>
  Math.round(meters / 0.075 / Math.cos((latitude * Math.PI) / 180));
// https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
const circleColorOpts = [
  "match",
  ["get", "distance"],
  8,
  "rgba(255,240,180,.6)",
  9,
  "rgba(255,240,160,.6)",
  10,
  "rgba(255,220,160,.6)",
  11,
  "rgba(255,200,160,.6)",
  12,
  "rgba(255,180,160,.6)",
  13,
  "rgba(235,200,160,.6)",
  14,
  "rgba(215,215,160,.6)",
  15,
  "rgba(200,235,160,.6)",
  16,
  "rgba(180,255,160,.6)",
  17,
  "rgba(160,235,200,.6)",
  18,
  "rgba(160,215,215,.6)",
  19,
  "rgba(160,200,235,.6)",
  20,
  "rgba(160,180,255,.6)",
  "rgba(160,180,255,.6)"
];
class Mapbox extends React.Component {
  constructor(props) {
    super(props);
    var dayLiked =
      new Date().getHours() > 4 && new Date().getHours() < 12
        ? true
        : new Date().getHours() > 12 && new Date().getHours() < 20
        ? 1
        : false;

    this.state = {
      shade: 9,
      offscreens: [],
      tellMeAll: "",
      now: new Date().getTime(),
      periods: [],
      chosenVector: "earthquake",
      dayLiked,
      lastDayLiked: dayLiked,
      showInfoWindow: false,
      viewport: {
        width: window.innerWidth,
        height: "100%",
        pitch: 60, // pitch in degrees
        bearing: -60,
        longitude: props.center[0],
        latitude: props.center[1],
        zoom: props.zoomChosen
      },
      deviceLocation: false
    };
    this._cluster = React.createRef();
    this.mapRef = React.createRef();
    this.communityLogo = React.createRef();
    this.onClick = this.onClick.bind(this);
    this.darkModeQuery = window.matchMedia(`(prefers-color-scheme: dark)`);
    this.lightModeQuery = window.matchMedia(`(prefers-color-scheme: light)`);
  }
  onClick(cluster) {
    const { geometry } = cluster;
    this.resizee(
      false,
      false,
      geometry.coordinates,
      this.state.viewport.zoom < 6
        ? 6
        : this.state.viewport.zoom < 9
        ? 9
        : this.state.viewport.zoom < 13
        ? 13
        : this.state.viewport.zoom < 16
        ? 16
        : this.state.viewport.zoom + 2
    );
  }

  componentDidMount = () => {
    window.addEventListener("resize", this.resizee);
    window.addEventListener(this.darkModeQuery, this.setDark);
    window.addEventListener(this.lightModeQuery, this.setLight);
    this.setState({
      readyForMap: true
    });
  };
  setDark = (darkModeQuery) =>
    this.setState({
      darkMode: darkModeQuery.length !== 0,
      darkModeListener: darkModeQuery
    });
  setLight = (lightModeQuery) =>
    this.setState({
      lightMode: lightModeQuery.length !== 0,
      preferenceListener: lightModeQuery
    });
  componentWillUnmount = () => {
    const { preferenceListener, darkModeListener } = this.state;
    if (preferenceListener)
      window.removeEventListener(this.lightModeQuery, this.setLight);
    if (darkModeListener)
      window.removeEventListener(this.darkModeQuery, this.setDark);
    window.removeEventListener("resize", this.resizee);
  };
  resizee = (event, commChange, coords, zoom) => {
    const { mapbox } = this.props;
    if (mapbox) {
      var viewport = { ...this.state.viewport };
      var { lng, lat } = mapbox.getCenter();
      viewport.latitude = coords ? coords[1] : lat;
      viewport.longitude = coords ? coords[0] : lng;
      viewport.zoom = zoom ? zoom : this.props.zoomChosen;
      //const{offsetHeight,offsetWidth} = this.mapPage;
      viewport.width = window.innerWidth;
      viewport.height = "100%";
      viewport.transitionDuration = "auto";
      viewport.transitionInterpolator = new FlyToInterpolator();
      const timeout = getDuration(this.state.viewport, viewport);
      //viewport.width = this.props.width;
      //viewport.height = this.props.height - 56;
      /*viewport.onTransitionStart = () => {
      this.animatedResize(this.state.viewPortHeight);
      clearTimeout(this.end);
      this.end = setTimeout(
        () => this.animatedResize(this.state.viewPortHeight),
        timeout
      );
      //mapbox.resize();
    };*/
      const handleResize = () => {
        clearTimeout(this.end);
        this.end = setTimeout(() => {
          console.log("resize mapbox");
          if (commChange) {
            this.updateSnowfall();
          }
        }, timeout);
      };
      viewport.onTransitionStart = handleResize;
      this.setState({ flyOver: true, viewport }, () =>
        setTimeout(() => this.setState({ flyOver: false }), timeout)
      );
    }
  };

  /*animatedResize = (height) => {
    var anim;
    const newHeight = this.mapPage.current.offsetHeight;
    const add = (num) => num + 1;
    const sub = (num) => num - 1;
    const animate = (height) => {
      height = height < newHeight ? add(height) : sub(height);
      if (height !== newHeight) {
        var viewport = { ...this.state.viewport };
        viewport.height = height;
        viewport.width = "100%";
        this.setState({ viewport }, () => {
          anim = requestAnimationFrame(() => animate(height));
        });
      }
    };
    animate(height);
    if (height === newHeight) {
      cancelAnimationFrame(anim);
    }
  };*/

  componentDidUpdate = (prevProps) => {
    const { mapbox } = this.props;
    if (mapbox !== prevProps.mapbox) {
      /*mapbox.setPaintProperty("style", "background-color-transition", {
        duration: 500,
        delay: 0
      });*/
    }

    if (this.state.dayLiked !== this.state.lastDayLiked) {
      this.setState({
        lastDayLiked: this.state.dayLiked,
        preferTimeBasedMap: this.state.dayLiked
      });
    }
    if (
      prevProps.forumOpen !== this.props.forumOpen ||
      prevProps.zoomChosen !== this.props.zoomChosen
    ) {
      mapbox && this.resizee(false);
    }
    if (this.props.center !== prevProps.center) {
      if (mapbox) {
        console.log("location change " + this.props.center);
        this.resizee(false, false, this.props.center);
      }
    }
  };
  updateSnowfall = () =>
    this.setState(
      { showPeriods: false },
      async () =>
        await fetch(
          `https://api.weather.gov/points/${this.props.center[1]},${this.props.center[0]}`
        )
          .then(async (res) => await res.json())
          .then(async (result) => {
            if (result.properties) {
              //https://api.weather.gov/gridpoints/LOX/154,44/forecast
              var link =
                "https://api.weather.gov/gridpoints/" +
                result.properties.gridId +
                "/" +
                result.properties.gridX +
                "," +
                result.properties.gridY +
                "/forecast/hourly";
              await fetch(link, {
                Accept: "application/geo+json",
                "User-Agent": "(thumbprint.us, nick@thumbprint.us)"
              })
                .then(async (res) => await res.json())
                .then((result) => {
                  if (result.status) {
                    this.setState({ showPeriods: false });
                  } else {
                    this.setState({
                      showPeriods: true,
                      periods: result.properties.periods
                    });
                    //this.state.readyForMap && this.updateForecast();
                  }
                })
                .catch((err) => console.log(err.message));
            }
          })
          .catch((err) => console.log(err.message))
    );

  openCluster = (x) =>
    this.setState(
      {
        tellMeAll: x.place_name
      },
      () => this.props.openSurrounds()
    );
  handleMapboxResults = (out) => {
    const city = out.mapbox[0];
    const center = out.mapbox[1];
    //console.log("found " + city, center);
    if (city !== this.props.city) {
      const cityapi = city.replace(/[, ]+/g, "_");
      const state = city.split(", ")[1];
      const stateapi = state.replaceAll(/ /g, "_");
      this.setState(
        {
          deviceLocation: { city, center }
        },
        () => {
          this.props.chooseCitypoint(
            center,
            this.state.distance,
            city,
            cityapi,
            stateapi,
            null
          );
          console.log("set " + city, center);
          this.props.setCommunity({ city });
        }
      );
    } else {
      this.resizee(false, false, center);
    }
  };
  handlePinTouch = async (deviceLocation) => {
    const { lastCoords } = this.state;
    var place_name = this.props.city;
    var center = this.props.center;
    if (deviceLocation && deviceLocation.place_name) {
      place_name = deviceLocation.place_name;
      center = deviceLocation.center;
    }
    const error = (err) => {
      if (err.code === 1) {
        //("PERMISSION_DENIED:Permission denied")
        this.setState({ deviceLocation: "red" });
      } else if ([2, 3].includes(err.code)) {
        if (err.code === 2) {
          this.setState({ deviceLocation: "orange" });
          window.alert(
            "systemError:POSITION_UNAVAILABLE:Permission allowed, location disabled:please try again later"
          );
        } else if (err.code === 3) {
          this.setState({ deviceLocation: false });
          window.alert(
            "devError:TIMEOUT:Permission allowed, timeout reached:please check your browser settings, try again later or contact nick@thumbprint.us please"
          );
        }
      }
    };
    const location = await handleLocation(
      this.props.city,
      deviceLocation,
      lastCoords
    );
    if (location) {
      console.log(location);
      if (location.constructor === Object && Object.keys(location)) {
        if (location.code) return error(location);
        if (location.deviceLocation) {
          center = location.deviceLocation.center;
          place_name = location.deviceLocation.place_name;
        }
        this.setState(
          {
            lastCoords: center,
            deviceLocation: location.deviceLocation && location.deviceLocation
          },
          () => {
            if (location.mapbox) {
              this.handleMapboxResults(location);
            } else if (center) {
              this.changeArea(center, place_name);
            } else if (location.lastCoords) {
              this.resizee(false, false, Object.keys(location).center);
            } else {
              console.log("err Mapbox.js ", center, place_name);
            }
          }
        );
      } else {
        this.resizee(false, false, center);
      }
    } // else console.log("dev unlogged");
  };
  changeArea = (center, city) => {
    setTimeout(() => {
      const state = city.split(", ")[1];
      const cityentry = city.split(",")[0];
      this.props.chooseCitypoint(
        center,
        this.props.distance,
        cityentry,
        city.replace(/[, ]+/g, "_"), //cityapi
        state ? state.replace(/ /g, "_") : "ZZ", //stateapi
        null
      );
    }, 1234);
  };
  lighter = () => {
    //const num = this.state.shade + 1 < 10 ? this.state.shade + 1 : 9;
    //this.setState({ shade: num });

    //var mapLayer = this.props.mapbox.getLayer("elevation");
    //console.log(mapLayer);
    //if (mapLayer === undefined) {
    /*this.props.mapbox.addSource("elevation", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512
      });*/
    this.props.mapbox.setStyle(
      this.props.apple
        ? "mapbox://styles/nickcarducci/ckkbz93qa425q17oyzia83kqr"
        : "mapbox://styles/nickcarducci/ckri5jikv29qy17pfgzm4q41k"
    ); //elevated
    /*this.props.mapbox.setTerrain({
      source: "elevation",
      exaggeration: 1
    });*/
  };
  darker = () => {
    //const num = this.state.shade - 1 > -1 ? this.state.shade - 1 : 0;
    //this.setState({ shade: num });
    //var mapLayer = this.props.mapbox.getLayer("elevation");

    //if (typeof mapLayer !== "undefined") {
    //this.props.mapbox.removeSource("elevation");
    this.props.mapbox.setStyle(
      "mapbox://styles/nickcarducci/ckkbz93qa425q17oyzia83kqr"
    ); //white
    //this.props.mapbox.setTerrain();
  };
  render() {
    const weatherOpen =
      this.state.chosenVector === "snowfall" &&
      this.state.periods.length > 0 &&
      !this.state.hideSnowfall &&
      this.state.showPeriods;
    const {
      shiftRight,
      tileChosen,
      commtype,
      community,
      auth,
      classes,
      departments,
      clubs,
      jobs,
      shops,
      services,
      housing,
      pages,
      events,
      restaurants,
      mapbox
    } = this.props;
    const {
      deviceLocation,
      readyForMap,
      viewport,
      suggestionsOnMap
    } = this.state; /*: this.props.apple
? "mapbox://styles/nickcarducci/ckoa1yw30265z17mvhmm6is5b"
*/
    //"mapbox://styles/nickcarducci/ck1hrkqiz5q9j1cn573jholv3"
    const mapStyle = this.props.apple
      ? "mapbox://styles/nickcarducci/ckkbz93qa425q17oyzia83kqr"
      : "mapbox://styles/nickcarducci/ckri5jikv29qy17pfgzm4q41k";
    /*(preferTimeBasedMap === 2 && dayLiked === 2) || lightMode
        ? "mapbox://styles/nickcarducci/ckkbz93qa425q17oyzia83kqr"
        : (preferTimeBasedMap === 1 && dayLiked === 1) || darkMode //night
        ? "mapbox://styles/nickcarducci/ck1hrh6066cfc1cqpn9ubwl33"
        : preferTimeBasedMap && dayLiked //day
        ? "mapbox://styles/nickcarducci/ckdu8diut0bx919lk1gl327vt"
        : "mapbox://styles/nickcarducci/ckkbz93qa425q17oyzia83kqr";*/
    const eve = events
      ? events.filter(
          (x) => (x.name = x.place_name ? x.place_name : x.name) && x
        )
      : [];
    const mp =
      commtype === "classes"
        ? classes
        : commtype === "department"
        ? departments
        : tileChosen === "club"
        ? clubs
        : tileChosen === "job"
        ? jobs
        : tileChosen === "shop"
        ? shops
        : tileChosen === "service"
        ? services
        : tileChosen === "housing"
        ? housing
        : tileChosen === "page"
        ? pages
        : tileChosen === "event"
        ? eve
        : tileChosen === "restaurant"
        ? restaurants
        : [];
    var mapThis = mp && mp.length > 0 ? mp : [];

    /**
         * 
    let addresses = [];
    if (mapThis)
      mapThis.mapbox((x) => {
        return addresses.push(x.place_name);
      });
    var object = {};
    var repeats = [];
     var unique = new Set(addresses)
     var firstTime={}
       unique.mapbox(x=>{
         if(addresses.includes(x)&&!firstTime[x]){
           firstTime[x]=true
        inLot.push("")}
       })
       if(rest){
       return repeats.push(pl.place_name)
      
         */
    var inLot = [];
    let names = [];
    var mapit = null;
    if (mapThis) {
      mapThis.filter((x) => x.center || x.venue.address);

      mapThis.map((x) => names.push(x.name ? x.name : x.id));
      var unique = [...new Set(names)];
      mapit =
        unique &&
        mapThis.filter((x) => {
          const id = x.name ? x.name : x.id;
          const first = unique.includes(id);
          unique.filter((y) => y === id);
          return first;
        });
      inLot = mapThis.filter((x) => x && x.name === this.state.tellMeAll);
    }
    var communityIds = [];

    const pixelFloorSize = metersToPixels(
      this.props.distance,
      this.props.center[1]
    ); //(radiusInMeters, latitude)
    const rightStyle = {
      display: !this.props.openCal && !this.props.started ? "flex" : "none",
      position: "fixed",
      flexDirection: "column",
      alignItems: "flex-end",
      textAlign: "right",
      transition: ".3s ease-in",
      margin: "6px 0px"
    };
    return (
      <div
        style={{
          top: this.props.switchHeight,
          right: "0px",
          opacity: !this.props.switchCityOpen ? 1 : 0.4,
          transition: `${!this.props.switchCityOpen ? 0 : 0.4}s ease-in`,
          position: "fixed",
          backgroundColor: "rgb(100,0,0)",
          width: "100%",
          height: "100%"
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            transition: ".3s ease-in",
            bottom: "56px",
            position: "fixed",
            zIndex: "9",
            left: "50px",
            width: "0px",
            height: "70px",
            boxShadow: "0px 0px 50px 20px rgb(20,20,20)"
          }}
        >
          <div
            onClick={this.lighter}
            style={{
              transform: "translateX(-50%)",
              width: "50px",
              height: "50%"
            }}
          ></div>
          <div
            onClick={this.darker}
            style={{
              transform: "translateX(-50%)",
              width: "50px",
              height: "50%"
            }}
          ></div>
        </div>
        <div
          style={{
            userSelect: "none",
            backgroundColor: "white",
            transition: ".3s ease-in",
            top: "56px",
            position: "absolute",
            zIndex: "2"
          }}
        >
          <div
            onClick={() => this.setState({ deviceLocation: null })}
            style={{
              zIndex: "3",
              right: shiftRight ? "190px" : "90px",
              bottom: "43px",
              position: "fixed",
              fontSize:
                this.state.hoveringPin && deviceLocation ? "20px" : "0px",
              transition: ".3s ease-in"
            }}
          >
            &times;
          </div>
          <div
            onClick={() => this.setState({ deviceLocation: null })}
            style={{
              zIndex: "3",
              right: shiftRight ? "190px" : "90px",
              bottom: "43px",
              position: "fixed",
              fontSize:
                this.state.hoveringPin && deviceLocation ? "20px" : "0px",
              transition: ".3s ease-in"
            }}
          >
            &times;
          </div>
          <i
            onMouseEnter={() =>
              !this.state.hoveringPin &&
              //deviceLocation &&
              this.setState({ hoveringPin: true }, () => {
                setTimeout(() => this.setState({ hoveringPin: false }), 5000);
              })
            }
            onClick={() => {
              if (this.state.offscreens.length > 0) {
                console.log(
                  this.state.offscreens.length + " offscreen(s) cleared"
                );
                this.setState({ offscreens: [] }, () =>
                  this.props.resetLastQuery()
                );
              } else if (deviceLocation === "orange") {
                this.setState({ deviceLocation: false }, () => {
                  /*navigator.permissions
                    .revoke({ name: "geolocation" })
                    .then((result) => {
                      console.log(result.state);
                    })
                    .catch((err) => {
                      console.log(err.message);*/
                  window.alert(
                    "location button reset:please disable from your browser settings " +
                      "if you want to disable our code running on your browser to GET the " +
                      "coordinantes of your device again, although only this button triggers " +
                      "it and we do not have abstracted server calls elsewhere. see open-source " +
                      "github.com/nickcarducci/wavepoint.la"
                  );
                  // });
                });
              } else
                this.state.hoveringPin && this.handlePinTouch(deviceLocation);
            }}
            className="fas fa-map-pin"
            style={{
              ...rightStyle,
              borderRadius: "10px",
              padding: "4px 10px",
              right: shiftRight ? "140px" : "40px",
              backgroundColor:
                deviceLocation === "red"
                  ? "rgb(170,100,145)"
                  : "rgb(100,100,255)",
              boxShadow: `0px 0px 10px 2px ${
                deviceLocation === "red"
                  ? "rgb(220,70,80)"
                  : deviceLocation === "orange"
                  ? "rgb(20,20,20)"
                  : deviceLocation
                  ? "rgb(10,255,255)"
                  : "rgb(170,170,170)"
              }`,
              border: `3px solid ${
                this.state.hoveringPin ? "white" : "rgb(150,200,250)"
              }`,
              color:
                deviceLocation === "red"
                  ? "rgb(75,25,25)"
                  : deviceLocation === "orange"
                  ? "rgb(235,165,110)"
                  : deviceLocation
                  ? "rgb(10,255,255)"
                  : "rgb(20,20,140)"
            }}
          />
        </div>
        <Accessories
          rightStyle={rightStyle}
          offscreens={this.state.offscreens}
          suggestionsOnMap={suggestionsOnMap}
          plume={() => {
            //this.props.openStart();
            //window.scrollTo(0, 0);
            this.setState({
              suggestionsOnMap: suggestionsOnMap ? null : suggestions
            });
          }}
          mapbox={mapbox}
          clickZoomer={this.props.clickZoomer}
          eventTypes={this.props.eventTypes}
          displayPreferences={this.props.displayPreferences}
          setDisplayPreferences={this.props.setDisplayPreferences}
          calToggle={this.props.calToggle}
          openCal={this.props.openCal}
          woah={this.props.woah}
          shiftRight={this.props.shiftRight}
          goToRadius={this.props.goToRadius}
          monthCalOpen={this.props.monthCalOpen}
          invites={this.props.invites}
          selfvites={this.props.selfvites}
          fonish={this.props.fonish}
          materialDateOpen={this.props.materialDateOpen}
          pathname={this.props.pathname}
          started={false}
          forumOpen={this.props.forumOpen}
          tilesMapOpen={this.props.tilesMapOpen}
          chatsopen={this.props.chatsopen}
          achatopen={this.props.achatopen}
          setFoundation={this.props.setFoundation}
          setIndex={this.props.setIndex}
          go1={this.props.go1}
          setData={this.props.setData}
          current={this.props.current}
          current1={this.props.current1}
          y={this.props.y}
          toggleCloseStuff={this.props.toggleCloseStuff}
          start={this.props.start}
          unStart={this.props.unStart}
          tilesOpener={this.props.tilesOpener}
          openStart={this.props.openStart}
          range={this.props.range}
          queriedDate={this.props.queriedDate}
          backtotoday={this.backtotoday}
          alltime={this.props.alltime}
          sliderchange={this.props.sliderchange}
          distance={this.props.distance}
          trueZoom={this.props.trueZoom}
          zoomUpdated={this.state.zoomUpdated}
          chooseEvents={this.props.chooseEvents}
          commtype={this.props.commtype}
          openchat={this.props.openchat}
          tileChosen={this.props.tileChosen}
          openForum={this.props.openForum}
          openthestuff={this.props.openthestuff}
          zoomChoose1={this.props.zoomChoose1}
          zoomChoose2={this.props.zoomChoose2}
          zoomChoose3={this.props.zoomChoose3}
          zoomChoose4={this.props.zoomChoose4}
          queryDate={this.props.queryDate}
          zoomChosen={this.props.zoomChosen}
          community={this.props.community}
          city={this.props.city}
        />
        {
          //mounted &&
          readyForMap ? (
            /*<canvas style={{ display: "none" }} ref={this.communityLogo} />*/
            <MapGL
              pitchEnabled
              touchRotate
              dragRotate
              ref={this.mapRef}
              minZoom={7}
              onLoad={() => {
                if (this.mapRef && this.mapRef.current) {
                  const mapbox = this.mapRef.current.getMap();
                  //map.setTerrain({source: 'mapbox-dem', exaggeration: 1.5});
                  this.props.setFoundation({
                    mapbox
                  });
                }
              }}
              onError={(err) => window.alert(Object.values(err))}
              onViewportChange={(viewport) =>
                this.setState(
                  {
                    viewport
                  },
                  () => {
                    if (mapbox) {
                      const bnds = mapbox.getBounds();
                      if (bnds) {
                        const bounds = {
                          north: bnds._ne.lat,
                          south: bnds._sw.lat,
                          west: bnds._sw.lng,
                          east: bnds._ne.lng
                        };
                        this.setState({
                          bounds: [
                            bounds.north,
                            bounds.south,
                            bounds.east,
                            bounds.west
                          ]
                        });
                      }
                    }
                  }
                )
              }
              mapStyle={mapStyle}
              /*mapStyle={{
                version: 8,
                sources: {type:"vector",source-layer:mapStyle},
                layers: [id:"mapURL"]
              }}*/
              mapboxApiAccessToken="pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ"
              {...viewport}
              transition={{
                duration: 300,
                delay: 0
              }}
            >
              {/*<Source key="base" id="base" type="vector" />
              <Layer
                {...{
                  id: "base",
                  type: "background",
                  //[fill, line, symbol, circle, heatmap,
                  //fill-extrusion, raster, hillshade, background]
                  source: "base",
                  "source-layer": mapStyle
                }}
              />*/}
              {/**map.addSource('maine', {'type': 'geojson'...*/}
              <Source
                id="floor"
                type="geojson"
                data={{
                  type: "FeatureCollection",
                  features: [
                    {
                      type: "Feature",
                      //match get distance
                      properties: {
                        distance: this.props.distance
                      },
                      //layer lnglat
                      geometry: {
                        type: "Point",
                        coordinates: this.props.center
                      }
                    }
                  ]
                }}
              />
              <Layer
                {...{
                  id: "floor",
                  type: "circle",
                  source: "floor",
                  //"source-layer": "landuse", //for vector
                  //filter: ["==", "class", "park"], //??
                  paint: {
                    // make circles larger as the user zooms from 12 to 22
                    "circle-radius": {
                      stops: [
                        [7, 0], //[zoom,width]
                        [22, pixelFloorSize * 10000]
                      ],
                      base: 2
                    },
                    "circle-stroke-color": "rgb(200,200,230)",
                    "circle-stroke-width": 2,
                    "circle-color": circleColorOpts
                  }
                }}
              />
              {/*<
              <Source
                id="pop"
                type="vector"
                data={{
                  type: "vector",
                  url: "mapbox://examples.populated-places-label-rank"
                }}
                tileSize={512}
              />
              <Layer
                {...{
                  id: "pop",
                  type: "circle",
                  source: "floor",
                  //"source-layer": "landuse", //for vector
                  //filter: ["==", "class", "park"], //??
                  paint: {
                    // make circles larger as the user zooms from 12 to 22
                    "circle-radius": {
                      stops: [
                        [7, 0], //[zoom,width]
                        [22, pixelFloorSize * 10000]
                      ],
                      base: 2
                    },
                    "circle-stroke-color": "rgb(200,200,230)",
                    "circle-stroke-width": 2,
                    "circle-color": circleColorOpts
                  }
                }}
              />*/}
              {mapbox && (
                <MappCluster
                  ref={this._cluster}
                  mapbox={mapbox}
                  element={(cluster) => (
                    <MappGroup
                      openCluster={this.openCluster}
                      mapThis={mapit}
                      onClick={this.onClick}
                      {...cluster}
                    />
                  )}
                >
                  {deviceLocation &&
                    !["orange", "red"].includes(deviceLocation) && (
                      <Sprites
                        id={"player"}
                        key={"player"}
                        src={"spritesheet"}
                        states={4}
                        tile={{ width: 20, height: 24 }}
                        scale={1.5}
                        framesPerStep={8}
                        event={{}}
                        longitude={deviceLocation.center[0]}
                        latitude={deviceLocation.center[1]}
                      />
                    )}
                  {(suggestionsOnMap
                    ? suggestionsOnMap
                    : /*this.props.communities && this.props.communities*/ []
                  ).map((x) => {
                    if (x && x.place_name && x.center) {
                      if (x.id) {
                        if (!communityIds.includes(x.id)) {
                          communityIds.push(x.id);
                          return (
                            <MarkerCommunity
                              auth={auth}
                              opacity={community && community.id === x.id}
                              chooseCommunity={this.props.chooseCommunity}
                              communities={this.props.communities}
                              chooseEdmevent={this.props.chooseEdmevent}
                              cityapi={this.props.cityapi}
                              chooseEvent={this.props.chooseEvent}
                              community={community}
                              commtype={commtype}
                              tileChosen={tileChosen}
                              //center={this.state.center}
                              id={x.id}
                              key={x.id}
                              //ref={this["myRef" + x.id]}
                              longitude={Number(x.center[0])}
                              latitude={Number(x.center[1])}
                              event={x}
                              show={this.state.showInfoWindow}
                              className="markerzero"
                              coordinates={x.center}
                              anchor="bottom"
                              etype={
                                tileChosen === "event"
                                  ? this.props.etype
                                  : tileChosen === "restaurant"
                                  ? this.props.rtype
                                  : tileChosen === "job"
                                  ? this.props.jtype
                                  : tileChosen === "shop"
                                  ? this.props.stype
                                  : tileChosen === "service"
                                  ? this.props.servtype
                                  : tileChosen === "housing"
                                  ? this.props.htype
                                  : tileChosen === "page"
                                  ? this.props.ptype
                                  : tileChosen === "venue"
                                  ? this.props.vtype
                                  : this.props.etype
                              }
                            />
                          );
                        } else return null;
                      } else {
                        return (
                          <MarkerCity
                            id={x.place_name}
                            key={x.place_name}
                            bounds={this.state.bounds}
                            offscreens={this.state.offscreens}
                            addOffscreen={(ev) => {
                              if (!this.state.flyOver) {
                                const foo = this.state.offscreens.find(
                                  (p) => ev.place_name === p.place_name
                                );
                                if (!foo) {
                                  this.setState({
                                    offscreens: [...this.state.offscreens, ev]
                                  });
                                } else {
                                  this.setState({
                                    offscreens: [
                                      ...this.state.offscreens.filter(
                                        (p) => ev.place_name !== p.place_name
                                      ),
                                      ev
                                    ]
                                  });
                                }
                              }
                            }}
                            removeOffscreen={(ev) =>
                              this.setState({
                                offscreens: this.state.offscreens.filter(
                                  (x) => x.place_name !== ev.place_name
                                )
                              })
                            }
                            clickCityGifmap={this.props.clickCityGifmap}
                            switchCMapCloser={this.props.switchCMapCloser}
                            auth={auth}
                            opacity={
                              this.state.hoveredCityOnMap === x.place_name
                            }
                            chooseCommunity={this.props.chooseCommunity}
                            communities={this.props.communities}
                            chooseEdmevent={this.props.chooseEdmevent}
                            cityapi={this.props.cityapi}
                            chooseEvent={this.props.chooseEvent}
                            community={community}
                            commtype={commtype}
                            tileChosen={tileChosen}
                            //center={this.state.center}
                            //ref={this["myRef" + x.id]}
                            longitude={Number(x.center[1])}
                            latitude={Number(x.center[0])}
                            event={x}
                            show={this.state.showInfoWindow}
                            className="markerzero"
                            coordinates={x.center}
                            anchor="bottom"
                            etype={
                              tileChosen === "event"
                                ? this.props.etype
                                : tileChosen === "restaurant"
                                ? this.props.rtype
                                : tileChosen === "job"
                                ? this.props.jtype
                                : tileChosen === "shop"
                                ? this.props.stype
                                : tileChosen === "service"
                                ? this.props.servtype
                                : tileChosen === "housing"
                                ? this.props.htype
                                : tileChosen === "page"
                                ? this.props.ptype
                                : tileChosen === "venue"
                                ? this.props.vtype
                                : this.props.etype
                            }
                          />
                        );
                      }
                    } else return null;
                  })}
                  {mapit &&
                    mapit.map((x) => {
                      var id = x._id ? x._id : x.id;
                      if (canIView(auth, x, community)) {
                        //console.log("this date" + new Date(x.date._seconds * 1000));
                        var f = ["classes", "department"].includes(commtype)
                          ? commtype
                          : tileChosen === "club"
                          ? "ctype"
                          : tileChosen === "event"
                          ? "etype"
                          : tileChosen === "restaurant"
                          ? "rtype"
                          : tileChosen === "job"
                          ? "jtype"
                          : tileChosen === "shop"
                          ? "stype"
                          : tileChosen === "service"
                          ? "servtype"
                          : tileChosen === "housing"
                          ? "htype"
                          : tileChosen === "page"
                          ? "ptype"
                          : tileChosen === "venue"
                          ? "vtype"
                          : "etype";
                        if (
                          ["classes", "department"].includes(commtype) ||
                          (x && x[f].includes(this.props[f]))
                        ) {
                          if (
                            (x.message &&
                              x.message.startsWith(this.props.searching)) ||
                            (x.name &&
                              x.name.startsWith(this.props.searching)) ||
                            x.artistList.find((x) =>
                              x.name.startsWith(this.props.searching)
                            )
                          ) {
                            //console.log(x);
                            let center = x.center;
                            if (x.id.length < 10) {
                              let names = [];
                              x.artistList.map((e) => {
                                return names.push(e.name.toUpperCase());
                              });
                            }
                            if (x.center || (x.venue && x.venue.longitude)) {
                              return (
                                <Marker
                                  communities={this.props.communities}
                                  chooseEdmevent={this.props.chooseEdmevent}
                                  mapThis={mapThis}
                                  openalladdresses={() => this.openCluster(x)}
                                  community={community}
                                  commtype={commtype}
                                  tileChosen={tileChosen}
                                  //center={this.state.center}
                                  id={id}
                                  key={id}
                                  //ref={this["myRef" + x.id]}
                                  longitude={
                                    x.venue
                                      ? x.venue.longitude
                                      : Number(center[0])
                                  }
                                  latitude={
                                    x.venue
                                      ? x.venue.latitude
                                      : Number(center[1])
                                  }
                                  event={x}
                                  cityapi={this.props.cityapi}
                                  chooseEvent={this.props.chooseEvent}
                                  show={this.state.showInfoWindow}
                                  className="markerzero"
                                  coordinates={
                                    x.venue
                                      ? [x.venue.longitude, x.venue.latitude]
                                      : center
                                  }
                                  anchor="bottom"
                                  etype={
                                    tileChosen === "event"
                                      ? this.props.etype
                                      : tileChosen === "restaurant"
                                      ? this.props.rtype
                                      : tileChosen === "job"
                                      ? this.props.jtype
                                      : tileChosen === "shop"
                                      ? this.props.stype
                                      : tileChosen === "service"
                                      ? this.props.servtype
                                      : tileChosen === "housing"
                                      ? this.props.htype
                                      : tileChosen === "page"
                                      ? this.props.ptype
                                      : tileChosen === "venue"
                                      ? this.props.vtype
                                      : this.props.etype
                                  }
                                />
                              );
                            } else return null;
                          } else return null;
                        } else return null;
                      } else return null;
                    })}
                </MappCluster>
              )}
            </MapGL>
          ) : (
            <div
              style={{
                backgroundColor: "rgb(20,120,60)",
                display: "flex",
                height: "100%",
                width: "100%",
                overflow: "hidden"
              }}
            >
              <img
                style={{
                  display: "flex",
                  height: "100%",
                  width: "auto"
                }}
                alt="error"
                src="https://www.dl.dropboxusercontent.com/s/bt07kz13tvjgz8x/Screen%20Shot%202020-07-18%20at%208.52.33%20AM.png?dl=0"
              />
            </div>
          )
        }
        <div
          style={{
            opacity: weatherOpen ? 1 : 0,
            zIndex: weatherOpen ? 1 : -9999,
            width: weatherOpen ? "min-content" : "0px",
            maxHeight: weatherOpen ? "100px" : "0px",
            display: "flex",
            position: "fixed",
            top: "106px",
            left: "71px",
            height: "100px",
            overflowX: "auto",
            overflowY: "hidden",
            transition: ".3s ease-in"
          }}
        >
          <div
            style={{
              display: "flex",
              position: "fixed",
              top: "106px",
              left: "71px",
              width: "calc(100% - 151px)",
              height: "100px",
              overflowX: "auto",
              overflowY: "hidden"
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                height: "50px",
                width: "min-content"
              }}
            >
              {this.state.periods.map((note) => {
                var eventDate1 = new Date(note.endTime);
                return (
                  [0, 4, 8, 12, 16, 20].includes(eventDate1.getHours()) && (
                    <div key={eventDate1}>
                      <img
                        style={{ width: "auto", height: "100%" }}
                        src={note.icon}
                        alt="err"
                      />
                      <div
                        style={{
                          backgroundColor: "rgb(220,220,220)",
                          borderRadius: "5px",
                          fontSize: "12px"
                        }}
                      >
                        {eventDate1.getHours() === 0
                          ? eventDate1.toLocaleDateString()
                          : eventDate1.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
          {this.state.chosenVector === "snowfall" ? (
            <div
              onClick={() =>
                this.setState({ hideSnowfall: !this.state.hideSnowfall })
              }
              style={{
                display: "flex",
                position: "fixed",
                top: "176px",
                left: "71px",
                width: "calc(100% - 151px)",
                height: "30px",
                backgroundColor: "rgba(250,250,250,.8)",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.state.hideSnowfall ? "Open" : "Close"}
            </div>
          ) : null}
        </div>

        <div
          //group-cluster; opened
          style={{
            zIndex: "6",
            display: this.state.tellMeAll !== "" ? "flex" : "none",
            position: "fixed",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            bottom: "0px",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
            overflowX: "hidden"
          }}
        >
          {inLot && inLot[0] && inLot[0].venue && inLot[0].venue.name}
          <br />
          {inLot && inLot[0] && inLot[0].venue && inLot[0].venue.address}
          <div
            onClick={() => {
              this.props.closeSurrounds();
              this.setState({ tellMeAll: "" });
            }}
            style={{
              display: "flex",
              position: "fixed",
              right: "10px",
              bottom: "10px",
              fontSize: "40px"
            }}
          >
            &times;
          </div>
          {inLot.map((x) => {
            var eventDate = new Date(
              x.date
                ? x.date.seconds
                  ? x.date.seconds * 1000
                  : x.date
                : this.state.new
            ).getTime();
            var chopped = (eventDate - this.state.now) / 86400000;

            var diffDays = chopped.toString().substr(0, 3);
            var cityCommunity = x.community ? x.community.message : x.city;
            const entityURI =
              tileChosen === "club"
                ? "/clubs/"
                : tileChosen === "restaurant"
                ? "/restaurants/"
                : tileChosen === "shop"
                ? "/shops/"
                : tileChosen === "service"
                ? "/services/"
                : tileChosen === "page"
                ? "/pages/"
                : tileChosen === "venue"
                ? "/venues/"
                : tileChosen === "class"
                ? x.endDate < new Date()
                  ? {
                      pathname:
                        "/classes/" +
                        cityCommunity +
                        "/" +
                        x.message +
                        "/" +
                        `${new Date(x.endDate.seconds * 1000).getFullYear()}-${
                          new Date(x.endDate.seconds * 1000).getMonth() + 1
                        }-${new Date(x.endDate.seconds * 1000).getDate()}`
                    }
                  : "/classes/"
                : tileChosen === "department"
                ? "/departments/"
                : tileChosen === "housing"
                ? "/housing/" + x.id
                : tileChosen === "job"
                ? "/job/" + x.id
                : x.id && x.id.length > 10
                ? "/event/" + x.id
                : "/events/edmtrain/" + x.id;

            return (
              <Link
                key={x.id}
                to={
                  entityURI.includes("edmtrain")
                    ? entityURI
                    : entityURI + cityCommunity + "/" + x.message
                }
                style={{
                  maxWidth: "calc(100% - 60px)",
                  width: "max-content",
                  right: "0px",
                  display: "flex",
                  border: "1px solid black",
                  color: "black",
                  fontSize: "20px",
                  textDecoration: "none"
                }}
                onClick={() => this.props.chooseEdmevent(x)}
              >
                <span
                  style={{
                    wordBreak: "break-all"
                  }}
                >
                  {x.name
                    ? x.name
                    : x.artistList
                    ? x.artistList.map((x) => x.name)
                    : x.message}
                  {eventDate && (
                    <div
                      style={{
                        display: "flex",
                        color: "grey",
                        fontSize: "16px",
                        margin: "5px"
                      }}
                    >
                      {new Date(eventDate).toLocaleDateString()}
                    </div>
                  )}
                </span>
                &nbsp;-
                <div
                  style={{
                    color: "grey",
                    fontSize: "16px",
                    margin: "5px"
                  }}
                >
                  {eventDate && (
                    <div
                      style={{
                        color: "grey",
                        fontSize: "16px",
                        margin: "5px"
                      }}
                    >
                      {
                        ["sun", "mon", "tue", "wen", "thu", "fri", "sat"][
                          new Date(eventDate).getDay()
                        ]
                      }
                    </div>
                  )}{" "}
                  <div
                    style={{
                      margin: "3px",
                      fontSize: "12px",
                      width: "12px",
                      height: "12px",
                      border: "1px solid",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {diffDays.includes(".") ? diffDays.split(".")[0] : diffDays}
                  </div>
                  days
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}
Mapbox.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
};
export default Mapbox;
