"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ME_QUERY } from "@/app/api/graphql/queries";
import { PURCHASE_POTION_MUTATION } from "@/app/api/graphql/mutations";

const Shop = () => {
  const { data, loading, refetch } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
  });
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState("");
  const [purchasePotion] = useMutation(PURCHASE_POTION_MUTATION);

  const toggleModal = () => setModalOpen(!isModalOpen);

  if (loading) return <p>Loading...</p>;

  const activeCharacter = data?.me?.activeCharacter;

  const availableTiers = [];
  if (activeCharacter?.armor) {
    const armorValues = Object.entries(activeCharacter.armor)
      .filter(([key]) => key !== "__typename")
      .map(([_, value]) => value);

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

  const handlePurchase = async () => {
    try {
      const { data } = await purchasePotion({
        variables: {
          characterId: activeCharacter.id,
          tier: selectedTier,
          quantity: parseInt(quantity),
        },
      });

      setPurchaseMessage(data?.purchasePotion || "Unknown error");
      await refetch();
      toggleModal();
    } catch (error) {
      console.error("Error purchasing potion:", error.message);
      setPurchaseMessage("An error occurred while processing your purchase.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Shop</h2>

      {purchaseMessage && (
        <div className="mb-4 p-4 bg-green-200 text-green-800 rounded">
          {purchaseMessage}
        </div>
      )}

      <div className="flex justify-between items-start">
        <div className="mb-4">
          <div className="mb-2 p-4 bg-primary rounded shadow-md mr-5">
            <p className="text-yellow-400 text-2xl font-semibold">
              Gold: {activeCharacter.gold}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            {availableTiers.map((tier) => (
              <button
                key={tier}
                className="px-4 py-2 bg-secondary text-white rounded hover:bg-primary"
                onClick={() => {
                  setSelectedTier(tier);
                  toggleModal();
                }}
              >
                Tier {tier} Potion - {50 * tier} Gold
              </button>
            ))}
          </div>
        </div>

        <div className="border rounded p-4 bg-gray-100 shadow-md w-1/4">
          <h3 className="text-lg font-semibold mb-2">Potion Inventory:</h3>
          <ul>
            {Object.entries(activeCharacter.potionBag || {})
              .filter(([key, count]) => key !== "__typename" && count > 0)
              .map(([tier, count]) => {
                const formattedTier = tier.replace(/tier(\d+)/i, "Tier $1");
                return (
                  <li key={tier}>
                    {formattedTier}: {count}
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              Purchase Tier {selectedTier} Potion
            </h3>
            <label htmlFor="quantity" className="block mb-2">
              Quantity:
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border rounded px-2 py-1 mb-4 w-full"
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={toggleModal}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handlePurchase}
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
