export default function GameDashboardLayout({ children }) {
    return (
      <div>
        <nav className="flex space-x-4 border-b pb-2">
          <a href="/game-dashboard">Profile</a>
          <a href="/game-dashboard/gather">Gather</a>
          <a href="/game-dashboard/mob-grind">Mob Grind</a>
          <a href="/game-dashboard/quest">Quest</a>
          <a href="/game-dashboard/shop">Shop</a>
          <a href="/game-dashboard/upgrade">Upgrade</a>
        </nav>
        <div className="mt-4">{children}</div>
      </div>
    );
  }
  