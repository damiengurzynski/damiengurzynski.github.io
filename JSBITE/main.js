//GLOBAL VARIABLES
let bites=[];

//CLASSES
class Bite
{
    constructor(title,desc,code,tags)
    {
        this.title=title;
        this.desc=desc;
        this.code=code;
        this.id=bites.length.toString();
        this.tags=tags.split(/\s+/);

        bites.push(this);
    }

    add()
    {
        //create elements
        //bites
        let bites=document.getElementById('bites');

        //bite
        let bite=document.createElement('div');
        bite.className='bite';
        bite.id=this.id;
        
        //head separator
        let bsep=document.createElement('hr');

        //title
        let btitle=document.createElement('p');
        btitle.id='title';
        btitle.innerHTML=this.title;

        //description
        let bdesc=document.createElement('p');
        bdesc.style.fontStyle='italic';
        bdesc.innerHTML=this.desc;
        
        //preview
        let bipreviewwrap=document.createElement('div');
        let bpreview=document.createElement('iframe');
        bpreview.scrolling='no';
        
        //code
        let bcode=document.createElement('textarea');
        bcode.value=this.code;
        bcode.spellcheck=false;
        
        //update bite
        bcode.addEventListener('keyup',e=>
        {
            console.clear();
            bpreview.contentWindow.document.open();
            bpreview.contentWindow.document.write('<style>body {text-align:center;background-color:black;color:rgb(118, 118, 118);font-family:monospace;} body:hover{color:rgb(200, 200, 200)}</style>');
            bpreview.contentWindow.document.write('<p></p>');
            bpreview.contentWindow.document.write('<script>function code(){'+bcode.value+'};code()</script>');
            bpreview.contentWindow.document.close();
        });
        
        //load elements in document
        bite.appendChild(bsep);
        bite.appendChild(btitle);
        bite.appendChild(bdesc);
        bite.appendChild(bcode);
        bite.appendChild(bipreviewwrap);
        bipreviewwrap.appendChild(bpreview);
        bites.appendChild(bite);
        
        //onload write
        bpreview.contentWindow.document.open();
        bpreview.contentWindow.document.write('<style>body {text-align:center;background-color:black;color:rgb(118, 118, 118);font-family:monospace;} body:hover{color:rgb(200, 200, 200)}</style>');
        bpreview.contentWindow.document.write('<p></p>');
        bpreview.contentWindow.document.write('<script>function code(){'+bcode.value+'};code()</script>');
        bpreview.contentWindow.document.close();
    }
}

//FUNCTIONS
function locateBite()
{
    let search=document.getElementById('searchbar').value.split(/\s+/);
    if (search!='')
    {
        let score=0;
        let hits=[];
        bites.forEach(e=>
        {
            e.tags.forEach(f=>
            {
                search.forEach(g=>
                {
                    if (f==g) score++;
                });
            });
            hits.push({bid: e.id, bscore: score});
            score=0;
        });

        let hit={bid: '', bscore: 0};
        hits.forEach(e=>
        {
            if (e.bscore>hit.bscore)
            {
                hit.bid=e.bid;
                hit.bscore=e.bscore;
            }
        });

        if (hit.bid!='') location.href=`#${hit.bid}`;
    }
}

//EVENT LISTENERS
document.getElementById('searchbar').addEventListener('keypress',e=>
{
    if (e.key=='Enter') locateBite();
});


//RUNTIME
let c0=`let mapsize={x: 3,y: 5};
let map=Array.from(Array(mapsize.y), ()=>new Array(mapsize.x));

for (let i=0; i<mapsize.y; i++)
{
    for (let j=0; j<mapsize.x; j++)
    {
        document.body.innerHTML+=' x ';
    }
    document.body.innerHTML+='<br>';
}
`;

let c1=`document.body.innerHTML='lol';`;

let b0=new Bite('2D ARRAY','Simple one liner to create a 2D array.',c0,'2d array map');
b0.add();

let b1=new Bite('LOL','All about the lol.',c1,'map lol');
b1.add();

let b2=new Bite('MDR','All about the mdr.',c1,'mdr');
b2.add();