const STORAGE_KEY = 'ascension_ii_optimizer_data';
let currentTab = 'basic';

const suffixesMap = {
  "K": 1e3, "M": 1e6, "B": 1e9, "T": 1e12, "Qd": 1e15, "Qn": 1e18, "Sx": 1e21, "Sp": 1e24, "Oc": 1e27, "No": 1e30,
  "De": 1e33, "UDe": 1e36, "DDe": 1e39, "TDe": 1e42, "QdDe": 1e45, "QnDe": 1e48, "SxDe": 1e51, "SpDe": 1e54, "OcDe": 1e57, "NoDe": 1e60,
  "Vt": 1e63, "UVt": 1e66, "DVt": 1e69, "TVt": 1e72, "QdVt": 1e75, "QnVt": 1e78, "SxVt": 1e81, "SpVt": 1e84, "OcVt": 1e87, "NoVt": 1e90,
  "Tg": 1e93, "UTg": 1e96, "DTg": 1e99, "TTg": 1e102, "QdTg": 1e105, "QnTg": 1e108, "SxTg": 1e111, "SpTg": 1e114, "OcTg": 1e117, "NoTg": 1e120,
  "qg": 1e123, "Uqg": 1e126, "Dqg": 1e129, "Tqg": 1e132, "Qdqg": 1e135, "Qnqg": 1e138, "Sxqg": 1e141, "Spqg": 1e144, "Ocqg": 1e147, "Noqg": 1e150,
  "Qg": 1e153, "UQg": 1e156, "DQg": 1e159, "TQg": 1e162, "QdQg": 1e165, "QnQg": 1e168, "SxQg": 1e171, "SpQg": 1e174, "OcQg": 1e177, "NoQg": 1e180,
  "sg": 1e183, "Usg": 1e186, "Dsg": 1e189, "Tsg": 1e192, "Qdsg": 1e195, "Qnsg": 1e198, "Sxsg": 1e201, "Spsg": 1e204, "Ocsg": 1e207, "Nosg": 1e210,
  "Sg": 1e213, "USg": 1e216, "DSg": 1e219, "TSg": 1e222, "QdSg": 1e225, "QnSg": 1e228, "SxSg": 1e231, "SpSg": 1e234, "OcSg": 1e237, "NoSg": 1e240,
  "Og": 1e243, "UOg": 1e246, "DOg": 1e249, "TOg": 1e252, "QdOg": 1e255, "QnOg": 1e258, "SxOg": 1e261, "SpOg": 1e264, "OcOg": 1e267, "NoOg": 1e270,
  "Ng": 1e273, "UNg": 1e276, "DNg": 1e279, "TNg": 1e282, "QdNg": 1e285, "QnNg": 1e288, "SxNg": 1e291, "SpNg": 1e294, "OcNg": 1e297, "NoNg": 1e300,
  "Ce": 1e303, "UCe": 1e306
};

const suffixesList = Object.keys(suffixesMap);

/* Safe DOM Helper Functions */
function getVal(id, fallback = '') {
  return document.getElementById(id)?.value ?? fallback;
}

function getChecked(id, fallback = false) {
  return document.getElementById(id)?.checked ?? fallback;
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
  const key = suffixesList.find(k => k.toLowerCase() === lower);
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
    return `${y}y ${d}d`;
  }

  const d = Math.floor(totalSeconds / 86400);
  const h = Math.floor((totalSeconds % 86400) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
  if (d === 0) parts.push(`${s}s`);

  return parts.join(' ');
}

