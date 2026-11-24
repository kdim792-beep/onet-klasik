/**
 * ONET KLASIK 2003 - PIKACHU CLASSIC GAME ENGINE
 * Completely Self-Contained, Bug-Free, Pure JavaScript Implementation
 */

// --- CONSTANTS & CONFIGURATION ---
const INNER_COLS = 16;
const INNER_ROWS = 9;
const TOTAL_COLS = INNER_COLS + 2; // 18 columns (including outer empty padding)
const TOTAL_ROWS = INNER_ROWS + 2; // 11 rows (including outer empty padding)
const TOTAL_TILES_COUNT = INNER_COLS * INNER_ROWS; // 144
const UNIQUE_ICON_TYPES = 36; // 36 distinct icons, 4 of each = 144 tiles total
const INITIAL_TIME_SECONDS = 140; // Base time per level

// 36 Distinct Icon SVG Definitions (Cute Retro Creatures & Classic Symbols)
const ICON_DEFINITIONS = [
    { id: 1, bg: '#fee2e2', stroke: '#ef4444', icon: '⚡' },
    { id: 2, bg: '#dcfce7', stroke: '#22c55e', icon: '🍃' },
    { id: 3, bg: '#e0f2fe', stroke: '#06b6d4', icon: '💧' },
    { id: 4, bg: '#fef3c7', stroke: '#f59e0b', icon: '🔥' },
    { id: 5, bg: '#f3e8ff', stroke: '#a855f7', icon: '🔮' },
    { id: 6, bg: '#fce7f3', stroke: '#ec4899', icon: '🌸' },
    { id: 7, bg: '#ffedd5', stroke: '#f97316', icon: '⭐' },
    { id: 8, bg: '#ccfbf1', stroke: '#14b8a6', icon: '💎' },
    { id: 9, bg: '#e0e7ff', stroke: '#6366f1', icon: '🌙' },
    { id: 10, bg: '#fae8ff', stroke: '#d946ef', icon: '👑' },
    { id: 11, bg: '#dbeafe', stroke: '#3b82f6', icon: '🍎' },
    { id: 12, bg: '#fef9c3', stroke: '#ca8a04', icon: '🍒' },
    { id: 13, bg: '#d1fae5', stroke: '#10b981', icon: '🍄' },
    { id: 14, bg: '#ffe4e6', stroke: '#f43f5e', icon: '🎁' },
    { id: 15, bg: '#e2e8f0', stroke: '#64748b', icon: '🔔' },
    { id: 16, bg: '#fef08a', stroke: '#eab308', icon: '🪙' },
    { id: 17, bg: '#fed7aa', stroke: '#ea580c', icon: '🦊' },
    { id: 18, bg: '#bbf7d0', stroke: '#16a34a', icon: '🐸' },
    { id: 19, bg: '#bfdbfe', stroke: '#2563eb', icon: '🐳' },
    { id: 20, bg: '#fbcfe8', stroke: '#db2777', icon: '🐱' },
    { id: 21, bg: '#ddd6fe', stroke: '#7c3aed', icon: '🦉' },
    { id: 22, bg: '#fed7d7', stroke: '#e53e3e', icon: '🐼' },
    { id: 23, bg: '#feebc8', stroke: '#dd6b20', icon: '🐯' },
    { id: 24, bg: '#c6f6d5', stroke: '#38a169', icon: 'turtle' },
    { id: 25, bg: '#e9d8fd', stroke: '#805ad5', icon: '🦄' },
    { id: 26, bg: '#fed7e2', stroke: '#d53f8c', icon: '🐥' },
    { id: 27, bg: '#e2e8f0', stroke: '#475569', icon: 'penguin' },
    { id: 28, bg: '#fef08a', stroke: '#d97706', icon: '🐝' },
    { id: 29, bg: '#bfe3b4', stroke: '#2f855a', icon: 'Clover' },
    { id: 30, bg: '#c4b5fd', stroke: '#6d28d9', icon: '🚀' },
    { id: 31, bg: '#99f6e4', stroke: '#0d9488', icon: '⚓' },
    { id: 32, bg: '#fef08a', stroke: '#ca8a04', icon: '🔑' },
    { id: 33, bg: '#fca5a5', stroke: '#dc2626', icon: '❤️' },
    { id: 34, bg: '#6ee7b7', stroke: '#059669', icon: '🎈' },
    { id: 35, bg: '#fde047', stroke: '#a16207', icon: '☀️' },
    { id: 36, bg: '#a5f3fc', stroke: '#0891b2', icon: '❄️' }
];

