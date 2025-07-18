import React, { useState, useRef, useEffect } from 'react';

interface ImageResizerProps {
  src: string;
  alt?: string;
  onResize?: (width: number, height: number) => void;
  onMove?: (x: number, y: number) => void;
  className?: string;
}

export const ImageResizer: React.FC<ImageResizerProps> = ({
  src,
  alt,
  onResize,
  onMove,
  className = '',
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const resizeStartRef = useRef({ width: 0, height: 0, startX: 0, startY: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (imageRef.current && !imageRef.current.contains(event.target as Node)) {
        setIsSelected(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSelected(true);
    setIsDragging(true);
    
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startX: position.x,
      startY: position.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      const newPosition = {
        x: dragStartRef.current.startX + deltaX,
        y: dragStartRef.current.startY + deltaY,
      };
      
      setPosition(newPosition);
      onMove?.(newPosition.x, newPosition.y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    setIsResizing(true);
    
    resizeStartRef.current = {
      width: dimensions.width,
      height: dimensions.height,
      startX: e.clientX,
      startY: e.clientY,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const deltaX = e.clientX - resizeStartRef.current.startX;
      const deltaY = e.clientY - resizeStartRef.current.startY;
      
      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;
      
      if (corner.includes('right')) {
        newWidth = Math.max(50, resizeStartRef.current.width + deltaX);
      }
      if (corner.includes('left')) {
        newWidth = Math.max(50, resizeStartRef.current.width - deltaX);
      }
      if (corner.includes('bottom')) {
        newHeight = Math.max(50, resizeStartRef.current.height + deltaY);
      }
      if (corner.includes('top')) {
        newHeight = Math.max(50, resizeStartRef.current.height - deltaY);
      }
      
      // Maintain aspect ratio for corner handles
      if (corner.includes('corner')) {
        const aspectRatio = resizeStartRef.current.width / resizeStartRef.current.height;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }
      
      const newDimensions = { width: newWidth, height: newHeight };
      setDimensions(newDimensions);
      onResize?.(newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={imageRef}
      className={`relative inline-block ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        src={src}
        alt={alt}
        className="block"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          objectFit: 'contain',
        }}
        draggable={false}
      />
      
      {isSelected && (
        <>
          {/* Selection border */}
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none" />
          
          {/* Resize handles */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top-left-corner')}
          />
          <div
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'top-right-corner')}
          />
          <div
            className="absolute top-1/2 transform -translate-y-1/2 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right-corner')}
          />
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left-corner')}
          />
          <div
            className="absolute top-1/2 transform -translate-y-1/2 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
          />
        </>
      )}
    </div>
  );
};