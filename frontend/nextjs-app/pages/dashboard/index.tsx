import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import FileList from '../../components/FileList';
import ShareLinkModal from '../../components/ShareLinkModal';
import useFiles from '../../hooks/useFiles';

const Dashboard: React.FC = () => {
  const { files, loading, error } = useFiles();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const handleGenerateShareLink = (fileId: string) => {
    setSelectedFileId(fileId);
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/download/${fileId}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'file';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <FileUpload />
      {loading && <p>Loading files...</p>}
      {error && <p>Error loading files: {error}</p>}
      <FileList
        files={files}
        onGenerateShareLink={handleGenerateShareLink}
        onDownloadFile={handleDownloadFile}
      />
      {selectedFileId && (
        <ShareLinkModal
          fileId={selectedFileId}
          onClose={() => setSelectedFileId(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