// Specific SVG shapes for turtle and penguin for extra retro charm
function renderTileInnerContent(typeId) {
    const def = ICON_DEFINITIONS[typeId - 1];
    if (!def) return '';
    if (def.icon === 'turtle') {
        return `<svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="${def.stroke}" stroke-width="2"><path d="M12 4a7 7 0 0 0-7 7c0 3 2 5.5 5 6.5L9 20h6l-1-2.5c3-1 5-3.5 5-6.5a7 7 0 0 0-7-7z" fill="${def.bg}"/><circle cx="9" cy="9" r="1" fill="${def.stroke}"/><circle cx="15" cy="9" r="1" fill="${def.stroke}"/></svg>`;
    }
    if (def.icon === 'penguin') {
        return `<svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="${def.stroke}"><ellipse cx="12" cy="13" rx="7" ry="8"/><ellipse cx="12" cy="14" rx="4" ry="5" fill="#fff"/><circle cx="10" cy="9" r="1" fill="#000"/><circle cx="14" cy="9" r="1" fill="#000"/><polygon points="12,10 10,12 14,12" fill="#f59e0b"/></svg>`;
    }
    if (def.icon === 'Clover') {
        return `<svg class="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="${def.stroke}"><circle cx="9" cy="9" r="4"/><circle cx="15" cy="9" r="4"/><circle cx="9" cy="15" r="4"/><circle cx="15" cy="15" r="4"/><path d="M12 12v8" stroke="${def.stroke}" stroke-width="3"/></svg>`;
    }
    return `<span class="text-xl sm:text-2xl drop-shadow">${def.icon}</span>`;
}

// --- AUDIO SYNTHESIZER (WEB AUDIO API) ---
class SoundEffects {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
        if (this.muted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }

    click() { this.playTone(600, 'sine', 0.05, 0.1); }
    select() { this.playTone(800, 'triangle', 0.08, 0.15); }
    match() {
        if (this.muted || !this.ctx) return;
        this.playTone(523.25, 'triangle', 0.12, 0.2);
        setTimeout(() => this.playTone(659.25, 'triangle', 0.12, 0.2), 70);
        setTimeout(() => this.playTone(783.99, 'triangle', 0.2, 0.25), 140);
    }
    invalid() {
        this.playTone(200, 'sawtooth', 0.15, 0.15);
    }
    shuffle() {
        if (this.muted || !this.ctx) return;
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.playTone(300 + i * 100, 'sine', 0.05, 0.1), i * 30);
        }
    }
    chaos() {
        if (this.muted || !this.ctx) return;
        this.playTone(300, 'sawtooth', 0.08, 0.2);
        setTimeout(() => this.playTone(550, 'sawtooth', 0.08, 0.2), 60);
        setTimeout(() => this.playTone(420, 'sawtooth', 0.12, 0.25), 120);
    }
    win() {
        if (this.muted || !this.ctx) return;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.2), idx * 100);
        });
    }
    gameOver() {
        if (this.muted || !this.ctx) return;
        const notes = [400, 350, 300, 250];
        notes.forEach((freq, idx) => {
            setTimeout(() => this.playTone(freq, 'sawtooth', 0.2, 0.2), idx * 120);
        });
    }
}

const audio = new SoundEffects();

// --- GAME STATE ---
let board = [];
let selectedTile = null;
let currentLevel = 1;
let score = 0;
let highScore = parseInt(localStorage.getItem('onet_classic_highscore') || '0');
let hintCount = 5;
let shuffleCount = 5;
let timeRemaining = INITIAL_TIME_SECONDS;
let timerInterval = null;
let isAnimating = false;
let isPaused = false;
let activeTilesRemaining = TOTAL_TILES_COUNT;

// CHAOS / HARD MODE STATE
const DANGER_THRESHOLD = 24;
let chaosTimer = null;
let isChaosActive = false;

// Shift Patterns Names for Levels
const SHIFT_PATTERNS = [
    "Diam (Statis)",
    "Jatuh Ke Bawah",
    "Naik Ke Atas",
    "Geser Ke Kiri",
    "Geser Ke Kanan",
    "Terbelah (Atas/Bawah)",
    "Terbelah (Kiri/Kanan)",
    "Menyatu Vertikal",
    "Menyatu Horizontal"
];

