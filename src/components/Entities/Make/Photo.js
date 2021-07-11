import React from "react";

class Photo extends React.Component {
  render() {
    const { typingNow, images, message } = this.props;
    return (
      <div
        style={{
          display: "flex",
          position: "fixed",
          width: "100%",
          height: "40%",
          bottom: "0px",
          overflow: "auto",
          justifyContent: "flex-end"
        }}
      >
        <div
          style={{
            //display: "grid",
            position: "absolute",
            width: "100%",

            columnCount: "3",
            columnGap: "0"
            //gridTemplateColumns: "1fr 1fr 1fr"
          }}
        >
          {images ? (
            images.map((image, i) => {
              //console.log(image);
              return (
                <img
                  key={i}
                  onClick={() => this.props.choosePhoto(image)}
                  style={{
                    position: "relative",
                    width: "100%",
                    overflow: "auto",
                    WebkitColumnBreakInside: "avoid",
                    pageBreakInside: "avoid",
                    breakInside: "avoid"
                  }}
                  src={image.src.medium}
                  alt="error"
                />
              );
            })
          ) : (
            <div>nothing for this message</div>
          )}
          {typingNow ? (
            <div className="loadingAuthScreen1">
              <div>
                <div />
              </div>
            </div>
          ) : null}
          {message !== "" ? (
            <div className="pexelsmemo">
              Photos provided by <a href="https://www.pexels.com/">Pexels</a>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
export default Photo;