const runeDatabase = {
  basic: [
    { name: "COMMON", type: "Basic", baseChance: 2, colorClass: "color-white", buffs: [{ text: "Points 4x", color: "#ffffff" }] },
    { name: "UNCOMMON", type: "Basic", baseChance: 3, colorClass: "color-green", buffs: [{ text: "Points 10x", color: "#34d399" }] },
    { name: "RARE", type: "Basic", baseChance: 15, colorClass: "color-blue", buffs: [{ text: "Flux 5x", color: "#fbbf24" }] },
    { name: "EPIC", type: "Basic", baseChance: 200, colorClass: "color-purple", buffs: [{ text: "Points 20x", color: "#ffffff" }, { text: "Flux 10x", color: "#fbbf24" }, { text: "Voltage 2x", color: "#f87171" }] },
    { name: "LEGENDARY", type: "Basic", baseChance: 5000, colorClass: "color-yellow", buffs: [{ text: "Points 25x", color: "#ffffff" }, { text: "Shards 5x", color: "#c084fc" }, { text: "Damage 2x", color: "#f87171" }, { text: "Attack Speed 1.25x", color: "#60a5fa" }] },
    { name: "MYTHIC", type: "Basic", baseChance: 100000, colorClass: "color-red", buffs: [{ text: "Points 100x", color: "#ffffff" }, { text: "Rune Bulk 2x", color: "#fbbf24" }, { text: "Rune Luck 2.5x", color: "#34d399" }] },
    { name: "KING", type: "Deity", baseChance: 20000000, luckOnChance: 132567400, colorClass: "color-cyan", buffs: [{ text: "Particles 10x", color: "#38bdf8" }, { text: "Rune Bulk 2.5x", color: "#fbbf24" }] },
    { name: "EMPEROR", type: "Deity", baseChance: 500000000, luckOnChance: 3314000000, colorClass: "color-cyan", buffs: [{ text: "Points 100x", color: "#ffffff" }, { text: "Particles 25x", color: "#38bdf8" }, { text: "Rune Bulk 3x", color: "#fbbf24" }, { text: "Rune Speed 3x", color: "#38bdf8" }] },
    { name: "OVERLORD", type: "Deity", baseChance: 90.52e15, luckOnChance: 600e15, colorClass: "color-pink", buffs: [{ text: "Points 1Kx", color: "#ffffff" }, { text: "Sacrifice Points 2.5x", color: "#818cf8" }, { text: "Rune Bulk 50x", color: "#fbbf24" }, { text: "Tokens 4x", color: "#38bdf8" }] }
  ],
  cybernetic: [
    { name: "STANDARD", type: "Basic", baseChance: 2, colorClass: "color-white", buffs: [{ text: "Particles 4x", color: "#38bdf8" }] },
    { name: "LEGACY", type: "Basic", baseChance: 5000, colorClass: "color-purple", buffs: [{ text: "Particles 6x", color: "#38bdf8" }] },
    { name: "ADVANCED", type: "Basic", baseChance: 250000, colorClass: "color-cyan", buffs: [{ text: "Particles 8x", color: "#38bdf8" }, { text: "Rune Luck 2x", color: "#34d399" }] },
    { name: "OVERCLOCKED", type: "Basic", baseChance: 1000000, colorClass: "color-red", buffs: [{ text: "Points 100x", color: "#ffffff" }, { text: "Particles 10x", color: "#38bdf8" }] },
    { name: "NEURAL", type: "Basic", baseChance: 200000000, colorClass: "color-orange", buffs: [{ text: "Voltage 3x", color: "#f87171" }, { text: "Plasma 4x", color: "#c084fc" }] },
    { name: "QUANTUM", type: "Basic", baseChance: 500000000000, colorClass: "color-pink", buffs: [{ text: "Particles 3x", color: "#38bdf8" }, { text: "Rune Bulk 2x", color: "#fbbf24" }] },
    { name: "CYBERNETIC", type: "Deity", baseChance: 500.21e6, luckOnChance: 6e9, colorClass: "color-green", buffs: [{ text: "Points 5Kx", color: "#ffffff" }, { text: "Plasma 5x", color: "#c084fc" }, { text: "Pulse Button 3x", color: "#34d399" }, { text: "Sacrifice Points 2x", color: "#38bdf8" }] },
    { name: "SINGULARITY", type: "Deity", baseChance: 250e9, luckOnChance: 3e12, colorClass: "color-green", buffs: [{ text: "Points 100Kx", color: "#ffffff" }, { text: "Particles 10x", color: "#38bdf8" }, { text: "Sacrifice Points 3x", color: "#818cf8" }, { text: "Rune Bulk 5x", color: "#fbbf24" }, { text: "Rune Speed 3x", color: "#38bdf8" }] },
    { name: "EXODUS", type: "Deity", baseChance: 25.01e18, luckOnChance: 300e18, colorClass: "color-orange", buffs: [{ text: "Points 500x", color: "#ffffff" }, { text: "Sacrifice Points 4x", color: "#818cf8" }, { text: "Rune Bulk 5x", color: "#fbbf24" }] }
  ],
  sand: [
    { name: "SILT", type: "Basic", baseChance: 2, colorClass: "color-white", buffs: [{ text: "Cactus 2x", color: "#34d399" }] },
    { name: "CINDER", type: "Basic", baseChance: 10000000000, colorClass: "color-white", buffs: [{ text: "Cactus 3x", color: "#34d399" }] },
    { name: "HUSK", type: "Basic", baseChance: 1000000000000, colorClass: "color-red", buffs: [{ text: "Cactus 10x", color: "#34d399" }] },
    { name: "BRINE", type: "Basic", baseChance: 200000000000000, colorClass: "color-green", buffs: [{ text: "Cactus 25x", color: "#34d399" }, { text: "Sand 2x", color: "#fbbf24" }, { text: "Rune Luck 4x", color: "#34d399" }] },
    { name: "RUST", type: "Basic", baseChance: 10000000000000000, colorClass: "color-brown", buffs: [{ text: "Cactus 5x", color: "#34d399" }, { text: "Sand 5x", color: "#fbbf24" }, { text: "Rune Luck 5x", color: "#34d399" }] },
    { name: "SHARD", type: "Basic", baseChance: 2e21, colorClass: "color-yellow", buffs: [{ text: "Snow 32.83Kx [∞]", color: "#ffffff" }] },
    { name: "GRIT", type: "Deity", baseChance: 5e15, luckOnChance: 51.85e15, colorClass: "color-yellow", buffs: [{ text: "Fire 71.59x [∞]", color: "#f87171" }, { text: "Rune Bulk 3x", color: "#fbbf24" }, { text: "Tokens 50x", color: "#fb923c" }] },
    { name: "SLAG", type: "Deity", baseChance: 5e24, luckOnChance: 51.85e24, colorClass: "color-green", buffs: [{ text: "Fire 100x", color: "#f87171" }, { text: "Magma 50x", color: "#fb923c" }, { text: "Rune Bulk 50x", color: "#fbbf24" }, { text: "Rune Luck 10x", color: "#34d399" }] },
    { name: "PYRAMID", type: "Deity", baseChance: 1e36, luckOnChance: 10.37e36, colorClass: "color-yellow", buffs: [{ text: "Cactus 50x", color: "#34d399" }, { text: "Sand 100x", color: "#fbbf24" }] }
  ],
  fire: [
    { name: "PYRE", type: "Basic", baseChance: 2, colorClass: "color-yellow", buffs: [{ text: "Fire 3x", color: "#f87171" }] },
    { name: "VULKAN", type: "Basic", baseChance: 100000000000000, colorClass: "color-red", buffs: [{ text: "Fire 5x", color: "#f87171" }] },
    { name: "IGNIS", type: "Basic", baseChance: 10000000000000000, colorClass: "color-red", buffs: [{ text: "Fire 25x", color: "#f87171" }] },
    { name: "ASH", type: "Basic", baseChance: 1e21, colorClass: "color-white", buffs: [{ text: "Fire 100x", color: "#f87171" }, { text: "Rune Bulk 5x", color: "#fbbf24" }, { text: "Rune Luck 5x", color: "#34d399" }] },
    { name: "BLAZE", type: "Basic", baseChance: 1e25, colorClass: "color-pink", buffs: [{ text: "Cactus 10x", color: "#34d399" }, { text: "Fire 3x", color: "#f87171" }, { text: "Rune Luck 10x", color: "#34d399" }] },
    { name: "MELT", type: "Basic", baseChance: 1e29, colorClass: "color-purple", buffs: [{ text: "Cactus 25x", color: "#34d399" }, { text: "Fire 10x", color: "#f87171" }, { text: "Magma 3x", color: "#fb923c" }, { text: "Rune Luck 5x", color: "#34d399" }] },
    { name: "FURNACE", type: "Deity", baseChance: 50e24, luckOnChance: 336.9e24, colorClass: "color-orange", buffs: [{ text: "Cactus 1Kx", color: "#34d399" }, { text: "Fire 100x", color: "#f87171" }, { text: "Rune Bulk 100x", color: "#fbbf24" }] },
    { name: "INFERNO", type: "Deity", baseChance: 25e27, luckOnChance: 168.45e27, colorClass: "color-pink", buffs: [{ text: "Points 1.54Kx [∞]", color: "#ffffff" }, { text: "Rune Bulk 25x", color: "#fbbf24" }, { text: "Tokens 100x", color: "#fb923c" }] }
  ]
};

