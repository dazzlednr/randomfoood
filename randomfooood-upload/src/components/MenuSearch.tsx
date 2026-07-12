import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { menus } from "../data/menus";
import { formatPrice } from "../utils/price";

export function MenuSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return menus.filter((menu) => [menu.name, menu.description, ...menu.keywords].join(" ").toLowerCase().includes(q)).slice(0, 12);
  }, [query]);

  return (
    <section className="search-section">
      <label className="search-box">
        <Search size={18} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="매운, 국물, 혼밥, 치즈, 고기, 가벼운" />
      </label>
      {results.length > 0 && (
        <div className="search-results">
          {results.map((menu) => (
            <article key={menu.id} className="search-item">
              <strong>{menu.emoji} {menu.name}</strong>
              <p>{menu.description}</p>
              <div>
                <span>{formatPrice(menu.priceMin, menu.priceMax)}</span>
                <span>포만감 {menu.fullness}/5</span>
                <span>건강도 {menu.healthiness}/5</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
