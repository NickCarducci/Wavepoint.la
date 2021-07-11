import React from "react";
import { NaturalCurve } from "react-svg-curve";

class USBudget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intexp: [],
      intDates: [],
      intValues: [],
      outlays: [],
      outDates: [],
      outValues: [],
      recValues: [],
      gifts: [],
      giftValues: [],
      giftDates: [],
      bondsNetting: [],
      bonds: [],
      bondNewValues: [],
      bondDates: [],
      bondRedemptionRatios: [],
      chosenTimePeriod: 3.75
    };
    this.wholething = React.createRef();
  }
  componentDidMount = () => {
    this.getBudget(3.75);
  };
  padDate = (record_date) => {
    const dateArr = record_date.split("-");
    const stringMonth = String(Number(dateArr[1]));
    var paddedMonth =
      stringMonth.length === 1 ? `0${stringMonth}` : stringMonth;
    const stringDate = String(Number(dateArr[2]));
    var paddedDate = stringDate.length === 1 ? `0${stringDate}` : stringDate;
    const paddedFullDate = `${Number(dateArr[0])}-${
      paddedMonth.length === 1 ? `0${paddedMonth}` : paddedMonth
    }-${paddedDate.length === 1 ? `0${paddedDate}` : paddedDate}`;
    return paddedFullDate;
  };
  getBudget = (timePeriod) => {
    var intDate = new Date(new Date().getTime() - 31556952000 * timePeriod);
    const intURL =
      `https://api.fiscaldata.treasury.gov/services/api/fiscal_service` +
      `/v2/accounting/od/interest_expense?page[number]=1&page[size]=100` +
      `&fields=record_date,month_expense_amt` +
      //`,country_currency_desc,exchange_rate` +
      `&filter=record_date:gte:${intDate.getFullYear()}-${
        intDate.getMonth() + 1
      }-${intDate.getDate()}`;
    //`country_currency_desc:in:(CANADA-DOLLAR,MEXICO-PESO),exchange_rate`data_date

    fetch(intURL)
      .then(async (res) => await res.json())
      .then(async (result) => {
        /*let stateNames = [];
        result.data.map((x) => {
          stateNames.push(x.state_nm);
        });*/
        let intexp = [];
        let intDates = [];
        let intValues = [];
        result.data.map((data) => {
          const intDate = new Date(this.padDate(data.record_date)).getTime();
          const intValue = Number(data.month_expense_amt);
          intDates.push(intDate);
          intValues.push(intValue);
          return intexp.push({ intDate, intValue });
        });
        this.setState({ intexp, intValues, intDates });
        const outURL =
          `https://api.fiscaldata.treasury.gov/services/api/fiscal_service` +
          `/v1/accounting/mts/mts_table_1?page[number]=1&page[size]=100` +
          `&fields=record_date,current_month_gross_rcpt_amt,` +
          `current_month_gross_outly_amt` +
          //`,current_month_refund_amt` +
          `&filter=record_date:gte:${intDate.getFullYear()}-${
            intDate.getMonth() + 1
          }-${intDate.getDate()}`;
        return fetch(outURL)
          .then(async (res) => await res.json())
          .then((result) => {
            let outlays = [];
            let outDates = [];
            let outValues = [];
            let recValues = [];
            result.data.map((data) => {
              const outDate = new Date(
                this.padDate(data.record_date)
              ).getTime();
              const outValue = Number(data.current_month_gross_outly_amt);
              const recValue = Number(data.current_month_gross_rcpt_amt);
              outDates.push(outDate);
              outValues.push(outValue);
              recValues.push(recValue);
              return outlays.push({ outDate, outValue, recValue });
            });
            this.setState({ outlays, outValues, outDates, recValues });
          })
          .then(() => {
            const giftURL =
              `https://api.fiscaldata.treasury.gov/services/api/fiscal_service` +
              `/v2/accounting/od/gift_contributions?page[number]=1&page[size]=100` +
              `&fields=record_date,contribution_amt` +
              `&filter=record_date:gte:${intDate.getFullYear()}-${
                intDate.getMonth() + 1
              }-${intDate.getDate()}`;
            fetch(giftURL)
              .then(async (res) => await res.json())
              .then((result) => {
                let gifts = [];
                let giftDates = [];
                let giftValues = [];
                result.data.map((data) => {
                  const giftDate = new Date(
                    this.padDate(data.record_date)
                  ).getTime();
                  const giftValue = Number(data.contribution_amt);
                  giftDates.push(giftDate);
                  giftValues.push(giftValue);
                  return gifts.push({ giftDate, giftValue });
                });
                this.setState({ gifts, giftValues, giftDates });
              })
              .then(() => {
                const bondURL =
                  `https://api.fiscaldata.treasury.gov/services/api/fiscal_service` +
                  `/v1/accounting/od/slgs_savings_bonds?page[number]=1&page[size]=${
                    timePeriod === 3.75
                      ? "1000"
                      : timePeriod === 3.75
                      ? "1500"
                      : "2000"
                  }` +
                  `&fields=record_date,issued_pieces_amt,issued_pieces_cnt` +
                  `,redeemed_pieces_amt,redeemed_pieces_cnt` +
                  `,outstanding_pieces_amt,outstanding_pieces_cnt` +
                  `&filter=record_date:gte:${intDate.getFullYear()}-${
                    intDate.getMonth() + 1
                  }-${intDate.getDate()}`;
                fetch(bondURL)
                  .then(async (res) => await res.json())
                  .then((result) => {
                    let bondsNetting = [];
                    let bonds = [];
                    let bondDates = [];
                    let bondNewValues = [];
                    let bondRedemptionRatios = [];
                    result.data.map((data) => {
                      const bondDate = new Date(
                        this.padDate(data.record_date)
                      ).getTime();
                      const bondNewValue = Math.round(
                        data.issued_pieces_cnt * data.issued_pieces_amt
                      );
                      const bondRedemptionRatio =
                        Math.round(
                          data.redeemed_pieces_cnt * data.redeemed_pieces_amt
                        ) /
                        Math.round(
                          data.outstanding_pieces_cnt *
                            data.outstanding_pieces_amt
                        );
                      if (!isNaN(bondNewValue)) {
                        bondDates.push(bondDate);
                        bondNewValues.push(bondNewValue);
                        bondRedemptionRatios.push(bondRedemptionRatio);
                        bonds.push({
                          bondDate,
                          bondNewValue
                        });
                        return bondsNetting.push({
                          bondDate,
                          bondRedemptionRatio
                        });
                      } else return null;
                    });
                    this.setState({
                      bondsNetting,
                      bonds,
                      bondNewValues,
                      bondDates,
                      bondRedemptionRatios
                    });
                  })
                  .then(() => {
                    /*var paddedMonth = String(intDate.getMonth() + 1);
                    var paddedDate = String(intDate.getMonth() + 1);
                    const fredURL =
                      `https://cors-anywhere.herokuapp.com/https://api.stlouisfed.org/fred/series?` +
                      `series_id=ASTDSL&realtime_start=${intDate.getFullYear()}-${
                        paddedMonth.length === 1
                          ? `0${paddedMonth}`
                          : paddedMonth
                      }-${
                        paddedDate.length === 1 ? `0${paddedDate}` : paddedDate
                      }` +
                      `&api_key=927192355a23249376810acc389bb367&file_type=json`;
                    //https://stackoverflow.com/questions/20778930/http-get-federal-reserve-api-wont-work
                    //AHHHHHHHHHHHHHH
                    fetch(fredURL)
                      //.then(async (res) => await res.json())
                      .then((result) => {
                        //const intDate = new Date(result.realtime_start).getTime();
                      })
                      .catch((err) => {
                      });*/
                  })
                  .catch((err) => {
                    console.log("error");
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log("error");
                console.log(err);
              });
          })
          .catch((err) => {
            console.log("error");
            console.log(err);
          });
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
      });
  };
  handleTooltipMove = (ev, lowestDates, highestDates) => {
    const e = ev.touches ? ev.touches[0] : ev;
    const tooltipLeft = e.pageX - this.wholething.current.offsetLeft;
    this.setState(
      {
        tooltipMove: true,
        tooltipLeft
      },
      () => {
        clearTimeout(this.stopTooltip);
        this.stopTooltip = setTimeout(
          () =>
            this.setState({
              tooltipMove: false,
              tooltipDate: new Date(
                Math.round(
                  lowestDates +
                    (tooltipLeft / this.props.width) *
                      (highestDates - lowestDates)
                )
              ).toLocaleDateString()
            }),
          200
        );
      }
    );
  };
  render() {
    const {
      intexp,
      intDates,
      intValues,
      outlays,
      outValues,
      outDates,
      recValues,
      gifts,
      giftValues,
      giftDates,
      bonds,
      bondNewValues,
      bondDates,
      bondRedemptionRatios,
      bondsNetting
    } = this.state;
    const dates = [...intDates, ...outDates, ...giftDates, ...bondDates];
    const values = [
      ...recValues,
      ...outValues,
      ...intValues,
      ...giftValues,
      ...bondNewValues
    ];
    var lowestDates = Math.min(...dates);
    var highestDates = Math.max(...dates);
    var lowestValues = Math.min(...values);
    var highestValues = Math.max(...values);
    var lowestBondNetValues = Math.min(...bondRedemptionRatios);
    var highestBondNetValues = Math.max(...bondRedemptionRatios);
    return (
      <div
        style={{
          position: "relative",
          maxHeight: "100%",
          overflowX: "hidden",
          overflowY: "auto",
          breakInside: "avoid",
          color: "white",
          width: "100%",
          height: "min-content",
          backgroundColor: "rgb(20,20,20)"
        }}
      >
        <div
          onClick={() => this.setState({ open: true })}
          style={{
            width: this.props.width,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: !this.state.open ? "44px" : "0px",
            transition: ".3s ease-in",
            position: "absolute",
            backgroundColor: "rgb(200,20,20)",
            zIndex: !this.state.open ? "1" : "-1"
          }}
        >
          Cash Flow
        </div>
        <div
          style={{
            opacity: ".7",
            width: "100%",
            display: "flex",
            height: "44px"
          }}
        >
          <div
            style={{
              color: "rgb(230,230,230)",
              fontSize: "14px",
              display: "flex",
              width: "calc(100% / 6)",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(130,30,190)"
            }}
          >
            interest
          </div>
          <div
            style={{
              color: "rgb(230,230,230)",
              fontSize: "14px",
              display: "flex",
              width: "calc(100% / 6)",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(50,120,255)"
            }}
          >
            gift
          </div>
          <div
            style={{
              color: "rgb(230,230,230)",
              fontSize: "14px",
              display: "flex",
              width: "calc(100% / 6)",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(255,120,50)"
            }}
          >
            tax
          </div>
          <div
            style={{
              color: "rgb(230,230,230)",
              fontSize: "14px",
              display: "flex",
              width: "calc(100% / 6)",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(75,170,40)"
            }}
          >
            spend
          </div>
          <div
            style={{
              color: "rgb(230,230,230)",
              fontSize: "14px",
              display: "flex",
              width: "calc(100% / 6)",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(25,120,120)"
            }}
          >
            new
          </div>
          <div
            style={{
              color: "rgb(230,230,230)",
              fontSize: "14px",
              display: "flex",
              width: "calc(100% / 6)",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(135,100,30)"
            }}
          >
            redeem
            <br />
            :outst'ng
          </div>
        </div>
        <div
          style={{
            display: "flex",
            overflowX: "hidden",
            overflowY: "auto",
            height: this.state.open ? "300px" : "0px",
            transition: ".3s ease-in"
          }}
        >
          <div
            style={{
              padding: "0px 3px",
              fontSize: "12px",
              color: "black",
              backgroundColor: "rgb(200,200,230)",
              width: "24px",
              height: "300px",
              wordBreak: "break-all"
            }}
          >
            ${Math.round(highestValues).toLocaleString().replace(",", `,\n`)}
            <div
              style={{
                fontSize: "12px",
                textAlign: "center"
              }}
            >
              M<br />O<br />N<br />T<br />H<br />L<br />Y
            </div>
            <div
              onClick={() => this.setState({ open: false })}
              style={{
                borderRadius: "30px",
                color: "white",
                width: "22px",
                height: "22px",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                backgroundColor: "rgb(20,20,20)"
              }}
            >
              &times;
            </div>
          </div>
          <div
            ref={this.wholething}
            style={{
              width: "calc(100% - 30px)"
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                height: "34px"
              }}
            >
              <div
                onClick={() => {
                  const chosenTimePeriod = 11.25;
                  this.setState({ chosenTimePeriod }, () =>
                    this.getBudget(chosenTimePeriod)
                  );
                }}
                style={{
                  display: "flex",
                  width: "calc(100% / 3)",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration:
                    this.state.chosenTimePeriod === 11.25 ? "underline" : "none"
                }}
              >
                11.25 years
              </div>
              <div
                onClick={() => {
                  const chosenTimePeriod = 7.5;
                  this.setState({ chosenTimePeriod }, () =>
                    this.getBudget(chosenTimePeriod)
                  );
                }}
                style={{
                  display: "flex",
                  width: "calc(100% / 3)",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration:
                    this.state.chosenTimePeriod === 7.5 ? "underline" : "none"
                }}
              >
                7.5 years
              </div>
              <div
                onClick={() => {
                  const chosenTimePeriod = 3.75;
                  this.setState({ chosenTimePeriod }, () =>
                    this.getBudget(chosenTimePeriod)
                  );
                }}
                style={{
                  display: "flex",
                  width: "calc(100% / 3)",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration:
                    this.state.chosenTimePeriod === 3.75 ? "underline" : "none"
                }}
              >
                3.75 years
              </div>
            </div>
            <div style={{ position: "relative" }}>
              {this.state.tooltipLeft && (
                <div
                  style={{
                    left: this.state.tooltipLeft,
                    position: "absolute",
                    color: this.state.tooltipMove ? "grey" : ""
                  }}
                >
                  {this.state.tooltipDate}
                </div>
              )}
            </div>
            <svg
              onMouseMove={(e) => {
                this.handleTooltipMove(e, lowestDates, highestDates);
              }}
              onMouseLeave={() =>
                this.setState({ tooltipLeft: null, tooltipDate: null })
              }
              onDrag={(e) => {
                this.handleTooltipMove(e, lowestDates, highestDates);
              }}
              onDragExit={() =>
                this.setState({ tooltipLeft: null, tooltipDate: null })
              }
              style={{
                transform: "scale(1,-1)",
                display: "flex",

                width: "100%",
                height: "260px"
              }}
              xmlns="https://www.w3.org/2000/svg"
            >
              <NaturalCurve
                showPoints={false}
                strokeWidth={7}
                stroke="rgb(130,30,190)"
                data={intexp.map((x, i) => [
                  ((x.intDate - lowestDates) / (highestDates - lowestDates)) *
                    (this.props.width - 30),
                  ((x.intValue - lowestValues) /
                    (highestValues - lowestValues)) *
                    260
                ])}
              />
              <NaturalCurve
                showPoints={false}
                strokeWidth={7}
                stroke="rgb(50,120,255)"
                data={gifts.map((x, i) => [
                  ((x.giftDate - lowestDates) / (highestDates - lowestDates)) *
                    (this.props.width - 30),
                  ((x.giftValue - lowestValues) /
                    (highestValues - lowestValues)) *
                    260
                ])}
              />
              <NaturalCurve
                showPoints={false}
                strokeWidth={7}
                stroke="rgb(255,120,50)"
                data={outlays.map((x, i) => [
                  ((x.outDate - lowestDates) / (highestDates - lowestDates)) *
                    (this.props.width - 30),
                  ((x.recValue - lowestValues) /
                    (highestValues - lowestValues)) *
                    260
                ])}
              />
              <NaturalCurve
                showPoints={false}
                /*pointElement={([x, y], i) => (
              <rect
                x={x}
                y={y}
                width="1px"
                height="1px"
                stroke="rgb(75,170,40)"
                fill="red"
                strokeWidth="4"
                key={i}
              />
            )}*/
                strokeWidth={7}
                stroke="rgb(75,170,40)"
                data={outlays.map((x, i) => [
                  ((x.outDate - lowestDates) / (highestDates - lowestDates)) *
                    (this.props.width - 30),
                  ((x.outValue - lowestValues) /
                    (highestValues - lowestValues)) *
                    260
                ])}
              />
              <NaturalCurve
                showPoints={false}
                strokeWidth={7}
                stroke="rgb(25,120,120)"
                data={bonds.map((x, i) => [
                  ((x.bondDate - lowestDates) / (highestDates - lowestDates)) *
                    (this.props.width - 30),
                  ((x.bondNewValue - lowestValues) /
                    (highestValues - lowestValues)) *
                    260
                ])}
              />
              <NaturalCurve
                strokeDasharray="20"
                showPoints={false}
                strokeWidth={4}
                stroke="rgb(135,100,30)"
                data={bondsNetting.map((x, i) => [
                  ((x.bondDate - lowestDates) / (highestDates - lowestDates)) *
                    (this.props.width - 30),
                  ((x.bondRedemptionRatio - lowestBondNetValues) /
                    (highestBondNetValues - lowestBondNetValues)) *
                    260
                ])}
              />
            </svg>
          </div>
        </div>
        <div style={{ display: this.state.open ? "inline-block" : "none" }}>
          {intDates.map((x) => {
            var monthNum = new Date(x).getMonth();
            var month = [
              "J",
              "F",
              "M",
              "A",
              "M",
              "J",
              "J",
              "A",
              "S",
              "O",
              "N",
              "D"
            ][monthNum];
            return (
              <div key={x} style={{ display: "inline-block" }}>
                {monthNum === 0 && new Date(x).getFullYear()}
                <span
                  style={{
                    color: "grey"
                  }}
                >
                  {month}&nbsp;
                </span>
              </div>
            );
          })}
        </div>
        {/*states.map((chart, i) => {
          var lowestDates = Math.min(...chart.intDates);
          var highestDates = Math.max(...chart.intDates);
          var lowestInts = Math.min(...chart.intValues);
          var highestInts = Math.max(...chart.intValues);
          return (
            <NaturalCurve
              key={chart.state + i}
              pointElement={([x, y], i) => (
                <rect
                  x={x}
                  y={y}
                  width="1px"
                  height="1px"
                  stroke="rgb(30,230,230)"
                  fill="red"
                  strokeWidth="4"
                  key={i}
                />
              )}
              data={chart.data.map((x, i) => [
                `calc(((${x.intDate} - ${lowestDates}) / ${highestDates}) * 90%)`,
                `calc(((${
                  x.intValue
                } - ${lowestInts}) / ${highestInts}) * ${"150px"})`
              ])}
            />
          );
        })*/}
      </div>
    );
  }
}
export default USBudget;

/*
let states = [];
stateNames.map((state) => {
  var dataThisState = result.data.filter((y) => y.state_nm === state);
  var stateData = { intDates: [], intValues: [], state, data: [] };
  dataThisState.map((data) => {
    const intDate = new Date(data.record_date).getTime();
    const intValue = Number(data.advance_auth_month_amt);
    stateData.data.push({ intDate, intValue, state });
    stateData.intDates.push(intDate);
    stateData.intValues.push(intValue);
  });
  states.push(stateData);
});
if (states.length === stateNames.length) this.setState({ states });*/
