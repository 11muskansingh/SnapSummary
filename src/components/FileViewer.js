"use client";

import { useState, useEffect } from "react";

export default function FileViewer({ fileData, fileName, fileType, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [textContent, setTextContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileData) return;

    try {
      fetch(fileData)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);

          if (isTextFile(fileType)) {
            blob
              .text()
              .then(setTextContent)
              .catch(() => {
                setError("Failed to read text content");
              });
          }
        })
        .catch(() => {
          setError("Failed to load file");
        });
    } catch {
      setError("Failed to process file");
    }

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [fileData, fileType]);

  const isTextFile = (type) =>
    type.startsWith("text/") ||
    ["application/json", "application/xml"].includes(type);
  const isPDFFile = (type) => type === "application/pdf";
  const isImageFile = (type) => type.startsWith("image/");

  const renderFileContent = () => {
    if (error) {
      return <div className="file-viewer-error">{error}</div>;
    }

    if (!blobUrl) {
      return <div className="file-viewer-loading">Loading...</div>;
    }

    if (isPDFFile(fileType)) {
      return (
        <iframe
          src={blobUrl}
          className="pdf-viewer"
          title={`PDF Viewer - ${fileName}`}
        />
      );
    }

    if (isImageFile(fileType)) {
      return <img src={blobUrl} alt={fileName} className="image-viewer" />;
    }

    if (isTextFile(fileType) && textContent) {
      return <pre className="text-viewer">{textContent}</pre>;
    }

    return <div className="file-viewer-unsupported">Preview not available</div>;
  };

  return (
    <div className="file-viewer-overlay">
      <div className="file-viewer-modal">
        <header className="file-viewer-header">
          <h3>{fileName}</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </header>
        <main className="file-viewer-content">{renderFileContent()}</main>
        <footer className="file-viewer-footer">
          <button
            className="download-button"
            onClick={() => {
              const a = document.createElement("a");
              a.href = blobUrl;
              a.download = fileName;
              a.click();
            }}
          >
            Download
          </button>
        </footer>
      </div>
    </div>
  );
}
