"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ME_QUERY } from "@/app/api/graphql/queries";
import {
  SET_ACTIVE_CHARACTER_MUTATION,
  CREATE_CHARACTER_MUTATION,
  DELETE_CHARACTER_MUTATION,
} from "@/app/api/graphql/mutations";
import withAuth from "@/app/api/graphql/withAuth";

function GameDashboard() {
  const { data, loading, refetch } = useQuery(ME_QUERY, {
    fetchPolicy: "network-only",
  });
  console.log("🚀 ~ GameDashboard ~ data:", data)
  const [createCharacter] = useMutation(CREATE_CHARACTER_MUTATION);
  const [setActiveCharacter] = useMutation(SET_ACTIVE_CHARACTER_MUTATION);
  const [deleteCharacter] = useMutation(DELETE_CHARACTER_MUTATION);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterClass, setNewCharacterClass] = useState("Warrior");
  const [expandedCharacterId, setExpandedCharacterId] = useState(null);
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  if (loading) return <p>Loading...</p>;

  const handleCreateCharacter = async () => {
    if (!newCharacterName) {
      alert("Please enter a character name!");
      return;
    }

    try {
      await createCharacter({
        variables: {
          userId: data.me.id,
          name: newCharacterName,
          class: newCharacterClass,
        },
      });
      await refetch();
      setModalOpen(false);
      setNewCharacterName("");
      setNewCharacterClass("Warrior");
    } catch (err) {
      console.error("Error creating character:", err);
    }
  };

  const handleSelectCharacter = async (characterId) => {
    try {
      await setActiveCharacter({ variables: { characterId } });
      await refetch();
    } catch (err) {
      console.error("Error setting active character:", err);
    }
  };

  const handleDeleteCharacter = async () => {
    if (deleteConfirmation !== characterToDelete.name) {
      alert("Character name does not match!");
      return;
    }

    try {
      await deleteCharacter({ variables: { characterId: characterToDelete.id } });
      await refetch();
      setDeleteModalOpen(false);
      setCharacterToDelete(null);
      setDeleteConfirmation("");
    } catch (err) {
      console.error("Error deleting character:", err);
    }
  };

  const toggleCharacterDetails = (characterId) => {
    setExpandedCharacterId(expandedCharacterId === characterId ? null : characterId);
  };

  const activeCharacter = data?.me?.activeCharacter;

  return (
    <div>
      <h1>Game Dashboard</h1>

      {/* Current Active Character Section */}
      <div>
        <h2>Current Active Character</h2>
        {activeCharacter ? (
          <p>
            {activeCharacter.name} ({activeCharacter.class})
          </p>
        ) : (
          <p>None</p>
        )}
      </div>

      {/* Characters List */}
      <div>
        <h2>Your Characters</h2>
        {data?.me?.characters.map((char) => (
          <div key={char.id}>
            <p
              className="cursor-pointer text-blue-500 underline"
              onClick={() => toggleCharacterDetails(char.id)}
            >
              {char.name} ({char.class})
            </p>
            {expandedCharacterId === char.id && (
              <div className="ml-4">
                <p>Class: {char.class}</p>
                <p>Level: {char.level}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => handleSelectCharacter(char.id)}
                  >
                    Set Active
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => {
                      setCharacterToDelete(char);
                      setDeleteModalOpen(true);
                    }}
                  >
                    Delete Character
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Character Button */}
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => setModalOpen(true)}
      >
        Create New Character
      </button>

      {/* Modal for Creating a Character */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2>Create New Character</h2>
            <div>
              <label>
                Character Name:
                <input
                  type="text"
                  value={newCharacterName}
                  onChange={(e) => setNewCharacterName(e.target.value)}
                  className="border px-2 py-1 ml-2"
                />
              </label>
            </div>
            <div className="mt-4">
              <label>
                Character Class:
                <select
                  value={newCharacterClass}
                  onChange={(e) => setNewCharacterClass(e.target.value)}
                  className="border px-2 py-1 ml-2"
                >
                  <option value="Warrior">Warrior</option>
                  <option value="Mage">Mage</option>
                  <option value="Hunter">Hunter</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleCreateCharacter}
              >
                Create
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Deleting a Character */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete the character{" "}
              <strong>{characterToDelete?.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="mt-4">
              <label>
                Type <strong>{characterToDelete?.name}</strong> to confirm:
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="border px-2 py-1 ml-2"
                />
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDeleteCharacter}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeleteConfirmation("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(GameDashboard);