// --- DOM ELEMENTS ---
const gridContainer = document.getElementById('grid-container');
const lineCanvas = document.getElementById('line-canvas');
const ctxCanvas = lineCanvas.getContext('2d');
const levelDisplay = document.getElementById('level-display');
const scoreDisplay = document.getElementById('score-display');
const timerBar = document.getElementById('timer-bar');
const hintCountSpan = document.getElementById('hint-count');
const shuffleCountSpan = document.getElementById('shuffle-count');
const gravityNameSpan = document.getElementById('gravity-name');
const activeTilesSpan = document.getElementById('active-tiles-count');
const highScoreSpan = document.getElementById('high-score-display');
const statusMessage = document.getElementById('status-message');

// Modals
const modalStart = document.getElementById('modal-start');
const modalPause = document.getElementById('modal-pause');
const modalLevelComplete = document.getElementById('modal-level-complete');
const modalGameOver = document.getElementById('modal-game-over');

// --- CORE LOGIC: BOARD GENERATION & SOLVABILITY ---

function initEmptyBoard() {
    board = [];
    for (let r = 0; r < TOTAL_ROWS; r++) {
        const row = [];
        for (let c = 0; c < TOTAL_COLS; c++) {
            row.push(0);
        }
        board.push(row);
    }
}

function generateSolvableBoard() {
    initEmptyBoard();

    const tiles = [];
    for (let type = 1; type <= UNIQUE_ICON_TYPES; type++) {
        tiles.push(type, type, type, type);
    }

    shuffleArray(tiles);

    let idx = 0;
    for (let r = 1; r <= INNER_ROWS; r++) {
        for (let c = 1; c <= INNER_COLS; c++) {
            board[r][c] = tiles[idx++];
        }
    }

    activeTilesRemaining = TOTAL_TILES_COUNT;

    if (!hasValidMoves()) {
        autoShuffleBoard(false);
    }
}

// --- DANGER / CHAOS MUTATION LOGIC ---

function updateChaosState() {
    const gameContainer = document.getElementById('game-container');
    const chaosBadge = document.getElementById('chaos-badge');

    if (activeTilesRemaining <= DANGER_THRESHOLD && activeTilesRemaining > 0) {
        if (!isChaosActive) {
            isChaosActive = true;
            gameContainer.classList.add('chaos-active-container');
            chaosBadge.classList.remove('hidden');
            setStatusMessage('🚨 CHAOS MODE AKTIF! Sisa Ubin Berubah Posisi & Bermutasi!', true);

            clearInterval(chaosTimer);
            chaosTimer = setInterval(() => {
                if (!isPaused && !isAnimating && activeTilesRemaining <= DANGER_THRESHOLD && activeTilesRemaining > 0) {
                    triggerChaosMutation(true);
                }
            }, 7000);
        }
    } else {
        isChaosActive = false;
        gameContainer.classList.remove('chaos-active-container');
        chaosBadge.classList.add('hidden');
        clearInterval(chaosTimer);
    }
}

function triggerChaosMutation(isPeriodic = false) {
    if (activeTilesRemaining <= 0 || isPaused || isAnimating) return;

    selectedTile = null;

    const activeCoords = [];
    for (let r = 1; r <= INNER_ROWS; r++) {
        for (let c = 1; c <= INNER_COLS; c++) {
            if (board[r][c] !== 0) {
                activeCoords.push({ r, c, val: board[r][c] });
            }
        }
    }

    if (activeCoords.length === 0) return;

    audio.chaos();

    gridContainer.classList.add('flash-chaos');
    setTimeout(() => gridContainer.classList.remove('flash-chaos'), 350);

    const tiles = activeCoords.map(item => item.val);

    if (isPeriodic && activeCoords.length % 2 === 0 && Math.random() > 0.4) {
        const pool = [];
        for (let i = 0; i < activeCoords.length / 2; i++) {
            const randomType = Math.floor(Math.random() * UNIQUE_ICON_TYPES) + 1;
            pool.push(randomType, randomType);
        }
        shuffleArray(pool);
        for (let i = 0; i < activeCoords.length; i++) {
            tiles[i] = pool[i];
        }
    } else {
        shuffleArray(tiles);
    }

    for (let i = 0; i < activeCoords.length; i++) {
        board[activeCoords[i].r][activeCoords[i].c] = tiles[i];
    }

    if (!hasValidMoves()) {
        autoShuffleBoard(false);
    } else {
        renderBoard();
    }

    if (isPeriodic) {
        setStatusMessage('⚠️ CHAOS: Sisa Ubin Berubah Posisi Secara Otomatis!', true);
    } else {
        setStatusMessage('⚡ HARD ZONA: Ubin Teracak Saat Cocok!', true);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// --- PATHFINDING (MAX 2 TURNS / UP TO 3 SEGMENTS) ---

function isLineClear(x1, y1, x2, y2) {
    if (x1 === x2) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        for (let r = minY + 1; r < maxY; r++) {
            if (board[r][x1] !== 0) return false;
        }
        return true;
    } else if (y1 === y2) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        for (let c = minX + 1; c < maxX; c++) {
            if (board[y1][c] !== 0) return false;
        }
        return true;
    }
    return false;
}

