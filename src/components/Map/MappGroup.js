import React from "react";
import { BaseControl } from "react-map-gl";

class MappGroup extends BaseControl {
  _render() {
    const { cluster, mapThis } = this.props;
    const count = cluster.properties.point_count_abbreviated;
    let addresses = [];
    mapThis.map((x) => {
      const comp =
        x.venue && x.venue.address ? x.venue.address : String(x.center);
      if (!x.venue || x.venue.address) {
        return addresses.includes(comp) && addresses.push(comp);
      } else return null;
    });
    return (
      addresses.length > 0 && (
        <div
          onClick={
            addresses.length !== count
              ? () => this.props.onClick(cluster)
              : () => this.props.openCluster(addresses)
          }
          className="markercluster"
        >
          <span>{count}</span>
        </div>
      )
    );
  }
}
export default MappGroup;
