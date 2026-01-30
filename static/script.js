async function discover() {
    const birthDate = document.getElementById('birthDate').value;
    if (!birthDate) {
        alert('생년월일을 선택해주세요.');
        return;
    }

    const resultSection = document.getElementById('resultSection');
    const zodiacName = document.getElementById('zodiacName');
    const zodiacDetails = document.getElementById('zodiacDetails');
    const zodiacImage = document.getElementById('zodiacImage');
    const eventList = document.getElementById('eventList');

    // New elements
    const birthStone = document.getElementById('birthStone');
    const birthFlower = document.getElementById('birthFlower');
    const flowerMeaning = document.getElementById('flowerMeaning');
    const aiPromptText = document.getElementById('aiPromptText');

    try {
        const response = await fetch('/api/discovery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ birth_date: birthDate }),
        });

        if (!response.ok) {
            throw new Error('정보를 불러오는데 실패했습니다.');
        }

        const data = await response.json();

        // Update UI
        zodiacName.innerText = data.zodiac.zodiac_name;
        zodiacDetails.innerHTML = `
            <div style="margin-bottom: 0.5rem;">${data.zodiac.color}색 ${data.zodiac.animal}의 해, ${data.zodiac.element}의 기운을 타고났습니다.</div>
            <div style="font-size: 1.5rem; color: #fbbf24; font-weight: 700;">✨ 당신의 별자리: ${data.star_sign}</div>
        `;
        if (zodiacImage) zodiacImage.src = data.image;

        // Update Healing/Humor Video (Only if container exists)
        const videoContainer = document.getElementById('videoContainer');
        if (videoContainer) {
            const freeVideos = [
                { url: 'https://player.vimeo.com/external/371433846.sd.mp4?s=23117ca26f2cb863cbac4a8618ebfd4e0f47e62d&profile_id=139&oauth2_token_id=57447761', title: '귀여운 강아지 힐링' },
                { url: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c9b26090740924S8f60879685002130e9222B58b&profile_id=139&oauth2_token_id=57447761', title: '평화로운 자연 풍경' },
                { url: 'https://player.vimeo.com/external/394333031.sd.mp4?s=d0092c48D55Aec75908E88E1C87D031024D9C775&profile_id=139&oauth2_token_id=57447761', title: '귀여운 고양이 기지개' },
                { url: 'https://player.vimeo.com/external/400810481.sd.mp4?s=3408ecB6D6D9F362D8C04F1D77C9862215A0F1FE&profile_id=139&oauth2_token_id=57447761', title: '구름 흐르는 산맥' }
            ];
            const randomMedia = freeVideos[Math.floor(Math.random() * freeVideos.length)];
            videoContainer.innerHTML = `
                <video 
                    controls 
                    autoplay 
                    muted 
                    loop 
                    playsinline
                    style="width: 100%; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.3);"
                >
                    <source src="${randomMedia.url}" type="video/mp4">
                    브라우저가 동영상을 지원하지 않습니다.
                </video>
                <div style="margin-top: 1rem;">
                    <span style="font-size: 0.9rem; color: var(--text-dim);">
                        ✨ 오늘의 힐링: <strong>${randomMedia.title}</strong>
                    </span>
                </div>
            `;
        }

        // Update Birth Elements
        birthStone.innerText = data.birth_element.stone;
        birthFlower.innerText = data.birth_element.flower;
        flowerMeaning.innerText = data.birth_element.meaning;

        // Update AI Prompt
        aiPromptText.innerText = data.ai_prompt;

        // Update Population Stats
        const statsGrid = document.getElementById('statsGrid');
        statsGrid.innerHTML = '';

        if (data.population) {
            console.log("Population data received:", data.population);
            const sortedCountries = Object.keys(data.population).sort((a, b) => {
                const priority = { 'global': 1, 'kr': 2, 'south korea': 2 };
                const aKey = a.toLowerCase();
                const bKey = b.toLowerCase();
                const aPrio = priority[aKey] || 3;
                const bPrio = priority[bKey] || 3;
                if (aPrio !== bPrio) return aPrio - bPrio;
                return a.localeCompare(b);
            });
            console.log("DEBUG: Final Sorted Order:", sortedCountries);

            const countryNames = {
                'Global': '전세계',
                'KR': '대한민국',
                'South Korea': '대한민국',
                'US': '미국',
                'CN': '중국',
                'JP': '일본',
                'IN': '인도'
            };

            sortedCountries.forEach(country => {
                const stats = data.population[country];
                const card = document.createElement('div');
                card.className = 'stat-card';
                const displayName = countryNames[country] || country;

                card.innerHTML = `
                    <span class="stat-value">${stats.total.toLocaleString()}명</span>
                    <div class="gender-info">
                        <span class="male">♂ ${stats.male.toLocaleString()}</span>
                        <span class="female">♀ ${stats.female.toLocaleString()}</span>
                    </div>
                    <span class="stat-label">${displayName}</span>
                `;
                statsGrid.innerHTML += card.outerHTML;
            });
        }

        // Update Events
        eventList.innerHTML = '<h3 style="margin-bottom: 1.5rem;">당신이 태어난 날과 연관된 기록</h3>';
        if (data.events && data.events.length > 0) {
            console.log("Raw events data from server:", data.events);
            data.events.forEach(event => {
                const item = document.createElement('div');
                item.className = 'event-item';

                // Robust data handling: check if event is object or string
                const isObj = (typeof event === 'object' && event !== null);
                const year = isObj ? (event.year || '기록') : '역사';
                const text = isObj ? (event.text || event) : event;

                item.innerHTML = `
                    <div class="event-text">
                        <span class="event-year" style="background: var(--accent-color); color: var(--primary-bg); padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-right: 8px;">${year}년</span>
                        <span>${text}</span>
                    </div>
                    <a href="https://www.google.com/search?q=${encodeURIComponent(year + '년 ' + text)}" 
                       target="_blank" class="btn-search">검색</a>
                `;
                eventList.appendChild(item);
            });
        } else {
            eventList.innerHTML += '<p style="color: var(--text-dim);">이 날짜의 기록을 찾을 수 없습니다.</p>';
        }

        // Show result
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        alert(error.message);
    }
}

