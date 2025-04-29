import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface File {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const useFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const uploadFileToSupabase = async (file: File) => {
    const { data, error } = await supabase.storage
      .from('files')
      .upload(`public/${file.name}`, file);

    if (error) {
      throw new Error(`Failed to upload file to Supabase: ${error.message}`);
    }

    return data.Key;
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data, error } = await supabase.storage.from('files').list();

        if (error) {
          throw new Error('Failed to fetch files');
        }

        const files = data.map((file) => ({
          id: file.id,
          name: file.name,
          size: file.size,
          uploadedAt: file.created_at,
        }));

        setFiles(files);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return { files, loading, error, uploadFileToSupabase };
};

export default useFiles;
