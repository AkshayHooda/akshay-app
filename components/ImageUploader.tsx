import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
  onGenerate: (base64Image: string, mimeType: string) => Promise<void>;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onGenerate, disabled }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (e.g., JPG, PNG).');
        return;
      }
      setError(null);
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!selectedFile || !imagePreview) return;
    setIsProcessing(true);
    try {
      // The imagePreview from FileReader is a Data URL: "data:image/jpeg;base64,..."
      // We need to strip the prefix to get the pure base64 string for the API.
      const base64String = imagePreview.split(',')[1];
      await onGenerate(base64String, selectedFile.type);
    } catch (e) {
      // Error is handled by the parent component
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, imagePreview, onGenerate]);

  return (
    <div className="flex flex-col items-center w-full">
      <label
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${ imagePreview ? 'border-purple-500 bg-gray-800/50' : 'border-gray-600 hover:border-purple-500 hover:bg-gray-800/50'}`}
      >
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled || isProcessing}
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
        ) : (
          <div className="text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p>Drag & drop an image or click to select</p>
          </div>
        )}
      </label>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      
      {imagePreview && (
        <div className="mt-4">
          <button
            onClick={handleGenerateClick}
            disabled={disabled || isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isProcessing ? 'Processing...' : 'Generate from this Image'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;