export const TIERS = [
  { min: 0, label: "No discount yet", discount: 0, freeItems: null },
  { min: 1000, label: "10% OFF", discount: 10, freeItems: null },
  { min: 1500, label: "15% OFF + 1x FREE 5Ah Battery", discount: 15, freeItems: "1x FREE 5Ah Battery" },
  { min: 2000, label: "20% OFF + 2x FREE 5Ah Batteries", discount: 20, freeItems: "2x FREE 5Ah Batteries" },
];

export const MIN_BATTERIES = 2;
export const MIN_CHARGERS = 1;

export const getTier = (subtotal) => {
  let tier = TIERS[0];
  for (const t of TIERS) {
    if (subtotal >= t.min) tier = t;
  }
  return tier;
};

export const getNextTier = (subtotal) => {
  for (const t of TIERS) {
    if (subtotal < t.min) return t;
  }
  return null;
};

export const calcDiscount = (subtotal, tier) => subtotal * (tier.discount / 100);
