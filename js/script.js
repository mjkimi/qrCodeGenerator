const form = document.getElementById('generate-form');
const qr = document.getElementById('qrcode');
const spinner = document.getElementById('spinner');

const onGenerateSubmit = (e) => {
  e.preventDefault();

  clearUI();

  const url = document.getElementById('url').value;
  const size = document.getElementById('size').value;

  if (url === '') {
    alert('Please enter a URL');
  } else {
    showSpinner();

    setTimeout(() => {
      hideSpinner();
      generateQRCode(url, size);

      setTimeout(() => {
        const saveUrl = qr.querySelector('img').src;
        createSaveBtn(saveUrl, url, size);
      }, 50);
    }, 1000);
  }
};

const generateQRCode = (url, size) => {
  const qrcode = new QRCode('qrcode', {
    text: url,
    width: size,
    height: size,
  });
};

const showSpinner = () => {
  spinner.style.display = 'block';
};
const hideSpinner = () => {
  spinner.style.display = 'none';
};

const clearUI = () => {
  qr.innerHTML = '';
  const saveLink = document.getElementById('save-link');
  if (saveLink) saveLink.remove();
};

const createSaveBtn = (saveUrl, url, size) => {
  url = url.replace(/[^a-zA-Z0-9]/g, '_');
  const link = document.createElement('a');
  link.id = 'save-link';
  link.classList =
    'bg-gray-600 hover:bg-red-700 text-white font-bold py-2 rounded w-1/3 m-auto my-5';
  link.href = saveUrl;
  link.download = `QR for ${url}-${size}`;
  link.innerHTML = 'Save Image';
  document.getElementById('generated').appendChild(link);
  setTimeout(() => {
    link.scrollIntoView();
  }, 50);
};

form.addEventListener('submit', onGenerateSubmit);

// ---start wave effect on label
const urlLabel = form.querySelector('label');
urlLabel.innerHTML = urlLabel.innerText
  .split('')
  .map((letter, idx) => {
    if (letter === ' ') {
      letter = '&nbsp;';
    }
    return `<span class="inline-block transition duration-150 ease-[cubic-bezier(0.68, -0.55, 0.265, 1.55)]" style="transition-delay:${
      idx * 30
    }ms">${letter}</span>`;
  })
  .join('');
// ---end wave effect

// ---start hover board tiles
const tilesContainer = document.getElementById('tiles-container');
const colors = ['#e74c3c', '#8e44ad', '#3498db', '#e67e22', '#2ecc71'];

let width = tilesContainer.offsetWidth;
let SQUARES = numberOfSquares(width);
populateSquares(SQUARES);

window.addEventListener('resize', updateSquaresAmount);
function updateSquaresAmount() {
  const newWidth = tilesContainer.offsetWidth;
  const NEWSQUARES = numberOfSquares(newWidth);
  const amount = Math.abs(NEWSQUARES - SQUARES);
  if (amount !== 0) {
    newWidth > width ? populateSquares(amount) : removeSquares(amount);
  }
  width = newWidth;
  SQUARES = NEWSQUARES;
}

function numberOfSquares(width) {
  // The amount of squares is hardcoded(can be turned into adaptive).
  // 20 = square's Width(16px) + 2*Margin(2px) and 3 lines of squares
  return Math.floor(width / 20) * 3;
}

function removeSquares(amount) {
  for (let i = 0; i < amount; i++) {
    tilesContainer.removeChild(tilesContainer.lastChild);
  }
}

function populateSquares(amount) {
  const squaresFrag = document.createDocumentFragment();

  for (let i = 0; i < amount; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.addEventListener('mouseover', () => setColor(square));
    square.addEventListener('mouseout', () => removeColor(square));

    squaresFrag.appendChild(square);
  }

  tilesContainer.appendChild(squaresFrag);
}

function setColor(element) {
  const color = getRandomProperty(colors);
  element.style.background = color;
  element.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}`;
}

function removeColor(element) {
  element.style.background = 'none';
  element.style.boxShadow = 'none';
}

function getRandomProperty(element) {
  return element[Math.floor(Math.random() * element.length)];
}

function litUpRandomSquare() {
  const allSquares = tilesContainer.childNodes;

  const intervalId = setInterval(() => {
    const randomSquare = getRandomProperty(allSquares);
    setColor(randomSquare);
    setTimeout(() => {
      removeColor(randomSquare);
    }, 2000);
  }, 800);
}

litUpRandomSquare();

// ---end hover board