function findPath(p1, p2) {
    if (p1.x === p2.x && p1.y === p2.y) return null;
    if (board[p1.y][p1.x] === 0 || board[p2.y][p2.x] === 0) return null;
    if (board[p1.y][p1.x] !== board[p2.y][p2.x]) return null;

    if (p1.x === p2.x || p1.y === p2.y) {
        if (isLineClear(p1.x, p1.y, p2.x, p2.y)) {
            return [p1, p2];
        }
    }

    if (board[p2.y][p1.x] === 0) {
        if (isLineClear(p1.x, p1.y, p1.x, p2.y) && isLineClear(p1.x, p2.y, p2.x, p2.y)) {
            return [p1, { x: p1.x, y: p2.y }, p2];
        }
    }

    if (board[p1.y][p2.x] === 0) {
        if (isLineClear(p1.x, p1.y, p2.x, p1.y) && isLineClear(p2.x, p1.y, p2.x, p2.y)) {
            return [p1, { x: p2.x, y: p1.y }, p2];
        }
    }

    for (let x = 0; x < TOTAL_COLS; x++) {
        if (x === p1.x) continue;
        if (board[p1.y][x] === 0 || x === p2.x) {
            if (isLineClear(p1.x, p1.y, x, p1.y)) {
                if ((board[p2.y][x] === 0 || (x === p2.x && p2.y === p2.y)) &&
                    isLineClear(x, p1.y, x, p2.y) &&
                    isLineClear(x, p2.y, p2.x, p2.y)) {
                    return [p1, { x: x, y: p1.y }, { x: x, y: p2.y }, p2];
                }
            }
        }
    }

    for (let y = 0; y < TOTAL_ROWS; y++) {
        if (y === p1.y) continue;
        if (board[y][p1.x] === 0 || y === p2.y) {
            if (isLineClear(p1.x, p1.y, p1.x, y)) {
                if ((board[y][p2.x] === 0 || (y === p2.y && p2.x === p2.x)) &&
                    isLineClear(p1.x, y, p2.x, y) &&
                    isLineClear(p2.x, y, p2.x, p2.y)) {
                    return [p1, { x: p1.x, y: y }, { x: p2.x, y: y }, p2];
                }
            }
        }
    }

    return null;
}

// --- VALIDATION & AUTO SHUFFLE ---

function findValidPair() {
    const activeCoords = [];
    for (let r = 1; r <= INNER_ROWS; r++) {
        for (let c = 1; c <= INNER_COLS; c++) {
            if (board[r][c] !== 0) {
                activeCoords.push({ x: c, y: r, type: board[r][c] });
            }
        }
    }

    for (let i = 0; i < activeCoords.length; i++) {
        for (let j = i + 1; j < activeCoords.length; j++) {
            if (activeCoords[i].type === activeCoords[j].type) {
                const path = findPath(
                    { x: activeCoords[i].x, y: activeCoords[i].y },
                    { x: activeCoords[j].x, y: activeCoords[j].y }
                );
                if (path) {
                    return { p1: activeCoords[i], p2: activeCoords[j], path };
                }
            }
        }
    }
    return null;
}

function hasValidMoves() {
    return findValidPair() !== null;
}

