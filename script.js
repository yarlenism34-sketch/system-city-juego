// ======================================================
// SYSTEM CITY
// SCRIPT COMPLETO
// ======================================================


// ======================================================
// ELEMENTOS
// ======================================================

const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const game = document.getElementById("game");

const player = document.getElementById("player");

const message = document.getElementById("message");

const healthText = document.getElementById("health");
const repairedText = document.getElementById("repaired");

const attackButton = document.getElementById("attackButton");
const repairButton = document.getElementById("repairButton");

const city = document.getElementById("city");


// ======================================================
// VARIABLES DE NEXUS
// ======================================================

let playerX = 50;
let playerY = 50;

let health = 100;

let repaired = 0;

let gameOver = false;
let gameStarted = false;

let nearbyBuilding = null;


// ======================================================
// VIRUS NORMALES
// ======================================================

let viruses = [];


// ======================================================
// JEFE FINAL
// ======================================================

let finalBoss = null;

let bossHealth = 200;

let bossActive = false;


// ======================================================
// PREGUNTAS DE CADA EDIFICIO
// ======================================================

const questions = {

  CPU: {

    question:
      "¿Qué componente ejecuta instrucciones y procesa datos?",

    options: [
      "A) RAM",
      "B) CPU",
      "C) Disco",
      "D) GPU"
    ],

    answer: "B"

  },


  RAM: {

    question:
      "¿Qué componente almacena temporalmente los datos que están siendo utilizados?",

    options: [
      "A) GPU",
      "B) Disco",
      "C) RAM",
      "D) CPU"
    ],

    answer: "C"

  },


  DISCO: {

    question:
      "¿Qué componente almacena archivos y datos de forma permanente?",

    options: [
      "A) Disco",
      "B) CPU",
      "C) RAM",
      "D) GPU"
    ],

    answer: "A"

  },


  GPU: {

    question:
      "¿Qué componente se especializa en procesar gráficos e imágenes?",

    options: [
      "A) RAM",
      "B) CPU",
      "C) GPU",
      "D) Disco"
    ],

    answer: "C"

  }

};


// ======================================================
// INICIAR JUEGO
// ======================================================

startButton.addEventListener("click", function () {

  if (gameStarted) {
    return;
  }

  gameStarted = true;

  startScreen.style.display = "none";

  game.style.display = "block";

  message.textContent =
    "⚠️ ¡ALERTA! SYSTEM CITY ESTÁ INFECTADA.";

  createViruses();

  setInterval(moveViruses, 300);

});


// ======================================================
// CREAR VIRUS
// ======================================================

function createViruses() {

  const positions = [

    { x: 25, y: 20 },
    { x: 75, y: 25 },
    { x: 30, y: 70 },
    { x: 75, y: 75 },
    { x: 50, y: 20 }

  ];


  positions.forEach(function (position, index) {

    const virus =
      document.createElement("div");


    virus.className = "virus";

    virus.textContent = "☣";


    virus.style.position = "absolute";

    virus.style.left =
      position.x + "%";

    virus.style.top =
      position.y + "%";


    virus.style.width = "50px";
    virus.style.height = "50px";


    virus.style.display = "flex";

    virus.style.justifyContent =
      "center";

    virus.style.alignItems =
      "center";


    virus.style.fontSize = "30px";

    virus.style.color = "#ff1744";

    virus.style.background = "#250008";

    virus.style.border =
      "3px solid #ff1744";

    virus.style.borderRadius = "50%";


    virus.style.boxShadow =
      "0 0 15px #ff1744, 0 0 30px #ff1744";


    virus.style.zIndex = "8";


    virus.dataset.x = position.x;

    virus.dataset.y = position.y;

    virus.dataset.id = index;

    virus.dataset.attacking = "false";


    city.appendChild(virus);

    viruses.push(virus);

  });

}


// ======================================================
// MOVER NEXUS
// ======================================================

function movePlayer(x, y) {

  if (gameOver) {
    return;
  }


  playerX += x;

  playerY += y;


  if (playerX < 3) {
    playerX = 3;
  }


  if (playerX > 97) {
    playerX = 97;
  }


  if (playerY < 10) {
    playerY = 10;
  }


  if (playerY > 90) {
    playerY = 90;
  }


  player.style.left =
    playerX + "%";

  player.style.top =
    playerY + "%";


  checkVirusCollision();

  checkBossCollision();

  checkNearbyBuilding();

}


