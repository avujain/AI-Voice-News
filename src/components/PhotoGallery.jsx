import React, { useState } from 'react';
import PolaroidFrame from './PolaroidFrame';
import { Grid, List, Search, Filter, Download, Trash2 } from 'lucide-react';

const PhotoGallery = ({ photos, onDelete }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = searchTerm === '' ||
      photo.filter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || photo.filter === filterBy;
    return matchesSearch && matchesFilter;
  });

  const togglePhotoSelection = (id) => {
    setSelectedPhotos(prev =>
      prev.includes(id)
        ? prev.filter(photoId => photoId !== id)
        : [...prev, id]
    );
  };

  const downloadSelected = () => {
    selectedPhotos.forEach(id => {
      const photo = photos.find(p => p.id === id);
      if (photo) {
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = `photo-${id}.jpg`;
        link.click();
      }
    });
  };

  const deleteSelected = () => {
    if (window.confirm(`Delete ${selectedPhotos.length} selected photos?`)) {
      selectedPhotos.forEach(id => onDelete(id));
      setSelectedPhotos([]);
    }
  };

  const uniqueFilters = Array.from(new Set(photos.map(p => p.filter)));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Gallery Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-2xl font-bold text-white">Photo Gallery</h2>

          {/* Gallery Controls */}
          <div className="flex flex-wrap items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Filters</option>
              {uniqueFilters.map(filter => (
                <option key={filter} value={filter}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPhotos.length > 0 && (
          <div className="mt-4 flex items-center space-x-4 p-4 bg-purple-500/20 rounded-lg">
            <span className="text-white font-medium">
              {selectedPhotos.length} photo{selectedPhotos.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={downloadSelected}
              className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={deleteSelected}
              className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
            <button
              onClick={() => setSelectedPhotos([])}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Photos Grid/List */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-white/60 text-lg mb-4">No photos found</div>
          <p className="text-white/40">Start capturing memories with your camera!</p>
        </div>
      ) : (
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="relative">
              {viewMode === 'grid' ? (
                <div className="relative">
                  <PolaroidFrame
                    imageUrl={photo.url}
                    size="medium"
                    showControls
                    onDelete={() => onDelete(photo.id)}
                  />
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedPhotos.includes(photo.id)}
                      onChange={() => togglePhotoSelection(photo.id)}
                      className="w-4 h-4 rounded"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedPhotos.includes(photo.id)}
                    onChange={() => togglePhotoSelection(photo.id)}
                    className="w-4 h-4 rounded"
                  />
                  <PolaroidFrame imageUrl={photo.url} size="small" />
                  <div className="flex-1 text-white">
                    <div className="font-medium">
                      {new Date(photo.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-300">
                      Filter: {photo.filter}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = photo.url;
                        link.download = `photo-${photo.id}.jpg`;
                        link.click();
                      }}
                      className="bg-green-500 hover:bg-green-400 text-white p-2 rounded-lg transition-colors"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(photo.id)}
                      className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
