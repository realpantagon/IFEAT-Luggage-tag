import axios from "axios";
import { useState } from "react";
import QRCode from "react-qr-code";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("IFEAT-");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchAirtableByRefId = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/app5cBH0nxzVUysXB/Registration`,
        {
          headers: {
            Authorization: `Bearer patqmneNITxUZMqvh.6428bde97139fccfde8876240fce3c9516d79b6b2484a180eb6e4e696661cde5`,
          },
          params: {
            filterByFormula: `{Ref_ID} = "${searchTerm}"`,
          },
        }
      );

      if (response.data.records.length > 0) {
        setRecord(response.data.records[0]);
      } else {
        setRecord(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchAirtableByRefId();
    }
  };

  const handlePrint = () => {
    window.print(); // Opens the browser's print dialog
  };

  return (
    <div className="app-container">
      <input
        type="text"
        name="searchTerm"
        placeholder="Enter Ref_ID"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="prefilled-input"
      />

      {loading ? (
        <div className="spinner"></div>
      ) : record ? (
        <div className="record-container">
          <table className="record-table">
            <tbody>
              <tr>
                <td><strong>Ref ID:</strong></td>
                <td>{record.fields["Ref_ID"]}</td>
              </tr>
              <tr>
                <td><strong>First Name:</strong></td>
                <td>{record.fields["First Name"]}</td>
              </tr>
              <tr>
                <td><strong>Last Name:</strong></td>
                <td>{record.fields["Last Name"]}</td>
              </tr>
            </tbody>
          </table>
          {showQrCode && (
            <div className="qr-code-container">
              <QRCode value={record.fields["Ref_ID"]} size={150} />
            </div>
          )}
          
          <button className="print-button" onClick={handlePrint}>Print</button>
        </div>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}

export default App;
