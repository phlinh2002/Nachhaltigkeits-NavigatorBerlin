let locations = []
let add_input_fields = {};
let update_input_fields = {};
let map = {}
let mapMarkers = {}

document.addEventListener("DOMContentLoaded", async function () {
    await loadLocationsDB();
    add_input_fields = {
        street: document.getElementById("add_screen_input_street"),
        zip: document.getElementById("add_screen_input_zip"),
        name: document.getElementById("add_screen_input_title"),
        desc: document.getElementById("add_screen_input_description"),
        city: document.getElementById("add_screen_input_town"),
        state: document.getElementById("add_screen_input_state")
    }
    update_input_fields = {
        name: document.getElementById("update_screen_input_title"),
        desc: document.getElementById("update_screen_input_description"),
        street: document.getElementById("update_screen_input_street"),
        zip: document.getElementById("update_screen_input_zip"),
        city: document.getElementById("update_screen_input_town"),
        state: document.getElementById("update_screen_input_state"),
        lat: document.getElementById("update_screen_input_latitude"),
        long: document.getElementById("update_screen_input_longitude"),

    }
    loadLocationsDB();
    displayLocationsInSidebar();
    showLocationsOnMap();
});

async function addLocationDB(event) {
    event.preventDefault();
    if (isFormFilled(add_input_fields)) {
        try {
            const address = `${add_input_fields.street.value} ${add_input_fields.zip.value}`;
            data = await receiveCords(address)
            console.log(data)
            const response = await fetch('http://localhost:3000/locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: add_input_fields.name.value,
                    desc: add_input_fields.desc.value,
                    street: add_input_fields.street.value,
                    zip: add_input_fields.zip.value,
                    city: add_input_fields.city.value,
                    state: add_input_fields.state.value,
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon),
                }),
            });

            if (response.ok) {
                const newLocation = await response.json();
                await loadLocationsDB();
                displayLocationsInSidebar();
                showLocationsOnMap();
                updateUi();
            } else {
                alert('Failed to add location');
            }
        } catch (err) {
            console.error('Error adding location:', err);
        }
    }
}

function showLocationsOnMap() {

    const mapOptions = {
        center: { lat: 52.5200, lng: 13.4050 },
        zoom: 10,
    };

    map = new google.maps.Map(document.getElementById("map_screen"), mapOptions);

    for (const location of locations) {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lon },
            map: map,
            title: location.name
        });
        mapMarkers[location.id] = marker;
        const infoWindow = new google.maps.InfoWindow({
            content: `<div>
                    <h3>${location.name}</h3>
                    <p>${location.desc}</p>
                    <p>Lat: ${location.lat}, Lon: ${location.lon}</p>
                  </div>`
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

    }
}


function displayLocationsInSidebar() {
    const sidebar = document.getElementById("wrapper_map_screen_nav");
    let sidebarContent = `
        <div class="list_headline">
            Standorte
        </div>
    `;

    for (const location of locations) {
        const locationId = location._id || location.id;
        sidebarContent += `
            <div class="nav_item" id="location_${location.name}" data-location-id="${locationId}">
                <div class="nav-item_name">${location.name}</div>
                <div class="nav-item_address">${location.street}</div>
                <div class="nav-item_desc">${location.desc}</div>

            </div>
        `;
    }

    sidebar.innerHTML = sidebarContent;

    sidebar.addEventListener('click', function (event) {
        const locationDiv = event.target.closest('.nav_item');
        if (locationDiv) {
            const locationId = locationDiv.getAttribute('data-location-id');
            const location = locations.find(loc => loc._id === locationId || loc.id === locationId);
            if (location) {
                openUpdateScreen(location);
            }
        }
    });
}


function showMainScreen() {
    let mainScreen = document.getElementById("wrapper_map_screen")
    let addScreen = document.getElementById("add_screen_wrapper")
    let updateScreen = document.getElementById("update_screen_wrapper")
    addScreen.style.display = 'none'
    updateScreen.style.display = 'none'
    mainScreen.style.display = 'flex'
}


function openUpdateScreen(location) {
    switchInputDisabled(location)
    update_input_fields.name.value = location.name;
    update_input_fields.desc.value = location.desc;
    update_input_fields.street.value = location.street;
    update_input_fields.zip.value = location.zip;
    update_input_fields.city.value = location.city;
    update_input_fields.state.value = location.state;
    update_input_fields.lat.value = location.lat;
    update_input_fields.long.value = location.lon;

    showUpdateScreen()

}

