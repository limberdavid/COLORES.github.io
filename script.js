const colorBox = document.getElementById("colorBox");
const colorHex = document.getElementById("colorHex");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const historyGrid = document.getElementById("historyGrid");
const rgbText = document.getElementById("rgbText");
const hslText = document.getElementById("hslText");
const toast = document.getElementById("toast");

let history = JSON.parse(localStorage.getItem("limberColors")) || [];

function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

function hexToRgb(hex) {
    const r = parseInt(hex.substr(1,2),16);
    const g = parseInt(hex.substr(3,2),16);
    const b = parseInt(hex.substr(5,2),16);
    return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex) {
    let r = parseInt(hex.substr(1,2),16)/255;
    let g = parseInt(hex.substr(3,2),16)/255;
    let b = parseInt(hex.substr(5,2),16)/255;

    let max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h,s,l = (max+min)/2;

    if(max === min){
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d/(2-max-min) : d/(max+min);
        switch(max){
            case r: h = (g-b)/d + (g<b?6:0); break;
            case g: h = (b-r)/d + 2; break;
            case b: h = (r-g)/d + 4; break;
        }
        h /= 6;
    }
    return `hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
}

function applyColor(color) {
    colorBox.style.background = color;
    colorHex.textContent = color;
    rgbText.textContent = hexToRgb(color);
    hslText.textContent = hexToHsl(color);
    saveHistory(color);
}

function saveHistory(color) {
    if(history[0] === color) return;
    history.unshift(color);
    history = history.slice(0, 12);
    localStorage.setItem("limberColors", JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyGrid.innerHTML = "";
    history.forEach(c => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.style.background = c;
        div.onclick = () => applyColor(c);
        historyGrid.appendChild(div);
    });
}

function showToast() {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

generateBtn.onclick = () => applyColor(randomColor());
copyBtn.onclick = () => {
    navigator.clipboard.writeText(colorHex.textContent);
    showToast();
};
clearBtn.onclick = () => {
    history = [];
    localStorage.removeItem("limberColors");
    renderHistory();
};

document.addEventListener("keydown", e => {
    if(e.key === "Enter") applyColor(randomColor());
});

renderHistory();
if(history.length) applyColor(history[0]);
else applyColor(randomColor());
