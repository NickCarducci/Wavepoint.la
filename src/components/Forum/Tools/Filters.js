import React from "react";
import {
  budgetType,
  caseType,
  ordinanceType
} from "../../../widgets/arraystrings.js";
import Filter from "./Filter.js";
import NewFilter from "./NewFilter.js";

class Filters extends React.Component {
  state = { newIssue: "" };
  render() {
    const { collection, commtype, departmentTyped, showFilters } = this.props;
    var isMember = "";
    var isAdmin = "";
    var isLoggedAndCommunity =
      this.props.auth !== undefined && this.props.community;
    if (isLoggedAndCommunity) {
      isAdmin =
        this.props.auth.uid === this.props.community.authorId ||
        (this.props.community.admin &&
          this.props.community.admin.includes(this.props.auth.uid));
      isMember =
        !this.props.community.privateToMembers ||
        this.props.community.faculty.includes(this.props.auth.uid) ||
        this.props.community.members.includes(this.props.auth.uid);
    }
    var switcher = this.props.isBudget
      ? {
          open: this.props.openBudget,
          chosen: this.props.budgetTyped,
          name: budgetType.name,
          opened: this.props.budgetTyper,
          type: budgetType,
          typeName: "budgetType",
          func: (i) => this.props.chooseB(i)
        }
      : this.props.isCase
      ? {
          open: this.props.openCase,
          chosen: this.props.caseTyped,
          name: budgetType.name,
          opened: this.props.caseTyper,
          type: caseType,
          typeName: "caseType",
          func: (i) => this.props.chooseCase(i)
        }
      : this.props.isDepartment
      ? {
          open: this.props.openDepartments,
          chosen: this.props.departmentTyped,
          opened: this.props.departmentTyper,
          type:
            this.props.community && this.props.community.departmentFilters
              ? this.props.community.departmentFilters
              : [],
          typeName: "departmentType",
          func: (i) => this.props.chooseD(i)
        }
      : this.props.isClass
      ? {
          open: this.props.openClasses,
          chosen: this.props.classTyped,
          opened: this.props.classTyper,
          type:
            this.props.community && this.props.community.classFilters
              ? this.props.community.classFilters
              : [],
          typeName: "classType",
          func: (i) => this.props.chooseC(i)
        }
      : this.props.isOrdinance
      ? {
          open: this.props.openOrdinances,
          chosen: this.props.ordinanceTyped,
          opened: this.props.ordinanceTyper,
          type: ordinanceType,
          typeName: "ordinanceType",
          func: (i) => this.props.chooseO(i)
        }
      : this.props.isElection
      ? {
          open: this.props.openElections,
          chosen: this.props.electionTyped,
          opened: this.props.electionTyper,
          type:
            this.props.community && this.props.community.electionFilters
              ? this.props.community.electionFilters
              : [],
          typeName: "electionType",
          func: (i) => this.props.chooseE(i)
        }
      : this.props.isNew
      ? {
          open: this.props.openForum,
          chosen: this.props.forumTyped,
          opened: this.props.forumTyper,
          type: this.props.community
            ? this.props.community.issues
            : this.props.issues,
          typeName: "issues",
          func: (i) => this.props.chooseF(i)
        }
      : {
          type: null,
          func: () => {}
        };
    var field = this.props.isClass
      ? "classFilters"
      : this.props.isOrdinance
      ? "departmentFilters"
      : this.props.isElection
      ? "electionFilters"
      : "";
    return (
      <div
        style={{
          bottom: "0px",
          overflow: "hidden",
          zIndex: 9999,
          width: "100%",
          transition: ".5s ease-out",
          height: !showFilters ? "0%" : "100%",
          position: "fixed"
        }}
      >
        <div
          //#333
          onClick={this.props.bigClose}
          style={{
            transition: ".3s ease-in",
            backgroundColor: "rgba(20,20,40,.5)",
            display: "flex",
            top: "0px",
            position: "absolute",
            width: "100%",
            height: showFilters ? "100%" : "0%"
          }}
        />
        {["elections", "classes", "departments"].includes(
          this.props.commtype
        ) &&
          !this.props.subForum &&
          this.props.isAdmin && (
            <NewFilter community={this.props.community} field={field} />
          )}

        <Filter
          openWhen={this.props.openWhen}
          departmentTyped={departmentTyped}
          theLotOfPosts={this.props.theLotOfPosts}
          open={switcher.open}
          city={this.props.city}
          community={this.props.community}
          collection={collection}
          field={field}
          commtype={commtype}
          isAdmin={isAdmin}
          isMember={isMember}
          func={switcher.func}
          type={switcher.type}
          typeName={switcher.typeName}
          opened={switcher.opened}
          chosen={switcher.chosen}
        />
      </div>
    );
  }
}

export default Filters;
