//GLOBAL VARIABLES
let player=0;
let dir=0;
let playerview=0;
let time=19;

//OBJECTS
let map=
{
    //variables
    size: 20,

    //functions
    init: function()
    {
        this.map=Array.from(Array(this.size), ()=>new Array(this.size));
        for (let i=0;i<this.size;i++)
            for (let j=0;j<this.size;j++)
                this.map[i][j]=null;
    },

    update: function()
    {
        //clear
        for (let i=0;i<this.size;i++)
        for (let j=0;j<this.size;j++)
            this.map[i][j]=null;

        //fill with world entities
        Object.values(world).forEach(e=>
        {
            e.forEach(f=>
            {
                for (let i=0;i<f.cellsize;i++) this.map[f.pos.y][f.pos.x+i]=f;
            });
        });
    }
}

let world=
{
    //static entities
    islands: [],

    //dynamic entities
    ships: [],
}

let screen=
{
    //variables
    menu: 'main',
    view: 'front',

    //objects
    map:
    {
        size: 20,
    },
    sun:
    {
        daycol:{r:225,g:221,b:143},
        radius: 50,
        x:canvas.width/2,
        y:canvas.height/2+90,
    },
    stars: [],
    sky:
    {
        daycol:[126,189,195],
        nightcol:[14,17,22],
    },
    ocean:
    {
        daycol:[64,89,173],
    },
    boat:
    {
        daycol:[184,125,75],
    },


    //functions
    init: function()
    {
        //canvas
        screen.canvas=document.getElementById('canvas');
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight/2;

        screen.ctx=canvas.getContext('2d');
        screen.ctx.fillStyle='white';
        screen.ctx.strokeStyle='white';
        screen.ctx.imageSmoothingEnabled=false;

        //map
        screen.map.map=Array.from(Array(screen.map.size), ()=>new Array(screen.map.size));

        for (let i=0;i<screen.map.size;i++)
            for (let j=0;j<screen.map.size;j++)
            screen.map.map[i][j]=null;

        //stars
        let sky=[];
        for (let i=0; i<=3; i++)
        {
            for (let j=0; j<canvas.height/10; j++)
            {
                let x=rand(1,canvas.width);
                let y=rand(1,canvas.height/2);
                sky.push([x,y]);
            }
            screen.stars.push(sky);
            sky=[];
        }
    },

    draw: ()=>
    {
        //variables
        let p=world.ships[player];
        let apex=6;

        //clear canvas
        screen.ctx.clearRect(0,0,screen.canvas.width,screen.canvas.height);

        //draw sky
        screen.ctx.fillStyle='#7EBDC3';
        screen.ctx.fillRect(0,0,canvas.width,canvas.height/2);

        //draw sun
        screen.ctx.fillStyle='#E1DD8F';
        if (time>=6 && time<13 && ((p.dir=='e'&&screen.view=='front') || (p.dir=='n'&&screen.view=='right') || (p.dir=='s'&&screen.view=='left') || (p.dir=='w'&&screen.view=='back')))
        {
            screen.ctx.beginPath();
            screen.ctx.arc(screen.sun.x, screen.sun.y, screen.sun.radius, 0, 2*Math.PI);
            screen.ctx.fill();
            screen.sun.y-=2;
        }   
        if (time>=13 && time<19 && (p.dir=='w' || (p.dir=='n'&&screen.view=='left') || (p.dir=='s'&&screen.view=='right') || (p.dir=='e'&&screen.view=='back')))
        {
            screen.ctx.beginPath();
            screen.ctx.arc(screen.sun.x, screen.sun.y, screen.sun.radius, 0, 2*Math.PI);
            screen.ctx.fill();
            screen.sun.y+=2;
        }

        //draw ocean
        screen.ctx.fillStyle='#4059AD';
        screen.ctx.fillRect(0,canvas.height/2,canvas.width,canvas.height/2);

        //draw stars
        if ((time>=19 && time <=25) || (time>=0 && time<6))
        {
                //draw sky
                if (time>=19 && time<20)
                {
                    screen.sky.daycol[0]-=5;
                    screen.sky.daycol[1]-=8;
                    screen.sky.daycol[2]-=8;
                    screen.ctx.fillStyle=`rgba(${screen.sky.daycol[0]},${screen.sky.daycol[1]},${screen.sky.daycol[2]},1)`;
                }
                else
                {
                    screen.ctx.fillStyle=`rgba(${screen.sky.nightcol[0]},${screen.sky.nightcol[1]},${screen.sky.nightcol[2]},1)`
                }
                screen.ctx.fillRect(0,0,canvas.width,canvas.height/2);

                //draw ocean
                screen.ctx.fillStyle='#101419';
                screen.ctx.fillRect(0,canvas.height/2,canvas.width,canvas.height/2);

                //slow shine
                if (time>=19 && time<20)
                {
                    let o=-(19-time);
                    screen.ctx.fillStyle=`rgba(255,255,255,${o})`;
                }
                //slow dim
                else if (time>=5 && time<=6)
                {
                    let o=6-time;
                    screen.ctx.fillStyle=`rgba(255,255,255,${o})`;
                }
                else screen.ctx.fillStyle='white';

                if (p.dir=='n' || (p.dir=='w'&&screen.view=='right') || (p.dir=='e'&&screen.view=='left') || (p.dir=='s'&&screen.view=='back'))
                {
                    screen.stars[0].forEach(e=>
                    {
                        screen.ctx.fillRect(e[0],e[1],1,1);
                    });
                }

                if (p.dir=='s' || (p.dir=='w'&&screen.view=='left') || (p.dir=='e'&&screen.view=='right') || (p.dir=='s'&&screen.view=='back'))
                {
                    screen.stars[1].forEach(e=>
                    {
                        screen.ctx.fillRect(e[0],e[1],1,1);
                    });
                }

                if (p.dir=='e' || (p.dir=='n'&&screen.view=='right') || (p.dir=='s'&&screen.view=='left') || (p.dir=='w'&&screen.view=='back'))
                {
                    screen.stars[2].forEach(e=>
                    {
                        screen.ctx.fillRect(e[0],e[1],1,1);
                    });
                }
                
                if (p.dir=='w' || (p.dir=='n'&&screen.view=='left') || (p.dir=='s'&&screen.view=='right') || (p.dir=='e'&&screen.view=='back'))
                {
                    screen.stars[3].forEach(e=>
                    {
                        screen.ctx.fillRect(e[0],e[1],1,1);
                    });
                }
            }

        //draw ship
        if ((time>=19 && time <=25) || (time>=0 && time<6)) screen.ctx.fillStyle='#0E1116';
        else screen.ctx.fillStyle='#B87D4B';
        //front
        if (screen.view=='front')
        {
            screen.ctx.beginPath();
            screen.ctx.moveTo(canvas.width/3,canvas.height);
            screen.ctx.lineTo(canvas.width/2,canvas.height/1.2);
            screen.ctx.lineTo(canvas.width-canvas.width/3,canvas.height);
            screen.ctx.fill();
        }
        //back
        if (screen.view=='back')
        {
            screen.ctx.beginPath();
            screen.ctx.moveTo(canvas.width/4,canvas.height);
            screen.ctx.lineTo(canvas.width/3,canvas.height/1.2);
            screen.ctx.lineTo(canvas.width/1.5,canvas.height/1.2);
            screen.ctx.lineTo(canvas.width-canvas.width/4,canvas.height);
            screen.ctx.fill();
        }
        //sides
        if (screen.view=='left' || screen.view=='right')
        {
            screen.ctx.fillRect(0,canvas.height/1.2,canvas.width,canvas.height-canvas.height/1.2);
        }

        //draw entities
        Object.values(world).forEach(e=>
        {
            screen.ctx.fillStyle='white';
            e.forEach(f=>
            {
                if (f.name!=p.name)
                {
                    //GLOBAL VARIABLES
                    //distance x from player to entity
                    let dx=Math.abs(f.pos.x-p.pos.x);
                    //distance y from player to entity
                    let dy=Math.abs(f.pos.y-p.pos.y);
                    //distance from player to entity
                    let d=Math.abs(Math.round(Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2))));

                    //screen splits
                    let nbSplits;
                    let splitSize;

                    //size of entity
                    let eSize={x:Math.round(f.size.x/d), y:Math.round(f.size.y/d)};

                    //position of entity
                    let ePosX=null;
                    let ePosY=null;

                    //fov limits
                    let fovMinY=p.pos.y-dx;
                    let fovMaxY=p.pos.y+dx;
                    let fovMinX=p.pos.x-dy;
                    let fovMaxX=p.pos.x+dy;

                    //PLAYER FACING NORTH
                    if (p.dir=='n')
                    {
                        //entity is in front of player
                        if (screen.view=='front')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y<p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=f.pos.x-fovMinX;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is behind player and back view
                        if (screen.view=='back')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y>p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=fovMaxX-f.pos.x;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is left of player and left view
                        if (screen.view=='left')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x<p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=fovMaxY-f.pos.y;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is right of player and right view
                        if (screen.view=='right')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x>p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=f.pos.y-fovMinY;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }
                    }

                    //PLAYER FACING SOUTH
                    if (p.dir=='s')
                    {
                        //entity is in front of player
                        if (screen.view=='front')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y>p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=fovMaxX-f.pos.x;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is behind player and back view
                        if (screen.view=='back')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y<p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=f.pos.x-fovMinX;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is left of player and left view
                        if (screen.view=='left')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x>p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=f.pos.y-fovMinY;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is right of player and right view
                        if (screen.view=='right')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x<p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=fovMaxY-f.pos.y;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }
                    }
                    
                    //PLAYER FACING EAST
                    if (p.dir=='e')
                    {
                        //entity is in front of player
                        if (screen.view=='front')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x>p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=f.pos.y-fovMinY;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is behind player and back view
                        if (screen.view=='back')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x<p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity is flipped
                                ePosX=fovMaxY-f.pos.y;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is left of player and left view
                        if (screen.view=='left')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y<p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=f.pos.x-fovMinX;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is right of player and right view
                        if (screen.view=='right')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y>p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity is flipped
                                ePosX=fovMaxX-f.pos.x;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }
                    }

                    //PLAYER FACING WEST
                    if (p.dir=='w')
                    {
                        //entity is in front of player
                        if (screen.view=='front')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x<p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity
                                ePosX=fovMaxY-f.pos.y;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is behind player and back view
                        if (screen.view=='back')
                        {
                            nbSplits=dx*2;
                            if (f.pos.x<p.pos.x && f.pos.y>=fovMinY && f.pos.y<=fovMaxY)
                            {
                                //position of entity is flipped
                                ePosX=f.pos.y-fovMinY;

                                //entity side facing player
                                if (f.dir=='n') {};
                                if (f.dir=='s') {};
                                if (f.dir=='e') eSize.x/=2;
                                if (f.dir=='w') eSize.x/=2;
                            }
                        }

                        //entity is left of player and left view
                        if (screen.view=='left')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y>p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=fovMaxX-f.pos.x;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }

                        //entity is right of player and right view
                        if (screen.view=='right')
                        {
                            nbSplits=dy*2;
                            if (f.pos.y<p.pos.y && f.pos.x>=fovMinX && f.pos.x<=fovMaxX)
                            {
                                //position of entity
                                ePosX=f.pos.x-fovMinX;

                                //entity side facing player
                                if (f.dir=='n') eSize.x/=2;
                                if (f.dir=='s') eSize.x/=2;
                                if (f.dir=='e') {};
                                if (f.dir=='w') {};
                            }
                        }
                    }

                    //earth curvature
                    if (d>apex)
                    {
                        eSize.y-=d-apex;
                        ePosY=Math.round(screen.canvas.height/2-eSize.y);
                    }
                    else
                    {
                        ePosY=Math.round(screen.canvas.height/2-eSize.y)+(eSize.y/4);
                    }

                    //draw entity
                    if (ePosX!=null && eSize.y>0)
                    {
                        splitSize=screen.canvas.width/nbSplits;
                        screen.ctx.fillRect(ePosX*splitSize-(eSize.x/2),ePosY,eSize.x,eSize.y);
                    }

                }
            });
        });

        //update compass
        let c=document.getElementById('compass');
        if (p.dir=='n') c.innerHTML='N<br>W &#11032 E<br>S';
        if (p.dir=='s') c.innerHTML='S<br>E &#11033 W<br>N';
        if (p.dir=='w') c.innerHTML='W<br>S &#11031 N<br>E';
        if (p.dir=='e') c.innerHTML='E<br>N &#11030 S<br>W';
    }
}

