import React from "react";
import { Link } from "react-router-dom";
import "./Backdrop.css";

class Create extends React.Component {
  render() {
    let drawerClasses = "slide-drawer closed";
    if (this.props.show) {
      drawerClasses = "slide-drawer";
    }
    return (
      <div
        style={{
          display: this.props.show ? "flex" : "none",
          position: "fixed",
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          zIndex: this.props.show ? "9999" : "0"
        }}
      >
        {this.props.show ? (
          <div className="create-drawer-backdrop" onClick={this.props.toggle} />
        ) : null}
        <div className={drawerClasses}>
          <div className="createphotoset">
            {/*<Link to="/new">
            <img
              onClick={this.props.toggle}
              src="https://www.dl.dropboxusercontent.com/s/nves40phq4yhd57/CENTER%20PLUS_Plan.png?dl=0"
              className="createphoto"
              alt="error"
            />
    </Link>*/}

            <Link to="/newevent">
              <img
                onClick={() => {
                  this.props.toggle();
                  this.props.eventDateOpen();
                }}
                src="https://www.dl.dropboxusercontent.com/s/6qp0bsjfr4di3w0/CENTER%20PLUS_Event.png?dl=0"
                className="createphoto"
                alt="error"
              />
            </Link>
            <Link to="/newclub">
              <img
                onClick={this.props.toggle}
                src="https://www.dl.dropboxusercontent.com/s/ry4yxch7t92tgyi/TILES_Clubs.png?dl=0"
                className="createphoto"
                alt="error"
              />
            </Link>
            <Link to="/newshop">
              <img
                onClick={this.props.toggle}
                src="https://www.dl.dropboxusercontent.com/s/3t3b223xt8rt0zt/EVENTTYPES_Shops.png?dl=0"
                className="createphoto"
                alt="error"
              />
            </Link>
            <Link to="/newrestaurant">
              <img
                onClick={this.props.toggle}
                src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                className="createphoto"
                alt="error"
              />
            </Link>
            <Link to="/newservice">
              <img
                onClick={this.props.toggle}
                src="https://www.dl.dropboxusercontent.com/s/0jjuyb2cn56zvsh/EVENTTYPES_Services.png?dl=0"
                className="createphoto"
                alt="error"
              />
            </Link>
            <Link to="/newjob">
              <img
                onClick={() => {
                  this.props.toggle();
                  this.props.eventDateOpen();
                }}
                src="https://www.dl.dropboxusercontent.com/s/ndeoyalpy7bxilr/EVENTTYPES_Jobs%20%281%29.png?dl=0"
                className="createphoto"
                alt="error"
              />
            </Link>
            <Link to="/newhousing">
              <img
                onClick={this.props.toggle}
                src="https://www.dl.dropboxusercontent.com/s/rdx2xb7xczvomd1/EVENTTYPES_Housing.png?dl=0"
                className="createphoto"
                alt="error"
              />
            </Link>
            <Link to="/newpage">
              <img
                onClick={this.props.toggle}
                src="https://www.dl.dropboxusercontent.com/s/vtkuoonyq8hpz4w/TILES_Pages.png?dl=0"
                className="createphoto"
                alt="error"
              />
            </Link>
            <Link to="/newvenue">
              <img
                onClick={this.props.toggle}
                src="https://www.dl.dropboxusercontent.com/s/h9ebdl3j1l94xkt/TILES_Venues.png?dl=0"
                className="createphoto"
                alt="error"
              />
            </Link>
            {/*<Link to="/newtheatre">
              <img
                onClick={this.props.toggle}
                src="https://www.dl.dropboxusercontent.com/s/5vveqrjd7vhwtx8/TILES_Theatre%20%282%29.png?dl=0"
                className="createphoto"
                alt="error"
              />
            </Link>*/}

            {/*<Link className=""
        to="/new"
        onClick={this.props.toggle}
    ><h1>Event</h1></Link>*/}
          </div>
        </div>
        <div
          onClick={this.props.toggle}
          style={
            this.props.show
              ? {
                  display: "flex",
                  position: "fixed",
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: "68px",
                  width: "56px",
                  height: "56px",
                  right: "10px",
                  backgroundColor: "rgb(20,20,20)",
                  zIndex: "9999",
                  borderRadius: "45px",
                  border: "5px solid #78f8fff2"
                }
              : {
                  display: "none"
                }
          }
        >
          <div style={{ color: "white" }}>&times;</div>
        </div>
      </div>
    );
  }
}
export default Create;
