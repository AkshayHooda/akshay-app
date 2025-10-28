import React, { useState } from 'react';

interface ShareButtonsProps {
  imageUrl: string;
}

// Helper to convert data URL to a File object, which is needed for the Web Share API.
async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File | null> {
    try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], fileName, { type: blob.type });
    } catch (error) {
        console.error("Error converting data URL to file:", error);
        return null;
    }
}


const ShareButtons: React.FC<ShareButtonsProps> = ({ imageUrl }) => {
    const [copySuccess, setCopySuccess] = useState('');

    const shareText = "Look at this amazing AI avatar I created based on my location! You can create your own too.";
    const appUrl = "https://aistudio.google.com/"; // Using a placeholder URL for the app.
    const twitterHashtags = "GeoAvatar,AIGeneratedArt,Gemini";

    const handleNativeShare = async () => {
        if (!navigator.share) {
             alert("Your browser doesn't support the native share feature. Please use one of the social media links to share.");
             return;
        }

        const imageFile = await dataUrlToFile(imageUrl, 'geo-avatar.jpg');
        
        // Check if file sharing is supported
        if (imageFile && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
             try {
                await navigator.share({
                    title: 'My Geo Avatar',
                    text: shareText,
                    files: [imageFile],
                });
                return;
            } catch (error) {
                console.error('Error sharing file:', error);
                // Fall through to share URL if file sharing fails
            }
        }
        
        // Fallback for when file sharing is not supported, but text/url is.
        try {
            await navigator.share({
                title: 'My Geo Avatar',
                text: shareText,
                url: appUrl,
            });
        } catch (error) {
             console.error('Error sharing URL:', error);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(imageUrl).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            console.error('Could not copy image data URL: ', err);
            setCopySuccess('Failed!');
             setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const buttonClasses = "p-3 bg-gray-700 rounded-full text-white hover:bg-purple-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50";
    
    // SVG Icons
    const ShareIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
    );

    const TwitterIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
    
    const FacebookIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
    );

    const CopyIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    );


    return (
        <div className="mt-6 w-full max-w-xs">
            <p className="font-semibold text-gray-300">Share your creation!</p>
            <div className="flex items-center justify-center gap-4 mt-3">
                {navigator.share && (
                    <button onClick={handleNativeShare} title="Share" className={buttonClasses}>
                        <ShareIcon />
                    </button>
                )}
                
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}&hashtags=${encodeURIComponent(twitterHashtags)}`} target="_blank" rel="noopener noreferrer" title="Share on Twitter" className={buttonClasses}>
                    <TwitterIcon />
                </a>

                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" title="Share on Facebook" className={buttonClasses}>
                    <FacebookIcon />
                </a>
                
                <div className="relative">
                    <button onClick={copyToClipboard} title="Copy Image Link" className={buttonClasses}>
                        <CopyIcon />
                    </button>
                    {copySuccess && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 transition-opacity duration-300 animate-fade-in">
                            {copySuccess}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareButtons;