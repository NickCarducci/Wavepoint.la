import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import GetPhotos from "../../.././Calendar/PouchDBpages/GetPhotos";
import firebase from "../../../.././init-firebase";
import back777 from "../../.././Icons/Images/back777.png";
import AddTickets from "./AddTickets";
import Recipients from "./Recipients";

class Edit extends React.Component {
  state = {};
  render() {
    const { drawerClasses, thisone, chosenEntity, collection } = this.props;
    return (
      <div
        className={drawerClasses} //edit
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            this.props.handleSubmitEvent();
          }}
        >
          <textarea
            className="eventopendescription1"
            type="text"
            name="body"
            id="body"
            value={this.props.body}
            onChange={this.props.handleChangeBody}
            placeholder="Write details here"
            autoComplete="off"
          />
          {(this.props.eventsInitial || this.props.jobInitial) && (
            <div className="dateordelete1">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  label="Due Date"
                  id="date"
                  value={this.props.materialDate}
                  onChange={this.props.handleChangeDate}
                  animateYearScrolling
                  showTodayButton={true}
                  disablePast={true}
                />
                <TimePicker
                  label="Time"
                  id="time"
                  value={this.props.materialDate}
                  onChange={this.props.handleChangeDate}
                  animateYearScrolling
                  disablePast={true}
                />
              </MuiPickersUtilsProvider>
            </div>
          )}

