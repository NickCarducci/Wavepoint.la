import React from "react";
import * as shape from "d3-shape";
import ART from "react-art";
import "art/modes/svg";
const d3 = {
  shape
};

const { Surface, Group, Shape } = ART;

class TodayPlans extends React.Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth; // * 0.01;
    let height = window.innerHeight; // * 0.01;
    this.state = { width, height };
    this.myInput = React.createRef();
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
  }
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      let width = this.state.width; // * 0.01;
      let height = this.state.height; // * 0.01;
      document.documentElement.style.setProperty("--vw", `${width}px`);
      document.documentElement.style.setProperty("--vh", `${height}px`);
      width = this.state.width;
      height = this.state.height;
      this.setState({
        width,
        height
      });
    }, 200);
  };
  componentDidMount = () => {
    this.refresh();
    window.addEventListener("resize", this.refresh);
  };
  render() {
    var _datezero = this.props._date;
    _datezero.setHours(0, 0, 0, 0);
    /*
    const size = Math.min(
      this.state.height * 0.059,
      window.innerWidth * 0.059
    );*/
    const outerRadius = this.props.smallplz
      ? Math.min(this.state.height * 0.045, 20) * 0.5
      : Math.min(this.state.height * 0.045, 20);
    const innerRadius = this.props.smallplz
      ? Math.min(this.state.height * 0.04, 20) * 0.5
      : Math.min(this.state.height * 0.04, 20);
    return (
      <div ref={this.myInput} className={"containplanscal"}>
        {this.myInput.current && (
          <Surface
            style={{
              justifyContent: "center",
              alignItems: "center",
              transform: "rotate(180deg)"
            }}
            width={"100%"}
            height={"100%"}
          >
            <Group //x={"100%"} y={"100%"}
              x={"100%" / 2}
              y={"100%" / 2}
            >
              {this.props.thePlans.map((plan, index) => {
                var plandate = new Date(plan.date);
                var plandate1 = new Date(plan.date);
                plandate.setHours(0, 0, 0, 0);
                var startAngleRad1 =
                  ((plandate1.getHours() / 24) * 360 * Math.PI) / 180 +
                  ((plandate1.getMinutes() / 60) * (360 / 24) * Math.PI) / 180;
                const timespan =
                  ((plan.rangeChosen / 24) * 360 * Math.PI) / 180;
                const endAngleRad1 =
                  startAngleRad1 + (plan.rangeChosen ? timespan : 0.25);
                const arcGenerato = d3.shape
                  .arc()
                  .outerRadius(outerRadius)
                  .innerRadius(innerRadius)
                  .startAngle(Number(startAngleRad1.toFixed(5)))
                  .endAngle(Number(endAngleRad1.toFixed(5)));
                if (
                  _datezero.getTime() === plandate.getTime() &&
                  (this.props.plansShowing || !this.props.inviteInitial)
                ) {
                  return (
                    <Shape
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        position: "absolute"
                      }}
                      key={index}
                      //ref={plan._id + "note"}
                      d={arcGenerato()}
                      stroke={"rgb(49,212,212)"}
                      strokeWidth="1"
                      fill={"rgba(49,212,212, .6)"}
                    />
                  );
                } else return null;
              })}
              {(this.props.freetime
                ? this.props.calendar
                : this.props.invitesFromEntityChat
                ? this.props.schedule //invites if entity chat
                : this.props.invites
              ) //events if entity chat
                .map((plan, index) => {
                  var plandate = new Date(plan.date);
                  var plandate1 = new Date(plan.date);
                  plandate.setHours(0, 0, 0, 0);
                  var startAngleRad1 =
                    ((plandate1.getHours() / 24) * 360 * Math.PI) / 180 +
                    ((plandate1.getMinutes() / 60) * (360 / 24) * Math.PI) /
                      180;
                  var endAngleRad1 = startAngleRad1 + 0.3;
                  const arcGenerato = d3.shape
                    .arc()
                    .outerRadius(outerRadius)
                    .innerRadius(innerRadius)
                    .startAngle(Number(startAngleRad1.toFixed(5)))
                    .endAngle(Number(endAngleRad1.toFixed(5)));
                  if (
                    _datezero.getTime() === plandate.getTime() &&
                    (this.props.members.includes(plan.authorId) ||
                      this.props.members.length === 0)
                  ) {
                    return (
                      <Shape
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          position: "absolute"
                        }}
                        key={index}
                        //ref={plan.id + "planref"}
                        d={arcGenerato()}
                        stroke={"rgb(169,129,220)"}
                        strokeWidth="1"
                        fill={"rgba(169,129,220, .6)"}
                      />
                    );
                  } else return null;
                })}
              {this.props.assignments.map((plan, index) => {
                var plandate = new Date(plan.date);
                var plandate1 = new Date(plan.date);
                plandate.setHours(0, 0, 0, 0);
                var startAngleRad1 =
                  ((plandate1.getHours() / 24) * 360 * Math.PI) / 180 +
                  ((plandate1.getMinutes() / 60) * (360 / 24) * Math.PI) / 180;
                var endAngleRad1 = startAngleRad1 + 0.3;
                const arcGenerato = d3.shape
                  .arc()
                  .outerRadius(outerRadius)
                  .innerRadius(innerRadius)
                  .startAngle(Number(startAngleRad1.toFixed(5)))
                  .endAngle(Number(endAngleRad1.toFixed(5)));
                if (_datezero.getTime() === plandate.getTime()) {
                  return (
                    <Shape
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        position: "absolute"
                      }}
                      key={index}
                      //ref={plan.id + "planref"}
                      d={arcGenerato()}
                      stroke={"rgb(150, 200, 150)"}
                      strokeWidth="1"
                      fill={"rgba(150, 200, 150, .6)"}
                    />
                  );
                } else return null;
              })}
              {this.props.events.map((plan, index) => {
                var plandate = new Date(plan.date.seconds * 1000);
                var plandate1 = new Date(plan.date.seconds * 1000);
                plandate.setHours(0, 0, 0, 0);
                var startAngleRad1 =
                  ((plandate1.getHours() / 24) * 360 * Math.PI) / 180 +
                  ((plandate1.getMinutes() / 60) * (360 / 24) * Math.PI) / 180;
                var endAngleRad1 = startAngleRad1 + 0.3;
                const arcGenerato = d3.shape
                  .arc()
                  .outerRadius(outerRadius)
                  .innerRadius(innerRadius)
                  .startAngle(Number(startAngleRad1.toFixed(5)))
                  .endAngle(Number(endAngleRad1.toFixed(5)));
                var community =
                  plan.communityId &&
                  this.props.communities.find((h) => h.id === plan.communityId);
                if (
                  !community ||
                  (community.privateToMembers &&
                    !(
                      this.props.auth === undefined ||
                      this.props.auth.uid === community.authorId ||
                      (community.admin &&
                        community.admin.includes(this.props.auth.uid)) ||
                      (community.faculty &&
                        community.faculty.includes(this.props.auth.uid)) ||
                      (community.members &&
                        community.members.includes(this.props.auth.uid))
                    ))
                ) {
                  if (_datezero.getTime() === plandate.getTime()) {
                    return (
                      <Shape
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          position: "absolute"
                        }}
                        key={index}
                        //ref={plan.id + "planref"}
                        d={arcGenerato()}
                        stroke={"rgb(150, 200, 150)"}
                        strokeWidth="1"
                        fill={"rgba(150, 200, 150, .6)"}
                      />
                    );
                  } else return null;
                } else return null;
              })}
            </Group>
          </Surface>
        )}
      </div>
    );
  }
}
export default TodayPlans;
