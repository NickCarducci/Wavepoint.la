import React from "react";
//import * as jsPDF from "jspdf";
//import Toolbar from "./Toolbar";
import DocHeader from "./DocHeader";
import { RegisterCurseWords } from "../../../Forum";
/*export const handlePDF = (pages, text, properties) => {
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
    <div>{text}</div>, // HTML string or DOM elem ref.
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
      pages: ["longtext"],
      currentPage: 0,
      width,
      height,
      title: "none",
      fontInPoints: 14,
      lineHeight: 1.15
    };
    if (props.location.state && props.location.state.parent) {
      state.text = props.location.state.parent.message;
    }
    this.state = state;
    this.extra = React.createRef();
    for (let i = 0; i < 40; i++) {
      this[i] = React.createRef();
    }
    this.test = {};
    this.text = {};
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
      const { fontInPoints, lineHeight } = this.state;
      var paperSize = 11 / 8.5; // 1056 / 816 in pixel
      var marginSize = 96 / 816;

      var fontSizeActual = (1056 * (fontInPoints + fontInPoints / 3)) / 816;

      //var lines = JSON.stringify(text).split(/["]$/)[1].split('"')[0];

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
      this.setState({
        lineCount,
        linesPerPage,
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
  componentDidUpdate = (prevProps) => {
    if (this.state.text !== this.state.lastdocumentText) {
      this.setState({
        lastdocumentText: this.state.text,
        extraHeight: this.extra.current.offsetHeight
      });
      const { lineCount, linesPerPage, text } = this.state;

      let pages = [];
      if (!isNaN(lineCount))
        for (let x = 0; x < lineCount + 1; x++)
          if (x % linesPerPage === 0) {
            pages.push(text.slice(0, x + 1));
          } else if (x === 0) {
            pages.push(text.slice(0, linesPerPage));
          }

      /*let pages = [];
      if (!isNaN(lineCount))
        for (let x = 0; x < lineCount + 1; x++)
          if (x % linesPerPage === 0) {
            console.log(x);
            if(x === 0){
            var page = text.slice(0, x + 1);
            pages.push(page);
          }else if(x === 0){
            var page = text.slice(0, linesPerPage);
            pages.push(page);
            }
          }*/
      //pages = pages.length > 0 ? pages : [""];
      this.setState({ pages });
    }

    if (
      this.props.location.state &&
      this.props.location.state.parent &&
      this.state.text !== this.props.location.state.parent.message
    ) {
      this.setState({ text: this.props.location.state.parent.message });
    }
  };
  render() {
    const { title, fontInPoints, lineHeight, pages } = this.state;
    var paperSize = 11 / 8.5; // 1056 / 816 in pixel
    var marginSize = 96 / 816;

    var fontSize = (fontInPoints + fontInPoints / 3) / 816;

    var mTT = "";
    var isGood =
      this.props.auth !== undefined &&
      this.props.user !== undefined &&
      !this.props.user.under13 &&
      this.props.user.showCurses;
    if (this.state.text) {
      if (isGood) {
        mTT = RegisterCurseWords(this.state.text, isGood);
      } else {
        mTT = RegisterCurseWords(this.state.text, isGood);
      }
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
          <DocHeader
            hoverTitle={this.state.hoverTitle}
            fontInPoints={fontInPoints}
            title={title}
          />
          <div style={{ position: "absolute", top: "40px" }}>
            <div
              ref={this.extra}
              style={{
                opacity: "0",
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
              {mTT}
            </div>
            {/*<Toolbar />*/}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                this.setState({
                  documentHTML: pages.map((lines, i) => {
                    var pageText = e.target.value;
                    var layoutText = [...pages];
                    layoutText[i] = pageText;
                    var text = layoutText.join();
                    this.setState({
                      text
                    });
                    var doo = JSON.parse(JSON.stringify(e.target.value));
                    var extra = doo.replace(/(?:\r\n|\r|\n)/gm, "<br>");
                    var layoutHTML = [...pages];
                    layoutHTML[i] = extra;
                    return `<div>${layoutHTML.join()}</div>`;
                  })
                });
              }}
              /*onSelect={()=>{
                textArray.map((x,i)=>this.text[i].)
              }}*/
              style={{
                //whiteSpace: "pre-wrap", //prints \n
                marginBottom: "20px",
                lineHeight: lineHeight,
                width: `90%`,
                border: "none",
                fontSize: `calc(90vw * ${fontSize})`,
                display: "inline-block",
                position: "relative",
                overflowWrap: "break-word",
                resize: "none"
              }}
            >
              {pages.map((text, i) => {
                var textArray = text.split("");
                return (
                  <div
                    onChange={(e) =>
                      this.setState({
                        text: e.target.value
                      })
                    }
                    suppressContentEditableWarning={true}
                    contentEditable="true"
                    key={"page " + i}
                    value={text}
                    style={{
                      //whiteSpace: "pre-wrap", //prints \n
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
                    {textArray.map((x, i) => {
                      return <span key={"char " + i}>{x}</span>;
                    })}
                  </div>
                );
              })}
              {/*textArray.map((x, i) => {
                return (
                  <span ref={(ref) => (this.text[i] = ref)} key={i}>
                    {/*i !== 0 && this.input[i] && (
                      <div
                        onClick={() => this.input[i - 1].focus()}
                        style={{
                          color: "rgba(0,0,0,0)",
                          transform: `translateX(-${
                            this.input[i].offsetWidth / 2
                          }px)`,
                          position: "absolute",
                          zIndex: "1",
                          width: this.input[i].offsetWidth / 2,
                          height: "100%"
                        }}
                      >
                        {x}
                      </div>
                    )
                    <div
                      style={{
                        position: "absolute",
                        border: "none",
                        width: "100%",
                        height: "100%"
                      }}
                      value={x}
                      onChange={(e) => {
                        /*this.text[i] &&
                          this.text[i].current &&
                          this.text[i].current.focus();*
                        textArray[i] = e.target.value;
                        this.setState({
                          text: textArray.join()
                        });
                      }}
                      ref={(ref) => (this.input[i] = ref)}
                    />*}
                    {x}
                  </span>
                );
              })*/}
              {/*pages && (
                <input
                  onChange={(e) => {
                    this.text[pages.split("").length + 1] &&
                      this.text[pages.split("").length + 1].current &&
                      this.text[pages.split("").length + 1].current.focus();
                    this.setState({
                      text: [...this.state.text, e.target.value]
                    });
                  }}
                  ref={this[pages.split("").length + 1]}
                />
                )*/}
            </form>
          </div>
          <br />
          {/*<div
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
          </div>*/}
          <br />
        </div>
      </div>
    );
  }
}
export default Document;
/* {pages &&
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
                      var text = layoutText.join();
                      this.setState({
                        text
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
                            var page = text.slice(0, x + 1);
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
                      }*
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
              })}*/
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
      text: ([...pages][i] = JSON.stringify(pageText).replace(
        /?=[.,:!?-]+$/,
        <br />
      ))
    });
  } else {
    var lastLine = lines[lines.length - 1];
    var lineIndex = pageText.lastIndexOf(lastLine);
    this.setState({
      extra: "",
      text: ([...pages][i] = pageText.splice(
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
