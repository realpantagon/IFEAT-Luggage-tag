import axios from "axios";
import { useState } from "react";
import QRCode from "react-qr-code";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("IFEAT-");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

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

  const handleGenerate = () => {
    setShowQrCode(true);
    const qrCodeCanvas = document.getElementById("qrCodeCanvas");
    const qrCodeUrl = qrCodeCanvas.toDataURL();
    setQrCodeDataUrl(qrCodeUrl);
  };

  const handlePrint = () => {
    window.print(); // Opens the browser's print dialog
  };

  const ReceiptDocument = ({ data, qrCodeDataUrl }) => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Receipt</Text>
        <View style={styles.section}>
          <Text>First Name: {data.fields["First Name"]}</Text>
          <Text>Last Name: {data.fields["Last Name"]}</Text>
          <Text>Ref ID: {data.fields["Ref_ID"]}</Text>
        </View>
        {qrCodeDataUrl && (
          <View style={styles.qrCodeContainer}>
            <Image src={qrCodeDataUrl} style={styles.qrCode} />
          </View>
        )}
      </Page>
    </Document>
  );

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
          <div className="record-row"><strong>Ref ID:</strong> {record.fields["Ref_ID"]}</div>
          <div className="record-row"><strong>First Name:</strong> {record.fields["First Name"]}</div>
          <div className="record-row"><strong>Last Name:</strong> {record.fields["Last Name"]}</div>

          <button className="generate-button" onClick={handleGenerate}>Generate QR Code</button>

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

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 16,
  },
  header: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: "center",
  },
  section: {
    margin: 0,
    padding: 0,
    fontSize: 18,
  },
  qrCodeContainer: {
    marginTop: 0,
    padding: 0,
    alignItems: "center",
  },
  qrCode: {
    width: 400,
    height: 400,
  },
});