// ======================================================
// VIRUS PERSIGUE A NEXUS
// ======================================================

function moveViruses() {

  if (gameOver) {
    return;
  }


  viruses.forEach(function (virus) {

    if (!virus.parentElement) {
      return;
    }


    let virusX =
      parseFloat(virus.dataset.x);

    let virusY =
      parseFloat(virus.dataset.y);


    const distanceX =
      playerX - virusX;

    const distanceY =
      playerY - virusY;


    const distance =
      Math.sqrt(
        distanceX * distanceX +
        distanceY * distanceY
      );


    if (
      distance < 45 &&
      distance > 4
    ) {

      virusX +=
        (distanceX / distance) * 1.2;

      virusY +=
        (distanceY / distance) * 1.2;


      virus.dataset.x = virusX;

      virus.dataset.y = virusY;


      virus.style.left =
        virusX + "%";

      virus.style.top =
        virusY + "%";

    }

  });


  checkVirusCollision();

  moveBoss();

  checkBossCollision();

}


// ======================================================
// DAÑO DE LOS VIRUS
// ======================================================

function checkVirusCollision() {

  if (gameOver) {
    return;
  }


  const playerRect =
    player.getBoundingClientRect();


  viruses.forEach(function (virus) {

    if (!virus.parentElement) {
      return;
    }


    const virusRect =
      virus.getBoundingClientRect();


    const touching =

      playerRect.left <
      virusRect.right &&

      playerRect.right >
      virusRect.left &&

      playerRect.top <
      virusRect.bottom &&

      playerRect.bottom >
      virusRect.top;


    if (
      touching &&
      virus.dataset.attacking === "false"
    ) {

      virus.dataset.attacking = "true";


      health -= 10;


      if (health < 0) {
        health = 0;
      }


      healthText.textContent =
        health;


      message.textContent =
        "⚠️ ¡UN VIRUS ATACÓ A NEXUS!";


      player.style.transform =
        "translate(-50%, -50%) scale(1.25)";


      player.style.background =
        "#ff1744";


      setTimeout(function () {

        player.style.transform =
          "translate(-50%, -50%) scale(1)";

        player.style.background =
          "#006eff";

      }, 200);


      setTimeout(function () {

        virus.dataset.attacking =
          "false";

      }, 1000);


      if (health === 0) {

        loseGame();

      }

    }

  });

}


// ======================================================
// ATAQUE DE NEXUS
// ======================================================

function attackVirus() {

  if (gameOver) {
    return;
  }


  // PULSO DE ATAQUE

  const pulse =
    document.createElement("div");


  pulse.style.position =
    "absolute";


  pulse.style.left =
    playerX + "%";


  pulse.style.top =
    playerY + "%";


  pulse.style.width = "40px";

  pulse.style.height = "40px";


  pulse.style.transform =
    "translate(-50%, -50%)";


  pulse.style.border =
    "4px solid #00eaff";


  pulse.style.borderRadius =
    "50%";


  pulse.style.boxShadow =
    "0 0 15px #00eaff, 0 0 35px #006eff";


  pulse.style.pointerEvents =
    "none";


  pulse.style.zIndex = "15";


  city.appendChild(pulse);


  let size = 40;


  const animation =
    setInterval(function () {

      size += 15;


      pulse.style.width =
        size + "px";


      pulse.style.height =
        size + "px";


      pulse.style.opacity =
        1 - size / 180;


      if (size >= 180) {

        clearInterval(animation);

        pulse.remove();

      }

    }, 30);


  // ATAQUE A VIRUS NORMALES

  const playerRect =
    player.getBoundingClientRect();


  let destroyed = 0;


  viruses.forEach(function (virus) {

    if (!virus.parentElement) {
      return;
    }


    const virusRect =
      virus.getBoundingClientRect();


    const distanceX =
      Math.abs(
        playerRect.left -
        virusRect.left
      );


    const distanceY =
      Math.abs(
        playerRect.top -
        virusRect.top
      );


    if (
      distanceX < 120 &&
      distanceY < 120
    ) {

      destroyed++;


      virus.style.transform =
        "scale(1.7)";


      virus.style.opacity = "0";

      virus.style.transition = "0.2s";


      setTimeout(function () {

        virus.remove();

      }, 200);

    }

  });


  // ATAQUE AL JEFE

  if (bossActive && finalBoss) {

    const bossRect =
      finalBoss.getBoundingClientRect();


    const bossDistanceX =
      Math.abs(
        playerRect.left -
        bossRect.left
      );


    const bossDistanceY =
      Math.abs(
        playerRect.top -
        bossRect.top
      );


    if (
      bossDistanceX < 200 &&
      bossDistanceY < 200
    ) {

      bossHealth -= 25;


      if (bossHealth < 0) {
        bossHealth = 0;
      }


      updateBossHealth();


      finalBoss.style.transform =
        "translate(-50%, -50%) scale(1.25)";


      setTimeout(function () {

        if (finalBoss) {

          finalBoss.style.transform =
            "translate(-50%, -50%) scale(1)";

        }

      }, 150);


      message.textContent =
        "⚡ ¡ATAQUE DE NEXUS! EL JEFE PERDIÓ 25 DE VIDA.";


      if (bossHealth === 0) {

        defeatBoss();

      }

    }

  }


  if (
    destroyed > 0 &&
    !bossActive
  ) {

    message.textContent =
      "⚡ ¡VIRUS ELIMINADO!";

  }


  if (
    destroyed === 0 &&
    !bossActive
  ) {

    message.textContent =
      "⚡ NEXUS LANZÓ UN ATAQUE.";

  }

}


