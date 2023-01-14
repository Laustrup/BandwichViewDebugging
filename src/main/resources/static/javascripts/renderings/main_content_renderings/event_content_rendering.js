async function renderEvent(items) {
    const response = items.doFetch ? await (await generateFetch({
        url: apiEventGet(items.id),
        method: POST
    })) : undefined;

    if (response !== undefined && response.error) {
        await renderFrontpage(response.message === undefined ? "Event couldn't be found..." : response.message);
    } else {
        const event = items.doFetch ? response.element : undefined,
            user = userIsLoggedIn() ? getUser() : items.event;

        function participationStatus() {
            for (let i = 0; i < user.events; i++) {
                if (user.events[i].primaryId === items.id) {
                    for (let j = 0; j < user.events[i].participations.length; j++) {
                        if (user.events[i].participations[j].event.primaryId === event.primaryId)
                            return user.events[i].participations[j];
                    }
                    break;
                }
            }
            return undefined;
        }
        const participation = participationStatus();

        async function generateEditingContent() {
            async function changeActDatalist(search) {
                const response = (await (await fetch(apiSearchURL(search))).json()).element.users;
                let options = ``;
                response.forEach((user) => {
                    options += `<option value="${user.id}">${user.username}</option>`;
                });

                document.getElementById("act_id").innerHTML = `
                    <datalist>
                        ${options}
                    </datalist>
                `;
            }

            return `
                <section id="editing_section">
                    <section id="editing_section_header">
                        <h4 class="title">
                            Feel free to edit your event information.
                        </h4>
                        <p id="editing_message"></p>
                    </section>
                    <section id="editing_field_section">
                        <div class="wrapper">
                            <div id="name_editing">
                                <h5 class="title">Name and description</h5>
                                <label for="title">Title:</label>
                                <input type="text" id="title" value="${event.title}">
                                <label for="description">Description:</label>
                                <input type="text" id="description" value="${event.description}">
                            </div>
                            <div id="practical_editing">
                                <label for="open_doors">Open doors:</label>
                                <input type="datetime-local" id="open_doors" value="${Date.parse(event.openDoors.toString())}">
                                <label for="price">Price:</label>
                                <input type="number" id="price" value="${event.price}">
                                <label for="tickets_url">Ticket URL:</label>
                                <input type="text" id="tickets_url" value="${event.ticketsURL}">
                                <label for="public">Public:</label>
                                <input type="checkbox" id="public" value="${event.public.truth}">
                            </div>
                            <div id="contact_editing">
                                <h5 class="title">Contact information</h5>
                                <label for="email">Email:</label>
                                <input type="email" id="email" value="${event.contactInfo.email}">
                                <div id="phone_editing">
                                    <h6 class="title">Phone</h6>
                                    <label for="phone_number">Number:</label>
                                    <input type="tel" id="phone_number" value="${event.contactInfo.phone.numbers}">
                                    <label for="is_mobile">Is mobile:</label>
                                    <input type="checkbox" id="is_mobile" value="${event.contactInfo.phone.isMobile}">
                                </div>
                                <div id="address_editing">
                                    <h6 class="title">Address</h6>
                                    <label for="city">City:</label>
                                    <input type="text" id="address" value="${event.contactInfo.address.city}">
                                    <label for="street">Street:</label>
                                    <input type="text" id="street" value="${event.contactInfo.address.street}">
                                    <label for="floor">Floor:</label>
                                    <input type="text" id="floor" value="${event.contactInfo.address.floor}">
                                    <label for="postal">Postal:</label>
                                    <input type="text" id="postal" value="${event.contactInfo.address.postal}">
                                    <label for="country">Country:</label>
                                    <input type="text" id="country" value="${event.contactInfo.country.title}">
                                </div>
                            </div>
                            <div id="venue_editing">
                                <h5 class="title">Venue</h5>
                                <label for="location">Location:</label>
                                <input type="text" id="location" value="${event.location}">
                                <label for="size">Size:</label>
                                <input type="text" id="size" value="${event.size}">
                            </div>
                            <button onclick="${await editEvent(event.primaryId)}">Edit</button>
                        </div>
                    </section>
                </section>
                <section id="add_gig_section">
                    <h5 class="title">Here you can add a gig to the event</h5>
                    <p id="gig_response_message"></p>                    
                    <label for="act_id">Act:</label>
                    <input type="text" list="act_id" onchange="${await changeActDatalist(this)}" placeholder="Write an artist or band...">
                    <datalist id="act_id"></datalist>
                    <label for="gig_start">Start:</label>
                    <input type="datetime-local" id="gig_start">
                    <label for="gig_end">End:</label>
                    <input type="datetime-local" id="gig_end">
                    <button onclick="${addGig(event)}">Add gig</button>
                </section>
                <section id="delete_section">
                    <h5>Do you wish to delete the event?</h5>
                    <p id="event_delete_response_message"></p>
                    <button onclick="${await deleteEvent(event.primaryId)}">Delete</button>
                </section>
            `;
        }

        function generateRequestsContent() {
            let content = ``;
            for (let i = 0; i < event.requests.length; i++) {
                const request = event.requests[i];
                for (let j = 0; j < request.act.length; j++) {
                    content += `
                        <div class="request_section">
                            <h6 class="description">${request.act[j].username}</h6>
                            <p class="request_description">${request.message}</p>
                            <label for="${i}_${j}_approve">Approve</label>
                            ${request.approved.truth ? `
                            <p class="body_text">Approved</p>
                            ` : `
                            <p class="body_text">Not approved</p>
                            `}
                        </div>
                    `;
                }
            }

            return event.requests.length > 0 ?  `
                <section id="requests_section">
                    <h4 class="title">Requests</h4>
                    <div id="description">
                        <h5 class="title">These are the requests of the event:</h5>
                        ${content}
                    </div>
                </section>
            ` : `<h4 class="title">You don't have any requests at the moment...</h4>`;
        }

        function generateEventContent() {
            switch (items.content) {
                case "BULLETINS": {
                    return generateBulletinContent(event.bulletins);
                }
                case "ALBUMS": {
                    return generateAlbumContainers(event.albums);
                }
                case "EDITING": {
                    return generateEditingContent();
                }
                case "GIGS": {
                    return generateGigContainers();
                }
                case "REQUESTS": {
                    return generateRequestsContent();
                }
                case "PARTICIPATIONS": {
                    let participations = {};
                    for (let i = 0; i < event.participations.length; i++)
                        participations += event.participations[i];

                    return participations !== undefined && participations.length > 0 ?
                        userContainers(participations) : `<h2>There aren't any participations yet...</h2>`;
                }
                default: {
                    return generateBulletinContent(event.bulletins);
                }
            }
        }

        async function changeEventContent(content) {
            await renderEvent({
                id: items.id,
                event: event,
                doFetch: false,
                content: content
            });
        }

        function userIsEditor() {
            for (let i = 0; i < user.events; i++)
                if (user.primaryId === event.venue.primaryId)
                    return true;
            return false;
        }

        function decideParticipation(choice) {
            participation.type = choice;
            return participation;
        }

        document.getElementById("main_content").innerHTML = `
            <section id="event_header_section">
                <div id="cover_image_container">
                    <div class="wrapper">
                        ${await generateImage({
                            endpoint: event.albums[0].items[1].endpoint,
                            class: "cover_image"
                        })}
                    </div>
                </div>
                <section id="event_header_detail_section">
                    ${await generateImage({
                        endpoint: event.albums[0].items[0].endpoint,
                        class: "profile_image"
                    })}
                    <div>
                        <div id="event_header_titles">
                            <h2 id="event_title" class="title">${event.title}</h2>
                            <h3 id="event_venue_title" class="descritpion">${event.venue.username}</h3>
                        </div>
                        <div id="event_header_links">
                            <a onclick="${await changeEventContent("BULLETINS")}">
                                <p class="header_link_title">Bulletins</p>
                            </a>
                            <a onclick="${await changeEventContent("ALBUMS")}">
                                <p class="header_link_title">Albums</p>
                            </a>
                            ${userIsEditor() ? `
                            <a onclick="${await changeEventContent("EDITING")}">
                                <p class="header_link_title">Editing</p>
                            </a>
                            ` : ``}
                            <a onclick="${await changeEventContent("GIGS")}">
                                <p class="header_link_title">Gigs</p>
                            </a>
                            ${userIsEditor() ? `
                            <a onclick="${await changeEventContent("REQUESTS")}">
                                <p class="header_link_title">Requests</p>
                            </a>
                            ` : ``}
                            <a onclick="${await changeEventContent("PARTICIPATIONS")}">
                                <p class="header_link_title">Participations</p>
                            </a>
                        </div>
                        <div id="event_header_right_side">
                            <div id="participation_request_message"></div>
                            <select id="participation_selector">
                                <option onclick="changeParticipation(${decideParticipation(participation.type)})">${participation.type}</option>
                                ${participation.type !== "ACCEPTED" ? `
                                <option onclick="changeParticipation(${decideParticipation("ACCEPTED")})">Accepted</option>
                                ` : ``}
                                ${participation.type !== "IN_DOUBT" ? `
                                <option onclick="changeParticipation(${decideParticipation("IN_DOUBT")})">In doubt</option>
                                ` : ``}
                                ${participation.type !== "CANCELLED" ? `
                                <option onclick="changeParticipation(${decideParticipation("CANCELLED")})">Cancelled</option>
                                ` : ``}
                                ${participation.type !== "INVITED" ? `
                                <option onclick="changeParticipation(${decideParticipation("INVITED")})">Invited</option>
                                ` : ``}
                            </select>
                        </div>
                    </div>
                </section>
            </section>
            <section id="event_detail_section">
                ${event.cancelled.truth ? `<h4 class="description">CANCELLED</h4>` : ``}
                ${event.sold_out.truth ? `<h4 class="description">SOLD OUT</h4>` : ``}
                ${event.voluntary.truth ? `<p class="body_text">Voluntary</p>` : ``}
                <table>
                    <tr>
                        <th>Open doors:</th>
                        <th>Start:</th>
                        <th>End:</th>
                        <th>Length:</th>
                        <th>Description:</th>
                        <th>Location:</th>
                        <th>Price:</th>
                        <th>Tickets:</th>
                        <th>Email:</th>
                        <th>Phone:</th>
                        <th>Address:</th>
                        <th>Country:</th>
                    </tr>
                    <tr>
                        <td>${event.openDoors.toLocaleString()}</td>
                        <td>${event.start.toLocaleString()}</td>
                        <td>${event.end.toLocaleString()}</td>
                        <td>${event.length}</td>
                        <td>${event.description}</td>
                        <td><a href="https://www.google.com/maps/place/${event.location}/">${event.location}</a></td>
                        <td>${event.price}</td>
                        <td><a href="${event.ticketsURL}">${event.ticketsURL}</a></td>
                        <td>${event.contactInfo.email}</td>
                        <td>${event.contactInfo.phone.numbers}</td>
                        <td>${event.contactInfo.address.street}, ${event.contactInfo.address.floor}. ${event.contactInfo.address.postal} ${event.contactInfo.address.city}</td>
                        <td>${event.contactInfo.country.title}</td>
                    </tr>
                </table>
            </section>
            <section id="event_content_section">
                ${generateEventContent()}
            </section>
        `;
    }
}