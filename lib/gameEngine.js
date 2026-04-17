// ─── CAPACITY TABLE ─────────────────────────────────────────
// Level → capacity (for Supplier, Manufacturing, Transport)
const CAPACITY_TABLE = {
  1: 50,
  2: 71,
  3: 96,
  4: 123,
  5: 154,
};

// Level → sales efficiency
const SALES_EFFICIENCY_TABLE = {
  1: 1.0,
  2: 1.1,
  3: 1.2,
  4: 1.3,
  5: 1.4,
};

// Cost to upgrade to next level
const UPGRADE_COSTS = {
  2: 80,
  3: 120,
  4: 180,
  5: 260,
};

const MAX_LEVEL = 5;
const MAX_CARRYOVER = 200;
const ROUND_CAPITAL = 100;

// ─── GET CAPACITY / EFFICIENCY ──────────────────────────────

function getCapacity(level) {
  return CAPACITY_TABLE[Math.min(level, MAX_LEVEL)] || 50;
}

function getSalesEfficiency(level) {
  return SALES_EFFICIENCY_TABLE[Math.min(level, MAX_LEVEL)] || 1.0;
}

function getUpgradeCost(currentLevel) {
  const nextLevel = currentLevel + 1;
  if (nextLevel > MAX_LEVEL) return Infinity;
  return UPGRADE_COSTS[nextLevel];
}

// ─── PROCESS INVESTMENTS ────────────────────────────────────

function processInvestments(players) {
  return players.map((player) => {
    let { level, capital, currentInvestment } = player;

    // Spend investment
    capital -= currentInvestment;
    let investPool = currentInvestment;

    // Try to upgrade
    while (investPool > 0 && level < MAX_LEVEL) {
      const cost = getUpgradeCost(level);
      if (investPool >= cost) {
        investPool -= cost;
        level += 1;
      } else {
        break; // not enough to upgrade — leftover is lost (spent on partial improvements)
      }
    }

    // Add next round's capital (capped at MAX_CARRYOVER)
    capital = Math.min(capital + ROUND_CAPITAL, MAX_CARRYOVER);

    return { ...player, level, capital };
  });
}

// ─── CALCULATE ROUND ────────────────────────────────────────

function calculateRound(players, demand) {
  const supplier = players.find((p) => p.role === "Supplier");
  const manufacturing = players.find((p) => p.role === "Manufacturing");
  const transport = players.find((p) => p.role === "Transport");
  const sales = players.find((p) => p.role === "Sales");

  const supplierCap = getCapacity(supplier ? supplier.level : 1);
  const manufacturingCap = getCapacity(manufacturing ? manufacturing.level : 1);
  const transportCap = getCapacity(transport ? transport.level : 1);
  const salesEff = getSalesEfficiency(sales ? sales.level : 1);

  const capacities = { Supplier: supplierCap, Manufacturing: manufacturingCap, Transport: transportCap };

  // Production = min of supply chain capacities
  let unitsProduced = Math.min(supplierCap, manufacturingCap, transportCap);

  // Imbalance penalty
  const maxCap = Math.max(supplierCap, manufacturingCap, transportCap);
  const minCap = Math.min(supplierCap, manufacturingCap, transportCap);
  const imbalanced = maxCap > 1.5 * minCap;

  if (imbalanced) {
    unitsProduced = Math.floor(unitsProduced * 0.9);
  }

  // Sales
  const unitsSold = Math.min(unitsProduced, Math.floor(demand * salesEff));

  // Metrics
  const excessUnits = Math.max(0, unitsProduced - demand);
  const unmetDemand = Math.max(0, demand - unitsSold);

  // Score
  const roundScore = (1 * unitsSold) - (2 * unmetDemand) - (1 * excessUnits);

  // Find bottleneck (lowest capacity role)
  let bottleneck = "Supplier";
  let lowestCap = supplierCap;
  if (manufacturingCap < lowestCap) { bottleneck = "Manufacturing"; lowestCap = manufacturingCap; }
  if (transportCap < lowestCap) { bottleneck = "Transport"; }
  if (unitsSold < unitsProduced) { bottleneck = "Sales"; }

  return {
    demand,
    capacities,
    salesEfficiency: salesEff,
    unitsProduced,
    unitsSold,
    excessUnits,
    unmetDemand,
    roundScore,
    imbalanced,
    bottleneck,
  };
}

module.exports = {
  CAPACITY_TABLE,
  SALES_EFFICIENCY_TABLE,
  UPGRADE_COSTS,
  MAX_LEVEL,
  MAX_CARRYOVER,
  ROUND_CAPITAL,
  getCapacity,
  getSalesEfficiency,
  getUpgradeCost,
  processInvestments,
  calculateRound,
};
