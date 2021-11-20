import React from "react";

class ChatterHeader extends React.Component {
  state = { isGroup: false, number: 0, oktopic: this.props.chosenTopic };
  componentDidUpdate = (prevProps) => {
    if (this.props.chosenTopic !== prevProps.chosenTopic) {
      this.setState({ oktopic: this.props.chosenTopic });
    }
  };
  render() {
    var place = this.props.chosenTopic ? this.props.chosenTopic : "Topic";
    return (
      <div
        style={{
          backgroundColor: this.props.sidemenuWidth !== "0" ? "blue" : "red",
          display: "flex",
          position: "relative",
          fontSize: "15px",
          top: "0px",
          height: this.props.closeHeader ? "0px" : "56px",
          width: "min-content",
          color: "white",
          zIndex: this.props.closeHeader ? "-1" : "1",
          flexDirection: "column",
          transition: ".3s ease-out"
        }}
      >
        <div
          style={{ zIndex: "6" }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            //console.log(JSON.parse(e.dataTransfer.getData("text")));
            //e.stopPropagation();
            var link = e.dataTransfer.getData("URL");
            this.props.openWhat === "docs" && this.props.openTopics();
            try {
              const thiss = this.props.chats.find((x) => x.message === link);
              if (thiss) {
                console.log("p");
              }
            } catch (e) {}
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "81px",
              backgroundColor:
                this.props.openWhat === "topics"
                  ? "rgba(35, 108, 255, 0.721)"
                  : "rgb(15,15,15)",
              transition: ".3s ease-in"
            }}
          >
            <div
              onClick={this.props.openTopics}
              style={{
                opacity: this.props.openWhat !== "topics" ? 0 : 1,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "81px",
                boxShadow:
                  this.props.openWhat !== "topics"
                    ? ""
                    : `inset -5px -10px 10px 1px rgb(20,20,20)`,
                color:
                  this.props.openWhat !== "topics"
                    ? "grey"
                    : "rgb(220,220,220)",
                height: this.props.openWhat !== "topics" ? "0px" : "30px",
                fontSize: "15px",
                transition: ".3s ease-in"
              }}
            >
              &nbsp; #&nbsp;
              <div
                style={{
                  fontSize: "12px",
                  height: "15px",
                  minWidth: "15px",
                  paddingTop: ".6px",
                  textAlign: "center",
                  backgroundColor:
                    this.props.number && this.props.number > 0
                      ? "rgba(230,230,230)"
                      : "",
                  color: "rgb(135, 28, 255)",
                  borderRadius: "45px",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {this.props.number > 999
                  ? " +"
                  : this.props.number > 0
                  ? this.props.number
                  : null}
              </div>
            </div>
          </div>
          <span
            onClick={this.props.openDocs}
            style={{
              flexDirection: "column",
              display: "flex",
              fontSize: "15px",
              backgroundColor:
                this.props.openWhat === "docs"
                  ? "rgba(32, 108, 255, 0.721)"
                  : "rgb(35,35,35)",
              alignItems: "center",
              justifyContent: "center",
              height: this.props.openWhat === "docs" ? "58px" : "26px",
              width: this.props.openWhat === "docs" ? "81px" : "50px",
              color:
                this.props.openWhat === "docs" ? "rgb(220,220,220)" : "grey",
              transition: ".3s ease-in",
              boxShadow:
                this.props.openWhat === "docs"
                  ? "inset -5px 0px 5px 1px rgb(20,20,20)"
                  : "inset -2px 0px 5px 5px rgb(0,0,0)"
            }}
            role="img"
            aria-label="storage files folder"
          >
            {this.props.openWhat === "docs" && (
              <div style={{ fontSize: "10px", overflowWrap: "wrap" }}>
                {" "}
                {this.props.chosenTopic}
              </div>
            )}
            &#128193;
            {this.props.files.length > 0 ? this.props.files.length : ""}
          </span>
          {/*<img
            src={back}
            style={
              this.props.openWhat !== "topics"
                ? {
                    display: "flex",
                    width: "30px",
                    height: "20px"
                  }
                : {
                    display: "none"
                  }
            }
            alt="error"
          />*/}
        </div>
        <div
          style={{
            display: "flex",
            position: "fixed",
            color: "black",
            zIndex: "5",
            width: "100%",
            height: "min-content",
            flexDirection: "row",
            top: "0px",
            left: "82px"
          }}
        >
          <div
            style={{
              paddingBottom: "20px",
              right: "0px",
              display: "flex",
              position: "relative",
              color: "black",
              overflowX: "auto",
              overflowY: "hidden",
              width: "calc(100%)",
              height: "100px"
            }}
          >
            <div
              onClick={this.props.checkProfilesOpen}
              style={{
                backgroundColor: "rgb(20,20,20)",
                display: "flex",
                position: "relative",
                border: "1px grey dotted",
                left: "0px",
                textIndent: "10px",
                height: "20px",
                transition: ".1s ease-in",
                width: "200%",
                zIndex: "1",
                flexDirection: "row"
              }}
            >
              {this.props.entityType !== "users" && (
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    fontSize: "15px",
                    width: "max-content",
                    color: "white"
                  }}
                >
                  {this.props.thisentity
                    ? this.props.thisentity.message
                    : this.props.entityTitle}
                  :
                </div>
              )}
              {this.props.recentChats[0] &&
                this.props.recentChats[0].recipientsProfiled.map(
                  (x) =>
                    this.props.recipients &&
                    this.props.recipients.includes(x.id) && (
                      <div
                        key={x.id}
                        style={{
                          display: "flex",
                          position: "relative",
                          fontSize: "15px",
                          width: "max-content",
                          color: "white"
                        }}
                      >
                        {x.username}
                      </div>
                    )
                )}
            </div>
          </div>
          <form
            style={{
              display: "flex",
              position: "fixed",
              height: "42px",
              left: "50px",
              marginTop: "25px",
              zIndex: "5",
              width: "80%"
            }}
            onSubmit={(e) => {
              e.preventDefault();
              return false;
            }}
          >
            <input
              onMouseEnter={() => this.setState({ hoverHeader: true })}
              onMouseLeave={() => this.setState({ hoverHeader: false })}
              autoCorrect="off"
              onChange={(e) => {
                var t = e.target.value;
                this.setState({ oktopic: t });
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                  this.props.chooseTopic(t);
                }, 200);
              }}
              value={this.state.oktopic}
              placeholder={place}
              style={{
                height: !this.state.hoverHeader ? "30px" : "40px",
                transition: ".2s ease-in",
                display: "flex",
                position: "fixed",
                textIndent: "36px",
                width: "80%",
                backgroundColor: "white",
                alignItems: "center",
                color: "black",
                border: "0.5px dotted #999",
                zIndex: "5"
              }}
            />
            {this.state.isGroup &&
              this.props.group.admin.includes(this.props.auth.uid) && (
                <span
                  role="img"
                  aria-label="Announcement"
                  style={{
                    display: "flex",
                    position: "relative",
                    height: "56px",
                    right: "0px",
                    alignItems: "center",
                    color: this.state.authoritarianTopic ? "black" : "grey"
                  }}
                  onClick={() => this.setState({ authoritarianTopic: true })}
                >
                  &#128274;
                </span>
              )}
          </form>
        </div>
      </div>
    );
  }
}
export default ChatterHeader;
