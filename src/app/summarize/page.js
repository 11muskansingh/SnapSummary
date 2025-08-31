"use client";

import { useEffect, useState } from "react";
import UploadArea from "@/components/UploadArea";

export default function SummarizePage() {
  const [animationData, setAnimationData] = useState(null);
  const [isEntering, setIsEntering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [summaryLength, setSummaryLength] = useState("medium");
  const [processingStage, setProcessingStage] = useState("");
  const [fileData, setFileData] = useState(null); // Store file data persistently
  const [currentStep, setCurrentStep] = useState("upload"); // 'upload', 'configure', 'processing', 'result'

  // Utility function to truncate file names
  const truncateFileName = (fileName, maxLength = 30) => {
    if (!fileName || fileName.length <= maxLength) return fileName;

    const extension = fileName.split(".").pop();
    const nameWithoutExtension = fileName.substring(
      0,
      fileName.lastIndexOf(".")
    );
    const truncatedName =
      nameWithoutExtension.substring(0, maxLength - extension.length - 4) +
      "...";

    return truncatedName + "." + extension;
  };

  useEffect(() => {
    // Check if we came from an upload animation
    const storedAnimation = sessionStorage.getItem("uploadAnimation");
    const storedFileData = sessionStorage.getItem("uploadedFileData");

    if (storedAnimation && storedFileData) {
      const data = JSON.parse(storedAnimation);
      setAnimationData(data);
      setFileData(storedFileData); // Store file data persistently
      setIsEntering(true);

      // Move to configuration step instead of immediately processing
      setCurrentStep("configure");

      // Remove entering state after animation
      setTimeout(() => {
        setIsEntering(false);
      }, 1000);

      // Clean up session storage after a delay
      setTimeout(() => {
        sessionStorage.removeItem("uploadAnimation");
        sessionStorage.removeItem("uploadedFileData");
      }, 1500);
    }
  }, []);

  // Listen for navigation reset events
  useEffect(() => {
    const handleReset = () => {
      // Reset all state to initial values
      setAnimationData(null);
      setIsEntering(false);
      setIsProcessing(false);
      setSummary(null);
      setError(null);
      setSummaryLength("medium");
      setProcessingStage("");
      setFileData(null);
      setCurrentStep("upload");

      // Clear session storage
      sessionStorage.removeItem("uploadAnimation");
      sessionStorage.removeItem("uploadedFileData");
    };

    window.addEventListener("resetSummaryPage", handleReset);

    return () => {
      window.removeEventListener("resetSummaryPage", handleReset);
    };
  }, []);

  const startProcessing = async (selectedLength) => {
    if (!fileData || !animationData) return;

    setSummaryLength(selectedLength);
    setCurrentStep("processing");
    await processFileFromData(fileData, animationData, selectedLength);
  };

  const regenerateSummary = async (newLength) => {
    if (!fileData || !animationData || isProcessing) return;

    setError(null);
    setSummaryLength(newLength);
    await processFileFromData(fileData, animationData, newLength, 0, false);
  };

  const handleApiError = async (
    apiResponse,
    errorResult,
    retryCount,
    maxRetries,
    fileDataUrl,
    animData,
    length
  ) => {
    // Extract meaningful error message from API response
    let errorMessage = errorResult.error || "Unknown error";

    // Check if this is a Google AI service error and extract the meaningful part
    if (errorMessage.includes("The model is overloaded")) {
      errorMessage =
        "The AI service is temporarily overloaded. Please try again in a few moments.";
    } else if (
      errorMessage.includes("Rate limit exceeded") ||
      errorMessage.includes("429")
    ) {
      errorMessage =
        "Rate limit exceeded. Please wait a moment before trying again.";
    } else if (apiResponse.status === 503) {
      errorMessage =
        "The AI service is temporarily overloaded. Please try again in a few moments.";
    } else if (apiResponse.status === 429) {
      errorMessage =
        "Rate limit exceeded. Please wait a moment before trying again.";
    } else if (apiResponse.status >= 500) {
      errorMessage =
        "The AI service is temporarily unavailable. Please try again later.";
    } else if (errorMessage.startsWith("Failed to generate summary: ")) {
      // Extract the core error message from API wrapper
      const coreMessage = errorMessage.replace(
        "Failed to generate summary: ",
        ""
      );
      if (coreMessage.includes("The model is overloaded")) {
        errorMessage =
          "The AI service is temporarily overloaded. Please try again in a few moments.";
      } else if (coreMessage.includes("Rate limit")) {
        errorMessage =
          "Rate limit exceeded. Please wait a moment before trying again.";
      } else {
        errorMessage = `Failed to process file (Error ${apiResponse.status})`;
      }
    }

    // Retry for service overload errors
    if (
      (apiResponse.status === 503 || errorMessage.includes("overloaded")) &&
      retryCount < maxRetries
    ) {
      console.log(
        `Service overloaded, retrying in 3 seconds... (${
          retryCount + 1
        }/${maxRetries})`
      );
      setProcessingStage(
        `Service busy, retrying in 3 seconds... (${
          retryCount + 1
        }/${maxRetries})`
      );

      // Wait 3 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return await processFileFromData(
        fileDataUrl,
        animData,
        length,
        retryCount + 1
      );
    } else if (
      retryCount >= maxRetries &&
      (apiResponse.status === 503 || errorMessage.includes("overloaded"))
    ) {
      errorMessage = errorMessage + " All retry attempts failed.";
    }

    throw new Error(errorMessage);
  };

  const processFileFromData = async (
    fileDataUrl,
    animData,
    length = summaryLength,
    retryCount = 0,
    clearSummary = true
  ) => {
    const maxRetries = 2;
    setIsProcessing(true);
    setError(null);
    if (clearSummary) {
      setSummary(null);
    }
    setProcessingStage(
      retryCount > 0
        ? `Retrying... (${retryCount}/${maxRetries})`
        : "Preparing file..."
    );

    try {
      console.log("Starting file processing...");

      // Convert data URL back to blob
      const response = await fetch(fileDataUrl);
      const blob = await response.blob();

      // Create file object
      const file = new File([blob], animData.fileName, {
        type: animData.fileData.type || "application/pdf",
        lastModified: animData.fileData.lastModified,
      });

      console.log("File recreated:", file.name, file.size, file.type);

      // Send file directly to API for processing
      setProcessingStage(
        retryCount > 0
          ? `Processing with Google AI... (Retry ${retryCount}/${maxRetries})`
          : "Processing with Google AI..."
      );
      const formData = new FormData();
      formData.append("file", file);
      formData.append("summaryLength", length);
      formData.append("format", "json");

      console.log("Sending file to API...");

      const apiResponse = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });

      console.log("API response status:", apiResponse.status);

      if (!apiResponse.ok) {
        const errorResult = await apiResponse
          .json()
          .catch(() => ({ error: "Unknown error" }));
        return await handleApiError(
          apiResponse,
          errorResult,
          retryCount,
          maxRetries,
          fileDataUrl,
          animData,
          length
        );
      }

      const result = await apiResponse.json();
      console.log("API result:", result);

      setSummary({
        ...result,
        fileName: animData.fileName,
        fileSize: animData.fileData.size || 0,
      });

      setCurrentStep("result");
    } catch (err) {
      console.error("Processing error:", err);
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsProcessing(false);
      setProcessingStage("");
    }
  };

  const handleNewFileUpload = (file) => {
    // Convert file to data URL for storage
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileDataUrl = e.target.result;

      // Create animation data
      const animData = {
        fileName: file.name,
        fileSize: file.size,
        fileData: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        },
      };

      // Reset states
      setSummary(null);
      setError(null);

      // Store new file data
      setFileData(fileDataUrl);
      setAnimationData(animData);

      // Move to configuration step
      setCurrentStep("configure");
    };
    reader.readAsDataURL(file);
  };

  const isFileDisplayable = (fileType) => {
    if (!fileType) return false;
    return (
      fileType === "application/pdf" ||
      fileType.startsWith("image/") ||
      fileType.startsWith("text/") ||
      fileType === "application/json" ||
      fileType === "application/xml"
    );
  };

  return (
    <div className={`summarize-page ${isEntering ? "page-entering" : ""}`}>
      {/* Step 1: Upload (when no file uploaded yet) */}
      {currentStep === "upload" && (
        <section className="summarize-hero">
          <div className="container">
            <div className="summarize-content upload-layout">
              <div className="upload-content-left">
                <h1 className="summarize-title">
                  Summarize Your Documents with AI
                </h1>
                <p className="summarize-description">
                  Simply upload your file and get a quick, easy-to-read summary.
                  We support PDF, DOCX, TXT, and even images.
                </p>
                <div className="upload-features">
                  <div className="feature-item">
                    <img
                      src="/file-check.svg"
                      alt="Supports file types"
                      className="feature-icon"
                    />
                    <span>Supports PDF, DOCX, TXT & Images</span>
                  </div>
                  <div className="feature-item">
                    <img
                      src="/globe.svg"
                      alt="Powered by Google AI"
                      className="feature-icon"
                    />
                    <span>Powered by Google AI</span>
                  </div>
                </div>
              </div>
              <div className="upload-content-right">
                <UploadArea onFileUpload={handleNewFileUpload} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Configure summary options */}
      {currentStep === "configure" && animationData && (
        <section className="summarize-hero">
          <div className="container">
            <div className="summarize-content configure-layout-new">
              <button
                className="back-button"
                onClick={() => setCurrentStep("upload")}
              >
                <img src="/arrow-left.svg" alt="Back" />
                <span>Upload Another File</span>
              </button>

              <div className="file-display-card">
                <img src="/paperclip.svg" alt="File" className="file-icon" />
                <div className="file-info">
                  <span className="file-name" title={animationData.fileName}>
                    {truncateFileName(animationData.fileName, 20)}
                  </span>
                  <span className="file-size">
                    {Math.round(animationData.fileSize / 1024)} KB
                  </span>
                </div>
              </div>

              <h1 className="summarize-title">Choose Summary Length</h1>
              <p className="summarize-description">
                Select how detailed you want your summary to be.
              </p>

              <div className="summary-options-grid">
                <button
                  className={`summary-option-card ${
                    summaryLength === "short" ? "active" : ""
                  }`}
                  onClick={() => startProcessing("short")}
                >
                  <h3>Quick Glance</h3>
                  <p>A few sentences.</p>
                </button>
                <button
                  className={`summary-option-card ${
                    summaryLength === "medium" ? "active" : ""
                  }`}
                  onClick={() => startProcessing("medium")}
                >
                  <h3>Key Details</h3>
                  <p>A structured summary.</p>
                </button>
                <button
                  className={`summary-option-card ${
                    summaryLength === "long" ? "active" : ""
                  }`}
                  onClick={() => startProcessing("long")}
                >
                  <h3>In-Depth Analysis</h3>
                  <p>A comprehensive overview.</p>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Processing */}
      {currentStep === "processing" && animationData && (
        <section className="summarize-hero">
          <div className="container">
            <div className="summarize-content">
              <h1 className="summarize-title">Analyzing Your Document...</h1>
              <p className="summarize-description">
                Our AI is reading, understanding, and summarizing your file.
                This should only take a moment.
              </p>

              <div className="processing-indicator">
                <div className="spinner"></div>
                <p className="processing-stage-text">
                  {processingStage || "Generating summary..."}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: Results Layout */}
      {currentStep === "result" && animationData && (
        <div className="result-layout">
          <div className="summary-pane">
            <div className="summary-header">
              <div className="document-info">
                <span className="document-icon">
                  {animationData.fileData?.type === "application/pdf" && "📄"}
                  {animationData.fileData?.type?.startsWith("image/") && "🖼️"}
                  {(animationData.fileData?.type?.startsWith("text/") ||
                    animationData.fileData?.type === "application/json" ||
                    animationData.fileData?.type === "application/xml") &&
                    "📝"}
                  {!isFileDisplayable(animationData.fileData?.type) && "📎"}
                </span>
                <span className="document-name">{animationData.fileName}</span>
                <span className="file-size">
                  ({Math.round(animationData.fileSize / 1024)} KB)
                </span>
              </div>
              <div className="summary-controls">
                <div className="length-buttons">
                  <button
                    className={`btn btn--small ${
                      summaryLength === "short"
                        ? "btn--primary"
                        : "btn--outline"
                    }`}
                    onClick={() => regenerateSummary("short")}
                    disabled={isProcessing}
                  >
                    Quick Glance
                  </button>
                  <button
                    className={`btn btn--small ${
                      summaryLength === "medium"
                        ? "btn--primary"
                        : "btn--outline"
                    }`}
                    onClick={() => regenerateSummary("medium")}
                    disabled={isProcessing}
                  >
                    Key Details
                  </button>
                  <button
                    className={`btn btn--small ${
                      summaryLength === "long" ? "btn--primary" : "btn--outline"
                    }`}
                    onClick={() => regenerateSummary("long")}
                    disabled={isProcessing}
                  >
                    In-Depth
                  </button>
                </div>
                <button
                  className="btn btn--outline btn--small new-file-btn"
                  onClick={() => setCurrentStep("upload")}
                >
                  New File
                </button>
              </div>
            </div>

            <div className="summary-content-area">
              {error && (
                <div className="error-message">
                  <h3>Error</h3>
                  <p>{error}</p>
                </div>
              )}

              <div className="summary-display-container">
                {isProcessing && (
                  <div className="processing-overlay">
                    <div className="spinner"></div>
                    <p>Generating {summaryLength} summary...</p>
                    {processingStage && (
                      <p
                        className="processing-stage-text"
                        data-retry={
                          processingStage.includes("Retry") ||
                          processingStage.includes("retrying")
                        }
                      >
                        {processingStage}
                      </p>
                    )}
                  </div>
                )}

                {summary && (
                  <div className="summary-result">
                    <div className="summary-text">{summary.summary}</div>
                  </div>
                )}

                {!summary && !isProcessing && !error && (
                  <div className="summary-placeholder">
                    <p>Select a summary length to generate summary</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
