/**
 * 땅따먹기 대격돌! (Land Grab Battle)
 * Core Game Logic & Audio Synthesis Engine
 */

// Sound Synthesizer via Web Audio API (Zero external assets needed!)
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  playPop(isUser = true) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = isUser ? 'triangle' : 'sine';
      const startFreq = isUser ? 520 : 380;
      const endFreq = isUser ? 880 : 300;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playWin() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const now = this.audioCtx.currentTime + i * 0.12;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playLose() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
      notes.forEach((freq, i) => {
        const now = this.audioCtx.currentTime + i * 0.14;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.28);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playDraw() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const notes = [440, 554.37, 440];
      notes.forEach((freq, i) => {
        const now = this.audioCtx.currentTime + i * 0.16;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playSteal() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.18);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  playInvalid() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }
}

// Confetti Particle System
class ConfettiSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x = window.innerWidth / 2, y = window.innerHeight / 2) {
    const colors = ['#29b6f6', '#1e88e5', '#ff7043', '#e53935', '#f59e0b', '#10b981', '#ec4899'];
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.25,
        opacity: 1,
        fadeSpeed: Math.random() * 0.015 + 0.01
      });
    }

    if (!this.animationId) {
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotSpeed;
      p.opacity -= p.fadeSpeed;

      if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.loop());
    } else {
      this.animationId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  clear() {
    this.particles = [];
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Game State & Controller
class LandGrabGame {
  constructor() {
    this.boardSize = 6; // default 6x6
    this.totalCells = 36;
    this.boardState = []; // null | 'user' | 'comp'
    this.isUserTurn = true;
    this.isGameOver = false;
    this.lastActionIdx = -1;

    // Turn / Chances Limit (20 chances each)
    this.maxChances = 20;
    this.userChances = 20;
    this.compChances = 20;

    // DOM Elements
    this.boardEl = document.getElementById('game-board');
    this.userScoreEl = document.getElementById('user-score');
    this.compScoreEl = document.getElementById('comp-score');
    this.userPctEl = document.getElementById('user-percent');
    this.compPctEl = document.getElementById('comp-percent');
    this.userChancesEl = document.getElementById('user-chances');
    this.compChancesEl = document.getElementById('comp-chances');
    this.remainingCountEl = document.getElementById('remaining-count');
    this.turnIndicatorEl = document.getElementById('turn-indicator');
    this.turnTextEl = document.getElementById('turn-text');
    this.cardUserEl = document.getElementById('card-user');
    this.cardCompEl = document.getElementById('card-comp');

    // Progress Bar
    this.barUser = document.getElementById('bar-user');
    this.barNeutral = document.getElementById('bar-neutral');
    this.barComp = document.getElementById('bar-comp');

    // Controls
    this.sizeSelect = document.getElementById('board-size-select');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.soundIcon = document.getElementById('sound-icon');
    this.resetBtn = document.getElementById('reset-btn');
    this.ruleBtn = document.getElementById('rule-btn');

    // Modals
    this.resultModal = document.getElementById('result-modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalSubtitle = document.getElementById('modal-subtitle');
    this.modalIcon = document.getElementById('modal-icon');
    this.modalUserScore = document.getElementById('modal-user-score');
    this.modalCompScore = document.getElementById('modal-comp-score');
    this.modalUserPct = document.getElementById('modal-user-pct');
    this.modalCompPct = document.getElementById('modal-comp-pct');
    this.modalRestartBtn = document.getElementById('modal-restart-btn');

    this.helpModal = document.getElementById('help-modal');
    this.helpCloseBtn = document.getElementById('help-close-btn');
    this.helpOkBtn = document.getElementById('help-ok-btn');

    // Helper Systems
    this.sounds = new SoundManager();
    this.confetti = new ConfettiSystem('fx-canvas');

    this.bindEvents();
    this.initGame();
  }

  bindEvents() {
    this.sizeSelect.addEventListener('change', (e) => {
      this.boardSize = parseInt(e.target.value, 10);
      this.initGame();
    });

    this.soundToggleBtn.addEventListener('click', () => {
      const enabled = this.sounds.toggleSound();
      this.soundIcon.textContent = enabled ? '🔊' : '🔇';
    });

    this.resetBtn.addEventListener('click', () => this.initGame());
    this.modalRestartBtn.addEventListener('click', () => {
      this.hideModal(this.resultModal);
      this.initGame();
    });

    this.ruleBtn.addEventListener('click', () => this.showModal(this.helpModal));
    this.helpCloseBtn.addEventListener('click', () => this.hideModal(this.helpModal));
    this.helpOkBtn.addEventListener('click', () => this.hideModal(this.helpModal));

    // Close help modal on backdrop click
    this.helpModal.addEventListener('click', (e) => {
      if (e.target === this.helpModal) this.hideModal(this.helpModal);
    });
  }

  initGame() {
    this.totalCells = this.boardSize * this.boardSize;
    this.boardState = new Array(this.totalCells).fill(null);
    this.isUserTurn = true;
    this.isGameOver = false;
    this.lastActionIdx = -1;

    // Reset chances to 20 each
    this.userChances = this.maxChances;
    this.compChances = this.maxChances;

    this.confetti.clear();
    this.hideModal(this.resultModal);

    // Update board CSS classes for grid column template
    this.boardEl.className = `game-board grid-${this.boardSize}`;
    this.boardEl.classList.remove('board-locked');

    // Build Board Grid DOM
    this.boardEl.innerHTML = '';
    for (let i = 0; i < this.totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell empty';
      cell.dataset.index = i;
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-label', `칸 ${i + 1}, 비어있음`);
      cell.tabIndex = 0;

      cell.addEventListener('click', () => this.handleCellClick(i));
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCellClick(i);
        }
      });

      this.boardEl.appendChild(cell);
    }

    this.updateStats();
    this.updateTurnDisplay();
  }

  handleCellClick(index) {
    if (this.isGameOver || !this.isUserTurn || this.userChances <= 0) return;

    const currentOwner = this.boardState[index];

    // 1) 이미 자신의 소유인 칸 선택: 무효 행동 (기회 차감 없음, 소유권 변경 없음, 턴 유지)
    if (currentOwner === 'user') {
      this.triggerInvalidAction(index);
      return;
    }

    // 2) 유효한 행동: 기회 1회 차감 & 빈 칸 점령 또는 상대방(컴퓨터) 칸 빼앗기
    this.userChances--;
    const isSteal = (currentOwner === 'comp');
    this.claimCell(index, 'user', isSteal);

    if (isSteal) {
      this.sounds.playSteal();
    } else {
      this.sounds.playPop(true);
    }

    // 3) 게임 종료 조건 검사 (36칸 채워짐 or 기회 소진)
    if (this.checkGameEnd()) {
      return;
    }

    // 4) 컴퓨터에게 기회가 남아있으면 컴퓨터 턴으로 전환
    if (this.compChances > 0) {
      this.isUserTurn = false;
      this.updateTurnDisplay();
      this.boardEl.classList.add('board-locked');

      const thinkingDelay = Math.floor(Math.random() * 140) + 380;
      setTimeout(() => {
        this.computerMove();
      }, thinkingDelay);
    } else {
      // 컴퓨터 기회가 없으면 사용자가 계속 플레이
      this.updateTurnDisplay();
    }
  }

  triggerInvalidAction(index) {
    const cell = this.boardEl.children[index];
    if (cell) {
      cell.classList.remove('shake');
      void cell.offsetWidth; // Force CSS DOM reflow to re-trigger animation
      cell.classList.add('shake');
    }
    this.sounds.playInvalid();
  }

  computerMove() {
    if (this.isGameOver || this.compChances <= 0) return;

    // 컴퓨터가 할 수 있는 유효한 후보군 (자신의 칸은 유효하지 않으므로 제외)
    const emptyIndices = [];
    const userIndices = [];

    for (let i = 0; i < this.totalCells; i++) {
      if (this.boardState[i] === null) {
        emptyIndices.push(i);
      } else if (this.boardState[i] === 'user') {
        userIndices.push(i);
      }
    }

    // 행동 결정 (빈 칸 선점 vs 상대방 칸 빼앗기)
    let targetIdx = -1;
    let isSteal = false;

    if (emptyIndices.length > 0) {
      // 빈 칸이 아직 남아있을 때 약 32% 확률로 플레이어 땅 빼앗기
      const shouldSteal = userIndices.length > 0 && Math.random() < 0.32 && emptyIndices.length > 2;

      if (shouldSteal) {
        targetIdx = userIndices[Math.floor(Math.random() * userIndices.length)];
        isSteal = true;
      } else {
        targetIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        isSteal = false;
      }
    } else if (userIndices.length > 0) {
      targetIdx = userIndices[Math.floor(Math.random() * userIndices.length)];
      isSteal = true;
    }

    if (targetIdx >= 0) {
      this.compChances--;
      this.claimCell(targetIdx, 'comp', isSteal);
      if (isSteal) {
        this.sounds.playSteal();
      } else {
        this.sounds.playPop(false);
      }
    }

    this.boardEl.classList.remove('board-locked');

    // 게임 종료 여부 검사
    if (this.checkGameEnd()) {
      return;
    }

    // 사용자에게 기회가 남아있으면 사용자 턴으로 전환
    if (this.userChances > 0) {
      this.isUserTurn = true;
      this.updateTurnDisplay();
    } else if (this.compChances > 0) {
      // 사용자 기회가 없으면 컴퓨터가 계속 진행
      this.updateTurnDisplay();
      this.boardEl.classList.add('board-locked');
      setTimeout(() => this.computerMove(), 450);
    }
  }

  claimCell(index, owner, isSteal = false) {
    this.boardState[index] = owner;

    // 이전 마지막 액션 하이라이트 해제
    if (this.lastActionIdx >= 0 && this.boardEl.children[this.lastActionIdx]) {
      this.boardEl.children[this.lastActionIdx].classList.remove('last-action');
    }

    const cell = this.boardEl.children[index];
    cell.classList.remove('empty', 'shake', 'owner-user', 'owner-comp');
    cell.classList.add(owner === 'user' ? 'owner-user' : 'owner-comp');
    cell.classList.add('last-action');

    if (isSteal) {
      cell.classList.remove('stolen');
      void cell.offsetWidth;
      cell.classList.add('stolen');
    }

    this.lastActionIdx = index;

    // 마커 아이콘 생성/교체
    const marker = document.createElement('span');
    marker.className = 'cell-marker';
    marker.textContent = owner === 'user' ? '🏰' : '🚩';
    cell.innerHTML = '';
    cell.appendChild(marker);

    cell.setAttribute('aria-label', `칸 ${index + 1}, ${owner === 'user' ? '플레이어 1(파랑)' : '컴퓨터(빨강)'} 점령`);

    // 점수 및 통계 즉시 갱신
    this.updateStats();
  }

  updateStats() {
    let userScore = 0;
    let compScore = 0;
    let emptyCount = 0;

    // 실제 보드 상태를 기준으로 점수 계산
    for (let i = 0; i < this.totalCells; i++) {
      if (this.boardState[i] === 'user') userScore++;
      else if (this.boardState[i] === 'comp') compScore++;
      else emptyCount++;
    }

    const userPct = ((userScore / this.totalCells) * 100).toFixed(1);
    const compPct = ((compScore / this.totalCells) * 100).toFixed(1);
    const neutralPct = ((emptyCount / this.totalCells) * 100).toFixed(1);

    this.userScoreEl.textContent = userScore;
    this.compScoreEl.textContent = compScore;
    this.userPctEl.textContent = `(${userPct}%)`;
    this.compPctEl.textContent = `(${compPct}%)`;
    this.remainingCountEl.textContent = emptyCount;

    // 기회 표시 갱신
    if (this.userChancesEl) this.userChancesEl.textContent = this.userChances;
    if (this.compChancesEl) this.compChancesEl.textContent = this.compChances;

    // Progress bar segments
    this.barUser.style.width = `${userPct}%`;
    this.barNeutral.style.width = `${neutralPct}%`;
    this.barComp.style.width = `${compPct}%`;
  }

  updateTurnDisplay() {
    const turnDot = this.turnIndicatorEl.querySelector('.turn-dot');
    if (this.isUserTurn) {
      this.turnTextEl.textContent = `내 차례! (남은 기회: ${this.userChances}회) ⚔️`;
      turnDot.classList.remove('comp-turn');
      this.cardUserEl.classList.add('active-turn');
      this.cardCompEl.classList.remove('active-turn');
    } else {
      this.turnTextEl.textContent = `컴퓨터 차례! (남은 기회: ${this.compChances}회) 🤖`;
      turnDot.classList.add('comp-turn');
      this.cardUserEl.classList.remove('active-turn');
      this.cardCompEl.classList.add('active-turn');
    }
  }

  checkGameEnd() {
    // 36칸이 모두 채워졌거나, 양측 모두 20번의 기회를 모두 소진했을 때
    const hasEmpty = this.boardState.some(state => state === null);
    const bothChancesExhausted = (this.userChances <= 0 && this.compChances <= 0);

    if (!hasEmpty || bothChancesExhausted) {
      this.endGame();
      return true;
    }
    return false;
  }

  endGame() {
    this.isGameOver = true;
    // 게임 종료 후 추가 입력 완전 차단
    this.boardEl.classList.add('board-locked');
    this.cardUserEl.classList.remove('active-turn');
    this.cardCompEl.classList.remove('active-turn');

    // 실제 보드 상태를 기준으로 최종 점수 계산
    let userScore = 0;
    let compScore = 0;
    for (const owner of this.boardState) {
      if (owner === 'user') userScore++;
      else if (owner === 'comp') compScore++;
    }

    const userPct = ((userScore / this.totalCells) * 100).toFixed(1);
    const compPct = ((compScore / this.totalCells) * 100).toFixed(1);

    this.modalUserScore.textContent = userScore;
    this.modalCompScore.textContent = compScore;
    this.modalUserPct.textContent = `${userPct}% 점유`;
    this.modalCompPct.textContent = `${compPct}% 점유`;

    // 승리 판정: 플레이어 1 점수가 높으면 승리, 플레이어 2가 높으면 패배, 같을 때만 무승부
    if (userScore > compScore) {
      // 플레이어 1 승리
      this.modalIcon.textContent = '🏆';
      this.modalTitle.textContent = '플레이어 1 승리!';
      this.modalSubtitle.textContent = `축하합니다! 총 20번의 기회 속에서 ${userScore}칸을 차지하여 컴퓨터(${compScore}칸)를 꺾고 승리했습니다!`;
      this.sounds.playWin();
      this.confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4);
      setTimeout(() => this.confetti.burst(window.innerWidth * 0.25, window.innerHeight * 0.5), 300);
      setTimeout(() => this.confetti.burst(window.innerWidth * 0.75, window.innerHeight * 0.5), 600);
    } else if (userScore < compScore) {
      // 플레이어 2(컴퓨터) 승리
      this.modalIcon.textContent = '🤖';
      this.modalTitle.textContent = '컴퓨터(플레이어 2) 승리!';
      this.modalSubtitle.textContent = `컴퓨터가 ${compScore}칸을 차지하여 승리했습니다 (${userScore} : ${compScore}). 다음 판에서 도전해보세요!`;
      this.sounds.playLose();
    } else {
      // 두 플레이어의 점수가 같을 때만 무승부
      this.modalIcon.textContent = '🤝';
      this.modalTitle.textContent = '팽팽한 무승부!';
      this.modalSubtitle.textContent = `양측 모두 20번의 기회를 모두 사용하고 정확히 ${userScore}칸씩 차지해 무승부로 끝났습니다!`;
      this.sounds.playDraw();
    }

    setTimeout(() => {
      this.showModal(this.resultModal);
    }, 450);
  }

  showModal(modal) {
    modal.classList.remove('hidden');
  }

  hideModal(modal) {
    modal.classList.add('hidden');
  }
}

// Boot game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new LandGrabGame();
});
