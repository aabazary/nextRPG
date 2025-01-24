"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ME_QUERY } from "@/app/api/graphql/queries";
import { UPGRADE_GEAR_MUTATION } from "@/app/api/graphql/mutations";

const Upgrade = () => {
  const { data, loading, refetch } = useQuery(ME_QUERY, { fetchPolicy: "network-only" });
  const [upgradeGear] = useMutation(UPGRADE_GEAR_MUTATION);
  const [selectedGear, setSelectedGear] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  if (loading) return <p>Loading...</p>;

  const activeCharacter = data?.me?.activeCharacter;

  const requiredResources = (tier) => ({
    TierA: 20,
    TierB: 20,
    TierC: 20,
  });

  const canUpgrade = (gearType, targetTier) => {
    const resources = requiredResources(targetTier);
    const inventory = activeCharacter.inventory;

    return (
      inventory[`Tier${targetTier}ResourceA`] >= resources.TierA &&
      inventory[`Tier${targetTier}ResourceB`] >= resources.TierB &&
      inventory[`Tier${targetTier}ResourceC`] >= resources.TierC
    );
  };

  const handleUpgrade = async () => {
    try {
      const { data } = await upgradeGear({
        variables: {
          characterId: activeCharacter.id,
          gearType: selectedGear.gearType,
          tier: selectedGear.targetTier,
        },
      });

      setUpgradeMessage(data?.upgradeGear || "Unknown error occurred");
      await refetch();
      setConfirmModal(false);
    } catch (error) {
      console.error("Error upgrading gear:", error.message);
      setUpgradeMessage("An error occurred while upgrading gear.");
    }
  };

  const customSort = (a, b) => {
    const isTierA = a.startsWith("Tier");
    const isTierB = b.startsWith("Tier");

    if (isTierA && isTierB) {
      const numA = parseInt(a.replace("Tier", ""), 10);
      const numB = parseInt(b.replace("Tier", ""), 10);
      return numA - numB;
    }

    return a.localeCompare(b);
  };

  const sortedInventory = Object.keys(activeCharacter.inventory)
    .filter((key) => activeCharacter.inventory[key] > 0)
    .sort(customSort)
    .map((key) => ({
      name: key,
      quantity: activeCharacter.inventory[key],
    }));

  const formatKey = (key) =>
    key
      .replace(/([A-Z])/g, " $1") // Add spaces before capital letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .replace("ChestPiece", "Chest Piece"); // Special case for chestPiece

  return (
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4">Current Gear:</h3>
        <ul className="bg-gray-100 border rounded p-4">
          {Object.entries(activeCharacter.armor || {})
            .filter(([key]) => key !== "__typename")
            .map(([gearType, tier]) => (
              <li key={gearType} className="flex items-center justify-between mb-2">
                <span>
                  {formatKey(gearType)}: Tier {tier}
                </span>
                {canUpgrade(gearType, tier + 1) ? (
                  <button
                    className="px-4 py-2 bg-secondary text-white rounded hover:bg-primary"
                    onClick={() => {
                      setSelectedGear({ gearType, targetTier: tier + 1 });
                      setConfirmModal(true);
                    }}
                  >
                    Upgrade to Tier {tier + 1}
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                    disabled
                  >
                    Not Enough Resources
                  </button>
                )}
              </li>
            ))}
        </ul>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4">Inventory:</h3>
        <div className="bg-gray-100 border rounded p-4">
          <ul>
            {sortedInventory.map((item) => (
              <li key={item.name} className="mb-2">
                {formatKey(item.name)}: {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              Confirm Upgrade: {formatKey(selectedGear.gearType)} to Tier {selectedGear.targetTier}
            </h3>
            <p>Are you sure you want to upgrade this gear?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={() => setConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleUpgrade}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upgrade;
