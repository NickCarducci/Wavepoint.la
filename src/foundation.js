import React from "react";
import firebase from "./init-firebase";
//import AddToCalendar from "react-add-to-calendar";
import Routes from "./Routes";
import Links from "./links";
import Mapbox from "./Mapbox";
import TilesMap from "./TilesMap";
import EventTypesMap from "./EventTypesMap";
import Menu from "./components/Icons/Menu";
import Made from "./components/Entities/Made";
import Create from "./components/Entities/Create";
import DateSlidster from "./components/Entities/Create/DateSlidster";
import SwitchCity from "./components/SwitchCity";
import CommunityAdmin from "./components/SwitchCity/Community/People/CommunityAdmin";
import Profile from "./components/Profile";
import SignupConfirm from "./widgets/SignupConfirm";
import { canIView, SDB } from "./widgets/authdb";
import { stateCity, suggestions } from "./widgets/arraystrings";
import { Link, withRouter } from "react-router-dom";
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import CSVLayer from "@arcgis/core/layers/CSVLayer";
import SceneView from "@arcgis/core/views/SceneView";
import TileLayer from "@arcgis/core/layers/TileLayer";
import Basemap from "@arcgis/core/Basemap";
import "./components/SwitchCity/Cities.css";
import "./styles.css";

class Foundation extends React.Component {
  constructor(props) {
    super(props);
    let sdb = new SDB();
    this.state = {
      center: props.item.center,
      switchHeight: 0,
      servtype: "hair, nails & tan",
      ptype: "pod",
      vtype: "in theatre",
      htype: "stay",
      rtype: "chinese",
      stype: "clothing",
      etype: "party & clubbing",
      ctype: "sport",
      jtype: "tech",
      ftype: "new",
      recipientsProfiled: [],
      threadId: "",
      officialRole: "",
      officialLevel: "",
      errorVoter: "",
      chosenTopic: "*",
      started: false,
      globalForumPosts: [],
      recipients: [],
      foundEntity: {},
      rangeChosen: "one hour",
      filesPreparedToSend: [],
      inviteChosen: "",
      hiddenMsgs: [],
      deletedMsgs: [],
      closeAllStuff: true,
      user: "",
      sdb,
      loading: false,
      createSliderOpen: false,
      switchCommunitiesOpen: false,
      switchCityOpen: false,
      menuOpen: false,
      billSelected: "",
      bills: [],
      cards: ["First", "Second", "Third"],
      goSignupConfirmedPlay: false,
      watchingSignupVideo: false,
      justOpened: false,
      loginOpen: false,
      entityNames: [],
      distance: 15,
      y: 15,
      zoomChosen: 8,
      radioChosen: 8,
      scrollChosen: 8,
      chosenEdmevent: undefined,
      chatsopen: false,
      eventChosen: "",
      ok: true,
      searchEvents: "",
      targetid: "all",
      profileOpen: false,
      achatopen: false,
      typesOrTiles: null,
      deletedEvts: [],
      deletedClbs: [],
      deletedJobs: [],
      unreadChats: [],
      unreadChatsCount: 0,
      monthCalOpen: "month",
      entityType: "users",
      entityId: null,
      tilesMapOpen: null
      //zoomChangedRecently:false
    };

    this.pinch = React.createRef();
    this.globe = React.createRef();
  }
  openStart = (boo) =>
    boo && boo.constructor === String
      ? this.setState({ started: boo })
      : this.setState({ started: !false });
  openChatWithGroup = (x) => {
    if (!this.props.oktoshowchats) {
      var answer = window.confirm(
        "Are you on a private computer? Firebase chat uses cache to lessen the (down)load. Enter the chat or continue anyway?"
      );
      if (answer) {
        this.props.showChatsOnce();
      }
    } else
      this.setState(
        {
          threadId: x.threadId,
          achatopen: true,
          chatsopen: true,
          achatisopen: true,
          started: false,
          thisentity: x,
          entityTitle: x.entityTitle,
          entityType: x.entityType,
          entityId: x.entityId,
          recipients: x.recipients.sort(),
          chosenTopic: "*"
          //closeAllStuff: true
        },
        () => this.props.history.push("/")
      );
  };

  /*const satelliteLayer = new TileLayer({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    title: "satellite"
  })
  
  const fireflyLayer = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/HalfEarthFirefly/MapServer",
    title: "half-earth-firefly"
  })
  
  const basemap = new Basemap({
    baseLayers: [satelliteLayer, fireflyLayer],
    title: "half-earth-basemap",
    id: "half-earth-basemap"
  });

  const rangelands = new TileLayer({
    url: 'https://tiles.arcgis.com/tiles/IkktFdUAcY3WrH25/arcgis/rest/services/gHM_Rangeland_inverted/MapServer'
  })

  const protected = new FeatureLayer({
    url: 'https://services5.arcgis.com/Mj0hjvkNtV7NRhA7/arcgis/rest/services/WDPA_v0/FeatureServer/1'
  })
  
  const map = new Map({
    basemap: basemap,
    layers: [protected, rangelands]
  });

  const view = new SceneView({
    map: map,
    container: "sceneContainer",
    environment: {
      atmosphereEnabled: false,
      background: {
        type: "color",
        color: [0,10,16]
      }
    },
    ui: {
      components: ["zoom"]
     }
  });
  const layerList = new LayerList({
    view: view
  });
  
  view.ui.add(layerList, {
    position: "top-right"
  });

  const uploadForm = document.getElementById("uploadForm");*/
  /*oldMapArcgis = () =>
    window.addEventListener("change", (event) => {
      const filePath = event.target.value.toLowerCase();
      //only accept .zip files
      if (filePath.indexOf(".zip") !== -1) {
        const generateFeatureCollection = (uploadFormNode) => {
          const generateRequestParams = {
            filetype: "shapefile",
            publishParameters: JSON.stringify({
              targetSR: view.spatialReference
            }),
            f: "json"
          };
//moved to newMapArcgis()
        };
        generateFeatureCollection(uploadForm);
      }
    });*/

  newMapArcgis = () => {
    return null;
    !this.state.pauseWith &&
      this.setState({ pauseWith: true }, () => {
        // If CSV files are not on the same domain as your website, a CORS enabled server
        // or a proxy is required.
        esriConfig.apiKey =
          "AAPK3658d1cb903b414499d2fbb096841788yW7QKaB5BZMj2Mliutw7WmkZGOkNTBxnESfpkTNaZi-T28ZomfD5VFzVy9A_uRRB";
        const url =
          "https://developers.arcgis.com/javascript/latest/sample-code/layers-csv/live/earthquakes.csv";

        // Paste the url into a browser's address bar to download and view the attributes
        // in the CSV file. These attributes include:
        // * mag - magnitude
        // * type - earthquake or other event such as nuclear test
        // * place - location of the event
        // * time - the time of the event

        const template = {
          title: "Earthquake Info",
          content: "Magnitude {mag} {type} hit {place} on {time}."
        };

        const csvLayer = new CSVLayer({
          url: url,
          copyright: "USGS Earthquakes",
          popupTemplate: template
        });

        csvLayer.renderer = {
          type: "simple", // autocasts as new SimpleRenderer()
          symbol: {
            type: "point-3d", // autocasts as new PointSymbol3D()
            // for this symbol we use 2 symbol layers, one for the outer circle
            // and one for the inner circle
            symbolLayers: [
              {
                type: "icon", // autocasts as new IconSymbol3DLayer()
                resource: { primitive: "circle" },
                material: { color: [255, 84, 54, 0.6] },
                size: 5
              },
              {
                type: "icon", // autocasts as new IconSymbol3DLayer()
                resource: { primitive: "circle" },
                material: { color: [255, 84, 54, 0] },
                outline: { color: [255, 84, 54, 0.6], size: 1 },
                size: 10
              }
            ]
          }
        };

        const map = new Map({
          basemap: new Basemap({
            baseLayers: [
              new TileLayer({
                url:
                  "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/VintageShadedRelief/MapServer"
              })
            ]
          }),
          layers: [csvLayer]
        });

        const view = new SceneView({
          container: this.globe.current,
          map: map,
          // Indicates to create a global scene
          viewingMode: "global",
          camera: {
            position: [-63.77153412, 20.75790715, 25512548.0],
            heading: 0.0,
            tilt: 0.1
          },

          constraints: {
            altitude: {
              min: 700000
            }
          },
          qualityProfile: "high",
          alphaCompositingEnabled: true,
          highlightOptions: {
            fillOpacity: 0,
            color: "#ffffff"
          },
          environment: {
            background: {
              type: "color",
              color: [0, 0, 0, 0]
            },
            atmosphere: null,
            starsEnabled: false
          }
        });
      });

    /*fetch("https://www.arcgis.com/sharing/rest/content/features/generate", {
      query: {
        filetype: "shapefile",
        publishParameters: JSON.stringify({
          targetSR: view.spatialReference
        }),
        f: "json"
      },
      body: uploadFormNode,
      responseType: "json"
    }).then((response) => {
      const featureCollection = response.data.featureCollection

      let sourceGraphics = [];
      const collectionLayers = featureCollection.layers;
      const mapLayers = collectionLayers.map(function (layer) {
        function createFeaturesGraphics(layer) {
          console.log(layer);
          return layer.featureSet.features.map(function (feature) {
            return Graphic.fromJSON(feature);
          });
        }
        const graphics = createFeaturesGraphics(layer);
        sourceGraphics = sourceGraphics.concat(graphics);
        function createFeatureLayerFromGraphic(graphics) {
          return new FeatureLayer({
            objectIdField: "FID",
            source: graphics,
            title: "User uploaded shapefile"
          });
        }

        const featureLayer = createFeatureLayerFromGraphic(graphics);
        return featureLayer;
      });
      map.addMany(mapLayers);
      view.goTo({ target: sourceGraphics, tilt: 40 });
      console.log(response);
    });*/
  };