function copyPrompt() {
    const promptText = document.getElementById('aiPromptText').innerText;
    navigator.clipboard.writeText(promptText).then(() => {
        alert('프롬프트가 복사되었습니다!');
    }).catch(err => {
        console.error('복사 실패:', err);
    });
}

// Tic-Tac-Toe Upgrade Game Logic
let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // User is X
let gameActive = true;
let currentLevel = 1;

// History for Level 2 (Queue up to 3 slots)
let moveHistory = { "X": [], "O": [] };

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

const levelSettings = {
    1: "기본 틱택토: 3줄을 먼저 완성하세요!",
    2: "기록의 틱택토: 4번째 말을 두면 1번째 말이 사라집니다.",
    3: "운명의 틱택토: 상대방 위에 올리면 중립말(N)이 됩니다!",
    4: "중력의 틱택토: 말을 두면 해당 줄의 가장 아래로 떨어집니다!",
    5: "오염의 틱택토 (4x4): 4줄을 완성하세요! 상대 옆에 두면 오염 될 수 있습니다.",
    6: "회전의 틱택토 (4x4): 3턴마다 보드가 90도 회전합니다!",
    7: "슈퍼 틱택토 (Ultimate): 틱택토 안의 틱택토! 최후의 두뇌 싸움입니다."
};

let totalTurns = 0;

// Record Management
let clearRecords = { wins: {}, failures: {} };
async function loadGameRecords() {
    try {
        const response = await fetch('/api/records/get');
        const data = await response.json();
        clearRecords.wins = data.wins || {};
        clearRecords.failures = data.failures || {};
        updateRecordsUI();
    } catch (err) {
        console.error("Failed to load global records:", err);
    }
}

async function incrementRecord(level, type = 'win') {
    try {
        const response = await fetch('/api/records/increment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                level: level.toString(),
                type: type
            })
        });
        const data = await response.json();
        clearRecords.wins = data.wins;
        clearRecords.failures = data.failures;
        updateRecordsUI();
    } catch (err) {
        console.error("Failed to update global records:", err);
    }
}

