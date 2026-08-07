const STORAGE_KEY = 'ascension_ii_optimizer_data';
let currentTab = '';

// ============================================================================
// 1. REGISTRATION SYSTEM
// ============================================================================

const runeCategories = {};
const runeDatabase = {};

const buffColorMap = {
  "snow": "#38bdf8", "points": "#ffffff", "flux": "#fbbf24", "voltage": "#f87171",
  "damage": "#f87171", "fire": "#f87171", "particles": "#38bdf8", "tokens": "#38bdf8",
  "pulse": "#34d399", "cactus": "#34d399", "luck": "#34d399", "bulk": "#fbbf24",
  "speed": "#38bdf8", "plasma": "#c084fc", "shards": "#c084fc", "magma": "#fb923c",
  "sand": "#fbbf24"
};

function registerCategory(id, displayName) {
  runeCategories[id] = displayName;
  runeDatabase[id] = [];
  if (!currentTab) currentTab = id;
}

function addRune(categoryId, config) {
  if (!runeDatabase[categoryId]) return;

  const processedBuffs = (config.buffs || []).map(function(b) {
    if (typeof b === 'object' && b.text) return b;
    let color = "#ffffff";
    const lower = String(b).toLowerCase();
    
    for (let key in buffColorMap) {
      if (lower.includes(key)) {
        color = buffColorMap[key];
        break;
      }
    }
    return { text: String(b), color: color };
  });

  const baseChance = config.chance || config.baseChance || 1;
  const isDeity = config.type === "Deity";

  runeDatabase[categoryId].push({
    name: config.name || "UNKNOWN",
    type: config.type || "Basic",
    baseChance: baseChance,
    luckOnChance: config.luckOnChance || (isDeity ? baseChance * 10 : baseChance),
    colorClass: "color-" + (config.color || "white"),
    buffs: processedBuffs
  });
}

// ============================================================================
// 2. RUNES DATABASE
// ============================================================================

registerCategory("basic", "Basic Rune");
registerCategory("essential", "Essential Rune");
registerCategory("desert", "Desert Rune");
registerCategory("magma", "Magma Rune");

// Basic Set
addRune("basic", { name: "COMMON", chance: 2, color: "white", buffs: ["Points 4x"] });
addRune("basic", { name: "UNCOMMON", chance: 3, color: "green", buffs: ["Points 10x"] });
addRune("basic", { name: "RARE", chance: 15, color: "blue", buffs: ["Flux 5x"] });
addRune("basic", { name: "EPIC", chance: 200, color: "purple", buffs: ["Points 20x", "Flux 10x", "Voltage 2x"] });
addRune("basic", { name: "LEGENDARY", chance: 5000, color: "yellow", buffs: ["Points 25x", "Shards 5x", "Damage 2x", "Attack Speed 1.25x"] });
addRune("basic", { name: "MYTHIC", chance: 100000, color: "red", buffs: ["Points 100x", "Rune Bulk 2x", "Rune Luck 2.5x"] });
addRune("basic", { name: "KING", type: "Deity", chance: 20000000, luckOnChance: 132567400, color: "cyan", buffs: ["Particles 10x", "Rune Bulk 2.5x"] });
addRune("basic", { name: "EMPEROR", type: "Deity", chance: 500000000, luckOnChance: 3314000000, color: "cyan", buffs: ["Points 100x", "Particles 25x", "Rune Bulk 3x", "Rune Speed 3x"] });
addRune("basic", { name: "OVERLORD", type: "Deity", chance: 90.52e15, luckOnChance: 600e15, color: "pink", buffs: ["Points 1Kx", "Sacrifice Points 2.5x", "Rune Bulk 50x", "Tokens 4x"] });

