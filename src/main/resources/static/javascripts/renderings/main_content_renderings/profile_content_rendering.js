async function renderProfile(profileContent) {
    function generateProfileContent(user) {
        function profileContentSection(mainSection) {
            return `
                <section id="profile_content_left_section">
                    ${generateProfileTable(user)}
                </section>
                <section id="profile_content_left_section">
                    ${mainSection}
                </section>
            `;
        }

        function generateProfileEditingContent(user) {
            return `
                <section id="editing_section">
                    <section id="editing_section_header">
                        <h4 class="title">
                            Feel free to edit your information.
                        </h4>
                        <p id="editing_message"></p>
                    </section>
                    <section id="editing_field_section">
                        <div class="wrapper">
                            <div id="name_editing">
                                <h5 class="title">Name and description</h5>
                                <label for="username">Username:</label>
                                <input type="text" id="username" value="${user.username}">
                                <label for="description">Description:</label>
                                <input type="text" id="description" value="${user.description}">
                                <label for="firstname">Firstname:</label>
                                <input type="text" id="firstname" value="${user.firstname}">
                                <label for="lastname">Lastname:</label>
                                <input type="text" id="lastname" value="${user.lastname}">
                            </div>
                            <div id="contact_editing">
                                <h5 class="title">Contact information</h5>
                                <label for="email">Email:</label>
                                <input type="email" id="email" value="${user.contactInfo.email}">
                                <div id="phone_editing">
                                    <h6 class="title">Phone</h6>
                                    <label for="phone_number">Number:</label>
                                    <input type="tel" id="phone_number" value="${user.contactInfo.phone.numbers}">
                                    <label for="is_mobile">Is mobile:</label>
                                    <input type="checkbox" id="is_mobile" value="${user.contactInfo.phone.isMobile}">
                                </div>
                                <div id="address_editing">
                                    <h6 class="title">Address</h6>
                                    <label for="city">City:</label>
                                    <input type="text" id="address" value="${user.contactInfo.address.city}">
                                    <label for="street">Street:</label>
                                    <input type="text" id="street" value="${user.contactInfo.address.street}">
                                    <label for="floor">Floor:</label>
                                    <input type="text" id="floor" value="${user.contactInfo.address.floor}">
                                    <label for="postal">Postal:</label>
                                    <input type="text" id="postal" value="${user.contactInfo.address.postal}">
                                    <label for="country">Country:</label>
                                    <input type="text" id="country" value="${user.contactInfo.country.title}">
                                </div>
                            </div>
                            ${user.authority === "VENUE" ? `
                            <div id="venue_editing">
                            <h5 class="title">Venue</h5>
                                <label for="location">Location:</label>
                                <input type="text" id="location" value="${user.location}">
                                <label for="size">Size:</label>
                                <input type="text" id="size" value="${user.size}">
                            </div>
                            ` : ``}
                            <div id="editing_confirmation">
                                <label for="confirmation_password">Write your password:</label>
                                <input type="password" id="confirmation_password" placeholder="********">
                                <label for="new_password">New password:</label>
                                <input type="password" id="new_password" placeholder="Leave empty if you wish to keep old">
                                <button onclick="editUser()">Edit</button>
                            </div>
                        </div>
                    </section>
                    <section id="delete_section">
                        <h5>Do you wish to delete your account?</h5>
                        <p id="user_delete_response_message"></p>
                        <button onclick="${deleteUser(user.id)}">Delete</button>
                    </section>
                </section>
            `;
        }

        function generateProfileBandsContent(user) {
            return user.bands !== undefined ? userContainers(user.bands) : null;
        }

        function generateRequestsContent(user) {
            let content = ``;
            for (let i = 0; i < user.requests.length; i++) {
                const request = user.requests[i];
                content += `
                    <div class="request_section">
                        <h6 class="description">${request.event.title}</h6>
                        <p class="request_description">${request.message}</p>
                        <label for="${request.event.title}_approve">Approve</label>
                        <input type="checkbox" id="${request.event.title}_approve" value="${request.approved.truth}" onchange="${approveRequest(request)}">
                    </div>
                `;
            }

            return user.requests.length > 0 ? `
                <section id="requests_section">
                    <h4 class="title">Requests</h4>
                    <p id="request_message"></p>
                    <div id="description">
                        <h5 class="title">These are your requests:</h5>
                        ${content}
                    </div>
                </section>
            ` : `<h4 class="title">You don't have any requests at the moment...</h4>`;
        }

        async function generateCreateEventContent() {
            return `
                <section id="event_creation_section">
                    <div id="name_section">
                        <h5 class="title">Name and description</h5>
                        <label for="title">Title:</label>
                        <input type="text" id="title" placeholder="Jazz show...">
                        <label for="description">Description:</label>
                        <input type="text" id="description" placeholder="This is a jazz show...">
                    </div>
                    <div id="practical_section">
                        <label for="open_doors">Open doors:</label>
                        <input type="datetime-local" id="open_doors">
                        <label for="price">Price:</label>
                        <input type="number" id="price">
                        <label for="tickets_url">Ticket URL:</label>
                        <input type="text" id="tickets_url" placeholder="billetlugen.dk">
                        <label for="public">Public:</label>
                        <input type="checkbox" id="public">
                    </div>
                    <div id="contact_section">
                        <h5 class="title">Contact information</h5>
                        <label for="email">Email:</label>
                        <input type="email" id="email" placeholder="something@mail.com">
                        <div id="phone_section">
                            <h6 class="title">Phone</h6>
                            <label for="phone_number">Number:</label>
                            <input type="tel" id="phone_number">
                            <label for="is_mobile">Is mobile:</label>
                            <input type="checkbox" id="is_mobile">
                        </div>
                        <div id="address_section">
                            <h6 class="title">Address</h6>
                            <label for="city">City:</label>
                            <input type="text" id="address">
                            <label for="street">Street:</label>
                            <input type="text" id="street">
                            <label for="floor">Floor:</label>
                            <input type="text" id="floor">
                            <label for="postal">Postal:</label>
                            <input type="text" id="postal">
                            <label for="country">Country:</label>
                            <input type="text" id="country"">
                        </div>
                    </div>
                    <div id="venue_section">
                        <h5 class="title">Venue</h5>
                        <label for="location">Location:</label>
                        <input type="text" id="location">
                        <label for="size">Size:</label>
                        <input type="text" id="size">
                    </div>
                    <p id="response_message"></p>
                    <button onclick="${await createEvent()}">Create</button>
                </section>
            `;
        }

        let mainSection;
        if (profileContent !== undefined)
            switch (profileContent) {
                case "BULLETINS": {
                    mainSection = generateBulletinContent(user.bulletins);
                    break;
                }
                case "ALBUMS": {
                    mainSection = generateAlbumContainers(user);
                    break;
                }
                case "EDITING": {
                    mainSection = generateProfileEditingContent(user);
                    break;
                }
                case "BANDS": {
                    mainSection = generateProfileBandsContent(user)
                    break;
                }
                case "REQUESTS": {
                    mainSection = generateRequestsContent();
                    break;
                }
                case "FOLLOWINGS": {
                    mainSection = generateFollowingContent(user);
                    break;
                }
                case "CREATE_EVENT": {
                    mainSection = generateCreateEventContent();
                    break;
                }
                default: {
                    mainSection = generateProfileEditingContent(user);
                    break;
                }
            }
        else
            mainSection = generateBulletinContent(user.bulletins);
        return profileContentSection(mainSection);
    }

    if (!userIsLoggedIn())
        await renderFrontpage("You are not logged in...");
    else {
        const splittedContent = profileContent.split("|");
        const isNotLocalUser = splittedContent.length > 1;
        const user = isNotLocalUser ? await (await fetch(apiUserGetURL(splittedContent[1]))).json()._element: getUser();
        if (user !== undefined) {
            document.getElementById("main_content").innerHTML = `
                <section id="profile_header_section">
                    <div id="cover_image_container">
                        <div class="wrapper">
                            ${await generateImage({
                                endpoint: user.albums[0]._items._data[1]._endpoint,
                                class: "cover_image"
                            })}
                        </div>
                    </div>
                    <section id="profile_header_detail_section">
                        ${await generateImage({
                            endpoint: user.albums[0]._items._data[0]._endpoint,
                            class: "profile_image"
                        })}
                        <div>
                            <div id="profile_header_titles">
                                <h2 id="profile_username_title" class="title">${user.username}</h2>
                                <h3 id="profile_full_name_title" class="descritpion">${user.fullname}</h3>
                                <p class="description">${user.description}</p>
                            </div>
                            <div id="profile_header_links">
                                <a onclick="${await renderProfile("BULLETINS")}">
                                    <p class="header_link_title">Bulletins</p>
                                </a>
                                <a onclick="${await renderProfile("ALBUMS")}">
                                    <p class="header_link_title">Albums</p>
                                </a>
                                ${isNotLocalUser ? `` : `
                                    <a onclick="${await renderProfile("EDITING")}">
                                        <p class="header_link_title">Editing</p>
                                    </a>
                                ` }
                                ${(user.authority === "ARTIST" ? `
                                <a onclick="${await renderProfile("BANDS")}">
                                    <p class="header_link_title">Bands</p>
                                </a>
                                <a onclick="${await renderProfile("REQUESTS")}">
                                    <p class="header_link_title">Requests</p>
                                </a>
                                ` : ``)}
                                ${(user.authority !== "VENUE" ? `
                                <a onclick="${await renderProfile("FOLLOWINGS")}">
                                    <p class="header_link_title">Followings</p>
                                </a>
                                ${isNotLocalUser ? `` : `
                                    <a onclick="${await renderProfile("CREATE_EVENT")}">
                                        <p class="header_link_title">Create event</p>
                                    </a>
                                    `}
                                ` : ``)}
                            </div>
                            <div id="profile_header_right_side">
                                ${isNotLocalUser ? (doesFollowUser(user) ? `
                                <button onclick="${unfollow([getUser(),user])}">Unfollow</button>
                                ` : `
                                <button onclick="${follow([getUser(),user])}">Follow</button>
                                `) : `
                                <h4 class="title">Welcome to your profile</h4>
                                <p class="description">
                                    Here you can view your information
                                    and change them for your liking.
                                </p>
                                `}
                            </div>
                        </div>
                    </section> 
                </section>
                <section id="profile_content_section">
                    ${generateProfileContent(user)}
                </section>
            `;
        }
        else
            await renderFrontpage(isNotLocalUser ? "Something went wrong" : "You are not logged in...");
    }
}

