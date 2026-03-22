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



// ---Configuring the color picker---

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



// ---Event Listners---

generateBtn.addEventListener("click", () => {
  const paletteType = Number(paletteTypeDropdown.value);

  const paletteGenerators = [
    generateMonochromaticPalette(baseColor, 6),
    generateAnalogousPalette(baseColor),
    generateComplementaryPalette(baseColor),
    generateSplitComplementaryPalette(baseColor),
    generateTriadPalette(baseColor)
  ];

  if (isNaN(paletteType)){
    alert("Something went wrong!");
    return;
  }

  const colorPalette = paletteGenerators[paletteType];
  console.log(colorPalette);
  Array.from(colorPaletteDiv.children).forEach((element, index) => {
    const hsl = colorPalette[index];
    element.querySelector(".color").style.backgroundColor = `hsl(${hsl.hue}, ${hsl.saturation}%, ${hsl.lightness}%)`;
    element.querySelector(".hex-code").textContent = hslToHex(hsl.hue, hsl.saturation, hsl.lightness);
  });
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

Array.from(colorPaletteDiv.children).forEach((element) => {
  element.addEventListener("click", () => {
    const icon = element.querySelector("i");
    const hexCode = element.querySelector(".hex-code").textContent;
    
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
    .catch (e)(
      alert("Failed to copy...")
    );
  });
});



// Basic Initialization
generateRandomBackgroundColor();
selectColorDiv.style.backgroundColor = `hsl(${baseColor.hue}, 100%, 50%)`;
generateBtn.click();



//! ---Functions after this point---

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
  for (let i = 0; i < count-1; i++){
    const saturation = Math.floor(Math.random() * 100);
    const lightness = Math.floor(Math.random() * 100);
    const color = new HSL(hue, saturation, lightness);
    colorPalette.push(color);
  }
  colorPalette.push(sampleColor);
  return colorPalette;
}

function generateAnalogousPalette(sampleColor){
  const colorPalette = [];
  const saturation = sampleColor.saturation;
  const lightness = sampleColor.lightness;

  const randomizer = Math.round(Math.random() * 5) + 10;

  let hue = sampleColor.hue - (randomizer * 2);
  colorPalette.push(new HSL(hue, saturation, lightness));
  for (let i = 0; i < 5; i++){
    hue += randomizer;
    colorPalette.push(new HSL(hue, saturation, lightness));
  }
  return colorPalette;
}

function generateComplementaryPalette(sampleColor){
  const complementColor = new HSL(sampleColor.hue + 180, sampleColor.saturation, sampleColor.lightness);
  const colorPalette = [...generateMonochromaticPalette(sampleColor, 3), ...generateAnalogousPalette(complementColor, 3)];
  return colorPalette;
}

function generateSplitComplementaryPalette(sampleColor){
  const complementColor1 = new HSL(sampleColor.hue + 195, sampleColor.saturation, sampleColor.lightness);
  const complementColor2 = new HSL(sampleColor.hue + 165, sampleColor.saturation, sampleColor.lightness);
  const colorPalette = [
    ...generateMonochromaticPalette(sampleColor, 2),
    ...generateMonochromaticPalette(complementColor1, 2),
    ...generateMonochromaticPalette(complementColor2, 2)
  ];
  return colorPalette;
}

function generateTriadPalette(sampleColor){
  const complementColor1 = new HSL(sampleColor.hue + 120, sampleColor.saturation, sampleColor.lightness);
  const complementColor2 = new HSL(sampleColor.hue - 120, sampleColor.saturation, sampleColor.lightness);
  const colorPalette = [
    ...generateMonochromaticPalette(sampleColor, 2),
    ...generateMonochromaticPalette(complementColor1, 2),
    ...generateMonochromaticPalette(complementColor2, 2)
  ];
  return colorPalette;
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