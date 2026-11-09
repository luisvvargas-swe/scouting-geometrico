"use strict";

const select = document.querySelector("#reference");
const ranking = document.querySelector("#ranking");
const metrics = document.querySelector("#metrics");
const key = document.querySelector("#key");
const announcement = document.querySelector("#announcement");
const metricLabels = ["Goles", "Asistencias", "Minutos jugados", "Tiros por 90 min"];
const scores = standardizeStats(scoutingAthletes);
const numberFormat = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 });
const distanceFormat = new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const maxima = metricLabels.map((_, i) => Math.max(...scoutingAthletes.map(player => player.stats[i])));

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

// The pitch provides a backdrop. Only the four labeled radar axes represent data.
function drawRadar(players) {
  const canvas = document.querySelector("#radar");
  const ctx = canvas.getContext("2d");
  const center = [320, 154];
  const radius = 108;
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  function position(index, fraction) {
    const [dx, dy] = directions[index];
    return [center[0] + dx * radius * fraction, center[1] + dy * radius * fraction];
  }
  function polygon(points, fill, stroke) {
    ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#42404d";
  ctx.strokeRect(10, 14, 620, 278);
  ctx.strokeRect(10, 82, 61, 142);
  ctx.strokeRect(569, 82, 61, 142);
  ctx.strokeRect(10, 110, 24, 86);
  ctx.strokeRect(606, 110, 24, 86);
  ctx.beginPath();
  ctx.moveTo(320, 14); ctx.lineTo(320, 292);
  ctx.stroke();
  ctx.beginPath(); ctx.arc(...center, 38, 0, 2 * Math.PI); ctx.stroke();

  [0.25, 0.5, 0.75, 1].forEach(scale => {
    polygon(directions.map((_, i) => position(i, scale)), null, "#71667d");
  });
  ctx.strokeStyle = "#61566c";
  directions.forEach((_, i) => {
    ctx.beginPath(); ctx.moveTo(...center); ctx.lineTo(...position(i, 1)); ctx.stroke();
  });
  const colors = ["#79ffbd", "#b99aff"];
  players.forEach((player, playerIndex) => {
    const points = player.stats.map((value, i) => position(i, maxima[i] ? value / maxima[i] : 0));
    ctx.lineWidth = 3;
    ctx.setLineDash(playerIndex ? [7, 4] : []);
    polygon(points, playerIndex ? "#ad86ff33" : "#79ffbd22", colors[playerIndex]);
    ctx.setLineDash([]);
    ctx.fillStyle = colors[playerIndex];
    points.forEach(([x, y]) => {
      ctx.save(); ctx.translate(x, y);
      if (playerIndex) ctx.rotate(Math.PI / 4);
      ctx.fillRect(-3, -3, 6, 6); ctx.restore();
    });
  });
  ctx.font = "600 17px ui-monospace, monospace";
  ctx.fillStyle = "#f0eef7";
  ctx.textBaseline = "middle";
  [["Goles",320,27,"center"],["Asistencias",443,154,"left"],["Minutos",320,280,"center"],["Tiros/90",197,154,"right"]]
    .forEach(([text, x, y, align]) => { ctx.textAlign = align; ctx.fillText(text, x, y); });
  canvas.setAttribute("aria-label", "Perfil relativo de " + players[0].name + " y " + players[1].name +
    ". Los valores se detallan en Perfil de juego.");
}

function compare(reference, candidate) {
  const players = [scoutingAthletes[reference], scoutingAthletes[candidate]];
  key.replaceChildren(...players.map((player, index) =>
    element("span", player.name, index === 0 ? "key-reference" : "key-candidate")
  ));
  document.querySelector("#radar-key").replaceChildren(...Array.from(key.children, item => item.cloneNode(true)));
  drawRadar(players);
  const rows = metricLabels.map((title, column) => {
    const row = element("div", undefined, "metric");
    row.append(element("h3", title));
    players.forEach((player, index) => {
      const value = player.stats[column];
      const bar = element("div", undefined, "bar-row");
      const track = element("span", undefined, "track");
      const fill = element("span", undefined, index === 0 ? "fill reference" : "fill candidate");
      fill.style.width = (value / maxima[column] * 100) + "%";
      track.setAttribute("aria-hidden", "true");
      track.append(fill);
      const label = element("span", undefined, "value");
      label.append(element("span", player.name + ": ", "visually-hidden"), numberFormat.format(value));
      bar.append(track, label);
      row.append(bar);
    });
    return row;
  });
  metrics.replaceChildren(...rows);
  for (const button of ranking.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(Number(button.dataset.player) === candidate));
  }
  announcement.textContent = "Comparación de " + players[0].name + " con " + players[1].name + ".";
}

function update() {
  const index = Number(select.value);
  const method = document.querySelector('input[name="method"]:checked').value;
  const distances = nearestPlayers(scores, index, method);
  const items = distances.map(({ index: playerIndex, distance }, position) => {
    const item = element("li");
    const button = element("button");
    button.type = "button";
    button.dataset.player = String(playerIndex);
    const order = element("span", String(position + 1).padStart(2, "0"), "order");
    order.setAttribute("aria-hidden", "true");
    button.append(order, element("span", scoutingAthletes[playerIndex].name), element("span", distanceFormat.format(distance), "distance"));
    button.addEventListener("click", () => compare(index, playerIndex));
    item.append(button);
    return item;
  });
  ranking.replaceChildren(...items);
  compare(index, distances[0].index);
}

scoutingAthletes.forEach((athlete, index) => select.add(new Option(athlete.name, String(index))));
select.addEventListener("change", update);
document.querySelectorAll('input[name="method"]').forEach(input => input.addEventListener("change", update));
update();
