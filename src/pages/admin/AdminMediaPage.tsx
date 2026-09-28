import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Folder, Trash2, AlertTriangle, ExternalLink, HardDrive } from 'lucide-react';
import { useAuth } from '../../services/firebase/AuthContext';
import { StorageFolder, listFolderMedia, uploadMediaFile, deleteMediaFile, StorageMediaItem } from '../../services/storage/storageService';

export function AdminMediaPage() {
  const { isFirebaseConfigured } = useAuth();
  const [selectedFolder, setSelectedFolder] = useState<StorageFolder>('blog');
  const [items, setItems] = useState<StorageMediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const folders: StorageFolder[] = [
    'blog',
    'temples',
    'heritage',
    'photography',
    'projects',
    'about',
    'hero',
  ];

  const loadMedia = async () => {
    if (!isFirebaseConfigured) return;
    setLoading(true);
    try {
      const media = await listFolderMedia(selectedFolder);
      setItems(media);
    } catch (err) {
      console.error('Failed to list media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [selectedFolder, isFirebaseConfigured]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isFirebaseConfigured) {
      setStatusMessage('Firebase connection required. Configure your Firebase environment variables to upload assets.');
      return;
    }

    setUploading(true);
    setStatusMessage(null);
    try {
      const result = await uploadMediaFile(selectedFolder, file);
      setStatusMessage(`Uploaded: ${result.fileName}`);
      loadMedia();
    } catch (err: any) {
      setStatusMessage(`Upload failed: ${err.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (storagePath: string) => {
    if (!window.confirm('Delete this file from Firebase Storage?')) return;
    try {
      await deleteMediaFile(storagePath);
      loadMedia();
    } catch (err: any) {
      setStatusMessage(`Delete error: ${err.message || err}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="border-b border-[#DACDB7] dark:border-[#1E2E44] pb-5">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-[#B58A3C]" />
          <h1 className="font-playfair text-2xl font-bold text-[#142033] dark:text-[#F8F5EE]">
            Firebase Storage Browser
          </h1>
        </div>
        <p className="text-xs font-serif text-[#5F6470] dark:text-[#94A3B8] mt-1">
          Structured media buckets for <code className="font-mono text-[11px] bg-[#EFE8DA] dark:bg-[#182638] px-1 py-0.5 rounded">blog</code>, <code className="font-mono text-[11px] bg-[#EFE8DA] dark:bg-[#182638] px-1 py-0.5 rounded">temples</code>, <code className="font-mono text-[11px] bg-[#EFE8DA] dark:bg-[#182638] px-1 py-0.5 rounded">heritage</code>, <code className="font-mono text-[11px] bg-[#EFE8DA] dark:bg-[#182638] px-1 py-0.5 rounded">photography</code>, <code className="font-mono text-[11px] bg-[#EFE8DA] dark:bg-[#182638] px-1 py-0.5 rounded">projects</code>, <code className="font-mono text-[11px] bg-[#EFE8DA] dark:bg-[#182638] px-1 py-0.5 rounded">about</code>, and <code className="font-mono text-[11px] bg-[#EFE8DA] dark:bg-[#182638] px-1 py-0.5 rounded">hero</code>.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xs bg-[#F4ECD8] dark:bg-[#1C2C40] border border-[#DACDB7] dark:border-[#2C415C] text-xs font-mono text-[#142033] dark:text-[#F8F5EE]">
          {statusMessage}
        </div>
      )}

      {/* Folder Tabs */}
      <div className="flex flex-wrap gap-2">
        {folders.map((folder) => (
          <button
            key={folder}
            onClick={() => setSelectedFolder(folder)}
            className={`px-3 py-1.5 rounded-xs text-xs font-mono capitalize transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedFolder === folder
                ? 'bg-[#142033] text-[#F8F5EE] dark:bg-[#B58A3C] dark:text-[#0B131E] font-bold'
                : 'bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] text-[#5F6470] dark:text-[#94A3B8] hover:text-[#142033]'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>{folder}</span>
          </button>
        ))}
      </div>

      {/* Upload Box */}
      <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-dashed border-[#C8BAA3] dark:border-[#2C415C] rounded-xs p-6 text-center">
        <label className="cursor-pointer inline-flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#F4ECD8] dark:bg-[#202F42] text-[#B58A3C] flex items-center justify-center mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-[#142033] dark:text-[#F8F5EE]">
            {uploading ? 'Uploading to Firebase Storage...' : `Upload image to /${selectedFolder}/`}
          </span>
          <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-0.5">
            PNG, JPG, WEBP up to 15MB. Only authenticated administrators may upload.
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-6">
        <h2 className="text-xs font-mono uppercase tracking-widest font-bold text-[#142033] dark:text-[#F8F5EE] mb-4">
          Files in /{selectedFolder}/
        </h2>

        {!isFirebaseConfigured ? (
          <div className="p-8 text-center text-xs font-mono text-amber-800 dark:text-amber-300">
            Firebase connection required to view or upload live Storage assets.
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-xs font-mono text-[#718096]">
            Fetching storage bucket items...
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#718096] font-mono">
            No media files currently uploaded in /{selectedFolder}/ bucket.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.fullPath}
                className="group relative border border-[#DACDB7] dark:border-[#1F3045] rounded-2xs overflow-hidden bg-white dark:bg-black/20"
              >
                <img
                  src={item.downloadUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 text-[10px] font-mono truncate text-[#5F6470] dark:text-[#94A3B8]">
                  {item.name}
                </div>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => handleDelete(item.fullPath)}
                    className="p-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
