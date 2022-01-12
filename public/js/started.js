var url = new URL(window.location.href)
var key = url.searchParams.get("key")
if (key != null) {
    CheckKey(key).then(res => {
        if (res) {
            StartSniper()
        } else {
            window.location.replace("/")
        }
    })
}

if (document.cookie) {
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


cleannames={}
var chr = new XMLHttpRequest();
chr.onreadystatechange = (e) => {
    if (chr.readyState === 4) {
        cleannames = JSON.parse(chr.responseText);
        
    }
}; chr.open("GET", "/json/clean.json"); chr.send();

const table = document.getElementById("usertable");

const userinput = document.getElementById('userinput')
userinput.addEventListener('keyup', UserInputFunction);

for (var num in snipes) {
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.outerHTML = "<th> <button onclick=removerow(this) id='closebutton'> X </button></th>"
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
                if (session['online'] == false) {
                    game = '---'
                    mode = '---'
                    map = '---'
                    color = '#f77777'
                    return
                }
                game = '---'
                mode = '---'
                map = '---'
                color = '#e0f593'
                
                sgametype = session['gameType']
                smode = session['mode']
                smap = session['map']
                console.log(snipes[num]['name']+"-----------")
                console.log(sgametype)
                console.log(smode)
                console.log(smap)

                game = cleannames[sgametype]['clean']
                if (smode == 'LOBBY') {
                    color = '#e0f593'
                    mode = 'Lobby'
                    return
                }
              
                mode=cleannames[sgametype]['modes'][smode]['clean']
                
                if(!cleannames[sgametype]['modes'][smode]['nomap']){
                    map=smap
                }

                color = '#8dd99d'
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

    var json_str = JSON.stringify(snipes);
    createCookie('snipes', json_str);
}

async function editrow(num, game, mode, map, color) {
    num = parseInt(num)
    table.rows[num].getElementsByClassName('game')[0].innerHTML = game
    table.rows[num].getElementsByClassName('mode')[0].innerHTML = mode
    table.rows[num].getElementsByClassName('map')[0].innerHTML = map

    table.rows[num].getElementsByClassName('ign')[0].style.backgroundColor = color
    table.rows[num].getElementsByClassName('game')[0].style.backgroundColor = color
    table.rows[num].getElementsByClassName('mode')[0].style.backgroundColor = color
    table.rows[num].getElementsByClassName('map')[0].style.backgroundColor = color
}

async function UserInputFunction(e) {
    if (e.keyCode === 13) {
        user = e.target.value
        e.target.value=""
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




