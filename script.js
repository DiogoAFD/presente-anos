const question = document.getElementById("question");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const buttons = document.getElementById("buttons");
const countdownEl = document.getElementById("countdown");
const music = document.getElementById("bgMusic");

let noClicks = 0;

/* Música começa ao primeiro clique */
document.body.addEventListener("click", () => {
  music.play().catch(() => {});
}, { once: true });

/* Botão NÃO foge do rato */
noBtn.addEventListener("mouseover", () => {
  const x = Math.random() * (window.innerWidth - 100);
  const y = Math.random() * (window.innerHeight - 50);
  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
});

/* Clique no NÃO */
noBtn.addEventListener("click", () => {
  noClicks++;

  if (noClicks === 1) {
    question.innerHTML = "Tens a certeza absoluta mesmo mesmo? 🤨";
  } else if (noClicks === 2) {
    question.innerHTML = "Hmm… vou fingir que não ouvi isso 👀";
  } else {
    question.innerHTML = "Resposta incorreta 😌 tenta outra vez.";
  }
});

/* Clique no SIM */
yesBtn.addEventListener("click", () => {
  startCountdown();
});

/* Countdown dramático */
function startCountdown() {
  buttons.classList.add("hidden");
  countdownEl.classList.remove("hidden");

  let count = 3;

  const interval = setInterval(() => {
    countdownEl.innerHTML = `A preparar surpresa em... ${count} 💖`;
    count--;

    if (count < 0) {
      clearInterval(interval);
      revealSurprise();
    }
  }, 1000);
}

/* Revelação final */
function revealSurprise() {
  question.innerHTML = "Sabia 😌 Porque tu mereces um dia só para ti 💅💆‍♀️";
  countdownEl.classList.add("hidden");

  buttons.innerHTML = `
    <a href="GIFT Vouche 2875.pdf" download>
      <button>🎁 Desbloquear Voucher</button>
    </a>
  `;
  buttons.classList.remove("hidden");

  createHearts();
}

/* Corações a cair */
function createHearts() {
  const heartsContainer = document.getElementById("hearts");

  setInterval(() => {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "💖";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 20 + 15 + "px";
    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 5000);

  }, 300);

}
