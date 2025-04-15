// VARIABLES
let draw = document.getElementById('draw');
let mouse = { x: 0, y: 0, drag: false, target: null, lastX: 0, lastY: 0, shakeCount: 0 };
let deck = [];
let suits = ['♣︎', '♠', '♥', '♦'];
let highestZIndex = 0;
let selbox = { div: null, active: false, x: 0, y: 0 };
let shuffling = false;

// CLASSES
class Card {
  constructor(value) {
    this.value = value;
    this.selected = false;
    this.pos = { x: 0, y: 0 };
    this.offsetX = 0;
    this.offsetY = 0;
    this.div = this.createCardElement();
    
    deck.push(this);
    this.setPosition(50, 50);
  }

  createCardElement() {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = this.value;
    Object.assign(div.style, {
      position: 'absolute',
      zIndex: 0,
      color: 'black',
    });

    div.addEventListener('mousedown', (e) => this.onMouseDown(e));
    div.addEventListener('contextmenu', (e) => this.onRightClick(e));
    
    return div;
  }

  onMouseDown(e) {
    e.preventDefault();
    mouse.drag = true;
    mouse.target = this;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    this.div.style.zIndex = ++highestZIndex;

    if (this.selected) {
      deck.forEach(card => {
        if (card.selected) {
          card.offsetX = card.pos.x - mouse.x;
          card.offsetY = card.pos.y - mouse.y;
        }
      });
    } else {
      this.offsetX = this.pos.x - mouse.x;
      this.offsetY = this.pos.y - mouse.y;
    }
  }

  onRightClick(e) {
    e.preventDefault();
    this.div.style.color = this.div.style.color === 'black' ? 'white' : 'black';
  }

  setPosition(x, y) {
    this.pos.x = x;
    this.pos.y = y;
    Object.assign(this.div.style, {
      left: `${x}px`,
      top: `${y}px`
    });
  }
}

// FUNCTIONS
function rand(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function shuffleSelectedCards() {
  const selectedCards = deck.filter(card => card.selected);
  if (selectedCards.length > 0) {
  	shuffling = true;
    selectedCards.forEach((card, index) => {
      card.setPosition(mouse.x, mouse.y);
      card.div.style.zIndex = highestZIndex - rand(0,selectedCards.length);
      card.div.style.color = 'black';
    });
  }
}

function init() {
  let saveddeck = JSON.parse(localStorage.getItem('deck'));

  if (saveddeck != null) {
    deck = saveddeck.map(cardData => {
      let card = new Card(cardData.value);
      card.setPosition(cardData.pos.x, cardData.pos.y);
      return card;
    });
  }

  deck.forEach(e => {
    draw.appendChild(e.div);
  });
}

// EVENT LISTENERS
document.addEventListener('mousedown', (e) => {
  e.preventDefault();
  if (!mouse.target) {
    deck.forEach(card => {
      card.selected = false;
      card.div.style.border = '1px solid white';
    });
    selbox.div = Object.assign(document.createElement('div'), { className: 'selectionbox' });
    selbox.active = true;
    selbox.x = e.clientX;
    selbox.y = e.clientY;
    Object.assign(selbox.div.style, {
      left: `${selbox.x}px`,
      top: `${selbox.y}px`
    });
    document.body.appendChild(selbox.div);
  }
});

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  
  if (mouse.drag && mouse.target) {
    if (mouse.target.selected) {
      deck.forEach(card => {
        if (card.selected) {
        	if (shuffling) card.setPosition(mouse.x + mouse.target.offsetX, mouse.y + mouse.target.offsetY);
          else card.setPosition(mouse.x + card.offsetX, mouse.y + card.offsetY);
        }
      });
    }
    else {
      mouse.target.setPosition(mouse.x + mouse.target.offsetX, mouse.y + mouse.target.offsetY);
    }
  }

  if (selbox.active) {
    const rect = {
      x: Math.min(mouse.x, selbox.x),
      y: Math.min(mouse.y, selbox.y),
      w: Math.abs(mouse.x - selbox.x),
      h: Math.abs(mouse.y - selbox.y)
    };

    Object.assign(selbox.div.style, {
      left: `${rect.x}px`,
      top: `${rect.y}px`,
      width: `${rect.w}px`,
      height: `${rect.h}px`
    });

    deck.forEach(card => {
      const { x, y } = card.pos;
      const inside = x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
      card.selected = inside;
      card.div.style.border = `1px solid ${inside ? 'orange' : 'white'}`;
    });
  }

  // Detect mouse shake
  if (Math.abs(mouse.x - mouse.lastX) > 20 || Math.abs(mouse.y - mouse.lastY) > 20) {
    mouse.shakeCount++;
    if (mouse.shakeCount >= 5 && mouse.drag) {
      shuffleSelectedCards();
      mouse.shakeCount = 0;
    }
  } else {
    mouse.shakeCount = 0;
  }
  mouse.lastX = mouse.x;
  mouse.lastY = mouse.y;
});

document.addEventListener('mouseup', () => {
	shuffling = false;
  mouse.drag = false;
  mouse.target = null;
  if (selbox.active) {
    selbox.active = false;
    selbox.div.remove();
  }
});

// RUNTIME
[...Array(10)].forEach((_, i) => suits.forEach(suit => new Card(`${i + 1} ${suit}`)));
['J', 'Q', 'K'].forEach(rank => suits.forEach(suit => new Card(`${rank} ${suit}`)));
['JKR', 'JKR'].forEach(joker => new Card(joker));

init();

setInterval(() => {
  localStorage.removeItem('deck');
  localStorage.setItem('deck', JSON.stringify(deck));
  console.log('Session Saved');
}, 10000);
