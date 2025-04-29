import React from 'react';

interface File {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

interface FileListProps {
  files: File[];
  onGenerateShareLink: (fileId: string) => void;
  onDownloadFile: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onGenerateShareLink, onDownloadFile }) => {
  return (
    <div className="file-list">
      <h2 className="text-xl font-bold mb-4">Uploaded Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id} className="mb-2">
            <div className="file-item">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{(file.size / 1024).toFixed(2)} KB</span>
              <span className="file-uploaded-at">{new Date(file.uploadedAt).toLocaleString()}</span>
              <button onClick={() => onGenerateShareLink(file.id)} className="btn btn-primary ml-2">
                Share
              </button>
              <button onClick={() => onDownloadFile(file.id)} className="btn btn-secondary ml-2">
                Download
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