//CLASSES
class Island
{
    constructor(name,pos,dir)
    {
        this.name=name;
        this.pos=pos;
        this.size={x:60, y:60};
        this.cellsize=1;
        this.dir=dir;

        world.islands.push(this);
    }
}

class Ship
{
    constructor(name,pos,dir)
    {
        this.name=name;
        this.pos=pos;
        this.size={x:20, y:20};
        this.cellsize=1;
        this.dir=dir;

        world.ships.push(this);
    } 
}

//FUNCTIONS
function rand(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//KEYBOARD INPUT
document.addEventListener('keydown',e=>
{
    let p=world.ships[player];
    let rdir=['n','e','s','w'];
    let rview=['front','right','back','left'];
    
    if (time<24) time+=0.05;
    else time=0;

    if (screen.menu='main')
    {
        //change view
        if (e.key==' ')
        {
            if (playerview<rview.length-1) playerview++;
            else playerview=0;
            screen.view=rview[playerview];
        }

        //ship linear movement
        if (e.key=='ArrowLeft')
        {
            if (dir>0) dir--;
            else dir=rdir.length-1;
            p.dir=rdir[dir];
        }
        if (e.key=='ArrowRight')
        {
            if (dir<rdir.length-1) dir++;
            else dir=0;
            p.dir=rdir[dir];
        }
        if (e.key=='ArrowUp')
        {
            if (p.dir=='n' && p.pos.y>0 && map.map[p.pos.y-1][p.pos.x]==null)
                p.pos.y--;
            if (p.dir=='s' && p.pos.y<map.size-1 && map.map[p.pos.y+1][p.pos.x]==null)
                p.pos.y++;
            if (p.dir=='e' && p.pos.x<map.size-1 && map.map[p.pos.y][p.pos.x+1]==null)
                p.pos.x++;
            if (p.dir=='w' && p.pos.x>0 && map.map[p.pos.y][p.pos.x-1]==null)
                p.pos.x--;
        }
        if (e.key=='ArrowDown')
        {
            if (p.dir=='n' && p.pos.y<map.size-1 && map.map[p.pos.y+1][p.pos.x]==null)
                p.pos.y++;
            if (p.dir=='s' && p.pos.y>0 && map.map[p.pos.y-1][p.pos.x]==null)
                p.pos.y--;
            if (p.dir=='e' && p.pos.x>0 && map.map[p.pos.y][p.pos.x-1]==null)
                p.pos.x--;
            if (p.dir=='w' && p.pos.x<map.size-1 && map.map[p.pos.y][p.pos.x+1]==null)
                p.pos.x++;
        }
    }

    //update
    map.update();
    screen.draw();
})

//RUNTIME
screen.init();
map.init();

new Ship('Plack Bearl', {x:5,y:5}, 'n');
new Island('Turtoga', {x:5,y:3}, 'n');

//new Ship('Bollocks', {x:3,y:0}, 's');
//new Island('Skull', {x:2,y:2}), 'n';

screen.draw();
map.update();