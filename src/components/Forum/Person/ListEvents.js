import React from "react";

class ListEvents extends React.Component {
  render() {
    const { swipe } = this.props;
    return (
      <div
        style={{
          minHeight: "200px",
          height: "min-content",
          display: swipe === "paw" ? "flex" : "none",
          color: "white",
          backgroundColor: "rgb(10,20,40)",
          justifyContent: this.props.events.length === 0 ? "center" : "",
          alignItems: this.props.events.length === 0 ? "center" : "",
          border: "3px solid black",
          borderRadius: "10px",
          overflowX: "auto",
          overflowY: "hidden",
          width: "90%",
          marginTop: "20px",
          marginBottom: "20px",
          marginLeft: "calc(5% - 3px)"
        }}
      >
        {this.props.events.length > 0
          ? this.props.events.map((x) => {
              return <div key={x.id}>{x.id}</div>;
            })
          : `no ${this.props.name}`}
      </div>
    );
  }
}
export default ListEvents;
