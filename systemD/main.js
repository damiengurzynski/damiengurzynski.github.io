//VARIABLES
//screen
let screen = document.getElementById("screen");
let ctx = screen.getContext("2d");
let mouse = {x:0,y:0};
let selectedBody = 0;
let panspeed = 5;
let scalefactor = 1;
let midscreen;

//UI
let simspeed = document.getElementById("simspeed");
let gstrength = document.getElementById("gstrength");

let body_name = document.getElementById("bodyName");
let body_color = document.getElementById("bodyColor");
let body_size = document.getElementById("bodySize");
let body_mass = document.getElementById("bodyMass");
let body_posx = document.getElementById("bodyPosX");
let body_posy = document.getElementById("bodyPosY");
let body_velx = document.getElementById("bodyVelX");
let body_vely = document.getElementById("bodyVelY");

let save_code = document.getElementById('saveCode');

//world
let bodies = [];
let gconst = 10;
let dt = 0.1;

//CLASSES
class Body
{
  constructor(name, color, size, mass, px, py, vx, vy)
  {
    this.name = name;
    this.color = color;
    this.size = size;
    this.mass = mass;
    this.pos = { x: px, y: py };
    this.vel = { x: vx, y: vy };
    this.selected = false;

    bodies.push(this);
  }
}

//FUNCTIONS
//init
function init()
{
	screen.width = window.innerWidth - 200;
	screen.height = window.innerHeight - 20;
  ctx.fillStyle = "white";
  midscreen = {x: screen.width/2, y: screen.height/2};
}

