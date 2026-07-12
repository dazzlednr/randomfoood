import { ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark"><ChefHat size={24} /></span>
        <span>오늘 뭐 먹지?</span>
      </Link>
    </header>
  );
}
