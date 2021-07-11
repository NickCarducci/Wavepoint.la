import React from "react";
import AsEntity from "./AsEntity";
import Locate from "./Locate";
import Types from "./Types";

class Confirm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.type = this.props.planInitial
      ? "ttype"
      : this.props.eventInitial
      ? "etype"
      : this.props.clubInitial
      ? "ctype"
      : this.props.shopInitial
      ? "stype"
      : this.props.restaurantInitial
      ? "rtype"
      : this.props.serviceInitial
      ? "servtype"
      : this.props.jobInitial
      ? "jtype"
      : this.props.housingInitial
      ? "htype"
      : this.props.pageInitial
      ? "ptype"
      : this.props.venueInitial
      ? "vtype"
      : false;
  }
  handleTopic = (typeChosen) => {
    var type = this.type;
    if (this.type) {
      if (
        ["sport", "concert", "party & clubbing", "day party festival"].includes(
          typeChosen
        )
      ) {
        this.props.setType({ [type]: typeChosen });
      } else if (this.props[type].includes(typeChosen)) {
        //remove
        const newEtype = this.props[type].filter((item) => item !== typeChosen);
        this.props.setType({ [type]: newEtype });
      } else {
        //add
        if (this.props[type].length < 3) {
          this.props.setType({ [type]: [...this.props[type], typeChosen] });
        }
      }
    }
  };
  render() {
    const options = this.props.eventInitial
      ? [
          "food",
          "business",
          "tech",
          "recreation",
          "education",
          "arts",
          "sport",
          "concert",
          "cause",
          "party & clubbing",
          "day party festival"
        ]
      : this.props.clubInitial
      ? [
          "sport",
          "networking",
          "technology",
          "engineering",
          "science",
          "literature",
          "recreation",
          "arts",
          "medicine",
          "music",
          "non-profit",
          "politics"
        ]
      : this.props.shopInitial
      ? [
          "clothing",
          "technology",
          "movies",
          "trinkets",
          "home furnishing",
          "tools",
          "auto",
          "grocery",
          "music",
          "appliances"
        ]
      : this.props.restaurantInitial
      ? [
          "chinese",
          "italian",
          "mexican",
          "indian",
          "homestyle & fried",
          "burgers & sandwich",
          "noodles",
          "vegan & health",
          "seafood",
          "breakfast & lunch"
        ]
      : this.props.serviceInitial
      ? [
          "hair, nails & tan",
          "catering",
          "lawyer",
          "mechanic",
          "internist",
          "orthopedist",
          "orthodontist",
          "dentist",
          "graphics & animation",
          "video production",
          "photography",
          "code",
          "architecture",
          "interior design",
          "landscaping",
          "framing",
          "HVAC",
          "painting",
          "plumbing",
          "electrician",
          "accounting",
          "carpentry",
          "welding",
          "masonry",
          "musician",
          "acting",
          "writer",
          "singer"
        ]
      : this.props.jobInitial
      ? [
          "tech",
          "hospitality",
          "office",
          "auto",
          "home",
          "shipping",
          "education",
          "arts",
          "medical",
          "music",
          "non-profit",
          "business"
        ]
      : this.props.housingInitial
      ? [
          "stay",
          "rent",
          "+5m",
          "3-5m",
          "1-3m",
          "800-1m",
          "500-800",
          "100-500",
          "50-100",
          "<50"
        ]
      : this.props.pageInitial
      ? ["pod", "radio", "television news", "series", "movies"]
      : this.props.venueInitial
      ? [
          "in theatre",
          "rewinds & drive-ins",
          "playwrights",
          "music",
          "sport",
          "museum"
        ]
      : false;
    return (
      <div
        style={{
          height: "100%",
          zIndex: "9999",
          display: "flex",
          position: "fixed",
          overflowY: "auto",
          overflowx: "auto",
          width: "100%"
        }}
      >
        <div
          style={{
            height: "min-content",
            flexWrap: "wrap",
            display: "flex",
            position: "absoute",
            width: "100%"
          }}
        >
          <div
            onClick={this.props.back}
            style={{
              backgroundColor: "rgb(200,200,250)",
              height: "56px",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "9999",
              display: "flex",
              width: "100%"
            }}
          >
            Close
          </div>
          <div>
            {this.props.eventInitial &&
              ((this.props.myClubs && this.props.myClubs !== []) ||
                (this.props.myShops && this.props.myShops !== []) ||
                (this.props.myServicess && this.props.myServicess !== []) ||
                (this.props.myClasses && this.props.myClasses !== []) ||
                (this.props.myPages && this.props.myPages !== []) ||
                (this.props.myRestaurants && this.props.myRestaurants !== []) ||
                (this.props.myDepartments &&
                  this.props.myDepartments !== [])) && (
                <AsEntity
                  postedAs={this.props.postedAs}
                  entityId={this.props.entityId}
                  setPoster={this.props.setPoster}
                  myClubs={this.props.myClubs}
                  myShops={this.props.myShops}
                  myServices={this.props.myServices}
                  myClasses={this.props.myClasses}
                  myPages={this.props.myPages}
                  myRestaurants={this.props.myRestaurants}
                  myDepartments={this.props.myDepartments}
                  auth={this.props.auth}
                />
              )}
            <Locate
              auth={this.props.auth}
              setCommunity={this.props.setCommunity}
              communityId={this.props.communityId}
              selectAddress={this.props.selectAddress}
              clearlocation={this.props.clearlocation}
              done={
                `${!this.props.planInitial && "Please provide "}` +
                `${
                  this.props.jobInitial
                    ? "a job "
                    : this.props.clubInitial
                    ? "a club "
                    : this.props.eventInitial
                    ? "an event "
                    : this.props.housingInitial
                    ? "an "
                    : this.props.serviceInitial
                    ? "a service "
                    : this.props.shopInitial
                    ? "a shop "
                    : this.props.restaurantInitial
                    ? "a restaurant "
                    : this.props.planInitial
                    ? "Plan "
                    : ""
                }`
              }
            />
          </div>
          <Types
            planInitial={this.props.planInitial}
            recipientSuggestionsProfiled={
              this.props.recipientSuggestionsProfiled
            }
            pauseNeedTopic={this.props.pauseNeedTopic}
            topicSuggestions={this.props.topicSuggestions}
            auth={this.props.auth}
            users={this.props.users}
            options={options}
            selectedType={this.props.selectedType}
            setRecipients={this.props.setRecipients}
          />
        </div>
      </div>
    );
  }
}
export default Confirm;