function updateRecordsUI() {
    const list = document.getElementById('recordsList');
    if (!list) return;
    list.innerHTML = "";
    for (let i = 1; i <= 7; i++) {
        const item = document.createElement('div');
        item.className = 'record-item';
        item.innerHTML = `
            <span class="record-level">LV ${i}</span>
            <div class="record-badges">
                <span class="record-count success" title="성공">${clearRecords.wins[i] || 0}</span>
                <span class="record-count failure" title="실패">${clearRecords.failures[i] || 0}</span>
            </div>
        `;
        list.appendChild(item);
    }
}

function handleCellClick(clickedCellEvent) {
    const cell = clickedCellEvent.target;
    if (!gameActive || currentPlayer === "O") return;

    if (currentLevel === 7) {
        const boardIdx = parseInt(cell.getAttribute('data-board-idx'));
        const cellIdx = parseInt(cell.getAttribute('data-cell-idx'));

        // Check valid board
        if (nextActiveBoard !== -1 && boardIdx !== nextActiveBoard) return;
        // Check already taken in mini-board
        if (miniBoards[boardIdx][cellIdx] !== "") return;
        // Check if mini-board is already decided
        if (globalBoard[boardIdx] !== "") return;

        makeSuperMove(boardIdx, cellIdx);
    } else {
        let index = parseInt(cell.getAttribute('data-index'));
        // Rule for Level 4: Gravity
        if (currentLevel === 4) {
            index = getGravityIndex(index);
            if (index === -1) return; // Column full
        }

        // Rule for Level 3: Overlaying
        if (currentLevel === 3) {
            if (boardState[index] === "N") return;
            if (boardState[index] === "X") return;
        } else {
            if (boardState[index] !== "") return;
        }

        makeMove(index);
    }
}

function getGravityIndex(clickedIndex) {
    const size = currentLevel === 5 ? 4 : 3;
    const col = clickedIndex % size;
    for (let r = size - 1; r >= 0; r--) {
        const idx = r * size + col;
        if (boardState[idx] === "") return idx;
    }
    return -1;
}