async function updateLocationDB(locationid) {
    event.preventDefault();
    const locationIndex = locations.findIndex(loc => loc._id == locationid);
    if (isFormFilled(update_input_fields)) {
        try {
            let address = `${update_input_fields.street.value} ${update_input_fields.zip.value}`;
            const data = await receiveCords(address);
            const updatedLocation = {
                name: update_input_fields.name.value,
                desc: update_input_fields.desc.value,
                street: update_input_fields.street.value,
                zip: update_input_fields.zip.value,
                city: update_input_fields.city.value,
                state: update_input_fields.state.value,
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
            };

            const response = await fetch(`http://localhost:3000/locations/${locationid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedLocation),
            });
            if (response.ok) {
                locations[locationIndex] = updatedLocation;
                updateMarker(updatedLocation);
                await loadLocationsDB();
                displayLocationsInSidebar();
                showLocationsOnMap();
                updateUi();
            } else {
                console.error('Failed to update location');
            }

        } catch (err) {
            console.error('Fehler beim Abrufen der Koordinaten:', err);
        }
    }
}




function deleteLocation(locationId) {
    const locationIndex = locations.findIndex(loc => loc.id === locationId);
    if (locationIndex >= 0) {
        locations.splice(locationIndex, 1);
        updateUi();
    } else {
        console.error("Standort nicht gefunden");
    }
}

function deleteLocationFromDB(locationId) {
    if (locationId) {
        const locationIndex = locations.findIndex(loc => loc._id === locationId);
        if (locationIndex >= 0) {
            fetch(`http://localhost:3000/locations/${locationId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        locations.splice(locationIndex, 1);
                        updateUi();
                    } else {
                        console.error('Failed to delete location');
                    }
                })
                .catch(error => {
                    console.error('Error deleting location:', error);
                });
        } else {
            console.error("Standort nicht gefunden");
        }
    } else {
        console.error("Ungültige Standort-ID");
    }
}




function getNewLocationId() {
    return locations.length
}

function saveLocationsToSessionStorage() {
    sessionStorage.setItem('locations', JSON.stringify(locations));
}

async function loadLocationsDB() {
    try {
        const response = await fetch('http://localhost:3000/locations');
        const data = await response.json();
        if (response.ok) {
            locations = data;
        } else {
            console.error('Failed to fetch locations');
        }
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
}

function updateUi() {
    loadLocationsDB()
    saveLocationsToSessionStorage();
    displayLocationsInSidebar();
    showLocationsOnMap();
    showMainScreen();
}

function isFormFilled(fieldSet) {
    for (const field in fieldSet) {
        if (!fieldSet[field].value) {
            alert(`Bitte füllen Sie das Feld ${field} aus.`);
            return false;
        }
    }
    return true;
}

function showUpdateScreen() {
    let mainScreen = document.getElementById("wrapper_map_screen")
    let updateScreen = document.getElementById("update_screen_wrapper");
    mainScreen.style.display = 'none'
    updateScreen.style.display = 'flex';
}

function switchInputDisabled(location) {
    let updateBtn = document.getElementById("update_screen_input_btn_update");
    let deleteBtn = document.getElementById("update_screen_input_btn_delete");
    user = JSON.parse(sessionStorage.getItem("login_data"));
    if (user.role === "non-admin") {
        update_input_fields.name.disabled = true
        update_input_fields.desc.disabled = true
        update_input_fields.street.disabled = true
        update_input_fields.zip.disabled = true
        update_input_fields.city.disabled = true
        update_input_fields.state.disabled = true
        update_input_fields.lat.disabled = true
        update_input_fields.long.disabled = true
        update_input_fields.name.classList.add("disabled-input");
        update_input_fields.desc.classList.add("disabled-input");
        update_input_fields.street.classList.add("disabled-input");
        update_input_fields.zip.classList.add("disabled-input");
        update_input_fields.city.classList.add("disabled-input");
        update_input_fields.state.classList.add("disabled-input");
        update_input_fields.lat.classList.add("disabled-input");
        update_input_fields.long.classList.add("disabled-input");
        updateBtn.style.display = "none";
        deleteBtn.style.display = "none";
        updateBtn.classList.add("button-center");
        deleteBtn.classList.add("button-center");

    } else {
        update_input_fields.name.classList.remove("disabled-input");
        update_input_fields.desc.classList.remove("disabled-input");
        update_input_fields.street.classList.remove("disabled-input");
        update_input_fields.zip.classList.remove("disabled-input");
        update_input_fields.city.classList.remove("disabled-input");
        update_input_fields.state.classList.remove("disabled-input");
        update_input_fields.lat.classList.remove("disabled-input");
        update_input_fields.long.classList.remove("disabled-input");
        updateBtn.style.display = "flex";
        deleteBtn.style.display = "flex";
        updateBtn.classList.add("button-center");
        deleteBtn.classList.add("button-center");
    }

    updateBtn.removeEventListener("click", updateBtn.clickHandler);
    deleteBtn.removeEventListener("click", deleteBtn.clickHandler);

    updateBtn.clickHandler = function () {
        updateLocationDB(location._id);
    };
    deleteBtn.clickHandler = function () {
        deleteLocationFromDB(location._id);
    };

    updateBtn.addEventListener("click", updateBtn.clickHandler);
    deleteBtn.addEventListener("click", deleteBtn.clickHandler);
}
function updateMarker(updatedLocation) {
    const marker = mapMarkers[updatedLocation.id];
    if (marker) {

        marker.setPosition(new google.maps.LatLng(updatedLocation.lat, updatedLocation.lon));
        marker.setTitle(updatedLocation.name);
    }
}

async function receiveCords(address) {
    try {
        console.log(`Trying to find coords for ${address}`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (response.status === 200) {
            return data
        }
    } catch (err) {
        console.log(`Error: ${err}`);
        alert(err)
    }
}
