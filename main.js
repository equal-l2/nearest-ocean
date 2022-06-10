let lines;

fetch("./coastline.json")
  .then((resp) => resp.json())
  .then((data) => (lines = data))
  .catch((e) => console.log(e));

// vector arithmetic
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const scalarMul = (k, v) => [k * v[0], k * v[1]];
const sqDist = (a, b) => Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2);

function findNearestCoastline(lon, lat) {
  // N.B. coords in `lines` is [lon, lat] but google only accepts "lat,lon"
  const current = [lon, lat];
  let minP = [Infinity, Infinity];
  let minDist = Infinity;
  for (const coords of lines) {
    const cnt = coords.length;
    for (let i = 0; i < cnt - 1; i++) {
      const start = coords[i];
      const end = coords[i + 1];
      const vecA = sub(end, start); // a := start -> end
      const vecB = sub(current, start); // b := start -> current
      const onlineLen = dot(vecA, vecB) / dot(vecA, vecA); // (a, b) / (a, a) = b cosθ / |a|

      const localNearest = (() => {
        if (onlineLen <= 0) return start;
        else if (onlineLen >= 1) return end;
        else return add(start, scalarMul(onlineLen, vecA)); // start + (a/|a|) * b cosθ
      })();

      const dist = sqDist(current, localNearest);
      if (dist < minDist) {
        minDist = dist;
        minP = localNearest;
      }
    }
  }

  return minP;
}

function doCalc() {
  const aResult = document.getElementById("result");
  const spanError = document.getElementById("error");
  aResult.innerText = "";
  aResult.href = "";
  spanError.innerText = "";
  const lon = Number(document.getElementById("lon").value);
  const lat = Number(document.getElementById("lat").value);
  const res = (() => {
    if (lat == "" || lon == "" || isNaN(lon) || isNaN(lat)) return null;
    return findNearestCoastline(lon, lat);
  })();

  const resultMesg = document.getElementById("result-mesg");
  if (res !== null) {
    // c.f. https://developers.google.com/maps/documentation/urls/get-started#directions-action
    const link = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=${res[1]},${res[0]}`;
    aResult.href = link;
    aResult.innerText = link;
    resultMesg.classList.remove("is-danger");
  } else {
    spanError.innerText = "経度・緯度に不正な値が入力されました";
    resultMesg.classList.add("is-danger");
  }
}

function getGeoloc() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = pos.coords;
      document.getElementById("lon").value = coords.longitude;
      document.getElementById("lat").value = coords.latitude;
      doCalc();
    },
    (e) => {
      const text = (() => {
        if (e.code === 1) return "位置情報取得が拒否されています";
        else return "位置情報取得に失敗しました";
      })();
      alert(text);
    }
  );
}

function fromGooglian() {
  const googlian = document.getElementById("googlian").value;
  const split1 = googlian.split(",");
  const split2 = googlian.split(" ");
  let split;
  if (split1.length === 2) split = split1;
  else if (split2.length === 2) split = split2;
  else {
    setGooglianValidity(false);
    return;
  }

  if (split[0] == "" || split[1] == "") {
    setGooglianValidity(false);
    return;
  }

  const lat = Number(split[0].trim());
  const lon = Number(split[1].trim());
  if (isNaN(lon) || isNaN(lat)) {
    setGooglianValidity(false);
    return;
  }

  document.getElementById("lon").value = lon;
  document.getElementById("lat").value = lat;
  setGooglianValidity(true);
}

function setGooglianValidity(isValid) {
  const googlianInput = document.getElementById("googlian");
  if (isValid) {
    googlianInput.classList.remove("is-danger");
  } else {
    googlianInput.classList.add("is-danger");
  }
}

document.getElementById("run").addEventListener("click", doCalc);
document.getElementById("get-current").addEventListener("click", getGeoloc);
document.getElementById("googlian").addEventListener("input", fromGooglian);
