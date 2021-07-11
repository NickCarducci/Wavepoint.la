import React, { lazy } from "react";
import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";
import { standardCatch, uriParser } from "./authdb";
const veryCloudy =
  "https://www.dl.dropboxusercontent.com/s/xu76g31mxovfc4p/ezgif.com-gif-maker%20%2816%29.gif?dl=0";
const lightClouds =
  "https://www.dl.dropboxusercontent.com/s/bxl9b9m2hvikfsu/ezgif.com-gif-maker%20%2817%29.gif?dl=0";
const lightRain =
  "https://www.dl.dropboxusercontent.com/s/8mey5b8p5mlos29/Rain%28Light%29.gif?dl=0";
const heavyRain =
  "https://www.dl.dropboxusercontent.com/s/novwfujik3ini17/ezgif.com-gif-maker%20%2818%29.gif?dl=0";
const littleSnow =
  "https://www.dl.dropboxusercontent.com/s/h5d5oty0646dmtt/Snow%28Light%29.gif?dl=0";
const bigSnow =
  "https://www.dl.dropboxusercontent.com/s/lox9e6bfhxvb0vo/ezgif.com-gif-maker%20%2819%29.gif?dl=0";
const beach =
  "https://www.dl.dropboxusercontent.com/s/h0qcoq0mxcd18ku/Beach.gif?dl=0";
const cityImg =
  "https://www.dl.dropboxusercontent.com/s/qzwsuy6txo0u4ds/CityLandscape.gif?dl=0";
const plainImg =
  "https://www.dl.dropboxusercontent.com/s/yz6bh9f1wqbk4k6/Plain%28Feather%29%20%283%29.gif?dl=0";
//react does require that keys are unique,
//and repeating features load the same src multiple times,
//unless exported as a signle variable? No! you need to suspend the image
//as a component... I don't think I can lasy load a function without props so I'll wait to do that
export class PlainImg extends React.Component {
  render() {
    return <img src={plainImg} style={this.props.style} alt="error" />;
  }
}
export class CityImg extends React.Component {
  render() {
    return <img src={cityImg} style={this.props.style} alt="error" />;
  }
}
export class Beach extends React.Component {
  render() {
    return <img src={beach} style={this.props.style} alt="error" />;
  }
}
export class BigSnow extends React.Component {
  render() {
    return <img src={bigSnow} style={this.props.style} alt="error" />;
  }
}
export class LittleSnow extends React.Component {
  render() {
    return <img src={littleSnow} style={this.props.style} alt="error" />;
  }
}
export class HeavyRain extends React.Component {
  render() {
    return <img src={heavyRain} style={this.props.style} alt="error" />;
  }
}
export class LightRain extends React.Component {
  render() {
    return <img src={lightRain} style={this.props.style} alt="error" />;
  }
}
export class LightClouds extends React.Component {
  render() {
    return <img src={lightClouds} style={this.props.style} alt="error" />;
  }
}
export class VeryCloudy extends React.Component {
  render() {
    return <img src={veryCloudy} style={this.props.style} alt="error" />;
  }
}

const lazyImageStyle = {
  position: "relative",
  transition: ".3s ease-in",
  width: "100%",
  height: "auto"
};

class PhotoDB {
  constructor() {
    PouchDB.plugin(upsert);
    this.db = new PouchDB("photoCache", {
      revs_limit: 1,
      auto_compaction: true
    });
  }
  async readPhotos() {
    let allInfo = await this.db
      .allDocs({ include_docs: true })
      .catch((err) => console.log(err.message));
    let notes = {};
    allInfo && allInfo.rows.forEach((n) => (notes[n.doc._id] = n.doc));

    return notes;
  }

  async setPhoto(c) {
    if (!c._id) {
      window.alert("pouchdb needs ._id key:value");
      //this.db.destroy();
    } else {
      var copy = {};
      const prenotes = await this.readPhotos();
      if (prenotes) {
        const photos = Object.values(prenotes);
        const found = photos.find((x) => x._id === c._id);

        if (found) {
          copy = { ...found };
          if (c.openUrl) copy.openUrl = c.openUrl;
          if (c.closedUrl) copy.closedUrl = c.closedUrl;
          /*return await this.db.putAttachment(
          "doc",
          "att.txt",
          c._attachments,
          "text/plain"
        );*/
        }
        return await this.db
          .upsert(c._id, (doc) => {
            doc = { ...c };
            return doc;
          })
          .catch((err) => console.log(err.message));
      }
    }
  }

