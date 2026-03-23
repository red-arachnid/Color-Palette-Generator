class HSL {
  constructor(hue, saturation, lightness){
    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
  }
}

// DOM Elements
const selectColorDiv = document.getElementById("colorCode");
const paletteTypeDropdown = document.getElementById("paletteType");
const generateBtn = document.getElementById("generateBtn");

const colorPickerDiv = document.getElementById("pickerContainer");
const randomColorBtn = colorPickerDiv.querySelector("button");

const colorPaletteDiv = document.querySelector(".color-palettes");

let colorPickerTimeId;
let baseColor = new HSL(generateRandomHue(), 100, 50);
let paletteCount = 6;

const paletteGenerators = {
  0: () => generateMonochromaticPalette(baseColor, paletteCount),
  1: () => generateAnalogousPalette(baseColor, paletteCount),
  2: () => generateComplementaryPalette(baseColor, paletteCount),
  3: () => generateSplitComplementaryPalette(baseColor, paletteCount),
  4: () => generateTriadPalette(baseColor, paletteCount)
};



const colorPicker = new iro.ColorPicker("#colorPicker", {
  width: 200,
  color: "#f00",
  borderWidth: 2,
  borderColor: "#fff",
});
colorPicker.on('color:change', function(color) {
  selectColorDiv.style.backgroundColor = color.hexString;
  let hsl = hsvToHsl(color.hue, color.saturation, color.value);
  baseColor.hue = hsl.h;
  baseColor.saturation = hsl.s;
  baseColor.lightness = hsl.l;
});


generateBtn.addEventListener("click", () => {
  const paletteType = paletteTypeDropdown.value;

  const generatePalette = paletteGenerators[paletteType];

  if (!generatePalette){
    alert("Something went wrong");
    return;
  }

  const colorPalette = generatePalette();

  renderPalettes(colorPalette);
});


selectColorDiv.addEventListener("click", () => {
  colorPickerDiv.style.display = "block";
  colorPickerDiv.style.opacity = "100%";
});

colorPickerDiv.addEventListener("click", event => event.stopPropagation());

colorPickerDiv.addEventListener("mouseenter", (event) => {
  event.stopPropagation();
  clearTimeout(colorPickerTimeId);
  colorPickerDiv.style.opacity = "100%";
});

colorPickerDiv.addEventListener("mouseleave", (event) => {
  event.stopPropagation();
  colorPickerDiv.style.opacity = "40%";
  colorPickerTimeId = setTimeout(() => {
    colorPickerDiv.style.display = "none";  
  }, 1400);
})

randomColorBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  let hue = generateRandomHue();
  selectColorDiv.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
  baseColor.hue = hue;
  baseColor.saturation = 100;
  baseColor.lightness = 50;
  colorPickerDiv.style.display = "none";
});


generateRandomBackgroundColor();
selectColorDiv.style.backgroundColor = `hsl(${baseColor.hue}, 100%, 50%)`;
generateBtn.click();


/// FUNCTIONS

function renderPalettes(colorPalette){
  colorPaletteDiv.innerHTML = "";

  colorPalette.forEach(color => {
    const hexCode = hslToHex(color.hue, color.saturation, color.lightness);
    const colorBox = document.createElement("div");
    colorBox.classList.add("color-box");
    colorBox.innerHTML = `
      <div class="color" style="background-color: ${hexCode}"></div>
      <div class="color-info">
          <p class="hex-code">${hexCode.toUpperCase()}</p>
          <i class="fa-regular fa-copy" title="Click To Copy"></i>
      </div>
    `;

    colorBox.addEventListener("click", () => copyToClipboard(hexCode, colorBox.querySelector("i")));
    colorPaletteDiv.appendChild(colorBox);
  });
}

function copyToClipboard(hexCode, icon) {
  navigator.clipboard.writeText(hexCode)
  .then(() => {
    icon.classList.remove("fa-regular", "fa-copy");
    icon.classList.add("fa-solid", "fa-check");
    icon.style.color = "#3bc757";

    setTimeout(() => {
      icon.classList.add("fa-regular", "fa-copy");
      icon.classList.remove("fa-solid", "fa-check");
      icon.style.color = "#000";
    }, 1000);
  })
  .catch(error => alert("Failed to copy..."));
}