// Essential Set
addRune("essential", { name: "STANDARD", chance: 2, color: "white", buffs: ["Particles 4x"] });
addRune("essential", { name: "LEGACY", chance: 5000, color: "purple", buffs: ["Particles 6x"] });
addRune("essential", { name: "ADVANCED", chance: 250000, color: "cyan", buffs: ["Particles 8x", "Rune Luck 2x"] });
addRune("essential", { name: "OVERCLOCKED", chance: 1000000, color: "red", buffs: ["Points 100x", "Particles 10x"] });
addRune("essential", { name: "NEURAL", chance: 200000000, color: "orange", buffs: ["Voltage 3x", "Plasma 4x"] });
addRune("essential", { name: "QUANTUM", chance: 500000000000, color: "pink", buffs: ["Particles 3x", "Rune Bulk 2x"] });
addRune("essential", { name: "CYBERNETIC", type: "Deity", chance: 500.21e6, luckOnChance: 6e9, color: "green", buffs: ["Points 5Kx", "Plasma 5x", "Pulse Button 3x", "Sacrifice Points 2x"] });
addRune("essential", { name: "SINGULARITY", type: "Deity", chance: 250e9, luckOnChance: 3e12, color: "green", buffs: ["Points 100Kx", "Particles 10x", "Sacrifice Points 3x", "Rune Bulk 5x", "Rune Speed 3x"] });
addRune("essential", { name: "EXODUS", type: "Deity", chance: 25.01e18, luckOnChance: 300e18, color: "orange", buffs: ["Points 500x", "Sacrifice Points 4x", "Rune Bulk 5x"] });

// Desert Set
addRune("desert", { name: "SILT", chance: 2, color: "white", buffs: ["Cactus 2x"] });
addRune("desert", { name: "CINDER", chance: 10000000000, color: "white", buffs: ["Cactus 3x"] });
addRune("desert", { name: "HUSK", chance: 1000000000000, color: "red", buffs: ["Cactus 10x"] });
addRune("desert", { name: "BRINE", chance: 200000000000000, color: "green", buffs: ["Cactus 25x", "Sand 2x", "Rune Luck 4x"] });
addRune("desert", { name: "RUST", chance: 10000000000000000, color: "brown", buffs: ["Cactus 5x", "Sand 5x", "Rune Luck 5x"] });
addRune("desert", { name: "SHARD", chance: 2e21, color: "yellow", buffs: ["Snow – [∞]"] });
addRune("desert", { name: "GRIT", type: "Deity", chance: 5e15, luckOnChance: 51.85e15, color: "yellow", buffs: ["Fire – [∞]", "Rune Bulk 3x", "Tokens 50x"] });
addRune("desert", { name: "SLAG", type: "Deity", chance: 5e24, luckOnChance: 51.85e24, color: "green", buffs: ["Fire 100x", "Magma 50x", "Rune Bulk 50x", "Rune Luck 10x"] });
addRune("desert", { name: "PYRAMID", type: "Deity", chance: 1e36, luckOnChance: 10.37e36, color: "yellow", buffs: ["Points 1Mx", "Snow 100x", "Fire 1000x", "Magma 100x", "Rune Bulk 5x"] });

// Magma Set
addRune("magma", { name: "PYRE", chance: 2, color: "yellow", buffs: ["Fire 3x"] });
addRune("magma", { name: "VULKAN", chance: 100000000000000, color: "red", buffs: ["Fire 5x"] });
addRune("magma", { name: "IGNIS", chance: 10000000000000000, color: "red", buffs: ["Fire 25x"] });
addRune("magma", { name: "ASH", chance: 1e21, color: "white", buffs: ["Fire 100x", "Rune Bulk 5x", "Rune Luck 5x"] });
addRune("magma", { name: "BLAZE", chance: 1e25, color: "pink", buffs: ["Cactus 10x", "Fire 3x", "Rune Luck 10x"] });
addRune("magma", { name: "MELT", chance: 1e29, color: "purple", buffs: ["Cactus 25x", "Fire 10x", "Magma 3x", "Rune Luck 5x"] });
addRune("magma", { name: "FURNACE", type: "Deity", chance: 50e24, luckOnChance: 336.9e24, color: "orange", buffs: ["Cactus 1Kx", "Fire 100x", "Rune Bulk 100x"] });
addRune("magma", { name: "INFERNO", type: "Deity", chance: 25e27, luckOnChance: 168.45e27, color: "pink", buffs: ["Points x [∞]", "Rune Bulk 25x", "Tokens 100x"] });

