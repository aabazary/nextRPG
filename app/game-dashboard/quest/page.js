"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/app/api/graphql/queries";
import BossBattle from "@/components/BossBattle";
import { Tier1Boss, Tier2Boss, Tier3Boss, Tier4Boss, Tier5Boss, Tier6Boss, Tier7Boss, Tier8Boss, Tier9Boss, Tier10Boss } from "@/models/enemies/Boss";

const getBoss = (tier) => {
  switch (tier) {
    case 1:
      return new Tier1Boss();
    case 2:
      return new Tier2Boss();
    case 3:
      return new Tier3Boss();
    case 4:
      return new Tier4Boss();
    case 5:
      return new Tier5Boss();
    case 6:
      return new Tier6Boss();
    case 7:
      return new Tier7Boss();
    case 8:
      return new Tier8Boss();
    case 9:
      return new Tier9Boss();
    case 10:
      return new Tier10Boss();
    default:
      return null;
  }
};

const Quest = () => {
  const { data, loading } = useQuery(ME_QUERY, { fetchPolicy: "network-only" });

  const [selectedTier, setSelectedTier] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  const activeCharacter = data?.me?.activeCharacter;

  const availableTiers = [];
  if (activeCharacter?.armor) {
    const armorValues = Object.entries(activeCharacter.armor)
      .filter(([key, value]) => key !== "__typename")
      .map(([key, value]) => value);

    for (let i = 0; i <= 10; i++) {
      const allArmorAboveTier = armorValues.every(
        (armorValue) => armorValue >= i
      );

      if (allArmorAboveTier) {
        availableTiers.push(i + 1);
      } else {
        break;
      }
    }
  }

  const boss = selectedTier ? getBoss(selectedTier) : null;
  console.log(boss?.getQuestions())
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quest</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        {availableTiers.map((tier) => (
          <button
            key={tier}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              setSelectedTier(tier);
              toggleModal();
            }}
          >
            Tier {tier}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-md p-6">
            <BossBattle
              character={{
                ...activeCharacter,
                maxHealth: activeCharacter.health,
                maxResource: activeCharacter.castingResource,
              }}
              boss={{
                tier: boss?.tier,
                health: boss?.health,
                maxHealth:boss?.health,
                castingResource: boss?.castingResource,
                skill2: boss?.skill2(),
                getQuestions:boss?.getQuestions(),
                power: boss?.power,
                preparedness: boss?.preparedness,
              }}
              onClose={toggleModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Quest;
