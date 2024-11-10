import axios from "axios";
import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);
  const [isPrintPreview, setIsPrintPreview] = useState(false);
  const qrCodeRef = useRef();

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchAirtableByName = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/app5cBH0nxzVUysXB/Registration`,
        {
          headers: {
            Authorization: `Bearer patqmneNITxUZMqvh.6428bde97139fccfde8876240fce3c9516d79b6b2484a180eb6e4e696661cde5`,
          },
          params: {
            filterByFormula: `
              OR(
                SEARCH(LOWER("${searchTerm}"), LOWER({First Name})),
                SEARCH(LOWER("${searchTerm}"), LOWER({Last Name}))
              )
            `,
          },
        }
      );

      setRecords(response.data.records);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchAirtableByName();
    }
  };

  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
    setQrCodeDataUrl(null); // Reset QR code when selecting a new record
  };

  const generateQRCode = () => {
    const data = selectedRecord.fields["Ref_ID"];
    const svg = qrCodeRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const pngDataUrl = canvas.toDataURL("image/png");
      setQrCodeDataUrl(pngDataUrl);
      URL.revokeObjectURL(url);
    };
  };

  const togglePrintPreview = () => {
    setIsPrintPreview(!isPrintPreview);
  };

  return (
    <div className="app-container">
      {!isPrintPreview ? (
        <>
          <input
            type="text"
            name="searchTerm"
            placeholder="Enter First or Last Name"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="prefilled-input"
          />

          {loading ? (
            <div className="spinner"></div>
          ) : records.length > 0 ? (
            <table className="record-table">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.fields["First Name"]}</td>
                    <td>{record.fields["Last Name"]}</td>
                    <td>
                      <button onClick={() => handleSelectRecord(record)}>Select</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data found.</p>
          )}

          {selectedRecord && (
            <div className="record-container">
              <div className="record-row"><strong>Ref ID:</strong> {selectedRecord.fields["Ref_ID"]}</div>
              <div className="record-row"><strong>First Name:</strong> {selectedRecord.fields["First Name"]}</div>
              <div className="record-row"><strong>Last Name:</strong> {selectedRecord.fields["Last Name"]}</div>

              <button className="generate-button" onClick={generateQRCode}>Generate QR</button>

              <div ref={qrCodeRef} style={{ display: "none" }}>
                <QRCode value={selectedRecord.fields["Ref_ID"]} size={150} />
              </div>

              {qrCodeDataUrl && (
                <div className="qr-code-preview">
                  <img src={qrCodeDataUrl} alt="QR Code" width="150" height="150" />
                </div>
              )}

              <button className="print-button" onClick={togglePrintPreview}>Print Preview</button>
            </div>
          )}
        </>
      ) : (
        <div className="print-preview">
          <div className="record-info">
            <strong>Ref ID:</strong> {selectedRecord.fields["Ref_ID"]}
          </div>
          <div className="record-info">
            <strong>First Name:</strong> {selectedRecord.fields["First Name"]}
          </div>
          <div className="record-info">
            <strong>Last Name:</strong> {selectedRecord.fields["Last Name"]}
          </div>
          {qrCodeDataUrl && (
            <img src={qrCodeDataUrl} alt="QR Code" width="150" height="150" className="qr-code" />
          )}
          <button onClick={() => window.print()} className="print-button">Print</button>
          <button onClick={togglePrintPreview} className="back-button">Back</button>
        </div>
      )}
    </div>
  );
}

export default App;
