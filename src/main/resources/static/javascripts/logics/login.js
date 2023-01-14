if (userIsLoggedIn())
    updateSession().then();

async function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    const response = await (await fetch(apiLoginURL,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            _username: username,
            _password: password
        })
    })).json();

    if (response === undefined) {
        document.getElementById("response_message").innerHTML = `
            <p class="body_text">
                Response to server didn't have a success...
            </p>
        `;
    } else if (response.message !== undefined) {
        document.getElementById("response_message").innerHTML = `
            <p class="body_text">
                ${response.message}
            </p>
        `;
    } else {
        saveUser(response);
        localStorage.setItem("logged_in", "true")
        document.getElementById("response_message").innerHTML = `
            <p class="body_text">
                Congrats ${response.username}. You have logged in!
            </p>
        `;
        document.location.href = profileURL;
    }
}
function logout() {
    localStorage.clear();
    document.getElementById("response_message").innerHTML = `
        <p class="body_text">
            You have logged out!
        </p>
    `;
    document.location.href = frontpageURL;
}
async function signup() {
    const kind = document.getElementById("kind").value;

    if (kind !== "") {
        const username = document.getElementById("username").value,
                password = document.getElementById("password").value,
                description = document.getElementById("description").value,
                contactInformation = {
                    email: document.getElementById("email").value,
                    phone: {
                        country: {
                            title: document.getElementById("country_title").value,
                            indexes: document.getElementById("country_indexes").value,
                            phoneNumberDigits: document.getElementById("first_phone_number_digits").value
                        },
                        numbers: document.getElementById("phone_numbers").value,
                        isMobile: document.getElementById("is_mobile").value
                    },
                    address: {
                        street: document.getElementById("street").value,
                        floor: document.getElementById("floor").value,
                        postal: document.getElementById("postal").value,
                        city: document.getElementById("city")
                    },
                    country: {
                        title: document.getElementById("country_title").value,
                        indexes: document.getElementById("country_indexes").value,
                        phoneNumberDigits: document.getElementById("first_phone_number_digits").value
                    }
                };

        switch (kind) {
            case "PARTICIPANT": {
                const firstname = document.getElementById("first_name").value,
                    lastname = document.getElementById("last_name").value;

                const response = await (await generateFetch({
                    url: apiCreateArtist(password),
                    method: 'POST',
                    body: {
                        _username: username,
                        _firstName: firstname,
                        _lastName: lastname,
                        _description: description,
                        _contactInfo: contactInformation
                    }
                })).json();

                if (response != null)
                    saveUser(response.element);

                break;
            }
            case "ARTIST": {
                const firstname = document.getElementById("first_name").value,
                    lastname = document.getElementById("last_name").value,
                    runner = document.getElementById("runner").value;

                const response = await (await fetch(apiCreateArtist(password),{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        _username: username,
                        _firstName: firstname,
                        _lastName: lastname,
                        _runner: runner,
                        _description: description,
                        _contactInfo: contactInformation
                    })
                })).json();

                if (response != null)
                    saveUser(response.element);

                break;
            }
            case "BAND": {
                if (getUser() !== undefined) {
                    const runner = document.getElementById("runner").value;

                    const response = await (await fetch(apiCreateBand(password),{
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            _username: username,
                            _members: getUser(),
                            _runner: runner,
                            _description: description,
                            _contactInfo: contactInformation
                        })
                    })).json();

                    if (response != null)
                        saveUser(response.element);
                } else {
                    alert("You need to be signed in as an Artist to create a band...");
                }
                break;
            }
            case "VENUE": {
                const location = document.getElementById("location").value,
                    gearDescription = document.getElementById("gear_description").value,
                    size = document.getElementById("venue_size");

                const response = await (await fetch(apiCreateVenue(password),{
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        _username: username,
                        _description: description,
                        _location: location,
                        _gearDescription: gearDescription,
                        _size: size,
                        _contactInfo: contactInformation
                    })
                })).json();

                if (response != null)
                    saveUser(response.element);

                break;
            }
        }
        if (getUser() !== undefined) {
            localStorage.setItem("logged_in", "true");
            window.location.href = profileURL();
        }
    }
}



async function updateSession() {
    const user = getUser();
    if (user !== undefined)
        saveUser((await (await fetch(apiUserGetURL(
            localStorage.getItem("user_id")
        ))).json()).element);
}

function userIsLoggedIn() {
    return localStorage.getItem("logged_in") === "true";
}