function makeMove(index) {
    let targetState = currentPlayer;
    const size = currentLevel === 5 ? 4 : 3;

    // LV 3 Rule: Overlaying
    if (currentLevel === 3 && boardState[index] !== "" && boardState[index] !== currentPlayer) {
        targetState = "N";
    }

    boardState[index] = targetState;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.innerText = targetState;
    cell.className = `cell taken ${targetState.toLowerCase()}`;
    totalTurns++;

    // LV 6 Rule: Rotate every 3 turns
    if (currentLevel === 6 && totalTurns > 0 && totalTurns % 3 === 0) {
        setTimeout(rotateBoard, 500);
    }

    // LV 5, 6 Rule: Infection (LV 6 also inherits Infection for more fun)
    if ((currentLevel === 5 || currentLevel === 6) && targetState !== "N") {
        tryInfection(index);
    }

    // LV 2 Rule: History
    if (currentLevel === 2) {
        moveHistory[currentPlayer].push(index);
        updateFadingHints();
        if (moveHistory[currentPlayer].length > 3) {
            const firstIdx = moveHistory[currentPlayer].shift();
            boardState[firstIdx] = "";
            const firstCell = document.querySelector(`.cell[data-index="${firstIdx}"]`);
            firstCell.innerText = "";
            firstCell.className = "cell";
            updateFadingHints();
        }
    }

    if (checkWin()) {
        const winnerName = currentPlayer === 'X' ? '당신이' : '컴퓨터가';
        document.getElementById('gameStatus').innerText = `✨ ${winnerName} 승리!`;
        gameActive = false;

        if (currentPlayer === 'X') {
            incrementRecord(currentLevel, 'win');
            if (currentLevel < 6) { // Level 6 added, so move until 6
                setTimeout(() => {
                    alert(`축하합니다! ${currentLevel}단계를 클리어했습니다. 다음 레벨로 이동합니다.`);
                    currentLevel++;
                    resetGame(true);
                }, 1000);
            } else if (currentLevel === 6) {
                setTimeout(() => {
                    alert("🌪️ 회전의 난관을 뚫고 7단계 최종 보스에게 도전할 자격을 얻으셨습니다!");
                    currentLevel++;
                    resetGame(true);
                }, 1000);
            } else {
                setTimeout(() => alert("🥇 전설로 남을 고수십니다! 모든 단계를 정복하셨습니다!"), 500);
            }
        } else {
            // Computer wins
            incrementRecord(currentLevel, 'fail');
        }
        return;
    }

    if (!boardState.includes("") && currentLevel !== 2) {
        document.getElementById('gameStatus').innerText = "🤝 비겼습니다!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById('gameStatus').innerText = currentPlayer === "X" ? "당신의 차례입니다 (X)" : "컴퓨터가 생각 중... (O)";

    if (gameActive && currentPlayer === "O") {
        setTimeout(computerMove, 700);
    }
}

function tryInfection(pos) {
    const size = 4;
    const r = Math.floor(pos / size);
    const c = pos % size;
    const opponent = "X"; // Computers turn always tries to infect X

    // Adjacent cells (Up, Down, Left, Right)
    const neighbors = [
        { r: r - 1, c: c }, { r: r + 1, c: c },
        { r: r, c: c - 1 }, { r: r, c: c + 1 }
    ];

    neighbors.forEach(n => {
        if (n.r >= 0 && n.r < size && n.c >= 0 && n.c < size) {
            const idx = n.r * size + n.c;
            const targetPlayer = currentPlayer === "X" ? "O" : "X";
            if (boardState[idx] === targetPlayer && Math.random() < 0.3) { // 30% chance
                boardState[idx] = currentPlayer;
                const nCell = document.querySelector(`.cell[data-index="${idx}"]`);
                nCell.innerText = currentPlayer;
                nCell.className = `cell taken ${currentPlayer.toLowerCase()}`;
                console.log(`Infected index ${idx} to ${currentPlayer}`);
            }
        }
    });
}

function computerMove() {
    if (!gameActive) return;

    // High intelligence: can we win or block?
    const size = currentLevel === 5 ? 4 : 3;
    const winConds = getWinConditions(size);

    const getSim = (idx, player) => {
        let tb = [...boardState];
        if (currentLevel === 3 && tb[idx] !== "" && tb[idx] !== player) tb[idx] = "N";
        else tb[idx] = player;
        return tb;
    };

    // 1. Win
    for (let i = 0; i < size * size; i++) {
        if (canPlaceAt(i, "O")) {
            if (checkWinSim(getSim(i, "O"), "O", winConds)) { doMove(i); return; }
        }
    }

    // 2. Block
    for (let i = 0; i < size * size; i++) {
        if (canPlaceAt(i, "X")) {
            if (checkWinSim(getSim(i, "X"), "X", winConds)) { doMove(i); return; }
        }
    }

    // 3. Middle / Random
    let available = [];
    for (let i = 0; i < size * size; i++) {
        if (canPlaceAt(i, "O")) available.push(i);
    }

    // Favor middle in 4x4 or 3x3
    let mid = size === 3 ? [4] : [5, 6, 9, 10];
    let preferred = mid.filter(m => available.includes(m));
    if (preferred.length > 0) {
        doMove(preferred[Math.floor(Math.random() * preferred.length)]);
    } else {
        doMove(available[Math.floor(Math.random() * available.length)]);
    }
}

function canPlaceAt(index, player) {
    if (currentLevel === 4) {
        const size = 3;
        const col = index % size;
        for (let r = 0; r < size; r++) if (boardState[r * size + col] === "") return true;
        return false;
    }
    if (currentLevel === 3) return boardState[index] !== "N" && boardState[index] !== player;
    return boardState[index] === "";
}

function doMove(index) {
    if (currentLevel === 4) index = getGravityIndex(index);
    makeMove(index);
}

function getWinConditions(size) {
    if (size === 3) return winningConditions;
    let conds = [];
    // Rows
    for (let r = 0; r < 4; r++) conds.push([r * 4, r * 4 + 1, r * 4 + 2, r * 4 + 3]);
    // Cols
    for (let c = 0; c < 4; c++) conds.push([c, c + 4, c + 8, c + 12]);
    // Diagonals
    conds.push([0, 5, 10, 15]);
    conds.push([3, 6, 9, 12]);
    return conds;
}

function checkWinSim(board, player, conds) {
    const ok = (val) => val === player || val === "N";
    return conds.some(c => ok(board[c[0]]) && ok(board[c[1]]) && ok(board[c[2]]) && (c.length < 4 || ok(board[c[3]])));
}

function checkWin() {
    const size = currentLevel === 5 ? 4 : 3;
    return checkWinSim(boardState, currentPlayer, getWinConditions(size));
}

// Super Tic-Tac-Toe State
let miniBoards = Array(9).fill(null).map(() => Array(9).fill(""));
let globalBoard = Array(9).fill("");
let nextActiveBoard = -1; // -1 means free move

function makeSuperMove(bIdx, cIdx) {
    miniBoards[bIdx][cIdx] = currentPlayer;
    const cell = document.querySelector(`.mini-cell[data-board-idx="${bIdx}"][data-cell-idx="${cIdx}"]`);
    cell.innerText = currentPlayer;
    cell.className = `cell mini-cell taken ${currentPlayer.toLowerCase()}`;

    // 1. Check mini-board win
    if (globalBoard[bIdx] === "" && checkWinSim(miniBoards[bIdx], currentPlayer, winningConditions)) {
        globalBoard[bIdx] = currentPlayer;
        const miniBoardEl = document.querySelector(`.mini-board[data-board-idx="${bIdx}"]`);
        miniBoardEl.classList.add(`won-${currentPlayer.toLowerCase()}`);
        miniBoardEl.setAttribute('data-winner', currentPlayer);
    }

    // 2. Set next active board
    nextActiveBoard = cIdx;
    // If the next mini-board is already finished or full, player gets a free move
    if (globalBoard[nextActiveBoard] !== "" || !miniBoards[nextActiveBoard].includes("")) {
        nextActiveBoard = -1;
    }

    // 3. Update UI Visuals
    document.querySelectorAll('.mini-board').forEach((mb, idx) => {
        mb.classList.remove('active');
        if (nextActiveBoard === -1 || idx === nextActiveBoard) {
            if (globalBoard[idx] === "" && miniBoards[idx].includes("")) {
                mb.classList.add('active');
            }
        }
    });

    // 4. Check global win
    if (checkWinSim(globalBoard, currentPlayer, winningConditions)) {
        const winnerName = currentPlayer === 'X' ? '당신이' : '컴퓨터가';
        document.getElementById('gameStatus').innerText = `🏆 슈퍼 틱택토 최종 승리: ${winnerName}!`;
        gameActive = false;
        if (currentPlayer === 'X') {
            incrementRecord(7, 'win');
            setTimeout(() => alert("🎆 전설로 남을 대기록입니다! 당신은 진정한 틱택토의 신입니다!"), 500);
        } else {
            incrementRecord(7, 'fail');
        }
        return;
    }

    if (!globalBoard.includes("") && !Array.prototype.concat(...miniBoards).includes("")) {
        document.getElementById('gameStatus').innerText = "🤝 무승부입니다!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById('gameStatus').innerText = currentPlayer === "X" ? "당신의 차례입니다 (X)" : "컴퓨터가 생각 중... (O)";

    if (gameActive && currentPlayer === "O") {
        setTimeout(computerSuperMove, 800);
    }
}

function computerSuperMove() {
    if (!gameActive) return;

    let targetBoardIdx = nextActiveBoard;
    let availableBoards = [];

    // If free move, choose a board that isn't won or full
    if (targetBoardIdx === -1) {
        for (let i = 0; i < 9; i++) {
            if (globalBoard[i] === "" && miniBoards[i].includes("")) {
                availableBoards.push(i);
            }
        }
        // Priority: center board if empty, else random
        if (availableBoards.includes(4)) targetBoardIdx = 4;
        else targetBoardIdx = availableBoards[Math.floor(Math.random() * availableBoards.length)];
    }

    // AI logic within the target board
    const currentMiniBoard = miniBoards[targetBoardIdx];
    let availableCells = [];
    for (let j = 0; j < 9; j++) {
        if (currentMiniBoard[j] === "") availableCells.push(j);
    }

    // 1. Can win mini-board?
    for (let c of availableCells) {
        let temp = [...currentMiniBoard];
        temp[c] = "O";
        if (checkWinSim(temp, "O", winningConditions)) {
            makeSuperMove(targetBoardIdx, c);
            return;
        }
    }

    // 2. Must block player?
    for (let c of availableCells) {
        let temp = [...currentMiniBoard];
        temp[c] = "X";
        if (checkWinSim(temp, "X", winningConditions)) {
            makeSuperMove(targetBoardIdx, c);
            return;
        }
    }

    // 3. Strategic: center, corners, else random
    const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    for (let p of preferred) {
        if (availableCells.includes(p)) {
            makeSuperMove(targetBoardIdx, p);
            return;
        }
    }
}

function resetGame(isNewLevel = false) {
    if (!isNewLevel) {
        if (!confirm("정말 게임을 초기화하시겠습니까? (현재 레벨은 유지됩니다)")) return;
        // 게임 진행 중에 다시 시작을 누르면 실패로 기록
        if (gameActive) {
            incrementRecord(currentLevel, 'fail');
        }
    }

    currentPlayer = "X";
    gameActive = true;
    moveHistory = { "X": [], "O": [] };
    totalTurns = 0;
    nextActiveBoard = -1;
    globalBoard = Array(9).fill("");
    miniBoards = Array(9).fill(null).map(() => Array(9).fill(""));

    document.getElementById('levelBadge').innerText = `LV ${currentLevel}`;
    document.getElementById('levelDesc').innerText = levelSettings[currentLevel];
    document.getElementById('gameStatus').innerText = "당신의 차례입니다 (X)";

    const board = document.getElementById('board');
    board.innerHTML = "";
    board.className = "tictactoe-board"; // Fix: Match CSS selector

    if (currentLevel === 7) {
        board.classList.add('super-board');
        board.style.gridTemplateColumns = `repeat(3, 1fr)`;
        for (let i = 0; i < 9; i++) {
            const miniBoard = document.createElement('div');
            miniBoard.className = "mini-board";
            miniBoard.setAttribute('data-board-idx', i);
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = "cell mini-cell";
                cell.setAttribute('data-board-idx', i);
                cell.setAttribute('data-cell-idx', j);
                cell.addEventListener('click', handleCellClick);
                miniBoard.appendChild(cell);
            }
            board.appendChild(miniBoard);
        }
    } else {
        const size = (currentLevel === 5 || currentLevel === 6) ? 4 : 3;
        boardState = new Array(size * size).fill("");
        board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = "cell";
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
    }
}

function updateFadingHints() {
    document.querySelectorAll('.cell.fading').forEach(c => c.classList.remove('fading'));
    if (currentLevel === 2) {
        moveHistory.X.length === 3 && document.querySelector(`.cell[data-index="${moveHistory.X[0]}"]`)?.classList.add('fading');
        moveHistory.O.length === 3 && document.querySelector(`.cell[data-index="${moveHistory.O[0]}"]`)?.classList.add('fading');
    }
}

function rotateBoard() {
    if (!gameActive) return;
    const size = 4;
    const newBoard = new Array(16).fill("");
    const boardElement = document.getElementById('board');

    // Add visual rotation effect
    boardElement.classList.add('rotating');

    // Calculate new positions (r, c) -> (c, 3-r)
    for (let i = 0; i < 16; i++) {
        const r = Math.floor(i / size);
        const c = i % size;
        const newR = c;
        const newC = 3 - r;
        const newIdx = newR * size + newC;
        newBoard[newIdx] = boardState[i];
    }

    boardState = newBoard;

    // Update UI after animation delay
    setTimeout(() => {
        boardElement.classList.remove('rotating');
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, idx) => {
            const state = boardState[idx];
            cell.innerText = state;
            cell.className = state === "" ? "cell" : `cell taken ${state.toLowerCase()}`;
            // Preserve fading for LV 2 if somehow relevant, but mainly for current state
        });

        // Re-check win after rotation
        if (checkWin()) {
            const winnerName = currentPlayer === 'X' ? '당신이' : '컴퓨터가';
            document.getElementById('gameStatus').innerText = `✨ 회전 후 ${winnerName} 승리!`;
            gameActive = false;
        }
    }, 500);
}

// Initial binding
document.addEventListener('DOMContentLoaded', () => {
    loadGameRecords();
    resetGame(true); // Call once to setup LV 1
});
