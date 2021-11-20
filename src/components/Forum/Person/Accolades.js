import React from "react";

class Accolades extends React.Component {
  render() {
    const { swipe, experiences, hobbies, education } = this.props;
    return (
      <div
        style={{
          color: "white",
          backgroundColor: "rgba(230,230,230,.6)",
          display: swipe === "home" ? "flex" : "none",
          flexDirection: "column",
          height: "min-content"
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(20,20,60,.8)",
            margin: "10px",
            padding: "10px",
            display: swipe === "home" ? "flex" : "none",
            flexDirection: "column",
            height: "min-content"
          }}
        >
          {[
            { name: "experiences", array: experiences },
            { name: "education", array: education },
            { name: "hobbies", array: hobbies }
          ].map((type) => (
            <div
              key={type.name}
              style={{
                height: "min-content",
                margin: "5px 0px"
              }}
            >
              <div
                style={{
                  width: "min-content",
                  padding: "5px",
                  backgroundColor: "rgba(20,20,60,.8)",
                  height: "min-content",
                  display: "flex"
                }}
              >
                <label style={{ color: "grey", fontSize: "16px" }}>
                  {type.name}
                </label>
              </div>
              {type.array.map((x, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      height: "min-content",
                      marginTop: "2px",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    {x}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default Accolades;
