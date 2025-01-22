"use client";
import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  COMPLETE_BOSS_TASK_MUTATION,
  USE_POTION_MUTATION,
} from "@/app/api/graphql/mutations";
import { ME_QUERY } from "@/app/api/graphql/queries";

const BossBattle = ({ character, boss, onClose }) => {
  const [characterHealth, setCharacterHealth] = useState(character.health);
  const [characterResource, setCharacterResource] = useState(0);
  const [bossHealth, setBossHealth] = useState(boss.health);
  const [logs, setLogs] = useState([]);
  const [turn, setTurn] = useState(
    character.preparedness > boss.preparedness ? "character" : "boss"
  );
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [showPotionBag, setShowPotionBag] = useState(false);
  const logContainerRef = useRef(null);

  // State for questions
  const [showQuestions, setShowQuestions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const questions = boss?.getQuestions; // Assuming boss has a method to fetch questions.

  const { data, refetch } = useQuery(ME_QUERY);
  const [completeBossTask] = useMutation(COMPLETE_BOSS_TASK_MUTATION);
  const [usePotion] = useMutation(USE_POTION_MUTATION);

  const addLog = (message, isCharacter) => {
    setLogs((prevLogs) => [...prevLogs, { message, isCharacter }]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleAnswer = (answer) => {
    const correctAnswer = questions[currentQuestionIndex].correct;
    if (answer !== correctAnswer) {
      setIsBattleOver(true);
    }

    if (answer === correctAnswer) {
      addLog(`Correct answer for question ${currentQuestionIndex + 1}!`, true);
    } else {
      addLog(
        `Wrong answer for question ${
          currentQuestionIndex + 1
        }. Moving to the next question.`,
        true
      );
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowQuestions(false);
      setTurn(
        character.preparedness > boss.preparedness ? "character" : "boss"
      );
    }
  };

  const handleAttack = (type) => {
    if (!showQuestions && turn === "character") {
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

      setBossHealth((prev) => Math.max(prev - damage, 0));
      addLog(`Character used ${type} attack and dealt ${damage} damage.`, true);

      if (bossHealth - damage <= 0) {
        setIsBattleOver(true);
        addLog("You have defeated the Boss!", true);

        completeBossTask({
          variables: {
            characterId: character.id,
            tier: boss.tier,
            successful: true,
          },
        });
      } else {
        setTurn("boss");
      }
    }
  };

  useEffect(() => {
    if (turn === "boss" && bossHealth > 0) {
      setButtonsDisabled(true);
      const timer = setTimeout(() => {
        let damage = 0;
        let action = "";
        const randomValue = Math.random();
        if (boss.preparedness > character.preparedness) {
          damage = Math.round(boss.power * 4);
          action = "ultimate attack";
        } else if (randomValue > 0.5) {
          damage = Math.round(boss.power * (Math.random() * (2 - 1) + 1));
          action = boss.skill2;
        } else {
          damage = Math.round(boss.power);
          action = "normal attack";
        }

        setCharacterHealth((prev) => Math.max(prev - damage, 0));
        addLog(`Boss used ${action} and dealt ${damage} damage.`, false);

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
    setBossHealth(boss.health);
    setLogs([]);
    setTurn(character.preparedness > boss.preparedness ? "character" : "boss");
    setIsBattleOver(false);
    setButtonsDisabled(false);
    setShowQuestions(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
  };

  return (
    <div>
      {showQuestions ? (
        <div>
          <h6 className="text-lg font-bold">Boss Challenge</h6>
          <p>{questions[currentQuestionIndex].question}</p>
          <div>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-blue-500 text-white rounded m-2"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="character-stats mb-4">
            <h6 className="text-lg font-bold">Character</h6>
            <p>
              Health: {characterHealth}/{character.maxHealth}
            </p>
            <p>
              Resource: {characterResource}/{character.maxResource}
            </p>
            <p>Turn: {turn === "character" ? "Your Turn" : "Boss's Turn"}</p>
          </div>
          <hr />
          <div className="boss-stats mb-4">
            <h6 className="text-lg font-bold">Boss</h6>
            <p>
              Health: {bossHealth}/{boss.maxHealth}
            </p>
          </div>

          {isBattleOver ? (
            <div className="mt-4">
              <h6 className="text-lg font-bold">
                {bossHealth === 0
                  ? "Victory!"
                  : "Game Over! You answered incorrectly."}
              </h6>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded mr-2"
                onClick={onClose}
              >
                Return to Quest
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={handleReplay}
              >
                Replay
              </button>
            </div>
          ) : showQuestions ? (
            <div>
              <h6 className="text-lg font-bold">Boss Challenge</h6>
              <p>{questions[currentQuestionIndex].question}</p>
              <div>
                {questions[currentQuestionIndex].options.map(
                  (option, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-blue-500 text-white rounded m-2"
                      onClick={() => handleAnswer(option)}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
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
                    .every(([_, count]) => count === 0) && (
                    <p>No potions available!</p>
                  )}
                </div>
              )}
            </>
          )}

          <div
            ref={logContainerRef}
            className="battle-log mt-4 bg-gray-200 p-4 rounded h-40 overflow-y-auto"
          >
            <h6 className="text-lg font-bold mb-2">Battle Log</h6>
            {logs.map((log, index) => (
              <p
                key={index}
                className={log.isCharacter ? "text-green-700" : "text-red-700"}
              >
                {log.message}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BossBattle;
