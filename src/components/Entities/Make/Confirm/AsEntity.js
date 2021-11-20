import React from "react";

class CreateAsEntity extends React.Component {
  state = {};
  render() {
    const { entityType } = this.props;
    return (
      <div className="eventnewcitysearch">
        <div
          style={
            this.props.entityType
              ? {
                  color: "#777",
                  backgroundColor: "rgba(240,240,240,.2)",
                  fontSize: "12px",
                  margin: "5px"
                }
              : {
                  color: "white",
                  fontSize: "14px",
                  margin: "5px",
                  marginBottom: "10px"
                }
          }
          onClick={() =>
            this.props.setPoster({
              entityId: null,
              entityType: null
            })
          }
        >
          Post as yourself
        </div>

        <select
          onChange={(e) =>
            this.props.setPoster({
              entityType: e.target.value
            })
          }
        >
          {[
            { collection: "clubs", name: "myClubs" },
            { collection: "shops", name: "myShops" },
            { collection: "restaurants", name: "myRestaurants" },
            { collection: "services", name: "myServices" },
            { collection: "classes", name: "myClasses" },
            { collection: "departments", name: "myDepartments" },
            { collection: "pages", name: "myPages" }
          ].map((x) => {
            if (this.props[x.name] && this.props[x.name].length > 0) {
              return <option key={x.name}>{x.collection}</option>;
            } else return null;
          })}
        </select>
        {(entityType === "clubs"
          ? this.props.myClubs
          : entityType === "shops"
          ? this.props.myShops
          : entityType === "restaurants"
          ? this.props.myRestaurants
          : entityType === "services"
          ? this.props.myServices
          : entityType === "classes"
          ? this.props.myClasses
          : entityType === "departments"
          ? this.props.myDepartments
          : entityType === "pages"
          ? this.props.myPages
          : []
        ).map((x) => {
          return (
            <div
              style={
                this.props.entityId === x.id
                  ? { color: "white" }
                  : { color: "#777" }
              }
              onClick={() => {
                this.props.setPoster({
                  entityId: x.id,
                  entityType
                });
              }}
            >
              Post as {x.message}
            </div>
          );
        })}
      </div>
    );
  }
}
export default CreateAsEntity;
