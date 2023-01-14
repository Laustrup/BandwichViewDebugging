//TODO check requirements of the fields
async function renderLogin() {
    if (!userIsLoggedIn()) {
        let content = `
            <section id="login_field_section">
                <div class="wrapper">
                    <label for="username">Title:</label>
                    <input type="text" id="username" placeholder="username/email..." oninput="analyseLogin()">
                    <p class="detail_description" id="username_detail"></p>
                    
                    <label for="password">Password:</label>
                    <input type="password" id="password" placeholder="********" oninput="analyseLogin()">
                    <p class="detail_description" id="password_detail"></p>
                </div>
            </section>
            <section id="login_buttons">
                <div class="wrapper">
                    <button onclick="${async () => { await changeURL(frontpageURL); }}" class="return_button">
                        Go back
                    </button>
                    <button onclick="login()" class="action_button">
                        Log in
                    </button>
                    <p class="detail_description" id="response_message"></p>
                </div>
            </section>
        `;

        document.getElementById("main_content").innerHTML = `
            <section id="login_title_section">
                    <div class="wrapper">
                        <h4 class="title">
                            Login
                        </h4>
                        <p class="description">
                            Fill the fields in order to login.
                            The title can either your username or Email.
                        </p>
                    </div>
                </section>
                <hr>
                <section id="login_content_section">
                    <div class="wrapper">
                        ${content}
                    </div>
                </section>
                <section id="login_info_section">
                    <div class="wrapper">
                        <div class="response_message"></div>
                    </div>
            </section>
        `;
    } else {
        await renderProfile();
    }
}

