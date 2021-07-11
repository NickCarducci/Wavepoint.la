import React from "react";
import { Link } from "react-router-dom";

class DocHeader extends React.Component {
  state = {};
  render() {
    const { fontInPoints, title } = this.props;

    var hoverTitleEdit = this.state.hoverTitle && !this.state.editTitle;
    return (
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
            color: this.state.hoverTitle ? "black" : "grey",
            padding: "5px 10px",
            height: fontInPoints,
            width: "min-content",
            borderBottom: `1px solid ${
              hoverTitleEdit ? "rgba(0,0,0,0)" : "grey"
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
            <div style={{ position: "absolute", top: "0px", fontSize: "12px" }}>
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
          <div style={{ position: "absolute", top: "0px", fontSize: "12px" }}>
            &#x2191;
          </div>
        </div>
      </div>
    );
  }
}
export default DocHeader;