          <div>
            <button
              onClick={this.handleSubmitEvent}
              className="saveitbtn1"
              type="submit"
            >
              save
            </button>
            <div
              className="deletebtn1"
              onClick={() => {
                let answer = window.confirm(
                  "Are you sure you want to delete this?"
                );
                answer === true && this.onDelete(chosenEntity.id);
              }}
            >
              Delete
            </div>
          </div>
          {thisone ? (
            !thisone.privateToMembers ? (
              <div
                onClick={
                  chosenEntity.privateToCommunity
                    ? () =>
                        firebase
                          .firestore()
                          .collection(collection)
                          .doc(chosenEntity.id)
                          .update({
                            privateToCommunity: false
                          })
                    : () =>
                        firebase
                          .firestore()
                          .collection(collection)
                          .doc(chosenEntity.id)
                          .update({
                            privateToCommunity: true
                          })
                }
                style={{
                  height: "60px",
                  breakInside: "avoid",
                  backgroundColor: "white",
                  justifyContent: "center"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    position: "relative"
                  }}
                >
                  <div
                    style={
                      chosenEntity.privateToCommunity
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
                      chosenEntity.privateToCommunity
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
                </div>
                {chosenEntity.privateToCommunity
                  ? `private to members`
                  : "public chosenEntity"}
                <div
                  style={{
                    color: "rgb(120,120,220)",
                    fontSize: "12px"
                  }}
                >
                  admin control
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  marginTop: "40px",
                  height: "60px",
                  breakInside: "avoid",
                  backgroundColor: "white",
                  justifyContent: "center"
                }}
              >
                {collection.toUpperCase()} in {thisone.message} are private to
                members
                {this.props.auth !== undefined &&
                  (thisone.authorId === this.props.auth.uid ||
                    thisone.admin.includes(this.props.auth.uid)) &&
                  `. ${
                    thisone.authorId === this.props.auth.uid
                      ? "As author,"
                      : "As admin,"
                  } you can change this in community settings`}
              </div>
            )
          ) : null}

          {!this.state.editPhoto && this.props.chosenPhoto && (
            <div
              onClick={() => this.setState({ editPhoto: true })}
              style={{
                display: "flex",
                position: "fixed",
                height: "auto",
                width: "150px",
                overflow: "hidden",
                bottom: "116px",
                right: "0px",
                padding: "20px 10px",
                color: "black"
              }}
            >
              <img
                src={this.props.chosenPhoto && this.props.chosenPhoto.small}
                alt="error"
                className="imageplan"
              />
            </div>
          )}
          <div
            onClick={() => this.setState({ editPhoto: true })}
            style={{
              display: "flex",
              position: "fixed",
              height: "56px",
              width: "max-content",
              bottom: "56px",
              right: "0px",
              padding: "0px 10px",
              color: "black"
            }}
          >
            Change photo
          </div>
        </form>
        <Recipients
          chosenEntity={chosenEntity}
          collection={collection}
          user={this.props.user}
          auth={this.props.auth}
          users={this.props.users}
          admin={this.props.admin}
          id={this.props.id}
        />
        <div
          style={
            this.state.editPhoto
              ? {
                  bottom: "0px",
                  display: "flex",
                  position: "relative",
                  textAlign: "center",
                  alignItems: "flex-start",
                  fontSize: "26px",
                  color: "white",
                  width: "auto",
                  maxHeight: "40vh",
                  overflow: "hidden",
                  textDecoration: "none",
                  zIndex: "9999",
                  borderTop: "3px rgb(250, 250, 250) solid"
                }
              : {
                  bottom: "0px",
                  display: "none",
                  position: "relative",
                  textAlign: "center",
                  alignItems: "flex-start",
                  fontSize: "26px",
                  color: "white",
                  width: "auto",
                  maxHeight: "40vh",
                  overflow: "hidden",
                  textDecoration: "none",
                  zIndex: "9999",
                  borderTop: "3px rgb(250, 250, 250) solid"
                }
          }
        >
          <img
            src={this.props.chosenPhoto && this.props.chosenPhoto.large}
            alt="error"
            className="imageplan"
          />
          {this.state.editPhoto ? (
            <div
              className="cancelphoto"
              onClick={() =>
                this.setState({
                  editPhoto: false,
                  images: []
                })
              }
              style={
                this.props.chosenPhoto
                  ? {
                      display: "flex",
                      backgroundColor: "grey",
                      padding: "20px",
                      transform: "translateX(-100%)",
                      transition: ".3s ease-in",
                      fontSize: "20px",
                      justifyContent: "center",
                      alignItems: "center"
                    }
                  : {
                      display: "flex",
                      backgroundColor: "grey",
                      padding: "0px 20px",
                      paddingBottom: "20px",
                      transform: "translateX(0%)",
                      transition: ".3s ease-out",
                      fontSize: "1px"
                    }
              }
            >
              choose
            </div>
          ) : null}
          {this.props.chosenPhoto || this.state.editPhoto ? (
            <div
              className="cancelphoto"
              onClick={() => {
                this.props.choosePhoto(null);
                this.setState({
                  editPhoto: false,
                  images: []
                });
              }}
              style={{
                backgroundColor: "grey",
                padding: "0px 20px",
                paddingBottom: "20px"
              }}
            >
              &times;
            </div>
          ) : null}
        </div>
        <div
          style={
            this.state.editPhoto
              ? {
                  display: "flex",
                  position: "fixed",
                  width: "100%",
                  height: "40%",
                  bottom: "0px",
                  zIndex: "9999"
                }
              : { display: "none" }
          }
        >
          <GetPhotos
            choosePhoto={(x) =>
              this.props.choosePhoto({
                large: x.src.large,
                medium: x.src.medium,
                small: x.src.small,
                photographer: x.photographer,
                photographer_url: x.photographer_url
              })
            }
          />
        </div>
        {this.props.eventsInitial && (
          <AddTickets
            auth={this.props.auth}
            eventID={this.props.eventID}
            ticketCategories={this.props.ticketCategories}
          />
        )}
        <input
          className="eventopen_Headeredit1"
          type="text"
          name="message"
          id="message"
          value={this.props.message}
          onChange={this.props.handleChangeTitle}
          autoComplete="off"
          required
        />
        {this.props.pleaseNewClubname && <div>Please choose another name</div>}
        <img
          onClick={this.props.planEditCloser}
          src={back777}
          className="eventcloseback4"
          style={{ zIndex: "9999" }}
          alt="error"
        />
      </div>
    );
  }
}
export default Edit;