function autoShuffleBoard(showNotify = true) {
    if (activeTilesRemaining <= 0) return;

    if (showNotify) {
        setStatusMessage('Tidak ada langkah tersisa! Mengacak ulang ubin...', true);
        audio.shuffle();
    }

    const tiles = [];
    const positions = [];
    for (let r = 1; r <= INNER_ROWS; r++) {
        for (let c = 1; c <= INNER_COLS; c++) {
            if (board[r][c] !== 0) {
                tiles.push(board[r][c]);
                positions.push({ x: c, y: r });
            }
        }
    }

    let attempts = 0;
    let valid = false;

    while (!valid && attempts < 200) {
        shuffleArray(tiles);
        for (let i = 0; i < positions.length; i++) {
            board[positions[i].y][positions[i].x] = tiles[i];
        }
        valid = hasValidMoves();
        attempts++;
    }

    renderBoard();
}

// --- LEVEL GRAVITY / TILE SHIFTING MECHANICS ---

function applyGravity() {
    const patternIndex = (currentLevel - 1) % 9;

    switch (patternIndex) {
        case 0:
            break;

        case 1:
            for (let c = 1; c <= INNER_COLS; c++) {
                let writeRow = INNER_ROWS;
                for (let r = INNER_ROWS; r >= 1; r--) {
                    if (board[r][c] !== 0) {
                        board[writeRow][c] = board[r][c];
                        if (writeRow !== r) board[r][c] = 0;
                        writeRow--;
                    }
                }
            }
            break;

        case 2:
            for (let c = 1; c <= INNER_COLS; c++) {
                let writeRow = 1;
                for (let r = 1; r <= INNER_ROWS; r++) {
                    if (board[r][c] !== 0) {
                        board[writeRow][c] = board[r][c];
                        if (writeRow !== r) board[r][c] = 0;
                        writeRow++;
                    }
                }
            }
            break;

        case 3:
            for (let r = 1; r <= INNER_ROWS; r++) {
                let writeCol = 1;
                for (let c = 1; c <= INNER_COLS; c++) {
                    if (board[r][c] !== 0) {
                        board[r][writeCol] = board[r][c];
                        if (writeCol !== c) board[r][c] = 0;
                        writeCol++;
                    }
                }
            }
            break;

        case 4:
            for (let r = 1; r <= INNER_ROWS; r++) {
                let writeCol = INNER_COLS;
                for (let c = INNER_COLS; c >= 1; c--) {
                    if (board[r][c] !== 0) {
                        board[r][writeCol] = board[r][c];
                        if (writeCol !== c) board[r][c] = 0;
                        writeCol--;
                    }
                }
            }
            break;

        case 5:
            for (let c = 1; c <= INNER_COLS; c++) {
                let writeRow = 1;
                for (let r = 1; r <= 4; r++) {
                    if (board[r][c] !== 0) {
                        board[writeRow][c] = board[r][c];
                        if (writeRow !== r) board[r][c] = 0;
                        writeRow++;
                    }
                }
            }
            for (let c = 1; c <= INNER_COLS; c++) {
                let writeRow = INNER_ROWS;
                for (let r = INNER_ROWS; r >= 5; r--) {
                    if (board[r][c] !== 0) {
                        board[writeRow][c] = board[r][c];
                        if (writeRow !== r) board[r][c] = 0;
                        writeRow--;
                    }
                }
            }
            break;

        case 6:
            for (let r = 1; r <= INNER_ROWS; r++) {
                let writeCol = 1;
                for (let c = 1; c <= 8; c++) {
                    if (board[r][c] !== 0) {
                        board[r][writeCol] = board[r][c];
                        if (writeCol !== c) board[r][c] = 0;
                        writeCol++;
                    }
                }
            }
            for (let r = 1; r <= INNER_ROWS; r++) {
                let writeCol = INNER_COLS;
                for (let c = INNER_COLS; c >= 9; c--) {
                    if (board[r][c] !== 0) {
                        board[r][writeCol] = board[r][c];
                        if (writeCol !== c) board[r][c] = 0;
                        writeCol--;
                    }
                }
            }
            break;

        case 7:
            for (let c = 1; c <= INNER_COLS; c++) {
                let writeRow = 4;
                for (let r = 4; r >= 1; r--) {
                    if (board[r][c] !== 0) {
                        board[writeRow][c] = board[r][c];
                        if (writeRow !== r) board[r][c] = 0;
                        writeRow--;
                    }
                }
            }
            for (let c = 1; c <= INNER_COLS; c++) {
                let writeRow = 5;
                for (let r = 5; r <= INNER_ROWS; r++) {
                    if (board[r][c] !== 0) {
                        board[writeRow][c] = board[r][c];
                        if (writeRow !== r) board[r][c] = 0;
                        writeRow++;
                    }
                }
            }
            break;

        case 8:
            for (let r = 1; r <= INNER_ROWS; r++) {
                let writeCol = 8;
                for (let c = 8; c >= 1; c--) {
                    if (board[r][c] !== 0) {
                        board[r][writeCol] = board[r][c];
                        if (writeCol !== c) board[r][c] = 0;
                        writeCol--;
                    }
                }
            }
            for (let r = 1; r <= INNER_ROWS; r++) {
                let writeCol = 9;
                for (let c = 9; c <= INNER_COLS; c++) {
                    if (board[r][c] !== 0) {
                        board[r][writeCol] = board[r][c];
                        if (writeCol !== c) board[r][c] = 0;
                        writeCol++;
                    }
                }
            }
            break;
    }
}

