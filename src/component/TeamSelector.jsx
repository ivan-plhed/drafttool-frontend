import React, {useState, useEffect} from 'react';
import apiClient from '../api/apiClient';
import {useNavigate} from 'react-router-dom';

const TeamSelector = ({onTeamsSelected, loggedIn}) => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [leftTeam, setLeftTeam] = useState(null);
    const [rightTeam, setRightTeam] = useState(null);
    const [loadingTeamDetails, setLoadingTeamDetails] = useState({left: false, right: false});

    useEffect(() => {

        const fetchTeams = async () => {

            const savedTeams = JSON.parse(localStorage.getItem("teams"));

            if (savedTeams && savedTeams.length > 0) {
                setTeams(savedTeams);
            } else {
                setIsLoading(true);
            }

            setError(null);
            try {
                const response = await apiClient.get('/teams');
                localStorage.setItem("teams", JSON.stringify(response));
                if (Array.isArray(response)) {
                    setTeams(response);
                } else if (response && Array.isArray(response.data)) {
                    setTeams(response.data);
                } else if (response && Array.isArray(response.teams)) {
                    setTeams(response.teams);
                } else {
                    setError('Received invalid data format from server.');
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
                if (!savedTeams || savedTeams.length === 0) {
                    setError('Failed to fetch teams. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, [loggedIn, teams.length]);

    const filteredTeams = teams.filter(team => {
        if (!team) {
            return false;
        }

        const teamName = team.name || team.Name;

        if (!teamName) {
            return false;
        }

        const matches = teamName.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matches && searchTerm) {
        }
        return matches;
    });

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const fetchTeamDetails = async (team, side) => {

        if (side === 'left') {
            setLeftTeam(team);
        } else {
            setRightTeam(team);
        }

        setLoadingTeamDetails(prev => ({...prev, [side]: false}));
    };

    const handleTeamSelect = (team, side) => {
        fetchTeamDetails(team, side);
    };

    const getTeamName = (team) => {
        if (!team) return '';
        return team.name || team.Name || '';
    };

    const getPlayerName = (player) => {
        if (!player) return 'N/A';

        if (player.name) return player.name;
        if (player.Name) return player.Name;

        if (player.realName) return player.realName;

        return 'N/A';
    };

    const handleStartDraft = () => {
        if (leftTeam && rightTeam) {
            onTeamsSelected(leftTeam, rightTeam);
        }
    };

    const handleAddCustomTeam = () => {
        navigate('/new-team');
    };

    const renderTeamCard = (team) => (
        <div key={getTeamName(team) || 'unknown'} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-center">{getTeamName(team) || 'Unknown Team'}</h3>
            <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center">
                    <p className="text-gray-400 w-1/2">Top:</p>
                    <p>{getPlayerName(team?.playerTop)}</p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-400 w-1/2">Jungle:</p>
                    <p>{getPlayerName(team?.playerJungle)}</p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-400 w-1/2">Mid:</p>
                    <p>{getPlayerName(team?.playerMid)}</p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-400 w-1/2">Bot:</p>
                    <p>{getPlayerName(team?.playerBot)}</p>
                </div>
                <div className="flex items-center">
                    <p className="text-gray-400 w-1/2">Support:</p>
                    <p>{getPlayerName(team?.playerSupport)}</p>
                </div>
            </div>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={() => handleTeamSelect(team, 'left')}
                    className={`px-3 py-1 rounded ${
                        getTeamName(leftTeam) === getTeamName(team)
                            ? 'bg-blue-600 text-white'
                            : loadingTeamDetails.left
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    disabled={
                        getTeamName(rightTeam) === getTeamName(team) ||
                        loadingTeamDetails.left ||
                        loadingTeamDetails.right
                    }
                >
                    {loadingTeamDetails.left
                        ? 'Loading...'
                        : getTeamName(leftTeam) === getTeamName(team)
                            ? 'Selected for Left'
                            : 'Select for Left'
                    }
                </button>
                <button
                    onClick={() => handleTeamSelect(team, 'right')}
                    className={`px-3 py-1 rounded ${
                        getTeamName(rightTeam) === getTeamName(team)
                            ? 'bg-red-600 text-white'
                            : loadingTeamDetails.right
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    disabled={
                        getTeamName(leftTeam) === getTeamName(team) ||
                        loadingTeamDetails.left ||
                        loadingTeamDetails.right
                    }
                >
                    {loadingTeamDetails.right
                        ? 'Loading...'
                        : getTeamName(rightTeam) === getTeamName(team)
                            ? 'Selected for Right'
                            : 'Select for Right'
                    }
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900 text-white min-h-[90vh] flex flex-col">
            <main className="p-6 flex-grow flex flex-col overflow-hidden">
                <div className="mb-6 flex justify-between items-center">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search teams..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        {loggedIn && (
                            <button
                                onClick={handleAddCustomTeam}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors duration-200"
                            >
                                Add a custom team
                            </button>
                        )}
                        <button
                            onClick={handleStartDraft}
                            disabled={!leftTeam || !rightTeam || loadingTeamDetails.left || loadingTeamDetails.right}
                            className={`px-4 py-2 rounded-lg ${
                                leftTeam && rightTeam && !loadingTeamDetails.left && !loadingTeamDetails.right
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-gray-700 cursor-not-allowed'
                            }`}
                        >
                            {loadingTeamDetails.left || loadingTeamDetails.right
                                ? 'Loading team details...'
                                : 'Start Draft'
                            }
                        </button>
                    </div>
                </div>

                <div className="flex justify-between mb-4">
                    <div className="w-1/2 pr-2 flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-2 text-center">Left Team</h2>
                        {loadingTeamDetails.left ? (
                            <div className="bg-blue-900 p-4 rounded-lg text-center">
                                <p className="text-white">Loading team details...</p>
                            </div>
                        ) : leftTeam ? (
                            <div className="bg-blue-900 p-4 rounded-lg w-1/2">
                                <h3 className="text-xl font-bold mb-2 text-center">{getTeamName(leftTeam)}</h3>
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex items-center">
                                        <p className="text-gray-400 w-1/2">Top:</p>
                                        <p>{getPlayerName(leftTeam.playerTop)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-gray-400 w-1/2">Jungle:</p>
                                        <p>{getPlayerName(leftTeam.playerJungle)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-gray-400 w-1/2">Mid:</p>
                                        <p>{getPlayerName(leftTeam.playerMid)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-gray-400 w-1/2">Bot:</p>
                                        <p>{getPlayerName(leftTeam.playerBot)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-gray-400 w-1/2">Support:</p>
                                        <p>{getPlayerName(leftTeam.playerSupport)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setLeftTeam(null)}
                                    className="mt-4 px-3 py-1 bg-red-600 rounded hover:bg-red-700 w-full"
                                >
                                    Clear
                                </button>
                            </div>
                        ) : (
                            <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
                                No team selected
                            </div>
                        )}
                    </div>
                    <div className="w-1/2 pl-2 flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-2 text-center">Right Team</h2>
                        {loadingTeamDetails.right ? (
                            <div className="bg-red-900 p-4 rounded-lg text-center">
                                <p className="text-white">Loading team details...</p>
                            </div>
                        ) : rightTeam ? (
                            <div className="bg-red-900 p-4 rounded-lg w-1/2">
                                <h3 className="text-xl font-bold mb-2 text-center">{getTeamName(rightTeam)}</h3>
                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex items-center">
                                        <p className="text-gray-400 w-1/2">Top:</p>
                                        <p>{getPlayerName(rightTeam.playerTop)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-gray-400 w-1/2">Jungle:</p>
                                        <p>{getPlayerName(rightTeam.playerJungle)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-gray-400 w-1/2">Mid:</p>
                                        <p>{getPlayerName(rightTeam.playerMid)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-gray-400 w-1/2">Bot:</p>
                                        <p>{getPlayerName(rightTeam.playerBot)}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-gray-400 w-1/2">Support:</p>
                                        <p>{getPlayerName(rightTeam.playerSupport)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setRightTeam(null)}
                                    className="mt-4 px-3 py-1 bg-red-600 rounded hover:bg-red-700 w-full"
                                >
                                    Clear
                                </button>
                            </div>
                        ) : (
                            <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
                                No team selected
                            </div>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">Loading teams...</div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">{error}</div>
                ) : filteredTeams.length === 0 ? (
                    <div className="text-center py-8">
                        {searchTerm ? `No teams found matching "${searchTerm}"` : "No teams available"}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-auto custom-scrollbar">
                        {filteredTeams.map(renderTeamCard)}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TeamSelector;