// ======================================================
// DETECTAR EDIFICIO CERCANO
// ======================================================

function checkNearbyBuilding() {

  nearbyBuilding = null;


  const buildings =
    document.querySelectorAll(".building");


  const playerRect =
    player.getBoundingClientRect();


  const playerCenterX =
    playerRect.left +
    playerRect.width / 2;


  const playerCenterY =
    playerRect.top +
    playerRect.height / 2;


  buildings.forEach(function (building) {

    if (
      building.dataset.repaired ===
      "true"
    ) {
      return;
    }


    const buildingRect =
      building.getBoundingClientRect();


    const buildingCenterX =
      buildingRect.left +
      buildingRect.width / 2;


    const buildingCenterY =
      buildingRect.top +
      buildingRect.height / 2;


    const distanceX =
      Math.abs(
        playerCenterX -
        buildingCenterX
      );


    const distanceY =
      Math.abs(
        playerCenterY -
        buildingCenterY
      );


    if (
      distanceX < 180 &&
      distanceY < 180
    ) {

      nearbyBuilding =
        building;


      message.textContent =
        "🛠️ " +
        building.dataset.name +
        " LISTO PARA REPARAR. PULSA REPARAR.";

    }

  });

}


// ======================================================
// MOSTRAR PREGUNTA
// ======================================================

function showQuestion(building) {

  const name =
    building.dataset.name;


  const data =
    questions[name];


  if (!data) {
    return;
  }


  const oldModal =
    document.getElementById(
      "questionModal"
    );


  if (oldModal) {
    oldModal.remove();
  }


  const modal =
    document.createElement("div");


  modal.id =
    "questionModal";


  modal.style.position =
    "fixed";


  modal.style.left = "50%";

  modal.style.top = "50%";


  modal.style.transform =
    "translate(-50%, -50%)";


  modal.style.width =
    "min(90%, 500px)";


  modal.style.padding = "25px";


  modal.style.background =
    "#07111f";


  modal.style.border =
    "3px solid #00eaff";


  modal.style.borderRadius =
    "15px";


  modal.style.boxShadow =
    "0 0 35px #00eaff";


  modal.style.color = "white";


  modal.style.textAlign =
    "center";


  modal.style.zIndex = "100";


  const title =
    document.createElement("h2");


  title.textContent =
    "🛠️ REPARANDO " + name;


  title.style.color =
    "#00eaff";


  modal.appendChild(title);


  const question =
    document.createElement("p");


  question.textContent =
    data.question;


  question.style.fontSize =
    "18px";


  modal.appendChild(question);


  data.options.forEach(function (option) {

    const button =
      document.createElement("button");


    button.textContent =
      option;


    button.style.display =
      "block";


    button.style.width =
      "100%";


    button.style.margin =
      "10px 0";


    button.style.padding =
      "12px";


    button.style.fontSize =
      "16px";


    button.style.color =
      "white";


    button.style.background =
      "#102b42";


    button.style.border =
      "2px solid #00eaff";


    button.style.borderRadius =
      "8px";


    button.style.cursor =
      "pointer";


    button.addEventListener(
      "click",
      function () {

        const selected =
          option.charAt(0);


        if (
          selected ===
          data.answer
        ) {

          correctAnswer(
            building,
            modal
          );

        } else {

          wrongAnswer(
            modal
          );

        }

      }
    );


    modal.appendChild(button);

  });


  document.body.appendChild(modal);

}


