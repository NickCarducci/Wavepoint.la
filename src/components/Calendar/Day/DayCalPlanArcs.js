import React from "react";
import { withRouter } from "react-router-dom";
import * as shape from "d3-shape";
import ART from "react-art";
import "art/modes/svg";

const d3 = {
  shape
};

const { Surface, Group, Shape } = ART;

class PlanArcs extends React.Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth; // * 0.01;
    let height = window.innerHeight; // * 0.01;
    this.state = { selectedplan: "", width, height };
  }
  percentToColor(weight) {
    var color2 = [49, 171, 212];
    var color1 = [143, 136, 0];
    var w1 = weight;
    var w2 = 1 - w1;
    var timecolor = [
      Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2)
    ];
    return `rgb(${timecolor})`;
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
    const size = Math.min(this.state.height * 0.7, this.state.width * 0.7);
    //const size = Math.min(this.props.height * 0.7, this.props.width * 0.7);
    const outerRadius = Math.min(
      this.state.height * 0.15,
      this.state.width * 0.15
    );
    const innerRadius = Math.min(
      this.state.height * 0.14,
      this.state.width * 0.14
    );
    const width = size;
    const height = size;
    const x = width / 2;
    const y = height / 2;

    //free space below until return
    var le1 = [];
    var le = [];
    var count;
    for (count = 0; count < 24; count++)
      le1.push({
        //rangeChosen:86400000,
        hour: count
      });
    const f = this.props.chosen ? this.props.chosen : this.props.datecelestial;
    var lee = [];
    var counte;
    for (counte = 0; counte < 24; counte++) {
      if (counte > new Date().getHours()) {
        lee.push({
          //rangeChosen:86400000,
          hour: counte
        });
      }
    }
    if (new Date(f).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
      le = lee;
    } else if (
      new Date(f).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    ) {
      le = le1;
    } else {
      le = [];
    }
    var theseplans = [];
    this.props.notes
      .sort((a, b) => {
        return a.date > b.date ? 1 : -1;
      })
      .map((plan, index) => {
        const browsing = new Date(f);
        const browsingzero = browsing.setHours(0, 0, 0, 0);
        const plandate = new Date(plan.date);
        const plandatezero = plandate.setHours(0, 0, 0, 0);
        if (plandatezero === browsingzero) {
          return theseplans.push(plan);
        } else return null;
      });

    var theseschedule = [];
    this.props.schedule
      .sort((a, b) => {
        return a.date > b.date ? 1 : -1;
      })
      .map((invite, index) => {
        const f = this.props.chosen
          ? this.props.chosen
          : this.props.datecelestial;

        const browsing = new Date(f);
        const browsingzero = browsing.setHours(0, 0, 0, 0);
        const plandate = new Date(invite.date);
        const plandatezero = plandate.setHours(0, 0, 0, 0);
        if (plandatezero === browsingzero) {
          return theseschedule.push(invite);
        } else return null;
      });

    var theseinvites = [];
    this.props.invites
      .sort((a, b) => {
        return a.date > b.date ? 1 : -1;
      })
      .map((invite, index) => {
        const f = this.props.chosen
          ? this.props.chosen
          : this.props.datecelestial;

        const browsing = new Date(f);
        const browsingzero = browsing.setHours(0, 0, 0, 0);
        const plandate = new Date(invite.date);
        const plandatezero = plandate.setHours(0, 0, 0, 0);
        if (plandatezero === browsingzero) {
          return theseinvites.push(invite);
        } else return null;
      });

    var theseevents = [];
    this.props.eventsInitial &&
      this.props.events
        .sort((a, b) => {
          return a.date > b.date ? 1 : -1;
        })
        .map((event, index) => {
          const f = this.props.chosen
            ? this.props.chosen
            : this.props.datecelestial;

          const browsing = new Date(f);
          const browsingzero = browsing.setHours(0, 0, 0, 0);
          const plandate = new Date(event.date);
          const plandatezero = plandate.setHours(0, 0, 0, 0);
          if (plandatezero === browsingzero) {
            return theseevents.push(event);
          } else return null;
        });

    //
    return (
      <Surface width={width} height={height}>
        <Group x={x} y={y}>
          {this.props.notes
            .sort((a, b) => {
              return a.date > b.date ? 1 : -1;
            })
            .map((plan, index) => {
              const todayalright = new Date(plan.date);

              const startAngleRad1 =
                ((todayalright.getHours() / 24) * 360 * Math.PI) / 180 +
                ((todayalright.getMinutes() / 60) * (360 / 24) * Math.PI) / 180;
              const timespan = ((plan.rangeChosen / 24) * 360 * Math.PI) / 180;
              const endAngleRad1 =
                startAngleRad1 + (plan.rangeChosen ? timespan : 0.25);

              const arcGenerato = d3.shape
                .arc()
                .outerRadius(outerRadius + 60)
                .innerRadius(innerRadius + 50)
                .startAngle(Number(startAngleRad1.toFixed(5)))
                .endAngle(Number(endAngleRad1.toFixed(5)));

              const f = this.props.chosen
                ? this.props.chosen
                : this.props.datecelestial;

              const browsing = new Date(f);
              const browsingzero = browsing.setHours(0, 0, 0, 0);
              const plandate = new Date(plan.date);
              const plandatezero = plandate.setHours(0, 0, 0, 0);
              if (
                plandatezero === browsingzero &&
                (this.props.plansShowing || !this.props.inviteInitial)
              ) {
                return (
                  <Shape
                    //key="arc"
                    key={index}
                    d={arcGenerato()}
                    stroke={"rgb(49,171,212)"}
                    strokeWidth="3"
                    fill={"rgb(49,171,212, .6)"}
                    onClick={() => {
                      this.props.history.push(`/plan/${plan._id}`);
                    }}
                  />
                );
              } else return null;
            })}
          {this.props.invites //or events in entity chat
            .sort((a, b) => {
              return a.date > b.date ? 1 : -1;
            })
            .map((plan, index) => {
              const todayalright = new Date(plan.date);

              const startAngleRad1 =
                ((todayalright.getHours() / 24) * 360 * Math.PI) / 180 +
                ((todayalright.getMinutes() / 60) * (360 / 24) * Math.PI) / 180;
              const endAngleRad1 = startAngleRad1 + 0.3;

              const arcGenerato = d3.shape
                .arc()
                .outerRadius(outerRadius + 60)
                .innerRadius(innerRadius + 50)
                .startAngle(Number(startAngleRad1.toFixed(5)))
                .endAngle(Number(endAngleRad1.toFixed(5)));

              const f = this.props.chosen
                ? this.props.chosen
                : this.props.datecelestial;
              const browsing = new Date(f);
              const browsingzero = browsing.setHours(0, 0, 0, 0);
              const plandate = new Date(plan.date);
              const plandatezero = plandate.setHours(0, 0, 0, 0);
              if (plandatezero === browsingzero) {
                return (
                  <Shape
                    //key="arc"
                    key={index}
                    d={arcGenerato()}
                    stroke={"rgb(169,129,220)"}
                    strokeWidth="1"
                    fill={"rgba(169,129,220, .6)"}
                    onClick={() => {
                      if (plan.id && String(plan.id).length < 10) {
                        this.props.history.push(
                          `/events/edmtrain/${plan._id ? plan._id : plan.id}`
                        );
                      } else if (this.props.eventInitial) {
                        this.props.history.push(
                          `/event/${plan._id ? plan._id : plan.id}`
                        );
                      } else {
                        this.props.history.push(`/plan/${plan._id}`);
                      }
                    }}
                  />
                );
              } else return null;
            })}

          {
            //free space
            /*this.props.notes
            .sort((a, b) => {
              return a.date > b.date ? 1 : -1;
            })*/
            le.map((slot, index) => {
              //new
              const todayalright = new Date(
                new Date(this.props.chosen).setHours(slot.hour, 0, 0, 0)
              );
              const startAngleRad1 =
                ((todayalright.getHours() / 24) * 360 * Math.PI) / 180 +
                ((todayalright.getMinutes() / 60) * (360 / 24) * Math.PI) / 180;
              const timespan = ((slot.rangeChosen / 24) * 360 * Math.PI) / 180;
              const endAngleRad1 =
                startAngleRad1 + (slot.rangeChosen ? timespan : 0.25);

              const arcGenerato = d3.shape
                .arc()
                .outerRadius(outerRadius + 60)
                .innerRadius(innerRadius + 50)
                .startAngle(Number(startAngleRad1.toFixed(5)))
                .endAngle(Number(endAngleRad1.toFixed(5)));

              const f = this.props.chosen
                ? this.props.chosen
                : this.props.datecelestial;

              const browsing = new Date(f);
              const browsingzero = browsing.setHours(0, 0, 0, 0);
              //new
              const plandate = new Date(
                new Date(this.props.chosen).setHours(slot.hour, 0, 0, 0)
              );
              const plandatezero = plandate.setHours(0, 0, 0, 0);
              var thisplan = theseplans.find((x) => {
                var planDate = new Date(x.date);
                var rangeChosen = x.rangeChosen ? x.rangeChosen : 0.3 * 86400;

                return (
                  planDate.getHours() - 1 < slot.hour &&
                  new Date(planDate.getTime() + rangeChosen).getHours() + 2 >
                    slot.hour
                );
              });
              var thisschedule = theseschedule.find((x) => {
                var scheduleDate = new Date(x.date);
                var rangeChosen = x.rangeChosen ? x.rangeChosen : 0.3 * 86400;
                return (
                  scheduleDate.getHours() - 1 < slot.hour &&
                  new Date(scheduleDate.getTime() + rangeChosen).getHours() +
                    2 >
                    slot.hour
                );
              });
              var thisinvite = theseinvites.find((x) => {
                var inviteDate = new Date(x.date);
                var rangeChosen = x.rangeChosen ? x.rangeChosen : 0.3 * 86400;
                return (
                  inviteDate.getHours() - 1 < slot.hour &&
                  new Date(inviteDate.getTime() + rangeChosen).getHours() + 2 >
                    slot.hour
                );
              });
              var thisevent = theseevents.find((x) => {
                var eventDate = new Date(x.date);
                var rangeChosen = x.rangeChosen ? x.rangeChosen : 0.3 * 86400;
                return (
                  eventDate.getHours() - 1 < slot.hour &&
                  new Date(eventDate.getTime() + rangeChosen).getHours() + 2 >
                    slot.hour
                );
              });
              if (
                withRouter &&
                plandatezero === browsingzero &&
                !thisplan &&
                !thisinvite &&
                !thisevent &&
                !thisschedule
              ) {
                var today = new Date().getTime() / 1000;

                var eventDate = new Date(todayalright).getTime() / 1000;

                var chopped = (eventDate - today) / 86400;
                var colorTime = chopped.toString().substr(0, 3);
                return (
                  <Shape
                    //key="arc"
                    key={index}
                    d={arcGenerato()}
                    stroke={this.percentToColor(colorTime / 30)}
                    strokeWidth="3"
                    fill={"rgb(49,171,212, .01)"}
                    onClick={() => {
                      this.props.history.push(
                        `/new/${todayalright.getFullYear()}-${
                          todayalright.getMonth() + 1
                        }-${todayalright.getDate()}/${todayalright.getHours()}:${todayalright.getMinutes()}`
                      );
                    }}
                  />
                );
              } else {
                return null;
              }
            })
          }
          {this.props.schedule //invites in entity chat
            .sort((a, b) => {
              return a.date > b.date ? 1 : -1;
            })
            .map((plan, index) => {
              const todayalright = new Date(plan.date);

              const startAngleRad1 =
                ((todayalright.getHours() / 24) * 360 * Math.PI) / 180 +
                ((todayalright.getMinutes() / 60) * (360 / 24) * Math.PI) / 180;
              const endAngleRad1 = startAngleRad1 + 0.3;

              const arcGenerato = d3.shape
                .arc()
                .outerRadius(outerRadius + 60)
                .innerRadius(innerRadius + 50)
                .startAngle(Number(startAngleRad1.toFixed(5)))
                .endAngle(Number(endAngleRad1.toFixed(5)));

              const f = this.props.chosen
                ? this.props.chosen
                : this.props.datecelestial;

              const browsing = new Date(f);
              const browsingzero = browsing.setHours(0, 0, 0, 0);
              const plandate = new Date(plan.date);
              const plandatezero = plandate.setHours(0, 0, 0, 0);
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
                if (plandatezero === browsingzero) {
                  return (
                    <Shape
                      //key="arc"
                      key={index}
                      d={arcGenerato()}
                      stroke={"rgb(169,129,220)"}
                      strokeWidth="1"
                      fill={"rgba(169,129,220, .6)"}
                      onClick={() => {
                        if (plan.id && String(plan.id).length < 10) {
                          this.props.history.push(
                            `/events/edmtrain/${plan._id ? plan._id : plan.id}`
                          );
                        } else if (this.props.eventInitial) {
                          this.props.history.push(
                            `/event/${plan._id ? plan._id : plan.id}`
                          );
                        } else {
                          this.props.history.push(`/plan/${plan._id}`);
                        }
                      }}
                    />
                  );
                } else return null;
              } else return null;
            })}
        </Group>
      </Surface>
    );
  }
}
export default withRouter(PlanArcs);

/*<Link to={{ pathname: `/plans/${this.state.selectedplan}` }}>*/
