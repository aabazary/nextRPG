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
  const { data, loading, refetch } = useQuery(ME_QUERY, { fetchPolicy: "network-only" });
  const [createCharacter] = useMutation(CREATE_CHARACTER_MUTATION, {
    onCompleted: () => refetch(),
  });
  const [setActiveCharacter] = useMutation(SET_ACTIVE_CHARACTER_MUTATION, {
    onCompleted: () => refetch(),
  });
  const [deleteCharacter] = useMutation(DELETE_CHARACTER_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterClass, setNewCharacterClass] = useState("Warrior");
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  if (loading) return <p className="text-primary">Loading...</p>;

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
      setModalOpen(false);
      setNewCharacterName("");
      setNewCharacterClass("Warrior");
    } catch (err) {
      console.error("Error creating character:", err);
    }
  };

  const handleDeleteCharacter = async () => {
    if (deleteConfirmation !== characterToDelete.name) {
      alert("Character name does not match!");
      return;
    }

    try {
      await deleteCharacter({ variables: { characterId: characterToDelete.id } });
      setDeleteModalOpen(false);
      setCharacterToDelete(null);
      setDeleteConfirmation("");
    } catch (err) {
      console.error("Error deleting character:", err);
    }
  };

  const activeCharacter = data?.me?.activeCharacter;

  return (
    <div>
       <h1 className="text-2xl font-bold mb-4">Gathering Page</h1>
      {/* Banner for Active Character */}
      <section className="mb-6 bg-primary text-textLight p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Current Active Character</h2>
        {activeCharacter ? (
          <p className="text-lg font-medium">
            {activeCharacter.name} ({activeCharacter.class})
          </p>
        ) : (
          <p className="text-secondary">No active character selected.</p>
        )}
      </section>

      {/* Character Cards */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-secondary">Your Characters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.me?.characters.map((char) => (
            <div key={char.id} className="bg-primaryLight p-4 rounded shadow">
              <h3 className="text-lg font-bold mb-2 text-secondary">
                {char.name} ({char.class})
              </h3>
              <p className="text-sm text-secondary mb-4">Level: {char.level}</p>
              <div className="flex gap-4">
                <button
                  className="px-4 py-2 bg-secondary text-textLight rounded hover:bg-primary transition"
                  onClick={() => setActiveCharacter({ variables: { characterId: char.id } })}
                >
                  Set Active
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-textLight rounded hover:bg-red-600 transition"
                  onClick={() => {
                    setCharacterToDelete(char);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Button to Create a New Character */}
      <button
        className="px-6 py-3 bg-secondary text-textLight rounded hover:bg-primary transition"
        onClick={() => setModalOpen(true)}
      >
        Create New Character
      </button>

      {/* Create Character Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-textLight hover:text-gray-200"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-secondary">Create New Character</h2>
            <div className="mb-4">
              <label className="block text-secondary mb-2">Character Name</label>
              <input
                type="text"
                value={newCharacterName}
                onChange={(e) => setNewCharacterName(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-primaryHover"
              />
            </div>
            <div className="mb-6">
              <label className="block text-secondary mb-2">Character Class</label>
              <select
                value={newCharacterClass}
                onChange={(e) => setNewCharacterClass(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-primaryHover"
              >
                <option value="Warrior">Warrior</option>
                <option value="Mage">Mage</option>
                <option value="Hunter">Hunter</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-secondary text-textLight rounded hover:bg-primary transition"
                onClick={handleCreateCharacter}
              >
                Create
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-textLight rounded hover:bg-gray-600 transition"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-textLight hover:text-gray-200"
              onClick={() => setDeleteModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-secondary">Confirm Delete</h2>
            <p className="text-secondary mb-4">
              Are you sure you want to delete <strong>{characterToDelete?.name}</strong>? This action
              cannot be undone.
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={`Type "${characterToDelete?.name}" to confirm`}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-primaryHover mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-textLight rounded hover:bg-red-600 transition"
                onClick={handleDeleteCharacter}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-textLight rounded hover:bg-gray-600 transition"
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
