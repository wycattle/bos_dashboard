import type { CSSProperties } from "react";


export const thDate: CSSProperties = {  //headers that are dates
  textAlign: "right",
  fontSize: "0.6rem",
  padding: "1px 2px",
  whiteSpace: "nowrap",
  lineHeight: 1.1,
  verticalAlign: "middle",  
  backgroundColor: "var(--bg)",
  color: "var(--text)",
};

export const thF: CSSProperties = { //headers 'focus' like 'bold'
  textAlign: "center",
  fontSize: "0.75rem",
  padding: "1px 2px",
  fontWeight: 700,
  backgroundColor: "var(--bg)",
  color: "var(--text)",

};

export const th: CSSProperties = {  //'normal ' headers
  textAlign: "center",
  fontSize: "0.7rem",
  padding: "",
  lineHeight: 1.1,
  verticalAlign: "middle",
  backgroundColor: "var(--bg)",
  color: "var(--text)",

};

export const tdDate: CSSProperties = {  //table data - dates
  textAlign: "right",
  fontSize: "0.72rem",
  padding: "1px 2px",
  lineHeight: 1.1,
  backgroundColor: "var(--bg)",
  color: "var(--text)",

};

export const tdF: CSSProperties = { //tabledata - 'bold'
  textAlign: "center",
  fontSize: "0.75rem",
  padding: "1px 2px",
  minWidth: "30px",  
  fontWeight: 600,
  lineHeight: 1.1,
  backgroundColor: "var(--bg)",
  color: "var(--text)",

};

export const td: CSSProperties = { //table data - ordinary - right align
  textAlign: "right",
  fontSize: "0.7rem",
  padding: "1px 2px",
  minWidth: "30px",
  backgroundColor: "var(--bg)",
  color: "var(--text)",

};

export const tdc: CSSProperties = { //table data - centered
  textAlign: "center",
  fontSize: "0.7rem",
  padding: "1px 2px",
  backgroundColor: "var(--bg)",
  color: "var(--text)",

};

// Optional: wider date cell for expected bdate
export const tdDateWide: CSSProperties = {
  ...tdDate,
  minWidth: "70px",
  padding: "1px 1px ",
  textAlign: "center",
  backgroundColor: "var(--bg)",
  color: "var(--text)",


};

export const tableContainer: CSSProperties = {
  overflowX: "auto",
  overflowY: "auto",
  height: "100%",
  width: "fit-content",
  maxWidth: "100%",
  border: "1px solid #0aeca8",
  borderRadius: "4px",
  padding: "0.25rem",
  background: "var(--surface)",
  whiteSpace: "normal",
};

export const tdSeparator: CSSProperties = {
  ...td,
  paddingLeft: "1.25rem",
  borderLeft: "1px solid var(--surface-border)",
  textAlign: "center",
};

export const thSeparator: CSSProperties = {
  ...th,
  paddingLeft: "1.25rem",
  borderLeft: "1px solid var(--surface-border)",
  whiteSpace: "normal",
  width: "70px",
  textAlign: "center",    
};


export const navButtonStyle: CSSProperties = {
  padding: "0.5rem 1rem",
  fontSize: "1rem",
  fontWeight: 600,
  background: "var(--accent)",
  color: "var(--accent-foreground)",
  border: "1px solid var(--surface-border)",
  borderRadius: "6px",
  cursor: "pointer",
};