"use client";

import { useQuery } from "@apollo/client";
import { ME_QUERY } from "@/app/api/graphql/queries";

export default function GatherPage() {
  const { data, loading } = useQuery(ME_QUERY);

  if (loading) return <p>Loading...</p>;

  const activeCharacter = data?.me?.activeCharacter;
  console.log(data)

  if (!activeCharacter) {
    return <p>Please select a character from the Game Dashboard.</p>;
  }

  return (
    <div>
      <h1>Gather Resources</h1>
      <p>Active Character: {activeCharacter.name}</p>
    </div>
  );
}
