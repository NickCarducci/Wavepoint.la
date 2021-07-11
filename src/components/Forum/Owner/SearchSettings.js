import React from "react";
import firebase from "../../.././init-firebase.js";

class SearchSettings extends React.Component {
  render() {
    const { community, columncount } = this.props;
    return (
      <div
        style={{
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
          color: "black",
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
        }}
        onClick={
          community.notSearchable
            ? () =>
                firebase
                  .firestore()
                  .collection("communities")
                  .doc(community.id)
                  .update({
                    notSearchable: false
                  })
                  .catch((err) => console.log(err.message))
            : () =>
                firebase
                  .firestore()
                  .collection("communities")
                  .doc(community.id)
                  .update({
                    notSearchable: true
                  })
                  .catch((err) => console.log(err.message))
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
              color: "grey",
              fontSize: "16px",
              padding: "10px 0px",
              margin: "0px 10px",
              display: "flex",
              position: "relative"
            }}
          >
            <div
              style={
                community.notSearchable
                  ? {
                      display: "flex",
                      borderRadius: "50px",
                      border: "1px solid black",
                      position: "absolute",
                      height: "22px",
                      width: "46px",
                      right: "30px",
                      transition: ".3s ease-out"
                    }
                  : {
                      display: "flex",
                      borderRadius: "50px",
                      border: "1px solid black",
                      position: "absolute",
                      height: "22px",
                      width: "46px",
                      right: "30px",
                      backgroundColor: "blue",
                      transition: ".3s ease-in"
                    }
              }
            />
            <div
              style={
                community.notSearchable
                  ? {
                      display: "flex",
                      borderRadius: "50px",
                      border: "1px solid black",
                      position: "absolute",
                      transform: "translate(-3px,3px)",
                      height: "16px",
                      width: "16px",
                      right: "30px",
                      transition: ".3s ease-out"
                    }
                  : {
                      display: "flex",
                      borderRadius: "50px",
                      border: "1px solid black",
                      position: "absolute",
                      transform: "translate(-3px,3px)",
                      height: "16px",
                      width: "16px",
                      right: "50px",
                      transition: ".3s ease-in",
                      backgroundColor: "lightblue"
                    }
              }
            />
            {community.notSearchable ? `only Links` : "Searchable and Links"}
            <br />
            {`tpt.sh/${community.message}`}
            <br />
            {`wavv.art/${community.message}`}
            <br />
            {`thumbprint.app/${community.message}`}
          </div>
        </div>
      </div>
    );
  }
}
export default SearchSettings;
