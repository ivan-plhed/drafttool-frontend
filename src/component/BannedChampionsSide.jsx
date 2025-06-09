import React, { useState, useEffect } from 'react';
import BannedSideChampion from './BannedSideChampion';
import apiClient from '../api/apiClient';

const BannedChampionsSide = ({ bannedChampions, className }) => {
    const [allChampions, setAllChampions] = useState([]);
    useEffect(() => {
        const fetchChampions = async () => {
            try {
                const data = await apiClient.get('/champions');
                setAllChampions(data);
            } catch (error) {
                console.error('Error fetching champions:', error);
            }
        };
        fetchChampions();
    }, []);

    const getChampion = (championId) => {
        if (!championId) return null;
        return allChampions.find(c => c.id === championId) || null;
    };

    return (
        <div className={className || ""}>
            <div className="space-y-2 flex flex-col justify-center h-full">
                {bannedChampions.map((champId, index) => (
                    <BannedSideChampion key={index} champion={getChampion(champId)} />
                ))}
                {bannedChampions.length < 5 &&
                    Array.from({ length: 5 - bannedChampions.length }).map((_, index) => (
                        <BannedSideChampion key={`empty-${index}`} champion={null} />
                    ))}
            </div>
        </div>
    );
};

export default BannedChampionsSide;
