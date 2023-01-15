const firebaseNotReady = true;

function generateWelcomeSection() {
    const user = getUser();
    return (userIsLoggedIn() ?`
        <section id="informative_welcome_section">
            <h2 class="title">
                Hi ${(user.fullname !== undefined ? user.fullname : user.title)}. You are logged in as ${user.fullname} | 
            </h2>
            <p class="description">
                Now you can explore the full experience of Bandwich
            </p>
        </section>
    `: ``);
}

function generateSearchSection(search) {
    console.log("Items of search section:",search);

    function generateSearchContainers() {
        let containers = generateItemContainers({
            elements: search.users,
            titleClassTag: "container_title",
            kind: "USER"
        });
        containers += generateItemContainers({
            elements: search.events,
            titleClassTag: "container_title",
            kind: "EVENT"
        });

        return `
            <section id="search_containers_section">
                ${containers}
            </section>
        `
    }

    return (search !== undefined && (search.users.length > 0 || search.events.length > 0) ? `
            <section id="search_header">
                <section id="informative_welcome_section">
                    <h2 class="title">
                        Here's what we found
                    </h2>
                    <p class="description">
                        Hope that it is what you were looking for.
                        Notice that you can filter, sort and choose for a more specific search.
                    </p>
                    <section id="search_index_section">
                        ${generateSearchContainers()}
                    </section>
                </section>
                ${generateFilterSection()}
            </section>
        ` : `
            <section id="informative_welcome_section">
                <h2 class="title">
                    That's odd...
                </h2>
                <p class="description">
                    Nothing was found.
                </p>
            </section>
        `);
}

function generateFilterSection() {
    return `
        <section id="filter_section">
            <section id="filter_header_section">
                <h3 class="title">
                    Filter and sort your search
                </h3>
                <p class="description">
                    Here you can specify your search.
                    Just change the wished detail and it will do the action.
                    Empty fields will contain an example.
                </p>
            </section>
            <section id="filter_configs_section">
                <section id="common_filters_section">
                    <h4 class="title">
                        Common filters
                    </h4>
                    <div id="filters">
                        <p class="description">
                            These filters will affect search elements of both users and events.
                        </p>
                        <label for="city_filtering">City:</label>
                        <input type="text" id="city_filtering" placeholder="København" onchange="filterSearch()">
                    </div>
                </section>
                <section id="event_filters_section">
                    <h4 class="title">
                        Events
                    </h4>
                    <p class="description">
                        These filters are only affecting events.
                    </p>
                    <div class="date_filters">
                        <label for="include_past_events">Include past events:</label>
                        <input type="checkbox" id="include_past_events" onclick="filterSearch()">
                        <label for="earliest_date_filtering">Earliest date:</label>
                        <input type="date" id="earliest_date_filtering" onclick="filterSearch()">
                        <label for="latest_date_filtering">Latest date:</label>
                        <input type="date" id="latest_date_filtering" onclick="filterSearch()">
                    </div>
                    <div class="price_filters">
                        <label for="only_free_events">Only free events:</label>
                        <input type="checkbox" id="only_free_events" onclick="renderPriceRange()">
                        <div id="price_defying">
                            <label for="price_range">Highest price:</label>
                            <div class="slide_container">
                                <input type="range" id="price_range" class="slider" min="0" max="3000">
                            </div>
                        </div>
                    </div>
                </section>
                <section id="sorting_section">
                    <h4 class="title">
                        Sorting
                    </h4>
                    <p class="description">
                        Pick a way of sorting.
                    </p>
                    <label for="sorting">Sort:</label>
                    <select id="sorting" onclick="sortSearch()">
                        <option value="DON'T_SORT">Don't sort</option>
                        <option value="EARLIEST_DATE">Earliest date</option>
                        <option value="LATEST_DATE">Latest date</option>
                        <option value="HIGHEST_PRICE">Highest price</option>
                        <option value="LOWEST_PRICE">Lowest price</option>
                        <option value="ALFABETICLY">Alfabeticly</option>
                    </select>
                </section>
                <section id="search_selector_section">
                    <form id="search_selector_form">
                        <input type="radio" id="any_radio" value="ANY">
                        <label for="any_radio">ANY</label><br>
                        <input type="radio" id="events_radio" value="EVENTS">
                        <label for="events_radio">Events</label><br>
                        <input type="radio" id="venues_radio" value="VENUES">
                        <label for="venues">Venues</label><br>
                        <input type="radio" id="bands_radio" value="BANDS">
                        <label for="bands_radio">Bands</label><br>
                        <input type="radio" id="artists_radio" value="ARTISTS">
                        <label for="artists_radio">Artists</label><br>
                        <input type="radio" id="participants_radio" value="PARTICIPANTS">
                        <label for="participants_radio">Participants</label>
                    </form>
                </section>
            </section>
        </section>
    `
}

function renderPriceRange() {
    const html = `
            <label for="price_range">Highest price:</label>
            <div class="slide_container">
                <input type="range" id="price_range" class="slider" min="0" max="3000">
            </div>
        `;
    const onlyFreeEvents = document.getElementById("only_free_events").value;
    document.getElementById("price_defying").innerHTML = (
        onlyFreeEvents ? html : ``);

    return html;
}

function generateIdolsContainers() { return userContainers(getIdols({id: "user_" + id })); }
function generateFansContainers() { return userContainers(getFans({id: "user_" + id }))}