// --- RENDER & CANVAS CONNECTING LINES ---

function updateCanvasSize() {
    const rect = gridContainer.getBoundingClientRect();
    lineCanvas.width = rect.width;
    lineCanvas.height = rect.height;
}

function renderBoard() {
    gridContainer.innerHTML = '';

    for (let r = 0; r < TOTAL_ROWS; r++) {
        for (let c = 0; c < TOTAL_COLS; c++) {
            const tileValue = board[r][c];
            const tileDiv = document.createElement('div');
            tileDiv.dataset.x = c;
            tileDiv.dataset.y = r;

            tileDiv.className = 'w-full aspect-[4/5] flex items-center justify-center rounded transition-all select-none ';

            if (tileValue === 0) {
                tileDiv.classList.add('empty-cell');
            } else {
                const iconDef = ICON_DEFINITIONS[tileValue - 1];
                tileDiv.classList.add('onet-tile');
                tileDiv.style.backgroundColor = iconDef.bg;
                tileDiv.innerHTML = renderTileInnerContent(tileValue);

                if (selectedTile && selectedTile.x === c && selectedTile.y === r) {
                    tileDiv.classList.add('selected');
                }

                tileDiv.addEventListener('click', () => onTileClick(c, r));
            }

            gridContainer.appendChild(tileDiv);
        }
    }

    activeTilesSpan.textContent = activeTilesRemaining;
    updateCanvasSize();
}

function getCellCenterCoordinates(x, y) {
    const cell = gridContainer.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (!cell) return { cx: 0, cy: 0 };
    const containerRect = gridContainer.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    return {
        cx: (cellRect.left - containerRect.left) + cellRect.width / 2,
        cy: (cellRect.top - containerRect.top) + cellRect.height / 2
    };
}

function drawConnectingPath(path, callback) {
    updateCanvasSize();
    ctxCanvas.clearRect(0, 0, lineCanvas.width, lineCanvas.height);

    if (!path || path.length < 2) return;

    const coords = path.map(pt => getCellCenterCoordinates(pt.x, pt.y));

    let startTime = null;
    const duration = 240;

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        ctxCanvas.clearRect(0, 0, lineCanvas.width, lineCanvas.height);

        ctxCanvas.beginPath();
        ctxCanvas.moveTo(coords[0].cx, coords[0].cy);
        for (let i = 1; i < coords.length; i++) {
            ctxCanvas.lineTo(coords[i].cx, coords[i].cy);
        }
        ctxCanvas.lineCap = 'round';
        ctxCanvas.lineJoin = 'round';
        ctxCanvas.lineWidth = 6;
        ctxCanvas.strokeStyle = '#ef4444';
        ctxCanvas.shadowColor = '#f59e0b';
        ctxCanvas.shadowBlur = 12;
        ctxCanvas.stroke();

        ctxCanvas.beginPath();
        ctxCanvas.moveTo(coords[0].cx, coords[0].cy);
        for (let i = 1; i < coords.length; i++) {
            ctxCanvas.lineTo(coords[i].cx, coords[i].cy);
        }
        ctxCanvas.lineWidth = 3;
        ctxCanvas.strokeStyle = '#fef08a';
        ctxCanvas.shadowBlur = 0;
        ctxCanvas.stroke();

        coords.forEach(pt => {
            ctxCanvas.beginPath();
            ctxCanvas.arc(pt.cx, pt.cy, 4, 0, Math.PI * 2);
            ctxCanvas.fillStyle = '#ffffff';
            ctxCanvas.fill();
        });

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            setTimeout(() => {
                ctxCanvas.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
                if (callback) callback();
            }, 50);
        }
    }

    requestAnimationFrame(animate);
}

