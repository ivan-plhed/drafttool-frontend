import React, {useEffect, useState} from 'react';
import SearchAndFilters from './SearchAndFilters';
import ChampionGrid from './ChampionGrid';
import SelectedChampionsSide from './SelectedChampionsSide';
import BannedChampionsSide from './BannedChampionsSide';
import apiClient from '../api/apiClient';

const NUM_GAMES = 5;

const createEmptyGame = () => ({
    leftChampions: Array(5).fill(''),
    rightChampions: Array(5).fill(''),
    leftBans: Array(5).fill(''),
    rightBans: Array(5).fill(''),
    currentTurnIndex: 0,
    leftBanCount: 0,
    rightBanCount: 0,
    leftSelectCount: 0,
    rightSelectCount: 0,
});

function FearlessPractice({leftTeam, rightTeam}) {
    const [champions, setChampions] = useState([]);
    const [pastBans, setPastBans] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeType, setActiveType] = useState(null);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);

    const [games, setGames] = useState(
        Array(NUM_GAMES).fill(null).map(createEmptyGame)
    );

    const turnOrder = [
        {team: 'left', action: 'ban'},
        {team: 'right', action: 'ban'},
        {team: 'left', action: 'ban'},
        {team: 'right', action: 'ban'},
        {team: 'left', action: 'ban'},
        {team: 'right', action: 'ban'},
        {team: 'left', action: 'select'},
        {team: 'right', action: 'select'},
        {team: 'right', action: 'select'},
        {team: 'left', action: 'select'},
        {team: 'left', action: 'select'},
        {team: 'right', action: 'select'},
        {team: 'left', action: 'ban'},
        {team: 'right', action: 'ban'},
        {team: 'right', action: 'ban'},
        {team: 'left', action: 'ban'},
        {team: 'right', action: 'select'},
        {team: 'left', action: 'select'},
        {team: 'left', action: 'select'},
        {team: 'right', action: 'select'},
    ];

    useEffect(() => {
        const fetchChampions = async () => {
            setIsLoading(true);
            try {
                const data = await apiClient.get('/champions');
                setChampions(data);
            } catch (error) {
                console.error('Error fetching champions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChampions();
    }, []);

    const currentGame = games[currentGameIndex];
    const currentTurn = turnOrder[currentGame.currentTurnIndex] || null;
    const turnOrderCompleted = currentGame.currentTurnIndex >= turnOrder.length;

    const allChampionsSelected = (game) => {
        return (
            !game.leftChampions.includes('') &&
            !game.rightChampions.includes('') &&
            !game.leftBans.includes('') &&
            !game.rightBans.includes('')
        );
    };

    const goToNextGame = () => {
        if (!allChampionsSelected(currentGame) || currentGameIndex >= NUM_GAMES - 1) return;

        const nextIndex = currentGameIndex + 1;

        setPastBans([
            ...pastBans,
            ...currentGame.leftChampions,
            ...currentGame.rightChampions,
        ]);

        const newGames = [...games];
        newGames[nextIndex] = createEmptyGame();
        setGames(newGames);
        setCurrentGameIndex(nextIndex);
    };

    const handleChampionSelect = (championId) => {
        if (!currentTurn || turnOrderCompleted) return;

        if (
            currentGame.leftChampions.includes(championId) ||
            currentGame.rightChampions.includes(championId) ||
            currentGame.leftBans.includes(championId) ||
            currentGame.rightBans.includes(championId)
        ) {
            return;
        }

        const updatedGames = [...games];
        const game = {...currentGame};

        if (currentTurn.action === 'ban') {
            if (currentTurn.team === 'left' && game.leftBanCount < game.leftBans.length) {
                game.leftBans[game.leftBanCount] = championId;
                game.leftBanCount++;
            } else if (currentTurn.team === 'right' && game.rightBanCount < game.rightBans.length) {
                game.rightBans[game.rightBanCount] = championId;
                game.rightBanCount++;
            }
        } else {
            if (currentTurn.team === 'left' && game.leftSelectCount < game.leftChampions.length) {
                game.leftChampions[game.leftSelectCount] = championId;
                game.leftSelectCount++;
            } else if (currentTurn.team === 'right' && game.rightSelectCount < game.rightChampions.length) {
                game.rightChampions[game.rightSelectCount] = championId;
                game.rightSelectCount++;
            }
        }
        game.currentTurnIndex++;
        updatedGames[currentGameIndex] = game;
        setGames(updatedGames);
    };

    const filteredChampions = champions.filter((char) => {
        const nameMatch = char.name.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = !activeType || char.type === activeType;
        return nameMatch && typeMatch;
    });

    const resetGame = () => {
        const updatedGames = [...games];
        updatedGames[currentGameIndex] = createEmptyGame();
        setGames(updatedGames);
        setSearchTerm('');
        setActiveType(null);
    }

    return (
        <div className="bg-gray-900 text-white min-h-[90vh] flex flex-col">
            <main className="p-6 flex-grow flex flex-col overflow-hidden">
                <div className="mb-4 flex justify-center space-x-2">
                    {Array.from({length: NUM_GAMES}).map((_, idx) => (
                        <button
                            disabled={true}
                            key={idx}
                            onClick={() => {idx <= currentGameIndex && setCurrentGameIndex(idx)}}
                            className={`px-4 py-1 rounded font-bold ${
                                idx === currentGameIndex ? 'bg-blue-600' : 'bg-gray-700'
                            } ${idx !== currentGameIndex && 'opacity-50 cursor-not-allowed'}`}
                        >
                            Game {idx + 1}
                        </button>
                    ))}
                    {currentGameIndex < NUM_GAMES - 1 && (
                        <button
                            onClick={goToNextGame}
                            disabled={!allChampionsSelected(currentGame)}
                            className="ml-4 px-4 py-1 bg-green-600 rounded disabled:opacity-50"
                        >
                            Next Game
                        </button>
                    )}
                </div>

                <div className="flex flex-grow justify-center gap-8 items-stretch max-h-[calc(100vh - 180px)]">
                    <div className="flex flex-col">
                        <div className="w-full text-center text-l font-bold mb-3">
                            {leftTeam ? leftTeam.name : 'Left Team'}
                        </div>
                        <div className="flex">
                            <SelectedChampionsSide champions={currentGame.leftChampions} team={leftTeam}/>
                            <BannedChampionsSide bannedChampions={currentGame.leftBans}/>
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow min-w-[300px] max-w-[800px]">
                        <SearchAndFilters
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            activeType={activeType}
                            onTypeChange={setActiveType}
                            onReset={resetGame}
                        />
                        <div className="flex-grow overflow-y-auto">
                            <ChampionGrid
                                champions={filteredChampions}
                                pastBans={pastBans}
                                onChampionSelect={handleChampionSelect}
                                isLoading={isLoading}
                                leftChampions={currentGame.leftChampions}
                                rightChampions={currentGame.rightChampions}
                                leftBans={currentGame.leftBans}
                                rightBans={currentGame.rightBans}
                                currentTurn={currentTurn}
                                turnOrderCompleted={turnOrderCompleted}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="w-full text-center text-l font-semibold mb-3">
                            {rightTeam ? rightTeam.name : 'Right Team'}
                        </div>
                        <div className="flex">
                            <BannedChampionsSide bannedChampions={currentGame.rightBans}/>
                            <SelectedChampionsSide champions={currentGame.rightChampions} team={rightTeam}/>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default FearlessPractice;