  queryMount = (pathname) => {
    var date = pathname.split("/new/")[1];
    var hours = 0;
    var minutes = 0;
    if (date) {
      hours = date.split("/")[1];
      if (hours) {
        date = date.split("/")[0];
        minutes = hours.split(":")[1];
        if (minutes) {
          hours = hours.split(":")[0];
          this.setState({
            materialDate: new Date(
              new Date(date.replace(/-/g, "/")).setHours(hours, minutes, 0, 0)
            )
          });
        } else {
          this.setState({
            materialDate: new Date(
              new Date(date.replace(/-/g, "/")).setHours(hours, 0, 0, 0)
            )
          });
        }
      } else {
        this.setState({
          materialDate: new Date(
            new Date(date.replace(/-/g, "/")).setHours(12, 0, 0, 0)
          )
        });
      }
    }
  };
  getOfficials = () => {
    const lastOfficialLevel = this.state.officialLevel;
    const lastOfficialRole = this.state.officialRole;
    this.setState(
      {
        lastOfficialLevel,
        lastOfficialRole
      },
      async () => {
        var level =
          lastOfficialLevel !== "" ? `&levels=${lastOfficialLevel}` : "";
        var role = lastOfficialRole !== "" ? `&roles=${lastOfficialRole}` : "";
        var url1 =
          `https://www.googleapis.com/civicinfo/v2/representatives?key=` +
          `AIzaSyAs9BpsQZFolkkBn4ShDTzb1znu_7JM894` +
          `&address=` +
          this.state.address +
          level +
          role;
        await fetch(url1)
          .then(async (response) => await response.json())
          .then((result) => {
            this.setState({ officialResults: result });
          })
          .catch((err) =>
            this.setState({ errorVoter: err.message }, () =>
              console.log(err.message)
            )
          );
      }
    );
  };
  fetchCity = (location, distance, city, targetid) => {
    this.setState({
      closeAllStuff: true
    });
    this.clearForum(targetid, false); //(tileChosen,started)

    var touch = new Date(this.props.queriedDate);
    touch.setHours(0, 0, 0, 0);
    const neww = new Date(touch).getTime();
    this.props.fetchEvents(location, distance, city, targetid);
    const cityy = city.split(", ")[0];
    const cityapi = cityy.replace(/, /g, "_").replace(/ /g, "_");
    const state = city.split(", ")[1].split(", ")[0];
    const stateapi = state.replace(/ /, "_");
    if (
      this.props.cityapisLoaded &&
      this.props.cityapisLoaded.includes(
        cityapi + stateapi + neww + this.props.range
      )
    ) {
      return this.props.timeFilterEvents(
        this.props.events,
        this.props.edmStore[cityapi + stateapi + neww + this.props.range]
      );
    } else {
      this.getEdmTrainpoint(cityapi, stateapi);
      this.props.setData({
        cityapisLoaded: [
          ...this.props.cityapisLoaded,
          cityapi + stateapi + neww + this.props.range
        ]
      });
    }
  };
  /*tileChanger = (targetid) => {
    console.log("tileChanger " + targetid);
    if (targetid) {
      if (
        targetid === "new" ||
        targetid === "active" ||
        targetid === "saved" ||
        (this.props.community &&
          (targetid === "forms & permits" ||
            targetid === "ordinance" ||
            targetid === "budget" ||
            targetid === "election" ||
            targetid === "cases" ||
            targetid === "classes" ||
            targetid === "departments"))
      ) {
        this.props.setIndex({ commtype: targetid, forumOpen: true });
      } else {
        this.props.setIndex({
          tileChosen: targetid
        });
      }
      if (this.props.community) {
        this.setState(
          {
            switchCityOpen: false,
            started: true
          },
          () => this.chooseCommunity(this.props.community)
        );
      } else {
        this.chooseCitypoint(...this.state.previousCityQuery);
      }
    }
  };*/
  tileChanger = (tileOrType, changeCollection) => {
    const map = (tileOrType, community, center, distance, city) => {
      if (community) {
        this.props.fetchCommEvents(community, tileOrType);
      } else this.props.fetchEvents(center, distance, city, tileOrType);
    };
    const forum = (tileOrType, community, center, distance, city) => {
      if (community) {
        this.props.fetchCommForum(community, tileOrType);
      } else this.props.fetchForum(center, distance, city, tileOrType);
    };
    const { tileChosen, city, community, forumOpen, openWhen } = this.props;
    const { center, distance, subForum } = this.state;
    const type =
      tileChosen === "event"
        ? "etype"
        : tileChosen === "club"
        ? "ctype"
        : tileChosen === "shop"
        ? "stype"
        : tileChosen === "restaurant"
        ? "rtype"
        : tileChosen === "service"
        ? "servtype"
        : tileChosen === "job"
        ? "jtype"
        : tileChosen === "housing"
        ? "htype"
        : tileChosen === "page"
        ? "ptype"
        : tileChosen === "venue"
        ? "vtype"
        : null;
    //forum billboard-types are in firestore collection (election, issue,
    //class,departments)
    //or hard-coded (ordinance, court-case, budget)
    if (!type && tileChosen) this.props.setIndex({ commtype: tileOrType });
    if (forumOpen && !subForum) {
      console.log("forumTypeChange " + tileOrType);
      if (openWhen === "expired") this.props.setFolder({ openWhen: "new" });
      changeCollection &&
        forum(tileOrType, community, center, distance, city, openWhen);
    } else {
      console.log("setMappedType " + tileOrType);
      this.setState({
        [type]: tileOrType
      });
      changeCollection && map(tileOrType, community, center, distance, city);
    }
    if (changeCollection) {
      console.log("setTile " + tileOrType);
      this.props.setIndex({ tileChosen: tileOrType });
    }
  };
  eventTypes = (x) => {
    const { tilesMapOpen } = this.state;
    if (tilesMapOpen) {
      this.setState({
        tilesMapOpen: null,
        started: !this.props.forumOpen,
        switchCityOpen: false
      });
    } else {
      if (x === "settings") {
        this.props.setIndex({ commtype: "new", forumOpen: true });
        this.setState({ editingCommunity: true });
      }
      this.setState({
        started: x !== "tiles" ? false : !this.props.forumOpen,
        tilesMapOpen: x === "tiles" ? true : "types"
      });
    }
  };
  chooseEdmevent = (eventEdm) => {
    console.log(eventEdm);
    this.setState({ chosenEdmevent: eventEdm });
    this.switchCMapCloser();
  };
  changeCity = (center) => {
    this.setState({ center });
  };
  choosePlan = (event) => {
    this.setState({ materialDate: event });
  };
  chooseEvent = (event) => {
    this.setState({ eventChosen: event, materialDate: event.date });
  };
  chooseClub = (club) => {
    this.setState({ clubChosen: club, materialDate: club.date });
  };
  chooseJob = (job) => {
    this.setState({ jobChosen: job, materialDate: job.date });
  };
  captureWeather = async (center, cityapi) => {
    await fetch(
      `https://us-central1-thumbprint-1c31n.cloudfunctions.net/captureWeather`,
      {
        method: "POST",
        headers: {
          "Content-Type": "Application/JSON",
          "Access-Control-Request-Method": "POST"
        },
        body: JSON.stringify({ center })
      }
    )
      .then(async (response) => await response.json())
      .then((body) => {
        this.setState({ [cityapi + "weather"]: body, weather: body });
      })
      .catch((err) => console.log(err.message));
  };
  calculateZoom = (WidthPixel, Ratio, Lat, Length, city) => {
    Length = Length * 1000;
    var k = WidthPixel * 156543.03392 * Math.cos((Lat * Math.PI) / 180);
    var myZoom = Math.round(Math.log((Ratio * k) / (Length * 100)) / Math.LN2);
    myZoom = myZoom - 1;
    if (this.state.scrollChosen !== myZoom || city !== this.props.city) {
      this.setState({ scrollChosen: myZoom });
    }
    return myZoom;
  };
  getAgainTrain = async (id, cityapi, stateapi) => {
    const time = this.props.queriedDate;

    const THIS_YEAR = new Date().getFullYear();
    const THIS_MONTH = new Date().getMonth() + 1;
    const getMonthDays = (month = THIS_MONTH, year = THIS_YEAR) => {
      const months30 = [4, 6, 9, 11];
      const leapYear = year % 4 === 0;

      return month === 2
        ? leapYear
          ? 29
          : 28
        : months30.includes(month)
        ? 30
        : 31;
    };
    const OKDATE = new Date(time);
    const day = OKDATE.getDate();
    const month = OKDATE.getMonth() + 1;
    const year = OKDATE.getFullYear();
    const monthdays = getMonthDays(month, year);
    var rangeInDays = Math.round(this.props.range / 86400000);
    const nextWeek =
      day + rangeInDays > monthdays
        ? rangeInDays - (monthdays - day)
        : day + rangeInDays;
    const nextMonth = month < 12 ? month + 1 : 1;
    const nextyear =
      day + rangeInDays > monthdays && nextMonth === 1
        ? new Date(OKDATE.setFullYear(OKDATE.getFullYear() + 1)).getFullYear()
        : OKDATE.getFullYear();
    //const nextmonthdays = getMonthDays(nextmonth, nextyear)

    const paddedday = day < 10 ? "0" + day : day;
    const paddedNextWeek = nextWeek < 10 ? "0" + nextWeek : nextWeek;
    const paddedMonth = month < 10 ? "0" + month : month;
    const paddedNextMonth = nextMonth < 10 ? "0" + nextMonth : nextMonth;
    const endmonth =
      day + rangeInDays > monthdays ? paddedNextMonth : paddedMonth;
    //return res.send(id, year, nextMonth, today)
    const startDate = `${year}-${paddedMonth}-${paddedday}`;
    const quotesStart = JSON.stringify(startDate);
    const stringStart = quotesStart.replace(/['"]+/g, "");
    const goodDate = `${nextyear}-${endmonth}-${paddedNextWeek}`;
    const quotesDate = JSON.stringify(goodDate);
    const stringDate = quotesDate.replace(/['"]+/g, "");
    const url =
      "https://edmtrain.com/api/events?locationIds=" +
      id +
      "&startDate=" +
      stringStart +
      "&endDate=" +
      stringDate +
      "&client=a82999b7-c837-4ea7-bed7-b957cf526730";
    await fetch(url)
      .then(async (response) => await response.json())
      .then((body) => {
        var boh = body.data;
        let them = [];
        boh && boh.length === 0 && console.log("No edm train events");
        var thiss = new Date(this.props.queriedDate);
        thiss.setHours(12, 0, 0, 0);
        boh.map((data) => {
          data.message = data.name
            ? data.name
            : String(data.artistList.map((x) => x.name));
          data.etype = "party & clubbing";
          data.datel = new Date(
            new Date(data.date).setHours(0, 0, 0, 0) + 86400000
          );
          data.place_name = data.venue.address;
          if (data.datel.getTime() - thiss > 0) {
            return them.push(data);
          } else return null;
        });
        var touch = new Date(this.props.queriedDate);
        touch.setHours(0, 0, 0, 0);
        const neww = new Date(touch).getTime();
        this.props.setData({
          edmStore: { [cityapi + stateapi + neww + this.props.range]: them }
        });
        this.props.timeFilterEvents(this.props.events, them);
      })
      .catch((err) => console.log(err.message));
  };
  getEdmTrainpoint = async (cityapi, stateapi) => {
    //const statefull = states.getStateNameByStateCode(state);
    await fetch(
      `https://edmtrain.com/api/locations?state=${stateapi}&city=${cityapi}&client=a82999b7-c837-4ea7-bed7-b957cf526730`
    )
      .then(async (response) => await response.json())
      .then((body) => {
        if (body.data[0]) {
          const id = body.data[0].id;
          // if nearby city this.getEdmTrainpoint(cityapi, state) repeat loop back
          // otherwise, continue
          id && this.getAgainTrain(id, cityapi, stateapi);
        }
        //this.setState({ edmTrainevents: text })
      })
      .catch((err) => console.log(err.message));
  };
  handleVoterQuery = async (voterQuery) => {
    if (voterQuery !== this.state.lastVoterQuery) {
      /*var url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location[1]},${location[0]}` +
        `.json?limit=1&types=address&access_token=` +
        `pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`;
      console.log(url);
      await fetch(url)
        .then(async (response) => await response.json())
        .then((body) => {
          console.log(body);
          this.setState({
            address: body.features[0].place_name,
            lastVoterQuery: voterQuery
          });
        })
        .catch((err) => {
          console.log(err);
          console.log("please try another city name");
        });*/

      var addresss = voterQuery
        //.split(", United States")[0]
        .replace(/ /g, "_")
        .replace(/,/g, "")
        .toUpperCase();
      var find = stateCity.find(
        (x) => addresss.includes(x.name) || addresss.includes(x.abbreviation)
      );
      if (find) {
        var address = addresss.replace(find.name, find.abbreviation);

        var url =
          `https://www.googleapis.com/civicinfo/v2/voterinfo?key=` +
          `AIzaSyAs9BpsQZFolkkBn4ShDTzb1znu_7JM894` +
          `&address=` +
          address;

        clearTimeout(this.waitOfficials);
        this.waitOfficials = setTimeout(async () => {
          await fetch(url)
            .then(async (response) => await response.json())
            .then((result) => {
              if (result.message === "Election unknown")
                return window.alert("no elections, or you must register");
              var thisone = stateCity.find(
                (x) =>
                  x.abbreviation === result.pollingLocations[0].address.state
              );
              var center = [
                result.pollingLocations[0].latitude,
                result.pollingLocations[0].longitude
              ];
              var city = `${result.pollingLocations[0].address.city}, ${thisone.name}, United States`;
              if (center) {
                this.setState({
                  address,
                  voterResults: result,
                  lastVoterResults: result,
                  center
                });
                const cityapi = city.replace(/, /g, "_").replace(/ /g, "_");
                const distance = 15;
                const state = city.split(", ")[1].split(", ")[0];
                const stateapi = state.replace(/ /, "_");
                this.chooseCitypoint(center, distance, city, cityapi, stateapi);
                this.getOfficials();
              }
            })
            .catch((err) => {
              var errorVoter = JSON.stringify(err) + ": try to match format";
              window.alert(errorVoter);
              this.setState({ errorVoter });
            });
        }, 300);
      } else {
        this.setState({ errorVoter: "format error" });
        return window.alert(
          "seems to be something wrong with the format you entered." +
            "  Please try another format or use other site to find your polling place."
        );
      }
      this.setState({
        lastVoterQuery: voterQuery
      });
    } else {
      return this.setState({ voterResults: this.state.lastVoterResults });
    }
  };
  chooseCitypoint = async (
    center,
    distance,
    city,
    cityapi,
    stateapi,
    tile,
    noLoad
  ) => {
    console.log(center, distance, city, cityapi, stateapi, tile, noLoad);
    const cit = "/" + city.replace(/[ ]+/g, "_");
    if (cit !== this.props.pathname) {
      this.props.sustainPath(city, true);
    }
    /**
      var Lat = center[0];
      var Length = distance * 1.60934;
      var Ratio = 100;
      var WidthPixel = window.innerWidth;
      this.calculateZoom(WidthPixel, Ratio, Lat, Length, city);
     */
    this.setState(
      {
        previousCityQuery: [
          center,
          distance,
          city,
          cityapi,
          stateapi,
          tile,
          noLoad
        ],
        center
      },
      () => {
        const { tileChosen } = this.props;
        if (tileChosen === "departments" || tileChosen === "classes") {
          if (
            !["new", "lesson", "show", "game"].includes(this.props.commtype)
          ) {
            this.setState(
              {
                started: true
              },
              () =>
                this.props.setIndex({
                  forumOpen: false
                })
            );
          } else
            this.setState({
              started: false
            });
          this.props.setIndex({ tileChosen: "event" });
        } else
          this.setState({
            started: false
          });
        //(tileChosen,started,together)
        this.clearForum(null, this.props.started, []);
        console.log(tile);
        var t = tile ? tile : "new";

        this.props.fetchForum(city, t, noLoad);
        if (tile) {
          if (
            [
              "event",
              "club",
              "shop",
              "restaurant",
              "job",
              "housing",
              "venue",
              "page",
              "service"
            ].includes(tile)
          ) {
            this.fetchCity(center, distance, city, tile);
          } else {
            var targetid = tileChosen;
            this.props.fetchEvents(center, distance, city, targetid);
          }
        }
        firebase
          .firestore()
          .collection("cities")
          .doc(city)
          .onSnapshot(
            (doc) => {
              if (doc.exists) {
                var foo = doc.data();
                foo.id = doc.id;
                return this.props.setData({ issues: [...foo.issues] });
              }
            },
            (e) => console.log(e.message)
          );
        this.props.setData({
          cityapi,
          stateapi
        });

        const neww = new Date(
          new Date(this.props.queriedDate).setHours(0, 0, 0, 0)
        ).getTime();

        if (
          this.props.cityapisLoaded &&
          this.props.cityapisLoaded.includes(
            cityapi + stateapi + neww + this.props.range
          )
        ) {
          return this.props.timeFilterEvents(
            this.props.events,
            this.props.edmStore[cityapi + stateapi + neww + this.props.range]
          );
        } else {
          this.getEdmTrainpoint(cityapi, stateapi);
          this.props.setData({
            cityapisLoaded: [
              ...this.props.cityapisLoaded,
              cityapi + stateapi + neww + this.props.range
            ]
          });
        }
      }
    );
  };

  queryDate = () => {
    this.setState(
      {
        alltime: false
      },
      () => {
        var answer = window.confirm(
          `query ${
            this.props.community
              ? this.props.community.message
              : this.props.city
          } for events ${new Date(
            this.props.queriedDate
          ).toLocaleDateString()} - ${new Date(
            this.props.queriedDate + this.props.range
          ).toLocaleDateString()}?`
        );
        if (answer) {
          if (this.props.community) {
            this.chooseCommunity(this.props.community);
          } else {
            this.chooseCitypoint(...this.state.previousCityQuery);
          }
        }
      }
    );
  };
  start = () => {
    this.setState({
      started: true
    });
  };
  unStart = () => {
    this.setState({
      started: false
    });
  };
  createStripeVendor = async (authcode) => {
    await fetch(
      "https://us-central1-thumbprint-1c31n.cloudfunctions.net/createStripeVendor",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Method": "POST"
        },
        body: JSON.stringify({ code: authcode }),
        maxAge: 60
        //"mode": "cors",
      }
    )
      .then(async (response) => await response.text())
      .then((body) => {
        firebase
          .firestore()
          .collection("users")
          .doc(this.props.auth.uid)
          .update({ vendorId: body })
          .catch((err) => console.log(err.message));
        this.state.sdb.deleteKeys();
      })
      .catch((err) => {
        console.log(err.message);
        this.state.sdb.deleteKeys();
      });
  };
  async setKey(key, method) {
    let res = await this.state.sdb[method](key);

    this.setState({
      key
    });
    return res;
  }
  gfo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    var scale = VisualViewport.scale;
    if (
      scale === 1 &&
      e.scale < 1 &&
      (!["/", "/login"].includes(window.location.pathname) ||
        this.state.typesOrTiles ||
        this.state.createSliderOpen ||
        this.state.switchCityOpen ||
        this.state.tilesMapOpen === true ||
        this.state.profileOpen ||
        this.state.chatsopen ||
        this.state.achatisopen ||
        false)
    ) {
      this.setState({ menuOpen: true });
    }
  };
  componentWillUnmount() {
    clearTimeout(this.waitOfficials);
    window.removeEventListener("gestureend", this.gfo);
  }
  componentDidMount = async () => {
    const key = await this.state.sdb.readKey();
    this.setState({ key });
    //var answer = window.confirm(`fetch ${this.props.city}?`);
    //answer &&
    this.pinch &&
      this.pinch.current &&
      this.pinch.current.addEventListener("gestureend", this.gfo);
    if (!this.state.watchingSignupVideo && this.state.justOpened) {
      this.setState({ watchingSignupVideo: true });
    }

    if (this.props.location.state && this.props.location.state.bumpedFrom)
      this.props.history.push(this.props.location.state.bumpedFrom);
    const { item, pathname } = this.props;
    item && pathname === "/" && this.mountSugg(item);
    this.newMapArcgis();
  };
  mapboxCity = async (newCityToQuery) => {
    //if (newCityToQuery !== this.props.city)
    await fetch(
      //`https://atlas.microsoft.com/search/address/json?subscription-key={sxQptNsgPsKENxW6a4jyWDWpg6hOQGyP1hSOLig4MpQ}&api-version=1.0&query=${enteredValue}&typeahead={typeahead}&limit={5}&language=en-US`
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${newCityToQuery}.json?limit=2&types=place&access_token=pk.eyJ1Ijoibmlja2NhcmR1Y2NpIiwiYSI6ImNrMWhyZ3ZqajBhcm8zY3BoMnVnbW02dXQifQ.aw4gJV_fsZ1GKDjaWPxemQ`
    )
      .then(async (response) => await response.json())
      .then((body) => {
        var city = body.features[0].place_name;
        if (city) {
          console.log("found " + city);
          this.props.setForumDocs({ forumOpen: true });

          const cityapi = city.split(",")[0].replace(/[, ]+/g, "_");
          //const stateapi = "California";
          const state = newCityToQuery.split(", ")[1];
          const stateapi = state.replace(/ /g, "_");
          this.chooseCitypoint(
            body.features[0].center,
            this.state.distance,
            city,
            cityapi,
            stateapi,
            null
          );
        }
      })
      .catch((err) => {
        console.log(err);
        alert("please try another city name");
      });
  };
  mountSugg = (item) => {
    console.log("suggesting " + item.place_name + " " + item.center);
    this.props.sustainPath(item.place_name, true);

    this.props.setForumDocs({ forumOpen: true });

    const city = item.place_name;
    const cityapi = city.split(",")[0].replace(/ /g, "_");
    //const stateapi = "California";
    const state = item.place_name.split(", ")[1].split(",")[0];
    const stateapi = state.replace(/ /g, "_");
    this.chooseCitypoint(
      item.center,
      this.state.distance,
      city,
      cityapi,
      stateapi,
      null,
      true
    );
  };
  handleNewCity = (newCityToQuery) => {
    if (
      this.state.previousCityQuery &&
      newCityToQuery === this.state.previousCityQuery[2]
    ) {
      console.log("no need to reload, city re-introduced: " + newCityToQuery);
      this.props.setIndex({ isProfile: null });
      this.props.unloadGreenBlue();
      //this.chooseCitypoint(...this.state.previousCityQuery);
    } else {
      var found = suggestions.find((x) =>
        newCityToQuery.includes(x.place_name)
      );
      if (found) {
        console.log(
          "hard-coded city found: " + newCityToQuery + " " + found.center
        );
        this.props.setForumDocs({ forumOpen: true });

        const cityapi = found.place_name.split(",")[0].replace(/[, ]+/g, "_");
        //const stateapi = "California";
        const state = newCityToQuery.split(", ")[1];
        const stateapi = state.replace(/ /g, "_");
        this.chooseCitypoint(
          found.center,
          this.state.distance,
          found.place_name,
          cityapi,
          stateapi,
          null
        );
      } else if (newCityToQuery) {
        console.log("mapbox/openstreet for: " + newCityToQuery);
        this.mapboxCity(newCityToQuery);
      }
    }
  };
  componentDidUpdate = async (prevProps) => {
    const {
      newCityToQuery,
      item,
      dropToCheck,
      pathname,
      auth,
      chats
    } = this.props;
    const {
      started,
      chatsopen,
      chatsopenlast,
      lastRecipients,
      recipients,
      officialLevel,
      officialRole,
      lastOfficialLevel,
      lastOfficialRole
    } = this.state;
    if (item && pathname && pathname !== prevProps.pathname) {
      item && pathname === "/" && this.mountSugg(item);
      this.state.drop &&
        this.setState(
          {
            drop: null
          },
          () => this.props.setFolder({ dropToCheck: null })
        );
    }

    if (newCityToQuery && newCityToQuery !== prevProps.newCityToQuery) {
      console.log(
        newCityToQuery.toUpperCase() + " previousQuery, hard-coded or mapbox"
      );
      this.handleNewCity(newCityToQuery);
    }

    if (!started && chatsopen && chatsopen !== chatsopenlast) {
      this.setState({ chatsopenlast: chatsopen, started: true });
    }
    if (recipients !== lastRecipients) {
      this.setState({ lastRecipients: recipients }, () =>
        Promise.all(
          recipients.map(async (x) => await this.props.hydrateUser(x))
        ).then((recipientsProfiled) => this.setState({ recipientsProfiled }))
      );
    }
    if (dropToCheck && dropToCheck !== prevProps.dropToCheck) {
      console.log("checking dropped post " + dropToCheck);
      var drop = await this.props.findPost(dropToCheck);

      if (drop) {
        if (drop.constructor === Object && Object.keys(drop).length !== 0) {
          this.setState({ drop }, () => {
            this.props.setIndex({ forumOpen: true });
          });
        }
      } else {
        this.setState({
          drop: null
        });
      }
    }
    if (
      (officialLevel !== "" || officialRole !== "") &&
      (officialLevel !== lastOfficialLevel || officialRole !== lastOfficialRole)
    ) {
      this.getOfficials();
    }
    if (auth !== undefined && chats && chats !== prevProps.chats) {
      this.setState({
        unreadChatsCount: chats.filter(
          (chat) => !chat.readUsers || !chat.readUsers.includes(auth.uid)
        ).length
      });
    }
  };

  clearForum = (tileChosen, started, together) => {
    this.props.setIndex({
      together: together ? together : this.props.together,
      tileChosen: tileChosen ? tileChosen : this.props.tileChosen,
      budget: [],
      forumPosts: [],
      ordinances: [],
      elections: [],
      oldElections: [],
      oldCases: [],
      oldBudget: [],
      cases: [],
      classes: [],
      departments: [],
      jobs: [],
      clubs: [],
      shops: [],
      restaurants: [],
      services: [],
      housing: [],
      pages: []
    });
    this.props.setData({
      started,
      lastCommPost: null,
      undoCommPost: null,
      lastCommOrd: null,
      undoCommOrd: null,
      lastCommDept: null,
      undoCommDept: null,
      lastOldBudget: null,
      undoOldBudget: null,
      lastOldElections: null,
      undoOldElections: null,
      lastOldCases: null,
      undoOldCases: null,
      lastOldClasses: null,
      undoOldClasses: null,
      lastCommForm: null,
      undoCommForm: null
    });
  };
  chooseCommunity = (community) => {
    const { tileChosen } = this.props;
    if (community.center) {
      this.setState(
        {
          started: false,
          center: community.center
        },
        () => {
          this.clearForum(null, this.props.started);
          this.props.setCommunity({ community });
          if (community.blockedForum.includes(this.props.commtype))
            this.props.setIndex({ commtype: "new" });
          if (community.blockedTiles.includes(tileChosen))
            this.props.setIndex({ tileChosen: "event" });

          if (
            ["forum", "ordinances", "departments", "forms & permits"].includes(
              this.props.commtype
            ) &&
            this.props.openWhen === "expired"
          )
            this.props.setFolder({ openWhen: "new" });
          this.props.fetchCommForum(community, this.props.commtype);
          this.props.fetchCommEvents(community, tileChosen);
        }
      );
    } //else window.alert(JSON.parse(community));
  };
  profileOpener = () => {
    this.props.clearFilePreparedToSend();
    this.setState({
      profileOpen: true
    });
  };
  profileCloser = () => {
    this.props.clearFilePreparedToSend();
    this.setState({
      profileOpen: false
    });
  };
  clickZoomer = (zoomChosen) => this.setState({ zoomChosen });

  menuCloser(e) {
    e.preventDefault();
    this.setState({ menuOpen: false });
  }
  menuOpener(e) {
    e.preventDefault();
    this.setState({ menuOpen: true });
  }
  // plus sign
  createSliderOpener = () => {
    this.setState({
      createSliderOpen: true
    });
  };
  createSliderCloser = () => {
    this.setState({
      createSliderOpen: false
    });
  };
  billSelected = (event) => {
    this.setState({ billSelected: event.packageId });
  };
  updateBills = (results) => {
    this.setState({ bills: [...this.state.bills, ...results.packages] });
  };
  // render
  goSignupConfirmed = () => {
    this.setState({ watchingSignupVideo: true });
  };
  signupConfirmClose = () => {
    this.setState({ watchingSignupVideo: false });
  };

  switchCommunitiesOpener = () => {
    this.setState({
      switchCommunitiesOpen: !this.state.switchCommunitiesOpen
    });
  };
  switchCommunitiesCloser = () => {
    this.setState({
      switchCommunitiesOpen: false
    });
  };
  jobOpener = () => {
    this.setState({ jobsOpen: true });
  };
  jobCloser = () => {
    this.setState({ jobsOpen: false });
  };
  switchCMapOpener = () =>
    this.setState({ switchCityOpen: true }, () => window.scroll(0, 0));

  switchCMapCloser = () => this.setState({ switchCityOpen: false });

  materialDateOpener = (x) => {
    if (x === "futureOnly") {
      this.setState({ futureOnly: true });
    } else {
      this.setState({ futureOnly: false });
    }
    this.setState({ materialDateOpen: true });
  };
  materialDateCloser = () => {
    this.setState({
      materialDateOpen: false
    });
  };
  chooseEvents = () => {
    var tileChosen =
      this.props.community.blockedTiles &&
      this.props.community.blockedTiles.includes(this.props.tileChosen) &&
      !this.props.community.blockedTiles.includes(this.props.tileChosen);

    tileChosen && this.props.setIndex({ tileChosen });
    this.props.setIndex({ commtype: "new" });
  };
  openchat = () => this.setState({ chatsopen: true, closeAllStuff: true });
  chooseGlobe = () => {
    if (!this.state.gotGlobe) this.props.getGlobalForum(false, "new");
    if (this.state.globeChosen) {
      this.setState({
        globeChosen: false
      });
    } else {
      if (this.props.commtype !== "new" || this.state.subForum) {
        this.props.setIndex({ commtype: "new" });
        this.setState({ subForum: false });
      }
      this.setState({
        globeChosen: true
      });
    }
  };
  openForum = () =>
    this.setState(
      {
        showFilters: true,
        started: false
        //subForum: !["classes", "departments"].includes(this.props.commtype)
      },
      () =>
        this.props.setIndex({
          forumOpen: true
        })
    );

  doneQueryCity = () => {
    this.setState({ queryingWait: false });
  };
  startQueryCity = () => {
    this.setState({ queryingWait: true });
  };
  clickCityGifmap = (prediction, tile) => {
    this.startQueryCity();
    this.setState({ queryingWait: true }, () => {
      const q = prediction.place_name;

      const city = q.split(", ")[0];
      const cityapi = city.replace(/, /g, "%20").replace(/ /g, "%20");
      const location = prediction.center;
      const distance = this.state.y;
      const state = prediction.place_name.split(", ")[1].split(", ")[0];
      const stateapi = state.replace(/ /, "%20");
      this.switchCMapCloser();
      this.chooseCitypoint(location, distance, q, cityapi, stateapi, tile);
    });
  };
  render() {
    const {
      etype,
      ctype,
      stype,
      rtype,
      servtype,
      jtype,
      htype,
      ptype,
      vtype
    } = this.state;
    const {
      tileChosen,
      restaurants,
      appHeight,
      containerStyle,
      width
    } = this.props;
    var type =
      tileChosen === "event"
        ? etype
        : tileChosen === "club"
        ? ctype
        : tileChosen === "shop"
        ? stype
        : tileChosen === "restaurant"
        ? rtype
        : tileChosen === "service"
        ? servtype
        : tileChosen === "job"
        ? jtype
        : tileChosen === "housing"
        ? htype
        : tileChosen === "page"
        ? ptype
        : tileChosen === "venue"
        ? vtype
        : null;
    if (this.props.auth !== undefined && this.props.auth.uid) {
      const scopecode =
        window.location.href &&
        window.location.href.match(/state=(.*)/) &&
        window.location.href.match(/state=(.*)/)[1];
      const authcode =
        window.location.href &&
        window.location.href.match(/code=(.*)/) &&
        window.location.href.match(/code=(.*)&/)[1];
      //if (this.props.user && !this.props.user.data.stripe_user_id) {
      if (this.state.key && Object.keys(this.state.key).includes(scopecode)) {
        this.createStripeVendor(authcode);
        this.setState({ key: undefined });
      }
    }
    var restaurantsChinese = restaurants.filter((x) =>
      x.rtype.includes("chinese")
    );
    var restaurantsItalian = restaurants.filter((x) =>
      x.rtype.includes("italian")
    );

    var restaurantsMexican = restaurants.filter((x) =>
      x.rtype.includes("mexican")
    );

    var restaurantsIndian = restaurants.filter((x) =>
      x.rtype.includes("indian")
    );

    var restaurantsHomestyle = restaurants.filter((x) =>
      x.rtype.includes("homestyle & fried")
    );

    var restaurantsBurger = restaurants.filter((x) =>
      x.rtype.includes("burgers & sandwich")
    );

    var restaurantsNoodle = restaurants.filter((x) =>
      x.rtype.includes("noodles")
    );

    var restaurantsVegan = restaurants.filter((x) =>
      x.rtype.includes("vegan & health")
    );

    var restaurantsSeafood = restaurants.filter((x) =>
      x.rtype.includes("seafood")
    );

    var restaurantsBfast = restaurants.filter((x) =>
      x.rtype.includes("breakfast & lunch")
    );
    const { commtype } = this.props;
    var collection = "forum";
    //var old = "";
    if (
      ["new", "lesson", "show", "game", "lesson", "show"].includes(commtype)
    ) {
      collection = "forum";
    } else if (commtype === "ordinance") {
      collection = "ordinances";
    } else if (commtype === "departments") {
      collection = "departments";
    } else if (commtype === "budget") {
      collection = "budget";
      //old = "oldBudget";
    } else if (commtype === "election") {
      collection = "elections";
      //old = "oldElections";
    } else if (commtype === "cases") {
      collection = "court";
      //old = "oldCases";
    } else if (commtype === "classes") {
      collection = "classes";
      //old = "oldClasses";
    } else if (commtype === "forms & permits") {
      collection = "forms & permits";
    }
    var forumPosts = ["new", "lesson", "show", "game"].includes(
      this.props.commtype
    )
      ? this.props.forumPosts
      : this.props.commtype === "budget"
      ? this.props.budget
      : this.props.commtype === "ordinance"
      ? this.props.ordinances
      : this.props.commtype === "election"
      ? this.props.elections
      : this.props.commtype === "cases"
      ? this.props.cases
      : this.props.commtype === "classes"
      ? this.props.classes
      : this.props.commtype === "departments"
      ? this.props.departments
      : [];

    var subForumPosts =
      tileChosen === "restaurant"
        ? restaurants
        : tileChosen === "shop"
        ? this.props.shops
        : tileChosen === "service"
        ? this.props.services
        : tileChosen === "housing"
        ? this.props.housing
        : tileChosen === "page"
        ? this.props.pages
        : tileChosen === "club"
        ? this.props.clubs
        : tileChosen === "job"
        ? this.props.jobs
        : this.props.events;
    var w =
      this.props.appHeight < 360 &&
      this.props.forumOpen &&
      !this.props.switchCityOpen &&
      !this.props.tilesMapOpen
        ? width - 56
        : width;
    const max = 200;
    var columncount =
      w < max
        ? 1
        : w < max + 200
        ? 2
        : w < max + 400
        ? 3
        : w < max + 600
        ? 4
        : 5;
    return (
      <div
        ref={this.pinch}
        style={{
          ...containerStyle //backgroundColor: "red"
        }}
      >
        {/*!this.props.forumOpen &&
          this.props.started &&
          this.props.switchCityOpen &&
          !this.state.drop && (
            <div
              style={{
                position: "absolute",
                zIndex: "-1",
                height: `calc(${appHeight} + 100px)`,
                width: "1px"
              }}
            />
            )*/}
        <SwitchCity
          setFoundation={(state) => this.setState(state)}
          displayPreferences={this.props.displayPreferences}
          setDisplayPreferences={this.props.setDisplayPreferences}
          setIndex={this.props.setIndex}
          commtype={this.props.commtype}
          tileChosen={tileChosen}
          favoriteCities={this.props.favoriteCities}
          getUserInfo={this.props.getUserInfo}
          showingRadius={this.state.showingRadius}
          switchCMapCloser={this.switchCMapCloser}
          switchCityOpen={this.state.switchCityOpen}
          chooseCitypoint={(
            location,
            distance,
            city,
            cityapi,
            stateapi,
            tile
          ) => {
            tile &&
              this.props.setIndex({
                tileChosen: tile
              });
            this.handleNewCity(city);
          }}
          chooseCommunity={(s, x) => {
            this.setState({
              started: true
            });
            if (
              [
                "new",
                "lesson",
                "show",
                "game",
                "forms & permits",
                "ordinance",
                "budget",
                "election",
                "cases",
                "classes",
                "departments"
              ].includes(x)
            ) {
              this.setState({
                switchCityOpen: false
              });
              this.props.setIndex({ commtype: x, forumOpen: true });
              this.chooseCommunity(s);
            } else {
              this.setState({
                switchCityOpen: false
              });
              this.props.setIndex({
                forumOpen: false,
                tileChosen: x
              });
              this.chooseCommunity(s);
            }
          }}
          clickCityGifmap={this.clickCityGifmap}
          startQueryCity={this.startQueryCity}
          eventsOpen={this.state.eventsOpen}
          chosenCity={this.state.chosenCity}
          chooseCenter={this.chooseCenter}
          switchCMapOpener={this.props.switchCMapOpener}
          y={this.state.y}
          sliderchange={({ y }) => {
            this.setState({ y, distance: y });
          }}
          input={<input />}
          onClose={() => {}}
          locationLocation
          distance={this.state.distance}
          auth={this.props.auth}
          user={this.props.user}
          city={this.props.city}
          //

          profileEntities={this.props.profileEntities}
          //

          getCommunity={this.props.getCommunity}
        />
        <div ref={this.globe} />
        <div ref={this.closeSwitchMarker} />
        <Mapbox
          setDisplayPreferences={this.props.setDisplayPreferences}
          eventTypes={this.eventTypes}
          setIndex={this.props.setIndex}
          resetLastQuery={() =>
            !this.props.community &&
            this.chooseCitypoint(...this.state.previousCityQuery)
          }
          clickCityGifmap={this.clickCityGifmap}
          switchCMapCloser={this.switchCMapCloser}
          switchHeight={this.state.switchHeight}
          scrolling={this.state.scrolling}
          height={appHeight}
          width={width}
          mapbox={this.state.mapbox}
          openCal={this.state.openCal}
          user={this.props.user}
          auth={this.props.auth}
          chooseEvents={this.chooseEvents}
          openchat={this.openchat}
          community={this.props.community}
          center={
            this.state.center
            //window.alert(center + " is not [lng,lat]")
          }
          cityapi={this.props.cityapi}
          openForum={this.openForum}
          openthestuff={() => {
            if (this.state.closeAllStuff) {
              this.setState({ closeAllStuff: false });
            } else {
              this.setState({ closeAllStuff: true });
            }
          }}
          zoomIn={(center) =>
            this.setState({
              zoomChosen: this.state.zoomChosen + 1,
              scrollChosen: this.state.scrollChosen + 1,
              radioChosen: this.state.radioChosen + 1,
              center: center ? [center[1], center[0]] : this.state.center
            })
          }
          commtype={this.props.commtype}
          switchCityOpen={this.state.switchCityOpen}
          clickZoomer={this.clickZoomer}
          zoomChosen={this.state.zoomChosen}
          chooseCitypoint={this.chooseCitypoint}
          chooseEvent={this.chooseEvent}
          distance={this.state.distance}
          queryDate={this.queryDate}
          queriedDate={this.props.queriedDate}
          tileChosen={tileChosen}
          unStart={this.unStart}
          start={this.start}
          alltime={this.state.alltime}
          departments={this.props.departments}
          classes={this.props.classes}
          setFoundation={(state) => this.setState(state)}
          displayPreferences={this.props.displayPreferences}
          apple={this.props.apple}
          setCommunity={this.props.setCommunity}
          setData={this.props.setData}
          monthCalOpen={this.state.monthCalOpen}
          invites={this.props.invites}
          selfvites={this.props.selfvites}
          fonish={() => this.setState({ materialDateOpen: false })}
          materialDateOpen={this.state.materialDateOpen}
          pathname={this.props.pathname}
          started={false}
          forumOpen={this.props.forumOpen}
          tilesMapOpen={this.state.tilesMapOpen}
          chatsopen={this.state.chatsopen}
          achatopen={this.state.achatopen}
          unreadChatsCount={this.state.unreadChatsCount}
          notes={this.props.notes}
          setForumDocs={this.props.setForumDocs}
          communities={this.props.communities}
          current={this.props.current}
          current1={this.props.current1}
          searchEvents={this.state.searchEvents}
          goToRadius={() => {
            !this.props.community &&
              this.chooseCitypoint(...this.state.previousCityQuery);
            this.setState({
              distance: this.state.y
            });
          }}
          trueZoom={() => this.setState({ y: this.state.distance })}
          toggleCloseStuff={() =>
            this.setState({ closeAllStuff: !this.state.closeAllStuff })
          }
          y={this.state.y}
          sliderchange={({ y }) => {
            this.setState({
              y
            });
          }}
          birdsEyeZoomOn={() => {
            var zoom = Math.max(this.state.zoomChosen - 3, 1);
            !isNaN(zoom) &&
              this.setState({
                zoomChosen: zoom,
                scrollChosen: zoom,
                radioChosen: zoom,
                previousZoom: this.state.zoomChosen
              });
          }}
          birdsEyeZoomOff={() =>
            this.state.previousZoom &&
            this.setState({
              zoomChosen: this.state.previousZoom,
              scrollChosen: this.state.previousZoom,
              radioChosen: this.state.previousZoom
            })
          }
          address={this.state.address}
          closeSurrounds={() => this.setState({ closeAllStuff: true })}
          openSurrounds={() => this.setState({ started: false })}
          openStart={this.openStart}
          chooseCommunity={this.chooseCommunity}
          waitForMove={() => this.setState({ waitForMove: true })}
          range={this.props.range}
          chooseEdmevent={this.chooseEdmevent}
          events={this.props.events}
          jobs={this.props.jobs}
          clubs={this.props.clubs}
          restaurants={restaurants}
          shops={this.props.shops}
          services={this.props.services}
          housing={this.props.housing}
          pages={this.props.pages}
          ptype={ptype}
          vtype={vtype}
          servtype={servtype}
          htype={htype}
          stype={stype}
          etype={etype}
          ctype={ctype}
          jtype={jtype}
          rtype={rtype}
          city={this.props.city}
        />
        <Links
              setAuth={this.props.setAuth}
          getRoomKeys={this.props.getRoomKeys}
          setToUser={this.props.setToUser}
          standbyMode={this.props.standbyMode}
          type={type}
          handleNewCity={this.handleNewCity}
          favoriteCities={this.props.favoriteCities}
          openForum={this.openForum}
          openCal={this.state.openCal}
          calToggle={(x) => this.setState(x)}
          user={this.props.user}
          auth={this.props.auth}
          commtype={this.props.commtype}
          switchCityOpen={this.state.switchCityOpen}
          displayPreferences={this.props.displayPreferences}
          //
          clickZoomer={this.clickZoomer}
          zoomChosen={this.state.zoomChosen}
          chooseCitypoint={this.chooseCitypoint}
          chooseEvent={this.chooseEvent}
          eventTypes={this.eventTypes}
          distance={this.state.distance}
          queryDate={this.queryDate}
          queriedDate={this.props.queriedDate}
          tileChosen={tileChosen}
          unStart={this.unStart}
          start={this.start}
          alltime={this.state.alltime}
          departments={this.props.departments}
          classes={this.props.classes}
          setFoundation={(state) => this.setState(state)}
          apple={this.props.apple}
          setCommunity={this.props.setCommunity}
          setData={this.props.setData}
          monthCalOpen={this.state.monthCalOpen}
          invites={this.props.invites}
          selfvites={this.props.selfvites}
          fonish={() => this.setState({ materialDateOpen: false })}
          materialDateOpen={this.state.materialDateOpen}
          pathname={this.props.pathname}
          started={false}
          forumOpen={this.props.forumOpen}
          tilesMapOpen={this.state.tilesMapOpen}
          chatsopen={this.state.chatsopen}
          achatopen={this.state.achatopen}
          unreadChatsCount={this.state.unreadChatsCount}
          notes={this.props.notes}
          setForumDocs={this.props.setForumDocs}
          communities={this.props.communities}
          current={this.props.current}
          current1={this.props.current1}
          searchEvents={this.state.searchEvents}
          goToRadius={() => {
            !this.props.community &&
              this.chooseCitypoint(...this.state.previousCityQuery);
            this.setState({
              distance: this.state.y
            });
          }}
          trueZoom={() => this.setState({ y: this.state.distance })}
          toggleCloseStuff={() =>
            this.setState({ closeAllStuff: !this.state.closeAllStuff })
          }
          y={this.state.y}
          sliderchange={({ y }) => {
            this.setState({
              y
            });
          }}
          birdsEyeZoomOn={() => {
            var zoom = Math.max(this.state.zoomChosen - 3, 1);
            !isNaN(zoom) &&
              this.setState({
                zoomChosen: zoom,
                scrollChosen: zoom,
                radioChosen: zoom,
                previousZoom: this.state.zoomChosen
              });
          }}
          birdsEyeZoomOff={() =>
            this.state.previousZoom &&
            this.setState({
              zoomChosen: this.state.previousZoom,
              scrollChosen: this.state.previousZoom,
              radioChosen: this.state.previousZoom
            })
          }
          address={this.state.address}
          closeSurrounds={() => this.setState({ closeAllStuff: true })}
          openSurrounds={() => this.setState({ started: false })}
          openStart={this.openStart}
          chooseCommunity={this.chooseCommunity}
          waitForMove={() => this.setState({ waitForMove: true })}
          range={this.props.range}
          chooseEdmevent={this.chooseEdmevent}
          events={this.props.events}
          jobs={this.props.jobs}
          clubs={this.props.clubs}
          restaurants={restaurants}
          shops={this.props.shops}
          services={this.props.services}
          housing={this.props.housing}
          pages={this.props.pages}
          ptype={ptype}
          vtype={vtype}
          servtype={servtype}
          htype={htype}
          stype={stype}
          etype={etype}
          ctype={ctype}
          jtype={jtype}
          rtype={rtype}
          city={this.props.city}
          //
          appHeight={appHeight}
          width={width}
          setDrop={(x) => this.setState(x)}
          scrolling={this.state.scrolling}
          resetPathAlias={this.props.resetPathAlias}
          setIndex={this.props.setIndex}
          drop={this.state.drop}
          //person
          minHeight={this.state.minHeight}
          statePathname={this.props.statePathname}
          profilePosts={this.props.profilePosts}
          isProfile={this.props.isProfile}
          findPost={this.props.findPost}
          loadingMessage={this.props.loadingMessage}
          lastComments={this.props.lastComments}
          undoComments={this.props.undoComments}
          lastPostOfComment={this.props.lastPostOfComment}
          undoPostOfComment={this.props.undoPostOfComment}
          lastPosts={this.props.lastPosts}
          lastPost={this.props.lastPost}
          undoPosts={this.props.undoPosts}
          undoPost={this.props.undoPost}
          //findPost={this.props.findPost}
          openOptions={this.props.openOptions}
          openEntity={this.props.openEntity}
          droppedPost={this.props.droppedPost}
          dropCityIssues={this.props.dropCityIssues}
          choosecity={this.props.choosecity}
          myCommunities={this.props.myCommunities}
          deletedEvts={this.state.deletedEvts}
          entityNames={this.state.entityNames}
          //
          allowDeviceToRead={this.props.allowDeviceToRead}
          manuallyDeleteKeyBox={this.props.manuallyDeleteKeyBox}
          chosenPost={this.props.chosenPost}
          chosenPostId={this.props.chosenPostId}
          postHeight={this.props.postHeight}
          chats={this.props.chats}
          getCommunity={this.props.getCommunity}
          hydrateEntity={this.props.hydrateEntity}
          getDrop={this.props.getDrop}
          hydrateUser={this.props.hydrateUser}
          recipientsProfiled={this.state.recipientsProfiled}
          keyBoxes={this.props.keyBoxes}
          profile={this.props.profile}
          following={this.props.following}
          profileEntities={this.props.profileEntities}
          //
          comments={this.props.comments}
          postMessage={this.props.postMessage}
          openWhen={this.props.openWhen}
          helper={this.props.helper}
          parent={this.props.parent}
          linkDrop={this.props.linkDrop}
          dropId={this.props.dropId}
          unloadGreenBlue={this.props.unloadGreenBlue}
          loadGreenBlue={this.props.loadGreenBlue}
          bumpScrollReady={this.props.bumpScrollReady}
          //
          searcherEventer={(e) =>
            this.setState({ searchEvents: e.target.value })
          }
          lastGlobalPost={this.props.lastGlobalPost}
          undoGlobalPost={this.props.undoGlobalPost}
          lastGlobalForum={this.props.lastGlobalForum}
          undoGlobalForum={this.props.undoGlobalForum}
          //
          lastCityPost={this.props.lastCityPost}
          undoCityPost={this.props.undoCityPost}
          lastCityForum={this.props.lastCityForum}
          undoCityForum={this.props.undoCityForum}
          //
          lastCommPost={this.props.lastCommPost}
          undoCommPost={this.props.undoCommPost}
          lastCommForum={this.props.lastCommForum}
          undoCommForum={this.props.undoCommForum}
          //
          storageRef={this.props.storageRef}
          meAuth={this.props.meAuth}
          logoutofapp={this.props.logoutofapp}
          getUserInfo={this.props.getUserInfo}
          collection={collection}
          getVideos={this.props.getVideos}
          getFolders={this.props.getFolders}
          folders={this.props.folders}
          videos={this.props.videos}
          onDeleteVideo={this.props.onDeleteVideo}
          handleSaveVideo={this.props.handleSaveVideo}
          unSubForum={() =>
            this.setState({ subForum: false, showFilters: false })
          }
          officialResults={this.state.officialResults}
          officialLevel={this.state.officialLevel}
          selectOfficialLevel={(e) =>
            this.setState({ officialLevel: e.target.value })
          }
          officialRole={this.state.officialRole}
          selectOfficialRole={(e) =>
            this.setState({ officialRole: e.target.value })
          }
          clearErrorVoter={() =>
            this.setState({ errorVoter: "", voterResults: "" })
          }
          errorVoter={this.state.errorVoter}
          voterResults={this.state.voterResults}
          handleVoterQuery={this.handleVoterQuery}
          showFilters={this.state.showFilters}
          openFilters={() =>
            this.setState(
              this.state.showFilters
                ? {
                    showFilters: false
                  }
                : {
                    subForum: false,
                    tilesMapOpen: null,
                    showFilters: true
                  },
              () =>
                !this.state.showFilters &&
                this.props.setIndex({
                  forumOpen: true
                })
            )
          }
          toggleEditing={
            this.state.editingCommunity || this.state.addPic
              ? () => {
                  this.setState({ editingCommunity: false, addPic: false });
                }
              : () => this.setState({ editingCommunity: true })
          }
          editingCommunity={this.state.editingCommunity}
          openCommunityAdmin={() => this.setState({ openCommunityAdmin: true })}
          issues={this.props.issues}
          followingMe={this.props.followingMe}
          openChatWithGroup={this.openChatWithGroup}
          createSliderOpen={this.state.createSliderOpen}
          tileChanger={this.tileChanger}
          thisentity={this.state.thisentity}
          entityTitle={this.state.entityTitle}
          entityType={this.state.entityType}
          entityId={this.state.entityId}
          setTopic={(x) => this.setState({ chosenTopic: x })}
          chosenTopic={this.state.chosenTopic}
          threadId={this.state.threadId}
          oktoshowchats={this.props.oktoshowchats}
          showChatsOnce={this.props.showChatsOnce}
          accessToken={this.props.accessToken}
          chosenEdmevent={this.state.chosenEdmevent}
          myEvents={this.props.myEvents}
          myClubs={this.props.myClubs}
          myJobs={this.props.myJobs}
          myVenues={this.props.myVenues}
          myServices={this.props.myServices}
          myClasses={this.props.myClasses}
          myDepartments={this.props.myDepartments}
          myRestaurants={this.props.myRestaurants}
          myShops={this.props.myShops}
          myPages={this.props.myPages}
          myHousing={this.props.myHousing}
          recipients={this.state.recipients.sort()}
          rangeChosen={this.state.rangeChosen}
          materialDateOpener={this.materialDateOpener}
          materialDate={this.state.materialDate}
          clearMaterialDate={() => {
            this.setState({ materialDate: "" });
          }}
          alterRecipients={(x) => this.setState(x)}
          listplz={this.state.listplz}
          listplzToggle={
            this.state.listplz
              ? () => this.setState({ listplz: false })
              : () => this.setState({ listplz: true })
          }
          againBackMessages={this.props.againBackMessages}
          moreMessages={this.props.moreMessages}
          addPic={this.state.addPic}
          addPicTrue={() => this.setState({ addPic: true })}
          addPicFalse={() => this.setState({ addPic: false })}
          subForum={this.state.subForum}
          clearFilePreparedToSend={this.props.clearFilePreparedToSend}
          showpicker2={this.props.showpicker2}
          picker2={this.props.picker2}
          loadGapiApi={this.props.loadGapiApi}
          signedIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          users={this.props.users}
          forumPosts={forumPosts}
          subForumPosts={subForumPosts}
          forumOrdinances={this.state.forumOrdinances}
          forumClasses={this.state.forumClasses}
          forumDepartments={this.state.forumDepartments}
          globalForumPosts={this.state.globalForumPosts}
          chooseGlobe={this.chooseGlobe}
          globeChosen={this.state.globeChosen}
          closeAllStuff={this.state.closeAllStuff}
          closeForum={() =>
            this.props.setIndex({
              forumOpen: false
            })
          }
          description={this.state.description}
          humidity={this.state.humidity}
          search={this.state.search}
          locationLocation
          eventsOpen={this.state.eventsOpen}
          eventCloser={this.eventCloser}
          eventOpener={this.eventOpener}
          switchCMapOpener={this.switchCMapOpener}
          switchCMapCloser={this.switchCMapCloser}
          mapChanged={this.mapChanged}
          changeCity={this.changeCity}
          myVariable={this.state.myVariable}
          chooseJob={this.chooseJob}
          chooseClub={this.chooseClub}
          createSliderOpener={this.createSliderOpener}
          searchJobs={this.state.searchJobs}
          haltMapCityChoose={this.haltChooseCity}
          dayliked={this.state.dayliked}
          allTimer={() => this.setState({ alltime: true })}
          targetid={this.state.targetid}
          closeSwitch={() => {
            this.switchCMapOpener();
            this.eventCloser();
          }}
          openNewForum={this.state.openNewForum}
          closeNewForum={() => this.setState({ openNewForum: false })}
          onDelete={this.props.onDelete}
          handleSave={(note) => this.handleSave(note, "createNote")}
          filePreparedToSend={this.props.filePreparedToSend}
          loadYoutubeApi={this.props.loadYoutubeApi}
          s={this.props.s}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          switchCMap={this.state.switchCityOpen}
          hiddenMsgs={this.state.hiddenMsgs}
          deletedMsgs={this.state.deletedMsgs}
          listHiddenMsgs={(x) =>
            this.setState({ hiddenMsgs: [...this.state.hiddenMsgs, x] })
          }
          listDeletedMsgs={(x) =>
            this.setState({
              deletedMsgs: [...this.state.deletedMsgs, x]
            })
          }
          profileOpener={this.profileOpener}
          profileOpen={this.state.profileOpen}
          chatscloser={() => this.setState({ chatsopen: false })}
          openAChat={this.state.achatopen}
          achatisopen={(x) => {
            if (x) {
              this.setState(x);
            }
            this.setState({ achatopen: true });
          }}
          achatisopenfalse={() =>
            this.setState({
              achatopen: false,
              achatisopen: false
              //threadId: ""
            })
          }
          budget={this.props.budget}
          ordinances={this.props.ordinances}
          oldBudget={this.props.oldBudget}
          oldElections={this.props.oldElections}
          oldCases={this.props.oldCases}
          oldClasses={this.props.oldClasses}
        />

        <EventTypesMap
          type={type}
          maxWidth={columncount * 200 - 10}
          width={width / columncount - 10}
          started={false}
          getUserInfo={this.props.getUserInfo}
          restaurant={
            restaurants && restaurants.length > 0 && restaurants.length
          }
          restaurantsChinese={restaurantsChinese.length}
          restaurantsItalian={restaurantsItalian.length}
          restaurantsMexican={restaurantsMexican.length}
          restaurantsIndian={restaurantsIndian.length}
          restaurantsHomestyle={restaurantsHomestyle.length}
          restaurantsBurger={restaurantsBurger.length}
          restaurantsNoodle={restaurantsNoodle.length}
          restaurantsVegan={restaurantsVegan.length}
          restaurantsSeafood={restaurantsSeafood.length}
          restaurantsBfast={restaurantsBfast.length}
          openFilters={() => {
            this.props.setIndex({
              forumOpen: true
            });
            this.setState({
              subForum: false,
              tilesMapOpen: null,
              showFilters: true
            });
          }}
          globeChosen={this.state.globeChosen}
          servtype={servtype}
          htype={htype}
          jtype={jtype}
          stype={stype}
          rtype={rtype}
          ctype={ctype}
          etype={etype}
          ptype={ptype}
          vtype={vtype}
          user={this.props.user}
          auth={this.props.auth}
          city={this.props.city}
          forumOpen={this.props.forumOpen}
          community={this.props.community}
          show={this.state.tilesMapOpen === "types"}
          eventTypes={this.eventTypes}
          tileChanger={this.tileChanger}
          tileChosen={tileChosen}
          commtype={this.props.commtype}
          subForum={this.state.subForum}
        />
        <TilesMap
          maxWidth={columncount * 200 - 10}
          width={width / columncount - 10}
          tileChosen={tileChosen}
          forumOpen={this.props.forumOpen}
          subForum={this.state.subForum}
          commtype={commtype}
          started={false}
          getUserInfo={this.props.getUserInfo}
          auth={this.props.auth}
          city={this.props.city}
          community={this.props.community}
          show={this.state.tilesMapOpen === true}
          eventTypes={this.eventTypes}
          tileChanger={this.tileChanger}
        />
        <Routes
          location={this.props.location}
          isProfile={this.props.isProfile}
          previousCityQuery={this.state.previousCityQuery}
          statePathname={this.props.statePathname}
          setIndex={this.props.setIndex}
          setStatePathname={(statePathname) => this.setState({ statePathname })}
          invites={this.props.invites}
          selfvites={this.props.selfvites}
          groupLast={this.state.groupLast}
          groupUndo={this.state.groupUndo}
          hydrateEntityFromName={this.props.hydrateEntityFromName}
          findPost={this.props.findPost}
          getCommunity={this.props.getCommunity}
          hydrateUser={this.props.hydrateUser}
          chosenEntity={this.props.chosenEntity}
          pathname={this.props.pathname}
          loadingMessage={this.props.loadingMessage}
          postHeight={this.props.postHeight}
          chosenPostId={this.props.chosenPostId}
          lastComments={this.props.lastComments}
          undoComments={this.props.undoComments}
          lastPostOfComment={this.props.lastPostOfComment}
          undoPostOfComment={this.props.undoPostOfComment}
          lastPosts={this.props.lastPosts}
          lastPost={this.props.lastPost}
          undoPosts={this.props.undoPosts}
          undoPost={this.props.undoPost}
          //
          postMessage={this.props.postMessage}
          comments={this.props.comments}
          chosenPost={this.props.chosenPost}
          helper={this.props.helper}
          hydrateUserFromUserName={this.props.hydrateUserFromUserName}
          following={this.props.following}
          forumPosts={forumPosts}
          openOptions={this.props.openOptions}
          openEntity={this.props.openEntity}
          saveAuth={this.props.saveAuth}
          parent={this.props.parent}
          linkDrop={this.props.linkDrop}
          dropId={this.props.dropId}
          getUserInfo={this.props.getUserInfo}
          stopAnon={this.props.stopAnon}
          loaded={this.props.loaded}
          showFilters={this.state.showFilters}
          openFilters={() => {
            if (this.state.showFilters) {
              this.setState({
                //forumOpen: true,
                //tilesMapOpen: null,
                showFilters: false
              });
            } else {
              this.props.setIndex({
                forumOpen: true
              });
              this.setState({
                subForum: false,
                tilesMapOpen: null,
                showFilters: true
              });
            }
          }}
          materialDateOpen={this.state.materialDateOpen}
          materialDate={this.state.materialDate}
          materialDateOpener={this.materialDateOpener}
          openplanner={() => this.setState({ materialDateOpen: false })}
          handleChangeDate={(e) => {
            this.setState({ materialDate: e });
          }}
          queriedDate={this.props.queriedDate}
          openChatWithGroup={(x) => {
            if (!this.props.oktoshowchats) {
              var answer = window.confirm(
                "Are you on a private computer? Firebase chat uses cache to lessen the (down)load. Enter the chat or continue anyway?"
              );
              if (answer) {
                this.props.showChatsOnce();
              }
            } else {
              this.setState({
                threadId: x.threadId,
                achatopen: true,
                chatsopen: true,
                achatisopen: true,
                started: false,
                thisentity: x,
                entityTitle: x.entityTitle,
                entityType: x.entityType,
                entityId: x.entityId,
                recipients: x.recipients.sort(),
                chosenTopic: "*"
                //closeAllStuff: true
              });
              this.props.history.push("/");
            }
          }}
          queryDate={this.queryDate}
          recipients={this.state.recipients.sort()}
          entityId={this.state.entityId}
          entityType={this.state.entityType}
          entityCo={this.state.entityCo}
          chosenEdmevent={this.state.chosenEdmevent}
          openachat={(x) => {
            this.props.setIndex({
              forumOpen: false
            });
            this.setState({
              achatopen: true,
              chatsopen: true,
              achatisopen: true,
              started: true,
              recipients: x.members.sort(),
              entityType: "class",
              entityId: x.id
            });
          }}
          jobs={this.props.jobs}
          events={this.props.events}
          rangeChosen={this.state.rangeChosen}
          foundEntity={this.state.foundEntity}
          openit={() =>
            !this.state.chatsopen && this.setState({ chatsopen: true })
          }
          listplz={this.state.listplz}
          listplzToggle={
            this.state.listplz
              ? () => this.setState({ listplz: false })
              : () => this.setState({ listplz: true })
          }
          myCommunities={this.props.myCommunities}
          //items
          myEvents={this.props.myEvents}
          myJobs={this.props.myJobs}
          city={this.props.city}
          community={this.props.community}
          //post as
          inviteChosen={this.state.inviteChosen}
          choosePlan={this.choosePlan}
          notes={this.props.notes}
          users={this.props.users}
          chats={this.props.chats}
          hiddenMsgs={this.state.hiddenMsgs}
          deletedMsgs={this.state.deletedMsgs}
          onDelete={this.props.onDelete}
          handleSave={this.props.handleSave}
          chooseInvite={(e) => this.setState({ inviteChosen: e })}
          achatwasopen={() =>
            this.setState({ achatopen: true, chatsopen: true })
          }
          recentchatswasopen={() => this.setState({ chatsopen: true })}
          chatsopen={this.state.chatsopen}
          nochatopen={() => this.setState({ chatsopen: false })}
          menuOpener={this.menuOpener}
          createSliderOpen={this.state.createSliderOpen}
          //ref={this.CreateEventThePage}
          myVariable={this.state.myVariable}
          setKey={(key) => this.setKey(key, "setKey")}
          entityNames={this.state.entityNames}
          clubOpener={this.clubOpener}
          clubChosen={this.state.clubChosen}
          resetEvent={() =>
            this.setState({
              clubChosen: "",
              jobChosen: "",
              eventChosen: ""
            })
          }
          listDeletedClbs={(x) =>
            this.setState({
              deletedClbs: [...this.state.deletedClbs, x]
            })
          }
          jobOpener={this.jobOpener}
          jobChosen={this.state.jobChosen}
          listDeletedJobs={(x) =>
            this.setState({
              deletedJobs: [...this.state.deletedJobs, x]
            })
          }
          tickets={this.props.tickets}
          eventInitial={true}
          eventOpener={this.eventOpener}
          event={this.state.eventChosen}
          deletedEvts={this.state.deletedEvts}
          listDeletedEvts={(x) =>
            this.setState({
              deletedEvts: [...this.state.deletedEvts, x]
            })
          }
          eventEdm={this.state.chosenEdmevent}
          monthCalOpen={this.state.monthCalOpen}
          dayCalOpen={this.state.dayCalOpen}
          dayCalOpener={this.dayCalOpener}
          monthCalOpener={this.monthCalOpener}
          monthCalCloser={this.monthCalCloser}
          recentchatswasopenit={() => this.setState({ chatsopen: true })}
          Link={this.props.Link}
          dayCalCloseMonthCalOpener={this.dayCalCloseMonthCalOpener}
          dayCalCloser={this.dayCalCloser}
          //
          etype={etype}
          ctype={ctype}
          jtype={jtype}
          clubs={this.props.clubs}
          chooseEvent={this.chooseEvent}
          chooseJob={this.chooseJob}
          chooseEdmevent={this.chooseEdmevent}
          searchEvents={this.state.searchEvents}
          openATC={() => this.setState({ atcopen: true })}
          tileChosen={tileChosen}
          onSave={(note) => this.handleSave(note, "updateNote")}
          loginOpenstate={this.state.loginOpen}
          loginOpen={() => {
            this.setState({ loginOpen: !this.state.loginOpen });
          }}
          redirectToReferrer={this.state.redirectToReferrer}
          goSignupConfirmed={this.goSignupConfirmed}
          watchingSignupVideo={this.state.watchingSignupVideo}
          chatcloser={() => this.setState({ chatsopen: false })}
          chatopener={() => this.setState({ chatsopen: true })}
          userLoaded={this.props.userLoaded}
          anonymous={this.props.anonymous}
          from={(e) => {
            this.setState({ from: e });
          }}
          clearMaterialDate={() => this.setState({ materialDate: "" })}
          //
          user={this.props.user}
          unloadGreenBlue={this.props.unloadGreenBlue}
          loadGreenBlue={this.props.loadGreenBlue}
          inCloud={this.props.inCloud}
          auth={this.props.auth}
          videos={this.props.videos}
          folders={this.props.folders}
          getVideos={this.props.getVideos}
          getFolders={this.props.getFolders}
          //
        />
        {/*this.state.atcopen ? (
          <div className="addtocalendar">
            <div
              className="atcexitor"
              onClick={() =>
                this.setState({ atcopen: false, eventsOpen: true })
              }
            >
              &times;
            </div>
            <AddToCalendar
              event={
                this.state.chosenEdmevent
                  ? {
                      title: this.state.chosenEdmevent.name
                        ? this.state.chosenEdmevent.name
                        : this.state.chosenEdmevent.artistList[0].name,
                      description:
                        this.state.chosenEdmevent.artistList +
                        this.state.chosenEdmevent.ticketLink,
                      location: this.state.chosenEdmevent.venue.address,
                      startTime: new Date(
                        this.state.chosenEdmevent.date
                      ).toISOString()
                    }
                  : {
                      title: this.state.eventChosen.title,
                      description: this.state.eventChosen.body,
                      location: this.state.eventChosen.address,
                      startTime: new Date(
                        this.state.eventChosen.date.seconds
                      ).toISOString()
                    }
              }
              buttonLabel="Put on my calendar"
            />
          </div>
        ) : null*/}
        {this.state.vendorFinishedSignup ? (
          <div onClick={() => this.setState({ vendorFinishedSignup: false })}>
            you can now sell tickets at events you create. congrats!
            <br />
            <Link to="/newevent">open event creator</Link>
            <br />
            close
          </div>
        ) : null}

        <div>
          {this.state.menuOpen ? (
            <Menu
              getUserInfo={this.props.getUserInfo}
              switchCMapOpener={this.switchCMapOpener}
              menuClose={(e) => this.menuCloser(e)}
              auth={this.props.auth}
              chatopener={() => this.setState({ chatsopen: true })}
            />
          ) : null}
        </div>

        {this.state.eventsOpen && (
          <div
            className="backtotoday"
            onClick={() =>
              this.ref.current.scrollIntoView({ behavior: "smooth" })
            }
          >
            &#8635; today
          </div>
        )}

        {!this.state.profileOpen && (
          <Create
            eventDateOpen={() => this.materialDateOpener("futureOnly")}
            community={this.props.community}
            show={this.state.createSliderOpen}
            toggle={this.createSliderCloser}
            users={this.props.users}
            user={this.props.user}
            auth={this.props.auth}
            tileChosen={tileChosen}
            city={this.props.city}
            profileOpener={this.profileOpener}
          />
        )}
        <Profile
          pathname={this.props.pathname}
          hydrateUserFromUserName={this.props.hydrateUserFromUserName}
          following={this.props.following}
          getProfile={this.props.getProfile}
          profileEvents={this.props.profileEvents}
          profileJobs={this.props.profileJobs}
          profileClubs={this.props.profileClubs}
          profileServices={this.props.profileServices}
          profileClasses={this.props.profileClasses}
          profileDepartments={this.props.profileDepartments}
          profileRestaurants={this.props.profileRestaurants}
          profileShops={this.props.profileShops}
          profilePages={this.props.profilePages}
          profileVenues={this.props.profileVenues}
          profileHousing={this.props.profileHousing}
          //
          parents={this.props.parents}
          logoutofapp={() => {
            this.props.logoutofapp();
            this.profileCloser();
          }}
          close={() => this.profileCloser()}
          stripeKey={this.props.stripeKey}
          iAmCandidate={this.props.iAmCandidate}
          iAmJudge={this.props.iAmJudge}
          iAmRepresentative={this.props.iAmRepresentative}
          random={this.props.random}
          setScopeCode={this.props.setScopeCode}
          scopecode={this.props.scopecode}
          myDocs={this.props.myDocs}
          moreDocs={this.props.moreDocs}
          againBackDocs={this.props.againBackDocs}
          chats={this.props.chats}
          filePreparedToSend={this.props.filePreparedToSend}
          clearFilePreparedToSend={this.props.clearFilePreparedToSend}
          showpicker2={this.props.showpicker2}
          picker2={this.props.picker2}
          loadGapiApi={this.props.loadGapiApi}
          signedIn={this.props.signedIn}
          switchAccount={this.props.switchAccount}
          signOut={this.props.signOut}
          loadYoutubeApi={this.props.loadYoutubeApi}
          s={this.props.s}
          authResult={this.props.authResult}
          googlepicker={this.props.googlepicker}
          profileOpen={this.state.profileOpen}
          users={this.props.users}
          user={this.props.user}
          auth={this.props.auth}
          deletedEvts={this.state.deletedEvts}
          deletedClbs={this.state.deletedClbs}
          deletedJobs={this.state.deletedJobs}
        />
        <CommunityAdmin
          hydrateUser={this.hydrateUser}
          close={() => this.setState({ openCommunityAdmin: false })}
          show={this.state.openCommunityAdmin}
          users={this.props.users}
          auth={this.props.auth}
          user={this.props.user}
          community={this.props.community}
        />
        <SignupConfirm
          watchingSignupVideo={this.state.watchingSignupVideo}
          signupConfirmClose={this.signupConfirmClose}
          menuOpener={this.menuOpener}
          closeMenu={() => this.setState({ menuOpener: false })}
        />

        <DateSlidster
          materialDateOpen={this.state.materialDateOpen}
          backToPlanner={() => this.setState({ materialDateOpen: false })}
          futureOnly={this.state.futureOnly}
          forumOpen={this.props.forumOpen}
          rangeChosen={this.state.rangeChosen}
          useRange={(x) => this.setState({ rangeChosen: x })}
          materialDateCloser={() => {
            this.materialDateCloser();
          }}
          date={this.state.materialDate}
          handleChangeDate={(e) => {
            this.setState({
              materialDate: e,
              materialDateOpen: false
            });
          }}
        />
        {/*this.props.isCommunity && (
          <Community
            hydrateUser={this.props.hydrateUser}
            getUserInfo={this.props.getUserInfo}
            chooseCommunity={this.props.chooseCommunity}
            listplz={this.props.listplz}
            listplzToggle={this.props.listplzToggle}
            auth={this.props.auth}
            user={this.props.user}
            community={this.props.community}
            city={this.props.city}
          />
        )*/}
        {/* <LoadingGig loaded={this.props.loaded} />*/}
        {/*
        <Person
          isProfile={this.props.isProfile}
          chosenPost={this.props.chosenPost}
          findPost={this.props.findPost}
          getCommunity={this.props.getCommunity}
          hydrateUser={this.props.hydrateUser}
          queriedDate={this.props.queriedDate}
          loadingMessage={this.props.loadingMessage}
          pathname={this.props.pathname}
          postHeight={this.props.postHeight}
          chosenPostId={this.props.chosenPostId}
          setProfileComment={this.props.setProfileComment}
          lastComments={this.props.lastComments}
          undoComments={this.props.undoComments}
          lastPostOfComment={this.props.lastPostOfComment}
          undoPostOfComment={this.props.undoPostOfComment}
          lastPosts={this.props.lastPosts}
          lastPost={this.props.lastPost}
          undoPosts={this.props.undoPosts}
          undoPost={this.props.undoPost}
          //
          postMessage={this.props.postMessage}
          comments={this.props.comments}
          helper={this.props.helper}
          //findPost={this.props.findPost}
          profileEntities={this.props.profileEntities}
          forumPosts={this.props.forumPosts}
          openOptions={this.props.openOptions}
          openEntity={this.props.openEntity}
          clearCommunity={this.props.clearCommunity}
          selectCommunity={this.props.selectCommunity}
          parent={this.props.parent}
          droppedPost={this.props.droppedPost}
          linkDrop={this.props.linkDrop}
          dropId={this.props.dropId}
          unloadGreenBlue={this.props.unloadGreenBlue}
          loadGreenBlue={this.props.loadGreenBlue}
          getUserInfo={this.props.getUserInfo}
          issues={this.props.issues}
          dropCityIssues={this.props.dropCityIssues}
          choosecity={this.props.choosecity}
          choosecommunity={this.props.choosecommunity}
          chats={this.props.chats}
          myCommunities={this.props.myCommunities}
          auth={this.props.auth}
          user={this.props.user}
          deletedEvts={this.state.deletedEvts}
          entityNames={this.state.entityNames}
          communities={this.state.communities}
        />
        <DropPage
          dropToCheck={this.props.dropToCheck}
          chosenPost={this.props.chosenPost}
          drop={this.state.drop}
          getDrop={async (id) => {
            var drop = await this.props.findPost(id);
            drop &&
              this.setState({
                drop
              });
          }}
          auth={this.props.auth}
          findPost={this.props.findPost} //not linkDrop
          dropId={this.props.dropId}
          getCommunity={this.props.getCommunity}
          hydrateUser={this.props.hydrateUser}
          issues={this.props.issues}
          user={this.props.user}
          community={this.props.community} //
          etypeChanger={this.props.etypeChanger}
          chosenPostId={this.props.chosenPostId}
          helper={this.props.helper}
          comments={this.props.comments}
          clear={() => {
            var answer = window.confirm(
              "are you sure you want to clear this comment?"
            );
            if (answer) {
              this.setState({ comment: "" });
            }
          }}
          postHeight={this.props.postHeight}
          globeChosen={this.props.globeChosen}
          //
          droppedCommentsOpen={this.props.droppedCommentsOpen}
          getUserInfo={this.props.getUserInfo}
          //
          postMessage={this.props.postMessage}
          closeGroupFilter={this.props.closeGroupFilter}
          openGroupFilter={this.props.openGroupFilter}
        />*/}
        {/*this.props.isEntity && (
          <Made
            postHeight={this.props.postHeight}
            groupLast={this.state.groupLast}
            groupUndo={this.state.groupUndo}
            helper={this.props.helper}
            hydrateEntityFromName={this.props.hydrateEntityFromName}
            findPost={this.props.findPost}
            getCommunity={this.props.getCommunity}
            hydrateUser={this.props.hydrateUser}
            chosenEntity={this.props.chosenEntity}
            getCommunityByName={this.props.getCommunityByName}
            forumPosts={forumPosts}
            pathname={this.props.pathname}
            parent={this.props.parent}
            droppedPost={this.props.droppedPost}
            linkDrop={this.props.linkDrop}
            dropId={this.props.dropId}
            getUserInfo={this.props.getUserInfo}
            onDelete={this.props.onDelete}
            handleSave={this.props.handleSave2}
            communities={this.props.communities}
            community={this.props.community}
            url={window.location.path}
            tickets={this.props.tickets}
            eventsInitial={true}
            eventOpener={this.props.eventOpener}
            event={this.props.eventChosen}
            auth={this.props.auth}
            resetEvent={this.props.resetEvent}
            user={this.props.user}
            admin={this.state.admin}
            myEvents={this.props.myEvents}
            listDeletedEvts={this.props.listDeletedEvts}
            handleChangeDate={this.props.handleChangeDate}
            materialDate={this.props.materialDate}
            pageInitial={
              this.props.pathname.includes("page") ||
              this.props.pathname.toLowerCase().includes("newpage")
            }
            handleNewCity={this.handleNewCity}
          />
          )*/}
      </div>
    );
  }
}
//withRouter
export default withRouter(Foundation);

/*updateCommJobs = (e) => {
    let dol = [];
    e.map((ev) => {
      if (
        new Date(ev.datel).getTime() > this.props.queriedDate &&
        new Date(ev.datel).getTime() < this.props.queriedDate + this.props.range
      ) {
        dol.push(ev);
      }
      return dol;
    });
    this.setState({ jobs: dol });
  };
  updateCommEvents = (e) => {
    let dol = [];
    e.map((ev) => {
      if (
        new Date(ev.datel).getTime() > this.props.queriedDate &&
        new Date(ev.datel).getTime() < this.props.queriedDate + this.props.range
      ) {
        dol.push(ev);
      }
      return console.log(
        `filtered for events 2 weeks after ${new Date(
          this.props.queriedDate
        ).toLocaleDateString()}`
      );
    });
    const events = [...this.state.edmTrainevents, ...dol].sort((a, b) => {
      if (a.datel < b.datel) return -1;
      if (a.datel > b.datel) return 1;
      return 0;
    });
    this.setState({ events });
  };*/
