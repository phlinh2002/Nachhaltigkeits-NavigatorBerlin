
async function checkUserDB(username, password) {
    const data = {
        username: username,
        password: password
    };

    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log(response)
        if (response.ok) {
            const user = await response.json();
            sessionStorage.setItem("login_data", JSON.stringify(user));
            return user
        } else {
            const responseBody = await response.text();
            return responseBody; 
        }
        
        
    } catch (error) {
        console.log(error.message)
        console.error('Error during login:', error);
    }
}
    
async function login() {
    let username = document.getElementById('login_input_username').value;
    let password = document.getElementById('login_input_password').value;
    
    try {
        let user = checkUserDB(username, password);
        if (user) {
            alert("Login erfolgreich!")
        } else {
            alert("Nutzerdaten nicht gefunden!");
        }
    } catch (error) {
        alert("An unexpected error occurred. Please try again later.");
    }
}
