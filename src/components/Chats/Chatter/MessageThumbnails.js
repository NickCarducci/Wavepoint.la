import React from "react";

class MessageThumbnails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imageError: false };
    this.image = React.createRef();
  }
  corsProxy(url) {
    return `https://cors-anywhere.herokuapp.com/${url}`;
  }
  render() {
    const { message } = this.props;
    return (
      <a
        ref={this.image}
        onDragEnd={this.props.closeTheTopics}
        onDrag={e => {
          e.preventDefault();
          e.stopPropagation();
          this.props.openTopics();
          e.dataTransfer.effectAllowed = "move";
          //console.log(message)
          //var messagea = { ...message };
          //messagea = `https://cors-anywhere.herokuapp.com/${messagea.message}`;
          //e.dataTransfer.setData("text/plain", messagea);

          //e.dataTransfer.setDragImage(this.image.current, 20, 20);
        }}
        href={this.props.d.content}
        //draggable={true}
        onMouseEnter={() => !this.state.glow && this.setState({ glow: true })}
        onMouseLeave={() => this.state.glow && this.setState({ glow: false })}
        key={this.props.i}
        style={
          this.state.glow
            ? {
                display: "flex",
                position: "relative",
                border: "1px solid blue",
                height: "100%",
                flexDirection: "column"
              }
            : {
                display: "flex",
                position: "relative",
                height: "100%",
                flexDirection: "column"
              }
        }
      >
        {this.state.imageError && this.props.signedIn === false && (
          <div
            style={{
              display: "flex",
              position: "relative",
              fontSize: "12px",
              minWidth: "200px",
              height: "200px"
            }}
          >
            you may need to sign in
          </div>
        )}
        {this.state.imageError &&
          this.props.signedIn === true &&
          "Evidently, your signedIn account has no access to this file. Try exiting this chat and returning, or ask the owner to share it with your google account"}

        {!this.state.imageError && (
          <img
            onError={() => this.setState({ imageError: true })}
            src={this.props.d.thumbnail}
            alt="error"
          />
        )}

        <div
          style={{
            display: "flex",
            position: "relative",
            fontSize: "12px"
          }}
          onClick={() => this.props.shareDoc(message.id)}
        >
          Share
        </div>
      </a>
    );
  }
}
export default MessageThumbnails;
