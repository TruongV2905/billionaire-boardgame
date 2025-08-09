import { useSelector } from "react-redux";
import PlayerCard from "../components/PlayerCard";
import type { Player } from "../types/player";

function PlayingPage() {
  const players = useSelector((state: any) => state.players);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 mx-2">
      {players.map((player: Player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
}

export default PlayingPage;
