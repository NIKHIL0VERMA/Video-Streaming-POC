'use client';

import { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'upload' | 'link'>('upload');

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
        setVideoUrl(data.url);
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Something went wrong while uploading');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.link as HTMLInputElement;
    const url = input.value.trim();
    if (url) setVideoUrl(url);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Upload or Stream a Video</h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setTab('upload')}
            className={`px-4 py-2 rounded ${tab === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Upload File
          </button>
          <button
            onClick={() => setTab('link')}
            className={`px-4 py-2 rounded ${tab === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Paste Link
          </button>
        </div>

        {tab === 'upload' ? (
          <form onSubmit={handleUpload} className="text-center">
            <label className="block mb-4">
              <span className="sr-only">Choose video</span>
              <input
                type="file"
                name="video"
                accept="video/*"
                required
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                "
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload & Stream'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLinkSubmit} className="text-center">
            <input
              type="url"
              name="link"
              placeholder="Paste .mp4 or .m3u8 video URL"
              required
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Load Video
            </button>
          </form>
        )}
      </div>

      {videoUrl && (
        <div className="mt-8 w-full max-w-3xl">
          <h2 className="text-xl font-semibold mb-2">Now Playing:</h2>
          <VideoPlayer src={videoUrl} title="Your Video" />
        </div>
      )}
    </main>
  );
}
