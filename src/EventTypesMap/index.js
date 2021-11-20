import React from "react";
import { withRouter } from "react-router-dom";
import EventType from "./EventType";
//import firebase from "../../.././init-firebase";
import Claim from ".././components/SwitchCity/Display/Claim";
import {
  BudgetProposalImg,
  ClassImg,
  CourtCaseImg,
  DepartmentImg,
  ElectionImg,
  FormsAndPermitsImg,
  GameImg,
  LessonImg,
  NewCommPostImg,
  NewPostImg,
  OrdinanceImg,
  ShowImg
} from ".././widgets/aphoto";
import { statesForBillsOfOpenStates } from ".././widgets/arraystrings";
import "./EventTypesMap.css";
import EventTypeTop from "./EventTypeTop";

class ForumType extends React.Component {
  render() {
    const { commtype, forumOpen, community, subForum, show } = this.props;
    const notBlocked = (x) => community && !community.blockedForum.includes(x);
    return (
      <div style={{ display: !subForum && show ? "block" : "none" }}>
        <div
          onClick={(e) => {
            if (e.target.id) {
              this.props.tileChanger(e.target.id, false);
              this.props.eventTypes();
            }
          }}
          className="eventtypessetmap"
          style={{
            width: "100%",
            display:
              !community && forumOpen && !this.props.globeChosen
                ? "flex"
                : "none"
          }}
        >
          <NewPostImg commtype={commtype} maxWidth={this.props.width} />
          <LessonImg commtype={commtype} maxWidth={this.props.width} />
          <ShowImg commtype={commtype} maxWidth={this.props.width} />
          <GameImg commtype={commtype} maxWidth={this.props.width} />
        </div>
        <div
          onClick={(e) => {
            if (e.target.id) {
              this.props.tileChanger(e.target.id, false);
              this.props.eventTypes();
            }
          }}
          className="eventtypessetmap"
          style={{
            display: community ? "flex" : "none"
          }}
        >
          <NewCommPostImg commtype={commtype} maxWidth={this.props.width} />
          {notBlocked("forms & permits") && (
            <FormsAndPermitsImg
              commtype={commtype}
              maxWidth={this.props.width}
            />
          )}
          {notBlocked("ordinances") && (
            <OrdinanceImg commtype={commtype} maxWidth={this.props.width} />
          )}
          {notBlocked("budget") && (
            <BudgetProposalImg
              commtype={commtype}
              maxWidth={this.props.width}
            />
          )}
          {notBlocked("elections") && (
            <ElectionImg commtype={commtype} maxWidth={this.props.width} />
          )}
          {notBlocked("cases") && (
            <CourtCaseImg commtype={commtype} maxWidth={this.props.width} />
          )}
          {notBlocked("classes") && (
            <ClassImg commtype={commtype} maxWidth={this.props.width} />
          )}
          {notBlocked("departments") && (
            <DepartmentImg commtype={commtype} maxWidth={this.props.width} />
          )}
          {community && statesForBillsOfOpenStates.includes(community.message) && (
            <div
              id="bills"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                borderRadius: "20px",
                width: "120px",
                height: "40px",
                backgroundColor: "navy"
              }}
            >
              Bills
            </div>
          )}
        </div>
        <div
          onClick={(e) => {
            if (e.target.id) {
              this.props.tileChanger(e.target.id, false);
              this.props.eventTypes();
            }
          }}
          className="eventtypessetmap"
          style={{
            width: "100%",
            display: this.props.globeChosen ? "flex" : "none"
          }}
        >
          Global
          <NewPostImg commtype={commtype} maxWidth={this.props.width} />
          <LessonImg commtype={commtype} maxWidth={this.props.width} />
          <ShowImg commtype={commtype} maxWidth={this.props.width} />
        </div>
      </div>
    );
  }
}
class EventTypes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.header = React.createRef();
  }
  socialOpener = () => {
    this.setState({
      socialOpen: !this.state.socialOpen
    });
  };
  render() {
    const {
      showReqMayorForm,
      community,
      subForum,
      type,
      servtype,
      vtype,
      ptype,
      htype,
      jtype,
      rtype,
      stype,
      ctype,
      etype,
      tileChosen,
      show,
      forumOpen,
      commtype
    } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          zIndex: this.props.forumOpen ? "1" : "",
          overflow: "hidden",
          height: "min-height",
          maxHeight: show ? "min-content" : "0px",
          position: "relative",
          wordBreak: "break-word",
          width: "100%",
          transition: ".3s ease-in"
        }}
      >
        <div
          ref={this.header}
          style={{
            position: "absolute",
            width: "100%",
            height: show ? "100%" : "0%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            transition: ".7s ease-in"
          }}
          onClick={this.props.eventTypes}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column"
          }}
        >
          <EventTypeTop
            setEventTypes={(x) => this.setState(x)}
            tileChosen={tileChosen}
            forumOpen={forumOpen}
            subForum={subForum}
            commtype={commtype}
            eventTypes={this.props.eventTypes}
            openFilters={this.props.openFilters}
            auth={this.props.auth}
            city={this.props.city}
            showReqMayorForm={showReqMayorForm}
            community={community}
            type={type}
          />
          <div
            style={{
              display:
                !["classes", "departments"].includes(commtype) &&
                (!forumOpen || subForum)
                  ? "block"
                  : "none"
            }}
          >
            <EventType
              type={type}
              width={this.props.width}
              tileChosen={tileChosen}
              forumOpen={forumOpen}
              subForum={subForum}
              commtype={commtype}
              servtype={servtype}
              htype={htype}
              jtype={jtype}
              stype={stype}
              rtype={rtype}
              ctype={ctype}
              etype={etype}
              ptype={ptype}
              vtype={vtype}
              eventTypes={this.props.eventTypes}
              openFilters={this.props.openFilters}
              auth={this.props.auth}
              city={this.props.city}
              showReqMayorForm={this.state.showReqMayorForm}
              community={community}
              change={(e) => {
                if (e) {
                  this.props.tileChanger(e, false);
                  this.props.eventTypes();
                }
              }}
            />
          </div>
          <ForumType
            show={this.props.show}
            setEventTypes={(x) => this.setState(x)}
            commtype={commtype}
            width={this.props.width}
            openFilters={this.props.openFilters}
            community={community}
            auth={this.props.auth}
            city={this.props.city}
            globeChosen={this.props.globeChosen}
            forumOpen={forumOpen}
            eventTypes={this.props.eventTypes}
            getUserInfo={this.props.getUserInfo}
            showReqMayorForm={this.state.showReqMayorForm}
            user={this.props.user}
            tileChanger={this.props.tileChanger}
            tileChosen={tileChosen}
            subForum={subForum}
          />
          <div
            style={{
              width: "calc(100% - 2px)",
              display: "flex"
            }}
          >
            <div
              onClick={() => this.props.eventTypes()}
              style={{
                padding: "10px 0px",
                textAlign: "center",
                fontSize: "20px",
                position: "relative",
                width: "calc(100% - 2px)",
                color: "white",
                border: "1px solid white",
                backgroundImage:
                  "radial-gradient(rgba(14, 47, 56, 0.279),rgba(25, 81, 97, 0.948))"
              }}
            >
              Close
            </div>
            {/*<div
              style={{
                padding: !loadedSearch ? "10px 0px" : "0px 0px",
                textAlign: "center",
                fontSize: !loadedSearch ? "20px" : "0px",
                position: "relative",
                width: !loadedSearch ? "calc(100% - 2px)" : "0px",
                color: "white",
                border: "1px solid white",
                backgroundImage:
                  "radial-gradient(rgba(14, 47, 56, 0.279),rgba(25, 81, 97, 0.948))"
              }}
              onClick={() => {
                this.setState(
                  {
                    searchedDate: this.props.current
                  },
                  () => {
                    this.props.setFoundation({ openCal: false });
                    //this.props.start();
                    this.props.queryDate([
                      this.props.current,
                      this.props.current1
                    ]);
                  }
                );
              }}
            >
              Start Search
            </div>*/}
          </div>
        </div>
        <Claim
          clear={() => this.setState({ showReqMayorForm: "" })}
          showReqMayorForm={this.state.showReqMayorForm}
          user={this.props.user}
        />
      </div>
    );
  }
}
export default withRouter(EventTypes);