function generateAttendingEventContainers() {
    return eventContainers({
        events: getEvents({ id: "user_" + localStorage.getItem("user_id") }),
        onlyOccurring: document.getElementById("onlyOccurring").value
    });
}

async function generateEventContainers() {
    return eventContainers({
        events: (await fetchElement({
            url: apiEventGet(),
            method: POST
        })),
        onlyOccurring: false
    });
}

function eventContainers(items) {
    let events = items.events;
    console.log("Events for containers:", events);

    if (items.onlyOccurring)
        events.filter((event) => {
            return event.cancelled === false &&
                Date.now().toEpochMilli() <= Date.parse(event.openDoors).toEpochMilli();
        });

    return generateItemContainers({
        elements: events,
        kind: "EVENT",
        titleClassTag: "container_title"
    });
}

function userContainers(users) {
    return generateItemContainers({
        elements: users,
        titleClassTag: "container_title",
        kind: "USER"
    });
}

function generateGigContainers() {
    const gigs = getGigs({ id: "user_" + localStorage.getItem("user_id") });
    gigs.filter((gig) => {
        return  Date.now().toEpochMilli() <= Date.parse((gig.start).toString()).toEpochMilli();
    });

    return generateItemContainers({
        elements: getGigs({ id: "user_" + localStorage.getItem("user_id") }),
        kind: "GIGS"
    });
}

function generateBulletinContent(bulletins) {
    return generateItemContainers({
        elements: bulletins,
        kind: "BULLETINS"
    });
}

function generateAlbumContainers(user) {
    return generateItemContainers({
        elements: (user.albums !== undefined ? user.albums : user.albums),
        kind: "ALBUMS"
    })
}

function generateItemContainers(item) {
    let containers = ``;
    item.elements.forEach((element) => {
        const id = element.primaryId;
        console.log(eventURL(id))
        containers += `
            <div class="${item.kind ? "bulletin_container" : "container"}">
                <div class="wrapper">
                    ${(item.kind !== "BULLETINS" || item.kind !== "GIGS" 
                    || ((element.isPublic !== undefined ? element.isPublic : element.isPublic)
                    || item.isOwnBulletin) ? 
                    `<a href="${item.kind === "EVENT" ? eventURL(id) :
                        userURL(id)}">
                        <h5 class="${item.titleClassTag}">
                            ${(
                                element.username !== undefined ? element.username :
                                (element.title !== undefined ? element.title : "No username")
                            )}
                        </h5>
                    </a>
                    ${(item.kind === "EVENT" ? `
                    <p class="container_body_text">
                        Doors opens at: ${ new Date(element.openDoors )}
                    </p>
                    <p class="container_body_text">
                        Location: ${element.location}
                    </p>
                        ` : ``)}` : (element.kind === "BULLETINS" ? 
                    ((element.isSent !== undefined ? element.isSent : element.isSent) ? `
                    <h5 class="${item.titleClassTag}">
                        ${(element.author.username !== undefined ? element.author.username : element.author.username)}
                    </h5>
                    <p class="date_description">
                        Written ${new Date((element.timestamp !== undefined ? element.timestamp : element.timestamp))}
                    </p>
                    <p class="bulletin_content">
                        ${(element.content !== undefined ? element.content : element.content)}
                    </p>
                    ${(((element.isEdited !== undefined ? element.isEdited === "true" : element.isEdited === "true") ? `
                    <p class="notifying_description">
                        Is edited
                    </p>
                    ` : ``))}
                    ` : ``) : element.kind === "GIGS" ? `
                    <h5 class="container_title">${element.event.title}</h5>
                    <p class="container_body_text">
                        Gig begins at: ${new Date(element.start)}
                    </p>
                    <p class="container_body_text">
                        Location: ${element.event.location}
                    </p>
                    ` : (element.kind === "ALBUM" ?
                    
                    `` : ``)))}
                </div>
            </div>
            `;
    });
    return containers;
}

function generateAlbumContent(album) {

}

function generateAlbumItemContent(image) {

}

function generateFollowingContent(user) {
    if (userIsLoggedIn())
        return `
            <section id="idols_section">
            ${(user.idols.length > 0 ? `
                <h3 class="title">
                    Idols:
                </h3>
                <div class="container_box">
                    <div class="wrapper">
                        ${generateIdolsContainers()}
                    </div>
                </div>
            `: `
                <h3 class="title">
                    At the moment you are not admiring any bands or artists...
                </h3>
                <p class="description">
                    Feel welcome to browse through the different musicians.
                </p>
            `)}
        </section>
        <section id="fans_section">
            ${(user.fans.length > 0 ? `
            <h3 class="title">
                Fans:
            </h3>
            <div class="container_box">
                <div class="wrapper">
                    ${generateFansContainers()}
                </div>
            </div>
            ` : `
            <h3 class="title">
                At the moment you are not being admired by any fans...
            </h3>
            <p class="description">
                Don't worry, they will come, if you start attending some events.
            </p>
            `)}
        </section>
        `;
    else
        ``;
}

//TODO Implement image generating
async function generateImage(item) {
    return !firebaseNotReady ? `<img src="${(await fetchImage(item.endpoint))}" alt="${item.author}">` : ``;
}

async function fetchImage(endpoint) {
    const images = firebase.storage().ref().child('Images'), image = images.child('image1');
}