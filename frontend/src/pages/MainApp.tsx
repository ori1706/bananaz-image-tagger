import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import { Image, Thread } from '../types';
import ImageViewer from '../components/ImageViewer';
import Swal from 'sweetalert2';
import './MainApp.css';

const MainApp: React.FC = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [commentMode, setCommentMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }
    loadImages();
  }, [username, navigate]);

  useEffect(() => {
    if (selectedImageId && username) {
      loadThreads(selectedImageId);
    }
  }, [selectedImageId, username]);

  const loadImages = async () => {
    if (!username) return;
    try {
      const fetchedImages = await api.getImages(username);
      setImages(fetchedImages);
      if (fetchedImages.length > 0 && !selectedImageId) {
        setSelectedImageId(fetchedImages[0].id);
      }
    } catch (err) {
      setError('Failed to load images');
      console.error(err);
    }
  };

  const loadThreads = async (imageId: string) => {
    if (!username) return;
    try {
      const fetchedThreads = await api.getThreads(username, imageId);
      setThreads(fetchedThreads);
    } catch (err) {
      setError('Failed to load threads');
      console.error(err);
    }
  };

  const handleGenerateImage = async () => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      const newImage = await api.createImage(username);
      setImages((prev) => [...prev, newImage]);
      setSelectedImageId(newImage.id);
    } catch (err) {
      setError('Failed to generate image');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (x: number, y: number, comment: string) => {
    if (!username || !selectedImageId) return;
    try {
      const newThread = await api.createThread(username, selectedImageId, x, y, comment);
      setThreads((prev) => [...prev, newThread]);
    } catch (err) {
      setError('Failed to create comment');
      console.error(err);
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    if (!username) return;
    
    const result = await Swal.fire({
      title: 'Delete Comment?',
      text: 'Are you sure you want to delete this comment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await api.deleteThread(username, threadId);
      setThreads((prev) => prev.filter((t) => t.id !== threadId));
      Swal.fire({
        title: 'Deleted!',
        text: 'Comment has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      setError('Failed to delete comment');
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete comment.',
        icon: 'error'
      });
    }
  };

  const handleUpdateThreadPosition = async (threadId: string, x: number, y: number) => {
    if (!username) return;
    try {
      await api.updateThreadPosition(username, threadId, x, y);
      setThreads((prev) =>
        prev.map((t) => (t.id === threadId ? { ...t, x, y } : t))
      );
    } catch (err) {
      setError('Failed to update pin position');
      console.error(err);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!username) return;
    
    const result = await Swal.fire({
      title: 'Delete Image?',
      text: 'Are you sure you want to delete this image and all its comments? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      await api.deleteImage(username, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      if (selectedImageId === imageId) {
        const remainingImages = images.filter((img) => img.id !== imageId);
        setSelectedImageId(remainingImages.length > 0 ? remainingImages[0].id : null);
      }
      Swal.fire({
        title: 'Deleted!',
        text: 'Image and all its comments have been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err) {
      setError('Failed to delete image');
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete image.',
        icon: 'error'
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const selectedImage = images.find((img) => img.id === selectedImageId);

  return (
    <div className="main-app">
      <header className="app-header">
        <div className="header-left">
          <h1>🍌 Image Tagger</h1>
          <button onClick={handleGenerateImage} disabled={loading} className="btn-generate">
            {loading ? 'Generating...' : '+ Generate New Image'}
          </button>
        </div>
        <div className="header-center">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={commentMode}
              onChange={(e) => setCommentMode(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Comment Mode</span>
          </label>
        </div>
        <div className="header-right">
          <span className="user-welcome">Welcome, {username}!</span>
          <button onClick={handleLogout} className="btn-logout">
            Sign Out
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="app-content">
        <aside className="sidebar">
          <h2>Images</h2>
          {images.length === 0 ? (
            <p className="empty-message">No images yet. Generate one to get started!</p>
          ) : (
            <ul className="image-list">
              {images.map((img) => (
                <li
                  key={img.id}
                  className={`image-list-item ${selectedImageId === img.id ? 'active' : ''}`}
                >
                  <button onClick={() => setSelectedImageId(img.id)} className="image-link">
                    <span className="image-id" title={img.id}>
                      {img.id.substring(0, 10)}...
                    </span>
                    <span className="image-creator">by {img.createdBy}</span>
                  </button>
                  {img.createdBy === username && (
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="btn-delete-image"
                      title="Delete image"
                    >
                      🗑️
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="content-viewer">
          {selectedImage ? (
            <ImageViewer
              image={selectedImage}
              threads={threads}
              commentMode={commentMode}
              currentUser={username || ''}
              onCreateThread={handleCreateThread}
              onDeleteThread={handleDeleteThread}
              onUpdateThreadPosition={handleUpdateThreadPosition}
            />
          ) : (
            <div className="empty-viewer">
              <p>Select an image to view</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainApp;

