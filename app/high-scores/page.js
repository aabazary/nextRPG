"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  TOP_CHARACTERS_EXPERIENCE,
  TOP_CHARACTERS_SCORE,
  TOP_CHARACTERS_MOBS_KILLED,
  TOP_CHARACTERS_QUESTS_COMPLETED,
  TOP_CHARACTERS_GATHERING,
  TOP_USERS_SCORE,
  CLASS_DISTRIBUTION,
} from "@/app/api/graphql/queries";
ChartJS.register(ArcElement, Tooltip, Legend);
const HighScores = () => {
  // Fetch all the data for the tables and pie chart
  const { data: experienceData } = useQuery(TOP_CHARACTERS_EXPERIENCE);
  const { data: scoreData } = useQuery(TOP_CHARACTERS_SCORE);
  const { data: mobsKilledData } = useQuery(TOP_CHARACTERS_MOBS_KILLED);
  const { data: questsCompletedData } = useQuery(
    TOP_CHARACTERS_QUESTS_COMPLETED
  );
  const { data: gatheringData } = useQuery(TOP_CHARACTERS_GATHERING);
  const { data: usersScoreData } = useQuery(TOP_USERS_SCORE);
  const { data: classDistributionData } = useQuery(CLASS_DISTRIBUTION);

  // Format data for the pie chart
  const pieChartData = classDistributionData
    ? {
        labels: ["Warriors", "Mages", "Hunters"],
        datasets: [
          {
            data: [
              classDistributionData.classDistribution.warriors,
              classDistributionData.classDistribution.mages,
              classDistributionData.classDistribution.hunters,
            ],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      }
    : null;

  const mappedExperience = experienceData?.topByExperience.map((char) => ({
    name: char.name,
    experience: char.experience,
  }));

  const mappedScore = scoreData?.topByScore.map((char) => ({
    name: char.name,
    score: char.score,
  }));

  const mappedMobsKilled = mobsKilledData?.topByMobsKilled.map((char) => ({
    name: char.name,
    mobsKilled: char.progress.mobsKilled,
  }));

  const mappedQuestsCompleted = questsCompletedData?.topByQuestsCompleted.map(
    (char) => ({
      name: char.name,
      questsCompleted: char.progress.questsCompleted,
    })
  );

  const mappedGathering = gatheringData?.topByGathering.map((char) => ({
    name: char.name,
    gatherings: char.progress.gatherings,
  }));

  const mappedCumulativeScore = usersScoreData?.topUsersByScore.map((user) => ({
    username: user.username,
    totalScore: user.totalScore,
  }));

  const renderTable = (data) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item.name || item.username}>
              <td>{item.name || item.username}</td>
              <td>
                {item.experience ||
                  item.score ||
                  item.mobsKilled ||
                  item.questsCompleted ||
                  item.gatherings ||
                  item.totalScore ||
                  0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="high-score-page">
      <h1>High Scores</h1>
      <div className="tables">
        <div className="table"><h2>Top Experience</h2>{renderTable(mappedExperience)}</div>
        <div className="table"><h2>Top Score</h2>{renderTable(mappedScore)}</div>
        <div className="table"><h2>Top Quests Completed</h2>{renderTable(mappedQuestsCompleted)}</div>
        <div className="table"><h2>Top Mobs Killed</h2>{renderTable(mappedMobsKilled)}</div>
        <div className="table"><h2>Top Gatherers</h2>{renderTable(mappedGathering)}</div>
        <div className="table"><h2>Top User Total Score</h2>{renderTable(mappedCumulativeScore)}</div>
      </div>
      <div className="chart">
        <h3>Class Distribution</h3>
        {pieChartData ? (
          <Pie
            data={pieChartData}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const value = tooltipItem.raw;
                      const total =
                        classDistributionData.classDistribution.warriors +
                        classDistributionData.classDistribution.mages +
                        classDistributionData.classDistribution.hunters;
                      const percentage = ((value / total) * 100).toFixed(2);
                      return `${value} (${percentage}%)`;
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default HighScores;
