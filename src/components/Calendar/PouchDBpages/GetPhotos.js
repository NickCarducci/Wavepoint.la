import React from "react";
import { specialFormatting } from "../../../widgets/authdb";

class GetPhotos extends React.Component {
  state = {};
  choosePhoto = (image) => {
    this.setState({ chosenPhoto: image });
    //console.log(this.state.chosenPhoto);
  };
  queryPexels = async (message) => {
    if (!this.state.chosenPhoto) {
      const done = message.split(" ").join("+");
      const url = `https://api.pexels.com/v1/search?query=${done}&per_page=9&page=1`;
      //return res.send(url)
      await fetch(url, {
        headers: {
          Authorization:
            "563492ad6f91700001000001702cdbab8c46478a86694c18d3e1bc6b"
        }
      })
        .then(async (response) => await response.json())
        .then((results) => {
          //let images = []
          //images.push(results)
          this.setState({ images: results.photos });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  keyUp = () => {
    if (!this.state.chosenPhoto) {
      this.setState({ typingNow: true });
      clearTimeout(this.timezout);
      this.timezout = setTimeout(() => {
        this.setState({ typing: false, typingNow: false });
        console.log("searching...");
        this.queryPexels(this.state.query);
      }, 3000);
    }
  };
  keyDown = () => {
    this.setState({ typing: true });
  };
  updatePQuery = (e) =>
    this.setState({ query: specialFormatting(e.target.value) });

  render() {
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          id="r"
          name="r"
          value={this.state.query}
          className="titleofevento"
          maxLength="24"
          placeholder="Title"
          //autoFocus={true}
          autoComplete="off"
          //onClick={this.focus}
          required
          autoCorrect="off"
          onKeyUp={this.keyUp}
          onChange={this.updatePQuery}
          onKeyDown={this.keyDown}
        />
        {this.state.typingNow ? (
          <div className="loadingAuthScreen1">
            <div>
              <div />
            </div>
          </div>
        ) : null}
        {this.state.query !== "" ? (
          <div className="pexelsmemo">
            Photos provided by <a href="https://www.pexels.com/">Pexels</a>
          </div>
        ) : null}
        <div
          style={
            this.state.editphoto
              ? {
                  display: "flex",
                  position: "fixed",
                  width: "100%",
                  height: "40%",
                  bottom: "0px",
                  zIndex: "9999",
                  overflow: "auto",
                  justifyContent: "flex-end",
                  transition: ".3s ease-in"
                }
              : {
                  display: "flex",
                  position: "fixed",
                  width: "100%",
                  height: "40%",
                  bottom: "0px",
                  zIndex: "9999",
                  overflow: "auto",
                  justifyContent: "flex-end",
                  transition: ".3s ease-out"
                }
          }
        >
          <div
            style={{
              //display: "grid",
              position: "absolute",
              width: "100%",
              zIndex: "9999",
              columnCount: "3",
              columnGap: "0"
              //gridTemplateColumns: "1fr 1fr 1fr"
            }}
          >
            {this.state.images ? (
              this.state.images.map((image) => {
                //console.log(image);
                return (
                  <img
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
          </div>
        </div>
      </form>
    );
  }
}
export default GetPhotos;
