/* ===============================
   ELEMENTOS
================================= */
const question = document.getElementById("question");
const yesBtn = document.getElementById("yesBtn");
const buttons = document.getElementById("buttons");
const countdownEl = document.getElementById("countdown");
const startScreen = document.getElementById("startScreen");
const startContent = document.getElementById("startContent");
const fakeBtn = document.getElementById("fakeBtn");

const realLink = document.getElementById("realLink");

// Áudio
const music = document.getElementById("bgMusic");
const noSound = document.getElementById("noSound");
const swooshSound = document.getElementById("swooshSound");
const ahhhSound = document.getElementById("ahhhSound");
const yeySound = document.getElementById("yeySound");
const popSound = document.getElementById("popSound");

let audioUnlocked = false;

/* ===============================
   DESBLOQUEIO DE ÁUDIO
================================= */
function unlockAudio() {
    if (audioUnlocked) return;
    const sounds = [music, noSound, swooshSound, ahhhSound, yeySound, popSound];
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

// desbloqueia áudio no primeiro toque
document.addEventListener("click", unlockAudio, { once: true });
document.addEventListener("touchstart", unlockAudio, { once: true });

/* ===============================
   INÍCIO
================================= */
realLink.addEventListener("click", (e) => {
    e.stopPropagation();
    unlockAudio();
    startScreen.classList.add("hidden");
    playYeySound();
    startFootMassageStage();
    setTimeout(() => startScreen.style.display = "none", 800);
});

// Ativar clique na palavra "aqui"
startContent.addEventListener("click", (e) => {
    if (e.target.textContent.trim() === "aqui") {
        unlockAudio();
        startScreen.classList.add("hidden");
        setTimeout(() => startScreen.style.display = "none", 800);
    }
});

// fake button (funciona em hover e touch)
["mouseenter", "touchstart"].forEach(ev => {
    fakeBtn.addEventListener(ev, () => {
        moveFakeButton();
        playSooshSound();
    });
});
["click"].forEach(ev => fakeBtn.addEventListener(ev, moveFakeButton));

/* ===============================
   FUNÇÕES DE SOM
================================= */
function playSound(sound) {
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => { });
}
function playNoSound() { playSound(noSound); }
function playSooshSound() { playSound(swooshSound); }
function playAhhhSound() { playSound(ahhhSound); }
function playYeySound() { playSound(yeySound); }
function playPopSound() { playSound(popSound); }

/* ===============================
   BOTÕES ALEATÓRIOS
================================= */
function moveFakeButton() {
    const maxX = window.innerWidth - fakeBtn.offsetWidth - 20;
    const maxY = window.innerHeight - fakeBtn.offsetHeight - 20;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    fakeBtn.style.position = "fixed";
    fakeBtn.style.left = `${x}px`;
    fakeBtn.style.top = `${y}px`;
}

/* ===============================
   MASSAGEM
================================= */
function setupFootLogic() {
    let surpriseTriggered = false;
    const leftFoot = document.getElementById("leftFoot");
    const rightFoot = document.getElementById("rightFoot");
    let leftCount = 0;
    let rightCount = 0;
    const required = 10;

    function checkCompletion() {
        if (leftCount >= required && rightCount >= required && !surpriseTriggered) {
            surpriseTriggered = true;
            leftFoot.style.pointerEvents = "none";
            rightFoot.style.pointerEvents = "none";
            setTimeout(startExtraChallenge, 600);
        }
    }

    function handleClick(foot, side) {
        foot.classList.add("massage");
        setTimeout(() => foot.classList.remove("massage"), 200);
        if (side === "left" && leftCount < required) leftCount++;
        if (side === "right" && rightCount < required) rightCount++;
        checkCompletion();
    }

    ["click", "touchstart"].forEach(ev => leftFoot.addEventListener(ev, () => { handleClick(leftFoot, "left"); playAhhhSound(); }));
    ["click", "touchstart"].forEach(ev => rightFoot.addEventListener(ev, () => { handleClick(rightFoot, "right"); playAhhhSound(); }));
}

function startFootMassageStage() {
    question.innerHTML = `
        Muito bem, às vezes as coisas não são o que parecem 👀.<br><br>
        Agora só tens de massajar os meus pés para receberes a tua prenda 🦶✨
    `;
    buttons.innerHTML = `
        <div class="feet-container">
            <img src="pe_esquerdo.jpeg" id="leftFoot" class="foot" />
            <img src="pe_direito.jpeg" id="rightFoot" class="foot" />
        </div>
    `;
    setupFootLogic();
}

/* ===============================
   DESAFIO EXTRA
================================= */
function startExtraChallenge() {
    question.innerHTML = "Último desafio... apanha todos os corações 💖 em 10s!";
    buttons.innerHTML = `<div id="challengeArea" class="challenge-area"></div>`;

    const challengeArea = document.getElementById("challengeArea");
    const totalHearts = 5;
    let caughtHearts = 0;
    const timeLimit = 10000; // 10s

    for (let i = 0; i < totalHearts; i++) {
        const heart = document.createElement("div");
        heart.classList.add("runaway-heart");
        heart.innerHTML = "💖";
        heart.style.fontSize = `${15 + Math.random() * 20}px`;
        heart.style.transition = "left 0.3s ease, top 0.3s ease";
        challengeArea.appendChild(heart);

        ["mouseenter", "touchstart"].forEach(ev => {
            heart.addEventListener(ev, () => { if (!heart.clicked) setTimeout(() => moveHeart(heart), 150); });
        });

        ["click", "touchstart"].forEach(ev => {
            heart.addEventListener(ev, () => {
                if (heart.clicked) return;
                heart.clicked = true;
                heart.remove();
                caughtHearts++;
                playPopSound();
                if (caughtHearts === totalHearts) clearTimeout(timer), startCountdown();
            });
        });
    }

    const timer = setTimeout(() => {
        alert("Ups! Tempo esgotado 😅, tenta de novo.");
        startExtraChallenge();
    }, timeLimit);
}

function moveHeart(heart) {
    const maxX = window.innerWidth - heart.offsetWidth - 20;
    const maxY = window.innerHeight - heart.offsetHeight - 20;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    heart.style.position = "fixed";
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
}

function growYesButton() {
    const currentSize = window.getComputedStyle(yesBtn).fontSize;
    const newSize = parseFloat(currentSize) + 5;
    yesBtn.style.fontSize = newSize + "px";
}


/* ===============================
   COUNTDOWN + MÚSICA
================================= */

function startCountdown() {

    const overlay = document.getElementById("overlay");

    question.innerHTML = "A preparar surpresa em... 3";

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

    ["click", "touchstart"].forEach(ev => {
        envelope.addEventListener(ev, () => {
            envelope.classList.add("open");

            setTimeout(() => {
                envelope.remove();
                showFinalVoucher();
            }, 800);
        }, { once: true }); // garante que só dispara uma vez
    });

    // envelope.addEventListener("click", () => {
    //     envelope.classList.add("open");

    //     setTimeout(() => {
    //         envelope.remove();
    //         showFinalVoucher();
    //     }, 800);
    // });
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
    ["click", "touchstart"].forEach(ev => {
        document.getElementById("downloadBtn").addEventListener(ev, () => {
            const link = document.createElement("a");
            link.href = "voucher.png"; // caminho relativo no repositório
            link.download = "Voucher Especial.png"; // nome final do arquivo
            document.body.appendChild(link);
            link.click();
            link.remove();
        }, { once: true });
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

function vibrate(duration) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}