// ============================================================================
// 3. UTILITIES & ENGINE
// ============================================================================

const suffixesMap = {
  "K": 1e3, "M": 1e6, "B": 1e9, "T": 1e12, "Qd": 1e15, "Qn": 1e18, "Sx": 1e21, "Sp": 1e24, "Oc": 1e27, "No": 1e30,
  "De": 1e33, "UDe": 1e36, "DDe": 1e39, "TDe": 1e42, "QdDe": 1e45, "QnDe": 1e48, "SxDe": 1e51, "SpDe": 1e54, "OcDe": 1e57, "NoDe": 1e60,
  "Vt": 1e63, "UVt": 1e66, "DVt": 1e69, "TVt": 1e72, "QdVt": 1e75, "QnVt": 1e78, "SxVt": 1e81, "SpVt": 1e84, "OcVt": 1e87, "NoVt": 1e90
};

const suffixesList = Object.keys(suffixesMap);

function getVal(id, fallback) {
  const el = document.getElementById(id);
  return el ? el.value : (fallback !== undefined ? fallback : '');
}

function getChecked(id, fallback) {
  const el = document.getElementById(id);
  return el ? el.checked : (fallback !== undefined ? fallback : false);
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function setChecked(id, val) {
  const el = document.getElementById(id);
  if (el) el.checked = val;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function parseFormattedNumber(inputStr) {
  if (typeof inputStr !== 'string') inputStr = String(inputStr);
  inputStr = inputStr.trim().replace(/,/g, '');
  if (!inputStr) return 0;

  const match = inputStr.match(/^([0-9.]+)\s*([a-zA-Z]+)?$/);
  if (!match) return parseFloat(inputStr) || 0;

  const val = parseFloat(match[1]);
  const suffix = match[2];

  if (!suffix) return val || 0;
  if (suffixesMap[suffix]) return val * suffixesMap[suffix];

  const lower = suffix.toLowerCase();
  const key = suffixesList.find(function(k) { return k.toLowerCase() === lower; });
  return key ? val * suffixesMap[key] : (val || 0);
}

function formatNumber(num) {
  if (num === Infinity || isNaN(num)) return "∞";
  if (num < 1000) return num.toFixed(2).replace(/\.00$/, '');

  const exp = Math.floor(Math.log10(num));
  const suffixIdx = Math.floor(exp / 3) - 1;

  if (suffixIdx >= suffixesList.length) return num.toExponential(2);
  if (suffixIdx < 0) return num.toFixed(2).replace(/\.00$/, '');

  const divisor = Number("1e" + ((suffixIdx + 1) * 3));
  return (num / divisor).toFixed(2).replace(/\.00$/, '') + suffixesList[suffixIdx];
}

function formatTime(totalSeconds) {
  if (totalSeconds === Infinity || isNaN(totalSeconds)) return "∞";
  if (totalSeconds < 1) return "Instant";

  const secondsInYear = 31536000;
  const years = totalSeconds / secondsInYear;

  if (years >= 1) {
    if (years >= 1000) return formatNumber(years) + " yrs";
    const y = Math.floor(years);
    const d = Math.floor((totalSeconds % secondsInYear) / 86400);
    return y + "y " + d + "d";
  }

  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  const parts = [];
  if (d > 0) parts.push(d + "d");
  if (h > 0 || d > 0) parts.push(h + "h");
  if (m > 0 || h > 0 || d > 0) parts.push(m + "m");
  if (d === 0) parts.push(s + "s");

  return parts.join(' ');
}

// ============================================================================
// 4. RENDERING & EVENTS
// ============================================================================

function renderCategoryTabs() {
  const container = document.querySelector('.tabs-container');
  if (!container) return;

  container.innerHTML = "";
  
  Object.keys(runeCategories).forEach(function(catId) {
    const btn = document.createElement('button');
    btn.className = "tab-btn" + (catId === currentTab ? " active" : "");
    btn.textContent = runeCategories[catId];

    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentTab = catId;
      calculateAndRender();
    });

    container.appendChild(btn);
  });
}

