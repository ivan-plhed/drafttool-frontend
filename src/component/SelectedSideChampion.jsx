import React, { useState, useEffect, useRef } from 'react';
import { User, X } from 'lucide-react';
import ChampionGrid from './ChampionGrid';

const SelectedSideChampion = ({ champion, player, allChampions }) => {
    const [showChampionPoolModal, setShowChampionPoolModal] = useState(false);
    const modalRef = useRef(null);

    const playerChampions = player?.champions || [];
    const availableChampions = allChampions || [];

    const playerChampionPool = availableChampions.filter(championFromAll =>
        playerChampions.some(playerChampObj => playerChampObj.id === championFromAll.id)
    );

    const displayName = player?.name || 'Unknown Player';

    const handleCardClick = () => {
        if (!champion && playerChampionPool.length > 0) {
            setShowChampionPoolModal(true);
        }
    };

    const handleCloseModal = (event) => {
        if (event) {
            event.stopPropagation();
        }
        setShowChampionPoolModal(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowChampionPoolModal(false);
            }
        };

        if (showChampionPoolModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showChampionPoolModal]);


    return (
        <div
            className="bg-gray-800 p-2 rounded-lg gap-3 overflow-hidden w-48 h-[13.5vh] relative cursor-pointer"
            onClick={handleCardClick}
        >
            {champion ? (
                <>
                    <p className="text-white font-bold absolute bottom-2 text-center w-full [text-shadow:2px_2px_2px_rgba(0,0,0,1)] z-10">{displayName}</p>
                    <img
                        src={champion.imageSplash}
                        alt={champion.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <User className="text-gray-400 w-8 h-8 mb-1" />
                    <p className="text-gray-400 text-sm">{displayName}</p>
                    {playerChampionPool.length > 0 && (
                        <p className="text-gray-500 text-xs mt-1">Click for pool</p>
                    )}
                </div>
            )}

            {showChampionPoolModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-200"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-2xl font-bold mb-4 text-white text-center">
                            {displayName}'s Champion Pool
                        </h3>
                        <div className="flex justify-center mb-6">
                            {player?.image ? (
                                <img
                                    src={player.image}
                                    alt={`${displayName}'s avatar`}
                                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/96x96/4B5563/FFFFFF?text=${displayName.charAt(0) || '?'}`; }}
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl font-bold border-2 border-gray-600">
                                    {displayName.charAt(0) ? displayName.charAt(0).toUpperCase() : <User className="w-12 h-12 text-gray-400" />}
                                </div>
                            )}
                        </div>
                        {playerChampionPool.length > 0 ? (
                            <ChampionGrid
                                champions={playerChampionPool}
                                onChampionSelect={() => {}}
                                isLoading={false}
                                leftChampions={[]}
                                rightChampions={[]}
                                pastBans={[]}
                                leftBans={[]}
                                rightBans={[]}
                                currentTurn={null}
                                turnOrderCompleted={false}
                            />
                        ) : (
                            <p className="text-gray-400 text-center">No champions in this player's pool.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectedSideChampion;