// ======================================================
// RESPUESTA CORRECTA
// ======================================================

function correctAnswer(
  building,
  modal
) {

  modal.remove();


  building.dataset.repaired =
    "true";


  repaired++;


  repairedText.textContent =
    repaired;


  building.style.borderColor =
    "#00ff66";


  building.style.boxShadow =
    "0 0 30px #00ff66";


  building.style.transform =
    "scale(1.05)";


  const title =
    building.querySelector("h2");


  const description =
    building.querySelector("p");


  title.textContent =
    "✓ " +
    building.dataset.name;


  description.textContent =
    "REPARADO";


  message.textContent =
    "✅ " +
    building.dataset.name +
    " HA SIDO REPARADO.";


  // ==================================================
  // TODOS LOS COMPONENTES REPARADOS
  // ==================================================

  if (repaired === 4) {

    setTimeout(function () {

      startFinalBoss();

    }, 1000);

  }

}


// ======================================================
// RESPUESTA INCORRECTA
// ======================================================

function wrongAnswer(modal) {

  health -= 10;


  if (health < 0) {
    health = 0;
  }


  healthText.textContent =
    health;


  message.textContent =
    "❌ RESPUESTA INCORRECTA. NEXUS PERDIÓ 10 DE VIDA.";


  modal.remove();


  if (health === 0) {

    loseGame();

  }

}


// ======================================================
// REPARAR EDIFICIO
// ======================================================

function repairBuilding() {

  if (gameOver) {
    return;
  }


  if (bossActive) {

    message.textContent =
      "⚠️ ¡DERROTA AL VIRUS CENTRAL PRIMERO!";

    return;

  }


  checkNearbyBuilding();


  if (!nearbyBuilding) {

    message.textContent =
      "⚠️ ACÉRCATE A UN EDIFICIO PARA REPARARLO.";

    return;

  }


  showQuestion(
    nearbyBuilding
  );

}


// ======================================================
// JEFE FINAL
// ======================================================

