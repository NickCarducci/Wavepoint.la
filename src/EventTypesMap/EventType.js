import React from "react";
import {
  Above5millionImg,
  EightHundredImg,
  FiftyToOneHunImg,
  FiveToEightHunImg,
  FoodImg,
  InTheatreImg,
  MoviesImg,
  MuseumImg,
  MusicImg,
  OneToFiveHunImg,
  OneToThreeMilImg,
  PlaywrightImg,
  PodImg,
  RadioImg,
  RentImg,
  RewindAndDriveInImg,
  SeriesImg,
  SportImg,
  StayImg,
  TelevisionImg,
  ThreeToFiveMilImg,
  TechImg,
  HospitalityImg,
  OfficeImg,
  HomeImg,
  AutoImg,
  ShippingImg,
  EducationImg,
  ArtsImg,
  MedicalImg,
  MusicJobImg,
  NonProfitImg,
  BusinessImg,
  AccountingImg,
  ActorImg,
  ArchitectureImg,
  CarpentryImg,
  CateringImg,
  CodeImg,
  DentistImg,
  ElectricianImg,
  FramingImg,
  GraphicsAnimationImg,
  HairNailsTanImg,
  HVACImg,
  InteriorDesignImg,
  InternistImg,
  LandscapingImg,
  LawyerImg,
  MasonryImg,
  MechanicImg,
  MusicianImg,
  OrthodontistImg,
  OrthopedistImg,
  PaintingImg,
  PlumbingImg,
  SingerImg,
  VideoProductionImg,
  WeldingImg,
  WriterImg,
  ChineseImg,
  ItalianImg,
  MexicanImg,
  IndianImg,
  HomeStyleImg,
  BurgerAndSandwichImg,
  NoodlesImg,
  VeganOrHealthImg,
  SeafoodImg,
  BreakfastOrLunchImg,
  ClothingImg,
  TechnologyImg,
  MoviesShopImg,
  TrinketsImg,
  HomeFurnishingImg,
  ToolsImg,
  AutoShopImg,
  GroceryImg,
  MusicShopImg,
  AppliancesImg,
  SportClubImg,
  NetworkingImg,
  TechnologyClubImg,
  EngineeringImg,
  ScienceImg,
  LiteratureImg,
  RecreationImg,
  ArtsClubImg,
  MedicineImg,
  MusicClubImg,
  NonProfitClubImg,
  PoliticsImg,
  BusinessEventImg,
  TechEventImg,
  RecreationEventImg,
  EducationEventImg,
  ArtsEventImg,
  SportsImg,
  ConcertImg,
  CauseImg,
  PartyAndClubbingImg,
  DayPartyFestivalImg,
  PhotographyImg
} from "../widgets/aphoto";

class EventType extends React.Component {
  render() {
    const {
      servtype,
      vtype,
      ptype,
      htype,
      jtype,
      rtype,
      stype,
      ctype,
      etype,
      tileChosen
    } = this.props;
    return (
      <div /*style={{ display: !subForum ? "block" : "none" }}*/>
        <div
          className="eventtypessetmap"
          //cannot push id behind this "synthetic"-target, must
          //interpolate here...
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "event" ? "flex" : "none"
          }}
        >
          <FoodImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <BusinessEventImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <TechEventImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />

