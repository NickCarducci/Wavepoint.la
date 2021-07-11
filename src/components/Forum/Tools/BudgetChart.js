import React from "react";
import { Line } from "react-svg-curve";

class BudgetChart extends React.Component {
  componentDidUpdate = prevProps => {
    if (prevProps.companyData !== this.props.companyData) {
      let data = [];
      let date = [];
      let price = [];
      this.props.companyData.map(x => {
        date.push(new Date(x.date).getTime());
        price.push(x.close);
        data.push([new Date(x.date).getTime(), x.close]);
        return x;
      });
      var lowDate = Math.min(...date);
      var highDate = Math.max(...date);
      var lowPrice = Math.min(...price);
      var highPrice = Math.max(...price);
      this.setState({
        data,
        yAxis: highPrice - lowPrice,
        xAxis: highDate - lowDate,
        lowDate,
        lowPrice
      });
    }
  };
  render() {
    return (
      <svg
        style={{
          width: "100%",
          height: "300px",
          borderBottom: "1px white solid",
          borderTop: "1px white solid"
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <Line
          data={this.state.data.map(([x, y]) => [
            ((x - this.state.lowDate) / this.state.xAxis) * 400,
            ((y - this.state.lowPrice) / this.state.yAxis) * 290
          ])}
        />
      </svg>
    );
  }
}
export default BudgetChart;
