import React from "react";
import firebase from "../.././init-firebase.js";
import { arrayMessage } from "../../widgets/authdb.js";
import NewLocationWidget from "./Dates/Meets/NewLocationWidget.js";

class NewItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textBoxHeight: 30,
      price: 0,
      message: "",
      body: ""
    };
    this.textBox = React.createRef();
  }
  clear = () => {
    if (["oldBudget", "budget"].includes(this.props.collection)) {
      this.setState({ price: "" });
    }
    this.props.closeNew();
    this.setState({
      message: "",
      body: ""
    });
  };
  handleAdd = () => {
    var messageAsArray = arrayMessage(this.state.message);
    var add = {
      communityId: this.props.community.id,
      authorId: this.props.auth.uid,
      message: this.state.message,
      body: this.state.body,
      date:
        "departments" === this.props.collection
          ? null
          : this.props.materialDate,
      time: new Date(),
      messageAsArray
    };
    if (
      this.props.ordinanceTyped ||
      this.props.caseTyped ||
      this.props.budgetTyped ||
      this.props.electionTyped ||
      this.props.departmentTyped
    ) {
      if (this.props.ordinanceTyped) {
        add.ordinanceType = this.props.ordinanceTyped;
      } else if (this.props.caseTyped) {
        add.caseType = this.props.caseTyped;
      } else if (this.props.budgetTyped) {
        add.budgetType = this.props.budgetTyped;
        add.price = this.state.price;
      } else if (this.props.electionTyped) {
        add.electionType = this.props.electionTyped;
      } else if (this.props.departmentTyped) {
        var array = [];
        const c = this.state.message.toLowerCase();
        for (let i = 1; i < c.length + 1; i++) {
          array.push(c.substring(0, i));
        }
        add.departmentType = this.props.departmentTyped;
        add.place_name = this.state.goodplace_name;
        add.center = this.state.goodCenter;
        add.titleAsArray = array;
      }
      firebase
        .firestore()
        .collection(this.props.collection)
        .add(add)
        .then(() => {
          if (this.props.budgetTyped) {
            this.setState({
              price: ""
            });
          }
          this.props.closeNew();
          this.setState({
            message: "",
            body: ""
          });
        })
        .catch((err) => console.log(err.message));
    } else {
      return window.alert("please select a filter");
    }
  };
  handleDateError = () => {
    window.alert(
      `please choose when this ${
        ["ordinance", "budget", "elections", "oldElections"].includes(
          this.props.collection
        )
          ? "motion"
          : ["cases", "oldCases"].includes(this.props.collection)
          ? "case"
          : ""
      } is/was scheduled for ${
        this.props.collection === "ordinance"
          ? "a vote"
          : ["cases", "oldCases"].includes(this.props.collection)
          ? "judgement"
          : ""
      }`
    );
  };
  render() {
    const { columncount } = this.props;
    return (
      <div
        style={{
          height: "min-content",
          padding: "10px 0px",
          backgroundColor: "rgb(230,230,230)",
          color: "rgb(20,20,20)",
          display: !this.props.showNewItem ? "none" : "flex",
          breakInside: "avoid",
          zIndex: 6,
          width: "100%",
          maxHeight:
            columncount === 1 || this.props.postHeight > 0 ? "" : "100%",
          position: "relative",
          flexDirection: "column",
          borderBottom: "1px solid grey",
          overflowX: "hidden",
          overflowY: columncount === 1 ? "hidden" : "auto"
        }}
      >
        {["departments"].includes(this.props.collection) && (
          <div>
            <NewLocationWidget
              goodplace_name={this.state.goodplace_name}
              goodCenter={this.state.goodCenter}
              place_name={this.state.place_name}
              likedCenter={this.state.likedCenter}
              good1={(x, y) => {
                console.log(x);
                this.setState({
                  place_name: x,
                  likedCenter: y
                });
              }}
              good={(x, y, z, a) =>
                this.setState({
                  goodCenter: y,
                  goodplace_name: x,
                  place_name: z,
                  likedCenter: a
                })
              }
            />
            {this.state.goodCenter && this.state.goodplace_name}
            {this.state.goodCenter && (
              <div
                onClick={() => {
                  this.props.good("", "");
                  this.setState({
                    place_name: this.state.place_name,
                    likedCenter: this.state.likedCenter
                  });
                }}
                style={{ border: "1px solid black" }}
              >
                Unselect
              </div>
            )}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              this.props.materialDate ||
              "departments" === this.props.collection
            ) {
              if (!["classes", "oldClasses"].includes(this.props.collection)) {
                this.handleAdd();
              } else {
                if (!this.state.goodCenter) {
                  window.alert(
                    "please select the closest address possible for the map"
                  );
                } else this.handleAdd();
              }
            } else {
              this.handleDateError();
            }
          }}
          style={{
            display: "flex",
            color: "rgb(20,20,20)",
            fontSize: "14px",
            flexDirection: "column",
            position: "relative",
            height: "min-content",
            width: "100%",
            breakInside: "avoid"
          }}
        >
          <div
            style={{
              border: "1px solid",
              margin: "10px",
              padding: "10px",
              color: "navy",
              fontSize: "14px"
            }}
          >
            New {this.props.commtype}
            <input
              className="input"
              value={this.state.message}
              onChange={(e) => this.setState({ message: e.target.value })}
              placeholder="title"
              style={{
                border: "2px solid navy",
                color: "navy",
                marginBottom: "10px",
                breakInside: "avoid",
                padding: "2px 5px",
                borderRadius: "5px",
                display: "flex",
                resize: "vertical"
              }}
              required
            />
            {["oldBudget", "budget"].includes(this.props.collection) && (
              <input
                className="input"
                value={this.state.price}
                onChange={(e) => this.setState({ price: e.target.value })}
                placeholder="price"
                style={{
                  border: "2px solid navy",
                  color: "navy",
                  margin: "5px auto",
                  marginBottom: "10px",
                  breakInside: "avoid",
                  padding: "2px 5px",
                  borderRadius: "5px",
                  display: "flex",
                  resize: "vertical"
                }}
                required
              />
            )}
            {"departments" !== this.props.collection && (
              <div>
                <div
                  style={{
                    border: "0px solid white",
                    color: "navy",
                    breakInside: "avoid",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "flex-end",
                      right: "0px",
                      position: "relative"
                    }}
                  >
                    {["oldBudget", "budget"].includes(this.props.collection)
                      ? "Voting Day"
                      : this.props.collection === "ordinances"
                      ? "Instated"
                      : "Starts"}
                    &nbsp;&nbsp;
                    <div
                      onClick={this.props.click1}
                      style={{
                        backgroundColor: "navy",
                        color: "white",
                        breakInside: "avoid",
                        padding: "5px",
                        borderRadius: "2px",
                        fontSize: "10px"
                      }}
                    >
                      EDIT
                    </div>
                  </div>
                </div>
                {this.props.materialDate && (
                  <div
                    style={{
                      color: "navy",
                      marginBottom: "10px",
                      breakInside: "avoid",
                      padding: "2px 5px",
                      borderRadius: "5px",
                      display: "flex"
                    }}
                  >
                    {this.props.materialDate && "to"}&nbsp;
                    {this.props.materialDate &&
                      new Date(this.props.materialDate).toLocaleString()}
                  </div>
                )}
              </div>
            )}
            <div
              style={{
                borderTop: "1px solid rgb(160,160,160)",
                top: "0px",
                padding: "5px",
                display: "flex",
                position: "relative",
                width: "100%",
                minHeight: "30px",
                color: "black",
                flexDirection: "column",
                fontSize: "15px"
              }}
            >
              <div
                ref={this.textBox}
                style={{
                  maxHeight: "70vh",
                  minHeight: "30px",
                  width: "calc(100% - 14px)",
                  position: "absolute",
                  zIndex: "-9999",
                  wordBreak: "break-all"
                }}
              >
                {this.state.body.split("\n").map((item, i) => (
                  <span key={i}>
                    {item}
                    <br />
                  </span>
                ))}
              </div>
              <textarea
                className="input"
                value={this.state.body}
                onChange={(e) =>
                  this.setState({ body: e.target.value }, () => {
                    if (this.textBox && this.textBox.current) {
                      var textBoxHeight = this.textBox.current.offsetHeight;
                      this.setState({
                        textBoxHeight
                      });
                    }
                  })
                }
                placeholder={
                  "departments" === this.props.collection ? "desc" : "motion"
                }
                style={{
                  height: this.state.textBoxHeight,
                  maxHeight: "70vh",
                  position: "relative",
                  resize: "none",
                  wordBreak: "break-all",
                  display: "flex",
                  top: "0px",
                  left: "0%",
                  backgroundColor: "white",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: "20px",
                  textIndent: "10px",
                  minWidth: "98%",
                  maxWidth: "98%",
                  fontSize: "16px",
                  width: "80%",
                  marginBottom: "10px",
                  border: "2px solid navy",
                  color: "navy",
                  margin: "5px auto",
                  breakInside: "avoid",
                  padding: "2px 5px",
                  borderRadius: "5px"
                }}
                required
              />
            </div>
            <button type="submit">Post</button>
          </div>
          <div
            style={{
              height: "20px",
              display: "flex",
              position: "relative",
              width: "100%"
            }}
          >
            <div
              style={{
                border: "2px solid orange",
                display: "flex",
                right: "14px",
                position: "absolute"
              }}
              onClick={() => {
                if (this.state.message !== "" || this.state.body !== "") {
                  var answer = window.confirm(
                    `delete ${this.props.commtype} form progress? this cannot be undone`
                  );
                  if (answer) {
                    this.clear();
                  }
                } else {
                  this.clear();
                }
              }}
            >
              &times;
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default NewItem;