/* Auto-Save & Load Functions */
function saveData() {
  const data = {
    luckInput: getVal('luckInput', '738.01Qn'),
    speedInput: getVal('speedInput', '139.1M'),
    bulkInput: getVal('bulkInput', '11.38Sp'),
    cloneInput: getVal('cloneInput', '8'),
    luckToggle: getChecked('luckToggle', true),
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
    if (data.speedInput !== undefined) setVal('speedInput', data.speedInput);
    if (data.bulkInput !== undefined) setVal('bulkInput', data.bulkInput);
    if (data.cloneInput !== undefined) setVal('cloneInput', data.cloneInput);
    if (data.luckToggle !== undefined) setChecked('luckToggle', data.luckToggle);
    if (data.potServer !== undefined) setChecked('potServer', data.potServer);
    if (data.potLuck !== undefined) setChecked('potLuck', data.potLuck);
    if (data.potSpeed !== undefined) setChecked('potSpeed', data.potSpeed);
    if (data.potBulk !== undefined) setChecked('potBulk', data.potBulk);
    if (data.incomeInput !== undefined) setVal('incomeInput', data.incomeInput);
    if (data.currentInput !== undefined) setVal('currentInput', data.currentInput);
    if (data.targetInput !== undefined) setVal('targetInput', data.targetInput);

    if (data.currentTab && runeDatabase[data.currentTab]) {
      currentTab = data.currentTab;
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === currentTab);
      });
    }
  } catch (e) {
    console.error("Failed to load saved state:", e);
  }
}