function generateProfileTable(user) {
    const content = `
        <tr>
            <th>Username:</th>
            <th>Full name:</th>
            <th>Email:</th>
            <th>Phone:</th>
            <th>Address:</th>
            <th>Country:</th>
            <th>Profile created:</th>
            ${user.ratings !== undefined && user.ratings.length > 0 ? `
            <th>Total rating:</th>
            ` : ``}
            ${user.authority === "VENUE" ? `
            <th>Location:</th>
            <th>Size:</th>
            ` : ``}
        </tr>
        <tr>
            <td>${user.username}</td>
            <td>${user.fullname}</td>
            <td>${user.contactInfo.email}</td>
            <td>${user.contactInfo.phone.numbers}</td>
            <td>${user.contactInfo.address.street}, ${user.contactInfo.address.floor}. ${user.contactInfo.address.postal} ${user.contactInfo.address.city}</td>
            <td>${user.contactInfo.country.title}</td>
            <td>${user.timestamp.toLocaleString()}</td>
            ${user.ratings !== undefined && user.ratings.length > 0 ? `
            <td>${calculateTotalRatings(user.ratings)}</td>
            ` : ``}
            ${user.authority === "VENUE" ? `
            <th>${user.location}</th>
            <th>${user.size}</th>
            ` : ``}
        </tr>
    `;

    return `
        <table id="profile_table">
            ${content}
        </table>
    `;
}

function calculateTotalRatings(ratings) {
    let total = 0;
    for (let i = 0; i < ratings.length; i++)
        total += ratings[i].value;
    return total/ratings.length;
}

async function renderUser(id) {
    await renderProfile("user|"+id)
}

function doesFollowUser(interest) {
    const user = getUser();
    for (let i = 0; i < user.idols; i++)
        if (user.idols[i].id === interest._primaryId)
            return true;
    return false;
}