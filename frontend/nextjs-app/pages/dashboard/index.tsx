import React from 'react';
import FileUpload from '../../components/FileUpload';
import FileList from '../../components/FileList';
import ShareLinkModal from '../../components/ShareLinkModal';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <FileUpload />
      <FileList />
      <ShareLinkModal />
    </div>
  );
};

export default Dashboard;
