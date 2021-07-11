import React from "react";
import { SocialIcon } from "react-social-icons";
import VoterPhoto from "./VoterPhoto";
import refresh from "../.././Icons/Images/refresh.png";

class VoterQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = { voterQuery: "", showReps: false, earlyVoting: "" };
    this.forsize = React.createRef();
  }
  render() {
    var open = this.state.openVoter || this.props.voterResults;
    return (
      <div
        style={{
          zIndex: "2"
        }}
      >
        {open && (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              position: "fixed",
              backgroundColor: "rgba(20,20,20,.5)"
            }}
            onClick={() => {
              this.props.clearErrorVoter();
              this.setState({ openVoter: false, openChooser: false });
            }}
          />
        )}
        <form
          onClick={() =>
            !this.state.openVoter &&
            !this.props.openTv &&
            !this.state.openChooser &&
            this.setState({ openChooser: true })
          }
          style={{
            overflowX: "hidden",
            overflowY: open ? "auto" : "hidden",
            backgroundColor: "rgb(50,200,200)",
            height: "min-content",
            maxHeight: open ? `calc(${"100vh"} - 147px)` : "",
            padding: "20px",
            borderRadius: "0px",
            display: "flex",
            position: "fixed",
            bottom: open ? "0px" : "5px",
            left: open ? "0px" : "150px",
            zIndex: open ? "3" : "2",
            flexDirection: "column",
            transition: ".3s ease-in"
          }}
          //className={!open ? "target" : ""}
          onSubmit={(e) => {
            e.preventDefault();
            this.props.handleVoterQuery(this.state.voterQuery);
          }}
        >
          {/*this.state.openChooser && !this.state.openVoter && (
            <div>
              <div
                onClick={() => this.setState({ openVoter: true })}
                style={{
                  fontSize: !this.state.hoverCivics ? "14px" : "",
                  transition: ".3s ease-in-out"
                }}
                onMouseEnter={() => this.setState({ hoverCivics: true })}
                onMouseLeave={() => this.setState({ hoverCivics: false })}
              >
                civics
              </div>
              <div
                onClick={this.props.openTvgo}
                style={{
                  fontSize: !this.state.hoverTV ? "14px" : "",
                  transition: ".3s ease-in-out"
                }}
                onMouseEnter={() => this.setState({ hoverTV: true })}
                onMouseLeave={() => this.setState({ hoverTV: false })}
              >
                tv
              </div>
            </div>
              )*/}
          <div
            style={{
              color:
                this.state.hoverCivics || this.state.hoverTV ? "grey" : "black",
              width: "100%",
              fontSize:
                this.state.hoverCivics || this.state.hoverTV ? "12px" : "14px",
              display: "flex",
              transition: ".3s ease-in-out"
            }}
          >
            {!open && "o_o"}
            {!open && this.state.openChooser && (
              <div
                onClick={() =>
                  this.setState({
                    openChooser: false,
                    hoverTV: false,
                    hoverCivics: false
                  })
                }
                style={{ zIndex: "6", marginLeft: "10px" }}
              >
                &times;
              </div>
            )}
          </div>
          {/*new Date().getDate() === 3 ? "today" : "tomorrow"*/}
          {open && (
            <div
              ref={this.forsize}
              style={{
                display: "flex",
                width: "100%",
                height: "min-content",
                flexDirection: "column"
              }}
            >
              {this.props.voterResults ? (
                this.state.filter ? (
                  <div>
                    <div onClick={() => this.setState({ filter: false })}>
                      &times;
                    </div>
                    <select
                      value={this.props.officialLevel}
                      onChange={this.props.selectOfficialLevel}
                    >
                      {[
                        "administrativeArea1",
                        "administrativeArea2",
                        "country",
                        "international",
                        "locality",
                        "regional",
                        "special",
                        "subLocality1",
                        "subLocality2"
                      ].map((x) => (
                        <option>{x}</option>
                      ))}
                    </select>
                    <img
                      onClick={() => {
                        this.props.selectOfficialRole({
                          target: { value: "" }
                        });
                        this.props.selectOfficialLevel({
                          target: { value: "" }
                        });
                      }}
                      src={refresh}
                      alt="error"
                      style={{ width: "26px", height: "26px", right: "56px" }}
                    />
                    <select
                      value={this.props.officialRole}
                      onChange={this.props.selectOfficialRole}
                    >
                      {[
                        "deputyHeadOfGovernment",
                        "executiveCouncil",
                        "governmentOfficer",
                        "headOfGovernment",
                        "headOfState",
                        "highestCourtJudge",
                        "judge",
                        "legislatorLowerBody",
                        "legislatorUpperBody",
                        "schoolBoard",
                        "specialPurposeOfficer"
                      ].map((x) => (
                        <option>{x}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div onClick={() => this.setState({ filter: true })}>
                    Filter
                  </div>
                )
              ) : null}
              <div
                onClick={
                  this.state.showReps
                    ? () => this.setState({ showReps: false })
                    : () => this.setState({ showReps: true })
                }
                style={{ display: "flex", position: "absolute", right: "20px" }}
              >
                Reps &nbsp;
                <div
                  style={{
                    transform: `rotate(${this.state.showReps ? 180 : 0}deg)`,
                    transition: ".3s ease-in"
                  }}
                >
                  ^
                </div>
              </div>
              {open && this.props.errorVoter && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {this.props.errorVoter}
                </div>
              )}
              {open && (
                <div
                  style={{
                    zIndex: "1",
                    fontSize: "12px",
                    marginBottom: "8px",
                    marginTop: "2px"
                  }}
                  onClick={() => {
                    this.props.clearErrorVoter();
                    this.setState({
                      openVoter: false,
                      openChooser: false,
                      hoverTV: false,
                      hoverCivics: false
                    });
                  }}
                >
                  &times;&nbsp;{this.props.voterResults && "your entry"}
                </div>
              )}
              {this.props.voterResults ? (
                <div style={{ height: "max-content" }}>
                  <div
                    style={{
                      width: "100%",
                      fontSize: "12px",
                      border: "1px solid",
                      borderRadius: "3px",
                      wordBreak: "normal"
                    }}
                  >
                    {this.props.voterResults.normalizedInput.line1}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      fontSize: "12px",
                      border: "1px solid",
                      borderRadius: "3px",
                      wordBreak: "normal"
                    }}
                  >
                    {this.props.voterResults.normalizedInput.city}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      fontSize: "12px",
                      border: "1px solid",
                      borderRadius: "3px",
                      wordBreak: "normal"
                    }}
                  >
                    {this.props.voterResults.normalizedInput.state}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      fontSize: "12px",
                      border: "1px solid",
                      borderRadius: "3px",
                      wordBreak: "normal"
                    }}
                  >
                    {this.props.voterResults.normalizedInput.zip}
                  </div>
                  <select
                    value={this.state.earlyVoting}
                    onChange={(e) =>
                      this.setState({ earlyVoting: e.target.value })
                    }
                  >
                    {["early", "polls", "drops", "motions", "info"].map((x) => {
                      return <option>{x}</option>;
                    })}
                  </select>
                  {[
                    { key: "early", name: "earlyVoteSites" },
                    { key: "polls", name: "pollingLocations" },
                    { key: "drops", name: "dropOffLocations" },
                    { key: "motions", name: "contests" },
                    { key: "info", name: "state" }
                  ].map((z) => {
                    return (
                      z.key === this.state.earlyVoting &&
                      this.props.voterResults[z.name] &&
                      this.props.voterResults[z.name].map((x, i) => {
                        if (!["motions", "info", ""].includes(z.key)) {
                          return (
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                height: "min-content",
                                fontSize: "12px"
                              }}
                            >
                              {i + 1}
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "normal"
                                }}
                              >
                                {x.address.line1}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "normal"
                                }}
                              >
                                {x.address.city}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "normal"
                                }}
                              >
                                {x.address.state}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "normal"
                                }}
                              >
                                {x.address.zip}
                              </div>
                              {x.startDate} - {x.endDate}
                              {x.sources.map((x) => {
                                return (
                                  <div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      official:{x.official ? x.official : "no"},
                                      {x.name}
                                    </div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wrap: "break-word",
                                        height: "min-content"
                                      }}
                                    >
                                      {!x.official &&
                                        "Please confirm with your local officials"}
                                    </div>
                                  </div>
                                );
                              })}
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wrap: "break-word",
                                  height: "min-content"
                                }}
                              >
                                {JSON.stringify(x.voterServices)}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wrap: "break-word",
                                  height: "min-content"
                                }}
                              >
                                {x.pollingHours.replace(/pm/g, "/")}
                              </div>
                            </div>
                          );
                        } else if (z.key === "motions") {
                          var sortedCandidates =
                            x.candidates &&
                            x.candidates.sort(
                              (a, b) => b.orderOnBallot - a.orderOnBallot
                            );
                          return (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                height: "min-content",
                                fontSize: "12px"
                              }}
                            >
                              {i + 1}
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "break-all",
                                  height: "min-content"
                                }}
                              >
                                {x.type}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "break-all",
                                  height: "min-content"
                                }}
                              >
                                {x.ballotTitle}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "break-all",
                                  height: "min-content"
                                }}
                              >
                                {x.office}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "break-all",
                                  height: "min-content"
                                }}
                              >
                                {x.level &&
                                  x.level.map((x) => {
                                    return <div>{x}</div>;
                                  })}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "break-all",
                                  height: "min-content"
                                }}
                              >
                                {x.roles &&
                                  x.roles.map((x) => {
                                    return <div>{x}</div>;
                                  })}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "break-all",
                                  height: "min-content"
                                }}
                              >
                                {x.district && (
                                  <div>
                                    <div>{x.district.name}</div>
                                    <div>{x.district.scope}</div>
                                    <div>district {x.district.id}</div>
                                  </div>
                                )}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "break-all",
                                  height: "min-content"
                                }}
                              >
                                {sortedCandidates &&
                                  sortedCandidates.map((x) => {
                                    return (
                                      <div
                                        style={{
                                          width: "100%",
                                          fontSize: "12px",
                                          border: "1px solid",
                                          borderRadius: "3px",
                                          wordBreak: "break-all",
                                          height: "min-content"
                                        }}
                                      >
                                        <div>{x.name}</div>
                                        <div>{x.party}</div>
                                        <div>{x.party}</div>
                                        <div>{x.phone}</div>
                                        <div>{x.photoUrl}</div>
                                        <div>{x.email}</div>
                                      </div>
                                    );
                                  })}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  fontSize: "12px",
                                  border: "1px solid",
                                  borderRadius: "3px",
                                  wordBreak: "break-all",
                                  height: "min-content"
                                }}
                              >
                                {x.referendumTitle && (
                                  <div>
                                    <div>{x.referendumTitle}</div>
                                    <div>{x.referendumSubtitle}</div>
                                    <div>{x.referendumUrl}</div>
                                    <div>{x.referendumBrief}</div>
                                    <div>{x.referendumText}</div>
                                    <div>{x.referendumProStatement}</div>
                                    <div>{x.referendumConStatement}</div>
                                    {x.referendumPassageThreshold && (
                                      <div>
                                        {x.referendumPassageThreshold} votes
                                        required to pass
                                      </div>
                                    )}
                                    <div>{x.referendumEffectOfAbstain}</div>
                                    <div>
                                      {x.referendumBallotResponses.map(
                                        (x, i) => {
                                          return (
                                            <div>
                                              {i}
                                              <div
                                                style={{
                                                  width: "100%",
                                                  fontSize: "12px",
                                                  border: "1px solid",
                                                  borderRadius: "3px",
                                                  wordBreak: "break-all",
                                                  height: "min-content"
                                                }}
                                              >
                                                {x}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        } else if (z.key === "info") {
                          return (
                            <div>
                              {x.name}
                              <div>
                                {x.electionAdministrationBody && (
                                  <div>
                                    <div>
                                      {x.electionAdministrationBody.name}
                                    </div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      {
                                        x.electionAdministrationBody
                                          .electionInfoUrl
                                      }
                                    </div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      Register here:{" "}
                                      {
                                        x.electionAdministrationBody
                                          .electionRegistrationUrl
                                      }
                                    </div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      Confirm here:{" "}
                                      {
                                        x.electionAdministrationBody
                                          .electionRegistrationConfirmationUrl
                                      }
                                    </div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      {
                                        x.electionAdministrationBody
                                          .electionNoticeText
                                      }
                                    </div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      election:{" "}
                                      {
                                        x.electionAdministrationBody
                                          .electionNoticeUrl
                                      }
                                    </div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      absentee:{" "}
                                      {
                                        x.electionAdministrationBody
                                          .absenteeVotingInfoUrl
                                      }
                                    </div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      official voting-location finder:{" "}
                                      {
                                        x.electionAdministrationBody
                                          .votingLocationFinderUrl
                                      }
                                    </div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      official ballot-info url:{" "}
                                      {
                                        x.electionAdministrationBody
                                          .ballotInfoUrl
                                      }
                                    </div>
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      official rules:{" "}
                                      {
                                        x.electionAdministrationBody
                                          .electionRulesUrl
                                      }
                                    </div>
                                    {x.electionAdministrationBody
                                      .voter_services && (
                                      <div
                                        style={{
                                          width: "100%",
                                          fontSize: "12px",
                                          border: "1px solid",
                                          borderRadius: "3px",
                                          wordBreak: "normal"
                                        }}
                                      >
                                        services:{" "}
                                        {x.electionAdministrationBody.voter_services.map(
                                          (x) => (
                                            <div>{x}</div>
                                          )
                                        )}
                                      </div>
                                    )}
                                    <div
                                      style={{
                                        width: "100%",
                                        fontSize: "12px",
                                        border: "1px solid",
                                        borderRadius: "3px",
                                        wordBreak: "normal"
                                      }}
                                    >
                                      hours:{" "}
                                      {
                                        x.electionAdministrationBody
                                          .hoursOfOperation
                                      }
                                    </div>
                                    {[
                                      "correspondenceAddress",
                                      "physicalAddress"
                                    ].map((r) => {
                                      if (x.electionAdministrationBody[r]) {
                                        return (
                                          <div>
                                            {r}
                                            <div
                                              style={{
                                                width: "100%",
                                                fontSize: "12px",
                                                border: "1px solid",
                                                borderRadius: "3px",
                                                wordBreak: "normal"
                                              }}
                                            >
                                              {
                                                x.electionAdministrationBody[r]
                                                  .line1
                                              }
                                            </div>
                                            <div
                                              style={{
                                                width: "100%",
                                                fontSize: "12px",
                                                border: "1px solid",
                                                borderRadius: "3px",
                                                wordBreak: "normal"
                                              }}
                                            >
                                              {
                                                x.electionAdministrationBody[r]
                                                  .line2
                                              }
                                            </div>
                                            <div
                                              style={{
                                                width: "100%",
                                                fontSize: "12px",
                                                border: "1px solid",
                                                borderRadius: "3px",
                                                wordBreak: "normal"
                                              }}
                                            >
                                              {
                                                x.electionAdministrationBody[r]
                                                  .line3
                                              }
                                            </div>
                                            <div
                                              style={{
                                                width: "100%",
                                                fontSize: "12px",
                                                border: "1px solid",
                                                borderRadius: "3px",
                                                wordBreak: "normal"
                                              }}
                                            >
                                              {
                                                x.electionAdministrationBody[r]
                                                  .city
                                              }
                                            </div>
                                            <div
                                              style={{
                                                width: "100%",
                                                fontSize: "12px",
                                                border: "1px solid",
                                                borderRadius: "3px",
                                                wordBreak: "normal"
                                              }}
                                            >
                                              {
                                                x.electionAdministrationBody[r]
                                                  .state
                                              }
                                            </div>
                                            <div
                                              style={{
                                                width: "100%",
                                                fontSize: "12px",
                                                border: "1px solid",
                                                borderRadius: "3px",
                                                wordBreak: "normal"
                                              }}
                                            >
                                              {
                                                x.electionAdministrationBody[r]
                                                  .zip
                                              }
                                            </div>
                                          </div>
                                        );
                                      } else return null;
                                    })}

                                    {x.electionAdministrationBody
                                      .electionOfficials &&
                                      x.electionAdministrationBody.electionOfficials.map(
                                        (x) => {
                                          return (
                                            <div>
                                              {" "}
                                              <div>{x.name}</div>
                                              <div>{x.title}</div>
                                              <div>{x.officePhoneNumber}</div>
                                              <div>fax: {x.faxNumber}</div>
                                              <div>email: {x.emailAddress}</div>
                                            </div>
                                          );
                                        }
                                      )}
                                  </div>
                                )}
                                {x.local_jurisdiction &&
                                  [
                                    "correspondenceAddress",
                                    "physicalAddress"
                                  ].map((r) => {
                                    if (
                                      x.local_jurisdiction
                                        .electionAdministrationBody[r]
                                    ) {
                                      return (
                                        <div>
                                          {r}
                                          <div
                                            style={{
                                              width: "100%",
                                              fontSize: "12px",
                                              border: "1px solid",
                                              borderRadius: "3px",
                                              wordBreak: "normal"
                                            }}
                                          >
                                            {
                                              x.local_jurisdiction
                                                .electionAdministrationBody[r]
                                                .locationName
                                            }
                                          </div>
                                          <div
                                            style={{
                                              width: "100%",
                                              fontSize: "12px",
                                              border: "1px solid",
                                              borderRadius: "3px",
                                              wordBreak: "normal"
                                            }}
                                          >
                                            {
                                              x.local_jurisdiction
                                                .electionAdministrationBody[r]
                                                .line1
                                            }
                                          </div>
                                          <div
                                            style={{
                                              width: "100%",
                                              fontSize: "12px",
                                              border: "1px solid",
                                              borderRadius: "3px",
                                              wordBreak: "normal"
                                            }}
                                          >
                                            {
                                              x.local_jurisdiction
                                                .electionAdministrationBody[r]
                                                .line2
                                            }
                                          </div>
                                          <div
                                            style={{
                                              width: "100%",
                                              fontSize: "12px",
                                              border: "1px solid",
                                              borderRadius: "3px",
                                              wordBreak: "normal"
                                            }}
                                          >
                                            {
                                              x.local_jurisdiction
                                                .electionAdministrationBody[r]
                                                .line3
                                            }
                                          </div>
                                          <div
                                            style={{
                                              width: "100%",
                                              fontSize: "12px",
                                              border: "1px solid",
                                              borderRadius: "3px",
                                              wordBreak: "normal"
                                            }}
                                          >
                                            {
                                              x.local_jurisdiction
                                                .electionAdministrationBody[r]
                                                .city
                                            }
                                          </div>
                                          <div
                                            style={{
                                              width: "100%",
                                              fontSize: "12px",
                                              border: "1px solid",
                                              borderRadius: "3px",
                                              wordBreak: "normal"
                                            }}
                                          >
                                            {
                                              x.local_jurisdiction
                                                .electionAdministrationBody[r]
                                                .state
                                            }
                                          </div>
                                          <div
                                            style={{
                                              width: "100%",
                                              fontSize: "12px",
                                              border: "1px solid",
                                              borderRadius: "3px",
                                              wordBreak: "normal"
                                            }}
                                          >
                                            {
                                              x.local_jurisdiction
                                                .electionAdministrationBody[r]
                                                .zip
                                            }
                                          </div>
                                        </div>
                                      );
                                    } else return null;
                                  })}
                                {x.sources.map((x) => {
                                  return (
                                    <div>
                                      <div
                                        style={{
                                          width: "100%",
                                          fontSize: "12px",
                                          border: "1px solid",
                                          borderRadius: "3px",
                                          wordBreak: "normal"
                                        }}
                                      >
                                        official:
                                        {x.official ? x.official : "no"},
                                        {x.name}
                                      </div>
                                      <div
                                        style={{
                                          width: "100%",
                                          fontSize: "12px",
                                          border: "1px solid",
                                          borderRadius: "3px",
                                          wrap: "break-word",
                                          height: "min-content"
                                        }}
                                      >
                                        {!x.official &&
                                          "Please confirm with your local officials"}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        } else return null;
                      })
                    );
                  })}
                </div>
              ) : (
                <div>
                  {open && <label>Find a polling place</label>}
                  {open && (
                    <input
                      placeholder="your address"
                      style={{ width: "100%" }}
                      value={this.state.voterQuery}
                      onChange={(e) =>
                        this.setState({ voterQuery: e.target.value })
                      }
                    />
                  )}
                  {this.state.voterQuery !== "" && (
                    <div
                      style={{ color: "grey" }}
                      onClick={() => this.setState({ voterQuery: "" })}
                    >
                      Clear
                    </div>
                  )}
                  {open && (
                    <div style={{ color: "grey", fontSize: "12px" }}>
                      '1263 Pacific Ave. Kansas City KS'
                    </div>
                  )}
                  {open && (
                    <div style={{ color: "grey", fontSize: "12px" }}>
                      format
                    </div>
                  )}
                </div>
              )}
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  position: "relative",
                  flexWrap: "wrap"
                }}
              >
                {this.props.voterResults &&
                  this.state.showReps &&
                  this.props.officialResults &&
                  this.props.officialResults.officials &&
                  this.props.officialResults.officials.map((x) => {
                    var httpss = x.photoUrl && x.photoUrl.toLowerCase();
                    var https =
                      httpss && httpss.includes("http:")
                        ? httpss.replace("http://", "https://")
                        : httpss;
                    return (
                      <div style={{ fontSize: "10px", border: "1px solid" }}>
                        <hr />
                        <div
                          style={{
                            width: "100px",
                            wrap: "flex",
                            wordBreak: "break-word",
                            backgroundColor: "white"
                          }}
                        >
                          {x.photoUrl && <VoterPhoto x={x} https={https} />}
                        </div>
                        {x.name}
                        <div>{x.party}</div>
                        {x.urls &&
                          x.urls.map((x) => {
                            var https = x.includes("http://")
                              ? x.replace("http://", "https://")
                              : x;
                            return (
                              <div style={{ fontSize: "12px" }}>
                                <SocialIcon
                                  style={{
                                    height: "20px",
                                    width: "20px"
                                  }}
                                  url={https}
                                />{" "}
                                {x}
                              </div>
                            );
                          })}
                        {x.channels &&
                          x.channels.map((x) => {
                            var url = `https://${x.type.toLowerCase()}.com/${
                              x.id
                            }`;

                            return (
                              <div style={{ fontSize: "12px" }}>
                                <SocialIcon
                                  style={{
                                    height: "20px",
                                    width: "20px"
                                  }}
                                  url={url}
                                />{" "}
                                {x.id}
                              </div>
                            );
                          })}
                        {x.phones &&
                          x.phones.map((x) => {
                            return (
                              <div style={{ fontSize: "12px" }}>
                                <SocialIcon
                                  style={{
                                    height: "20px",
                                    width: "20px"
                                  }}
                                  url={x}
                                />{" "}
                                {x}
                              </div>
                            );
                          })}
                        {x.emails &&
                          x.emails.map((x) => {
                            return (
                              <div style={{ fontSize: "12px" }}>
                                <SocialIcon
                                  style={{
                                    height: "20px",
                                    width: "20px"
                                  }}
                                  url={x}
                                />{" "}
                                {x}
                              </div>
                            );
                          })}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }
}
export default VoterQuery;