/**
 * 
<div
onClick={this.props.eventTypes}
style={{
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: "white"
}}
>
<FilterButton
  openFilters={this.props.openFilters}
  thru={"services in"}
/>
{community ? (
  this.props.auth !== undefined &&
  (this.props.auth.uid === community.authorId ||
    community.admin.includes(this.props.auth.uid)) && (
    <div
      onClick={() => {
        this.props.eventTypes("settings");
      }}
      style={{
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <img
        src={settings}
        alt="settings"
        style={{
          zIndex: "9999",
          top: "200px",
          opacity: ".95",
          left: "20px",
          position: "absolute",
          height: "19px",
          padding: "7px",
          backgroundColor: "#333",
          width: "19px",
          borderRadius: "13px"
        }}
      />
    </div>
  )
) : (
  <div
    onClick={() => {
      var answer = window.confirm("Are you a town clerk?");
      if (answer && this.props.auth === undefined) {
        var sendtologin = window.confirm("You need to login");
        if (sendtologin) {
          this.props.getUserInfo();
        }
      } else if (answer) {
        this.setState({ showReqMayorForm: this.props.city });
      }
    }}
    style={{
      color: "white",
      borderRadius: "20px",
      padding: "0px 20px",
      display: this.props.showReqMayorForm ? "none" : "flex",
      position: "absolute",
      right: "40px",
      backgroundColor: "rgba(50,50,50,.8)",
      top: "10px",
      zIndex: "9999"
    }}
  >
    ...
  </div>
)}
<div
  style={{
    paddingBottom: "15px",
    paddingTop: "5px"
  }}
>
  {community
    ? community.message
    : this.props.city}
</div>
<div
  style={{
    position: "relative",
    height: "min-content",
    display: "flex",
    flexDirection: "column"
  }}
>
  <div
    style={{
      display: "flex",
      position: "relative",
      transform: "translateX(-10%)",
      zIndex: "9999"
    }}
  >
    <Fave
      x={
        community
          ? community.message
          : this.props.city
      }
      user={this.props.user}
      auth={this.props.auth}
    />
  </div>
  {community ? (
    <Link
      to={`/${uriParser(community.message)}`}
      style={{
        display: "flex",
        width: "100px",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <img
        src={
          community.photoThumbnail
            ? community.photoThumbnail
            : images1
        }
        alt={community.message}
      />
    </Link>
  ) : (
    <Link
      to={`/${uriParser(this.props.city)}`}
      style={{
        overflow: "hidden",
        display: "flex",
        position: "relative",
        height: "100px",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <WeatherCitySky
        style={{ touchAction: "none" }}
        city={this.props.city}
        leaveItAlone={false}
      />
    </Link>
  )}
</div>
 */
