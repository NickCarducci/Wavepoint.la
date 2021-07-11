import React from "react";

class UseEntity extends React.Component {
  state = {};
  render() {
    const { openOptions } = this.props;
    return (
      <div
        style={
          openOptions
            ? {
                display: "flex",
                position: "relative",
                width: "98%",
                height: "min-content",
                top: "0px",
                left: "0%",
                backgroundColor: "white",
                flexDirection: "column",
                alignItems: "center",
                zIndex: "9999",
                marginBottom: "5px",
                textIndent: "10px",
                minWidth: "98%",
                maxWidth: "98%",
                fontSize: "16px",
                transition: "height .3s ease-in"
              }
            : {
                display: "flex",
                position: "relative",
                width: "98%",
                height: 0,
                top: "0px",
                left: "-100%",
                backgroundColor: "white",
                flexDirection: "column",
                alignItems: "center",
                zIndex: "-9999",
                marginBottom: "5px",
                textIndent: "10px",
                minWidth: "98%",
                maxWidth: "98%",
                fontSize: "16px",
                transition: "height .3s ease-out"
              }
        }
      >
        {[
          "profileClubs",
          "profileShops",
          "profileRestaurants",
          "profileServices",
          "profilePages",
          "profileVenues",
          "profileDepartments",
          "profileClasses"
        ].map((x) => {
          //let titles = [];
          return (
            <div
              key={x}
              style={{
                display: "flex",
                position: "relative",
                flexDirection: "column"
              }}
            >
              <div
                style={
                  this.state.tileChosen !== x
                    ? {
                        color: this.props[x].length === 0 ? "grey" : "black",
                        display: "flex",
                        position: "relative",
                        width: "97%",
                        padding: "5px",
                        height: "auto",
                        maxHeight: "160px",
                        maxWidth: "300px",
                        borderRadius: "30px"
                      }
                    : { display: "none" }
                }
                onClick={() => this.setState({ tileChosen: x })}
              >
                {x}
              </div>
              <div
                style={
                  this.state.tileChosen === x
                    ? {
                        display: "flex",
                        position: "relative",
                        flexDirection: "column",
                        zIndex: "9999"
                      }
                    : { display: "none" }
                }
              >
                <div>
                  {this.props[x].length === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        position: "relative",
                        width: "97%",
                        padding: "5px",
                        height: "auto",
                        maxHeight: "160px",
                        maxWidth: "300px",
                        borderRadius: "30px"
                      }}
                    >
                      {x}
                    </div>
                  ) : (
                    this.props[x].map((y, i) => {
                      //titles.push(y);
                      var type =
                        x === "profileClubs"
                          ? "clubs"
                          : x === "profileShops"
                          ? "shops"
                          : x === "profileRestaurants"
                          ? "restaurants"
                          : x === "profileServices"
                          ? "services"
                          : x === "profilePages"
                          ? "pages"
                          : x === "profileVenues"
                          ? "venues"
                          : x === "profileClasses"
                          ? "classes"
                          : x === "profileDepartments"
                          ? "department"
                          : "clubs";
                      return (
                        <div key={x + y.id}>
                          {i === 0 && (
                            <div style={{ fontSize: "12px" }}>{type}</div>
                          )}
                          <div
                            onClick={() => {
                              this.props.submit({
                                entityType: type,
                                entityId: y.id,
                                openOptions: false
                              });
                            }}
                            onMouseEnter={() =>
                              this.setState({
                                ["hover" + x + y.id]: true
                              })
                            }
                            onMouseLeave={() =>
                              this.setState({
                                ["hover" + x + y.id]: false
                              })
                            }
                            style={
                              this.state["hover" + x + y.id]
                                ? {
                                    border: "1px solid",
                                    borderRadius: "45px",
                                    width: "max-content",
                                    paddingRight: "10px",
                                    transition: ".1s ease-in"
                                  }
                                : {
                                    border: "1px solid grey",
                                    color: "grey",
                                    borderRadius: "45px",
                                    width: "max-content",
                                    paddingRight: "10px",
                                    transition: ".2s ease-out"
                                  }
                            }
                          >
                            post as {y.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
export default UseEntity;
