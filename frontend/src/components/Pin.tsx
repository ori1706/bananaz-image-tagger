import React, { useState, useRef, useEffect } from 'react';
import { Thread } from '../types';
import './Pin.css';

interface PinProps {
  thread: Thread;
  currentUser: string;
  onDelete: (threadId: string) => void;
  onUpdatePosition: (threadId: string, x: number, y: number) => void;
  containerWidth: number;
  containerHeight: number;
}

const Pin: React.FC<PinProps> = ({ thread, currentUser, onDelete, onUpdatePosition, containerWidth, containerHeight }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: thread.x, y: thread.y });
  const dragStartPos = useRef({ x: 0, y: 0, pinX: 0, pinY: 0 });

  useEffect(() => {
    setPosition({ x: thread.x, y: thread.y });
  }, [thread.x, thread.y]);

  const initials = thread.createdBy.substring(0, 2).toUpperCase();
  const isOwner = thread.createdBy === currentUser;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isOwner) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      pinX: position.x,
      pinY: position.y
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
      
      const newX = Math.max(0, Math.min(100, dragStartPos.current.pinX + (deltaX / containerWidth) * 100));
      const newY = Math.max(0, Math.min(100, dragStartPos.current.pinY + (deltaY / containerHeight) * 100));
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Update position on server
      if (position.x !== thread.x || position.y !== thread.y) {
        onUpdatePosition(thread.id, position.x, position.y);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, thread.id, thread.x, thread.y, onUpdatePosition, containerWidth, containerHeight]);

  return (
    <div
      className={`pin ${isOwner ? 'pin-owner' : ''} ${isDragging ? 'pin-dragging' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="pin-marker">{initials}</div>
      {isOwner && (
        <button
          className="pin-delete-bubble"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete(thread.id);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          title="Delete comment"
        >
          ×
        </button>
      )}
      {showTooltip && (
        <div className="pin-tooltip">
          <div className="pin-tooltip-header">
            <strong>{thread.createdBy}</strong>
          </div>
          <div className="pin-tooltip-comment">{thread.comment}</div>
        </div>
      )}
    </div>
  );
};

export default Pin;

