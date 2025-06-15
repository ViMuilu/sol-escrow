import React, { useEffect } from "react";

export const FIAT_OPTIONS = [
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British Pound" },
];

type Props = {
  fiat: string;
  setFiat: (fiat: string) => void;
  solPrice: number | null;
  setSolPrice: (price: number | null) => void;
};

const FiatSelector: React.FC<Props> = ({
  fiat,
  setFiat,
  solPrice,
  setSolPrice,
}) => {
  useEffect(() => {
    let cancelled = false;
    const fetchPrice = async () => {
      try {
        const proxy = "https://corsproxy.io/?";
        const url = `${proxy}https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=${fiat.toLowerCase()}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled) {
          setSolPrice(data.solana?.[fiat.toLowerCase()] ?? null);
        }
      } catch {
        if (!cancelled) setSolPrice(null);
      }
    };
    fetchPrice();
    return () => {
      cancelled = true;
    };
  }, [fiat, setSolPrice]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <select
        value={fiat}
        onChange={(e) => setFiat(e.target.value)}
        style={{ fontSize: 16, padding: "2px 8px" }}
      >
        {FIAT_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.code}
          </option>
        ))}
      </select>
      <span style={{ fontSize: 14, color: "#888" }}>
        {solPrice !== null
          ? `1 SOL ≈ ${solPrice.toLocaleString(undefined, {
              style: "currency",
              currency: fiat,
            })}`
          : "Loading..."}
      </span>
    </div>
  );
};

export default FiatSelector;