function analyseLogin() {
    let username = document.getElementById("username").value,
        password = document.getElementById("password").value;

    console.log("Username length", username.length);
    console.log("Password length", password.length);

    let usernameIsValid = username.length <= 50 && username.length !== 0,
        passwordIsValid = /\d/g.test(password) &&
            /[~`!#$%^&*+=\-\[\]\\';,/{}|":<>?]/g.test(password)
            && password.length >= 8 && password.length !== 0;

    document.getElementById("username_detail").innerText = (password.length === 0 ? "" : (!usernameIsValid ?
            "Length of title can't be more than 50 characters..." : ""));
    document.getElementById("password_detail").innerText = (password.length === 0 ? "" : (!passwordIsValid ?
            "Length of password must be at least 8 characters " +
            "and the password must contain a special character and number..." : ""));

    sessionStorage.setItem("login_is_valid",(usernameIsValid&&passwordIsValid).toString());
}

function renderSignup() {
    let content = `
            <section id="login_field_section">
                <div class="wrapper">
                    <section id="login_kind_section">
                        <div class="wrapper">
                            <label for="kind">Pick the kind of user you wish to create:</label>
                            <select id="kind">
                                <option value=""></option>
                                <option value="PARTICIPANT">Participant</option>
                                <option value="ARTIST">Artist</option>
                                <option value="BAND">Band</option>
                                <option value="VENUE">Venue</option>
                            </select>
                        </div>
                    </section>
                    <section id="signup_fields_section">
                        <div class="wrapper">
                            <div id="signup_fields"></div>
                        </div>
                    </section>
                </div>
            </section>
            <section id="login_buttons">
                <div class="wrapper">
                    <button onclick="${() => {window.location.href=frontpageURL}}" class="return_button">
                        Go back
                    </button>
                    <button onclick="signup()" class="action_button">
                        Sign up
                    </button>
                </div>
            </section>
    `;

    document.getElementById("main_content").innerHTML = `
            <div class="wrapper">
                <section id="login_title_section">
                    <div class="wrapper">
                        <h4 class="title">
                            Sign up |
                        </h4>
                        <p class="description">
                            Fill the fields in order to signup.
                            Only the ones with * are required to be filled.
                            Specific requirements of each field will pop up,
                            when you start typing.
                        </p>
                    </div>
                </section>
                <hr>
                <section id="login_content_section">
                    <div class="wrapper">
                        ${content}
                    </div>
                </section>
                <section id="login_info_section">
                    <div class="wrapper">
                        <div class="response_message"></div>
                    </div>
                </section>
            </div>
        `;

    renderSignupFields();
}

//TODO Perhaps use this as a kind selector?
/*
<form>
  <input type="radio" id="html" name="fav_language" value="HTML">
  <label for="html">HTML</label><br>
  <input type="radio" id="css" name="fav_language" value="CSS">
  <label for="css">CSS</label><br>
  <input type="radio" id="javascript" name="fav_language" value="JavaScript">
  <label for="javascript">JavaScript</label>
</form>
 */
function renderSignupFields() {
    let kind = document.getElementById("kind").value,
        username = document.getElementById("username").value,
        password = document.getElementById("password").value,
        email = document.getElementById("email").value;
    let usernameDetail = (username !== undefined && username.length > 50 ?
            "Length of title can't be more than 50 charactors..." : ""),
        passwordDetail = (password !== undefined && (password.length < 8 ||
        !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(password) ||
        !/\d/g.test(password)) ?
            "Length of password must be at least 8 charactors " +
            "and the password must contain a special charactor and number..." : ""),
        emailDetail = (email !== undefined && !/[@.]/g.test(email) ? "That is not an email..." : "");

    let names = (kind === "PARTICIPANT" || kind === "ARTIST" ? `
        <label for="first_name">First name*:</label>
        <input type="text" id="first_name" placeholder="James">
        
        <label for="last_name">Last name*:</label>
        <input type="text" id="last_name" placeholder="Jackson">
    ` : ``);
    let html = `
        <section id="signup_contact_user_main_fields">
            <div class="wrapper">
                
                ${names}
                
                <label for="username">Username*:</label>
                <input type="text" id="username" placeholder="username...">
                <p class="detail_description">${usernameDetail}</p>
                
                <label for="password">Password*:</label>
                <input type="password" id="password" placeholder="********">
                <p class="detail_description">${passwordDetail}</p>
                
                <label for="description">Description:</label>
                <input type="text" id="description" placeholder="This will describe your user...">
            </div>
        </section>
        
        <section id="signup_contact_info_section">
            <div class="wrapper">
                <h5 class="title">Contact informations</h5>
                <p class="description">
                    Will be used for other users to be able to contact you.
                    In a different way than through the chat rooms of Bandwich.
                </p>
                
                <label for="email">Email:</label>
                <input type="text" id="email" placeholder="Something@mail.com">
                <p class="detail_description">${emailDetail}</p>
                
                <label for="first_phone_number_digits">First phone digits:</label>
                <input type="text" id="first_phone_number_digits" placeholder="+45">
                
                <label for="phone_numbers">Phonenumber:</label>
                <input type="tel" id="phone_numbers" placeholder="43 54 24 63">
                
                <label for="is_mobile">Is mobile:</label>
                <input type="checkbox" id="is_mobile">
                
                <label for="street">Street:</label>
                <input type="text" id="street" placeholder="streetname 32">
                
                <label for="floor">Floor:</label>
                <input type="text" id="floor" placeholder="1. th">
                
                <label for="postal">Postal:</label>
                <input type="text" id="postal" placeholder="4600">
                
                <label for="city">City:</label>
                <input type="text" id="city" placeholder="Køge">
            </div>
            
            <section id="signup_country_section">
                <h5 class="title">Country</h5>
                <p class="description">
                    The country of your current living situation.
                </p>
                
                <div class="wrapper">
                    <label for="country_title">Title of country:</label>
                    <input type="text" id="country_title" placeholder="Denmark">
                    
                    <label for="country_indexes">Indexes of country:</label>
                    <input type="text" id="country_indexes" placeholder="DK">
                </div>
            </section>
        </section>
        
    `;

    switch (kind) {
        case "ARTIST": {
            document.getElementById("signup_fields").innerHTML = `
                ${html}

                <label for="runner">Runner:</label>
                <input type="text" id="runner" class="wide_text_input" placeholder="Describes the gear you have and require">
            `;
            break;
        } case "BAND": {
            // TODO must only happen, if the logged in user is an Artist
            if (userIsLoggedIn())
                document.getElementById("signup_fields").innerHTML = `
                ${html}

                <label for="runner">Runner:</label>
                <input type="text" id="runner" class="wide_text_input" placeholder="Describes the gear you have and require">
                `;
            break;
        }
        case "VENUE": {
            document.getElementById("signup_fields").innerHTML = `
                ${html}
                
                <label for="location">Location*:</label>
                <input type="text" id="location" placeholder="The place to find your venue...">
                
                <label for="gear_description">Gear:</label>
                <input type="text" id="gear_description" class="wide_text_input" placeholder="Artists will be able to read your gear">
                
                <label for="venue_size">Size:</label>
                <input title="number" id="venue_size" placeholder="m3">
            `;
            break;
        }
        default: {
            document.getElementById("signup_fields").innerHTML = ``;
        }
    }
}