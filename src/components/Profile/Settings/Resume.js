import React from "react";
import firebase from "../../.././init-firebase";

class Resume extends React.Component {
  state = {
    position: "",
    org: "",
    started:
      new Date().getFullYear() +
      "-" +
      new Date().getMonth() +
      "-" +
      new Date().getDate()
  };
  render() {
    const { jobDescriptions } = this.props;
    return (
      <div>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
          onSubmit={(e) => {
            e.preventDefault();
            firebase
              .firestore()
              .collection("jobDescriptions")
              .add({
                position: this.state.position,
                org: this.state.org,
                started: this.state.started,
                authorId: this.props.auth.uid
              })
              .then(() => {})
              .catch((err) => console.log(err.message));
          }}
        >
          What do you do everyday?
          <div
            onMouseEnter={() => this.setState({ hoverDont: true })}
            onMouseLeave={() => this.setState({ hoverDont: false })}
            style={{
              padding: "4px",
              margin: "15px",
              height: "26px",
              maxWidth: "90%",
              width: "max-content",
              color: this.state.hoverDont ? "white" : "",
              backgroundColor: this.state.hoverDont ? "blue" : "",
              border: "3px solid blue",
              borderRadius: "7px",
              display: "flex",
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              transition: ".3s ease-in"
            }}
          >
            <input
              onChange={(x) => {
                var dontShowThis = x.target.value;
                firebase
                  .firestore()
                  .collection("userDatas")
                  .doc(this.props.auth.uid)
                  .update({ dontShowJob })
                  .then(() => {
                    if (dontShowJob) {
                      window.alert("your job's hidden...");
                    } else {
                      console.log("now showing: your job");
                    }
                  });
              }}
              style={{
                margin: "4px",
                height: "10px",
                width: "10px",
                display: "flex",
                position: "relative",
                justifyContent: "center",
                alignItems: "center"
              }}
              type="checkbox"
            />{" "}
            <label>Don't show this</label>
          </div>
          <input
            className="input"
            placeholder="Position"
            value={this.state.position}
            onChange={(e) => this.setState({ position: e.target.value })}
          />
          <input
            defaultValue="Self"
            className="input"
            placeholder="Self"
            onChange={(e) => {
              var whole = e.target.value;
              var org = "";
              if (whole === "") {
                org = "Self";
              } else {
                var first = whole[0].toUpperCase();
                org = first + whole.split(first)[1];
              }
              this.setState({ org });
            }}
          />
          <input
            className="input"
            type="date"
            placeholder="years"
            value={this.state.started}
            onChange={(e) => this.setState({ started: e.target.value })}
          />
          {jobDescriptions.length > 1 && (
            <div
              onClick={
                this.state.extraJobMake
                  ? () => {
                      this.setState({ extraJobMake: false });
                    }
                  : () => {
                      this.setState({ extraJobMake: true });
                    }
              }
            >
              Balancing more than one plate?
            </div>
          )}
        </form>
        {this.state.extraJobMake && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              firebase
                .firestore()
                .collection("jobDescriptions")
                .add({
                  position: this.state.position,
                  org: this.state.org,
                  started: this.state.started,
                  authorId: this.props.auth.uid
                })
                .then(() => {})
                .catch((err) => console.log(err.message));
            }}
          >
            <input
              className="input"
              placeholder="Position"
              value={this.state.position}
            />
            <input
              defaultValue="Self"
              className="input"
              placeholder="Organization"
              onChange={(e) => {
                var whole = e.target.value;
                var first = whole[0].toUpperCase();
                var org = first + whole.split(first)[1];
                this.setState({ org });
              }}
            />
            <input
              className="input"
              type="date"
              placeholder="years"
              value={this.state.started}
            />
          </form>
        )}
        {jobDescriptions.map((job) => {
          return (
            <div>
              <div>
                {job.position}
                <br />
                {job.org}
                <br />
                {new Date(job.date).toLocaleDateString()}&nbsp;- current
              </div>
              <div
                onClick={() => {
                  var answer = window.confirm(
                    `are you sure you'd like to delete ${job.position} at ${
                      job.org
                    } from ${new Date(job.date).toLocaleDateString()}`
                  );
                  if (answer)
                    firebase
                      .firestore()
                      .collection("jobDescriptions")
                      .doc(job.id)
                      .delete()
                      .then(() =>
                        window.alert(
                          `successfully deleted ${job.position} at ${job.org}`
                        )
                      )
                      .catch((err) => console.log(err.message));
                }}
              >
                &times;
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
export default Resume;
