const downloadLink = document.querySelector(".get");
const darkColorInput = document.querySelector(".qr-dark");
const lightColorInput = document.querySelector(".qr-light");
const qrBox = document.querySelector("#qr-render");
const qrContentInput = document.querySelector(".input-text");
const sendButton = document.querySelector(".send-btn");
const dimensionSelector = document.querySelector(".dimension");

darkColorInput.addEventListener("input", updateDarkColor);
lightColorInput.addEventListener("input", updateLightColor);
qrContentInput.addEventListener("input", updateQRContent);
dimensionSelector.addEventListener("change", updateDimension);
sendButton.addEventListener("click", sendQR);

const presetUrl = "https://youtube.com/@CodeCraze";
let lightColor = "#fff",
    darkColor = "#000",
    content = presetUrl,
    qrDimension = 300;

function updateDarkColor(event) {
    darkColor = event.target.value;
    renderQR();
}

function updateLightColor(event) {
    lightColor = event.target.value;
    renderQR();
}

function updateQRContent(event) {
    const userInput = event.target.value;
    content = userInput ? userInput : presetUrl;
    renderQR();
}

async function renderQR() {
    qrBox.innerHTML = "";
    new QRCode("qr-render", {
        text: content,
        height: qrDimension,
        width: qrDimension,
        colorLight: lightColor,
        colorDark: darkColor,
    });
    downloadLink.href = await getDataUrl();
}

async function sendQR() {
    setTimeout(async () => {
        try {
            const encodedUrl = await getDataUrl();
            const qrBlob = await (await fetch(encodedUrl)).blob();
            const qrFile = new File([qrBlob], "MyQR.png", {
                type: qrBlob.type,
            });
            await navigator.share({
                files: [qrFile],
                title: content,
            });
        } catch (err) {
            alert("Sharing is not supported in this browser.");
        }
    }, 100);
}

function updateDimension(event) {
    qrDimension = event.target.value;
    renderQR();
}

function getDataUrl() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const qrImage = document.querySelector("#qr-render img");
            if (qrImage && qrImage.currentSrc) {
                resolve(qrImage.currentSrc);
            } else {
                const qrCanvas = document.querySelector("canvas");
                resolve(qrCanvas.toDataURL());
            }
        }, 50);
    });
}

renderQR();
