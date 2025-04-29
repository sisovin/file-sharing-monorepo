import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface DownloadPageProps {
  fileHash: string;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ fileHash }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFileUrl = async () => {
      try {
        const response = await axios.get(`/api/files/${fileHash}`);
        setFileUrl(response.data.url);
      } catch (error) {
        console.error('Error fetching file URL:', error);
      }
    };

    fetchFileUrl();
  }, [fileHash]);

  return (
    <div className="download-page">
      <h1 className="text-2xl font-bold mb-4">Download File</h1>
      {fileUrl ? (
        <a href={fileUrl} download className="text-blue-500 underline">
          Click here to download your file
        </a>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { hash } = context.params!;
  return {
    props: {
      fileHash: hash,
    },
  };
};

export default DownloadPage;