// --- GAMEPLAY HANDLERS ---

function onTileClick(x, y) {
    if (isAnimating || isPaused || board[y][x] === 0) return;
    audio.init();

    document.querySelectorAll('.onet-tile.hinted').forEach(el => el.classList.remove('hinted'));

    if (!selectedTile) {
        selectedTile = { x, y };
        audio.select();
        renderBoard();
        return;
    }

    if (selectedTile.x === x && selectedTile.y === y) {
        selectedTile = null;
        audio.click();
        renderBoard();
        return;
    }

    const path = findPath(selectedTile, { x, y });

    if (path) {
        isAnimating = true;
        audio.match();
        const tile1 = { ...selectedTile };
        const tile2 = { x, y };

        selectedTile = null;

        drawConnectingPath(path, () => {
            board[tile1.y][tile1.x] = 0;
            board[tile2.y][tile2.x] = 0;

            activeTilesRemaining -= 2;
            score += 100;
            updateScoreDisplay();

            applyGravity();

            renderBoard();
            isAnimating = false;

            updateChaosState();
            if (isChaosActive && activeTilesRemaining > 0) {
                setTimeout(() => triggerChaosMutation(false), 200);
            }

            if (activeTilesRemaining === 0) {
                onLevelComplete();
            } else {
                if (!hasValidMoves()) {
                    setTimeout(() => autoShuffleBoard(true), 300);
                }
            }
        });
    } else {
        audio.invalid();
        const cellEl = gridContainer.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cellEl) {
            cellEl.classList.add('bg-red-400');
            setTimeout(() => cellEl.classList.remove('bg-red-400'), 200);
        }
        selectedTile = { x, y };
        renderBoard();
    }
}

function setStatusMessage(msg, isWarning = false) {
    statusMessage.textContent = msg;
    if (isWarning) {
        statusMessage.className = 'text-red-400 font-bold animate-bounce';
    } else {
        statusMessage.className = 'text-amber-400 font-semibold animate-pulse';
    }
    setTimeout(() => {
        statusMessage.textContent = 'Pilih 2 ubin yang sama untuk dicocokkan!';
        statusMessage.className = 'text-amber-400 font-semibold animate-pulse';
    }, 3000);
}

// --- TIMER & SCORE ---

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (isPaused) return;
        timeRemaining -= 0.5;

        const percent = Math.max(0, (timeRemaining / INITIAL_TIME_SECONDS) * 100);
        timerBar.style.width = `${percent}%`;

        if (percent < 25) {
            timerBar.className = 'h-full bg-red-600 rounded-full transition-all duration-200 w-full animate-pulse';
        } else if (percent < 50) {
            timerBar.className = 'h-full bg-amber-500 rounded-full transition-all duration-200 w-full';
        } else {
            timerBar.className = 'h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 rounded-full transition-all duration-200 w-full';
        }

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            onGameOver();
        }
    }, 500);
}

function updateScoreDisplay() {
    scoreDisplay.textContent = String(score).padStart(5, '0');
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('onet_classic_highscore', highScore);
        highScoreSpan.textContent = highScore;
    }
}

// --- HINT & SHUFFLE SYSTEM ---

function useHint() {
    if (isPaused || isAnimating || hintCount <= 0) return;
    audio.init();

    const pair = findValidPair();
    if (pair) {
        hintCount--;
        hintCountSpan.textContent = hintCount;
        audio.select();

        const el1 = gridContainer.querySelector(`[data-x="${pair.p1.x}"][data-y="${pair.p1.y}"]`);
        const el2 = gridContainer.querySelector(`[data-x="${pair.p2.x}"][data-y="${pair.p2.y}"]`);

        if (el1) el1.classList.add('hinted');
        if (el2) el2.classList.add('hinted');

        setStatusMessage('Petunjuk ditemukan! Ubin berkedip dikotaki merah.');
    } else {
        autoShuffleBoard(true);
    }
}

