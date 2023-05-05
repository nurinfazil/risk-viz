import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface DataTableProps {
  data: [];
  decade: number;
  headerNames: string[];
}

const DataTable: React.FC<DataTableProps> = ({ data, decade, headerNames }) => {
  const [rowData, setRowData] = useState<{}[]>([]);
  const [columnDefs, setColumnDefs] = useState<{}[]>([]);

  function configRows(headerNames: string[]) {
    let cols = headerNames.map((header, i) => {
      let colConfig: {
        field: string;
        headerName: string;
        filter: boolean;
        sortable: boolean;
      } = {
        field: "",
        headerName: "",
        filter: true,
        sortable: true,
      };

      colConfig.field = headerNames[i];
      colConfig.headerName = headerNames[i];

      return colConfig;
    });

    return cols;
  }

  const gridOptions = {
    pagination: true,
    paginationPageSize: 20,
  };

  useEffect(() => {
    setColumnDefs(configRows(headerNames));

    // If the decade filter gets changed, then update the table to filter on the decade
    if (decade !== 0) {
      const filteredData = data.filter((row: any) => {
        const year = parseInt(row["Year"]);
        return year == decade;
      });
      setRowData(filteredData);
    } else {
      setRowData(data);
    }
  }, [data, decade]);

  return (
    <div className="ag-theme-alpine w-100vw h-96 pt-5">
      <AgGridReact
        gridOptions={gridOptions}
        rowData={rowData}
        columnDefs={columnDefs}
      ></AgGridReact>
    </div>
  );
};

export default DataTable;