  async deletePhoto(note) {
    return await this.db.remove(note).catch((err) => console.log(err.message));
  }
  destroyPhotoDB() {
    this.db.destroy();
  }
}
class Composition extends React.Component {
  constructor(props) {
    super(props);
    //set innerHTML is dangerous for changing img.src as is when initiated by const, var or
    //this.Closed = new Image(); *DO NOT USE except in props..* constructor allowed
    //by React, but for img.src change 're-render,' after mounting an <img/>
    //DOM in the JSX itself therin style can update with this in constructor here at top
    /**
     * new Image() hard to use except as props in React. Are there performance considerations
     * for all img.props here for changes to img object? Virtual DOM mounts & does re-render
     * (or match?) img.props.style changes, but not if field is defined outside of the sync func.
     * Second option guides us to use static props like style={{width:"100%}} so I choose
     * to export class <div style={{width:maxWidth?maxWidth:"0%"}}> wrapping {React.createElement
     * for import().then(img=>img.default) & window.URL.createObjectURL(blob), src}, as only
     * change's css calc not all props, which I only assume matters
     */
    //(1){ ()(this.Open = React.createRef() = new Image())} or (2){ just use width:"100%"
    //on the static React.createElement for one, clean mount
    /*const pr_ps = {...props, src: import() ? img.default : window.URL.createObjectURL }
      const myImage = React.createElement("img", pr_ps, null);
    //}*/
    const photoDB = new PhotoDB();
    this.state = {
      photos: [],
      photoDB
    };
    //this.Open = React.createRef();
    //this.Closed = React.createRef();
    //this.canvasOpen = React.createRef();
    //this.canvasClosed = React.createRef();
  }
  storePhoto = async (openOrCloseUrl, photoId, way) => {
    const open = way === "openUrl";
    const name = open ? "Open" : "Closed";
    const error = open ? "openError" : "closedError";
    return await fetch(openOrCloseUrl)
      .then((blob) => blob.blob())
      .then((img) => {
        if (!/image/i.test(img.type)) {
          return null; //not an image
        }
        const title = photoId.split("/")[1];

        var readFile = new FileReader();
        //readFile.onerror = (err) => console.log(err.message);
        readFile.onloadend = (reader) => {
          this.setState({ readFile }, () => {
            if (reader.target.readyState === 2) {
              const save = () => {
                const data = Buffer.from(reader.target.result).toString(
                  "base64"
                );
                const obj = {
                  _id: photoId,
                  _attachments: {
                    [`${title}${open ? "Open.png" : "Closed.png"}`]: {
                      content_type: img.type, // 'image/png',
                      data //base64
                    }
                  },
                  [way]: openOrCloseUrl
                };
                this.handleSave(obj);
              };

              var i = {};
              i.style = { ...lazyImageStyle };
              i.src = reader.target.result;
              i.id = title;
              i.className = open
                ? "eventtypesselected"
                : "eventtypesnotselected";
              i.alt = open ? `${title} is open` : `${title} is closed`;
              i.onError = (err) =>
                this.setState({
                  [error]: err.target,
                  [name]: null
                });
              this.setState(
                {
                  [name]: React.createElement("img", i, null)
                },
                () => save()
              );
            }
          });
        };
        readFile.readAsDataURL(img);
        /*var reader = new FileReader();
        reader.readAsArrayBuffer(img);
        FileReader.readAsDataURL:
        "returns base64 that contains many characters, 
        and use more memory than blob url, but removes
        from memory when you don't use it (by garbage collector)"*/
      })
      .catch((err) => {
        console.log(err.message);
        this.setState({
          [error]: err.message,
          [name]: null
        });
      });
  };
  async handleSave(note) {
    const { photoId, fallback } = this.props;
    const forr = await this.state.photoDB["setPhoto"](note);
    return forr && this.getPhotos(photoId, fallback[0], fallback[1]);
  }
  getPhotos = async (photoId, openUrl, closedUrl) =>
    await this.state.photoDB.readPhotos().then(async (prenotes) => {
      let photos = Object.values(prenotes);
      return this.setState({ photos }, () => {
        //photoId = `${props.xtype}/${uriParser(props.title)}`
        const photo = photos.find((x) => x._id === photoId);
        if (photo) {
          //var urlCreator = window.URL || window.webkitURL;
          //createObjectURL not used
          if (photo.openUrl !== openUrl) {
            this.storePhoto(openUrl, photoId, "openUrl");
          } else {
            const title = photoId.split("/")[1];
            this.state.photoDB.db
              .get(photoId, { attachments: true })
              .then((doc) => {
                const o =
                  doc._attachments && doc._attachments[title + "Open.png"];
                if (o) {
                  const blob = atob(o.data);

                  const i = {
                    src: blob,
                    style: lazyImageStyle,
                    id: title,
                    alt: title + " is open",
                    className: "eventtypesselected",
                    onError: (err) =>
                      this.setState({ openError: err.target, Open: null })
                  };
                  this.setState({ Open: React.createElement("img", i, null) });
                }
              })
              .catch((err) => console.log(err.message));
          }
          if (photo.closedUrl !== closedUrl) {
            this.storePhoto(closedUrl, photoId, "closedUrl");
          } else {
            const title = photoId.split("/")[1];
            this.state.photoDB.db
              .get(photoId, { attachments: true })
              .then((doc) => {
                const c =
                  doc._attachments && doc._attachments[title + "Closed.png"];
                if (c) {
                  const blob = atob(c.data);

                  const i = {
                    src: blob,
                    style: lazyImageStyle,
                    id: title,
                    alt: title + " is closed",
                    className: "eventtypesnotselected",
                    onError: (err) =>
                      this.setState({ closedError: err.target, Closed: null })
                  };
                  this.setState({
                    Closed: React.createElement("img", i, null)
                  });
                }
              })
              .catch((err) => console.log(err.message));
          }
        } else {
          const openOrCloseUrl = closedUrl ? closedUrl : openUrl;
          openOrCloseUrl &&
            this.storePhoto(
              openOrCloseUrl,
              photoId,
              closedUrl ? "closedUrl" : "openUrl"
            );
        }
      });
    });
  async handleDelete(id) {
    let { photos } = this.state;
    var photo = photos.find((x) => x._id === id);

    if (photo) {
      await this.state.photoDB
        .deletePhoto(photo)
        .then(() => {
          console.log("deleted photo from local " + photo._id);
          //this.getNotes();
        })
        .catch(standardCatch);
    } else {
      console.log("no photo to delete");
    }
    return true;
  }
  componentDidMount = () => {
    const { photoId, fallback } = this.props;
    this.getPhotos(photoId, fallback[0], fallback[1]);
    //dropbox only permits blob & req bearer 12000+ day 4-5mb photo
  };
  componentWillUnmount = () => {
    if (this.state.readFile && this.state.readFile.readyState !== 2)
      this.state.readFile.abort();
  };
  render() {
    const { Open, Closed, openError, closedError } = this.state;
    const { fallback, tileType, maxWidth, title, photoId } = this.props;
    const open = tileType === title;
    return (
      <div style={{ width: "100%", position: "relative" }}>
        {/*<canvas ref={this.canvasOpen} />
        <canvas ref={this.canvasClosed} />*/}
        <div
          style={{
            ...lazyImageStyle,
            width: open ? maxWidth : "0%"
          }}
        >
          {Open ? (
            Open
          ) : openError ? (
            <div style={{ width: "100%", position: "relative" }}>
              {open && (
                <button
                  onClick={() => {
                    this.storePhoto(fallback[0], photoId, "openUrl", true);
                  }}
                >
                  restore open pouch
                </button>
              )}
              <div style={{ width: "100%", position: "relative" }}>
                <img
                  //ref={this.Open}
                  alt={title + " is open"}
                  className="eventtypesselected"
                  id={title}
                  src={fallback[0]}
                  style={lazyImageStyle}
                />
              </div>
            </div>
          ) : (
            open && <div className="loader" />
          )}
        </div>
        <div
          style={{
            ...lazyImageStyle,
            width: !open ? maxWidth : "0%"
          }}
        >
          {Closed ? (
            Closed
          ) : closedError ? (
            <div style={{ width: "100%", position: "relative" }}>
              {!open && (
                <button
                  onClick={() => {
                    this.storePhoto(fallback[1], photoId, "closedUrl", true);
                  }}
                >
                  restore closed pouch
                </button>
              )}
              <div style={{ width: "100%", position: "relative" }}>
                <img
                  //ref={this.Closed}
                  alt={title + " is closed"}
                  className="eventtypesnotselected"
                  id={title}
                  src={fallback[1]}
                  style={lazyImageStyle}
                />
              </div>
            </div>
          ) : (
            !open && <div className="loader" />
          )}
        </div>
      </div>
    );
  }
}
//why do this? 1. for development and build-deployment
//to check if photos are there and run either way, same code.
//2*. class is exported once, function is malleable exogenously?
//browser HTTP remembers each src url anyway*
//3~. can also use PouchDB to localstore blobs and URL.createObjectURL
//if plan wasn't to have in repository... expensive for github tho
//update when~
class Lazy extends React.Component {
  //React.lazy deconstructed
  constructor(props) {
    super(props);
    this.state = {
      photoId: `${props.xtype}/${uriParser(props.title)}`,
      closedError: 0,
      openError: 0
    };
    this.Open = React.createRef();
    this.Closed = React.createRef(); //for onerror={}
  }
  importer = async (uri) =>
    await new Promise((resolve) =>
      //no second ,reject neccesary since 'import' is a promise that is
      //synchronous? loading the default-'src' into <img/> happens next
      lazy(
        import(uri)
          .then((res) => resolve(JSON.stringify(res)))
          .catch((res) => resolve(JSON.stringify(res)))
      )
    );
  componentDidUpdate = (prevProps) => {
    if (this.props.tileChosen !== prevProps.tileChosen) {
      if (!this.state.required) this.mount(this.props.tileChosen);
    }
  };
  mount = (tileChosen) => {
    const collection =
      this.props.xtype === "etype"
        ? "event"
        : this.props.xtype === "ctype"
        ? "club"
        : this.props.xtype === "stype"
        ? "shop"
        : this.props.xtype === "rtype"
        ? "restaurant"
        : this.props.xtype === "servtype"
        ? "service"
        : this.props.xtype === "jtype"
        ? "job"
        : this.props.xtype === "htype"
        ? "housing"
        : this.props.xtype === "ptype"
        ? "page"
        : this.props.xtype === "vtype"
        ? "venue"
        : "";

    if (!tileChosen || collection === tileChosen)
      this.setState({ required: true });
  };
  componentDidMount = async () => {
    var urlCreator = window.URL || window.webkitURL;
    const { title } = this.props;
    const { photoId } = this.state;
    const prefix = `.././Photos/${photoId}`;
    const openSrc = await this.importer(prefix + `Open.png`);
    const closedSrc = await this.importer(prefix + `Closed.png`);
    const open = openSrc && JSON.parse(openSrc);
    if (open) {
      if (open.default) {
        /*photo unsuccessful, ${open.default === "" ? `no photo src at path 
        :"failed/corrupt download from "}${prefix}Closed.png`)*/
        const i = {
          //ref: this.Open,
          src: urlCreator.createObjectURL(open.default), //JSON.parse(openSrc);
          className: "eventtypesselected",
          style: lazyImageStyle,
          id: title,
          alt: title + " is open",
          onError: () => {
            const { openError } = this.state;
            if (openError < 3) {
              this.setState({ openError: openError + 1 });
            } else {
              this.setState({ openError: 0 });
            }
          }
        };
        this.setState({ Open: React.createElement("img", i, null) });
      } //else this.setState({ openError: open.name });
    }
    const closed = closedSrc && JSON.parse(closedSrc); //import() promise returns
    if (closed) {
      if (closed.default) {
        //promises return string, must JSON.parse for Object constructor
        const closed = JSON.parse(closedSrc);
        const i = {
          //ref: this.Closed,
          src: urlCreator.createObjectURL(closed.default), //{default:""} src
          className: "eventtypesnotselected",
          style: lazyImageStyle,
          id: title,
          alt: title + " is closed",
          onError: () => {
            const { closedError } = this.state;
            if (closedError < 3) {
              this.setState({ closedError: closedError + 1 });
            } else {
              this.setState({ closedError: 0 });
            }
          }
        };
        this.setState({ Closed: React.createElement("img", i, null) });
      } //else this.setState({ closedError: closed.name });
    }
    this.mount(this.props.tileChosen);
  };
  componentWillUnmount = () => {
    this.setState({ required: false });
  };
  render() {
    const { fallback, tileType, maxWidth, title } = this.props;
    const {
      openError,
      closedError,
      Open,
      Closed,
      photoId,
      required
    } = this.state;
    //lazy requires dynamic-props outside of img.width:'100%'
    //(openError || closedError) && console.log("bypassed");
    const open = tileType === title;
    return (
      <div
        key={title}
        id={title}
        style={{
          textAlign: "right",
          color: "white",
          width: maxWidth,
          position: "relative",
          backgroundImage: "linear-gradient(rgb(0,0,20),rgb(20,20,80))"
        }}
      >
        {title}
        <div
          id={title}
          style={{
            width: "100%",
            position: "relative"
          }}
        >
          {openError !== 0 || closedError !== 0 ? (
            //for import() path
            <div style={{ width: "100%", position: "relative" }}>
              <div style={{ width: open ? "100%" : "0%", overflow: "hidden" }}>
                {Open ? Open : <div className="loader" />}
              </div>
              <div style={{ width: !open ? "100%" : "0%", overflow: "hidden" }}>
                {Closed ? Closed : <div className="loader" />}
              </div>
            </div>
          ) : (
            required && (
              //if either fails || loadingError, just use
              //dropboxusercontent url & img.alt error handler

              <Composition
                photoId={photoId}
                fallback={fallback} // openSrc, closeSrc
                tileType={tileType} //dynamic-props
                title={title}
                maxWidth={maxWidth ? maxWidth : "100%"} //on window 'resize'
              />
            )
          )}
        </div>
      </div>
    );
  }
}

