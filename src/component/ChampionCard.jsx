import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const ChampionCard = ({ champion, selected, banned, onSelect }) => (
    <motion.div
        key={champion.id}
        variants={championCardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: 'spring', stiffness: 300 }}
        className={cn(
            "bg-gray-800 rounded-lg transition-transform duration-300 relative w-22 h-22",
            "border-2 border-transparent hover:border-purple-500/50",
            selected ? "ring-2 ring-purple-500/50" : "",
            banned ? "ring-2 ring-red-500/50" : ""
        )}
        onClick={() => onSelect(champion.id)}
    >
        <h2 className="text-white text-sm font-semibold absolute bottom-2 text-center w-full [text-shadow:2px_2px_2px_rgba(0,0,0,1)] z-10">{champion.name}</h2>
        <img src={champion.imageChampion} alt={champion.name} className={cn(
            "w-22 h-22 rounded-lg relative z-1",
                banned ? "filter grayscale" : "",
        )} />
    </motion.div>
);

export const championCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
};

export default ChampionCard;