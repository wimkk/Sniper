const source = document.getElementById('source')
source.addEventListener('propertychange', KeyInput);
source.addEventListener('input', KeyInput);
const result = document.getElementById('result');


var cookiekey = JSON.parse(getCookie('key'));

CheckKey(cookiekey[0]['key']).then(res => {
    if (res) {
        result.innerHTML = "Valid Key"
        window.location.replace("/?key=" + cookiekey[0]['key']);
    } else {
        result.innerHTML = "Invalid Key"
    }
})


async function KeyInput(e) {
    if (/[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.test(e.target.value)) {
        await CheckKey(e.target.value).then(res => {
            if (res) {
                result.innerHTML = "Valid Key"
                key = e.target.value
                window.location.replace("/?key=" + key);
            } else {
                result.innerHTML = "Invalid Key"
            }
        }
        )
    } else {
        result.innerHTML = "Invalid Key"
    }
}

function CheckKey(e) {
    var xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = (e) => {
            if (xhr.readyState === 4) {
                a = JSON.parse(xhr.responseText);
                if (a.success) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        }
        xhr.open("POST", "https://api.hypixel.net/key?key=" + e);
        xhr.send();
    })
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