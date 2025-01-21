"use client";
import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ME_QUERY } from "@/app/api/graphql/queries";
import { COMPLETE_GATHER_TASK_MUTATION } from "@/app/api/graphql/mutations";
import { useRouter } from "next/navigation";

function GatherPage() {
  const router = useRouter();
  const { data, loading } = useQuery(ME_QUERY, { fetchPolicy: "network-only" });
  const [completeGatherTask] = useMutation(COMPLETE_GATHER_TASK_MUTATION);

  const [gameState, setGameState] = useState({
    miniGameActive: false,
    countdown: 3,
    gameTimer: 5,
    success: null,
    activeButton: null,
    buttonActivated: false,
    gameTier: null,
    gridSize: 0,
  });

  const countdownRef = useRef(null);
  const gameRef = useRef(null);
  const buttonTimeoutRef = useRef(null);

  useEffect(() => {
    if (!loading && !data?.me?.activeCharacter) {
      router.push("/game-dashboard");
    }

    return () => clearTimers();
  }, [loading, data, router]);

  const clearTimers = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (gameRef.current) clearInterval(gameRef.current);
    if (buttonTimeoutRef.current) clearTimeout(buttonTimeoutRef.current);
  };

  const activeCharacter = data?.me?.activeCharacter;

  const availableTiers = [];
  if (activeCharacter?.armor) {
    const armorValues = Object.entries(activeCharacter.armor)
      .filter(([key, value]) => key !== "__typename")
      .map(([key, value]) => value);

    for (let i = 0; i <= 10; i++) {
      const allArmorAboveTier = armorValues.every((armorValue) => armorValue >= i);

      if (allArmorAboveTier) {
        availableTiers.push(i + 1);
      } else {
        break;
      }
    }
  }
  const startMiniGame = (tier) => {
    if (!tier) return;
  
    clearTimers();
  
    const gameTime = 5; 
    const buttonDelay = Math.random() * 4.2; 
  
    setGameState((prevState) => ({
      ...prevState,
      gameTier: tier,
      gridSize: Math.sqrt(tier * tier),
      miniGameActive: true,
      countdown: 3, 
      gameTimer: gameTime, 
      success: null,
      activeButton: null,
      buttonActivated: false,
    }));

    countdownRef.current = setInterval(() => {
      setGameState((prevState) => {
        if (prevState.countdown === 1) {
          clearInterval(countdownRef.current);
          startGameLogic(buttonDelay); 
        }
        return { ...prevState, countdown: prevState.countdown - 1 };
      });
    }, 1000);
  };
  
  const startGameLogic = (buttonDelay) => {
    setGameState((prevState) => ({
      ...prevState,
      gameTimer: 5, 
    }));
  

    buttonTimeoutRef.current = setTimeout(() => {
      const randomButton = Math.floor(Math.random() * (gameState.gridSize * gameState.gridSize));
      setGameState((prevState) => ({
        ...prevState,
        activeButton: randomButton,
        buttonActivated: true,
      }));
  
      setTimeout(() => {
        setGameState((prevState) => ({
          ...prevState,
          activeButton: null,
          buttonActivated: false,
        }));
      }, 800); 
    }, buttonDelay * 1000); 
  
    if (gameRef.current) clearInterval(gameRef.current);
    
    gameRef.current = setInterval(() => {
      setGameState((prevState) => {
        if (prevState.gameTimer <= 1) {
          clearInterval(gameRef.current);
          if (!prevState.success) handleGameEnd(false); 
        }
        return { ...prevState, gameTimer: Math.max(prevState.gameTimer - 0.1, 0) }; 
      });
    }, 100);
  };
  
  const handleButtonClick = (index) => {
    if (index === gameState.activeButton && gameState.buttonActivated) {
      handleGameEnd(true); // Success, end the game
    } else {
      console.log("Incorrect button clicked!");
      handleGameEnd(false); 
    }
  };
  
  const handleGameEnd = (wasSuccessful) => {
    if (gameState.success !== null) return;
  
    clearTimers();
    setGameState((prevState) => ({
      ...prevState,
      success: wasSuccessful,
      miniGameActive: false,
    }));

    if (wasSuccessful) {
      completeGatherTask({
        variables: {
          characterId: activeCharacter.id,
          tier: gameState.gameTier,
          successful: true,
        },
      }).catch((err) => console.error("ApolloError:", err));
    } else {
      showTryAgainModal();
    }
  };
  
  const showTryAgainModal = () => {
    console.log("Try again!");
  };
  

  const handleCloseModal = () => {
    clearTimers();
    setGameState({
      miniGameActive: false,
      countdown: 3,
      gameTimer: 5,
      success: null,
      activeButton: null,
      buttonActivated: false,
      gameTier: null,
      gridSize: 0,
    });
  };

  const handleBackToGathering = () => {
    handleCloseModal();
    router.push("/game-dashboard/gather");
  };

  return (
    <div>
      <h1>Gathering Page</h1>

      <div>
        <h2>Available Gathering Tiers</h2>
        {availableTiers.map((tier) => (
          <button
            key={tier}
            className={`px-4 py-2 bg-blue-500 text-white rounded m-2 ${!availableTiers.includes(tier) ? 'bg-gray-500 cursor-not-allowed' : ''}`}
            onClick={() => startMiniGame(tier)}
            disabled={!availableTiers.includes(tier)} 
          >
            Tier {tier} Gathering
          </button>
        ))}
      </div>

      {gameState.miniGameActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            {gameState.countdown > 0 ? (
              <h2>Game starting in... {gameState.countdown}</h2>
            ) : (
              <div>
                <h2>Click the Correct Button!</h2>
                <div
                  className={`grid grid-cols-${gameState.gridSize} gap-2`}
                  style={{ display: "grid", gridTemplateColumns: `repeat(${gameState.gridSize}, 1fr)` }}
                >
                  {Array.from({ length: gameState.gridSize * gameState.gridSize }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleButtonClick(index)}
                      className={`w-16 h-16 ${index === gameState.activeButton ? "bg-green-500" : "bg-gray-300"} rounded`}
                    >
                      {index === gameState.activeButton ? "Click Me!" : ""}
                    </button>
                  ))}
                </div>
                <h3>Time Remaining: {gameState.gameTimer.toFixed(1)}</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {gameState.success !== null && !gameState.miniGameActive && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            {gameState.success ? (
              <h2>Congratulations! You succeeded!</h2>
            ) : (
              <h2>Try again! You missed the button!</h2>
            )}
            <div className="mt-4 flex gap-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => startMiniGame(gameState.gameTier)}
              >
                Replay
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={handleBackToGathering}
              >
                Back to Gathering Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GatherPage;
