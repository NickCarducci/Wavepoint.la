import React from "react";

class Words extends React.Component {
  state = {};
  render() {
    const {
      type,
      focusSuggest,
      subForum,
      tileChosen,
      forumOpen,
      commtype
    } = this.props;
    return (
      <form
        style={{
          height: "56px",
          boxShadow: "-5px 0px 10px 2px rgba(30,20,230,.4)",
          paddingLeft: "4px",
          borderBottomRightRadius: "20px",
          backgroundColor: `rgba(30,20,230,${subForum ? ".7" : "1"})`
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          onClick={this.props.focusSearching}
          onFocus={this.props.focusSearching}
          //onBlur={this.props.blurSearching}
          className="editcolorheader"
          style={{
            backgroundColor: !focusSuggest ? "rgba(30,20,30,.4)" : "",
            userSelect: "text",
            display: "flex",
            position: "relative",
            color: !focusSuggest ? "white" : "blue",
            fontSize: "24px",
            width: "calc(100vw - 170px)",
            border: "0px solid grey",
            transition: ".3s ease-in"
          }}
          placeholder={
            this.props.globeChosen
              ? "Following"
              : this.props.community
              ? this.props.community.message
              : this.props.city
          }
          value={this.props.searching}
          onChange={(e) => {
            var va = e.target.value;
            this.props.searcher(e);
            if (this.typing && va === "") {
              e.currentTarget.blur();
              this.typing = null;
            } else this.typing = true;
          }}
        />
        <div
          style={{
            display: "flex",
            position: "relative",
            width: "max-content",
            opacity: `${subForum ? ".5" : "1"}`,
            borderBottomLeftRadius: "12px",
            transition: ".3s ease-in"
          }}
        >
          <div
            style={{
              fontSize: "20px",
              display: "flex",
              width: "max-content",
              position: "absolute",
              color: "white",
              borderBottomLeftRadius: "12px",
              paddingLeft: "2px",
              transition: ".3s ease-in"
            }}
          >
            {(subForum || !forumOpen) && `${tileChosen}: `}
            {forumOpen && !subForum ? commtype : type}
          </div>
        </div>
      </form>
    );
  }
}
export default Words;
