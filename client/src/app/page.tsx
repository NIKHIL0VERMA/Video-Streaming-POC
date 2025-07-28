'use client';

import { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.video as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    try {
      setLoading(true);
      const res = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setVideoUrl(data.url); // this will be an m3u8 file
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      console.error('Error uploading:', err);
      alert('Upload error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Upload & Stream Video</h1>
      <form onSubmit={handleUpload} className="mb-6">
        <input type="file" name="video" accept="video/*" required />
        <button
          type="submit"
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {videoUrl && (
        <div>
          <h2 className="text-xl mb-2">Now Playing:</h2>
          <VideoPlayer src={videoUrl} title={"You uploaded video"} />
        </div>
      )}
    </main>
  );
}
