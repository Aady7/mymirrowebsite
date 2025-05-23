import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ColorResult {
  undertone: string;
  contrast: string;
  recommended_colors: Array<{
    hex: string;
    explanation: string;
  }>;
}

interface ColorAnalyzerProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SKIN_TONES = [
  { hex: '#F5E6E0', name: 'Fair' },
  { hex: '#EDD6C7', name: 'Light' },
  { hex: '#E5C6B3', name: 'Light Medium' },
  { hex: '#DDB59E', name: 'Medium' },
  { hex: '#C69076', name: 'Medium Tan' },
  { hex: '#AC7254', name: 'Tan' },
  { hex: '#8E4E2C', name: 'Deep' },
  { hex: '#643118', name: 'Deep Rich' },
];

export default function ColorAnalyzer({ formValues, handleChange }: ColorAnalyzerProps) {
  const [result, setResult] = useState<ColorResult | null>(null);
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Cleanup effect to ensure camera is stopped when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Monitor video element to ensure it's working
  useEffect(() => {
    if (showCamera && videoRef.current && stream) {
      const video = videoRef.current;
      
      // Handle video element errors
      const handleVideoError = () => {
        setCameraError("Error displaying camera feed. Please try again.");
        stopCamera();
      };
      
      video.addEventListener('error', handleVideoError);
      
      return () => {
        video.removeEventListener('error', handleVideoError);
      };
    }
  }, [showCamera, stream]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      console.log("Camera access granted, configuring video element...");
      
      // Set state first
      setStream(mediaStream);
      setShowCamera(true);
      setIsAnalysisComplete(false);
      
      // Small delay to ensure state updates before configuring video
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // Force video to play
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Error playing video:", error);
              setCameraError("Could not start video playback. Please try again.");
            });
          }
        } else {
          console.error("Video element not found");
          setCameraError("Camera interface not available. Please try again.");
        }
      }, 100);
      
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please make sure you have granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCameraError(null);
    
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context && video.readyState === 4) { // HAVE_ENOUGH_DATA
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData); // Store for preview
        // Do not upload yet, wait for user confirmation
        stopCamera();
        console.log("Image captured");
      } else {
        setCameraError("Cannot capture image. Video not ready.");
      }
    }
  };

  const handleImageData = async (imageData: string) => {
    try {
      const base64 = imageData.split(",")[1];
      console.log("base64", base64);
      const res = await fetch("https://color-analysis-production.up.railway.app/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({image:base64}),
      });

      if (!res.ok) {
        console.error("Error:", res.statusText);
        return;
      }

      const data = await res.json();
      setResult(data);
      setIsAnalysisComplete(true);
      
      const syntheticEvent = {
        target: {
          name: 'colorAnalysis',
          value: JSON.stringify({
            image: base64,
            ...data,
            isComplete: true
          })
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(syntheticEvent);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalysisComplete(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result as string;
      handleImageData(imageData);
    };

    reader.readAsDataURL(file);
  };

  const handleManualSelect = (hex: string) => {
    setSelectedTone(hex);
    setIsAnalysisComplete(true);
    
    const syntheticEvent = {
      target: {
        name: 'colorAnalysis',
        value: JSON.stringify({
          manualSelection: true,
          selectedTone: hex,
          isComplete: true
        })
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(syntheticEvent);
  };

  const handleModeChange = (newMode: 'upload' | 'manual') => {
    // Stop camera if active
    if (stream) {
      stopCamera();
    }
    
    setMode(newMode);
    setIsAnalysisComplete(false);
    setResult(null);
    setSelectedTone('');
    
    const syntheticEvent = {
      target: {
        name: 'colorAnalysis',
        value: JSON.stringify({
          isComplete: false
        })
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleChange(syntheticEvent);
  };

  // New: handle upload after preview
  const handleUploadCaptured = () => {
    if (capturedImage) {
      handleImageData(capturedImage);
      setCapturedImage(null);
    }
  };

  // New: handle retake
  const handleRetake = () => {
    setCapturedImage(null);
    setShowCamera(true);
    setCameraError(null);
    startCamera();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-gray-600 mb-8">
          Upload a selfie for the most accurate match — or pick your tone manually.
        </p>

        <div className="flex rounded-lg overflow-hidden mb-8 border border-gray-200">
          <button
            className={`flex-1 py-4 px-6 text-center transition-colors ${
              mode === 'upload'
                ? 'bg-[#E8F4F6] text-[#007e90] font-medium'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => handleModeChange('upload')}
          >
            Upload Photo
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center transition-colors ${
              mode === 'manual'
                ? 'bg-[#E8F4F6] text-[#007e90] font-medium'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => handleModeChange('manual')}
          >
            Pick your shade
          </button>
        </div>

        {mode === 'upload' && (
          <div className="space-y-6">
            {/* Show preview if a photo was captured */}
            {capturedImage ? (
              <div className="flex flex-col items-center gap-6">
                <img
                  src={capturedImage}
                  alt="Preview"
                  className="w-full max-w-xs rounded-lg border border-gray-300 object-contain bg-gray-100"
                />
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleUploadCaptured}
                    className="px-6 py-2 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors font-medium"
                  >
                    Upload
                  </button>
                  <button
                    onClick={handleRetake}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Retake
                  </button>
                </div>
              </div>
            ) : showCamera ? (
              <div className="relative">
                {/* Video container with fixed dimensions */}
                <div className="w-full h-[480px] bg-gray-900 rounded-lg overflow-hidden relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Overlay error message if camera fails */}
                  {cameraError && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white p-4 text-center">
                      <div>
                        <p className="mb-4">{cameraError}</p>
                        <button
                          onClick={stopCamera}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg"
                        >
                          Close Camera
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-2 bg-[#007e90] text-white rounded-lg hover:bg-[#006d7d] transition-colors"
                  >
                    Take Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8 p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                {/* Camera option */}
                <div 
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={startCamera}
                >
                  <div className="w-28 h-28 mb-4 rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image 
                        src="/stylequizimages/colorAnalysis/takephoto.png" 
                        alt="Take a photo"
                        width={60}
                        height={60}
                        className="object-contain"
                        onError={(e) => {
                          // Fallback to SVG if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>`;
                          }
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">Take a picture of your face</p>
                </div>

                {/* Upload option */}
                <div 
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={triggerFileUpload}
                >
                  <div className="w-28 h-28 mb-4 rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image 
                        src="/stylequizimages/colorAnalysis/uploadphoto.png" 
                        alt="Upload a photo"
                        width={60}
                        height={60}
                        className="object-contain"
                        onError={(e) => {
                          // Fallback to SVG if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>`;
                          }
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 text-center">Upload a picture of your face</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    id="uploadPhoto"
                  />
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 italic text-center">
              Not comfortable taking a photo? Switch to manual mode and choose your closest skin tone.
            </p>
          </div>
        )}

        {mode === 'manual' && (
          <div className="space-y-6">
            <p className="text-gray-700 mb-4">Pick the shade closest to your skin tone.</p>
            <div className="grid grid-cols-8 gap-2">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone.hex}
                  onClick={() => handleManualSelect(tone.hex)}
                  className={`w-full aspect-[1/4] rounded-sm transition-all ${
                    selectedTone === tone.hex ? 'ring-2 ring-[#007e90] ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                  }`}
                  style={{ backgroundColor: tone.hex }}
                  title={tone.name}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 italic">
              Tip: Choose the tone closest to your inner forearm or jawline.
            </p>
          </div>
        )}
      </div>

      {result && mode === 'upload' && (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Undertone</h3>
              <p className="text-lg text-[#007e90]">{result.undertone}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Contrast</h3>
              <p className="text-lg text-[#007e90]">{result.contrast}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-4">Recommended Colors</h3>
            <div className="grid grid-cols-2 gap-3">
              {result.recommended_colors.map((color, i) => (
                <div key={i} className="flex items-center space-x-3 p-2 bg-white rounded-md">
                  <span
                    className="w-8 h-8 rounded-full border border-gray-200"
                    style={{ backgroundColor: color.hex }}
                  ></span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{color.hex}</p>
                    <p className="text-xs text-gray-500">{color.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
