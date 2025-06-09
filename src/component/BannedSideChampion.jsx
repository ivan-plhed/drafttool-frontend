import React from 'react';
import { XCircle } from 'lucide-react';

const BannedSideChampion = ({ champion }) => {
    if (!champion) {
        return (
            <div className="bg-gray-800 p-2 rounded-lg flex items-center justify-center w-20 h-20">
                <XCircle className="text-gray-400 w-6 h-6" />
            </div>
        );
    }
    return (
        <div className="bg-gray-800 p-2 rounded-lg flex items-center justify-center w-20 h-20">
            <img
                src={champion.imageChampion}
                alt={champion.name}
                className="w-full h-full object-cover rounded-lg"
            />
        </div>
    );
};

export default BannedSideChampion;
