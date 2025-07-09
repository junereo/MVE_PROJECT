'use client';

import YoutubeSearch from '../components/youtubeSerch';

const Youtube = () => {
    return (
        <div>
            <div className="w-full font-bold text-black text-2xl py-3 ">
                Survey Youtuve Search
            </div>
            <div className="p-6">
                <YoutubeSearch />
            </div>
        </div>
    );
};

export default Youtube;
