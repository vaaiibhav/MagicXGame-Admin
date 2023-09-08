//  Internally, customStyles will deep merges your customStyles with the default styling.
export const customStyles = {
  rows: {
    style: {
      minHeight: "72px", // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
      background: "#4B79A1" /* fallback for old browsers */,
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      color: "white",
      borderStyle: " none solid solid none",
      borderWidth: "1px",
      borderColor: "black",
    },
  },
  cells: {
    style: {
      borderStyle: " none solid solid none",
      borderWidth: "1px",
      borderColor: "black",
      //   border: "black 1px solid",
      paddingLeft: "8px", // override the cell padding for data cells
      paddingRight: "8px",
    },
  },
};
