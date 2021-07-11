import React from "react";
import firebase from "../../.././init-firebase";

class Addtiles extends React.Component {
  state = {
    tilesOff: []
  };
  render() {
    const { columncount } = this.props;
    return (
      <form
        onSubmit={(e) => e.preventDefault()}
        className="formforum"
        style={
          this.props.auth !== undefined &&
          this.props.community &&
          (this.props.community.authorId === this.props.auth.uid ||
            this.props.community.admin.includes(this.props.auth.uid)) &&
          this.props.editingCommunity
            ? {
                color: "rgb(220,220,250)",
                userSelect: this.props.editingSomeText ? "none" : "all",
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                zIndex: 6,
                width: "100%",
                maxHeight:
                  columncount === 1 || this.props.postHeight > 0 ? "" : "100%",
                height: `max-content`,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                opacity: "1",
                backgroundColor: !this.props.chosenPostId
                  ? "rgb(230,230,230)"
                  : this.props.chosenPostId === x.id
                  ? "rgb(230,230,255)"
                  : "rgb(200,200,200)",
                borderBottom: "1px solid grey",
                overflowX: "hidden",
                overflowY: columncount === 1 ? "hidden" : "auto"
              }
            : {
                display: "none"
              }
        }
      >
        <div
          style={{
            userSelect: this.props.editingCommunity ? "none" : "all",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "min-content",
            width: "100%",
            breakInside: "avoid"
          }}
        >
          <div
            style={{
              backgroundColor: "black",
              padding: "10px",
              flexDirection: "column"
            }}
          >
            Tile Subscriptions{" "}
            <div style={{ color: "rgb(190,190,220)", fontSize: "12px" }}>
              admins control
            </div>
            <div style={{ color: "rgb(190,190,220)", fontSize: "12px" }}>
              only members create
            </div>
            {[
              "event",
              "club",
              "shop",
              "restaurant",
              "service",
              "job",
              "housing"
            ].map((x) => {
              return (
                <div
                  key={x}
                  onClick={() =>
                    this.props.community &&
                    this.props.community.blockedTiles &&
                    this.props.community.blockedTiles.includes(x)
                      ? firebase
                          .firestore()
                          .collection("communities")
                          .doc(this.props.community.id)
                          .update({
                            blockedTiles: firebase.firestore.FieldValue.arrayRemove(
                              x
                            )
                          })
                          .catch((err) => console.log(err.message))
                      : firebase
                          .firestore()
                          .collection("communities")
                          .doc(this.props.community.id)
                          .update({
                            blockedTiles: firebase.firestore.FieldValue.arrayUnion(
                              x
                            )
                          })
                          .catch((err) => console.log(err.message))
                  }
                  style={
                    this.props.community.blockedTiles &&
                    this.props.community.blockedTiles.includes(x)
                      ? {
                          color: "grey",
                          transition: ".3s ease-out"
                        }
                      : {
                          width: "max-content",
                          margin: "5px 0px",
                          padding: "0px 5px",
                          color: "#844fff",
                          backgroundColor: "rgb(200,200,240)",
                          transition: ".3s ease-in"
                        }
                  }
                >
                  {x}
                </div>
              );
            })}
          </div>
        </div>
      </form>
    );
  }
}
export default Addtiles;
