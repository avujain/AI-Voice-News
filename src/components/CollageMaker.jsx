import React, { useState, useRef } from 'react';
import { Download, RotateCcw, Move, ZoomIn, ZoomOut, Grid, Layers } from 'lucide-react';

const templates = [
  { name: '2x1 Grid', layout: 'grid-2x1', maxPhotos: 2 },
  { name: '2x2 Grid', layout: 'grid-2x2', maxPhotos: 4 },
  { name: '3x2 Grid', layout: 'grid-3x2', maxPhotos: 6 },
  { name: 'Polaroid Stack', layout: 'stack', maxPhotos: 8 },
  { name: 'Freeform', layout: 'freeform', maxPhotos: 10 }
];

const CollageMaker = ({ photos }) => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [collagePhotos, setCollagePhotos] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('grid-2x2');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const canvasRef = useRef(null);

  const addPhotoToCollage = (photo) => {
    if (selectedPhotos.length < 10) {
      setSelectedPhotos((prev) => [...prev, photo]);

      const newCollagePhoto = {
        ...photo,
        x: Math.random() * (canvasSize.width - 200),
        y: Math.random() * (canvasSize.height - 200),
        width: 200,
        height: 240,
        rotation: selectedTemplate === 'stack' ? (Math.random() - 0.5) * 20 : 0,
        zIndex: selectedPhotos.length
      };

      setCollagePhotos((prev) => [...prev, newCollagePhoto]);
    }
  };

  const removePhotoFromCollage = (photoId) => {
    setSelectedPhotos((prev) => prev.filter((p) => p.id !== photoId));
    setCollagePhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const updatePhotoPosition = (photoId, x, y) => {
    setCollagePhotos((prev) =>
      prev.map((photo) => (photo.id === photoId ? { ...photo, x, y } : photo))
    );
  };

  const updatePhotoSize = (photoId, width, height) => {
    setCollagePhotos((prev) =>
      prev.map((photo) => (photo.id === photoId ? { ...photo, width, height } : photo))
    );
  };

  const rotatePhoto = (photoId) => {
    setCollagePhotos((prev) =>
      prev.map((photo) =>
        photo.id === photoId ? { ...photo, rotation: photo.rotation + 15 } : photo
      )
    );
  };

  const bringToFront = (photoId) => {
    const maxZ = Math.max(...collagePhotos.map((p) => p.zIndex));
    setCollagePhotos((prev) =>
      prev.map((photo) => (photo.id === photoId ? { ...photo, zIndex: maxZ + 1 } : photo))
    );
  };

  const applyTemplate = () => {
    if (selectedTemplate === 'grid-2x2' && collagePhotos.length >= 4) {
      const gridSize = Math.min(canvasSize.width, canvasSize.height) / 2 - 20;
      const positions = [
        { x: 10, y: 10 },
        { x: gridSize + 20, y: 10 },
        { x: 10, y: gridSize + 20 },
        { x: gridSize + 20, y: gridSize + 20 }
      ];

      setCollagePhotos((prev) =>
        prev.map((photo, index) => ({
          ...photo,
          x: positions[index]?.x || photo.x,
          y: positions[index]?.y || photo.y,
          width: gridSize,
          height: gridSize * 1.2,
          rotation: 0
        }))
      );
    } else if (selectedTemplate === 'stack') {
      setCollagePhotos((prev) =>
        prev.map((photo, index) => ({
          ...photo,
          x: canvasSize.width / 2 - 100 + index * 10,
          y: canvasSize.height / 2 - 120 + index * 5,
          width: 200,
          height: 240,
          rotation: (index - collagePhotos.length / 2) * 8
        }))
      );
    }
  };

  const downloadCollage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sortedPhotos = [...collagePhotos].sort((a, b) => a.zIndex - b.zIndex);

    sortedPhotos.forEach((photo) => {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.translate(photo.x + photo.width / 2, photo.y + photo.height / 2);
        ctx.rotate((photo.rotation * Math.PI) / 180);
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 10;
        ctx.fillRect(-photo.width / 2 - 10, -photo.height / 2 - 10, photo.width + 20, photo.height + 30);
        ctx.shadowBlur = 0;
        ctx.drawImage(img, -photo.width / 2, -photo.height / 2, photo.width, photo.height - 40);
        ctx.restore();
      };
      img.src = photo.url;
    });

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.download = `collage-${Date.now()}.jpg`;
      link.click();
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* ... UI remains unchanged from your version ... */}
      {/* Full component's JSX remains as-is, no TS-specific syntax there */}
    </div>
  );
};

export default CollageMaker;
