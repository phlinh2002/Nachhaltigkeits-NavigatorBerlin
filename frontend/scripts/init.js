document.addEventListener("DOMContentLoaded", function () {
    let loggedUser = JSON.parse(sessionStorage.getItem("login_data"))

    let mainScreen = document.getElementById("wrapper_map_screen")
    let loginScreen = document.getElementById("login_screen_wrapper")
    let updateScreen = document.getElementById("update_screen_wrapper")
    let addScreen = document.getElementById("add_screen_wrapper")
    let add_btn = document.getElementById("map_screen_map_panel_btn_add")
    let welcome_msg = document.getElementById("welcome_message")

    addScreen.style.display = 'none'
    updateScreen.style.display = 'none'
    if(loggedUser){
        loginScreen.style.display = 'none'
        mainScreen.style.display = 'flex'
        if(loggedUser.role==="admin"){
            add_btn.style.display = 'flex'
        } else {
            add_btn.style.display = 'none'
        }
        welcome_msg.innerText = 'Willkommen, ' + loggedUser.firstname

    } else {
        loginScreen.style.display = 'flex'
        mainScreen.style.display = 'none'
    }


});
function showAddScreen() {
    let mainScreen = document.getElementById("wrapper_map_screen")
    let addScreen = document.getElementById("add_screen_wrapper")
    addScreen.style.display = 'flex'
    mainScreen.style.display = 'none'
}