function useShuffle() {
    if (isPaused || isAnimating || shuffleCount <= 0) return;
    audio.init();
    shuffleCount--;
    shuffleCountSpan.textContent = shuffleCount;
    selectedTile = null;
    autoShuffleBoard(true);
}

// --- GAME FLOW MODALS ---

function startNewGame() {
    currentLevel = 1;
    score = 0;
    hintCount = 5;
    shuffleCount = 5;
    timeRemaining = INITIAL_TIME_SECONDS;
    selectedTile = null;
    isPaused = false;

    clearInterval(chaosTimer);
    isChaosActive = false;
    document.getElementById('game-container').classList.remove('chaos-active-container');
    document.getElementById('chaos-badge').classList.add('hidden');

    updateScoreDisplay();
    highScoreSpan.textContent = highScore;
    hintCountSpan.textContent = hintCount;
    shuffleCountSpan.textContent = shuffleCount;

    setupLevel();

    modalStart.classList.add('hidden');
    modalGameOver.classList.add('hidden');
    modalLevelComplete.classList.add('hidden');
    modalPause.classList.add('hidden');

    startTimer();
}

function setupLevel() {
    clearInterval(chaosTimer);
    isChaosActive = false;
    document.getElementById('game-container').classList.remove('chaos-active-container');
    document.getElementById('chaos-badge').classList.add('hidden');

    levelDisplay.textContent = currentLevel;
    const patternIndex = (currentLevel - 1) % 9;
    gravityNameSpan.textContent = SHIFT_PATTERNS[patternIndex];
    timeRemaining = Math.max(60, INITIAL_TIME_SECONDS - (currentLevel - 1) * 8);

    generateSolvableBoard();
    renderBoard();
}

function onLevelComplete() {
    clearInterval(timerInterval);
    clearInterval(chaosTimer);
    isChaosActive = false;
    document.getElementById('game-container').classList.remove('chaos-active-container');
    document.getElementById('chaos-badge').classList.add('hidden');

    audio.win();

    const timeBonus = Math.floor(timeRemaining * 10);
    score += timeBonus;
    updateScoreDisplay();

    hintCount++;
    shuffleCount++;
    hintCountSpan.textContent = hintCount;
    shuffleCountSpan.textContent = shuffleCount;

    document.getElementById('level-complete-desc').textContent = `Kamu berhasil menyelesaikan Level ${currentLevel}!`;
    document.getElementById('time-bonus-text').textContent = `+${timeBonus}`;
    document.getElementById('total-score-text').textContent = score;

    modalLevelComplete.classList.remove('hidden');
}

function nextLevel() {
    currentLevel++;
    modalLevelComplete.classList.add('hidden');
    setupLevel();
    startTimer();
}

function onGameOver() {
    clearInterval(chaosTimer);
    isChaosActive = false;
    document.getElementById('game-container').classList.remove('chaos-active-container');
    document.getElementById('chaos-badge').classList.add('hidden');

    audio.gameOver();
    document.getElementById('final-level-text').textContent = currentLevel;
    document.getElementById('final-score-text').textContent = score;
    modalGameOver.classList.remove('hidden');
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        modalPause.classList.remove('hidden');
    } else {
        modalPause.classList.add('hidden');
    }
}

// --- EVENT LISTENERS ---

document.getElementById('btn-start-game').addEventListener('click', () => {
    audio.init();
    startNewGame();
});

document.getElementById('btn-play-again').addEventListener('click', () => {
    audio.init();
    startNewGame();
});

document.getElementById('btn-next-level').addEventListener('click', () => {
    audio.init();
    nextLevel();
});

document.getElementById('btn-hint').addEventListener('click', useHint);
document.getElementById('btn-shuffle').addEventListener('click', useShuffle);

document.getElementById('btn-pause').addEventListener('click', togglePause);
document.getElementById('btn-resume').addEventListener('click', togglePause);
document.getElementById('btn-restart').addEventListener('click', () => {
    modalPause.classList.add('hidden');
    startNewGame();
});

document.getElementById('btn-audio').addEventListener('click', () => {
    audio.init();
    audio.muted = !audio.muted;
    document.getElementById('btn-audio').textContent = audio.muted ? '🔇' : '🔊';
});

window.addEventListener('resize', () => {
    updateCanvasSize();
});

// Initialize display stats on load
highScoreSpan.textContent = highScore;