          <RecreationEventImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <EducationEventImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ArtsEventImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <SportsImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ConcertImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <CauseImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <PartyAndClubbingImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <DayPartyFestivalImg
            etype={etype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "club" ? "flex" : "none"
          }}
        >
          <SportClubImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <NetworkingImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <TechnologyClubImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <EngineeringImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ScienceImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <LiteratureImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <RecreationImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ArtsClubImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MedicineImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MusicClubImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <NonProfitClubImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <PoliticsImg
            ctype={ctype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "shop" ? "flex" : "none"
          }}
        >
          <ClothingImg
            stype={stype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <TechnologyImg
            stype={stype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MoviesShopImg
            stype={stype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <TrinketsImg
            stype={stype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <HomeFurnishingImg
            stype={stype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ToolsImg
            stype={stype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <AutoShopImg
            stype={stype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <GroceryImg
            stype={stype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MusicShopImg
            stype={stype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <AppliancesImg
            stype={stype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "restaurant" ? "flex" : "none"
          }}
        >
          <ChineseImg
            rtype={rtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ItalianImg
            rtype={rtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MexicanImg
            rtype={rtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <IndianImg
            rtype={rtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <HomeStyleImg
            rtype={rtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <BurgerAndSandwichImg
            rtype={rtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <NoodlesImg
            rtype={rtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <VeganOrHealthImg
            rtype={rtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <SeafoodImg
            rtype={rtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <BreakfastOrLunchImg
            rtype={rtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          style={{
            display: tileChosen === "service" ? "flex" : "none"
          }}
        >
          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(160,190,250)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Service
            <HairNailsTanImg servtype={servtype} tileChosen={tileChosen} />
            <CateringImg servtype={servtype} tileChosen={tileChosen} />
            <LawyerImg servtype={servtype} tileChosen={tileChosen} />
            <MechanicImg servtype={servtype} tileChosen={tileChosen} />
          </div>
          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(240,190,190)",
              borderRadius: "30px",
              margin: "-2px",
              padding: "2px"
            }}
          >
            Medicine <div style={{ color: "grey" }}>911 for emergency</div>
            <InternistImg servtype={servtype} tileChosen={tileChosen} />
            <OrthopedistImg servtype={servtype} tileChosen={tileChosen} />
            <OrthodontistImg servtype={servtype} tileChosen={tileChosen} />
            <DentistImg servtype={servtype} tileChosen={tileChosen} />
          </div>

          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(240,240,190)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Digital
            <GraphicsAnimationImg servtype={servtype} tileChosen={tileChosen} />
            <PhotographyImg servtype={servtype} tileChosen={tileChosen} />
            <VideoProductionImg servtype={servtype} tileChosen={tileChosen} />
            <CodeImg servtype={servtype} tileChosen={tileChosen} />
          </div>
          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(190,240,190)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Planning
            <ArchitectureImg servtype={servtype} tileChosen={tileChosen} />
            <InteriorDesignImg servtype={servtype} tileChosen={tileChosen} />
            <LandscapingImg servtype={servtype} tileChosen={tileChosen} />
            <FramingImg servtype={servtype} tileChosen={tileChosen} />
          </div>
          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(240,190,240)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Solutions
            <HVACImg servtype={servtype} tileChosen={tileChosen} />
            <PaintingImg servtype={servtype} tileChosen={tileChosen} />
            <PlumbingImg servtype={servtype} tileChosen={tileChosen} />
            <ElectricianImg servtype={servtype} tileChosen={tileChosen} />
          </div>
          <div
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(100,100,100)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Project
            <AccountingImg servtype={servtype} tileChosen={tileChosen} />
            <CarpentryImg servtype={servtype} tileChosen={tileChosen} />
            <WeldingImg servtype={servtype} tileChosen={tileChosen} />
            <MasonryImg servtype={servtype} tileChosen={tileChosen} />
          </div>
          <div
            onClick={(e) => this.props.change(e.target.id.split("/")[1])}
            style={{
              maxWidth: `calc(${this.props.width - 4}px)`,
              alignItems: "center",
              height: "min-content",
              display: "flex",
              flexDirection: "column",
              border: "solid 4px rgb(190,100,190)",
              borderRadius: "30px",
              padding: "2px"
            }}
          >
            Talents
            <MusicianImg servtype={servtype} tileChosen={tileChosen} />
            <ActorImg servtype={servtype} tileChosen={tileChosen} />
            <WriterImg servtype={servtype} tileChosen={tileChosen} />
            <SingerImg servtype={servtype} tileChosen={tileChosen} />
          </div>
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "job" ? "flex" : "none"
          }}
        >
          <TechImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <HospitalityImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <OfficeImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <AutoImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <HomeImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ShippingImg
            v={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <EducationImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ArtsImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MedicalImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MusicJobImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <NonProfitImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <BusinessImg
            jtype={jtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "housing" ? "flex" : "none"
          }}
        >
          <StayImg
            htype={htype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <RentImg
            htype={htype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <Above5millionImg
            htype={htype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <ThreeToFiveMilImg
            htype={htype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <OneToThreeMilImg
            htype={htype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <EightHundredImg
            htype={htype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <FiveToEightHunImg
            htype={htype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <OneToFiveHunImg
            htype={htype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <FiftyToOneHunImg
            htype={htype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "page" ? "flex" : "none"
          }}
        >
          <PodImg
            ptype={ptype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <RadioImg
            ptype={ptype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <TelevisionImg
            ptype={ptype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <SeriesImg
            ptype={ptype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MoviesImg
            ptype={ptype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
        <div
          className="eventtypessetmap"
          onClick={(e) => this.props.change(e.target.id.split("/")[1])}
          style={{
            display: tileChosen === "venue" ? "flex" : "none"
          }}
        >
          <InTheatreImg
            vtype={vtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <RewindAndDriveInImg
            vtype={vtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <PlaywrightImg
            vtype={vtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MusicImg
            vtype={vtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <SportImg
            vtype={vtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
          <MuseumImg
            vtype={vtype}
            maxWidth={this.props.width}
            tileChosen={tileChosen}
          />
        </div>
      </div>
    );
  }
}
export default EventType;
