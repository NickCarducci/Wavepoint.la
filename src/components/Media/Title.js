import React from "react";
import { RegisterCurseWords } from "../../Forum";

class Title extends React.Component {
  state = {};
  componentWillUnmount = () => {
    clearInterval(this.int);
    clearTimeout(this.holding);
    clearTimeout(this.clearTimeout);
  };
  render() {
    const {
      chainId,
      shortId,
      parent,
      /*summary, mTT,*/ openingThisOne,
      int,
      isDroppedIn
    } = this.props;
    const dropopen =
      this.props.opened !== "" && !isDroppedIn && this.state.dropopen;
    return (
      <div
        onMouseEnter={() =>
          !isDroppedIn &&
          this.props.opening !== shortId &&
          this.setState({ int: 3 }, () => {
            this.props.setForum({ opening: shortId });
            clearInterval(this.int);
            this.int = setInterval(
              () => this.setState({ int: this.state.int - 1 }),
              this.props.opened ? 300 : 1000
            );
            clearTimeout(this.holding);
            this.holding = setTimeout(
              () => {
                if (this.props.opened !== "") return null;
                this.props.setForum({
                  opened: shortId,
                  seeContents: chainId,
                  openChain: chainId
                });
              },
              this.props.opened ? 900 : 3000
            );
          })
        }
        onMouseLeave={() => {
          clearTimeout(this.clearTimeout);
          this.clearTimeout = setTimeout(
            () =>
              this.setState(
                {
                  int: 3
                },
                () => {
                  this.props.setForum({
                    opening: ""
                  });
                  clearTimeout(this.holding);
                }
              ),
            500
          );
        }}
        onClick={() => this.setState({ dropopen: !this.state.dropopen })}
        style={{
          userSelect: "all",
          opacity: dropopen ? 0.6 : 1,
          backgroundColor: "rgb(250,250,255)",
          borderRadius: "3px",
          color: "rgb(20,20,25)",
          textDecoration: "none",
          height: "min-content",
          padding: "5px",
          boxShadow: `0px 0px 10px 2px rgba(0,0,0,${openingThisOne ? 1 : 0.3})`,
          margin: "0px 5px",
          fontSize: "16px",
          background: dropopen
            ? "rgb(180,200,200)"
            : this.props.isDroppedIn
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
          /*!summary ?  mTT && String(mTT):*/ RegisterCurseWords(parent.message)
            .substring(0, dropopen ? 10 : parent.message.length) //message
            .replace(/(\r\n|\r|\n)/g, "\n")
            .split("\n")
            .map((line, i) => (
              <span
                className={
                  parent.collection === "ordinances"
                    ? "Charmonman"
                    : ["elections", "oldElections"].includes(parent.collection)
                    ? "MeriendaCursive"
                    : ["cases", "oldCases"].includes(parent.collection)
                    ? "Rokkitt"
                    : ["budget", "oldBudget"].includes(parent.collection)
                    ? "Merienda"
                    : ""
                }
                key={i}
              >
                {line}
                {dropopen && "..."}
                <br />
              </span>
            ))
        }
      </div>
    );
  }
}
export default Title;
