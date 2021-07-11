import React from "react";

class DropId extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      droptype: 0,
      id: "",
      lastId: "", //props.optionalDrop ? props.optionalDrop : null,
      post: undefined,
      comments: [],
      postHeight: 0,
      lastPostHeight: 0
    };
    this.post = React.createRef();
  }
  render() {
    const { parent } = this.props;
    var types = ["post", "entity", "event"];
    return (
      <div
        style={{
          color: "black",
          border: "3px solid",
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "flex-start",
          display: "flex",
          position: !this.props.optionalDrop ? "fixed" : "relative",
          flexDirection: "column",
          width: "100%",
          height: "min-content"
        }}
      >
        <div>
          <div
            style={{
              height: "80px",
              border: "3px solid rgb(50,50,50)",
              borderRadius: "10px",
              display: "flex",
              position: "relative",
              width: "min-content"
            }}
          >
            <div
              onClick={() => {
                if (this.state.droptype !== 0) {
                  this.setState({ droptype: this.state.droptype - 1 });
                } else {
                  this.setState({
                    droptype: 2
                  });
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "60px",
                position: "relative",
                backgroundColor: "rgb(20,20,20,.4)"
              }}
            >
              {"<"}
            </div>
            <label
              style={{
                flexDirection: "column",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                margin: "0px 5px",
                width: "80px",
                height: "100%"
              }}
            >
              {types[this.state.droptype]}
              {this.state.droptype === 0 && (
                <select
                  value={this.state.newLessonShow}
                  onChange={(e) =>
                    this.setState({
                      newLessonShow: e.target.value
                    })
                  }
                >
                  {["new", "lesson", "show", "game"].map((forumType) => {
                    return <option key={forumType}>{forumType}</option>;
                  })}
                </select>
              )}
            </label>
            <div
              onClick={() => {
                if (this.state.droptype !== 2) {
                  this.setState({ droptype: this.state.droptype + 1 });
                } else {
                  this.setState({
                    droptype: 0
                  });
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "60px",
                position: "relative",
                backgroundColor: "rgb(20,20,20,.4)"
              }}
            >
              {">"}
            </div>
          </div>
        </div>
        &nbsp;
        <input
          defaultValue=""
          className="input"
          style={{ maxWidth: "80%", minWidth: "100px" }}
          //value={this.props.droppedId}
          onChange={(e) => {
            var droppedId = e.target.value;
            droppedId !== "" && this.props.dropId(droppedId, parent);
          }}
          placeholder="drop id here"
        />
      </div>
    );
  }
}
export default DropId;