function startFinalBoss() {

  if (bossActive) {
    return;
  }


  bossActive = true;

  bossHealth = 200;


  // ELIMINAR VIRUS NORMALES

  viruses.forEach(function (virus) {

    if (virus.parentElement) {
      virus.remove();
    }

  });


  viruses = [];


  // CREAR JEFE

  finalBoss =
    document.createElement("div");


  finalBoss.id =
    "finalBoss";


  finalBoss.textContent =
    "☣";


  finalBoss.style.position =
    "absolute";


  finalBoss.style.left = "50%";

  finalBoss.style.top = "20%";


  finalBoss.style.transform =
    "translate(-50%, -50%)";


  finalBoss.style.width = "130px";

  finalBoss.style.height = "130px";


  finalBoss.style.display =
    "flex";


  finalBoss.style.justifyContent =
    "center";


  finalBoss.style.alignItems =
    "center";


  finalBoss.style.fontSize =
    "70px";


  finalBoss.style.color =
    "#ff003c";


  finalBoss.style.background =
    "#160006";


  finalBoss.style.border =
    "6px solid #ff003c";


  finalBoss.style.borderRadius =
    "50%";


  finalBoss.style.boxShadow =
    "0 0 25px #ff003c, 0 0 60px #ff003c";


  finalBoss.style.zIndex =
    "30";


  finalBoss.dataset.x = "50";

  finalBoss.dataset.y = "20";

  finalBoss.dataset.attacking =
    "false";


  city.appendChild(finalBoss);


  // NOMBRE DEL JEFE

  const bossName =
    document.createElement("div");


  bossName.id =
    "bossName";


  bossName.textContent =
    "☠️ VIRUS CENTRAL ☠️";


  bossName.style.position =
    "absolute";


  bossName.style.left = "50%";

  bossName.style.top = "8%";


  bossName.style.transform =
    "translateX(-50%)";


  bossName.style.color =
    "#ff003c";


  bossName.style.fontSize =
    "22px";


  bossName.style.fontWeight =
    "bold";


  bossName.style.textShadow =
    "0 0 15px #ff003c";


  bossName.style.zIndex =
    "31";


  city.appendChild(bossName);


  // BARRA DE VIDA

  const bossBar =
    document.createElement("div");


  bossBar.id =
    "bossBar";


  bossBar.style.position =
    "absolute";


  bossBar.style.left = "50%";

  bossBar.style.top = "13%";


  bossBar.style.transform =
    "translateX(-50%)";


  bossBar.style.width =
    "300px";


  bossBar.style.height =
    "25px";


  bossBar.style.background =
    "#220008";


  bossBar.style.border =
    "3px solid #ff003c";


  bossBar.style.borderRadius =
    "20px";


  bossBar.style.overflow =
    "hidden";


  bossBar.style.zIndex =
    "31";


  const bossHealthBar =
    document.createElement("div");


  bossHealthBar.id =
    "bossHealthBar";


  bossHealthBar.style.width =
    "100%";


  bossHealthBar.style.height =
    "100%";


  bossHealthBar.style.background =
    "#ff003c";


  bossHealthBar.style.boxShadow =
    "0 0 20px #ff003c";


  bossBar.appendChild(
    bossHealthBar
  );


  city.appendChild(
    bossBar
  );


  message.textContent =
    "☠️ ¡EL VIRUS CENTRAL HA DESPERTADO! ¡DERROTA AL JEFE FINAL!";

}


// ======================================================
// MOVER JEFE
// ======================================================

function moveBoss() {

  if (
    !bossActive ||
    !finalBoss ||
    gameOver
  ) {
    return;
  }


  let bossX =
    parseFloat(
      finalBoss.dataset.x
    );


  let bossY =
    parseFloat(
      finalBoss.dataset.y
    );


  const distanceX =
    playerX - bossX;


  const distanceY =
    playerY - bossY;


  const distance =
    Math.sqrt(
      distanceX * distanceX +
      distanceY * distanceY
    );


  if (
    distance > 7 &&
    distance < 70
  ) {

    bossX +=
      (distanceX / distance) *
      0.7;


    bossY +=
      (distanceY / distance) *
      0.7;


    finalBoss.dataset.x =
      bossX;


    finalBoss.dataset.y =
      bossY;


    finalBoss.style.left =
      bossX + "%";


    finalBoss.style.top =
      bossY + "%";

  }

}


// ======================================================
// DAÑO DEL JEFE
// ======================================================

function checkBossCollision() {

  if (
    !bossActive ||
    !finalBoss ||
    gameOver
  ) {
    return;
  }


  const playerRect =
    player.getBoundingClientRect();


  const bossRect =
    finalBoss.getBoundingClientRect();


  const touching =

    playerRect.left <
    bossRect.right &&

    playerRect.right >
    bossRect.left &&

    playerRect.top <
    bossRect.bottom &&

    playerRect.bottom >
    bossRect.top;


  if (
    touching &&
    finalBoss.dataset.attacking ===
    "false"
  ) {

    finalBoss.dataset.attacking =
      "true";


    health -= 20;


    if (health < 0) {
      health = 0;
    }


    healthText.textContent =
      health;


    message.textContent =
      "☠️ ¡EL VIRUS CENTRAL ATACÓ A NEXUS!";


    player.style.background =
      "#ff1744";


    setTimeout(function () {

      player.style.background =
        "#006eff";

    }, 250);


    setTimeout(function () {

      if (finalBoss) {

        finalBoss.dataset.attacking =
          "false";

      }

    }, 1200);


    if (health === 0) {

      loseGame();

    }

  }

}


// ======================================================
// ACTUALIZAR VIDA DEL JEFE
// ======================================================

