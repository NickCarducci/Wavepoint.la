import React from "react";
import "./GroupFilter.css";

class GroupFilter extends React.Component {
  state = {
    chatFilterChosen: 1
  };
  render() {
    let drawerClasses = "tiles_slide-drawer closedmap1";
    let drawerClasses1 = "tilesbackdropclosedmap1";
    if (this.props.show === true) {
      drawerClasses = "tiles_slide-drawermap1";
      drawerClasses1 = "tilesbackdropmap1";
    }
    return (
      <div>
        <div className={drawerClasses1} onClick={this.props.close}>
          <div className={drawerClasses}>
            {/*<div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <b style={{ fontSize: "40px", height: "46px" }}>
                  {this.props.user && this.props.user.messageCount}
                </b>
                <div>messages sent</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <b style={{ fontSize: "40px", height: "46px" }}>
                  {this.props.user && this.props.user.backedUpCount}
                </b>{" "}
                plans in cloud/
                {this.props.notes && this.props.notes.length}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <b style={{ fontSize: "40px", height: "46px" }}>
                  {this.props.user && this.props.user.docsSentCount}
                </b>{" "}
                docs sent
              </div>
            </div>*/}
            <div onClick={this.props.chatFilterChanger} className="tilesset1">
              <div>
                {!this.props.openSpam &&
                this.props.chatFilterChosen === "users" ? (
                  <img
                    className="eventtypesselected"
                    src="https://www.dl.dropboxusercontent.com/s/2tzml5qsqihwy8j/CHATSFILTER_User.png?dl=0"
                    alt="error"
                    id="users"
                  />
                ) : (
                  <img
                    className="eventtypesnotselected"
                    src="https://www.dl.dropboxusercontent.com/s/a7sgqgncp72anfa/CHATFILTER_User%20%28closed%29.png?dl=0"
                    alt="error"
                    id="users"
                  />
                )}
              </div>

              <div>
                {this.props.chatFilterChosen === "classes" ? (
                  <img
                    className="eventtypesselected"
                    src="https://www.dl.dropboxusercontent.com/s/z67pb6ahfptah3z/ForumFILTER_Classes.png?dl=0"
                    alt="error"
                    id="classes"
                  />
                ) : (
                  <img
                    className="eventtypesnotselected"
                    src="https://www.dl.dropboxusercontent.com/s/ftevpdzn72udcmv/ForumFILTER_Classes%20%28closed%29.png?dl=0"
                    alt="error"
                    id="classes"
                  />
                )}
              </div>
              <div>
                {this.props.chatFilterChosen === "departments" ? (
                  <img
                    className="eventtypesselected"
                    src="https://www.dl.dropboxusercontent.com/s/e99u2x4fg2fl21q/ForumFILTER_Departments.png?dl=0"
                    alt="error"
                    id="departments"
                  />
                ) : (
                  <img
                    className="eventtypesnotselected"
                    src="https://www.dl.dropboxusercontent.com/s/sijy9a7ux1g0lac/ForumFILTER_Departments%20%28closed%29.png?dl=0"
                    alt="error"
                    id="departments"
                  />
                )}
              </div>
              <div>
                {this.props.chatFilterChosen === "clubs" ? (
                  <img
                    className="eventtypesselected"
                    src="https://www.dl.dropboxusercontent.com/s/kiql31g6gv2agft/CENTER%20PLUS_Club.png?dl=0"
                    alt="error"
                    id="clubs"
                  />
                ) : (
                  <img
                    className="eventtypesnotselected"
                    src="https://www.dl.dropboxusercontent.com/s/vrm3lvir0t49kt2/TILES_Clubs%20%28closed%29.png?dl=0"
                    alt="error"
                    id="clubs"
                  />
                )}
              </div>
              <div>
                {this.props.chatFilterChosen === "shops" ? (
                  <img
                    className="tilesselected"
                    src="https://www.dl.dropboxusercontent.com/s/3t3b223xt8rt0zt/EVENTTYPES_Shops.png?dl=0"
                    alt="error"
                    id="shops"
                  />
                ) : (
                  <img
                    className="tilesnotselected"
                    src="https://www.dl.dropboxusercontent.com/s/yj95k4p9e1j6koq/EVENTTYPES_Shops%20%28closed%29.png?dl=0"
                    alt="error"
                    id="shops"
                  />
                )}
              </div>
              <div>
                {this.props.chatFilterChosen === "restaurants" ? (
                  <img
                    className="tilesselected"
                    src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                    alt="error"
                    id="restaurants"
                  />
                ) : (
                  <img
                    className="tilesnotselected"
                    src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                    alt="error"
                    id="restaurants"
                  />
                )}
              </div>
              <div>
                {this.props.chatFilterChosen === "services" ? (
                  <img
                    className="tilesselected"
                    src="https://www.dl.dropboxusercontent.com/s/0jjuyb2cn56zvsh/EVENTTYPES_Services.png?dl=0"
                    alt="error"
                    id="services"
                  />
                ) : (
                  <img
                    className="tilesnotselected"
                    src="https://www.dl.dropboxusercontent.com/s/r7sta0v63jpx4t6/EVENTTYPES_Services%20%28closed%29%20%281%29.png?dl=0"
                    alt="error"
                    id="services"
                  />
                )}
              </div>
              <div>
                {this.props.openSpam ? (
                  <img
                    className="tilesselected"
                    src="https://www.dl.dropboxusercontent.com/s/tfd5v7r0zk6x674/CHAT_Spam.png?dl=0"
                    alt="error"
                    id="spam"
                  />
                ) : (
                  <img
                    className="tilesnotselected"
                    src="https://www.dl.dropboxusercontent.com/s/3y85vshy1z495hu/CHAT_spam%20%28closed%29.png?dl=0"
                    alt="error"
                    id="spam"
                  />
                )}
              </div>
              {/*
              <div onClick={this.props.chatFilterChanger}>
                {this.props.chatFilterChosen === 3 ? (
                  <img
                    className="tilesselected1"
                    onClick={this.tileChoose3}
                    src="https://www.dl.dropboxusercontent.com/s/0tusz7lqrbnzvlx/EVENTTYPES_Jobs.png?dl=0"
                    alt="error"
                    id="job"
                  />
                ) : (
                  <img
                    className="tilesnotselected1"
                    onClick={this.tileChoose3}
                    src="https://www.dl.dropboxusercontent.com/s/uslvfnp7xqmh2y8/TILES_Jobs%20%28closed%29%20%281%29.png?dl=0"
                    alt="error"
                    id="job"
                  />
                )}
              </div>
              <div onClick={this.props.chatFilterChanger}>
                {this.props.chatFilterChosen === 4 ? (
                  <img
                    className="tilesselected"
                    onClick={this.tileChoose4}
                    src="https://www.dl.dropboxusercontent.com/s/rdx2xb7xczvomd1/EVENTTYPES_Housing.png?dl=0"
                    alt="error"
                    id="housing"
                  />
                ) : (
                  <img
                    className="tilesnotselected"
                    onClick={this.tileChoose4}
                    src="https://www.dl.dropboxusercontent.com/s/jamhnuor263bx8z/TILES_Housing%20%28closed%29%20%281%29.png?dl=0"
                    alt="error"
                    id="housing"
                  />
                )}
              </div>
              <div>
                {this.props.chatFilterChosen === 7 ? (
                  <img
                    className="tilesselected"
                    onClick={this.tileChoose7}
                    src="https://www.dl.dropboxusercontent.com/s/6qp0bsjfr4di3w0/CENTER%20PLUS_Event.png?dl=0"
                    alt="error"
                  />
                ) : (
                  <img
                    className="tilesnotselected"
                    onClick={this.tileChoose7}
                    src="https://www.dl.dropboxusercontent.com/s/7e40g2z2kah8hf8/EVENTTYPES_Are%20you%2021_%20%28closed%29.png?dl=0"
                    alt="error"
                  />
                )}
              </div>
                
              <div onClick={this.props.chatFilterChanger}>
                {this.props.chatFilterChosen === 8 ? (
                  <img
                    className="tilesselected"
                    onClick={this.tileChoose8}
                    src="https://www.dl.dropboxusercontent.com/s/0jjuyb2cn56zvsh/EVENTTYPES_Services.png?dl=0"
                    alt="error"
                    id="service"
                  />
                ) : (
                  <img
                    className="tilesnotselected"
                    onClick={this.tileChoose8}
                    src="https://www.dl.dropboxusercontent.com/s/r7sta0v63jpx4t6/EVENTTYPES_Services%20%28closed%29%20%281%29.png?dl=0"
                    alt="error"
                    id="service"
                  />
                )}
              </div>
              <div onClick={this.props.chatFilterChanger}>
                {this.props.chatFilterChosen === 9 ? (
                  <img
                    className="tilesselected"
                    onClick={this.tileChoose9}
                    src="https://www.dl.dropboxusercontent.com/s/pmgrqoorrymamcm/EVENTTYPES_Shops%20%281%29.png?dl=0"
                    alt="error"
                    id="proposal"
                  />
                ) : (
                  <img
                    className="tilesnotselected"
                    onClick={this.tileChoose9}
                    src="https://www.dl.dropboxusercontent.com/s/v9o41yy1v3rysq6/EVENTTYPES_Proposals%20%28closed%29.png?dl=0"
                    alt="error"
                    id="proposal"
                  />
                )}
              </div>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default GroupFilter;

/**this.props.commtype === "budget & proposal" &&
            this.props.forumOpen ? (
              this.props.budgetType === "school" ? (
                <div className="tilesset1">
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 1 ? (
                      <img
                        className="tilesselected1"
                        onClick={this.tileChoose1}
                        src="https://www.dl.dropboxusercontent.com/s/2tzml5qsqihwy8j/CHATSFILTER_User.png?dl=0"
                        alt="error"
                        id="campus"
                      />
                    ) : (
                      <img
                        className="tilesnotselected1"
                        onClick={this.tileChoose1}
                        src="https://www.dl.dropboxusercontent.com/s/a7sgqgncp72anfa/CHATFILTER_User%20%28closed%29.png?dl=0"
                        alt="error"
                        id="campus"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 2 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose2}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="records & preservation"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose2}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="records & preservation"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 3 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose3}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="events & recreation"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose3}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="events & recreation"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 4 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose4}
                        src="https://www.dl.dropboxusercontent.com/s/3t3b223xt8rt0zt/EVENTTYPES_Shops.png?dl=0"
                        alt="error"
                        id="engineering, arts & science"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose4}
                        src="https://www.dl.dropboxusercontent.com/s/yj95k4p9e1j6koq/EVENTTYPES_Shops%20%28closed%29.png?dl=0"
                        alt="error"
                        id="engineering, arts & science"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 5 ? (
                      <img
                        className="tilesselected1"
                        onClick={this.tileChoose5}
                        src="https://www.dl.dropboxusercontent.com/s/kiql31g6gv2agft/CENTER%20PLUS_Club.png?dl=0"
                        alt="error"
                        id="health & safety"
                      />
                    ) : (
                      <img
                        className="tilesnotselected1"
                        onClick={this.tileChoose5}
                        src="https://www.dl.dropboxusercontent.com/s/vrm3lvir0t49kt2/TILES_Clubs%20%28closed%29.png?dl=0"
                        alt="error"
                        id="health & safety"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 9 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose9}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="tuition & finance"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose9}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="tuition & finance"
                      />
                    )}
                  </div>
                </div>
              ) : this.props.budgetType === "town/county" ? (
                <div className="tilesset1">
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 1 ? (
                      <img
                        className="tilesselected1"
                        onClick={this.tileChoose1}
                        src="https://www.dl.dropboxusercontent.com/s/2tzml5qsqihwy8j/CHATSFILTER_User.png?dl=0"
                        alt="error"
                        id="engineering & variance"
                      />
                    ) : (
                      <img
                        className="tilesnotselected1"
                        onClick={this.tileChoose1}
                        src="https://www.dl.dropboxusercontent.com/s/a7sgqgncp72anfa/CHATFILTER_User%20%28closed%29.png?dl=0"
                        alt="error"
                        id="engineering & variance"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 2 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose2}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="records & preservation"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose2}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="records & preservation"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 3 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose3}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="events parks & recreation"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose3}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="events parks & recreation"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 4 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose4}
                        src="https://www.dl.dropboxusercontent.com/s/3t3b223xt8rt0zt/EVENTTYPES_Shops.png?dl=0"
                        alt="error"
                        id="education"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose4}
                        src="https://www.dl.dropboxusercontent.com/s/yj95k4p9e1j6koq/EVENTTYPES_Shops%20%28closed%29.png?dl=0"
                        alt="error"
                        id="education"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 5 ? (
                      <img
                        className="tilesselected1"
                        onClick={this.tileChoose5}
                        src="https://www.dl.dropboxusercontent.com/s/kiql31g6gv2agft/CENTER%20PLUS_Club.png?dl=0"
                        alt="error"
                        id="public health"
                      />
                    ) : (
                      <img
                        className="tilesnotselected1"
                        onClick={this.tileChoose5}
                        src="https://www.dl.dropboxusercontent.com/s/vrm3lvir0t49kt2/TILES_Clubs%20%28closed%29.png?dl=0"
                        alt="error"
                        id="public health"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 6 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose6}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="fire safety & stormweather"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose6}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="fire safety & stormweather"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 7 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose7}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="sanitation"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose7}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="sanitation"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 8 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose8}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="power"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose8}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="power"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 9 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose9}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="finance & taxes"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose9}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="finance & taxes"
                      />
                    )}
                  </div>
                </div>
              ) : this.props.budgetType === "country/providence" ? (
                <div className="tilesset1">
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 1 ? (
                      <img
                        className="tilesselected1"
                        onClick={this.tileChoose1}
                        src="https://www.dl.dropboxusercontent.com/s/2tzml5qsqihwy8j/CHATSFILTER_User.png?dl=0"
                        alt="error"
                        id="budget & finance"
                      />
                    ) : (
                      <img
                        className="tilesnotselected1"
                        onClick={this.tileChoose1}
                        src="https://www.dl.dropboxusercontent.com/s/a7sgqgncp72anfa/CHATFILTER_User%20%28closed%29.png?dl=0"
                        alt="error"
                        id="budget & finance"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 1 ? (
                      <img
                        className="tilesselected1"
                        onClick={this.tileChoose1}
                        src="https://www.dl.dropboxusercontent.com/s/2tzml5qsqihwy8j/CHATSFILTER_User.png?dl=0"
                        alt="error"
                        id="education"
                      />
                    ) : (
                      <img
                        className="tilesnotselected1"
                        onClick={this.tileChoose1}
                        src="https://www.dl.dropboxusercontent.com/s/a7sgqgncp72anfa/CHATFILTER_User%20%28closed%29.png?dl=0"
                        alt="error"
                        id="education"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 2 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose2}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="health & safety"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose2}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="health & safety"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 3 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose3}
                        src="https://www.dl.dropboxusercontent.com/s/0vtvmbjgruqv0z7/EVENTTYPES_Restaurants.png?dl=0"
                        alt="error"
                        id="legal rights"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose3}
                        src="https://www.dl.dropboxusercontent.com/s/0mtamjp1faf29tx/EVENTTYPES_Restaurants%20%28closed%29%20%281%29.png?dl=0"
                        alt="error"
                        id="legal rights"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 4 ? (
                      <img
                        className="tilesselected"
                        onClick={this.tileChoose4}
                        src="https://www.dl.dropboxusercontent.com/s/3t3b223xt8rt0zt/EVENTTYPES_Shops.png?dl=0"
                        alt="error"
                        id="preservation"
                      />
                    ) : (
                      <img
                        className="tilesnotselected"
                        onClick={this.tileChoose4}
                        src="https://www.dl.dropboxusercontent.com/s/yj95k4p9e1j6koq/EVENTTYPES_Shops%20%28closed%29.png?dl=0"
                        alt="error"
                        id="preservation"
                      />
                    )}
                  </div>
                  <div onClick={this.props.chatFilterChanger}>
                    {this.props.chatFilterChosen === 5 ? (
                      <img
                        className="tilesselected1"
                        onClick={this.tileChoose5}
                        src="https://www.dl.dropboxusercontent.com/s/kiql31g6gv2agft/CENTER%20PLUS_Club.png?dl=0"
                        alt="error"
                        id="foreign relation"
                      />
                    ) : (
                      <img
                        className="tilesnotselected1"
                        onClick={this.tileChoose5}
                        src="https://www.dl.dropboxusercontent.com/s/vrm3lvir0t49kt2/TILES_Clubs%20%28closed%29.png?dl=0"
                        alt="error"
                        id="foreign relation"
                      />
                    )}
                  </div>
                </div>
              ) : null
            ) : (
               */
