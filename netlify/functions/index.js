import chokidar from "chokidar";
import { dirname, resolve } from "path";
import fs from "fs";

import locs from "mastercard-locations";
import places from "mastercard-places";

//import Scripts from "../../../public/scripts.js";
import { fileURLToPath, parse } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

//const { minify } =require( "terser");
var production = process.env.NODE_ENV === "production";
if (!production) {
  var watcher = chokidar.watch("./app");
  //https://codeburst.io/dont-use-nodemon-there-are-better-ways-fc016b50b45e
  watcher.on("ready", () => {
    watcher.on("all", () => {
      console.log("Clearing /dist/ module cache from server");
      Object.keys(require.cache).forEach(
        (id) => /[/\\]app[/\\]/.test(id) && delete require.cache[id]
      );
    });
  });
}
//https://codesandbox.io/embed/6ez2t?codemirror=1

//var rs = null; //readStream
//unmount node process without exiting before aborting request||unpipe stream

var iMCard = null,
  mc = null;
const initializeMCard = () => {
  if (!iMCard) {
    console.log("G-FORCE:APP: initializing mastercard api");
    mc = locs.MasterCardAPI;
    iMCard = true;
    mc.init({
      sandbox: process.env.NODE_ENV !== "production",
      authentication: new mc.OAuth(
        process.env.MASTERCARD_CONSUMER_KEY,
        Buffer.from(process.env.MASTERCARD_P12_BINARY, "base64"),
        "keyalias",
        "keystorepassword"
      )
    });
  }
};
//fs.createReadStream(path).pipe = (res) => res.write(this)
//const CRS = (rs) => fs.createReadStream(rs);
const mastercardRoute = async (req, func) => {
  const RFS = (filePath) => fs.readFileSync(filePath, "utf-8"); //global.eval()?
  const cb = (error, data) => (error ? error : data); // CRS(error ? error : data);
  initializeMCard();
  let rs = null;
  if (func === "getAtms") {
    const {
      PageLength, //"5"
      PostalCode, //"11101"
      PageOffset //"0"
    } = req.query;
    rs = await locs.ATMLocations.query(
      {
        PageLength,
        PostalCode,
        PageOffset
      },
      cb
    );
  } else if (func === "getMerchants") {
    const { countryCode, latitude, longitude, distance } = req.query;
    const q = {
      pageOffset: 0,
      pageLength: 10,
      radiusSearch: "true",
      unit: "km",
      distance,
      place: {
        countryCode,
        latitude,
        longitude
      }
    };
    rs = await places.MerchantPointOfInterest.create(q, cb);
  } else if (func === "getNames") {
    rs = await places.MerchantCategoryCodes.query({}, cb);
  } else if (func === "getTypes") {
    rs = await places.MerchantIndustries.query({}, cb);
  }
  return rs && rs;
};
//headers
console.log("G-FORCE:SERVER: CALLING SERVER");
const appHead = {
  "Content-Type": "text/html", //"application/javascript; charset=utf-8",
  "Cache-Control": "public, max-age=300"
};
const errHead = { "Content-Type": "text/plain" };
const dataHead = {
  "Content-Type": "application/json"
};
const scriptData = { "Content-Type": "application/javascript" };
const quickRouter = (url) =>
  ["/deposit", "/merchant_names", "/merchant_types", "/merchants"].includes(
    url
  );
const pross = (res, req, pathname) => {
  console.log("G-FORCE:PROCESS: CREATED for " + pathname);
  process
    .on("unhandledRejection", (reason, p) => {
      console.error(
        "G-FORCE:PROCESS",
        reason,
        "Unhandled Rejection at Promise",
        p
      );
      //process.exit(1);
      req.abort && req.abort();
      //rs.unpipe();
      res.end();
      throw new Error(reason.message);
    })
    .on("uncaughtException", (err) => {
      console.error("G-FORCE:PROCESS", err, "Uncaught Exception thrown");
      //process.exit(1);
      req.abort && req.abort();
      //rs.unpipe();
      res.end();
      throw new Error(err.message);
    });
};
const Request = async (req, res) => {
  var rs = null;
  var pathname = parse(req.url).pathname.replace(/[/]+/g, "/");
  console.log("G-FORCE:SERVER: " + res.statusCode, pathname);
  pross(res, req, pathname);
  /*if (req.url !== "/" || res.statusCode === 404) {
    res.statusCode = 404;
    rs = CRS(`${req.method + " " + req.url}, 404: File Not Found`);
    res.writeHead(res.statusCode, errHead);
    //res.end(`${req.method + " " + req.url}, 404: File Not Found`);
  } else */
  if (quickRouter(pathname) && req.method === "GET") {
    res.writeHead(200, dataHead);
    if (req.url === "/deposit") {
      rs = await mastercardRoute(req, "getAtms");
    } else if (req.url === "/merchant_names") {
      rs = await mastercardRoute(req, "getNames");
    } else if (req.url === "/merchant_types") {
      rs = await mastercardRoute(req, "getTypes");
    } else if (req.url === "/merchants") {
      rs = await mastercardRoute(req, "getMerchants");
    }
    console.log("G-FORCE:SERVER: " + res.statusCode);
    return res.end(rs);
  } else {
    //*junk
    //https://stackoverflow.com/a/21866785/11711280
    const ender = (end, script) => {
      const product = script ? "<script>\n" + end + "\n</script>\n" : end;
      console.log("__"); //, product);
      res.end(product);
    };
    const header = (header, status) => {
      console.log("G-FORCE:HEADERS: ", header);
      return res.writeHead(status, header);
    };
    const finder = (path, script) => {
      const filePath = resolve(...path);
      if (fs.existsSync(filePath))
        return fs.readFile(filePath, "utf-8", (err, file) => {
          if (err) {
            console.log("G-FORCE:PATH:fs.readFileERROR ", err);
            header(errHead, 500);
            ender(err + "\n");
            return;
          }
          console.log("G-FORCE:PATH: " + filePath + " ok");
          //console.log(file);
          //RFS(filePath);
          return ender(file, script);
        });

      console.log("G-FORCE:PATH: " + filePath + " doesn't exist");
      header(errHead, 404);
      return ender("404 Not Found\n");
    };
    //html asks server unless static
    if (["/scripts.js", "/loader.js"].includes(pathname)) {
      header(scriptData, 200);
      return finder([__dirname, "..", "..", "..", "public" + pathname], true);
    } else {
      header(appHead, 200);
      return finder([__dirname, "..", "..", "..", "public", "index.html"]);
    }
  }
};
//server
/*if (!production) {
  var server = http.createServer();
  console.log("G-FORCE:SERVER: CREATED SERVER");

  server.on("error", (e) => console.log(e.message));
  server.on("request", Request); //req,res

  server.listen(0);
} else*/
exports.handler = async (event, context, callback) =>
  /*callback(null, {
      statusCode: 200,
      body: JSON.stringify({ msg: "Thanks for visiting " + name })
    });*/
  await event.replaceResponse(
    async ({ request, response }) => await Request(request, response)
  );