function updateBossHealth() {

  const bar =
    document.getElementById(
      "bossHealthBar"
    );


  if (!bar) {
    return;
  }


  const percentage =
    (bossHealth / 200) * 100;


  bar.style.width =
    percentage + "%";

}


// ======================================================
// DERROTAR JEFE
// ======================================================

function defeatBoss() {

  if (!bossActive) {
    return;
  }


  bossActive = false;

  gameOver = true;


  if (finalBoss) {

    finalBoss.style.transform =
      "translate(-50%, -50%) scale(2)";


    finalBoss.style.opacity =
      "0";


    finalBoss.style.transition =
      "0.8s";

  }


  message.textContent =
    "🏆 ¡VIRUS CENTRAL DESTRUIDO! SYSTEM CITY HA SIDO SALVADA.";


  setTimeout(function () {

    if (finalBoss) {
      finalBoss.remove();
    }


    const bossName =
      document.getElementById(
        "bossName"
      );


    if (bossName) {
      bossName.remove();
    }


    const bossBar =
      document.getElementById(
        "bossBar"
      );


    if (bossBar) {
      bossBar.remove();
    }


    showVictory();

  }, 1000);

}


// ======================================================
// DERROTA
// ======================================================

function loseGame() {

  gameOver = true;


  message.textContent =
    "💀 NEXUS HA SIDO INFECTADO. MISIÓN FALLIDA.";

}


// ======================================================
// PANTALLA DE VICTORIA
// ======================================================

function showVictory() {

  const victory =
    document.createElement("div");


  victory.style.position =
    "fixed";


  victory.style.left = "50%";

  victory.style.top = "50%";


  victory.style.transform =
    "translate(-50%, -50%)";


  victory.style.width =
    "min(90%, 600px)";


  victory.style.padding =
    "40px";


  victory.style.textAlign =
    "center";


  victory.style.background =
    "#061525";


  victory.style.border =
    "4px solid #00ff66";


  victory.style.borderRadius =
    "20px";


  victory.style.boxShadow =
    "0 0 50px #00ff66";


  victory.style.color =
    "white";


  victory.style.zIndex =
    "500";


  victory.innerHTML =

    "<h1 style='color:#00ff66;'>🏆 SYSTEM CITY SALVADA</h1>" +

    "<p style='font-size:22px;'>NEXUS derrotó al Virus Central.</p>" +

    "<p>Todos los componentes fueron reparados.</p>" +

    "<p style='color:#00eaff;'>La ciudad vuelve a estar segura.</p>";


  document.body.appendChild(
    victory
  );

}


// ======================================================
// TECLADO
// ======================================================

document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "w" ||
      event.key === "W" ||
      event.key === "ArrowUp"
    ) {

      movePlayer(0, -3);

    }


    if (
      event.key === "s" ||
      event.key === "S" ||
      event.key === "ArrowDown"
    ) {

      movePlayer(0, 3);

    }


    if (
      event.key === "a" ||
      event.key === "A" ||
      event.key === "ArrowLeft"
    ) {

      movePlayer(-3, 0);

    }


    if (
      event.key === "d" ||
      event.key === "D" ||
      event.key === "ArrowRight"
    ) {

      movePlayer(3, 0);

    }


    if (event.code === "Space") {

      event.preventDefault();

      attackVirus();

    }


    if (
      event.key === "e" ||
      event.key === "E"
    ) {

      repairBuilding();

    }

  }
);


// ======================================================
// BOTONES DE MOVIMIENTO
// ======================================================

document
  .getElementById("upButton")
  .addEventListener(
    "click",
    function () {

      movePlayer(0, -3);

    }
  );


document
  .getElementById("downButton")
  .addEventListener(
    "click",
    function () {

      movePlayer(0, 3);

    }
  );


document
  .getElementById("leftButton")
  .addEventListener(
    "click",
    function () {

      movePlayer(-3, 0);

    }
  );


document
  .getElementById("rightButton")
  .addEventListener(
    "click",
    function () {

      movePlayer(3, 0);

    }
  );


// ======================================================
// ATAQUE
// ======================================================

attackButton.addEventListener(
  "click",
  function () {

    attackVirus();

  }
);


// ======================================================
// REPARAR
// ======================================================

repairButton.addEventListener(
  "click",
  function () {

    repairBuilding();

  }
);