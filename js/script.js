window.onload = function () {
  var container = document.getElementById("container");
  var cpuTimerId = null;
  var cpuThinking = false;
  var gameOver = false;
  var gameOverMessage = "";
  var myTurn = true;

  for (var n = 0; n < 64; n++) {
    var square = document.createElement("div");
    square.classList.add("square");
    square.classList.add("s" + n);
    container.appendChild(square);
  }

  var sqs = document.getElementsByClassName("square");

  function layoutBoard() {
    var w = window.innerWidth || 360;
    var h = window.innerHeight || 500;
    var tsw = w > h ? h : w;
    var sw = (tsw - 16) / 8;

    for (var n = 0; n < 64; n++) {
      sqs[n].style.height = sw + "px";
      sqs[n].style.width = sw + "px";
      sqs[n].style.top = 7 + (h - tsw) / 2 + sw * Math.floor(n / 8) + "px";
      sqs[n].style.left = 7 + (w - tsw) / 2 + sw * (n % 8) + "px";
      sqs[n].style.fontSize = (sw * 3) / 4 + "px";
    }
  }

  layoutBoard();
  window.addEventListener("resize", layoutBoard);

  var fonts = {
    k: "&#9818;",
    q: "&#9819",
    r: "&#9820",
    b: "&#9821",
    n: "&#9822",
    p: "&#9823",
    l: "&#9812",
    w: "&#9813",
    t: "&#9814",
    v: "&#9815",
    m: "&#9816",
    o: "&#9817",
  };

  function createInitialBoard() {
    return [
    "r",
    "n",
    "b",
    "q",
    "k",
    "b",
    "n",
    "r",
    "p",
    "p",
    "p",
    "p",
    "p",
    "p",
    "p",
    "p",
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    "o",
    "o",
    "o",
    "o",
    "o",
    "o",
    "o",
    "o",
    "t",
    "m",
    "v",
    "w",
    "l",
    "v",
    "m",
    "t",
    ];
  }

  var values = createInitialBoard();

  var ck = false;
  var cr1 = false;
  var cr2 = false;
  var cl;

  for (var n = 0; n < 64; n++) {
    if (values[n] !== 0) {
      sqs[n].innerHTML = fonts[values[n]];
    }
  }

  function updateSquareColor() {
    for (var n = 0; n < 64; n++) {
      if (Math.floor(n / 8) % 2 == 0) {
        if (n % 2 === 0) {
          sqs[n].style.background = "#fcce9c";
        } else {
          sqs[n].style.background = "#d58d45";
        }
      } else {
        if (n % 2 === 1) {
          sqs[n].style.background = "#fcce9c";
        } else {
          sqs[n].style.background = "#d58d45";
        }
      }
    }
  }

  updateSquareColor();

  var moveable = false;
  var moveTarget = "";
  var moveScopes = [];

  function checkBlack(n, values) {
    var target = values[n];
    var scopes = [];
    var x = n;

    if (target === "o") {
      var forward = n - 8;
      if (forward >= 0 && values[forward] === 0) {
        scopes.push(forward);
        if (Math.floor(n / 8) === 6) {
          var forward2 = n - 16;
          if (forward2 >= 0 && values[forward2] === 0) {
            scopes.push(forward2);
          }
        }
      }
      if (n % 8 !== 0) {
        var captureLeft = n - 9;
        if (captureLeft >= 0 && "prnbkq".indexOf(values[captureLeft]) >= 0) {
          scopes.push(captureLeft);
        }
      }
      if (n % 8 !== 7) {
        var captureRight = n - 7;
        if (captureRight >= 0 && "prnbkq".indexOf(values[captureRight]) >= 0) {
          scopes.push(captureRight);
        }
      }
    } else if (target === "t") {
      x = n;

      // mover para cima
      x -= 8;
      while (x >= 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 8;
      }

      x = n;

      // mover para baixo
      x += 8;

      while (x < 64) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 8;
      }

      x = n;

      // mover para direita
      x++;
      while (x < 64 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x++;
      }

      x = n;

      // mover para esquerda
      x--;

      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x--;
      }
    } else if (target === "m") {
      var knightJumps = [-17, -15, -10, -6, 6, 10, 15, 17];
      for (var kj = 0; kj < knightJumps.length; kj++) {
        x = n + knightJumps[kj];
        if (x < 0 || x >= 64) {
          continue;
        }
        if (Math.abs((x % 8) - (n % 8)) > 2) {
          continue;
        }
        if (
          values[x] === 0 ||
          "prnbqk".indexOf(values[x]) >= 0
        ) {
          scopes.push(x);
        }
      }
    } else if (target === "v") {
      x = n;

      // mover para cima esquerda
      x -= 9;

      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
           break;
        }

        x -= 9;
      }

      x = n;

      // mover para baixo esquerda
      x += 7;

      while (x < 64 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 7;
      }

      x = n;

      // mover para baixo direita
      x += 9;
      while (x < 64 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 9;
      }

      x = n;

      // mover para cima direita
      x -= 7;
      while (x >= 0 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 7;
      }
    } else if (target === "w") {
      x = n;

      // mover para cima
      x -= 8;
      while (x >= 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 8;
      }

      x = n;

      // mover para baixo
      x += 8;
      while (x < 64) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 8;
      }

      x = n;
      
      // mover para direita
      x++;
      while (x < 64 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x++;
      }

      x = n;
      // mover para esquerda
      x--;
      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x--;
      }

      x = n;
      // mover para cima esquerda
      x -= 9;
      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 9;
      }

      x = n;

      // mover para baixo esquerda
      x += 7;
      while (x < 64 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }

        x += 7;
      }

      x = n;

      // mover para baixo direita
      x += 9;
      while (x < 64 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 9;
      }

      x = n;

      // mover para superior direita
      x -= 7;
      while (x >= 0 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("prnbqk".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 7;
      }
    } else if (target === "l") {
      x = n;

      // mover uma casa para baixo
      x += 8;
      if (
        ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
        x < 64 &&
        x >= 0
      ) {
        scopes.push(x);
      }
      x = n;

      // mover uma casa para cima
      x -= 8;
      if (
        ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
        x < 64 &&
        x >= 0
      ) {
        scopes.push(x);
      }
      x = n;

      // casas à esquerda e diagonais (coluna > a)
      if (x % 8 > 0) {
        x = n;

        // mover uma casa para esquerda
        x -= 1;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
        x = n;

        // mover uma casa para cima esquerda
        x -= 9;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;

        // mover uma casa para baixo esquerda
        x += 7;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
      }

      x = n;

      // casas à direita e diagonais (coluna < h)
      if (x % 8 < 7) {
        x = n;

        // mover uma casa para direita
        x += 1;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;

        // mover uma casa para baixo direita
        x += 9;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;

        // mover uma casa para cima direita
        x -= 7;
        if (
          ("prnbqk".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
      }

      x = n;

      // roque (rei ainda não moveu — ck)
      if (!ck) {
        cl = false;

        // roque pequeno (lado do rei)
        if (!cr2) {
          if (
            values[n + 1] === 0 &&
            values[n + 2] === 0 &&
            values[n + 3] === "t"
          ) {
            scopes.push(x + 2);
            cl = true;
          }
        }

        // roque grande (lado da dama)
        if (!cr1) {
          if (
            values[n - 1] === 0 &&
            values[n - 2] === 0 &&
            values[n - 3] === 0 &&
            values[n - 4] === "t"
          ) {
            scopes.push(x - 2);
            cl = true;
          }
        }
      }
    }

    if (scopes.length) return scopes;
  }

  function checkWhite(n, values) {
    var target = values[n];
    var scopes = [];
    var x = n;

    if (target === "p") {
      var forward = n + 8;
      if (forward < 64 && values[forward] === 0) {
        scopes.push(forward);
        if (Math.floor(n / 8) === 1) {
          var forward2 = n + 16;
          if (forward2 < 64 && values[forward2] === 0) {
            scopes.push(forward2);
          }
        }
      }
      if (n % 8 !== 0) {
        var captureLeft = n + 7;
        if (captureLeft < 64 && "otmvlw".indexOf(values[captureLeft]) >= 0) {
          scopes.push(captureLeft);
        }
      }
      if (n % 8 !== 7) {
        var captureRight = n + 9;
        if (captureRight < 64 && "otmvlw".indexOf(values[captureRight]) >= 0) {
          scopes.push(captureRight);
        }
      }
    } else if (target === "r") {
      x = n;

      // mover para cima
      x -= 8;
      while (x >= 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }

        x -= 8;
      }

      x = n;

      // mover para baixo
      x += 8;
      while (x < 64) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }

        x += 8;
      }

      x = n;

      // mover para direita
      x++;
      while (x < 64 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }

        x++;
      }

      x = n;

      // mover para esquerda
      x--;
      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }

        x--;
      }
    } else if (target === "n") {
      var knightJumps = [-17, -15, -10, -6, 6, 10, 15, 17];
      for (var kj = 0; kj < knightJumps.length; kj++) {
        x = n + knightJumps[kj];
        if (x < 0 || x >= 64) {
          continue;
        }
        if (Math.abs((x % 8) - (n % 8)) > 2) {
          continue;
        }
        if (
          values[x] === 0 ||
          "otmvlw".indexOf(values[x]) >= 0
        ) {
          scopes.push(x);
        }
      }
    } else if (target === "b") {
      x = n;

      // mover para cima esquerda
      x -= 9;

      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }

        x -= 9;
      }

      x = n;

      // mover para baixo esquerda
      x += 7;
      while (x < 64 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }

        x += 7;
      }

      x = n;

      // mover para baixo direita
      x += 9;
      while (x < 64 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 9;
      }

      x = n;

      // mover para cima direita
      x -= 7;
      while (x >= 0 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 7;
      }
    } else if (target === "q") {
      x = n;

      // mover para cima
      x -= 8;
      while (x >= 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 8;
      }

      x = n;

      // mover para baixo
      x += 8;
      while (x < 64) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 8;
      }

      x = n;

      // mover para direita
      x++;
      while (x < 64 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x++;
      }

      x = n;

      // mover para esquerda
      x--;
      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x--;
      }

      x = n;

      // mover para cima esquerda
      x -= 9;
      while (x >= 0 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 9;
      }

      x = n;

      // mover para baixo esquerda
      x += 7;
      while (x < 64 && x % 8 !== 7) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }

        x += 7;
      }

      x = n;

      // mover para baixo direita
      x += 9;
      while (x < 64 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x += 9;
      }

      x = n;

      // mover para cima direita
      x -= 7;
      while (x >= 0 && x % 8 !== 0) {
        if (values[x] === 0) {
          scopes.push(x);
        } else if ("otmvlw".indexOf(values[x]) >= 0) {
          scopes.push(x);
          break;
        } else {
          break;
        }
        x -= 7;
      }
    } else if (target === "k") {
      x = n;

      // mover uma casa para baixo
      x += 8;
      if (
        ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
        x < 64 &&
        x >= 0
      ) {
        scopes.push(x);
      }

      x = n;

      // mover uma casa para cima
      x -= 8;
      if (
        ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
        x < 64 &&
        x >= 0
      ) {
        scopes.push(x);
      }

      x = n;

      // casas à esquerda e diagonais (coluna > a)
      if (x % 8 > 0) {
        x = n;

        // mover uma casa para esquerda
        x -= 1;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;

        // mover uma casa para cima esquerda
        x -= 9;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;

        // mover uma casa para baixo esquerda
        x += 7;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
      }

      x = n;

      // casas à direita e diagonais (coluna < h)
      if (x % 8 < 7) {
        x = n;

        // mover uma casa para direita
        x += 1;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;

        // mover uma casa para baixo direita
        x += 9;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }

        x = n;

        // mover uma casa para cima direita
        x -= 7;
        if (
          ("otmvlw".indexOf(values[x]) >= 0 || values[x] === 0) &&
          x < 64 &&
          x >= 0
        ) {
          scopes.push(x);
        }
      }
    }

    if (scopes.length) return scopes;
  }

  function copyBoard() {
    var board = [];
    for (var i = 0; i < 64; i++) {
      board[i] = values[i];
    }
    return board;
  }

  function isWhiteKingInCheck(board) {
    var kingSq = -1;
    for (var i = 0; i < 64; i++) {
      if (board[i] === "l") {
        kingSq = i;
        break;
      }
    }
    if (kingSq < 0) {
      return true;
    }
    for (var y = 0; y < 64; y++) {
      if ("prnbkq".indexOf(board[y]) >= 0) {
        var checkScp = checkWhite(y, board) || [];
        for (var z = 0; z < checkScp.length; z++) {
          if (checkScp[z] === kingSq) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function isBlackKingInCheck(board) {
    var kingSq = -1;
    for (var i = 0; i < 64; i++) {
      if (board[i] === "k") {
        kingSq = i;
        break;
      }
    }
    if (kingSq < 0) {
      return true;
    }
    for (var y = 0; y < 64; y++) {
      if ("otmvlw".indexOf(board[y]) >= 0) {
        var checkScp = checkBlack(y, board) || [];
        for (var z = 0; z < checkScp.length; z++) {
          if (checkScp[z] === kingSq) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function isLegalWhiteMove(from, to) {
    var board = copyBoard();
    board[to] = board[from];
    board[from] = 0;
    if (from === 60 && to === 62) {
      board[61] = board[63];
      board[63] = 0;
    } else if (from === 60 && to === 58) {
      board[59] = board[56];
      board[56] = 0;
    }
    if (board[to] === "o" && to < 8) {
      board[to] = "w";
    }
    return !isWhiteKingInCheck(board);
  }

  function isLegalBlackMove(from, to) {
    var board = copyBoard();
    board[to] = board[from];
    board[from] = 0;
    if (board[to] === "p" && to >= 56) {
      board[to] = "q";
    }
    return !isBlackKingInCheck(board);
  }

  function getLegalBlackMoves() {
    var moves = [];
    for (var i = 0; i < 64; i++) {
      if ("prnbkq".indexOf(values[i]) < 0) {
        continue;
      }
      var scopes = checkWhite(i, values) || [];
      for (var s = 0; s < scopes.length; s++) {
        var to = scopes[s];
        if (isLegalBlackMove(i, to)) {
          moves.push({ from: i, to: to });
        }
      }
    }
    return moves;
  }

  function renderPiecesAndHighlights() {
    updateSquareColor();
    for (var x = 0; x < 64; x++) {
      sqs[x].innerHTML = fonts[values[x]];
      if (values[x] === 0) {
        sqs[x].innerHTML = "";
      }
    }
    if (moveable) {
      for (var h = 0; h < moveScopes.length; h++) {
        sqs[Number(moveScopes[h])].style.background = "#f45";
      }
    }
  }

  var turnStatus = document.createElement("p");
  turnStatus.style.cssText =
    "position:fixed;top:0;left:0;margin:0.5rem;font-size:0.85rem;font-family:sans-serif;color:#fcce9c;z-index:2;pointer-events:none;";
  document.body.appendChild(turnStatus);

  function updateTurnStatus() {
    if (gameOver) {
      turnStatus.textContent = gameOverMessage;
      return;
    }
    if (cpuThinking) {
      turnStatus.textContent = "Vez da CPU (pretas)...";
      return;
    }
    if (myTurn) {
      turnStatus.textContent = "Sua vez (brancas)";
    }
  }

  function applyBlackMove(from, to) {
    values[to] = values[from];
    values[from] = 0;
    if (values[to] === "p" && to >= 56) {
      values[to] = "q";
    }
  }

  function pickCpuMove(moves) {
    var captures = [];
    for (var i = 0; i < moves.length; i++) {
      if (values[moves[i].to] !== 0) {
        captures.push(moves[i]);
      }
    }
    var pool = captures.length ? captures : moves;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function cpuTurn() {
    var moves = getLegalBlackMoves();
    if (moves.length === 0) {
      cpuThinking = false;
      gameOver = true;
      if (isBlackKingInCheck(values)) {
        gameOverMessage = "Xeque-mate! Você venceu.";
      } else {
        gameOverMessage = "Empate (CPU sem lances legais).";
      }
      updateTurnStatus();
      return;
    }
    var choice = pickCpuMove(moves);
    applyBlackMove(choice.from, choice.to);
    cpuThinking = false;
    myTurn = true;
    moveable = false;
    moveScopes = [];
    renderPiecesAndHighlights();
    if (getLegalWhiteMoves().length === 0) {
      gameOver = true;
      if (isWhiteKingInCheck(values)) {
        gameOverMessage = "Xeque-mate! A CPU venceu.";
      } else {
        gameOverMessage = "Empate (sem lances legais).";
      }
    }
    updateTurnStatus();
  }

  function getLegalWhiteMoves() {
    var moves = [];
    for (var i = 0; i < 64; i++) {
      if ("otmvlw".indexOf(values[i]) < 0) {
        continue;
      }
      var scopes = checkBlack(i, values) || [];
      for (var s = 0; s < scopes.length; s++) {
        var to = scopes[s];
        if (isLegalWhiteMove(i, to)) {
          moves.push({ from: i, to: to });
        }
      }
    }
    return moves;
  }


  function filterLegalScopes(from, scopes) {
    var legal = [];
    for (var i = 0; i < scopes.length; i++) {
      if (isLegalWhiteMove(from, scopes[i])) {
        legal.push(String(scopes[i]));
      }
    }
    return legal;
  }

  function check() {
    if (gameOver || cpuThinking || !myTurn) {
      return;
    }

    var n = Number(this.classList[1].slice(1));
    var scopes = checkBlack(n, values) || [];
    var legalScopes = filterLegalScopes(n, scopes);

    if (!moveable) {
      if (legalScopes.length > 0) {
        moveable = true;
        moveTarget = n;
        moveScopes = legalScopes;
      }
    } else if (moveScopes.indexOf(String(n)) >= 0) {
      if (!isLegalWhiteMove(moveTarget, n)) {
        alert("Rei em perigo!");
      } else {
        values[n] = values[moveTarget];
        values[moveTarget] = 0;
        if (cl) {
          if (n === 62 && moveTarget === 60) {
            values[61] = "t";
            values[63] = 0;
          } else if (n === 58 && moveTarget === 60) {
            values[59] = "t";
            values[56] = 0;
          }
        }

        if (moveTarget === 60) {
          ck = true;
        } else if (moveTarget === 63) {
          cr2 = true;
        } else if (moveTarget === 56) {
          cr1 = true;
        }

        if (values[n] === "o" && n < 8) {
          values[n] = "w";
        }

        moveable = false;
        moveScopes = [];
        myTurn = false;
        cl = false;
        renderPiecesAndHighlights();

        if (getLegalBlackMoves().length === 0) {
          gameOver = true;
          if (isBlackKingInCheck(values)) {
            gameOverMessage = "Xeque-mate! Você venceu.";
          } else {
            gameOverMessage = "Empate (CPU sem lances legais).";
          }
          updateTurnStatus();
          return;
        }

        cpuThinking = true;
        updateTurnStatus();
        if (cpuTimerId) {
          clearTimeout(cpuTimerId);
        }
        cpuTimerId = setTimeout(cpuTurn, 500);
        return;
      }
    } else {
      moveScopes = [];
      moveable = false;
      if (legalScopes.length > 0) {
        moveable = true;
        moveTarget = n;
        moveScopes = legalScopes;
      }
    }

    renderPiecesAndHighlights();
  }

  for (var ri = 0; ri < 64; ri++) {
    sqs[ri].addEventListener("click", check);
  }

  updateTurnStatus();
};
