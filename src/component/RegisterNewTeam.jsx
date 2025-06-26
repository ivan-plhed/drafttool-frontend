import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import ChampionCard from './ChampionCard';

const PlayerInput = ({ position, player, onPlayerChange, onChampionSelect, allChampions, selectedChampions }) => {
    const isNicknameEntered = player.name && player.name.trim() !== '';

    const getChampionNameFromObject = (championObj) => {
        return championObj ? championObj.name : 'Unknown Champion';
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-bold mb-4 text-white capitalize">{position} Player</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor={`${position}-name`} className="block text-gray-300 text-sm font-bold mb-2">Nickname</label>
                    <input
                        type="text"
                        id={`${position}-name`}
                        name="name"
                        value={player.name}
                        onChange={(e) => onPlayerChange(position, 'name', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor={`${position}-realName`} className="block text-gray-300 text-sm font-bold mb-2">Real Name</label>
                    <input
                        type="text"
                        id={`${position}-realName`}
                        name="realName"
                        value={player.realName}
                        onChange={(e) => onPlayerChange(position, 'realName', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor={`${position}-country`} className="block text-gray-300 text-sm font-bold mb-2">Country</label>
                    <input
                        type="text"
                        id={`${position}-country`}
                        name="country"
                        value={player.country}
                        onChange={(e) => onPlayerChange(position, 'country', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor={`${position}-image`} className="block text-gray-300 text-sm font-bold mb-2">Image URL</label>
                    <input
                        type="text"
                        id={`${position}-image`}
                        name="image"
                        value={player.image}
                        onChange={(e) => onPlayerChange(position, 'image', e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {selectedChampions.length > 0 && (
                <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-bold mb-2 text-white">Champion Pool:</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedChampions.map(championObj => (
                            <span key={championObj.id} className="bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
                                {getChampionNameFromObject(championObj)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {isNicknameEntered && (
                <div className="mt-6 border-t border-gray-600 pt-6">
                    <h4 className="text-lg font-bold mb-4 text-white">Select Champions for {player.name}</h4>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar p-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {allChampions.map(champion => (
                                <ChampionCard
                                    key={champion.id}
                                    champion={champion}
                                    selected={selectedChampions.some(c => c.id === champion.id)}
                                    banned={false}
                                    onSelect={() => onChampionSelect(position, champion)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


function RegisterNewTeam() {
    const navigate = useNavigate();
    const [teamName, setTeamName] = useState('');
    const [players, setPlayers] = useState({
        top: { name: '', realName: '', country: '', image: '', champions: [] },
        jungle: { name: '', realName: '', country: '', image: '', champions: [] },
        mid: { name: '', realName: '', country: '', image: '', champions: [] },
        bot: { name: '', realName: '', country: '', image: '', champions: [] },
        support: { name: '', realName: '', country: '', image: '', champions: [] },
    });
    const [allChampions, setAllChampions] = useState([]);
    const [isLoadingChampions, setIsLoadingChampions] = useState(true);
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedPlayerPosition, setFocusedPlayerPosition] = useState(null);

    useEffect(() => {
        const fetchChampions = async () => {
            try {
                const response = await apiClient.get('/champions');
                setAllChampions(response.data || response);
            } catch (error) {
                console.error('Error fetching champions:', error);
            } finally {
                setIsLoadingChampions(false);
            }
        };
        fetchChampions();
    }, []);

    const handleTeamNameChange = (e) => {
        setTeamName(e.target.value);
    };

    const handlePlayerChange = (position, field, value) => {
        setPlayers(prevPlayers => ({
            ...prevPlayers,
            [position]: {
                ...prevPlayers[position],
                [field]: value,
            },
        }));
    };


    const handleChampionSelect = (position, selectedChampion) => {
        setPlayers(prevPlayers => {
            const currentChampions = prevPlayers[position].champions;
            const isAlreadySelected = currentChampions.some(c => c.id === selectedChampion.id);

            const updatedChampions = isAlreadySelected
                ? currentChampions.filter(c => c.id !== selectedChampion.id)
                : [...currentChampions, selectedChampion];

            return {
                ...prevPlayers,
                [position]: {
                    ...prevPlayers[position],
                    champions: updatedChampions,
                },
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        if (!teamName.trim()) {
            setSubmitError('Team name is required.');
            setIsSubmitting(false);
            return;
        }
        for (const pos of ['top', 'jungle', 'mid', 'bot', 'support']) {
            if (!players[pos].name.trim()) {
                setSubmitError(`Nickname for ${pos} player is required.`);
                setIsSubmitting(false);
                return;
            }
        }

        const teamData = {
            name: teamName,
            playerTop: players.top,
            playerJungle: players.jungle,
            playerMid: players.mid,
            playerBot: players.bot,
            playerSupport: players.support,
        };

        try {
            const response = await apiClient.post('/teams', teamData);
        } catch (error) {
            console.error('Error registering team:', error);
            setSubmitError('Failed to register team. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[90vh] bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">Register New Team</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <label htmlFor="teamName" className="block text-gray-300 text-lg font-bold mb-2">Team Name</label>
                        <input
                            type="text"
                            id="teamName"
                            value={teamName}
                            onChange={handleTeamNameChange}
                            className="shadow appearance-none border rounded w-full py-3 px-4 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white text-xl focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter team name"
                            required
                        />
                    </div>

                    <div className="space-y-8">
                        {['top', 'jungle', 'mid', 'bot', 'support'].map(position => (
                            <PlayerInput
                                key={position}
                                position={position}
                                player={players[position]}
                                onPlayerChange={handlePlayerChange}
                                onChampionSelect={handleChampionSelect}
                                allChampions={allChampions}
                                selectedChampions={players[position].champions}
                                isFocused={focusedPlayerPosition === position}
                                onFocusChange={setFocusedPlayerPosition}
                            />
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        {submitError && <p className="text-red-500 mb-4">{submitError}</p>}
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoadingChampions}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-lg font-semibold text-xl hover:from-purple-600 hover:to-pink-600 transition-colors duration-200"
                        >
                            {isSubmitting ? 'Registering Team...' : isLoadingChampions ? 'Loading Champions...' : 'Register Team'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterNewTeam;
