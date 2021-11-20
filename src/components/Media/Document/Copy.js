import React from "react";
//import * as jsPDF from "jspdf";
//import Toolbar from "./Toolbar";
//import Shadow from "./Shadow";
import { Link } from "react-router-dom";
/*export const handlePDF = (pages, documentText, properties) => {
  const doc = new jsPDF({
    orientation: "portait",
    unit: "in",
    format: [11, 8.5] //2×4 inches
  });
  const margins = {
    top: 40,
    bottom: 60,
    left: 40,
    width: 522
  };
  doc.fromHTML(
    <div>{documentText}</div>, // HTML string or DOM elem ref.
    margins.left, // x coord
    margins.top,
    {
      // y coord
      width: margins.width // max width of content on PDF
    },
    (dispose) => {
      // dispose: object with X, Y of the last line add to the PDF
      //          this allow the insertion of new lines after html
      doc.save("Test.pdf");
    },
    margins
  );
  pages.map((page) => {
    doc.text(page, 1, 1);
    return doc.addPage();
  });
  doc.setProperties(properties);
  doc.save(properties.title + ".pdf");
};*/

class Document extends React.Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth;
    let height = window.innerHeight;
    var state = {
      currentPage: 0,
      width,
      height,
      title: "none",
      fontInPoints: 14,
      lineHeight: 1.15,
      documentText: ""
    };
    if (props.location.state && props.location.state.parent) {
      state.documentText = props.location.state.parent.message;
    }
    this.state = state;
    this.extra = React.createRef();
    for (let i = 0; i < 40; i++) {
      this[i] = React.createRef();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
  }
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      let width = window.innerWidth; // * 0.01;
      let height = window.innerHeight; // * 0.01;
      this.setState({
        extraHeight: this.extra.current.offsetHeight,
        width,
        height
      });
    }, 200);
  };
  componentDidMount = () => {
    this.refresh();
    window.addEventListener("resize", this.refresh);
  };
  componentDidUpdate = () => {
    if (this.state.documentText !== this.state.lastdocumentText) {
      this.setState({
        lastdocumentText: this.state.documentText,
        extraHeight: this.extra.current.offsetHeight
      });
    }
  };
  render() {
    const { title, fontInPoints, lineHeight, documentText } = this.state;
    var paperSize = 11 / 8.5; // 1056 / 816 in pixel
    var marginSize = 96 / 816;

    var hoverTitle = this.state.hoverTitle && !this.state.editTitle;

    var fontSize = (fontInPoints + fontInPoints / 3) / 816;
    var fontSizeActual = (1056 * (fontInPoints + fontInPoints / 3)) / 816;

    //var lines = JSON.stringify(documentText).split(/["]$/)[1].split('"')[0];

    var sizePerPage =
      /*
       *1056 /
       */
      this.state.width * 0.8 * paperSize;
    var lineHeightPrint = fontSizeActual * lineHeight;
    var linesPerPage = Math.round(
      (sizePerPage - sizePerPage * marginSize) / lineHeightPrint
    );
    var lineCount = Math.round(this.state.extraHeight / lineHeightPrint);

    let pages = [];
    if (!isNaN(lineCount))
      for (let x = 0; x < lineCount + 1; x++)
        if (x === 0 || x % linesPerPage === 0) {
          var page = documentText.slice(0, x + 1);
          pages.push(page);
        }
    return (
      <div
        style={{
          alignItems: "center",
          flexDirection: "column",
          display: "flex",
          position: "fixed",
          top: "0px",
          width: "100%",
          bottom: "0px",
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "rgb(200,200,200)"
        }}
      >
        <div
          style={{
            top: "0px",
            position: "relative",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "min-content"
          }}
        >
          <div
            style={{
              flexDirection: "column",
              top: "0px",
              width: "100%",
              left: "0px",
              display: "flex",
              position: "relative",
              alignItems: "center",
              height: "40px"
            }}
          >
            <div
              onMouseEnter={() => this.setState({ hoverTitle: true })}
              onMouseLeave={() => this.setState({ hoverTitle: false })}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                left: "15px",
                color: hoverTitle ? "black" : "grey",
                padding: "5px 10px",
                height: fontInPoints,
                width: "min-content",
                borderBottom: `1px solid ${
                  hoverTitle ? "rgba(0,0,0,0)" : "grey"
                }`,
                transition: ".3s ease-in"
              }}
            >
              {this.state.editTitle ? (
                <div style={{ display: "flex" }}>
                  <input />
                  <div onClick={() => this.setState({ editTitle: false })}>
                    &times;
                  </div>
                </div>
              ) : (
                <div onClick={() => this.setState({ editTitle: true })}>
                  {title}
                </div>
              )}
              <div
                style={{
                  height: "1px",
                  backgroundColor: "black",
                  position: "absolute",
                  bottom: "0px",
                  width: this.state.hoverTitle ? "100%" : "0%",
                  transition: ".3s ease-in"
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                color: "black"
              }}
            >
              <select
                onChange={(x) =>
                  this.setState({ fontInPoints: Number(x.target.value) })
                }
              >
                {[14, 15, 16, 40].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <select
                onChange={(x) => this.setState({ lineHeight: x.target.value })}
              >
                {[1, 1.15, 1.5, 2].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
              <Link
                to="/"
                style={{
                  left: "100px",
                  translate: "rotate(180deg)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  right: "15px",
                  transform: "rotate(180deg)",
                  color: "black",
                  height: "7px",
                  width: "13px",
                  borderTop: "1px solid",
                  borderLeft: "1px solid",
                  borderRight: "1px solid"
                }}
              >
                <div
                  style={{ position: "absolute", top: "0px", fontSize: "12px" }}
                >
                  {"^"}
                </div>
              </Link>
            </div>
            <div
              onClick={() => {
                if (this.state.title !== "") {
                  var answer = window.confirm(
                    `ready to download "` + this.state.title + `.pdf"?`
                  );
                  if (answer) {
                    window.alert("not yet installed");
                    /* handlePDF(pages, documentText, {
                      title: this.state.title,
                      subject: "document made with thumbprint",
                      author: this.props.user.name + this.props.user.username,
                      keywords: this.state.title.includes(" ")
                        ? this.state.title.split(" ")
                        : this.state.title,
                      creator: this.props.user.name + this.props.user.username
                    });*/
                  }
                } else {
                  window.alert("please choose a PDF name");
                }
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                right: "15px",
                top: "18px",
                transform: "rotate(180deg)",
                color: "black",
                height: "7px",
                width: "13px",
                borderTop: "1px solid",
                borderLeft: "1px solid",
                borderRight: "1px solid"
              }}
            >
              <div
                style={{ position: "absolute", top: "0px", fontSize: "12px" }}
              >
                &#x2191;
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", top: "40px" }}>
            <div
              ref={this.extra}
              style={{
                whiteSpace: "pre-wrap", //prints \n
                position: "absolute",
                zIndex: "-9999",
                height: `min-content`,
                width: `calc(80vw - 90vw * ${marginSize})`,
                border: "none",
                fontSize: `calc(90vw * ${fontSize})`,
                display: "inline-block",
                backgroundColor: "red",
                overflowWrap: "break-word",
                resize: "none",
                padding: `calc(90vw * ${marginSize})`
              }}
            >
              {this.state.documentText}
            </div>
            {/*<Toolbar />*/}
            <span style={{ display: "inline-block" }}>
              {pages &&
                pages.constructor === String &&
                pages.split("") &&
                pages.split("").map((x) => {
                  return (
                    <span
                      style={{
                        opacity: "1",
                        whiteSpace: "pre-wrap", //prints \n
                        marginBottom: "20px",
                        backgroundColor: "white",
                        boxShadow: "0px 0px 3px 1px black",
                        lineHeight: lineHeight,
                        height: `calc(80vw * ${paperSize} - 90vw * ${marginSize})`,
                        width: `calc(80vw - 90vw * ${marginSize})`,
                        border: "none",
                        padding: `calc(90vw * ${marginSize})`,
                        fontSize: `calc(90vw * ${fontSize})`,
                        display: "inline-block",
                        position: "relative",
                        overflowWrap: "break-word",
                        resize: "none"
                      }}
                    >
                      {x}
                    </span>
                  );
                })}
            </span>
            {pages &&
              pages.map((lines, i) => {
                return (
                  <textarea
                    placeholder="document text"
                    key={i}
                    ref={this[i]}
                    defaultValue={lines}
                    onChange={(e) => {
                      var pageText = e.target.value;
                      var layoutText = [...pages];
                      layoutText[i] = pageText;
                      var documentText = layoutText.join();
                      this.setState({
                        documentText
                      });
                      var doo = JSON.parse(JSON.stringify(pageText));
                      var extra = doo.replace(/(?:\r\n|\r|\n)/gm, "<br>");
                      var layoutHTML = [...pages];
                      layoutHTML[i] = extra;
                      this.setState({
                        documentHTML: `<div>${layoutHTML.join()}</div>`
                      });

                      /*var lineHeightPrint = fontSizeActual * lineHeight;
                      var lineCount = Math.round(
                        this.state.extraHeight / lineHeightPrint
                      );

                      let pagesNew = [];
                      if (!isNaN(lineCount))
                        for (let x = 0; x < lineCount + 1; x++)
                          if (x === 0 || x % linesPerPage === 0) {
                            var page = documentText.slice(0, x + 1);
                            pagesNew.push(page);
                          }
                          //to focus
                      if (this.state.pageCount !== pagesNew.length) {
                        pages &&
                          this[i + 1] &&
                          this[i + 1].current &&
                          this[i + 1].current.focus();
                        this.setState({
                          pageCount: pagesNew.length
                        });
                      }*/
                    }}
                    style={{
                      opacity: "0",
                      whiteSpace: "pre-wrap", //prints \n
                      marginBottom: "20px",
                      backgroundColor: "white",
                      boxShadow: "0px 0px 3px 1px black",
                      lineHeight: lineHeight,
                      height: `calc(80vw * ${paperSize} - 90vw * ${marginSize})`,
                      width: `calc(80vw - 90vw * ${marginSize})`,
                      border: "none",
                      padding: `calc(90vw * ${marginSize})`,
                      fontSize: `calc(90vw * ${fontSize})`,
                      display: "inline-block",
                      position: "relative",
                      overflowWrap: "break-word",
                      resize: "none"
                    }}
                  />
                );
              })}
          </div>
          <br />
          <div
            onClick={() => {
              this.setState({ add: true });
              setTimeout(() => this.setState({ add: false }), 200);
            }}
            style={{
              userSelect: "none",
              boxShadow: this.state.add ? "" : "0px 5px 10px 3px rgb(20,20,20)",
              justifyContent: "center",
              alignItems: "center",
              height: `36px`,
              width: `calc(80vw - 90vw * ${marginSize})`,
              border: "none",
              padding: `0px calc(90vw * ${marginSize})}`,
              fontSize: `calc(90vw * ${fontSize})`,
              display: "flex",
              backgroundColor: "white",
              overflowWrap: "break-word",
              resize: "none",
              transition: ".2s ease-in"
            }}
          >
            +
          </div>
          <br />
        </div>
      </div>
    );
  }
}
export default Document;
/**
 * 
export const parseText = (pageText, i, pages, devWidth, lastLineWidth) => {
  //var dT = pageText.match(/\n/); //JSON.stringify(pageText).split('"')[1].split('"')[0];
  var thispage = JSON.stringify(pageText);
  //.split(/["]$/)[1]
  //.split('"')[0]
  var page = thispage.replace(/[\r\n|\r|\n]/g, "<br>");
  console.log(page);
  return ([...pages][i] = page);
  /*if (lastLineWidth < devWidth * 0.8) {
    if (dT) {
      return ([...pages][i] = JSON.stringify(pageText)
        .split(/["]$/)[1]
        .split('"')[0]
        .replace(/[\r\n]g/, <br />));
    } else {
      return ([...pages][i] = pageText);
    }
  } else return ([...pages][i] = pageText);*/

/* var punc = JSON.stringify(pageText).match(/?=[.,:!?-]+$/);
  if (punc) {
    this.setState({
      extra: "",
      documentText: ([...pages][i] = JSON.stringify(pageText).replace(
        /?=[.,:!?-]+$/,
        <br />
      ))
    });
  } else {
    var lastLine = lines[lines.length - 1];
    var lineIndex = pageText.lastIndexOf(lastLine);
    this.setState({
      extra: "",
      documentText: ([...pages][i] = pageText.splice(
        lineIndex + lastLine.length,
        0,
        "-"
      )) //(place,deleteHowMany,newItem)
    });
  }
  window.alert(
      "you'll need to break up this crazy word with a space ' ' or hyphen -"
    );*
};
 */
