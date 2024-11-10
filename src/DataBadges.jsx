import React from "react";

function DataBadges({ data, recordId }) {
  const renderData = (value) => {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    } else if (Array.isArray(value)) {
      return value.length > 0 ? "✅" : "❌";
    } else if (value && typeof value === "object") {
      return "Invalid data"; // Optional: use JSON.stringify(value) for debugging
    }
    return <span style={{ color: "red" }}>No data</span>;
  };

  return (
    <div className="data-badges">
      <table className="data-table">
        <tbody>
          {/* <tr>
            <td><strong>Record ID</strong></td>
            <td>{renderData(recordId)}</td>
          </tr> */}
          {/* <tr>
            <td><strong>Ref ID</strong></td>
            <td>{renderData(data?.Ref_ID)}</td>
          </tr> */}
          <tr>
            <td><strong>First Name</strong></td>
            <td>{renderData(data?.Use_FNAME_Badge)}</td>
          </tr>
          <tr>
            <td><strong>Last Name</strong></td>
            <td>{renderData(data?.Use_LNAME_Badge)}</td>
          </tr>
          <tr>
            <td><strong>Position</strong></td>
            <td>{renderData(data?.Use_Position_Badge)}</td>
          </tr>
          <tr>
            <td><strong>Company</strong></td>
            <td>{renderData(data?.Use_Company_Badge)}</td>
          </tr>
          <tr>
            <td><strong>Country</strong></td>
            <td>{renderData(data?.Use_Country_Badge)}</td>
          </tr>
           <tr>
            <td><strong>Email</strong></td>
            <td>{renderData(data?.Email)}</td>
          </tr>
          <tr>
            <td><strong>Phone</strong></td>
            <td>{renderData(data?.Phone)}</td>
          </tr> 
          {/* <tr>
            <td><strong>QR Contact</strong></td>
            <td>
              {Array.isArray(data?.QR_Contact) && data.QR_Contact[0]?.url
                ? "✅"
                : "❌"}
            </td>
          </tr>  */}
          <tr>
            <td><strong>Background Type</strong></td>
            <td>
              {Array.isArray(data?.BG_Type) && data.BG_Type[0]?.url
                ? "✅"
                : "❌"}
            </td>
          </tr>
          {/* <tr>
            <td><strong>Photo</strong></td>
            <td>
              {data?.Photo ? (
                <span style={{ color: "green" }}>✅</span>
              ) : (
                <span style={{ color: "red" }}>❌</span>
              )}
            </td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
}

export default DataBadges;
