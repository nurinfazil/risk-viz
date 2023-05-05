import React from "react";

interface DataChartProps {
  filteredData: [];
}

const DataChart: React.FC<DataChartProps> = ({ filteredData }) => {
  // destructure any necessary props here
  // implement the component logic here

  console.log(filteredData);

  return <div>Chart</div>;
};

export default DataChart;
