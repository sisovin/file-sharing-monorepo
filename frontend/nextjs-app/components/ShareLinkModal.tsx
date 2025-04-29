import React, { useState } from 'react';

interface ShareLinkModalProps {
  fileId: string;
  onClose: () => void;
}

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ fileId, onClose }) => {
  const [shareLink, setShareLink] = useState<string>('');

  const generateShareLink = async () => {
    try {
      const response = await fetch(`/api/files/share/${fileId}`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setShareLink(data.shareLink);
      } else {
        alert('Failed to generate share link');
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      alert('Failed to generate share link');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">Share File</h2>
        {shareLink ? (
          <div>
            <p>Share this link:</p>
            <input
              type="text"
              value={shareLink}
              readOnly
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        ) : (
          <button onClick={generateShareLink} className="btn btn-primary">
            Generate Share Link
          </button>
        )}
        <button onClick={onClose} className="btn btn-secondary mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareLinkModal;
