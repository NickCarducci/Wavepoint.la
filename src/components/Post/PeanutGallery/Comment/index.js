import React from "react";
//import Vibrant from "node-vibrant";
import Tool from "./Tool";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "230,40,40"
    };
    this.size = React.createRef();
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
  }
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.setState({ size: this.size.current.offsetHeight });
    }, 200);
  };
  componentDidMount = () => {
    this.refresh();
    window.addEventListener("resize", this.refresh);
  };
  render() {
    const { mTT } = this.props;
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          right: "10px",
          left: "10px",
          height: "min-content",
          top: "10px"
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            //border: "1px solid",
            borderLeft: `3px solid rgb(${this.state.color})`,
            borderBottom:
              this.props.index !== this.props.comments.length - 1
                ? "none"
                : `3px solid rgb(${this.state.color})`,
            borderBottomLeftRadius:
              this.props.index !== this.props.comments.length - 1
                ? "none"
                : "30px",
            top: "5px",
            height: this.state.size,
            width: "5px",
            transition: ".3s ease-in"
          }}
        />
        <div
          ref={this.size}
          style={{
            display: "flex",
            position: "relative",
            height: "min-content",
            width: `calc(100% - 20px)`,
            flexDirection: "column"
          }}
        >
          <Tool
            chosenPost={this.props.chosenPost}
            mTT={mTT}
            commentType={this.props.commentType}
            commtype={this.props.commtype}
            b={this.props.x}
            auth={this.props.auth}
            width={this.props.width}
          />
          {/*this.props.x.content.map(b => {
            return <Tool b={b} />;
          })*/}
        </div>
      </div>
    );
  }
}
export default Comment;
