const question = document.getElementById("question");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

let noClicks = 0;

yesBtn.addEventListener("click", () => {
  question.innerHTML = "Sabia 😌 Porque tu mereces um dia só para ti 💅💆‍♀️";

  document.querySelector(".buttons").innerHTML = `
    <a href="GIFT Voucher 2875.pdf" download>
      <button>🎁 Desbloquear Voucher</button>
    </a>
  `;
});

noBtn.addEventListener("click", () => {
  noClicks++;

  if (noClicks === 1) {
    question.innerHTML = "Tens a certeza absoluta mesmo mesmo? 🤨";
  } else if (noClicks === 2) {
    question.innerHTML = "Hmm… vou fingir que não ouvi isso 👀";
  } else {
    noBtn.style.position = "absolute";
    noBtn.style.top = Math.random() * 80 + "%";
    noBtn.style.left = Math.random() * 80 + "%";
  }
});