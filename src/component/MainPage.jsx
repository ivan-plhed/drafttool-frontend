import {useState} from "react";
import FearlessPractice from "@/component/FearlessPractice.jsx";
import TeamSelector from "@/component/TeamSelector.jsx";

function MainPage({ resetTeams, loggedIn}) {
    const [teamsSelected, setTeamsSelected] = useState(false);
    const [leftTeam, setLeftTeam] = useState(null);
    const [rightTeam, setRightTeam] = useState(null);

    const handleTeamsSelected = (left, right) => {
        setLeftTeam(left);
        setRightTeam(right);
        resetTeams(setTeamsSelected);
        setTeamsSelected(true);
    };

    return (
        <>
            {teamsSelected ? (
                <FearlessPractice leftTeam={leftTeam} rightTeam={rightTeam} />
            ) : (
                <TeamSelector loggedIn={loggedIn} onTeamsSelected={handleTeamsSelected} />
            )}
        </>
    );
}

export default MainPage;