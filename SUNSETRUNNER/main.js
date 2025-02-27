var gameArea = document.getElementById("gameArea");
var ctx = gameArea.getContext("2d");

var jumper = [30, 100, 20, 20, true, "red", 0];
var ground = [0, 120, 320, 30];
var obst = [310, 110, 10, 10];
var obst1 = [390, 100, 10, 20];
var sun = [135, 110, 50, 50];
var sunCol = [0, 0, 200];
var night = false;
var score = 0;
var speed = 4;

document.getElementById("bestScore").innerHTML = "Best Score : " + sessionStorage.getItem("bestScore");

ctx.fillStyle = "rgb(255,255,0,0.7)";
ctx.fillRect(sun[0], sun[1], sun[2], sun[3]);

ctx.fillStyle = "rgb(43,90,165)";
ctx.fillRect(ground[0], ground[1], ground[2], ground[3]);

function mainLoop()
{
    document.addEventListener("keydown", e =>
    {
        if (e.key == "ArrowUp" && jumper[4] == false)
        {
            jumper[6] -= 16;
            jumper[4] = true;
        }
    });

    jumper[6] += 1.5;
    jumper[1] += jumper[6];
    jumper[6] *= 0.9;

    obst[0] -= speed;
    obst1[0] -= speed;

    score++;
    document.getElementById("score").innerText = score;

    sunCourse();
    
    console.log(sunCol);
    if (jumper[1] > 100)
    {
        jumper[4] = false;
        jumper[1] = 100;
        jumper[6] = 0;
    }
    
    if (obst[0] < 0)
    {
        obst[0] = 310;
    }
    
    if (obst1[0] < 0)
    {
        obst1[0] = 390;
    }
    
    if ((jumper[0] - 10) < obst[0] && obst[0] < (jumper[0] + 15) && jumper[4] == false)
    {
        location.reload();
        if (score > sessionStorage.getItem("bestScore"))
        {
            sessionStorage.setItem("bestScore", score);
        }
    }
    
    if ((jumper[0] - 10) < obst1[0] && obst1[0] < (jumper[0] + 15) && jumper[4] == false)
    {
        location.reload();
        if (score > sessionStorage.getItem("bestScore"))
        {
            sessionStorage.setItem("bestScore", score);
        }
    }
    
    document.getElementById("gameArea").style.backgroundColor = "rgb(" + sunCol.join() + ")"; 
    
    ctx.clearRect(0, 0, 320, 120);
    
    ctx.fillStyle = "rgb(255,255,0,0.7)";
    ctx.fillRect(sun[0], sun[1], sun[2], sun[3]);
    
    ctx.fillStyle = "rgb(43,90,165)";
    ctx.fillRect(ground[0], ground[1], ground[2], ground[3]);

    ctx.fillStyle = "rgb(214,77,77)";
    ctx.fillRect(jumper[0], jumper[1], jumper[2], jumper[3]);

    ctx.fillStyle = "white";
    ctx.fillRect(obst[0], obst[1], obst[2], obst[3]);

    ctx.fillStyle = "white";
    ctx.fillRect(obst1[0], obst1[1], obst1[2], obst1[3]);


    window.requestAnimationFrame(mainLoop);
}


document.addEventListener("keydown", e =>
{
    if (e.key == "Enter")
    {
        window.requestAnimationFrame(mainLoop);
    }
});

function sunCourse()
{
    sun[1] -= 0.1;

    if (sunCol[0] > 180)
    {
        sunCol[0] = 180;
    }
    if (sunCol[2] < 0)
    {
        sunCol[2] = 0;
    }
    if (sunCol[2] > 200)
    {
        sunCol[2] = 200;
    }
    if (sunCol[0] < 0)
    {
        sunCol[0] = 0;
    }

    
    if (sun[1] < -100)
    {
        night = true;
        sun[1] = 400;
    }
    if (night == true && sun[1] < 150)
    {
        night = false;
        speed += 2;
    }
    if (night == true)
    {
        sunCol[0] -= 0.1;
        sunCol[2] += 0.1;
    }
    else
    {
        sunCol[0] += 0.1;
        sunCol[2] -= 0.1;
    }

    console.log(night);
        
}

function startGame()
{
    window.requestAnimationFrame(mainLoop);
}