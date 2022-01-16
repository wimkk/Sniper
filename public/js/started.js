themeselect=document.getElementById("theme-select")
if(getCookie('theme')){
    var theme = getCookie('theme');
    themeselect.value=theme
}else{
    theme='Default'
    createCookie('theme', ['Default']);
}
settheme(theme)
themeselect.onchange=function() { 
    theme=this.value
    settheme(this.value)
} 

function settheme(stheme){
    createCookie('theme', [stheme])
    var link = document.createElement( "link" );
    link.href = '/css/'+stheme+'/started.css'
    link.type = "text/css";
    link.rel = "stylesheet";
    
    document.getElementsByTagName( "html" )[0].appendChild( link );
    
    console.log(stheme)
}

var url = new URL(window.location.href)
var key = url.searchParams.get("key")
CheckKey(key).then(res => {
    if (res) {

        createCookie('key', JSON.stringify([
            {
                key: key,
            },
        ]));
        StartSniper()
    } else {
        window.location.replace("/")
    }
})
    

if (getCookie('snipes')) {  //Set Snipes
    var snipescookie = getCookie('snipes');
    var snipes = JSON.parse(snipescookie);
} else {
    var snipes = {
        'Arosity':{
            uuid:'9c13cae91f344386a5a857dace6d765d'
        },
        'Wimk':{
            uuid: "8c1a7e32c5a342a29a103ff338a853f3",
        }
    }
    createCookie('snipes', JSON.stringify(snipes));
}

const table = document.getElementById("usertable");
const userinput = document.getElementById('userinput')
userinput.addEventListener('keyup', UserInputFunction);
soundenabled=false

cred = '#f77777'
cyellow = '#e0f593'
cgreen = '#8dd99d'


cleannames = {}
var chr = new XMLHttpRequest();
chr.onreadystatechange = (e) => {
    if (chr.readyState === 4) {
        cleannames = JSON.parse(chr.responseText);
    }
}; chr.open("GET", "/json/clean.json"); chr.send();

for (var ign in snipes) {
    var row = table.insertRow(-1);
    row.id=ign
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.outerHTML = "<th class='closeMan'> <button onclick=removerow(this) id='closebutton'> X </button></th>"
    cell2.innerHTML = ign;
    cell2.classList.add('ign')
    cell2.id='nothing'

    cell3.innerHTML = "---";
    cell3.classList.add('game')
    cell3.id='nothing'

    cell4.innerHTML = "---";
    cell4.classList.add('mode')
    cell4.id='nothing'

    cell5.innerHTML = "---";
    cell5.classList.add('map')
    cell5.id='nothing'

}

async function StartSniper(key) {
    while (Object.keys(snipes).length > 0) {
        for (var ign in snipes) {
            console.log(ign)
            await getUSER(ign).then(res => {
                session = res["session"]
                game = '---'
                mode = '---'
                map = '---'
                if (session['online'] == false) {
                    color = 'offline'
                    return
                }
                color = 'lobby'

                sgametype = session['gameType']
                smode = session['mode']
                smap = session['map']
                console.log(sgametype)
                console.log(smode)
                console.log(smap)
                game = cleannames[sgametype]['clean']
                if (smode == 'LOBBY') {
                    color = 'lobby'
                    mode = 'Lobby'
                    return
                }

                mode = cleannames[sgametype]['modes'][smode]['clean']
                if (!cleannames[sgametype]['modes'][smode]['nomap']) {
                    map = smap
                }

                color = 'online'
            })
            editrow(ign, game, mode, map, color)
            await sleep(505)
        }
    }
}

