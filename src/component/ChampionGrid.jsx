import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChampionCard, { championCardVariants } from './ChampionCard';

const ChampionGrid = ({ champions, onChampionSelect, isLoading, leftChampions, rightChampions, leftBans, rightBans, currentTurn, turnOrderCompleted, pastBans }) => {
    const isChampionSelected = (championId) =>
        leftChampions.includes(championId) || rightChampions.includes(championId) || pastBans.includes(championId);

    const isChampionBanned = (championId) =>
        leftBans.includes(championId) || rightBans.includes(championId) || pastBans.includes(championId);

    return (
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 m-2">
                <AnimatePresence>
                    {isLoading ? (
                        Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                                key={`loading-${i}`}
                                variants={championCardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="bg-gray-800 rounded-lg p-4 animate-pulse"
                            >
                                <div className="w-10 h-10 bg-gray-700 rounded-full mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                            </motion.div>
                        ))
                    ) : (
                        champions.map(char => (
                            <ChampionCard
                                key={char.id}
                                champion={char}
                                selected={isChampionSelected(char.id)}
                                banned={isChampionBanned(char.id)}
                                onSelect={(id) => {
                                    if (!turnOrderCompleted && currentTurn) {
                                        onChampionSelect(id);
                                    }
                                }}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChampionGrid;
