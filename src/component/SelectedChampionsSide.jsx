import React, {useState, useEffect} from 'react';
import SelectedSideChampion from './SelectedSideChampion';
import apiClient from '../api/apiClient';

const SelectedChampionsSide = ({champions, team}) => {
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
        localStorage.setItem('champions', JSON.stringify(champions));
    }, [champions]);

    const getChampion = (championId) => {
        if (!championId) return null;
        return allChampions.find(c => c.id === championId) || null;
    };

    const getPlayer = (index) => {
        if (index === 0) return team.playerTop;
        if (index === 1) return team.playerJungle;
        if (index === 2) return team.playerMid;
        if (index === 3) return team.playerBot;
        if (index === 4) return team.playerSupport;
    }

    return (
        <div className="mx-2">
            <div className="space-y-2">
                {champions.map((champId, index) => (
                    <SelectedSideChampion key={index} player={getPlayer(index)} playerName={getPlayer(index).name}
                                          champion={getChampion(champId)} allChampions={allChampions}/>
                ))}
                {champions.length < 5 &&
                    Array.from({length: 5 - champions.length}).map((_, index) => (
                        <SelectedSideChampion key={`empty-${index}`} champion={null}/>
                    ))}
            </div>
        </div>
    );
};

export default SelectedChampionsSide;
