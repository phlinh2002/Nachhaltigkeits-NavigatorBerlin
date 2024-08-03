function logout() {
    let mainScreen = document.getElementById("wrapper_map_screen")
    let loginScreen = document.getElementById("login_screen_wrapper")
    let addScreen = document.getElementById("add_screen_wrapper")
    sessionStorage.removeItem("login_data")
    loginScreen.style.display = 'flex'
    mainScreen.style.display = 'none'
    addScreen.style.display = 'none'
}