function calculateAndRender() {
  const rawLuck = parseFormattedNumber(getVal('luckInput', '0'));
  const cloneVal = parseFormattedNumber(getVal('cloneInput', '1'));
  const globalLuckToggle = getChecked('luckToggle', true);
  const isAdvanced = getChecked('advancedToggle', false);

  const groupRps = document.getElementById('groupRps');
  const groupSpeed = document.getElementById('groupSpeed');
  const groupBulk = document.getElementById('groupBulk');
  const groupClone = document.getElementById('groupClone');
  const groupLuck = document.getElementById('groupLuck');
  const potionsSection = document.getElementById('potionsSection');
  const baseRpsMetric = document.getElementById('baseRpsMetric');

// Toggle Basic vs Advanced Visibility
  if (groupRps) groupRps.style.display = isAdvanced ? 'none' : 'flex';
  if (groupLuck) groupLuck.style.display = isAdvanced ? 'flex' : 'none';
  if (groupSpeed) groupSpeed.style.display = isAdvanced ? 'flex' : 'none';
  if (groupBulk) groupBulk.style.display = isAdvanced ? 'flex' : 'none';
  if (groupClone) groupClone.style.display = isAdvanced ? 'flex' : 'none';
  if (potionsSection) potionsSection.style.display = isAdvanced ? 'block' : 'none';
  if (baseRpsMetric) baseRpsMetric.style.display = isAdvanced ? 'flex' : 'none';

  let baseRPS = 0;
  let actualRPS = 0;
  let finalLuck = rawLuck;

  if (isAdvanced) {
    const potServer = getChecked('potServer', false);
    const potLuck = getChecked('potLuck', true);
    const potSpeed = getChecked('potSpeed', true);
    const potBulk = getChecked('potBulk', true);

    const serverMult = potServer ? 1.25 : 1.0;
    const luckMult = (potLuck ? 2.0 : 1.0) * serverMult;
    const speedMult = (potSpeed ? 2.0 : 1.0) * serverMult;
    const bulkMult = (potBulk ? 2.0 : 1.0) * serverMult;

    finalLuck = rawLuck * luckMult;

    const rawSpeed = parseFormattedNumber(getVal('speedInput', '0'));
    const rawBulk = parseFormattedNumber(getVal('bulkInput', '0'));

    baseRPS = rawSpeed * rawBulk;
    actualRPS = (rawSpeed * speedMult) * (rawBulk * bulkMult);
  } else {
    // Basic Mode: Single Current Rate input
    actualRPS = parseFormattedNumber(getVal('rpsInput', '2000'));
    baseRPS = actualRPS;
    finalLuck = rawLuck;

    // Update Image 7 readout text
    setText('parsedRateDisplay', 'Parsed Rate: ' + formatNumber(actualRPS) + ' RPS');
  }

  setText('actualRpsDisplay', formatNumber(actualRPS) + " RPS");
  setText('baseRpsDisplay', formatNumber(baseRPS) + " RPS");
  setText('luckDisplay', globalLuckToggle ? formatNumber(finalLuck) + "x" : "Off");

  const incomePerSec = parseFormattedNumber(getVal('incomeInput', '0'));
  const currentVal = parseFormattedNumber(getVal('currentInput', '0'));
  const targetVal = parseFormattedNumber(getVal('targetInput', '0'));

  const needed = targetVal - currentVal;
  if (incomePerSec <= 0) {
    setText('goalTimeDisplay', "N/A (0 Income)");
  } else if (needed <= 0) {
    setText('goalTimeDisplay', "Goal Reached!");
  } else {
    setText('goalTimeDisplay', formatTime(needed / incomePerSec));
  }

  const grid = document.getElementById('runeGrid');
  if (!grid) return;
  grid.innerHTML = "";

  const activeSet = runeDatabase[currentTab] || [];

  activeSet.forEach(function(rune) {
    let effectiveChance = rune.baseChance;

    if (rune.type === "Deity") {
      effectiveChance = globalLuckToggle ? rune.luckOnChance : rune.baseChance;
    } else {
      let activeLuck = globalLuckToggle ? finalLuck : 1;
      effectiveChance = rune.baseChance / Math.max(1, activeLuck);
    }

    const dropProbability = 1 / Math.max(1, effectiveChance);
    const estimatedYieldPerSec = actualRPS * dropProbability * Math.max(1, cloneVal);
    const secondsForOne = estimatedYieldPerSec > 0 ? (1 / estimatedYieldPerSec) : Infinity;

    const card = document.createElement('div');
    card.className = "rune-card " + rune.colorClass;

    let buffsHTML = rune.buffs.map(function(buff) { 
      return '<div class="buff-item" style="color: ' + buff.color + '">' + buff.text + '</div>';
    }).join('');

    let warningHTML = "";
    if (rune.type === "Deity") {
      const penaltyRatio = (rune.luckOnChance / rune.baseChance).toFixed(1);
      warningHTML = globalLuckToggle 
        ? '<div class="warning-text" style="color: #f87171">Luck Active: Penalized ' + penaltyRatio + 'x<br><strong>TURN OFF LUCK</strong></div>'
        : '<div class="warning-text" style="color: #34d399">LUCK DISABLED<br><strong>OPTIMAL CHANCE ACTIVE</strong></div>';
    }

    card.innerHTML = 
      '<div>' +
        '<div class="rune-title">' + rune.name + '</div>' +
        '<div class="rune-category">[' + rune.type + ']</div>' +
        '<div class="time-badge">Est. Time: ' + formatTime(secondsForOne) + '</div>' +
        '<div class="buffs-container">' + buffsHTML + '</div>' +
      '</div>' +
      '<div>' +
        warningHTML +
        '<div class="rune-chance">Chance: 1 / ' + formatNumber(effectiveChance) + '</div>' +
      '</div>';

    grid.appendChild(card);
  });

  saveData();
}

