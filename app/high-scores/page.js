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
  const { data: experienceData } = useQuery(TOP_CHARACTERS_EXPERIENCE);
  const { data: scoreData } = useQuery(TOP_CHARACTERS_SCORE);
  const { data: mobsKilledData } = useQuery(TOP_CHARACTERS_MOBS_KILLED);
  const { data: questsCompletedData } = useQuery(TOP_CHARACTERS_QUESTS_COMPLETED);
  const { data: gatheringData } = useQuery(TOP_CHARACTERS_GATHERING);
  const { data: usersScoreData } = useQuery(TOP_USERS_SCORE);
  const { data: classDistributionData } = useQuery(CLASS_DISTRIBUTION);

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

  const renderTable = (data, title) => (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <table className="min-w-full text-left text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index} className="odd:bg-gray-50 even:bg-white">
              <td className="border border-gray-300 px-4 py-2">
                {item.name || item.username}
              </td>
              <td className="border border-gray-300 px-4 py-2">
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
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">High Scores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderTable(mappedExperience, "Top Experience")}
        {renderTable(mappedScore, "Top Score")}
        {renderTable(mappedQuestsCompleted, "Top Quests Completed")}
        {renderTable(mappedMobsKilled, "Top Mobs Killed")}
        {renderTable(mappedGathering, "Top Gatherers")}
        {renderTable(mappedCumulativeScore, "Top User Total Score")}
      </div>
      <div className="mt-8 p-4 bg-white rounded shadow-md text-center">
        <h3 className="text-lg font-semibold mb-4">Class Distribution</h3>
        {pieChartData ? (
          <div className="flex justify-center">
            <div className="w-64 h-64">
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
            </div>
          </div>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default HighScores;
