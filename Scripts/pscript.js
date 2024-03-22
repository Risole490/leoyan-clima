var sidepanel = document.getElementById("mySidepanel")

function toggleSidepanel(){
    if(sidepanel.style.width === '0px'){
        sidepanel.style.width = '220px'
    } else {
        sidepanel.style.width = '0px'
    }
}