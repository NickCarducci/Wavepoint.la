import React from "react";
import { specialFormatting } from "../../../widgets/authdb";
import Files from "../../../widgets/Cloud/Files";

class Media extends React.Component {
  state = {
    selectedFolder: "*"
  };
  render() {
    const { parent, shortId } = this.props;
    const isAuthor =
      this.props.auth !== undefined && parent.authorId === this.props.auth.uid;
    var folders = ["Miscellaneous"];
    parent.videos.map(
      (x) =>
        !folders.includes(specialFormatting(x.topic)) &&
        folders.push(specialFormatting(x.topic))
    );
    return (
      <div
        style={{
          overflow: "hidden",
          transition: ".3s ease-in",
          backgroundColor: "rgb(220,190,180)",
          display: "flex",
          position: "relative",
          width: "100%",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: this.props.opened ? "6px" : "0px",
          height: this.props.opened ? "min-content" : "0px"
        }}
      >
        {!isAuthor ? null : (
          <div
            style={{
              position: "relative",
              width: "min-content",
              display: "flex",
              justifyContent: "flex-start"
            }}
          >
            {this.state.addFolder ? (
              <form
                style={{ width: "min-content" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  var entry = this.state.newFolder;
                  this.setState(
                    {
                      addFolder: null,
                      newFolder: ""
                    },
                    () =>
                      entry !== "" &&
                      (folders = [
                        ...folders.filter((parent) => parent !== entry),
                        entry
                      ])
                  );
                }}
              >
                <input
                  style={{ width: "min-content" }}
                  placeholder="new folder"
                  onChange={(e) =>
                    this.setState({
                      newFolder: specialFormatting(e.target.value)
                    })
                  }
                  value={this.state.newFolder}
                />
              </form>
            ) : (
              <select
                style={{ width: "min-content", minWidth: "100px" }}
                value={this.state.selectedFolder}
                onChange={(e) =>
                  this.setState({ selectedFolder: e.target.value })
                }
              >
                {folders.map((parent, i) => (
                  <option key={i}>{parent}</option>
                ))}
              </select>
            )}
            <div
              onClick={() =>
                this.setState({
                  addFolder: !this.state.addFolder,
                  newFolder: "",
                  folders: this.state.addFolder
                    ? folders.filter(
                        (parent) => parent !== this.state.newFolder
                      )
                    : folders
                })
              }
              style={{
                width: "36px",
                textAlign: "center",
                border: "1px solid"
              }}
            >
              {this.state.addFolder ? "-" : "+"}
            </div>
          </div>
        )}
        {parent.videos && parent.videos.length > 0 && (
          <Files
            isAuthor={isAuthor}
            meAuth={this.props.meAuth}
            getUserInfo={this.props.getUserInfo}
            videos={parent.videos}
            selectedFolder={this.state.selectedFolder}
            shortId={`${shortId}`}
          />
        )}
      </div>
    );
  }
}
export default Media;
