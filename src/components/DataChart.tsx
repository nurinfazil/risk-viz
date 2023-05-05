// @ts-nocheck

import React from "react";
import { Scatter, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

interface DataChartProps {
  filteredData: [];
}

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const DataChart: React.FC<DataChartProps> = ({ filteredData }) => {
  function transformDataForScatter(data: any) {
    let reformattedData = [];

    if (data) {
      reformattedData = data.map((row: any) => {
        return { x: row["Year"], y: row["Risk Rating"] };
      });
    }

    return reformattedData;
  }

  function transformDataForLine(data: any) {
    let averageRiskRatingData: { x: any; y: any }[] = [];

    if (data) {
      const reformattedData = data.reduce((acc: any, row: any) => {
        const year = row["Year"];
        const riskRating = parseFloat(row["Risk Rating"]);
        if (!acc[year]) {
          acc[year] = {
            year: year,
            sum: riskRating,
            count: 1,
          };
        } else {
          acc[year].sum += riskRating;
          acc[year].count++;
        }
        return acc;
      }, {});

      averageRiskRatingData = Object.values(reformattedData).map(
        (item: any) => ({
          x: item.year,
          y: (item.sum / item.count).toFixed(2),
        })
      );
    }

    return averageRiskRatingData;
  }

  const data = {
    labels: ["Scatter", "Line"],
    datasets: [
      {
        label: "Risk Rating",
        data: transformDataForScatter(filteredData),
        backgroundColor: "rgba(138,180,248, 0.2)",
        borderColor: "rgba(138,180,248, 1)",
        borderWidth: 2,
        type: "scatter",
      },
      {
        label: "Risk Rating Average by Decade",
        data: transformDataForLine(filteredData),
        backgroundColor: "rgba(25,86,219, 0.2)",
        borderColor: "rgba(25,86,219, 1)",
        borderWidth: 2,
        type: "line",
      },
    ],
  };
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Decade",
        },
      },
      y: {
        title: {
          display: true,
          text: "Risk Rating",
        },
      },
    },
    backgroundColor: "white",
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            const assetName = filteredData[tooltipItem.dataIndex]["Asset Name"];
            const riskRating =
              filteredData[tooltipItem.dataIndex]["Risk Rating"];
            const riskFactors = JSON.stringify(
              filteredData[tooltipItem.dataIndex]["Risk Factors"]
            );
            const year = filteredData[tooltipItem.dataIndex]["Year"];
            return `Asset Name: ${assetName}, Risk Rating: ${riskRating}, Risk Factors: ${riskFactors}, Year: ${year}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white">
      <Scatter data={data} options={options} />
    </div>
  );
};

export default DataChart;
