import React from 'react';
import type { GenerationJob, DownloadQuality } from '../App';

interface ImageDisplayProps {
  jobs: GenerationJob[];
  isSubscribed: boolean;
  onDownloadAll: () => void;
  downloadQuality: DownloadQuality;
  setDownloadQuality: (quality: DownloadQuality) => void;
}

const JobCard: React.FC<{ job: GenerationJob, downloadQuality: DownloadQuality }> = ({ job, downloadQuality }) => {
  const handleDownload = () => {
    if (!job.imageUrl) return;
    const link = document.createElement('a');
    link.href = job.imageUrl;
    const qualityTag = downloadQuality === 'normal' ? '' : `_${downloadQuality.toUpperCase()}`;
    link.download = `${job.prompt.slice(0, 30).replace(/\s+/g, '_') || 'generated_image'}${qualityTag}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const Loader = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
    </div>
  );

  const ErrorDisplay = () => (
    <div className="flex flex-col items-center justify-center h-full text-red-400 p-2 bg-red-900/20 text-center">
      <p className="font-semibold text-sm">Failed</p>
      <p className="text-xs">{job.error}</p>
    </div>
  );

  return (
    <div className="aspect-square w-full bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden relative group">
        {job.status === 'generating' && <Loader />}
        {job.status === 'failed' && <ErrorDisplay />}
        {job.status === 'completed' && job.imageUrl && (
            <>
                <img src={job.imageUrl} alt={job.prompt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                    <p className="text-xs line-clamp-2">{job.prompt}</p>
                    <button
                        onClick={handleDownload}
                        disabled={!job.imageUrl}
                        className="self-end px-3 py-1.5 bg-indigo-600 text-white rounded-md font-semibold flex items-center gap-1 text-xs transition-colors duration-200 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        title="Download"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        Download
                    </button>
                </div>
            </>
        )}
    </div>
  );
};


const ImageDisplay: React.FC<ImageDisplayProps> = ({ jobs, isSubscribed, onDownloadAll, downloadQuality, setDownloadQuality }) => {
    const hasSuccessfulJobs = jobs.some(j => j.status === 'completed' && j.imageUrl);
    
    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                 <h2 className="text-xl font-semibold text-gray-300">Generation History</h2>
                 <div className="flex items-center gap-2">
                    {isSubscribed && (
                        <div>
                             <label htmlFor="quality-select" className="sr-only">Download Quality</label>
                             <select
                                id="quality-select"
                                value={downloadQuality}
                                onChange={(e) => setDownloadQuality(e.target.value as DownloadQuality)}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2"
                                title="Select download quality"
                             >
                                <option value="normal">Normal</option>
                                <option value="hd">HD (1080p)</option>
                                <option value="2k">Ultra HD (2K)</option>
                             </select>
                        </div>
                    )}
                     <button 
                        onClick={onDownloadAll}
                        disabled={!isSubscribed || !hasSuccessfulJobs}
                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold flex items-center gap-2 transition-colors duration-200 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        title={!isSubscribed ? "Subscribe to download all" : (!hasSuccessfulJobs ? "No images to download" : "Download all as .zip")}
                     >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /><path d="M10 9a1 1 0 00-1 1v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1a1 1 0 00-1-1z" /></svg>
                         Download All (.zip)
                     </button>
                 </div>
            </div>

            {jobs.length === 0 ? (
                 <div className="flex flex-col items-center justify-center text-gray-500 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg">Generated images will appear here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {jobs.map(job => (
                        <JobCard key={job.id} job={job} downloadQuality={downloadQuality} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageDisplay;
