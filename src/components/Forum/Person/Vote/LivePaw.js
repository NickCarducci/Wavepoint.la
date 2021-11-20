import React from "react";

class LivePaw extends React.Component {
  state = {};
  render() {
    const {
      hoverCases,
      hoverBills,
      electionTypes,
      budgetTypes,
      caseTypes
    } = this.props;
    return (
      <div
        style={{
          right: "80px",
          display: "flex",
          position: "absolute",
          height: `calc(${this.state.startTouch ? 100 : 0}px + 100px)`,
          justifyContent: "space-around",
          alignItems: "center",
          transition: "maxHeight .3s ease-out"
        }}
      >
        {!hoverCases && !hoverBills
          ? electionTypes.length === 0
            ? "No election votes yet"
            : electionTypes &&
              electionTypes.map((b, i) => {
                var theirsupports = this.props.supports.filter(
                  (x) => x.vote.type === b
                );
                var mysupports = this.props.mysupports.filter(
                  (x) => x.vote.type === b
                );
                let match = 0;
                theirsupports.map((f) => {
                  var thisone = mysupports.find(
                    (x) =>
                      x.vote.collectionId === f.vote.collectionId &&
                      x.vote.collection === f.vote.collection &&
                      x.vote.candidate === f.vote.candidate
                  );
                  if (thisone && thisone.vote.vote === f.vote.vote) {
                    return match++;
                  } else return null;
                });
                return (
                  <div
                    key={i}
                    draggable="true"
                    onDragStart={(e) => {
                      //e.preventDefault();
                      this.setState({ startTouch: true });
                      this.startTouch = setTimeout(
                        () => this.setState({ startTouch: true }),
                        300
                      );
                    }}
                    onDrag={(e) => {
                      //e.preventDefault();
                      var electionHover = window.innerWidth - e.clientX;
                      this.setState({ electionHover });
                    }}
                    onDragEnd={(e) => {
                      //e.preventDefault();
                      /*var electionHover = e.clientX;
              if (electionHover < window.innerWidth * 0.2) {
                this.props.chatscloser();
              }
              setTimeout(
                () =>
                  this.setState({
                    startTouch: false,
                    electionHover: "0"
                  }),
                400
              );*/
                    }}
                    onTouchMove={(e) => {
                      //e.preventDefault();
                      var electionHover =
                        window.innerWidth - e.touches[0].clientX;
                      electionHover && this.setState({ electionHover });
                    }}
                    onTouchEnd={(e) => {
                      //e.preventDefault();
                      clearTimeout(this.startTouch);
                      //var left = e.touches[0].clientX;
                      if (this.state.startTouch) {
                        if (
                          this.state.electionHover >
                          window.innerWidth * 0.8
                        ) {
                          this.props.chatscloser();
                        }
                        setTimeout(
                          () =>
                            this.setState({
                              electionHover: "0",
                              startTouch: false
                            }),
                          400
                        );
                      } else if (this.state.electionHover !== "0") {
                        this.setState({ electionHover: "0" });
                      }
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();

                      this.startTouch = setTimeout(
                        () => this.setState({ startTouch: true }),
                        300
                      );
                    }}
                    style={{
                      borderRadius: "10px",
                      height: "5px",
                      width: "60px",
                      backgroundColor: "rgb(200,200,240)",
                      position: "absolute",
                      transform: `rotate(${
                        i + 1 / electionTypes.length + 90
                      }deg)`
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "10px",
                        height: "5px",
                        width: "30px",
                        transform: `translateX(${
                          30 - 30 * (match / theirsupports.length)
                        }px)`,
                        backgroundColor: "rgb(50,100,240)",
                        position: "absolute"
                      }}
                    />
                  </div>
                );
              })
          : null}
        {!hoverCases && !hoverBills && this.props.go}
        {hoverBills
          ? budgetTypes.length === 0
            ? "No budget votes yet"
            : budgetTypes.map((b, i) => {
                var theirvotes = this.props.votes.filter(
                  (x) => x.vote.type === b
                );
                var myvotes = this.props.myvotes.filter(
                  (x) => x.vote.type === b
                );
                let match = 0;
                theirvotes.map((f) => {
                  var thisone = myvotes.find(
                    (x) =>
                      x.vote.collectionId === f.vote.collectionId &&
                      x.vote.collection === f.vote.collection
                  );
                  if (thisone && thisone.vote.vote === f.vote.vote) {
                    return match++;
                  } else return null;
                });
                return (
                  <div
                    key={i}
                    style={{
                      borderRadius: "10px",
                      height: "5px",
                      width: "60px",
                      backgroundColor: "rgb(200,200,240)",
                      position: "absolute",
                      transform: `rotate(${i + 1 / budgetTypes.length + 90}deg)`
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "10px",
                        height: "5px",
                        width: "30px",
                        transform: `translateX(${
                          30 - 30 * (match / theirvotes.length)
                        }px)`,
                        backgroundColor: "rgb(50,100,240)",
                        position: "absolute"
                      }}
                    />
                  </div>
                );
              })
          : null}
        {hoverCases
          ? caseTypes.length === 0
            ? "No case votes yet"
            : caseTypes.map((b, i) => {
                var theirvotes = this.props.votes.filter(
                  (x) => x.vote.type === b
                );
                var myvotes = this.props.myvotes.filter(
                  (x) => x.vote.type === b
                );
                let match = 0;
                theirvotes.map((f) => {
                  var thisone = myvotes.find(
                    (x) =>
                      x.vote.collectionId === f.vote.collectionId &&
                      x.vote.collection === f.vote.collection
                  );
                  if (thisone && thisone.vote.vote === f.vote.vote) {
                    return match++;
                  } else return null;
                });
                return (
                  <div
                    key={i}
                    style={{
                      borderRadius: "10px",
                      height: "5px",
                      width: "60px",
                      backgroundColor: "rgb(200,200,240)",
                      position: "absolute",
                      transform: `rotate(${i + 1 / caseTypes.length + 90}deg)`
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "10px",
                        height: "5px",
                        width: "30px",
                        transform: `translateX(${
                          30 - 30 * (match / theirvotes.length)
                        }px)`,
                        backgroundColor: "rgb(50,100,240)",
                        position: "absolute"
                      }}
                    />
                  </div>
                );
              })
          : null}
      </div>
    );
  }
}
export default LivePaw;
