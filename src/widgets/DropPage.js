import React from "react";
import { Link } from "react-router-dom";
import { RegisterCurseWords } from "../Forum";
import Post from "../components/Post";
import PeanutGallery from "../components/Post/PeanutGallery";

class DropPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goBackTo: "/",
      postHeight: 0,
      newFolder: "",
      selectedFolder: "*",
      closeFilter: true,
      closeDrop: true,
      folders: [],
      videos: [],
      confirmInput: "",
      width: window.innerHeight,
      height: window.innerWidth
    };
    this.only = React.createRef();
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
  }
  refresh = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      let width = window.innerWidth; // * 0.01;
      let height = window.innerHeight; // * 0.01;
      this.setState({
        width,
        height
      });
    }, 200);
  };
  componentDidMount = async () => {
    this.refresh();
    window.addEventListener("resize", this.refresh);
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.from
    ) {
      this.setState({ goBackTo: this.props.location.state.from });
    } else {
      this.setState({ goBackTo: "/" });
    }
  };
  render() {
    const { goBackTo } = this.state;
    const { comments, drop } = this.props;
    let res = {};
    for (let i = 0; i < 14; i++) {
      res[i] = (i / 14) * 0.3;
    }
    var mTTT = drop ? drop.message.substring(0, drop.message.length) : "";

    var isGood =
      this.props.auth !== undefined &&
      this.props.user !== undefined &&
      !this.props.user.under13 &&
      this.props.user.showCurses;
    var mTT = RegisterCurseWords(mTTT, isGood);

    var vertical = this.state.height < 380 && !this.props.showFilters;
    return (
      <div
        style={{
          zIndex: "10",
          flexDirection: "column",
          display: "flex",
          position: "fixed",
          width: "100%",
          height: drop ? "100%" : "0%",
          backgroundColor: "rgb(20,20,25)",
          alignItems: "center"
        }}
      >
        {drop && (
          <div>
            <Link
              to={goBackTo}
              style={{
                fontSize: "20px",
                textDecoration: "none",
                height: "56px",
                width: "100%",
                backgroundColor: "navy",
                color: "white",
                display: "flex",
                position: "relative",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              &times;
            </Link>
            <div
              ref={this.only}
              key={drop.id}
              style={{
                WebkitColumnBreakInside: "avoid",
                pageBreakInside: "avoid",
                breakInside: "avoid",
                zIndex: 6,
                width: "100%",
                maxWidth: drop.message.length > 200 ? "600px" : "300px",
                maxHeight:
                  drop === 1 || this.state.postHeight > 0
                    ? ""
                    : "calc(100% - 1px)",
                height: `min-content`,
                position: "relative",
                display: "flex",
                color: "black",
                flexDirection: "column",
                opacity: "1",
                borderBottom: "1px solid grey",
                overflowX: "hidden",
                overflowY: "auto"
              }}
            >
              <Post
                collection={drop.collection}
                mTT={mTT}
                res={res}
                i={1}
                parent={drop}
                isDroppedIn={drop}
                linkDrop={this.props.linkDrop}
                dropId={this.props.dropId}
                city={drop.city}
                commtype={
                  ["budget", "oldBudget"].includes(drop.collection)
                    ? "budget"
                    : ["elections", "oldElections"].includes(drop.collection)
                    ? "elections"
                    : ["cases", "oldCases"].includes(drop.collection)
                    ? "cases"
                    : ["ordinances"].includes(drop.collection)
                    ? "ordinances"
                    : "forum"
                }
                openWhen={
                  ["oldElections", "oldCases", "oldBudget"].includes(
                    drop.collection
                  )
                    ? "expired"
                    : "new"
                }
                user={this.props.user}
                auth={this.props.auth}
                community={this.props.community} //
                etypeChanger={this.props.etypeChanger}
                chosenPostId={this.props.chosenPostId}
                helper={() => this.props.helper(drop)}
                delete={this.props.delete}
                comments={comments}
                clear={this.props.clear}
                height={this.state.height}
                globeChosen={this.props.globeChosen}
                setEditing={(editing) => this.setState(editing)}
              />
            </div>
            <PeanutGallery
              chosenPost={this.props.chosenPost}
              chosenPostId={this.props.chosenPostId}
              getUserInfo={this.props.getUserInfo}
              height={this.state.height}
              postHeight={this.state.postHeight}
              postMessage={this.props.postMessage}
              vertical={vertical}
              comments={this.props.comments}
              commentType={
                this.props.chosenPost && this.props.chosenPost.commentsName
              }
              width={this.state.width}
              forumPosts={[drop]}
              user={this.props.user}
              auth={this.props.auth}
              helper={this.props.helper}
              closeGroupFilter={this.props.closeGroupFilter}
              openGroupFilter={this.props.openGroupFilter}
            />
          </div>
        )}
      </div>
    );
  }
}
export default DropPage;