//screen
function draw() {
  ctx.clearRect(0, 0, screen.width, screen.height);
  ctx.save();
  ctx.translate(screen.width / 2, screen.height / 2);
  ctx.scale(scalefactor, scalefactor);
  ctx.translate(-screen.width / 2, -screen.height / 2);

  bodies.forEach((e) =>
  {
    ctx.fillStyle = e.color;
    ctx.beginPath();
    ctx.arc(e.pos.x, e.pos.y, e.size, 0, 2 * Math.PI);
    ctx.fill();
    if (e.selected)
    {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });

  ctx.restore();
}

function mousePos(canvas, e)
{
  let rect = screen.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

//save
function saveSystem()
{
	save_code.value = JSON.stringify(bodies);
}

function loadSystem()
{
	bodies = JSON.parse(save_code.value);
}

//world
function gravitation()
{
  // Initialize force vectors
  let forces = bodies.map(() => ({ x: 0, y: 0 }));

  // Compute gravitational forces between each pair of bodies
  for (let i = 0; i < bodies.length; i++)
  {
    for (let j = i + 1; j < bodies.length; j++)
    {
      let dx = bodies[j].pos.x - bodies[i].pos.x;
      let dy = bodies[j].pos.y - bodies[i].pos.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) continue; // Avoid division by zero

      let force = (gconst * bodies[i].mass * bodies[j].mass) / (distance * distance);

      // Force components
      let forceX = force * (dx / distance);
      let forceY = force * (dy / distance);

      // Apply Newton’s third law: Equal and opposite forces
      forces[i].x += forceX;
      forces[i].y += forceY;
      forces[j].x -= forceX;
      forces[j].y -= forceY;
    }
  }

  // Update velocities and positions
  for (let i = 0; i < bodies.length; i++)
  {
    let body = bodies[i];
    body.vel.x += (forces[i].x / body.mass) * dt;
    body.vel.y += (forces[i].y / body.mass) * dt;
    body.pos.x += body.vel.x * dt;
    body.pos.y += body.vel.y * dt;
  }
}

function newBody()
{
  let b = new Body(
    body_name.value,
    body_color.value,
    Number(body_size.value),
    Number(body_mass.value),
    Number(body_posx.value),
    Number(body_posy.value),
    Number(body_velx.value),
    Number(body_vely.value),
  );
  
  console.log(bodies);
}

function modifyBody()
{
  selectedBody.name = body_name.value;
  selectedBody.color = body_color.value;
  selectedBody.size = Number(body_size.value);
  selectedBody.mass = Number(body_mass.value);
  selectedBody.pos.x = Number(body_posx.value);
  selectedBody.pos.y = Number(body_posy.value);
  selectedBody.vel.x = Number(body_velx.value);
  selectedBody.vel.y = Number(body_vely.value);
}


//EVENT LISTENERS
screen.addEventListener('mousemove', e =>
{
  mouse.x = mousePos(screen, e).x;
  mouse.y = mousePos(screen, e).y;
}, false);

screen.addEventListener('mousedown', e =>
{
  let col = ctx.getImageData(mouse.x, mouse.y, 1, 1).data;
  let [r, g, b] = col;
  let hexcol = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();

  if (selectedBody) selectedBody.selected = false;
  selectedBody = 0;
  body_name.value = '';
  body_color.value = '';
  body_size.value = '';
  body_mass.value = '';
  body_posx.value = '';
  body_posy.value = '';
  body_velx.value = '';
  body_vely.value = '';

	bodies.forEach(e =>
  {
  	if (e.color == hexcol)
    {
    	e.selected = true;
      body_name.value = e.name;
      body_color.value = e.color;
      body_size.value = e.size;
      body_mass.value = e.mass;
      body_posx.value = e.pos.x;
      body_posy.value = e.pos.y;
      body_velx.value = e.vel.x;
      body_vely.value = e.vel.y;
      selectedBody = e;
    }
  });
});

window.addEventListener('keydown', e =>
{
  if (e.key == ' ')
  {
    e.preventDefault();
    if (Number(simspeed.value) < 0 || Number(simspeed.value) > 0) simspeed.value = '0';
    else simspeed.value = '0.1';
  }

  if (e.key == 'ArrowDown')
  {
    e.preventDefault();
    bodies.forEach(e =>
    {
      e.pos.y -= panspeed;
    });
  }

  if (e.key == 'ArrowUp')
  {
    e.preventDefault();
    bodies.forEach(e =>
    {
      e.pos.y += panspeed;
    });
  }

  if (e.key == 'ArrowLeft')
  {
    e.preventDefault();
    bodies.forEach(e =>
    {
      e.pos.x += panspeed;
    });
  }

  if (e.key == 'ArrowRight')
  {
    e.preventDefault();
    bodies.forEach(e =>
    {
      e.pos.x -= panspeed;
    });
  }

  if (e.key == ',')
  {
    bodies.forEach(e =>
    {
      scalefactor += 0.01;
    });
  }

  if (e.key == ';')
  {
    bodies.forEach(e =>
    {
      scalefactor -= 0.01;
    });
  }
});

//RUNTIME
init();

//loop
function loop()
{
  dt = simspeed.value;
  gconst = gstrength.value;
  gravitation();
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

//DEBUG
simspeed.value = '0';

let sun = new Body('sun','#FFD700',200,1000,midscreen.x,midscreen.y,0,0);
let mercury = new Body('mercury','#B0B0B0',0.7,0.000166,(sun.pos.x + sun.size + 8.3),sun.pos.y,0,7);
let venus = new Body('venus','#D4AF37',1.74,0.00245,(sun.pos.x + sun.size + 15.56),sun.pos.y,0,7);
let earth = new Body('earth','#1E90FF',1.83,0.00300,(sun.pos.x + sun.size + 21.51),sun.pos.y,0,7);
let mars = new Body('mars','#FF4500',0.975,0.000323,(sun.pos.x + sun.size + 32.76),sun.pos.y,0,7);
let jupiter = new Body('jupiter','#C85D42',20.10,0.956,(sun.pos.x + sun.size + 112),sun.pos.y,0,6);
let saturn = new Body('saturn','#DAA520',16.74,0.286,(sun.pos.x + sun.size + 206.3),sun.pos.y,0,5);
let uranus = new Body('uranus','#7FDBFF',7.29,0.0437,(sun.pos.x + sun.size + 413.6),sun.pos.y,-1,4);
let neptune = new Body('neptune','#0000FF',7.08,0.0513,(sun.pos.x + sun.size + 646.6),sun.pos.y,-1,3);

//let moon = new Body('moon', 'white', 0.5, 0.000037, earth.pos.x + 3, earth.pos.y, earth.vel.x, earth.vel.y + 0.04);
