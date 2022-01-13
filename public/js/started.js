var url = new URL(window.location.href)
var key = url.searchParams.get("key")
if (key != null) {  //Check Key
    CheckKey(key).then(res => {
        if (res) {
            StartSniper()
        } else {
            window.location.replace("/")
        }
    })
}

if (document.cookie) {  //Set Snipes
    var snipescookie = getCookie('snipes');
    var snipes = JSON.parse(snipescookie);
} else {
    var snipes = [
        {
            name: 'Arosity',
            uuid: "9c13cae91f344386a5a857dace6d765d",
        },
        {
            name: 'Wimk',
            uuid: "8c1a7e32c5a342a29a103ff338a853f3",
        }
    ]
    var json_str = JSON.stringify(snipes);
    createCookie('snipes', json_str);
}


cleannames = {}
var chr = new XMLHttpRequest();
chr.onreadystatechange = (e) => {       //Get Modes
    if (chr.readyState === 4) {
        cleannames = JSON.parse(chr.responseText);

    }
}; chr.open("GET", "/json/clean.json"); chr.send();

const table = document.getElementById("usertable");
const userinput = document.getElementById('userinput')
userinput.addEventListener('keyup', UserInputFunction);

cred = '#f77777'
cyellow = '#e0f593'
cgreen = '#8dd99d'

for (var num in snipes) {           //Create Table
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.outerHTML = "<th class='closeMan'> <button onclick=removerow(this) id='closebutton'> X </button></th>"
    cell2.innerHTML = snipes[num]['name'];
    cell2.classList.add('ign')
    cell3.innerHTML = "---";
    cell3.classList.add('game')
    cell4.innerHTML = "---";
    cell4.classList.add('mode')
    cell5.innerHTML = "---";
    cell5.classList.add('map')
}

async function StartSniper(key) {
    while (snipes.length > 0) {
        for (var num in snipes) {
            await getUSER(num).then(res => {
                session = res["session"]
                game = '---'
                mode = '---'
                map = '---'
                if (session['online'] == false) {
                    color = cred
                    return
                }
                color = cyellow

                sgametype = session['gameType']
                smode = session['mode']
                smap = session['map']

                game = cleannames[sgametype]['clean']
                if (smode == 'LOBBY') {
                    color = cyellow
                    mode = 'Lobby'
                    return
                }

                mode = cleannames[sgametype]['modes'][smode]['clean']
                if (!cleannames[sgametype]['modes'][smode]['nomap']) {
                    map = smap
                }

                color = cgreen
            })
            editrow(num, game, mode, map, color)
            await sleep(505)
        }
    }
}

function addrow(values) {

    snipes.unshift(values)
    if (snipes.length == 1) {
        StartSniper(key)
    }
    var json_str = JSON.stringify(snipes);
    createCookie('snipes', json_str);

    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.outerHTML = "<th> <button onclick=removerow(this) id='closebutton'> X </button></th>"
    cell2.innerHTML = values['name'];
    cell2.classList.add('ign')

    cell3.innerHTML = "---";
    cell3.classList.add('game')

    cell4.innerHTML = "---";
    cell4.classList.add('mode')

    cell5.innerHTML = "---";
    cell5.classList.add('map')
}

function removerow(value) {
    var num = value.parentNode.parentNode.rowIndex - 1
    table.deleteRow(num);
    snipes.splice(num, 1);
    createCookie('snipes', JSON.stringify(snipes));
}

async function editrow(num, sgame, smode, smap, scolor) {
    num = parseInt(num)
    if (table.rows[num]) {
        change = false
        ign = table.rows[num].getElementsByClassName('ign')[0]
        game = table.rows[num].getElementsByClassName('game')[0]
        mode = table.rows[num].getElementsByClassName('mode')[0]
        map = table.rows[num].getElementsByClassName('map')[0]

        dontplay = true
        if (map.style.backgroundColor == "") {
            dontplay = false
        }

        if (game.innerHTML.toString() != sgame.toString()) {
            change = true
        } else if (mode.innerHTML.toString() != smode.toString()) {
            change = true
        } else if (r2h(map.style.backgroundColor) != scolor.toString()) {
            change = true
        }

        if (change == true) {
            game.innerHTML = sgame
            mode.innerHTML = smode
            map.innerHTML = smap

            game.style.backgroundColor = scolor
            mode.style.backgroundColor = scolor
            map.style.backgroundColor = scolor
            ign.style.backgroundColor = scolor

            if (dontplay) {
                var audio = new Audio('/sounds/change.mp3');
                audio.play();
                change = false
            }

        }

    }
}

async function UserInputFunction(e) {
    if (e.keyCode === 13) {
        user = e.target.value
        e.target.value = ""
        await getUUID(user).then(res => {
            if (res) {
                addrow({
                    name: res['username'],
                    uuid: res['uuid'],
                })
            } else {
                console.log(res['username'] + " was not found")
            }
        })
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