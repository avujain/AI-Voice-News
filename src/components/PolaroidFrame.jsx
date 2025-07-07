import React from 'react';
import { Download, Printer, Eye } from 'lucide-react';

const PolaroidFrame = ({
  imageUrl,
  size = 'medium',
  showControls = false,
  onDelete,
}) => {
  const sizeClasses = {
    small: 'w-24 h-32',
    medium: 'w-48 h-60',
    large: 'w-64 h-80',
  };

  const imageSizes = {
    small: 'h-20',
    medium: 'h-40',
    large: 'h-56',
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `polaroid-${Date.now()}.jpg`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Photo</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; }
              img { max-width: 100%; height: auto; border: 20px solid white; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="Polaroid Photo" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleView = () => {
    const viewWindow = window.open('', '_blank');
    if (viewWindow) {
      viewWindow.document.write(`
        <html>
          <head>
            <title>View Photo</title>
            <style>
              body { margin: 0; padding: 0; background: #000; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
              img { max-width: 90vw; max-height: 90vh; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="Polaroid Photo" />
          </body>
        </html>
      `);
      viewWindow.document.close();
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} group`}>
      {/* Polaroid Frame */}
      <div className="bg-white p-3 pb-6 rounded-lg shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-300 hover:scale-105">
        {/* Photo */}
        <div className={`${imageSizes[size]} bg-gray-200 rounded overflow-hidden`}>
          <img
            src={imageUrl}
            alt="Polaroid"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Polaroid Bottom Space */}
        <div className="h-8 flex items-center justify-center">
          <div className="text-gray-400 text-xs font-handwriting">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
          <div className="flex space-x-2">
            <button
              onClick={handleView}
              className="bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-full transition-colors"
              title="View"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-full transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button
              onClick={handlePrint}
              className="bg-purple-500 hover:bg-purple-400 text-white p-2 rounded-full transition-colors"
              title="Print"
            >
              <Printer size={16} />
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-full transition-colors"
                title="Delete"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PolaroidFrame;
