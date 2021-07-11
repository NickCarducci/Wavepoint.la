var React = require("react");
var fs = require("fs");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//var createError = require("http-errors");
var express = require("express");
const { renderToString } = require("react-dom/server"); //const renderToString = require('react-dom/server').renderToString;
const { StaticRouter } = require("react-router-dom");
var serialize = require("serialize-javascript");
const { matchPath } = require("react-router");

//exported as ES6 module, so call .default
var routes = require("./routes").default;
var build = path.join(__dirname, "..", "client", "build");
var ReactClient = require(".././src/Index").default;

var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/*", (req, res, next) => {
  var thisroute =
    routes.find((route) =>
      matchPath(req.path, {
        path: route,
        exact: true
      })
    ) || {};

  let promise;

  if (thisroute.loadData) {
    promise = thisroute.loadData();
  } else {
    promise = Promise.resolve(null);
  }

  promise.then((data) => {
    const context = { data };

    const is404 = req._possible404;

    if (thisroute || is404) {
      var client = <ReactClient />;
      var lazy = renderToString(
        React.createElement(
          <StaticRouter location={req.url} context={context}>
            {client}
          </StaticRouter>
        )
      );

      var update = fs
        .readFileSync(path.join(build, "index.html"), "utf8")
        .replace('<div id="root"></div>', `<div id="root">${lazy}</div>`)
        .replace(
          "</body>",
          `<script>window.__ROUTE_DATA__ = ${serialize(data)}</script></body>`
        );

      return res.send(update);
    } else {
      req._possible404 = true;
      return next();
    }
  });
});

app.use(express.static(build));
app.use(express.static(path.join(__dirname, "..", "public", "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`😎 Server is listening on port ${PORT}`);
});
