import React from "react";

class FilterSenders extends React.Component {
  render() {
    return (
      <div
        style={
          this.props.userQuery === ""
            ? {
                display: "flex",
                position: "absolute",
                overflowY: "scroll",
                flexDirection: "column",
                width: "100%",
                color: "white",
                zIndex: "99",
                justifyContent: "center"
              }
            : {
                display: "none"
              }
        }
      >
        <br />

        {this.props.users &&
          this.props.recipients &&
          this.props.users
            .filter(obj => this.props.recipients.includes(obj.id))
            .map(x => {
              return (
                <div
                  key={x.id}
                  style={{
                    display: "flex",
                    position: "relative",
                    justifyContent: "center",
                    zIndex: "9999",
                    margin: "1px 2px",
                    padding: "5px",
                    width: "auto",
                    backgroundColor: "rgba(51, 51, 51, 0.687)"
                  }}
                >
                  <div
                    onClick={() => this.props.changeFilteredSenders(x)}
                    style={
                      this.props.filteredSenders.includes(x.id)
                        ? { color: "white", width: "min-content" }
                        : { color: "grey", width: "min-content" }
                    }
                  >
                    {x.username}
                  </div>
                </div>
              );
            })}
      </div>
    );
  }
}
export default FilterSenders;
