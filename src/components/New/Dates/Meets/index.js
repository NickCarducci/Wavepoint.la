import React from "react";
import { arrayMessage } from "../../../../widgets/authdb";

class Meets extends React.Component {
  render() {
    const { meets } = this.props;
    return (
      <div>
        {meets.map((x, i) => {
          return (
            <div
              style={{
                backgroundColor: "rgb(20,20,40)",
                padding: "10px",
                color: "white"
              }}
            >
              <div
                onClick={() => {
                  var meetss = meets.filter((y, index) => {
                    return i !== index;
                  });
                  this.setState({ meets: meetss });
                }}
              >
                &times;
              </div>
              <div>{x.eow ? "every other week" : "every week"}</div>
              <div>
                {x.days.map((x) => {
                  return <div>{x}</div>;
                })}
              </div>
              <div>{new Date(x.timeStart).toLocaleTimeString()}</div>
              <div>{this.getTimeZone(new Date(this.state.timeStart))}</div>
              <div>{x.times} hours</div>
              <div>{x.classroom}</div>
              <div>{x.goodCenter}</div>
            </div>
          );
        })}
        {this.props.chooseMeets && (
          <div
            style={{ marginTop: "10px" }}
            onClick={() => {
              var messageAsArray = arrayMessage(this.state.message);
              this.props.post({
                messageAsArray,
                place_name: this.state.goodplace_name,
                center: this.state.goodCenter,
                authorId: this.props.auth.uid,
                communityId: this.props.community.id,
                admin: [this.props.auth.uid],
                members: [this.props.auth.uid],
                classroom: this.state.classroom,
                meets: meets,
                type: this.props.classTyped,
                message: this.state.message,
                body: this.state.body,
                date: this.state.startDate,
                endDate: this.state.endDate,
                time: new Date()
              });
              this.setState({
                message: "",
                body: ""
              });
            }}
          >
            Finish
          </div>
        )}
      </div>
    );
  }
}
export default Meets;
