import React, { useState, useCallback } from 'react';
import { generateAvatarFromLocation, generateAvatarFromImage } from './services/geminiService';
import { getCurrentLocation, getRegionFromCoordinates } from './services/locationService';
import Header from './components/Header';
import Spinner from './components/Spinner';
import ErrorDisplay from './components/ErrorDisplay';
import AvatarCard from './components/AvatarCard';
import { GenerateButton } from './components/GenerateButton';
import ImageUploader from './components/ImageUploader';

type Tab = 'location' | 'image';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('location');
  const [lastGenerator, setLastGenerator] = useState<(() => Promise<void>) | null>(null);

  const handleGenerateFromLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    setLastGenerator(() => handleGenerateFromLocation);

    try {
      setLoadingMessage('Finding you on the map...');
      const { latitude, longitude } = await getCurrentLocation();

      setLoadingMessage('Identifying your region...');
      const region = await getRegionFromCoordinates(latitude, longitude);
      if (!region) {
        throw new Error("Could not determine your region from your coordinates.");
      }

      setLoadingMessage(`Crafting an avatar for ${region}...`);
      const generatedImageUrl = await generateAvatarFromLocation(region);
      setImageUrl(generatedImageUrl);

    } catch (err: any) {
      if (err.message.includes('User denied Geolocation')) {
        setError('Location permission is required. Please enable location services for this site in your browser settings.');
      } else {
        setError(err.message || 'An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);
  
  const handleGenerateFromImage = useCallback(async (base64Image: string, mimeType: string) => {
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    setLastGenerator(() => () => handleGenerateFromImage(base64Image, mimeType));

    try {
      setLoadingMessage('Analyzing your image...');
      const generatedImageUrl = await generateAvatarFromImage(base64Image, mimeType);
      setLoadingMessage('Painting your new avatar...');
      setImageUrl(generatedImageUrl);
    } catch (err: any) {
       setError(err.message || 'An unknown error occurred while generating from image.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleStartOver = () => {
    setImageUrl(null);
    setError(null);
    setIsLoading(false);
    setLastGenerator(null);
  };

  const TabButton: React.FC<{tabName: Tab, label: string}> = ({tabName, label}) => (
      <button 
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 ${activeTab === tabName ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
        {label}
      </button>
  );

  const renderInitialState = () => (
     <>
        <div className="flex flex-col items-center">
            <img src="https://picsum.photos/seed/placeholder/300/300" alt="Placeholder" className="rounded-full w-48 h-48 md:w-64 md:h-64 object-cover border-4 border-gray-700 shadow-lg"/>
            <p className="mt-4 text-gray-400">Your generated avatar will appear here.</p>
        </div>
        <div className="mt-8 w-full flex flex-col items-center">
          <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
            <TabButton tabName="location" label="From Location"/>
            <TabButton tabName="image" label="From Image"/>
          </div>
          <div className="mt-6 w-full max-w-sm">
            {activeTab === 'location' ? (
              <div className="flex justify-center">
                <GenerateButton onClick={handleGenerateFromLocation} disabled={isLoading} />
              </div>
            ) : (
              <ImageUploader onGenerate={handleGenerateFromImage} disabled={isLoading} />
            )}
          </div>
        </div>
     </>
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        <Header />
        <p className="mt-4 text-lg text-gray-300 max-w-xl">
          Discover a unique digital version of you, inspired by your world. Generate an avatar from your location or upload an image to create a new masterpiece.
        </p>
        <div className="mt-8 w-full min-h-[420px] md:min-h-[500px] flex items-center justify-center">
          {isLoading ? (
            <Spinner message={loadingMessage} />
          ) : error ? (
            <div className="flex flex-col items-center gap-4">
              <ErrorDisplay message={error} />
              <GenerateButton onClick={handleStartOver} text="Try Again" />
            </div>
          ) : imageUrl ? (
            <AvatarCard imageUrl={imageUrl} onRegenerate={lastGenerator!} onStartOver={handleStartOver} />
          ) : (
            renderInitialState()
          )}
        </div>
      </div>
    </div>
  );
};

export default App;