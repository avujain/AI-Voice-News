import React, { useRef, useEffect, useState } from 'react';
import { Camera, Hand, Timer, Sparkles } from 'lucide-react';
import FilterPanel from './FilterPanel';
import PolaroidFrame from './PolaroidFrame';

const filters = [
  { name: 'None', value: 'none', style: '' },
  { name: 'Vintage', value: 'vintage', style: 'sepia(80%) contrast(120%) brightness(110%)' },
  { name: 'Cool', value: 'cool', style: 'hue-rotate(180deg) saturate(120%)' },
  { name: 'Warm', value: 'warm', style: 'hue-rotate(25deg) saturate(130%) brightness(110%)' },
  { name: 'Black & White', value: 'bw', style: 'grayscale(100%) contrast(120%)' },
  { name: 'Polaroid', value: 'polaroid', style: 'contrast(110%) brightness(110%) sepia(30%)' },
  { name: 'Dream', value: 'dream', style: 'blur(0.5px) brightness(120%) saturate(130%)' },
  { name: 'Retro', value: 'retro', style: 'contrast(130%) saturate(120%) hue-rotate(10deg)' }
];

const CameraCapture = ({ onPhotoCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('none');
  const [isCapturing, setIsCapturing] = useState(false);
  const [palmDetectionActive, setPalmDetectionActive] = useState(false);
  const [multiCaptureMode, setMultiCaptureMode] = useState('single');
  const [countdown, setCountdown] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const simulateShutterSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    simulateShutterSound();

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const filter = filters.find(f => f.value === currentFilter);
    ctx.filter = filter?.style || 'none';

    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness > 128) {
        data[i] = Math.min(255, data[i] * 1.1);
        data[i + 1] = Math.min(255, data[i + 1] * 1.1);
        data[i + 2] = Math.min(255, data[i + 2] * 1.1);
      }
    }

    ctx.putImageData(imageData, 0, 0);

    const photoUrl = canvas.toDataURL('image/jpeg', 0.95);
    const photo = {
      id: Date.now().toString(),
      url: photoUrl,
      timestamp: Date.now(),
      filter: currentFilter
    };

    setCapturedPhotos(prev => [...prev, photoUrl]);
    onPhotoCapture(photo);

    const flash = document.createElement('div');
    flash.className = 'fixed inset-0 bg-white z-50 opacity-80';
    document.body.appendChild(flash);
    setTimeout(() => {
      document.body.removeChild(flash);
    }, 100);

    setTimeout(() => setIsCapturing(false), 500);
  };

  const handleMultiCapture = async () => {
    const captures = multiCaptureMode === 'double' ? 2 : multiCaptureMode === 'quad' ? 4 : 1;

    for (let i = 0; i < captures; i++) {
      await new Promise(resolve => setTimeout(resolve, i > 0 ? 1000 : 0));
      await capturePhoto();
    }
  };

  const startCountdown = (seconds) => {
    setCountdown(seconds);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          setTimeout(() => {
            setCountdown(null);
            handleMultiCapture();
          }, 1000);
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const togglePalmDetection = () => {
    setPalmDetectionActive(!palmDetectionActive);
    if (!palmDetectionActive) {
      setTimeout(() => {
        if (palmDetectionActive) {
          capturePhoto();
        }
      }, 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 shadow-2xl border border-gray-700">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-lg tracking-wider">
            INSTAX BOOTH
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-black shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-96 object-cover transition-all duration-300"
            style={{
              filter: filters.find(f => f.value === currentFilter)?.style || 'none'
            }}
          />
          {countdown && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white text-8xl font-bold animate-pulse">
                {countdown}
              </div>
            </div>
          )}
          {palmDetectionActive && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
              <Hand className="inline w-4 h-4 mr-1" />
              Palm Detection Active
            </div>
          )}
          {currentFilter !== 'none' && (
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {filters.find(f => f.value === currentFilter)?.name}
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <FilterPanel
            filters={filters}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
          />

          <div className="flex items-center justify-center space-x-4">
            <div className="flex space-x-2">
              {['single', 'double', 'quad'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setMultiCaptureMode(mode)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    multiCaptureMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {mode === 'single' ? '1x' : mode === 'double' ? '2x' : '4x'}
                </button>
              ))}
            </div>

            <button
              onClick={() => startCountdown(3)}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105"
            >
              <Timer className="w-5 h-5 inline mr-2" />
              3s Timer
            </button>

            <button
              onClick={handleMultiCapture}
              disabled={isCapturing}
              className={`relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 ${
                isCapturing ? 'animate-pulse' : ''
              }`}
            >
              <Camera className="w-6 h-6 inline mr-2" />
              {isCapturing ? 'Capturing...' : 'Capture'}
              {multiCaptureMode !== 'single' && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {multiCaptureMode === 'double' ? '2' : '4'}
                </span>
              )}
            </button>

            <button
              onClick={togglePalmDetection}
              className={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                palmDetectionActive
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Hand className="w-5 h-5 inline mr-2" />
              Palm
            </button>

            <button className="bg-purple-500 hover:bg-purple-400 text-white px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105">
              <Sparkles className="w-5 h-5 inline mr-2" />
              Enhance
            </button>
          </div>
        </div>

        {capturedPhotos.length > 0 && (
          <div className="mt-6">
            <h3 className="text-white font-semibold mb-3">Recent Captures</h3>
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {capturedPhotos.slice(0, 5).map((photo, index) => (
                <div key={index} className="flex-shrink-0">
                  <PolaroidFrame imageUrl={photo} size="small" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