function saveData() {
  const data = {
    luckInput: getVal('luckInput', '738.01Qn'),
    rpsInput: getVal('rpsInput', '2000'),
    speedInput: getVal('speedInput', '139.1M'),
    bulkInput: getVal('bulkInput', '11.38Sp'),
    cloneInput: getVal('cloneInput', '8'),
    luckToggle: getChecked('luckToggle', true),
    advancedToggle: getChecked('advancedToggle', false),
    potServer: getChecked('potServer', false),
    potLuck: getChecked('potLuck', true),
    potSpeed: getChecked('potSpeed', true),
    potBulk: getChecked('potBulk', true),
    incomeInput: getVal('incomeInput', '4.6T'),
    currentInput: getVal('currentInput', '900Qd'),
    targetInput: getVal('targetInput', '2Qn'),
    currentTab: currentTab
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    if (data.luckInput !== undefined) setVal('luckInput', data.luckInput);
    if (data.rpsInput !== undefined) setVal('rpsInput', data.rpsInput);
    if (data.speedInput !== undefined) setVal('speedInput', data.speedInput);
    if (data.bulkInput !== undefined) setVal('bulkInput', data.bulkInput);
    if (data.cloneInput !== undefined) setVal('cloneInput', data.cloneInput);
    if (data.luckToggle !== undefined) setChecked('luckToggle', data.luckToggle);
    if (data.advancedToggle !== undefined) setChecked('advancedToggle', data.advancedToggle);
    if (data.potServer !== undefined) setChecked('potServer', data.potServer);
    if (data.potLuck !== undefined) setChecked('potLuck', data.potLuck);
    if (data.potSpeed !== undefined) setChecked('potSpeed', data.potSpeed);
    if (data.potBulk !== undefined) setChecked('potBulk', data.potBulk);
    if (data.incomeInput !== undefined) setVal('incomeInput', data.incomeInput);
    if (data.currentInput !== undefined) setVal('currentInput', data.currentInput);
    if (data.targetInput !== undefined) setVal('targetInput', data.targetInput);

    if (data.currentTab && runeDatabase[data.currentTab]) {
      currentTab = data.currentTab;
    }
  } catch (e) {
    console.error("Failed to load saved state:", e);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadData();
  renderCategoryTabs();

  document.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('input', calculateAndRender);
    input.addEventListener('change', calculateAndRender);
  });

  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      if (confirm("Reset all calculator stats to defaults?")) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    });
  }

  calculateAndRender();
});
