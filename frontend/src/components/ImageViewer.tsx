import React, { useState, useRef, useEffect } from 'react';
import { Image, Thread } from '../types';
import Pin from './Pin';
import './ImageViewer.css';

interface ImageViewerProps {
  image: Image;
  threads: Thread[];
  commentMode: boolean;
  currentUser: string;
  onCreateThread: (x: number, y: number, comment: string) => void;
  onDeleteThread: (threadId: string) => void;
  onUpdateThreadPosition: (threadId: string, x: number, y: number) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  image,
  threads,
  commentMode,
  currentUser,
  onCreateThread,
  onDeleteThread,
  onUpdateThreadPosition,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({ x: 0, y: 0 });
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [comment, setComment] = useState('');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (imageRef.current) {
        setContainerSize({
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [image]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!commentMode) return;

    const target = e.target as HTMLElement;
    if (!imageRef.current || target.closest('.pin')) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickPosition({ x, y });
    setDialogPosition({ x: e.clientX, y: e.clientY });
    setShowDialog(true);
    setComment('');
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onCreateThread(clickPosition.x, clickPosition.y, comment);
      setShowDialog(false);
      setComment('');
    }
  };

  const handleCancelDialog = () => {
    setShowDialog(false);
    setComment('');
  };

  return (
    <div className="image-viewer">
      <div
        ref={imageContainerRef}
        className={`image-container ${commentMode ? 'comment-mode' : ''}`}
        onClick={handleImageClick}
      >
        <img
          ref={imageRef}
          src={image.url}
          alt="Taggable content"
          className="main-image"
          onLoad={() => {
            if (imageRef.current) {
              setContainerSize({
                width: imageRef.current.offsetWidth,
                height: imageRef.current.offsetHeight,
              });
            }
          }}
        />
        {threads.map((thread) => (
          <Pin
            key={thread.id}
            thread={thread}
            currentUser={currentUser}
            onDelete={onDeleteThread}
            onUpdatePosition={onUpdateThreadPosition}
            containerWidth={containerSize.width}
            containerHeight={containerSize.height}
          />
        ))}
      </div>

      {showDialog && (
        <>
          <div className="dialog-overlay" onClick={handleCancelDialog} />
          <div
            className="comment-dialog"
            style={{
              left: `${dialogPosition.x}px`,
              top: `${dialogPosition.y}px`,
            }}
          >
            <form onSubmit={handleSubmitComment}>
              <h3>Add Comment</h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment..."
                autoFocus
                rows={4}
              />
              <div className="dialog-buttons">
                <button type="button" onClick={handleCancelDialog} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageViewer;

