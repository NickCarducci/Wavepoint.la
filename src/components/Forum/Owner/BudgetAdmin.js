import React from "react";
import firebase from "../../.././init-firebase.js";

class BudgetAdmin extends React.Component {
  state = { closeBillboard: true };
  componentDidMount = () => {
    this.props.community &&
      this.setState({
        earmarks: [],
        openWhat: "council",
        openWhen: "new",
        currentBudgetNew: this.props.community.currentBudget
          ? this.props.community.currentBudget
          : 0,
        taxDayNew:
          this.props.community.taxDay.seconds * 1000
            ? this.props.community.taxDay.seconds * 1000
            : new Date(),
        estimatedBudgetNew: this.props.community.estimatedBudget
          ? this.props.community.estimatedBudget
          : 0
      });
  };
  getMonthDays = (month, year) => {
    const months30 = [4, 6, 9, 11];
    const leapYear = year % 4 === 0;
    var f =
      month === 2 ? (leapYear ? 29 : 28) : months30.includes(month) ? 30 : 31;
    return f;
  };
  render() {
    const { columncount } = this.props;
    var spentThisYear = 0;
    var thisYear = this.props.oldBudget.filter(
      (x) =>
        new Date(x.date).getTime() >
        new Date(new Date().getFullYear(), 0, 1).getTime()
    );
    for (let i = 0; i < thisYear.length; i++) {
      spentThisYear = spentThisYear + thisYear[i].price;
    }
    var proposalTab = 0;
    for (let i = 0; i < this.props.forumPosts.length; i++) {
      proposalTab = proposalTab + this.props.forumPosts[i].price;
    }
    var month = [12, 9, 6, 3].find(
      (x) => Number(x) - new Date().getMonth() < 3
    );
    var year = new Date().getFullYear();
    //var thisone = new Date([year, month, this.getMonthDays(month, year)]);
    var thisone = new Date([year, month, 15]);
    return (
      <div
        style={{
          backgroundColor: "rgb(130,130,230)",
          color: "rgb(200,200,200)",
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
          borderBottom: "1px solid grey",
          overflowX: "hidden",
          overflowY: columncount === 1 ? "hidden" : "auto"
        }}
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
          {this.state.closeBillboard ? (
            <div
              onClick={() => this.setState({ closeBillboard: false })}
              style={{ display: "flex" }}
            >
              <div style={{ color: "rgb(110,250,90)" }}>
                {" "}
                {this.props.community.currentBudget - this.state.earmarks}
              </div>
              {/*<div
              style={{
                marginLeft: "4px",
                color: "grey",
                fontSize: "12px",
                border: "1px solid grey",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                height: "14px",
                right: "0px",
                wordBreak: "break-all",
                paddingRight: "3px"
              }}
            >
              left
            </div>*/}
              &nbsp;/&nbsp;
              <div style={{ color: "rgb(150,200,250)" }}>
                {" "}
                {this.props.community.currentBudget - proposalTab}
              </div>
              {/*<div
              style={{
                marginLeft: "4px",
                color: "grey",
                fontSize: "12px",
                border: "1px solid grey",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                height: "14px",
                right: "0px",
                wordBreak: "break-all",
                paddingRight: "3px"
              }}
            >
              proposed
            </div>*/}
              <div
                style={{
                  marginLeft: "4px",
                  color: "rgb(200,200,200)",
                  fontSize: "12px",
                  border: "1px solid rgb(200,200,200)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  height: "14px",
                  right: "0px",
                  wordBreak: "break-all",
                  paddingRight: "3px"
                }}
              >
                {this.props.isAdmin ? "edit" : "examine"}
              </div>
            </div>
          ) : (
            <div
              style={{ padding: "5px", border: "1px solid" }}
              onClick={() =>
                this.setState({
                  closeBillboard: true
                })
              }
            >
              &times;
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              firebase
                .firestore()
                .collection("communities")
                .doc(this.props.community.id)
                .update({
                  currentBudget: this.state.currentBudgetNew
                    ? this.state.currentBudgetNew
                    : this.props.community.currentBudget,
                  taxDay: this.state.standardTaxDay
                    ? thisone
                    : this.props.date
                    ? this.props.date
                    : this.props.community.taxDay.seconds * 1000,
                  estimatedBudget: this.state.estimatedBudgetNew
                    ? this.state.estimatedBudgetNew
                    : this.props.community.estimatedBudget
                })
                .catch((err) => console.log(err.message));
              this.setState({ edit1: false, edit2: false, edit3: false });
              this.props.clearMaterialDate();
            }}
            style={
              this.state.closeBillboard
                ? {
                    transform: "rotate(180deg)",
                    zIndex: "-1",
                    height: "0px",
                    color: "rgb(20,20,20)",
                    fontSize: "14px"
                  }
                : {
                    border: "1px solid",
                    color: "rgb(20,20,20)",
                    margin: "20px 20px",
                    fontSize: "14px"
                  }
            }
          >
            <div
              style={{
                color: "rgb(200,200,200)",
                padding: "10px 10px",
                display: "flex",
                width: "calc(100% - 20px)",
                justifyContent: "space-between",
                backgroundColor: "rgb(20,20,20)"
              }}
            >
              Total spent in {new Date().getFullYear()}:{" "}
              {spentThisYear ? spentThisYear : 0}
            </div>
            <div
              style={{
                margin: "10px 20px"
              }}
            >
              <div
                style={{
                  position: "relative",
                  border: "0px solid white",
                  breakInside: "avoid",
                  display: "flex"
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "flex-end",
                    left: "0px",
                    position: "relative",
                    color: "rgb(200,200,200)"
                  }}
                >
                  Cash
                </div>
                &nbsp;&nbsp;
                {this.props.auth !== undefined && this.props.isAdmin && (
                  <div
                    onClick={() => this.setState({ edit1: true })}
                    style={{
                      backgroundColor: "white",
                      color: "rgb(200,200,200)",
                      breakInside: "avoid",
                      padding: "5px",
                      borderRadius: "2px",
                      fontSize: "10px"
                    }}
                  >
                    EDIT
                  </div>
                )}
              </div>
              {this.state.edit1 ? (
                <input
                  value={this.state.currentBudgetNew}
                  onChange={(e) =>
                    this.setState({ currentBudgetNew: e.target.value })
                  }
                  style={{
                    border: "2px solid white",
                    color: "rgb(200,200,200)",
                    margin: "5px auto",
                    marginBottom: "10px",
                    breakInside: "avoid",
                    padding: "2px 5px",
                    borderRadius: "5px",
                    paddingRight: "40px",
                    display: "flex"
                  }}
                  required
                />
              ) : (
                <div
                  style={{
                    marginBottom: "10px",
                    breakInside: "avoid",
                    padding: "2px 5px",
                    borderRadius: "5px",
                    paddingRight: "40px",
                    display: "flex"
                  }}
                >
                  <div>{this.props.community.currentBudget}</div>
                </div>
              )}
              <div
                style={{
                  border: "0px solid white",
                  breakInside: "avoid",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {this.props.isAdmin && !this.state.standardTaxDay && (
                  <div
                    onClick={() => {
                      this.setState({ standardTaxDay: true });
                    }}
                    style={{
                      height: "min-content",
                      fontSize: "10px",
                      border: "1px solid",
                      width: "min-content",
                      padding: "2px",
                      borderRadius: "3px"
                    }}
                  >
                    reset
                  </div>
                )}
                <div
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "flex-end",
                    right: "0px",
                    position: "relative"
                  }}
                >
                  Tax Day&nbsp;&nbsp;
                  {this.props.auth !== undefined && this.props.isAdmin && (
                    <div
                      onClick={() => {
                        this.state.standardTaxDay &&
                          this.setState({ standardTaxDay: false });
                        this.props.materialDateOpener("futureOnly");
                        this.props.preserveAdmin();
                        this.props.clearMaterialDate();
                      }}
                      style={{
                        backgroundColor: "white",
                        color: "rgb(200,200,200)",
                        breakInside: "avoid",
                        padding: "5px",
                        borderRadius: "2px",
                        fontSize: "10px"
                      }}
                    >
                      EDIT
                    </div>
                  )}
                </div>
              </div>
              {this.state.standardTaxDay ||
              (this.props.date &&
                this.props.community.taxDay.seconds * 1000 !==
                  this.props.date) ? (
                <div
                  style={{
                    marginBottom: "10px",
                    breakInside: "avoid",
                    padding: "2px 5px",
                    borderRadius: "5px",
                    paddingRight: "40px",
                    display: "flex"
                  }}
                >
                  {!this.state.standardTaxDay &&
                    new Date(
                      this.props.community.taxDay.seconds * 1000
                    ).toLocaleDateString()}
                  {!this.state.standardTaxDay && <br />}
                  {this.props.date && "to"}&nbsp;
                  {this.state.standardTaxDay
                    ? new Date(thisone).toLocaleDateString()
                    : this.props.date &&
                      new Date(this.props.date).toLocaleDateString()}
                </div>
              ) : (
                <div
                  style={{
                    marginBottom: "10px",
                    breakInside: "avoid",
                    padding: "2px 5px",
                    borderRadius: "5px",
                    paddingRight: "40px",
                    display: "flex"
                  }}
                >
                  <div>
                    {new Date(
                      this.props.community.taxDay.seconds * 1000
                    ).toLocaleDateString()}
                  </div>
                </div>
              )}
              <div
                placeholder="Estimated budget"
                style={{
                  border: "0px solid white",
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
                  Estimated quarterly budget&nbsp;&nbsp;
                  {this.props.auth !== undefined && this.props.isAdmin && (
                    <div
                      onClick={() => this.setState({ edit3: true })}
                      style={{
                        backgroundColor: "white",
                        color: "rgb(200,200,200)",
                        breakInside: "avoid",
                        padding: "5px",
                        borderRadius: "2px",
                        fontSize: "10px"
                      }}
                    >
                      EDIT
                    </div>
                  )}
                </div>
              </div>
              {this.state.edit3 ? (
                <input
                  placeholder="Estimated budget"
                  value={this.state.estimatedBudgetNew}
                  onChange={(e) =>
                    this.setState({ estimatedBudgetNew: e.target.value })
                  }
                  style={{
                    border: "2px solid white",
                    color: "rgb(200,200,200)",
                    margin: "5px auto",
                    marginBottom: "10px",
                    breakInside: "avoid",
                    padding: "2px 5px",
                    borderRadius: "5px",
                    paddingRight: "40px",
                    display: "flex"
                  }}
                  required
                />
              ) : (
                <div
                  placeholder="Estimated budget"
                  style={{
                    marginBottom: "10px",
                    breakInside: "avoid",
                    padding: "2px 5px",
                    borderRadius: "5px",
                    paddingRight: "40px",
                    display: "flex"
                  }}
                >
                  <div>{this.props.community.estimatedBudget}</div>
                </div>
              )}
              {this.props.isAdmin &&
                this.props.community &&
                (this.state.currentBudgetNew !==
                  this.props.community.currentBudget ||
                  new Date(this.props.date).getTime() !==
                    new Date(
                      this.props.community.taxDay.seconds * 1000
                    ).getTime() ||
                  (this.state.started &&
                    new Date(thisone).getTime() !==
                      new Date(
                        this.props.community.taxDay.seconds * 1000
                      ).getTime()) ||
                  this.state.estimatedBudgetNew !==
                    this.props.community.estimatedBudget) && (
                  <button type="submit">Save</button>
                )}

              {/*<div
              style={{
                border: "0px solid white",
                breakInside: "avoid",
                display: "flex",
                marginLeft: "auto",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "flex-end",
                  right: "20px",
                  position: "relative",
                  color: "rgb(200,200,200)"
                }}
              >
                Current Budget - earmarks ={" "}
                {this.props.community.currentBudget - this.state.earmarks}
                <br />
                Cash - proposals ={" "}
                {this.props.community.currentBudget - proposalTab}
              </div>
            </div>*/}
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default BudgetAdmin;