function generateRandomBackgroundColor(){
  const hue = generateRandomHue();
  document.body.style.background = `radial-gradient(circle at center, hsl(${hue}, 100%, 88%), hsl(${hue}, 70%, 68%))`;
}

function generateRandomHue() {
  return Math.floor(Math.random() * 360);
}

function generateMonochromaticPalette(sampleColor, count){
  const colorPalette = [];
  const hue = sampleColor.hue;
  for (let i = 0; i < count; i++){
    const saturation = Math.floor(Math.random() * 100);
    const lightness = Math.floor(Math.random() * 100);
    const color = new HSL(hue, saturation, lightness);
    colorPalette.push(color);
  }
  return colorPalette;
}

function generateAnalogousPalette(sampleColor, count){
  const colorPalette = [];
  const saturation = sampleColor.saturation;
  const lightness = sampleColor.lightness;

  const randomizer = Math.round(Math.random() * 5) + 10;

  let hue = sampleColor.hue - (randomizer * 2);
  for (let i = 0; i < count; i++){
    colorPalette.push(new HSL(hue, saturation, lightness));
    hue += randomizer;
  }
  return colorPalette;
}

function generateComplementaryPalette(sampleColor, count){
  let compliementaryCount = Math.round(count / 2);
  count -= compliementaryCount;

  const complementAngle = Math.round(Math.random() * 20) + 170;

  const complementColor = new HSL(sampleColor.hue + complementAngle, sampleColor.saturation, sampleColor.lightness);
  const colorPalette = [...generateMonochromaticPalette(sampleColor, count), ...generateAnalogousPalette(complementColor, compliementaryCount)];
  return colorPalette;
}

function generateSplitComplementaryPalette(sampleColor, count){
  const counts = divideIntoThree(count);

  const complementAngle = Math.round(Math.random() * 20) + 170;

  const complementColor1 = new HSL(sampleColor.hue + complementAngle + 15, sampleColor.saturation, sampleColor.lightness);
  const complementColor2 = new HSL(sampleColor.hue + complementAngle - 15, sampleColor.saturation, sampleColor.lightness);
  const colorPalette = [
    ...generateMonochromaticPalette(sampleColor, counts[0]),
    ...generateMonochromaticPalette(complementColor1, counts[1]),
    ...generateMonochromaticPalette(complementColor2, counts[2])
  ];
  return colorPalette;
}

function generateTriadPalette(sampleColor, count){
  const counts = divideIntoThree(count);

  const complementColor1 = new HSL(sampleColor.hue + 120, sampleColor.saturation, sampleColor.lightness);
  const complementColor2 = new HSL(sampleColor.hue - 120, sampleColor.saturation, sampleColor.lightness);
  const colorPalette = [
    ...generateMonochromaticPalette(sampleColor, counts[0]),
    ...generateMonochromaticPalette(complementColor1, counts[1]),
    ...generateMonochromaticPalette(complementColor2, counts[2])
  ];
  return colorPalette;
}

function divideIntoThree(num){
  const base = Math.floor(num / 3);
  const remainder = num % 3;

  return [
    base + (remainder > 0 ? 1 : 0),
    base + (remainder > 1 ? 1 : 0),
    base
  ];
}

//Color Mathsss
function hsvToHsl(h, s, v) {
    s /= 100;
    v /= 100;

    let l = v * (1 - s / 2);
    let MathS = (l === 0 || l === 1) 
                ? 0 
                : (v - l) / Math.min(l, 1 - l);
    
    return {
        h: h,
        s: Math.round(MathS * 100),
        l: Math.round(l * 100)
    };
}

function hslToHex(h, s, l){
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);

  const f = n => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return Math.round(255 * color);
  };

  let hex = "#";
  hex += f(0).toString(16).padEnd(2, "0");
  hex += f(8).toString(16).padEnd(2, "0");
  hex += f(4).toString(16).padEnd(2, "0");
  return hex;
}