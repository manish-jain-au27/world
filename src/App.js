import React, { useEffect, useState } from "react";
import data from "./data.json";
import "./App.css"; // Import a CSS file for styling

function App() {
  const [uiState, setUiState] = useState("Home");
  const [currentTeam, setCurrentTeam] = useState("");
  const [currentRank, setCurrentRank] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [sortedTeamScore, setSortedTeamScore] = useState({});
  const topTeams = 3; // Number of top teams to congratulate

  useEffect(() => {
    const calculateTeamScores = () => {
      const teamScore = Object.keys(data.teams).reduce((acc, team) => {
        const teamTotalScore = data.teams[team].reduce(
          (total, player) => {
            const playerData = data.players[player];
            if (playerData) {
              return total + playerData[0] + playerData[1] * 20;
            }
            return total;
          },
          0
        );
        return { ...acc, [team]: teamTotalScore };
      }, {});
      const sortedTeams = Object.keys(teamScore).sort(
        (a, b) => teamScore[b] - teamScore[a]
      );
      const sortedTeamScore = sortedTeams.reduce(
        (acc, team, index) => ({ ...acc, [team]: { rank: index + 1, score: teamScore[team] } }),
        {}
      );
      setSortedTeamScore(sortedTeamScore);
    };

    calculateTeamScores();
  }, []);

  const handleTeamClick = (team) => {
    setUiState("Team");
    setCurrentTeam(team);
    setCurrentRank(sortedTeamScore[team].rank);
    setCurrentScore(sortedTeamScore[team].score);
  };

  return (
    <div className="container">
      <header className="company-header">
        <h1>Software by: Riddhi Infotech</h1>
        <p>
          We specialize in creating software solutions, including e-commerce applications,
          advertising platforms, and data security solutions.
        </p>
      </header>
      {uiState === "Home" && (
        <div>
          <h1 className="title">Score Board</h1>
          {/* Congratulations message for top teams */}
          <div className="congratulations">
            {Object.keys(sortedTeamScore)
              .slice(0, topTeams)
              .map((team, index) => (
                <p key={team}>
                  Congratulations to {team} for securing {index + 1} place!
                </p>
              ))}
          </div>
          {/* Fireworks */}
          <div className="fireworks-container">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="firework"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 1 + 0.5}s`,
                }}
              ></div>
            ))}
          </div>
          <table className="score-table">
            <thead>
              <tr>
                <th>Form No.</th>
                <th>Rank</th>
                <th>Team</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(sortedTeamScore).map((team) => (
                <tr key={team}>
                  <td>{data.forms[team]}</td>
                  <td>{sortedTeamScore[team].rank}</td>
                  <td>
                    <a onClick={() => handleTeamClick(team)} className="team-link">
                      {team}
                    </a>
                  </td>
                  <td>{sortedTeamScore[team].score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {uiState === "Team" && (
        <div>
          <h1 className="team-title">{currentTeam}</h1>
          {data.forms[currentTeam] ? (
            <div>
              <table className="team-table">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Runs</th>
                    <th>Wickets</th>
                  </tr>
                </thead>
                <tbody>
                  {data.teams[currentTeam].map((player) => (
                    <tr key={player}>
                      <td>{player}</td>
                      <td>{data.players[player]?.[0]}</td>
                      <td>{data.players[player]?.[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="team-info">
                <p>
                  <b>Rank:</b> {currentRank}
                </p>
                <p>
                  <b>Score:</b> {currentScore}
                </p>
                <p>
                  <b>Form No.:</b> {data.forms[currentTeam]}
                </p>
              </div>
            </div>
          ) : (
            <p className="error-message">Form number not found.</p>
          )}
          <a onClick={() => setUiState("Home")} className="back-link">
            Go Back
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