export class HairNailsTanImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="hair, nails & tan"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/n7x1nni29yfn3nh/Services_Grooming.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/iis3mgzii9ddtc7/Services_Grooming%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class CateringImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="catering"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/btl5bey67ytji3e/Services_Catering.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/lctdnw37lqi48ts/Services_Catering%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class LawyerImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="lawyer"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/0twhgd2akmefuhv/Services_lawyer.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/1qd26hq2yeps313/Services_Lawyer%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class MechanicImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="mechanic"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/ockeu56zkt36wpf/Shop_Mechanic%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/tegeovdwjjxl71p/Shop_Mechanic%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class InternistImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="internist"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/bvw5ov3syh08sek/Services_internist.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/d02d8y54vponfao/Services_Internist%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class OrthopedistImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="orthopedist"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/5of9fespfso2uhk/Services_orthopedist.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/yo08zymmuvw9dvc/Services_Orthopedist%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class OrthodontistImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="orthodontist"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/17xdee095gf16z9/Services_orthodontist.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/wocfxbwfgk0spfe/Services_Orthodontist%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class DentistImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="dentist"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/yycynkjh2esm42j/Services_dentist.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/k8x1ljs2z4xnzs6/Services_Dentist%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class GraphicsAnimationImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="graphics & animation"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/plnce0a7d6ory0y/Services_Animation.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/xpaxa4etskx7dna/Services_Animation%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class PhotographyImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="photography"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/7dki02boxhmfhb8/Services_Photography.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/u2l61wae68pnttt/Services_Photography%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class VideoProductionImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="video production"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/1pk4ssdax7wq87s/Services_VideoProd.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/5sg0ah7798mc6jd/Services_VideoProd%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class CodeImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="code"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/79r9y3tb3vo0tku/Services_code.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/4a7fbgrzgi8g3z3/Services_Code%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class ArchitectureImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="architecture"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/4of25ezap14eqn8/Services_Architecture.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/msabwkm6vu4w2b8/Services_Architecture%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class InteriorDesignImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="interior design"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/icdgqnngkhxnv79/Services_InteriorDes.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/c824lca8qw7vykn/Services_InteriorDes%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class LandscapingImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="landscaping"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/uu0yvz3kvc6bm3u/Services_Landscaping.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/vmo4uyr6k827vgh/Services_Landscaping%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class FramingImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="framing"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/2jx1dmzrbj0c8z5/Services_Framing.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ex4m2m4ipw8akbh/Services_Framing%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class HVACImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="HVAC"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/hcdkgl6mfdnk0ul/Services_HVAC.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/t8cl3glx6rzvibs/Services_HVAC%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class PaintingImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="painting"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/coco1nxnk60mly5/Services_Painting.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/6zzvl8c9o8vlbdj/Services_Painting%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class PlumbingImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="plumbing"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/x0ubcl2m5hj8bo1/Services_Plumbing.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ggf0lu16oqvz8fa/Services_Plumbing%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ElectricianImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="electrician"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/8gws41giprbichz/Services_Electrician.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/lvjiaf7mykj6th7/Services_Electrician%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class AccountingImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="accounting"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/nyef5qnm0pbw5rg/Services_Accounting.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/g8ucu8e8rpdv4il/Services_Accounting%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class CarpentryImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="carpentry"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/fujaobpjpd3pr85/Services_Carpentry.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/h4zh8pa2u30z5gb/Services_Carpentry%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class WeldingImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="welding"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/bxg3wl2zymu901e/Services_Welding.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ml4s66u1jeivzbk/Services_Welding%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class MasonryImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="masonry"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/p1skewcs5trjwro/Services_Masonry.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/8qo7499u4p992fi/Services_Masonry%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class MusicianImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="musician"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/k6ez54ggh0cv9ym/SERVICES_Musician.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/qaekx8kxsqvdcrp/SERVICES_musician%20%28closed%29%20%282%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ActorImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="actor"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/tugjy7ky1hdvk4j/SERVICES_Acting.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/kmdc9z6odf6xf26/SERVICES_acting%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class WriterImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="writer"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/eyq48dj3r5rp0tk/SERVICES_Writer.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/rnh629xrdu99n2p/SERVICES_writer%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class SingerImg extends React.Component {
  render() {
    const { servtype, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"servtype"}
        tileChosen={tileChosen}
        tileType={servtype}
        //maxWidth={maxWidth}
        title="singer"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/5mpnx9rhkm3fm8s/SERVICES_Singer.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/fzewrha9ky0yyih/SERVICES_singer%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class EventImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"tile"}
        tileType={tileChosen}
        maxWidth={maxWidth}
        title="event"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/9ik0gzhls9x68lm/EVENTTYPES_Events%20%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/z975s62yciuy356/TILES_Events%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ClubImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"tile"}
        tileType={tileChosen}
        maxWidth={maxWidth}
        title="club"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/kiql31g6gv2agft/CENTER%20PLUS_Club.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/vrm3lvir0t49kt2/TILES_Clubs%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ShopImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"tile"}
        tileType={tileChosen}
        maxWidth={maxWidth}
        title="shop"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/3t3b223xt8rt0zt/EVENTTYPES_Shops.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/yj95k4p9e1j6koq/EVENTTYPES_Shops%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class RestaurantImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"tile"}
        tileType={tileChosen}
        maxWidth={maxWidth}
        title="restaurant"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ServiceImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"tile"}
        tileType={tileChosen}
        maxWidth={maxWidth}
        title="service"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/0jjuyb2cn56zvsh/EVENTTYPES_Services.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/r7sta0v63jpx4t6/EVENTTYPES_Services%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class JobImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"tile"}
        tileType={tileChosen}
        maxWidth={maxWidth}
        title="job"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/0tusz7lqrbnzvlx/EVENTTYPES_Jobs.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/uslvfnp7xqmh2y8/TILES_Jobs%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class HousingImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"tile"}
        tileType={tileChosen}
        maxWidth={maxWidth}
        title="housing"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/rdx2xb7xczvomd1/EVENTTYPES_Housing.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/jamhnuor263bx8z/TILES_Housing%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class PageImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"tile"}
        tileType={tileChosen}
        maxWidth={maxWidth}
        title="page"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/vtkuoonyq8hpz4w/TILES_Pages.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ne451miwhmgpvr7/TILES_Pages%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class VenueImg extends React.Component {
  render() {
    const { maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"tile"}
        tileType={tileChosen}
        maxWidth={maxWidth}
        title="venue"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/h9ebdl3j1l94xkt/TILES_Venues.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/1uw496aac2deg0c/TILES_Venues%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export const eventTypes = [
  "food",
  "business",
  "tech",
  "recreation",
  "education",
  "arts",
  "sport",
  "concert",
  "cause",
  "party & clubbing",
  "day party festival"
];
export const clubTypes = [
  "sport",
  "networking",
  "technology",
  "engineering",
  "science",
  "literature",
  "recreation",
  "arts",
  "medicine",
  "music",
  "non-profit",
  "politics"
];
export const shopTypes = [
  "clothing",
  "technology",
  "movies",
  "trinkets",
  "home furnishing",
  "tools",
  "auto",
  "grocery",
  "music",
  "appliances"
];
export const restaurantTypes = [
  "chinese",
  "italian",
  "mexican",
  "indian",
  "homestyle & fried",
  "burgers & sandwich",
  "noodles",
  "vegan & health",
  "seafood",
  "breakfast & lunch"
];
export const serviceTypes = [
  "hair, nails & tan",
  "catering",
  "lawyer",
  "mechanic"
];
export const jobTypes = [
  "tech",
  "hospitality",
  "office",
  "auto",
  "home",
  "shipping",
  "education",
  "arts",
  "medical",
  "music",
  "non-profit",
  "business"
];
export const housingTypes = [
  "stay",
  "rent",
  "+5m",
  "3-5m",
  "1-3m",
  "800-1m",
  "500-800",
  "100-500",
  "50-100",
  "<50"
];
export const pageTypes = [
  "pod",
  "radio",
  "television news",
  "series",
  "movies"
];
export const venueTypes = [
  "in theatre",
  "rewind & drive-in",
  "playwright",
  "music",
  "sport",
  "museum"
];

export class InTheatreImg extends React.Component {
  render() {
    const { vtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"vtype"}
        tileChosen={tileChosen}
        tileType={vtype}
        maxWidth={maxWidth}
        title="in theatre"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/fzoaumctv583rts/TILES_Theatre%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/5hjmhxfz6yxb7gd/TILES_Theatres%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class RewindAndDriveInImg extends React.Component {
  render() {
    const { vtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"vtype"}
        tileChosen={tileChosen}
        tileType={vtype}
        maxWidth={maxWidth}
        title="rewind & drive-in"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/9ukvuu36bk7ywnb/THEATRES_DriveIn.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/75t8s16wwn1iq9t/THEATRES_DriveIn%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class PlaywrightImg extends React.Component {
  render() {
    const { vtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"vtype"}
        tileChosen={tileChosen}
        tileType={vtype}
        maxWidth={maxWidth}
        title="playwright"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/7ipwlksr4ut2jkb/THEATRES_Playwright.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/58xa9kg39z86431/THEATRES_Playwright%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class MusicImg extends React.Component {
  render() {
    const { vtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"vtype"}
        tileChosen={tileChosen}
        tileType={vtype}
        maxWidth={maxWidth}
        title="music"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/co18lv281mi0mgf/JOBTYPES_Music.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/htwdf87i9si37o7/JOBTYPES_Music%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class SportImg extends React.Component {
  render() {
    const { vtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"vtype"}
        tileChosen={tileChosen}
        tileType={vtype}
        maxWidth={maxWidth}
        title="sport"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/i02rrtpdd65t0fe/EVENTTYPES_Sports.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/psg1ctymtc17gm3/EVENTTYPES_Sports%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class MuseumImg extends React.Component {
  render() {
    const { vtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"vtype"}
        tileChosen={tileChosen}
        tileType={vtype}
        maxWidth={maxWidth}
        title="museum"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/il1urm466sqrxty/THEATRES_Museum.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/2rxj6x3399xllfz/THEATRES_museum%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class PodImg extends React.Component {
  render() {
    const { ptype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ptype"}
        tileChosen={tileChosen}
        tileType={ptype}
        maxWidth={maxWidth}
        title="pod"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/ypq72mrjbtw238z/Page_Pod.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/6k48msdllj75l3v/Page_pod%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class RadioImg extends React.Component {
  render() {
    const { ptype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ptype"}
        tileChosen={tileChosen}
        tileType={ptype}
        maxWidth={maxWidth}
        title="radio"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/x8oujtbwjyx19tk/Page_Radio.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/0u7h9ca2i3p0dth/Page_radio%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class TelevisionImg extends React.Component {
  render() {
    const { ptype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ptype"}
        tileChosen={tileChosen}
        tileType={ptype}
        maxWidth={maxWidth}
        title="television news"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/5w75yp9j9ccmt2w/Page_Television%20News.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/udcrjmqwxmalvut/Page_television%20news%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class SeriesImg extends React.Component {
  render() {
    const { ptype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ptype"}
        tileChosen={tileChosen}
        tileType={ptype}
        maxWidth={maxWidth}
        title="series"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/0nwnkh00gtzjog4/Page_Series.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/bawri60wtgmh3ps/Page_series%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class MoviesImg extends React.Component {
  render() {
    const { ptype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ptype"}
        tileChosen={tileChosen}
        tileType={ptype}
        maxWidth={maxWidth}
        title="movies"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/hgrty3yy3h0g1x3/Page_Movies.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/tvfs96ne2g15xbv/Page_movies%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class StayImg extends React.Component {
  render() {
    const { htype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"htype"}
        tileChosen={tileChosen}
        tileType={htype}
        maxWidth={maxWidth}
        title="stay"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/nuwxyp8nkrdsijl/Home_Stay.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/8n97k78v6aqshzc/Home_stay%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class RentImg extends React.Component {
  render() {
    const { htype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"htype"}
        tileChosen={tileChosen}
        tileType={htype}
        maxWidth={maxWidth}
        title="rent"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/7d62tahiopmss5p/Home_Rent.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/a4x5gom04wy3n8s/Home_rent%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class Above5millionImg extends React.Component {
  render() {
    const { htype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"htype"}
        tileChosen={tileChosen}
        tileType={htype}
        maxWidth={maxWidth}
        title="+5m"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/diftejtelzh3c7w/Home_%2B5m.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/wxe6ahrpysihrk1/Home_%2B5m%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ThreeToFiveMilImg extends React.Component {
  render() {
    const { htype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"htype"}
        tileChosen={tileChosen}
        tileType={htype}
        maxWidth={maxWidth}
        title="3-5m"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/scvdezymmfegp1n/Home_3-5m.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/8ey1b4eh0omgph1/Home_3-5m%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class OneToThreeMilImg extends React.Component {
  render() {
    const { htype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"htype"}
        tileChosen={tileChosen}
        tileType={htype}
        maxWidth={maxWidth}
        title="1-3m"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/4mky5u3z1h6cn45/Home_1-3m%20%282%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/yk3fyqg82eycyzc/Home_1-3m%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class EightHundredImg extends React.Component {
  render() {
    const { htype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"htype"}
        tileChosen={tileChosen}
        tileType={htype}
        maxWidth={maxWidth}
        title="800-1m"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/omleodmo45zmgq0/Home_800-1m.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/1prec2tlwejquca/Home_800-1m%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class FiveToEightHunImg extends React.Component {
  render() {
    const { htype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"htype"}
        tileChosen={tileChosen}
        tileType={htype}
        maxWidth={maxWidth}
        title="500-800"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/q8qi978x1o1r28r/Home_500-800%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/tfx99kkyvzj2ntd/Home_500-800%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class OneToFiveHunImg extends React.Component {
  render() {
    const { htype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"htype"}
        tileChosen={tileChosen}
        tileType={htype}
        maxWidth={maxWidth}
        title="100-500"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/bsasoc30veriwkr/Home_100-500.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/1aoejilhz139yzn/Home_100-500%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class FiftyToOneHunImg extends React.Component {
  render() {
    const { htype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"htype"}
        tileChosen={tileChosen}
        tileType={htype}
        maxWidth={maxWidth}
        title="50-100"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/z6wwi960wjrjqog/Home_50-100.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/m2a7fa9pnv22lhh/Home_50-100%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class LessThanFiftyImg extends React.Component {
  render() {
    const { htype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"htype"}
        tileChosen={tileChosen}
        tileType={htype}
        maxWidth={maxWidth}
        title="<50"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/uo7ndzrhnm29v3f/Home__50.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/39thywimii0f9he/Home__50%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class TechImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="tech"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/edom45hrd0d95pl/EVENTTYPES_Tech.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/nhd0inv9277p98x/EVENTTYPES_Tech%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class HospitalityImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="hospitality"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/ktra3dmnyuhojxi/EVENTTYPES_Hospitality.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/mmubaqhqqoi5dw5/JOBTYPES_Hospitality%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class OfficeImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="office"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/tjzlca16dxqr2ny/JOBTYPES_Office.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/abxdu6w3mqyi1oq/JOBTYPES_Office%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class AutoImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="auto"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/b6c0x11l4emtj9n/JOBTYPES_Auto%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/uj7uc1tqwo0jsld/JOBTYPES_Auto%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class HomeImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="home"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/4498iuzqefwxhk8/JOBTYPES_Home.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/9z6jua7duld622y/JOBTYPES_Home%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class ShippingImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="shipping"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/oaa94zj64ag2q9u/JOBTYPES_Shipping%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/9i2q3gtss8cr96c/JOBTYPES_Shipping%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class EducationImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="education"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/rv27bbh015odcwh/EVENTTYPES_Educational.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ux354kb91c151e6/EVENTTYPES_Educational%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class ArtsImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="arts"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/cv16smvhj1fzule/EVENTTYPES_Arts.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/gtij6rjt9lo1cxn/EVENTTYPES_Arts%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class MedicalImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="medical"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/x3y63skfcjznhi9/JOBTYPES_Medical.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/a3xpjlfd8a4kjnh/JOBTYPES_Medical%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class MusicJobImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="music"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/co18lv281mi0mgf/JOBTYPES_Music.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/htwdf87i9si37o7/JOBTYPES_Music%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class NonProfitImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="non-profit"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/bfgivqwg9nmpyni/JOBTYPES_NonProfit.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/yhfuorswx08zdkc/JOBTYPES_Nonprofit%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class BusinessImg extends React.Component {
  render() {
    const { jtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"jtype"}
        tileChosen={tileChosen}
        tileType={jtype}
        maxWidth={maxWidth}
        title="business"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/9gjpuf6b2s2sbuv/Copy%20of%20EVENTTYPES_Business.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/5mcj3n7ktcm6am3/EVENTTYPES_Business%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class ChineseImg extends React.Component {
  render() {
    const { rtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"rtype"}
        tileChosen={tileChosen}
        tileType={rtype}
        maxWidth={maxWidth}
        title="chinese"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/qo55pj6fceccbpt/Restaurants_chinese.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/2rwcfhtspkdwkqb/Restaurants_Chinese%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ItalianImg extends React.Component {
  render() {
    const { rtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"rtype"}
        tileChosen={tileChosen}
        tileType={rtype}
        maxWidth={maxWidth}
        title="italian"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/djo0vlzkdr6bypg/Restaurants_italian.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/isq40y1smr70thd/Restaurants_Italian%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class MexicanImg extends React.Component {
  render() {
    const { rtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"rtype"}
        tileChosen={tileChosen}
        tileType={rtype}
        maxWidth={maxWidth}
        title="mexican"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/jdm6kl3l3wo74r9/Restaurants_mexican.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/vxzoaq7n2m53qlo/Restaurants_Mexican%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class IndianImg extends React.Component {
  render() {
    const { rtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"rtype"}
        tileChosen={tileChosen}
        tileType={rtype}
        maxWidth={maxWidth}
        title="indian"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/jbe7jcwo5rmi7eb/Restaurants_indian.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/whw9m4wz21c2box/Restaurants_Indian%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class HomeStyleImg extends React.Component {
  render() {
    const { rtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"rtype"}
        tileChosen={tileChosen}
        tileType={rtype}
        maxWidth={maxWidth}
        title="homestyle & fried"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/q7djmpv7gio055g/Restaurants_homestyle%20.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/mf7nzlj8y4f05qy/Restaurants_Homestyle%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class BurgerAndSandwichImg extends React.Component {
  render() {
    const { rtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"rtype"}
        tileChosen={tileChosen}
        tileType={rtype}
        maxWidth={maxWidth}
        title="burger & sandwich"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/ndbfyeolgrsvgi8/Restaurants_burgersSand.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/zm4kcp530cmyoy9/Restaurants_BurgersSand%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class NoodlesImg extends React.Component {
  render() {
    const { rtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"rtype"}
        tileChosen={tileChosen}
        tileType={rtype}
        maxWidth={maxWidth}
        title="noodles"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/9c3sk2ji5uw1egb/Restaurants_noodles.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/quvahl7cy0523p9/Restaurants_Noodles%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class VeganOrHealthImg extends React.Component {
  render() {
    const { rtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"rtype"}
        tileChosen={tileChosen}
        tileType={rtype}
        maxWidth={maxWidth}
        title="vegan & health"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/doxavaipyloryal/Restaurants_vegan%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/sygqcgjtdy9b26n/Restaurants_Vegan%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class SeafoodImg extends React.Component {
  render() {
    const { rtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"rtype"}
        tileChosen={tileChosen}
        tileType={rtype}
        maxWidth={maxWidth}
        title="seafood"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/iughdp3v38ns39u/Restaurants_seafood.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/7l7h2we28f5t0k5/Restaurants_Seafood%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class BreakfastOrLunchImg extends React.Component {
  render() {
    const { rtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"rtype"}
        tileChosen={tileChosen}
        tileType={rtype}
        maxWidth={maxWidth}
        title="breakfast & lunch"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/exnvc1p9t2zclmr/Restaurants_brunch.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/vuzt1ihvpbe3e63/Restaurants_Brunch%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class ClothingImg extends React.Component {
  render() {
    const { stype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"stype"}
        tileChosen={tileChosen}
        tileType={stype}
        maxWidth={maxWidth}
        title="clothing"
        fallback={[
          //help fix new
          "https://www.dl.dropboxusercontent.com/s/499sb386845r6lh/Shop_Clothing.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/d3lffcpriyq4be2/Copy%20of%20Shop_Trinkets%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class TechnologyImg extends React.Component {
  render() {
    const { stype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"stype"}
        tileChosen={tileChosen}
        tileType={stype}
        maxWidth={maxWidth}
        title="technology"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/98l76mpbg2bejg8/Shop_Tech.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/l2kjjqanvpl53jc/Shop_Tech%20%28closed%29%20%282%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class MoviesShopImg extends React.Component {
  render() {
    const { stype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"stype"}
        tileChosen={tileChosen}
        tileType={stype}
        maxWidth={maxWidth}
        title="movies"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/98q9s1oscoxpfzj/Shop_Movies%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/nb1vm7lw05z4d1q/Shop_Movies%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class TrinketsImg extends React.Component {
  render() {
    const { stype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"stype"}
        tileChosen={tileChosen}
        tileType={stype}
        maxWidth={maxWidth}
        title="trinkets"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/3rodgol634pu1tv/Shop_Trinkets.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/qpfsgr13wuxr54r/Shop_Trinkets%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class HomeFurnishingImg extends React.Component {
  render() {
    const { stype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"stype"}
        tileChosen={tileChosen}
        tileType={stype}
        maxWidth={maxWidth}
        title="home furnishing"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/dpz63l7gv7s3d6m/Shop_Furnishings.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/sr9aiejo3gms3br/Shop_Furnishings%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ToolsImg extends React.Component {
  render() {
    const { stype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"stype"}
        tileChosen={tileChosen}
        tileType={stype}
        maxWidth={maxWidth}
        title="tools"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/qysayn6mkh7skh0/Shop_Tools.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/g6r6daqvl1ogwlz/Shop_Tools%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class AutoShopImg extends React.Component {
  render() {
    const { stype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"stype"}
        tileChosen={tileChosen}
        tileType={stype}
        maxWidth={maxWidth}
        title="auto"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/on4zaozfpjmtwf0/Shop_Auto.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ymn2h79wxeipt0k/Shop_Auto%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class GroceryImg extends React.Component {
  render() {
    const { stype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"stype"}
        tileChosen={tileChosen}
        tileType={stype}
        maxWidth={maxWidth}
        title="grocery"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/jgou00oxsstc6uz/Shop_Grocery.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ygj1jgba04i9q7g/Shop_Grocery%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class MusicShopImg extends React.Component {
  render() {
    const { stype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"stype"}
        tileChosen={tileChosen}
        tileType={stype}
        maxWidth={maxWidth}
        title="music"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/co18lv281mi0mgf/JOBTYPES_Music.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/htwdf87i9si37o7/JOBTYPES_Music%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class AppliancesImg extends React.Component {
  render() {
    const { stype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"stype"}
        tileChosen={tileChosen}
        tileType={stype}
        maxWidth={maxWidth}
        title="appliances"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/sokzc613wci8ynx/Shop_Appliance.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/yxjzfdner06aago/Shop_Appliance%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class SportClubImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="sport"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/yj6vf1qt98pez87/EVENTTYPES_Sports%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/t10tus4h6y0cmls/EVENTTYPES_Sports%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class NetworkingImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="networking"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/mobc6ainpq8p3ug/EVENTTYPES_Business%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/i75t7vx8zq6i12a/EVENTTYPES_Business%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class TechnologyClubImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="technology"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/lnmkoax9r5ka7t6/EVENTTYPES_Tech%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/cxz7n8sbsngycub/EVENTTYPES_Tech%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class EngineeringImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="engineering"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/w1smbgsn4o6pfbe/CLUBTYPES_Engineering.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/y9nauqg3bh74yr0/CLUBTYPES_Engineering%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ScienceImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="science"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/2wg5ihw7t0gh7fg/CLUBTYPES_Science.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/3wjccgen8yhqioz/CLUBTYPES_Science%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class LiteratureImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="literature"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/4linrqervqomnsx/CLUBTYPES_Literature.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/8oiubhytzy8mf11/CLUBTYPES_Literature%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class RecreationImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="recreation"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/t1k7iwlc5an27lw/EVENTTYPES_Recreational%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/6e89puq3qf9gkyn/EVENTTYPES_Recreational%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ArtsClubImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="arts"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/cv16smvhj1fzule/EVENTTYPES_Arts.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/gtij6rjt9lo1cxn/EVENTTYPES_Arts%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class MedicineImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="medicine"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/bmf4gg21nwmnh0d/CLUBTYPES_Medicine.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/6xrfdkosnvjk5ei/CLUBTYPES_Medicine%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class MusicClubImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="music"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/co18lv281mi0mgf/JOBTYPES_Music.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/htwdf87i9si37o7/JOBTYPES_Music%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class NonProfitClubImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="non-profit"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/bfgivqwg9nmpyni/JOBTYPES_NonProfit.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/yhfuorswx08zdkc/JOBTYPES_Nonprofit%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class PoliticsImg extends React.Component {
  render() {
    const { ctype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"ctype"}
        tileChosen={tileChosen}
        tileType={ctype}
        maxWidth={maxWidth}
        title="politics"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/fph372menxc3w06/CLUBTYPES_Politics.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/0xx0a7aog77624p/CLUBTYPES_Politics%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class NewPostImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="new"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/zhyxqqhboxu9mxf/ForumFilter_New.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/25830k7pg9p9r9j/ForumFILTER_New%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class LessonImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="lesson"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/8l4rp5jo7hogi7n/FORUM_Lessons.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ec48bpko5dvaffg/FORUM_Lessons%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ShowImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="show"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/ywl85onmrjggpcg/FORUM_Shows%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/jfr1sk3av6mcxbd/FORUM_Shows%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class GameImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="game"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/740qp9i1aeqoqqv/FORUM_Games.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/q96i4pcout6fs9c/FORUM_Games%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

/*commtype === "active" ? (
  <img
    className="eventtypesselected"
    //onClick={this.tileChoose2}
    src="https://www.dl.dropboxusercontent.com/s/aozn4kxsfwp3o45/ForumFilter_Active.png?dl=0"
    alt="error"
    id="active"
  />
) : (
  <img
    className="eventtypesnotselected"
    //onClick={this.tileChoose2}
    src="https://www.dl.dropboxusercontent.com/s/ckz8m807xbbyndn/ForumFILTER_Active%20%28closed%29.png?dl=0"
    alt="error"
    id="active"
  />
)}
{commtype === "saved" ? (
  <img
    className="eventtypesselected"
    //onClick={this.tileChoose3}
    src="https://www.dl.dropboxusercontent.com/s/obzgj0md6578czm/ForumFilter_Saved.png?dl=0"
    alt="error"
    id="saved"
  />
) : (
  <img
    className="eventtypesnotselected"
    //onClick={this.tileChoose3}
    src="https://www.dl.dropboxusercontent.com/s/w0rf0ufxqef4x07/ForumFILTER_Saved%20%28closed%29%20%281%29.png?dl=0"
    alt="error"
    id="saved"
  />
)*/
//forum
export class NewCommPostImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="new"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/zhyxqqhboxu9mxf/ForumFilter_New.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/25830k7pg9p9r9j/ForumFILTER_New%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
/*commtype === "active" ? (
  <img
    className="eventtypesselected"
    src="https://www.dl.dropboxusercontent.com/s/aozn4kxsfwp3o45/ForumFilter_Active.png?dl=0"
    alt="error"
    id="active"
  />
) : (
  <img
    className="eventtypesnotselected"
    src="https://www.dl.dropboxusercontent.com/s/ckz8m807xbbyndn/ForumFILTER_Active%20%28closed%29.png?dl=0"
    alt="error"
    id="active"
  />
)}
{commtype === "saved" ? (
  <img
    className="eventtypesselected"
    src="https://www.dl.dropboxusercontent.com/s/obzgj0md6578czm/ForumFilter_Saved.png?dl=0"
    alt="error"
    id="saved"
  />
) : (
  <img
    className="eventtypesnotselected"
    src="https://www.dl.dropboxusercontent.com/s/w0rf0ufxqef4x07/ForumFILTER_Saved%20%28closed%29%20%281%29.png?dl=0"
    alt="error"
    id="saved"
  />
)*/
export class FormsAndPermitsImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="forms & permits"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/h2o233ymoo684zh/ForumFilter_Forms%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/s2mej1vatctb6c1/ForumFILTER_Forms%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class OrdinanceImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="ordinance"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/gd053a7518whzul/ForumFILTER_Notices%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/sd5y9k6kn2l32sk/ForumFILTER_Notices%20%28closed%29%20%282%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class BudgetProposalImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="budget & proposal"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/0te7pw11fj9vhl9/ForumFilter_Polls%20%281%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/fdk3zxnfpzq00dl/ForumFilter_Polls%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ElectionImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="election"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/my90auj0bfx38nh/ForumFILTER_Elections.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ndtfg6rpyc55d0f/ForumFILTER_Elections%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class CourtCaseImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="court case"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/ydevlvzn6hfr7bd/ForumFILTER_CourtCase.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/50f24410cu6ng01/ForumFILTER_CourtCase%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ClassImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="classes"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/z67pb6ahfptah3z/ForumFILTER_Classes.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ftevpdzn72udcmv/ForumFILTER_Classes%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class DepartmentImg extends React.Component {
  render() {
    const { commtype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"commtype"}
        tileChosen={tileChosen}
        tileType={commtype}
        maxWidth={maxWidth}
        title="department"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/e99u2x4fg2fl21q/ForumFILTER_Departments.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/sijy9a7ux1g0lac/ForumFILTER_Departments%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class FoodImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="food"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/z78oeh1t63yt21y/EVENTTYPES_Food.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/hho9wzzxj9ffsip/EVENTTYPES_Food%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class BusinessEventImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="business"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/4ybgp4auh1lhxh2/EVENTTYPES_Business.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/5mcj3n7ktcm6am3/EVENTTYPES_Business%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class TechEventImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="tech"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/edom45hrd0d95pl/EVENTTYPES_Tech.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/nhd0inv9277p98x/EVENTTYPES_Tech%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}

export class RecreationEventImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="recreation"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/9pqf8zpkdsxllrq/EVENTTYPES_Recreational.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/qpz15r5kedt0oga/EVENTTYPES_Recreational%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class EducationEventImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="education"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/rv27bbh015odcwh/EVENTTYPES_Educational.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ux354kb91c151e6/EVENTTYPES_Educational%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ArtsEventImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="arts"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/cv16smvhj1fzule/EVENTTYPES_Arts.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/gtij6rjt9lo1cxn/EVENTTYPES_Arts%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class SportsImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="sport"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/i02rrtpdd65t0fe/EVENTTYPES_Sports.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/psg1ctymtc17gm3/EVENTTYPES_Sports%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class ConcertImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="concert"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/9vcq3tiuwiqzt0k/EVENTTYPES_Concerts.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/71r5fn5nxmpzu2y/EVENTTYPES_Concerts%20%28closed%29%20%281%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class CauseImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="cause"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/e166m8dq57xcutj/EVENTTYPES_Causes.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/ezfawkuhltuux07/EVENTTYPES_Causes%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class PartyAndClubbingImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="party & clubbing"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/7lr57eh3izkujkd/EVENTTYPES_Clubbing.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/owmltm2bbmeceeq/EVENTTYPES_Clubbing%20%28closed%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
export class DayPartyFestivalImg extends React.Component {
  render() {
    const { etype, maxWidth, tileChosen } = this.props;
    return (
      <Lazy
        xtype={"etype"}
        tileChosen={tileChosen}
        tileType={etype}
        maxWidth={maxWidth}
        title="day party festival"
        fallback={[
          "https://www.dl.dropboxusercontent.com/s/7mra7xku4uowd1a/EVENTTYPES_Social_%20%284%29.png?dl=0", //openSrc
          "https://www.dl.dropboxusercontent.com/s/wa5lc899vsg6bog/EVENTTYPES_Social%20%28closed%29%20%284%29.png?dl=0" //closeSrc
        ]}
      />
    );
  }
}
