"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/app/api/graphql/queries";
import MobBattle from "@/components/MobBattle";
import { Tier1Mob, Tier2Mob, Tier3Mob, Tier4Mob, Tier5Mob, Tier6Mob, Tier7Mob, Tier8Mob, Tier9Mob, Tier10Mob } from "@/models/enemies/Mob";

const getMob = (tier) => {
  switch (tier) {
    case 1:
      return new Tier1Mob();
    case 2:
      return new Tier2Mob();
    case 3:
      return new Tier3Mob();
    case 4:
      return new Tier4Mob();
    case 5:
      return new Tier5Mob();
    case 6:
      return new Tier6Mob();
    case 7:
      return new Tier7Mob();
    case 8:
      return new Tier8Mob();
    case 9:
      return new Tier9Mob();
    case 10:
      return new Tier10Mob();
    default:
      return null;
  }
};

const MobGrind = () => {
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

  const mob = selectedTier ? getMob(selectedTier) : null;
  console.log("🚀 ~ MobGrind ~ mob:", mob)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mob Grind</h2>

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
            <MobBattle
              character={{
                ...activeCharacter,
                maxHealth: activeCharacter.health,
                maxResource: activeCharacter.castingResource,
              }}
              mob={{
                tier: mob?.tier,
                health: mob?.health,
                maxHealth:mob?.health,
                castingResource: mob?.castingResource,
                skill2: mob?.skill2(),
                power: mob?.power,
                preparedness: mob?.preparedness,
              }}
              onClose={toggleModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobGrind;
