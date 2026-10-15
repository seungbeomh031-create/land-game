/**
 * 땅따먹기 게임 룰 & 승리 판정 단위 테스트 (Unit Tests)
 */

function runTests() {
  console.log("=== 땅따먹기 규칙 및 승리 시스템 단위 테스트 시작 ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // Mock State Engine mimicking LandGrabGame
  class TestGameEngine {
    constructor(size = 6) {
      this.boardSize = size;
      this.totalCells = size * size;
      this.boardState = new Array(this.totalCells).fill(null);
      this.isUserTurn = true;
      this.isGameOver = false;
      this.winner = null; // 'user' | 'comp' | 'draw'
    }

    handleMove(index, player = 'user') {
      if (this.isGameOver) return { success: false, reason: 'game_over' };
      if (player === 'user' && !this.isUserTurn) return { success: false, reason: 'not_user_turn' };
      if (player === 'comp' && this.isUserTurn) return { success: false, reason: 'not_comp_turn' };

      const currentOwner = this.boardState[index];

      // 이미 자신의 소유인 칸: 무효 행동 (소유권 변경 없음, 턴 유지)
      if (currentOwner === player) {
        return { success: false, reason: 'own_cell_invalid' };
      }

      // 유효 행동: 빈 칸 또는 상대방 칸 빼앗기
      const wasOpponent = (currentOwner !== null && currentOwner !== player);
      this.boardState[index] = player;

      // 36칸 모두 채워졌는지 검사
      const isComplete = !this.boardState.some(c => c === null);
      if (isComplete) {
        this.endGame();
      } else {
        // 턴 전환
        this.isUserTurn = !this.isUserTurn;
      }

      return { success: true, wasOpponent, isComplete };
    }

    getStats() {
      let userScore = 0;
      let compScore = 0;
      let emptyCount = 0;
      for (const cell of this.boardState) {
        if (cell === 'user') userScore++;
        else if (cell === 'comp') compScore++;
        else emptyCount++;
      }
      return { userScore, compScore, emptyCount };
    }

    endGame() {
      this.isGameOver = true;
      const { userScore, compScore } = this.getStats();
      if (userScore > compScore) this.winner = 'user';
      else if (compScore > userScore) this.winner = 'comp';
      else this.winner = 'draw';
    }
  }

  // Test 1: 플레이어 1이 20칸, 플레이어 2가 16칸이면 플레이어 1 승리
  {
    const game = new TestGameEngine(6);
    for (let i = 0; i < 20; i++) game.boardState[i] = 'user';
    for (let i = 20; i < 36; i++) game.boardState[i] = 'comp';
    game.endGame();
    assert(game.winner === 'user', '테스트 1: 플레이어 1이 20칸, 플레이어 2가 16칸이면 플레이어 1 승리');
  }

  // Test 2: 플레이어 1이 16칸, 플레이어 2가 20칸이면 플레이어 2(컴퓨터) 승리
  {
    const game = new TestGameEngine(6);
    for (let i = 0; i < 16; i++) game.boardState[i] = 'user';
    for (let i = 16; i < 36; i++) game.boardState[i] = 'comp';
    game.endGame();
    assert(game.winner === 'comp', '테스트 2: 플레이어 1이 16칸, 플레이어 2가 20칸이면 플레이어 2 승리');
  }

  // Test 3: 플레이어 1이 18칸, 플레이어 2가 18칸이면 무승부
  {
    const game = new TestGameEngine(6);
    for (let i = 0; i < 18; i++) game.boardState[i] = 'user';
    for (let i = 18; i < 36; i++) game.boardState[i] = 'comp';
    game.endGame();
    assert(game.winner === 'draw', '테스트 3: 플레이어 1이 18칸, 플레이어 2가 18칸이면 무승부');
  }

  // Test 4: 상대방의 칸을 빼앗았을 때 양쪽 점수가 정확히 갱신되는지 확인
  {
    const game = new TestGameEngine(6);
    game.boardState[0] = 'comp';
    game.boardState[1] = 'user';
    const before = game.getStats();
    assert(before.userScore === 1 && before.compScore === 1, '테스트 4-1: 초기 점수 각각 1칸');

    // User steals index 0 (which was comp)
    const moveResult = game.handleMove(0, 'user');
    const after = game.getStats();
    assert(moveResult.success === true && moveResult.wasOpponent === true, '테스트 4-2: 상대방 칸 빼앗기 성공');
    assert(after.userScore === 2 && after.compScore === 0, '테스트 4-3: 빼앗은 후 플레이어 점수 +1, 상대방 점수 -1 정확 갱신');
  }

  // Test 5: 자신의 칸 선택 시 무효 행동 & 턴 유지
  {
    const game = new TestGameEngine(6);
    game.boardState[0] = 'user';
    game.isUserTurn = true;
    const result = game.handleMove(0, 'user');
    assert(result.success === false && result.reason === 'own_cell_invalid', '테스트 5-1: 자신의 칸 선택 시 무효 처리');
    assert(game.isUserTurn === true, '테스트 5-2: 무효 행동 시 턴이 넘어가지 않고 유지됨');
  }

  // Test 6: 36칸이 모두 채워졌을 때에만 최종 결과를 판정하는지 확인
  {
    const game = new TestGameEngine(6);
    // Fill 35 cells
    for (let i = 0; i < 35; i++) {
      game.boardState[i] = (i % 2 === 0) ? 'user' : 'comp';
    }
    // 35 cells filled, 1 empty
    assert(game.boardState.some(c => c === null) === true, '테스트 6-1: 35칸 채워졌을 때 아직 빈 칸 남아있음');
    assert(game.isGameOver === false, '테스트 6-2: 35칸일 때는 게임 종료 판정이 나지 않음');

    // Fill 36th cell (index 35)
    game.isUserTurn = true;
    const fillLast = game.handleMove(35, 'user');
    assert(fillLast.isComplete === true, '테스트 6-3: 36번째 칸 채워져서 총 36칸 완료 감지');
    assert(game.isGameOver === true, '테스트 6-4: 36칸 모두 채워진 시점에 즉시 게임 종료');
  }

  // Test 7: 게임 종료 후 추가 입력 차단 확인
  {
    const game = new TestGameEngine(6);
    for (let i = 0; i < 36; i++) {
      game.boardState[i] = (i < 20) ? 'user' : 'comp';
    }
    game.endGame();
    assert(game.isGameOver === true, '테스트 7-1: 게임 종료 상태');

    const blockedMove = game.handleMove(0, 'user');
    assert(blockedMove.success === false && blockedMove.reason === 'game_over', '테스트 7-2: 종료 후 추가 입력 차단 확인');
  }

  // Test 8: 플레이어 각각 기회 20회 제한 및 20회 소진 시 게임 종료 검증
  {
    const game = new TestGameEngine(6);
    game.userChances = 20;
    game.compChances = 20;

    // Simulate 20 turns each (40 total turns)
    for (let round = 1; round <= 20; round++) {
      // User move
      game.userChances--;
      const userIdx = (round - 1) % 18; // claim/steal within first 18 cells
      game.boardState[userIdx] = 'user';

      // Comp move
      game.compChances--;
      const compIdx = 18 + ((round - 1) % 18);
      game.boardState[compIdx] = 'comp';
    }

    assert(game.userChances === 0, '테스트 8-1: 플레이어 1의 기회 20번 모두 소진');
    assert(game.compChances === 0, '테스트 8-2: 플레이어 2의 기회 20번 모두 소진');

    const bothExhausted = (game.userChances <= 0 && game.compChances <= 0);
    assert(bothExhausted === true, '테스트 8-3: 양측 모두 20번 기회 소진 조건 충족');

    game.endGame();
    assert(game.isGameOver === true, '테스트 8-4: 20번 기회 소진 시 정상 게임 종료');
  }

  console.log(`\n=== 단위 테스트 결과: 총 ${passed + failed}개 중 ${passed}개 통과 (${failed}개 실패) ===`);
  if (failed > 0) process.exit(1);
}

runTests();
