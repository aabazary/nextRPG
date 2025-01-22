"use client";
import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  COMPLETE_MOB_TASK_MUTATION,
  USE_POTION_MUTATION,
} from "@/app/api/graphql/mutations";
import { ME_QUERY } from "@/app/api/graphql/queries";

const MobBattle = ({ character, mob, onClose }) => {
  const [characterHealth, setCharacterHealth] = useState(character.health);
  const [characterResource, setCharacterResource] = useState(0);
  const [mobHealth, setMobHealth] = useState(mob.health);
  const [logs, setLogs] = useState([]);
  const [turn, setTurn] = useState(
    character.preparedness > mob.preparedness ? "character" : "mob"
  );
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [showPotionBag, setShowPotionBag] = useState(false);
  const logContainerRef = useRef(null);

  const { data, refetch } = useQuery(ME_QUERY);

  const [completeMobTask] = useMutation(COMPLETE_MOB_TASK_MUTATION);
  const [usePotion] = useMutation(USE_POTION_MUTATION);

  const addLog = (message, isCharacter) => {
    setLogs((prevLogs) => [...prevLogs, { message, isCharacter }]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleAttack = (type) => {
    if (turn === "character") {
      let damage = 0;

      switch (type) {
        case "normal":
          damage = Math.round(character.power);
          break;
        case "strong":
          if (characterResource >= 30) {
            damage = Math.round(
              character.power * (Math.random() * (2 - 1) + 1)
            );
            setCharacterResource(characterResource - 30);
          } else {
            addLog("Not enough resources for a strong attack!", true);
            return;
          }
          break;
        case "ultimate":
          if (characterResource >= 100) {
            damage = Math.round(character.power * 4);
            setCharacterResource(characterResource - 100);
          } else {
            addLog("Not enough resources for an ultimate attack!", true);
            return;
          }
          break;
        default:
          break;
      }

      setMobHealth((prev) => Math.max(prev - damage, 0));
      addLog(`Character used ${type} attack and dealt ${damage} damage.`, true);
      if (mobHealth - damage <= 0) {
        setIsBattleOver(true);
        addLog("You have defeated the mob!", true);

        completeMobTask({
          variables: {
            characterId: character.id,
            tier: mob.tier,
            successful: true,
          },
        });
      } else {
        setTurn("mob");
      }
    }
  };

  useEffect(() => {
    if (turn === "mob" && mobHealth > 0) {
      setButtonsDisabled(true);
      const timer = setTimeout(() => {
        let damage = 0;
        let action = "";
        let randomValue= Math.random()
        if (mob.preparedness > character.preparedness) {
          damage = Math.round(mob.power * 40000);
          action = "ultimate attack";
        } else if (randomValue>0.5) {
          damage = Math.round(mob.power * (Math.random() * (2 - 1) + 1));
          action = mob.skill2;
        } else {
          damage = Math.round(mob.power);
          action = "normal attack";
        } 

        setCharacterHealth((prev) => Math.max(prev - damage, 0));
        addLog(`Mob used ${action} and dealt ${damage} damage.`, false);

        if (characterHealth - damage <= 0) {
          setIsBattleOver(true);
          addLog("You have been defeated!", false);
        } else {
          setCharacterResource((prev) =>
            Math.min(prev + 30, character.maxResource)
          );
          setTurn("character");
          setButtonsDisabled(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [turn]);

  const handleUsePotion = async (tier) => {
    const tierValue = parseInt(tier.slice(4));
    const potionBag = data?.me?.activeCharacter?.potionBag || {};
    const currentCount = potionBag[tier] || 0;

    if (currentCount <= 0) {
      addLog(`No tier ${tierValue} potions available to use.`, true);
      return;
    }

    const healing = 20 + 5 * tierValue;
    setCharacterHealth((prev) => Math.min(prev + healing, character.maxHealth));
    addLog(
      `Character used a tier ${tierValue} potion and healed ${healing} health.`,
      true
    );

    await usePotion({
      variables: { characterId: character.id, tier: tierValue },
    });
    refetch();
    setShowPotionBag(false);
  };

  const handleReplay = () => {
    setCharacterHealth(character.health);
    setCharacterResource(0);
    setMobHealth(mob.health);
    setLogs([]);
    setTurn(character.preparedness > mob.preparedness ? "character" : "mob");
    setIsBattleOver(false);
    setButtonsDisabled(false);
  };

  return (
    <div>
      <div className="character-stats mb-4">
        <h6 className="text-lg font-bold">Character</h6>
        <p>
          Health: {characterHealth}/{character.maxHealth}
        </p>
        <p>
          Resource: {characterResource}/{character.maxResource}
        </p>
        <p>Turn: {turn === "character" ? "Your Turn" : "Mob's Turn"}</p>
      </div>
      <hr />
      <div className="mob-stats mb-4">
        <h6 className="text-lg font-bold">Mob</h6>
        <p>
          Health: {mobHealth}/{mob.maxHealth}
        </p>
      </div>
      {!isBattleOver ? (
        <>
          <div>
            <h6 className="text-lg font-bold">Actions</h6>
            {turn === "character" && (
              <div className="actions">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded mr-2"
                  onClick={() => handleAttack("normal")}
                  disabled={buttonsDisabled}
                >
                  Normal Attack
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
                  onClick={() => handleAttack("strong")}
                  disabled={buttonsDisabled}
                >
                  Strong Attack
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded"
                  onClick={() => handleAttack("ultimate")}
                  disabled={buttonsDisabled}
                >
                  Ultimate Attack
                </button>
                <button
                  className="px-4 py-2 bg-yellow-600 text-white rounded ml-2"
                  onClick={() => setShowPotionBag(!showPotionBag)}
                  disabled={buttonsDisabled}
                >
                  Use Item
                </button>
              </div>
            )}
          </div>
{showPotionBag && (
  <div className="potion-bag mt-4">
    <h6 className="text-lg font-bold">Potion Bag</h6>
    {Object.entries(data?.me?.activeCharacter?.potionBag || {})
      .filter(([key, count]) => key !== "__typename" && count > 0)
      .map(([tier, count]) => (
        <button
          key={tier}
          className="px-4 py-2 bg-orange-600 text-white rounded mr-2 mt-2"
          onClick={() => handleUsePotion(tier)}
        >
          Tier {parseInt(tier.slice(4))} Potion ({count})
        </button>
      ))}
    {Object.entries(data?.me?.activeCharacter?.potionBag || {})
      .filter(([key]) => key !== "__typename")
      .every(([_, count]) => count === 0) && <p>No potions available!</p>}
  </div>
)}

        </>
      ) : (
        <div className="mt-4">
          <h6 className="text-lg font-bold">
            {mobHealth === 0 ? "Victory!" : "Defeat!"}
          </h6>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded mr-2"
            onClick={onClose}
          >
            Return to Mob Grind
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleReplay}
          >
            Replay
          </button>
        </div>
      )}
      <div className="mt-4">
        <h6 className="text-lg font-bold">Battle Logs</h6>
        <div
          ref={logContainerRef}
          className="h-32 overflow-y-auto border rounded p-2 bg-gray-100"
          style={{ maxHeight: "200px" }}
        >
          {logs.map((log, index) => (
            <p
              key={index}
              className={log.isCharacter ? "text-green-600" : "text-red-600"}
            >
              {log.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobBattle;
