import React from "react";
import CaseJudge from "./CaseJudge";
import CaseProsecution from "./CaseProsecution";
import CaseDefense from "./CaseDefense";
import CaseTestimonies from "./CaseTestimonies";
import CaseConsults from "./CaseConsults";
import CaseJury from "./CaseJury";

class CaseSwitch extends React.Component {
  state = { chosenCaseSubject: "prosecution" };
  render() {
    const { x } = this.props;
    var court =
      this.props.auth !== undefined &&
      this.props.community &&
      (this.props.community.authorId === this.props.auth.uid ||
        this.props.community.admin.includes(this.props.auth.uid) ||
        this.props.community.faculty.includes(this.props.auth.uid));
    return (
      <div>
        <CaseJudge
          auth={this.props.auth}
          x={x}
          users={this.props.users}
          community={this.props.community}
        />
        <select
          value={this.state.chosenCaseSubject}
          onChange={(e) => this.setState({ chosenCaseSubject: e.target.value })}
        >
          <option>prosecution</option>
          <option>defense</option>
          <option>testimonies</option>
          <option>consultancies</option>
          <option>jury</option>
        </select>
        {this.state.chosenCaseSubject === "prosecution" && (
          <CaseProsecution
            getUserInfo={this.props.getUserInfo}
            court={court}
            auth={this.props.auth}
            x={x}
            users={this.props.users}
            community={this.props.community}
          />
        )}
        {this.state.chosenCaseSubject === "defense" && (
          <CaseDefense
            getUserInfo={this.props.getUserInfo}
            court={court}
            auth={this.props.auth}
            x={x}
            users={this.props.users}
            community={this.props.community}
          />
        )}
        {this.state.chosenCaseSubject === "testimonies" && (
          <CaseTestimonies
            getUserInfo={this.props.getUserInfo}
            court={court}
            auth={this.props.auth}
            x={x}
            users={this.props.users}
            community={this.props.community}
          />
        )}
        {this.state.chosenCaseSubject === "consultancies" && (
          <CaseConsults
            getUserInfo={this.props.getUserInfo}
            court={court}
            auth={this.props.auth}
            x={x}
            users={this.props.users}
            community={this.props.community}
          />
        )}
        {this.state.chosenCaseSubject === "jury" && (
          <CaseJury
            getUserInfo={this.props.getUserInfo}
            court={court}
            auth={this.props.auth}
            x={x}
            users={this.props.users}
            community={this.props.community}
          />
        )}
      </div>
    );
  }
}
export default CaseSwitch;
