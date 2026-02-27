const question = document.getElementById("question");
const yesBtn = document.getElementById("yesBtn");
const buttons = document.getElementById("buttons");
const countdownEl = document.getElementById("countdown");
const music = document.getElementById("bgMusic");
const noSound = document.getElementById("noSound");
const swooshSound = document.getElementById("swooshSound");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
    unlockAudio();

    // fade out suave
    startScreen.classList.add("hidden");

    setTimeout(() => {
        startScreen.style.display = "none";
    }, 800);
});

let audioUnlocked = false;

function unlockAudio() {
    if (audioUnlocked) return;

    const sounds = [music, noSound, swooshSound];

    sounds.forEach(sound => {
        if (!sound) return;

        try {
            sound.volume = 0;
            sound.play()
                .then(() => {
                    sound.pause();
                    sound.currentTime = 0;
                    sound.volume = 1;
                })
                .catch(() => { });
        } catch (e) { }
    });

    audioUnlocked = true;
}

document.addEventListener("click", unlockAudio, { once: true });

let escapeCount = 0;

function growYesButton() {
    const currentSize = window.getComputedStyle(yesBtn).fontSize;
    const newSize = parseFloat(currentSize) + 5;
    yesBtn.style.fontSize = newSize + "px";
}

/* ===============================
   BOTÃO SIM → QUIZ
================================= */

let escapeSimCount = 0;
const maxEscapeSim = 7; // Depois de 7 tentativas, o botão para de fugir

yesBtn.addEventListener("mouseenter", () => {
    if (escapeSimCount < maxEscapeSim) {
        moveYesButton();
        growYesButton();
        playSooshSound();
        escapeSimCount++;
    }
});

yesBtn.addEventListener("click", () => {
    if (escapeSimCount >= maxEscapeSim) {
        startQuiz(); // Avança para o quiz normalmente
    } else {
        question.innerHTML = "Quase lá 😏 tenta outra vez!";
        vibrate(150);
    }
});

function moveYesButton() {
    const maxX = window.innerWidth - yesBtn.offsetWidth - 20;
    const maxY = window.innerHeight - yesBtn.offsetHeight - 20;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    yesBtn.style.position = "fixed";
    yesBtn.style.left = `${x}px`;
    yesBtn.style.top = `${y}px`;
}

function startQuiz() {
    question.innerHTML = "Pergunta importante... quem merece esta prenda? 😌";

    buttons.innerHTML = `
        <button class="quizOption correct" style="background-color: #4CAF50; color: white;">Eu obviamente 💅</button>
        <button class="quizOption funny" style="background-color: #ff66a3; color: white;">O meu incrível namorado 😎</button>
        <button class="quizOption playful" style="background-color: #ffcc66; color: black;">Eu outra vez porque quem mais haveria de ser... 😏</button>
    `;

    let playfulEscapes = 0;
    const maxPlayfulEscapes = 5;

    document.querySelectorAll(".quizOption").forEach(btn => {
        btn.addEventListener("click", (e) => {
            if (e.target.classList.contains("correct")) {
                // Antes de avançar, faz o botão tremer
                e.target.style.animation = "shake 0.5s";
                setTimeout(() => {
                    e.target.style.animation = "";
                    stageTwo();
                }, 500);
            }
            else if (e.target.classList.contains("funny")) {
                // Explode visualmente
                explodeBoyfriendButton(e.target);
                playNoSound();
            }
            else if (e.target.classList.contains("playful")) {
                if (playfulEscapes < maxPlayfulEscapes) {
                    // Pula para outro lugar
                    movePlayfulButton(e.target);
                    playSooshSound();
                    playfulEscapes++;
                    question.innerHTML = "Ahah 😏 quase apanhas-te!";
                } else {
                    // Agora fica clicável
                    question.innerHTML = "Ok, agora podes clicar!";
                    e.target.style.position = "static";
                    e.target.style.left = "";
                    e.target.style.top = "";
                }
            }
        });
    });
}

function movePlayfulButton(btn) {
    const maxX = window.innerWidth - btn.offsetWidth - 20;
    const maxY = window.innerHeight - btn.offsetHeight - 20;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    btn.style.position = "fixed";
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
}

