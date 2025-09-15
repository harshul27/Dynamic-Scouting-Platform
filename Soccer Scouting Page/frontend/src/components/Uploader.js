import React, { useState } from 'react';

function Uploader({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('Please upload your data file(s) to begin.');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    setStatus('Uploading and processing files...');

    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file);
    }

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(data.message);
        onUploadSuccess(); // Re-fetch player list from the server
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Network error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="controls" className="max-w-4xl mx-auto bg-mint-cream p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-2xl font-bold text-oxford-blue mb-4">Data Input</h2>
      <form onSubmit={handleUpload}>
        <label htmlFor="file-upload" className="block text-sm font-medium text-oxford-blue-medium mb-2">Upload Player Data (CSV or Excel)</label>
        <input
          id="file-upload"
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          multiple
          className="block w-full text-sm text-oxford-blue-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hot-pink file:text-mint-cream hover:file:bg-hot-pink-dark transition-colors duration-200"
          onChange={handleFileChange}
        />
        <p id="file-status" className="text-xs text-oxford-blue-medium mt-2">{status}</p>
        <button
          type="submit"
          className="mt-4 bg-hot-pink hover:bg-hot-pink-dark text-mint-cream font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-200"
          disabled={isUploading || files.length === 0}
        >
          {isUploading ? 'Uploading...' : 'Upload Data'}
        </button>
      </form>
    </section>
  );
}

export default Uploader;