function addrow(values) {

    snipes[values['name']]={}
    snipes[values['name']].uuid=values['uuid']
    console.log(snipes)
    if (Object.keys(snipes).length == 1) {
        StartSniper(key)
    }
    var json_str = JSON.stringify(snipes);
    createCookie('snipes', json_str);

    var row = table.insertRow(0);
    row.id=values['name']
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.outerHTML = "<th> <button onclick=removerow(this) id='closebutton'> X </button></th>"
    cell2.innerHTML = values['name'];
    cell2.classList.add('ign')
    cell2.id='nothing'

    cell3.innerHTML = "---";
    cell3.classList.add('game')
    cell3.id='nothing'

    cell4.innerHTML = "---";
    cell4.classList.add('mode')
    cell4.id='nothing'

    cell5.innerHTML = "---";
    cell5.classList.add('map')
    cell5.id='nothing'
    if(soundenabled){
        new Audio('/sounds/'+theme+'/add.mp3').play();
    }
    
}

function removerow(value) {
    var num = value.parentNode.parentNode.rowIndex - 1
    table.deleteRow(num);
    delete snipes[value.parentNode.parentNode.id]
    createCookie('snipes', JSON.stringify(snipes));
    if(soundenabled){
        new Audio('/sounds/'+theme+'/remove.mp3').play();
    }
}

async function editrow(ign, sgame, smode, smap, scolor) {
    
    if (document.getElementById(ign)) {
        
        
        row=document.getElementById(ign)
        ign = row.getElementsByClassName('ign')[0]
        game = row.getElementsByClassName('game')[0]
        mode = row.getElementsByClassName('mode')[0]
        map = row.getElementsByClassName('map')[0]

        play = true
        if (map.id == "nothing") {
            play = false
        }else{
            paststatus=map.id
        }

        
        if (game.innerHTML.toString() != sgame.toString()) {
            change = true
        } else if (mode.innerHTML.toString() != smode.toString()) {
            change = true
        } else if (map.id != scolor.toString()) {
            change = true
        }else{
            change = false
        }

        if (change == true) {
            game.innerHTML = sgame
            mode.innerHTML = smode
            map.innerHTML = smap

            game.id=scolor
            mode.id=scolor
            map.id=scolor
            ign.id=scolor

            if (play) {
                if(soundenabled){
                    if(paststatus=="online"){
                        scolor
                    }
                    new Audio('/sounds/'+theme+'/add.mp3').play();
                }
            }
            change = false
        }
    }
}

async function UserInputFunction(e) {
    if (e.keyCode === 13) {
        user = e.target.value
        if(user.length>=3){
            await getUUID(user).then(res => {
                if (res) {
                    if(!snipes.hasOwnProperty(res['username'])){
                        addrow({
                            name: res['username'],
                            uuid: res['uuid'],
                        })
                        e.target.value = ""
                    }else{
                        console.log(res['username']+" already exists")
                    }
                } else {
                    console.log(user + " was not found")
                }
            })
        }else{
            console.log("That username is to short")
        }
        
    }
}

async function getUSER(num) {
    uuid = snipes[num]["uuid"]

    var xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState === 4) {
                a = JSON.parse(xhr.responseText);
                resolve(a)
            }
        };
        xhr.open("POST", "https://api.hypixel.net/status?key=" + key + "&uuid=" + uuid);
        xhr.send();
    });
}

async function getUUID(user) {
    var xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState === 4) {
                if (xhr.status != 404) {
                    a = JSON.parse(xhr.responseText);
                    resolve(a)
                } else {
                    resolve(false)
                }

            }
        };
        xhr.open("POST", "https://api.ashcon.app/mojang/v2/user/" + user);
        xhr.send();
    });
}

function CheckKey(e) {
    var xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState === 4) {
                a = JSON.parse(xhr.responseText);
                if (a.success) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        };
        xhr.open("POST", "https://api.hypixel.net/key?key=" + e);
        xhr.send();
    });
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function componentFromStr(numStr, percent) {
    var num = Math.max(0, parseInt(numStr, 10));
    return percent ?
        Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
}

function r2h(rgb) {
    var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
    var result, r, g, b, hex = "";
    if ((result = rgbRegex.exec(rgb))) {
        r = componentFromStr(result[1], result[2]);
        g = componentFromStr(result[3], result[4]);
        b = componentFromStr(result[5], result[6]);

        hex = '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return hex;
}

const soundbox=document.getElementById("soundbox")

soundbox.addEventListener('change', (event) => {
  soundenabled=event.currentTarget.checked
})