function explodeBoyfriendButton(btn) {
    if (!btn || btn.classList.contains("exploding")) return;

    question.innerHTML = "Resposta errada 👀 tenta outra vez.";

    btn.classList.add("exploding");
    btn.disabled = true;

    let scale = 1;

    const grow = setInterval(() => {
        scale += 0.15;
        btn.style.transform = `scale(${scale})`;

        if (scale >= 3) {
            clearInterval(grow);

            btn.style.transition = "0.3s ease";
            btn.style.opacity = "0";
            btn.style.transform = "scale(4)";

            setTimeout(() => {
                btn.remove();
            }, 300);
        }
    }, 80);
}

/* ===============================
   ETAPAS INTERMÉDIAS
================================= */

function stageTwo() {
    question.innerHTML = "Mas espera... tens a certeza que mereces MESMO? 😏";

    buttons.innerHTML = `
    <button id="proveBtn">Provar que sim 💅</button>
  `;

    document.getElementById("proveBtn")
        .addEventListener("click", stageThree);
}

function stageThree() {
    question.innerHTML = "Última pergunta importante...";

    buttons.innerHTML = `
    <button id="finalBtn">
      Aceitar oficialmente que sou incrível ✨
    </button>
  `;

    document.getElementById("finalBtn")
        .addEventListener("click", startCountdown);
}

/* ===============================
   COUNTDOWN + MÚSICA
================================= */

function startCountdown() {
    const overlay = document.getElementById("overlay");
    overlay.classList.add("active");
    question.classList.add("dramatic");

    buttons.classList.add("hidden");
    countdownEl.classList.remove("hidden");

    // 🔥 música começa aqui e só aqui
    music.currentTime = 0;
    music.volume = 0;
    music.play().catch(() => { });

    let fade = setInterval(() => {
        if (music.volume < 0.8) {
            music.volume += 0.05;
        } else {
            clearInterval(fade);
        }
    }, 200);

    let count = 3;

    const interval = setInterval(() => {
        if (count > 0) {
            countdownEl.innerHTML = `A preparar surpresa em... ${count} 💖`;
            count--;
        } else {
            clearInterval(interval);
            countdownEl.classList.add("hidden");
            countdownEl.innerHTML = "";
            revealSurprise();
        }
    }, 1000);
}

/* ===============================
   CARTA
================================= */

function revealSurprise() {
    question.innerHTML = "Abre a carta 💌";

    const envelope = document.createElement("div");
    envelope.classList.add("envelope");

    document.querySelector(".card").appendChild(envelope);

    envelope.addEventListener("click", () => {
        envelope.classList.add("open");

        setTimeout(() => {
            envelope.remove();
            showFinalVoucher();
        }, 800);
    });
}

/* ===============================
   FINAL
================================= */

function showFinalVoucher() {
    const overlay = document.getElementById("overlay");

    overlay.classList.remove("active");
    question.classList.remove("dramatic");

    question.innerHTML =
        "Feliz aniversário 💛";

    // Botão que força download
    buttons.innerHTML = `
      <button id="downloadBtn">🎁 Desbloquear Prenda</button>
    `;
    buttons.classList.remove("hidden");
    createHearts();

    // Download direto do GitHub Pages
    document.getElementById("downloadBtn").addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = "voucher.png"; // caminho relativo no repositório
        link.download = "Voucher Especial.png"; // nome final do arquivo
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
}

/* ===============================
   CORAÇÕES
================================= */

let heartInterval = null;

function createHearts() {
    const heartsContainer = document.getElementById("hearts");

    // Evita criar vários intervals
    if (heartInterval) return;

    heartInterval = setInterval(() => {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerHTML = "💖";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.fontSize = Math.random() * 20 + 15 + "px";

        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);

    }, 300); // podes ajustar velocidade aqui
}

/* ===============================
   UTILITÁRIOS
================================= */

function playNoSound() {
    noSound.currentTime = 0;
    noSound.play().catch(() => { });
}

function playSooshSound() {
    if (!swooshSound) {
        console.log("Swoosh não encontrado");
        return;
    }

    swooshSound.currentTime = 0;

    swooshSound.play()
        .then(() => console.log("Swoosh tocou"))
        .catch(err => console.log("Erro:", err));
}

function vibrate(duration) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}