function calculateAndRender() {
  const rawLuck = parseFormattedNumber(getVal('luckInput', '0'));
  const rawSpeed = parseFormattedNumber(getVal('speedInput', '0'));
  const rawBulk = parseFormattedNumber(getVal('bulkInput', '0'));
  const cloneVal = parseFormattedNumber(getVal('cloneInput', '1'));
  const globalLuckToggle = getChecked('luckToggle', true);

  const potServer = getChecked('potServer', false);
  const potLuck = getChecked('potLuck', true);
  const potSpeed = getChecked('potSpeed', true);
  const potBulk = getChecked('potBulk', true);

  const serverMult = potServer ? 1.25 : 1.0;
  const luckMult = (potLuck ? 2.0 : 1.0) * serverMult;
  const speedMult = (potSpeed ? 2.0 : 1.0) * serverMult;
  const bulkMult = (potBulk ? 2.0 : 1.0) * serverMult;

  const finalLuck = rawLuck * luckMult;
  const finalSpeed = rawSpeed * speedMult;
  const finalBulk = rawBulk * bulkMult;

  const baseRPS = rawBulk * rawSpeed;
  const actualRPS = finalBulk * finalSpeed;

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
    const seconds = needed / incomePerSec;
    setText('goalTimeDisplay', formatTime(seconds));
  }

  const grid = document.getElementById('runeGrid');
  if (!grid) return;
  grid.innerHTML = "";

  const activeSet = runeDatabase[currentTab] || [];

  activeSet.forEach(rune => {
    let effectiveChance = rune.baseChance;

    if (rune.type === "Deity") {
      effectiveChance = globalLuckToggle ? (rune.luckOnChance || (rune.baseChance * 10)) : rune.baseChance;
    } else {
      let activeLuck = globalLuckToggle ? finalLuck : 1;
      effectiveChance = rune.baseChance / Math.max(1, activeLuck);
    }

    const dropProbability = 1 / Math.max(1, effectiveChance);
    const estimatedYieldPerSec = actualRPS * dropProbability * Math.max(1, cloneVal);
    const secondsForOne = estimatedYieldPerSec > 0 ? (1 / estimatedYieldPerSec) : Infinity;

    const card = document.createElement('div');
    card.className = `rune-card ${rune.colorClass}`;

    let buffsHTML = rune.buffs.map(buff => 
      `<div class="buff-item" style="color: ${buff.color}">
        ${buff.text} <span class="tag-max">[MAX]</span>
       </div>`
    ).join('');

    let warningHTML = "";
    if (rune.type === "Deity") {
      const penaltyRatio = (rune.luckOnChance / rune.baseChance).toFixed(1);
      warningHTML = globalLuckToggle 
        ? `<div class="warning-text" style="color: #f87171">Luck Active: Penalized ${penaltyRatio}x<br><strong>TURN OFF LUCK</strong></div>`
        : `<div class="warning-text" style="color: #34d399">LUCK DISABLED<br><strong>OPTIMAL CHANCE ACTIVE</strong></div>`;
    }

    card.innerHTML = `
      <div>
        <div class="rune-title">${rune.name}</div>
        <div class="rune-category">[${rune.type}]</div>
        <div class="time-badge">Est. Time: ${formatTime(secondsForOne)}</div>
        <div class="divider"></div>
        <div class="buffs-container">${buffsHTML}</div>
      </div>
      <div>
        ${warningHTML}
        <div class="rune-chance">Chance: 1 / ${formatNumber(effectiveChance)}</div>
      </div>
    `;

    grid.appendChild(card);
  });

  saveData();
}

/* Initialize listeners and state after DOM is ready */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateAndRender);
    input.addEventListener('change', calculateAndRender);
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.getAttribute('data-tab');
      calculateAndRender();
    });
  });

  document.getElementById('resetBtn')?.addEventListener('click', () => {
    if (confirm("Reset all calculator stats to defaults?")) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });

  loadData();
  calculateAndRender();
});
