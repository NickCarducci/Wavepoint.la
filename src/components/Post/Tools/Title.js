import React from "react";
import { RegisterCurseWords } from "../../../Forum";

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.textBoxTitle = React.createRef();
  }
  render() {
    const {
      shortId,
      parent,
      /*summary, mTT,*/ openingThisOne,
      int
    } = this.props;
    return (
      <div
        onMouseEnter={() => this.props.openingSet(shortId)}
        onMouseLeave={this.props.openingClear}
        onClick={() => this.props.openStuff(shortId)}
        style={{
          backgroundColor: "rgb(250,250,255)",
          borderRadius: "3px",
          color: "rgb(20,20,25)",
          textDecoration: "none",
          height: "min-content",
          padding: "5px",
          boxShadow: `0px 0px 10px 2px rgba(0,0,0,${openingThisOne ? 1 : 0.3})`,
          margin: "0px 5px",
          fontSize: "16px",
          background: this.props.isDroppedIn
            ? "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.3),rgba(0,0,60,.3))"
            : `rgba(250,250,255,${openingThisOne ? 1 : 0.6})`,
          width: "calc(100% - 20px)",
          transition: ".1s ease-in"
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "rgb(210,210,225)",
            top: "0px",
            right: "0px",
            opacity: openingThisOne ? 1 : 0,
            backgroundColor: openingThisOne
              ? "rgba(40,40,80,1)"
              : "rgba(40,40,80,.4)",
            zIndex: "1000",
            position: "absolute",
            padding: "14px 0px",
            width: openingThisOne ? "100%" : "0%",
            transition: openingThisOne ? "3s ease-out" : ".3s ease-in",
            minWidth: "max-content"
          }}
        >
          {parent.videos && parent.videos.length > 0
            ? `opening in ${int}`
            : `no videos here`}
        </div>
        {
          /*!summary ?  mTT && String(mTT):*/ RegisterCurseWords(parent.message) //message
            .replace(/(\r\n|\r|\n)/g, "\n")
            .split("\n")
            .map((line, i) => (
              <span
                className={
                  parent.collection === "ordinances"
                    ? "Charmonman"
                    : ["elections", "oldElections"].includes(parent.collection)
                    ? "MeriendaCursive"
                    : ["court cases", "oldCases"].includes(parent.collection)
                    ? "Rokkitt"
                    : ["budget & proposals", "oldBudget"].includes(
                        parent.collection
                      )
                    ? "Merienda"
                    : ""
                }
                key={i}
              >
                {line}
                <br />
              </span>
            ))
        }
      </div>
    );
  }
}
export default Title;
