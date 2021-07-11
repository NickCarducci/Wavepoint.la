import React from "react";
import arrowright from "../.././Icons/Images/arrowright.png";
import dayjs from "dayjs";
import { specialFormatting } from "../../../widgets/authdb";
export const WEEK_DAYS = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY"
};

class Submit extends React.Component {
  render() {
    function renderTime(materialDate) {
      let d = dayjs(materialDate);
      return d.format("h:mm a");
    }
    function renderDate(materialDate) {
      let d = dayjs(materialDate);
      return d.format("MMMM D YYYY");
    }
    const {
      closed,
      pleaseNewClubname,
      chosenPhoto,
      materialDate,
      askForPhotos
    } = this.props;
    var datenotime = new Date();
    datenotime.setHours(
      materialDate.getHours(),
      materialDate.getMinutes(),
      0,
      0
    );
    materialDate.setSeconds(0);
    materialDate.setMilliseconds(0);
    var diffDays = Math.round(
      (datenotime.getTime() - materialDate.getTime()) / 86400000
    );
    var is_negative = diffDays < 0;
    return (
      <form
        onSubmit={this.props.submit}
        style={{
          display: "flex"
        }}
      >
        {closed ? (
          <div className="todaytomorrowevento">
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: "20px"
              }}
            >
              {diffDays === 0
                ? `${WEEK_DAYS[materialDate.getDay()]} ${renderDate(
                    materialDate
                  )}`
                : diffDays === -1
                ? `${WEEK_DAYS[materialDate.getDay()]} ${renderDate(
                    materialDate
                  )}`
                : diffDays === 1
                ? `${WEEK_DAYS[materialDate.getDay()]} ${renderDate(
                    materialDate
                  )}`
                : is_negative
                ? `${WEEK_DAYS[materialDate.getDay()]} ${renderDate(
                    materialDate
                  )}`
                : `${WEEK_DAYS[materialDate.getDay()]} ${renderDate(
                    materialDate
                  )}`}
              <br />
              {
                diffDays === 0
                  ? renderTime(materialDate)
                  : renderTime(materialDate) //note.date.toLocaleString([], { hour12: true })
              }
              ,&nbsp;
              {diffDays === 0
                ? `TODAY`
                : diffDays === -1
                ? `TOMORROW`
                : diffDays === 1
                ? `YESTERDAY`
                : is_negative
                ? `in ${Math.abs(diffDays)} days`
                : `${diffDays} days ago`}
            </div>
          </div>
        ) : null}
        {closed && chosenPhoto && !this.props.submitPaused ? (
          <div
            className="cancelphoto"
            onClick={() =>
              this.props.changeState({
                message: "",
                chosenPhoto: null,
                images: []
              })
            }
          >
            &times;
          </div>
        ) : null}
        <button>
          <img
            type="button"
            src={arrowright}
            className="arrowright1o"
            alt="error"
          />
        </button>
        {this.props.planInitial && (
          <div
            onClick={
              askForPhotos
                ? () => this.props.changeState({ askForPhotos: false })
                : () => this.props.changeState({ askForPhotos: true })
            }
            style={{
              borderRadius: "10px",
              border: askForPhotos ? "1px solid white" : "0px solid white",
              zIndex: "9999",
              display: "flex",
              position: "fixed",
              color: askForPhotos ? "white" : "rgb(150,150,150)",
              top: "76px",
              paddingRight: "15px",
              paddingTop: "15px",
              paddingLeft: "4px",
              height: "21px",
              width: "45px",
              right: "30px"
            }}
          >
            +Pic
          </div>
        )}
        <input
          type="text"
          value={this.props.message}
          name="message"
          id="message"
          maxLength="24"
          className={
            !this.props.planInitial || askForPhotos
              ? "titleofevento"
              : "titleofeventp"
          }
          placeholder="Title"
          //autoFocus={true}
          autoComplete="off"
          onFocus={() => window.scrollTo(0, 0)}
          //onClick={this.focus}
          ref={this.textInput}
          required
          autoCorrect="off"
          onChange={(e) => 
            this.props.changeState({ pleaseNewClubname: false,message:specialFormatting(e.target.value) })
          }
          onKeyUp={this.props.keyUp}
          style={{
            color:
              !this.props.planInitial || askForPhotos
                ? "white"
                : "rgb(150,150,150)"
          }}
        />
        {chosenPhoto && (
          <div
            style={{
              display: "flex",
              position: "fixed",
              textAlign: "center",
              width: "100%",
              height: "40%",
              bottom: "0%",
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 1)",
              border: "none",
              fontSize: "26px",
              zIndex: "9999"
            }}
          />
        )}
        {pleaseNewClubname && (
          <div
            className="titleofevento"
            style={{ color: "white", transform: "translateY(-100%)" }}
          >
            Please choose another clubname, or make it elsewhere than{" "}
            {pleaseNewClubname}
          </div>
        )}
      </form>
    );
  }
}
export default Submit;
