const source = document.getElementById('source');
const result = document.getElementById('result');



function CheckKey(e){
    var xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
  
      xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
            a=JSON.parse(xhr.responseText);
            console.log(xhr.responseText)
            if(a.success){
                resolve(true);
            }else{
                resolve(false);
            }
            
                
        }};
  
        xhr.open("POST", "https://api.hypixel.net/key?key="+e);
      xhr.send();
    });
}

async function KeyInput(e) {    
    if (/[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.test(e.target.value)) {
        CheckKey(e.target.value).then(res => {
            if(res){
                result.innerHTML="Valid Key"
            }else{
                result.innerHTML="Invalid Key"
            }
        }
            );

        
    }else{
        result.innerHTML="Invalid Key"
    }  
}

source.addEventListener('input', KeyInput);
source.addEventListener('propertychange', KeyInput);
