async function editUser() {
    const username = document.getElementById("username").value,
        description = document.getElementById("description").value,
        firstname = document.getElementById("firstname").value,
        lastname = document.getElementById("lastname").value,
        email = document.getElementById("email").value,
        number = document.getElementById("phone_number").value,
        isMobile = document.getElementById("is_mobile").value,
        city = document.getElementById("city").value,
        street = document.getElementById("city").value,
        floor = document.getElementById("floor").value,
        postal = document.getElementById("postal").value,
        countryTitle = document.getElementById("country").value,
        location = document.getElementById("location").value,
        size = document.getElementById("size").value,
        confirmationPassword = document.getElementById("confirmation_password").value,
        newPassword = document.getElementById("new_password").value;

    const id = parseInt(localStorage.getItem("user_id"));
    const user = {
        _id: id,
        _username: username,
        _firstname: firstname,
        _lastname: lastname,
        _description: description,
        _contactInfo: {
            _email: email,
            _phone: {
                _country: {
                    _title: countryTitle,
                    _indexes: localStorage.getItem("user_" + id + "_phone_country_indexes"),
                    _firstDigits: localStorage.getItem("user_" + id + "_phone_number_digits")
                },
                _numbers: number,
                _isMobile: isMobile
            },
            _address: {
                _city: city,
                _street: street,
                _floor: floor,
                _postal: postal
            },
            _country: {
                _title: countryTitle,
                _indexes: localStorage.getItem("user_" + id + "_phone_country_indexes"),
                _firstDigits: localStorage.getItem("user_" + id + "_phone_number_digits")
            }
        },
        _albums: getAlbums({id: "user_" + id}),
        _ratings: getRatings({id: id}),
        _events: getEvents({id: "user_" + id}),
        _chatRooms: getChatRooms({id: "user_" + id}),
        _subscription: {
            _type: localStorage.getItem("subscription_type"),
            _status: localStorage.getItem("subscription_status"),
            _price: parseFloat(localStorage.getItem("subscription_price")),
            _offer: {
                _expires: localStorage.getItem("subscription_offer_expires"),
                _type: localStorage.getItem("subscription_offer_type"),
                _effect: localStorage.getItem("subscription_offer_effect"),
            },
            _cardId: parseInt(localStorage.getItem("subscription_card_id"))
        },
        _bulletins: getBulletins({id: "user_" + id}),
        _idols: getIdols({id: "user_" + id}),
        _fans: getFans({id: "user_" + id}),
        _gigs: getGigs({id: "user_" + id}),
        _bands: getBands({id: "user_" + id}),
        _members: getMembers({id: "user_" + id}),
        _requests: getRequests({id: "user_" + id}),
        _runner: localStorage.getItem("runner"),
        _location: location,
        _size: size,
        _timestamp: localStorage.getItem("timestamp")
    };

    const response = await (await (fetch(apiUserEditURL({
        username: localStorage.getItem("username"),
        confirmationPassword: confirmationPassword,
        newPassword: newPassword !== undefined || newPassword !== "" ? newPassword : confirmationPassword
    }), {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }))).json();

    if (response.element !== undefined)
        saveUser(response);
    else if (response.error)
        document.getElementById("editing_message").innerText = response.message;
    else
        document.getElementById("editing_message").innerText = "Something went wrong...";
}

async function approveRequest(request) {
    request.approved = request.approved === "TRUE" ? "FALSE" : "TRUE";
    request.approved = !request;
    let event = request.event;
    for (let i = 0; i < event.requests.length; i++) {
        if (event.requests.primaryId === request.primaryId && event.requests.secondaryId === request.secondaryId) {
            event.requests[i] = request;
            break;
        }
    }
    const response = await (await fetch(apiEventUpdate(),{
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    }));

    if (!response.error)
        await updateSession();
    else
        document.getElementById("request_message").innerText = response.message === undefined ?
            "Something went wrong..." : response.message;
}

async function changeParticipation(participation) {
    const response = await (await fetch(apiParticipationUpsert(),{
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([participation])
    }));

    if (!response.error)
        await updateSession();
    else
        document.getElementById("participation_request_message").innerText = response.message === undefined ?
            "Something went wrong..." : response.message;
}

async function editEvent(id) {
    const title = document.getElementById("title").value,
        description = document.getElementById("description").value,
        openDoors = document.getElementById("open_doors").value,
        price = document.getElementById("price").value,
        ticketsURL = document.getElementById("tickets_url").value,
        email = document.getElementById("email").value,
        number = document.getElementById("phone_number").value,
        isMobile = document.getElementById("is_mobile").value,
        city = document.getElementById("city").value,
        street = document.getElementById("city").value,
        floor = document.getElementById("floor").value,
        postal = document.getElementById("postal").value,
        countryTitle = document.getElementById("country").value,
        location = document.getElementById("location").value,
        size = document.getElementById("size").value,
        isPublic = booleanToPlato(document.getElementById("public").value);

    //TODO Country details along rest of other event values
    const event = {
        _id: id,
        _title: title,
        _openDoors: openDoors,
        _price: price,
        _ticketsURL: ticketsURL,
        _description: description,
        _public: isPublic,
        _contactInfo: {
            _email: email,
            _phone: {
                _country: {
                    _title: countryTitle,
                    _indexes: localStorage.getItem("user_" + id + "_phone_country_indexes"),
                    _firstDigits: localStorage.getItem("user_" + id + "_phone_number_digits")
                },
                _numbers: number,
                _isMobile: isMobile
            },
            _address: {
                _city: city,
                _street: street,
                _floor: floor,
                _postal: postal
            },
            _country: {
                _title: countryTitle,
                _indexes: localStorage.getItem("user_" + id + "_phone_country_indexes"),
                _firstDigits: localStorage.getItem("user_" + id + "_phone_number_digits")
            }
        },
        _requests: getRequests({id: "user_" + id}),
        _location: location,
        _size: size
    };

    const response = await (await (fetch(apiEventUpdate(), {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    }))).json();

    if (response.error)
        document.getElementById("editing_message").innerText = response.message;
    else
        document.getElementById("editing_message").innerText = "Something went wrong...";
}

async function addGig(event) {
    const act = [(await (await fetch(apiUserGetURL(document.getElementById("act_id")).value,{
        method: `POST`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }}))).element],
        start = document.getElementById("gig_start").value,
        end = document.getElementById("gig_end").value;

    event.gigs.push({
        _act: act,
        _start: start,
        _end: end
    });
    const response = await (await fetch(apiEventUpdate(),{
        method: `POST`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    }));

    if (!response.error)
        await updateSession();
    else
        document.getElementById("gig_response_message").innerText = response.message === undefined ?
            "Something went wrong..." : response.message;
}

async function deleteEvent(id) {
    const response = await (await fetch(apiEventDelete(id),{
        method: `DELETE`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }));

    if (response.element)
        await renderFrontpage("Delete was a success!");
    else
        document.getElementById("event_delete_response_message").innerText =
            response.message === undefined ? "Something went wrong..." : response.message;
}

async function deleteUser(id) {
    const response = await (await fetch(apiUserDelete(id),{
        method: `DELETE`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }));

    if (response.element)
        await renderFrontpage("Delete was a success!");
    else
        document.getElementById("user_delete_response_message").innerText =
            response.message === undefined ? "Something went wrong..." : response.message;
}

async function createEvent() {
    const title = document.getElementById("title").value,
        description = document.getElementById("description").value,
        openDoors = document.getElementById("open_doors").value,
        price = document.getElementById("price").value,
        ticketsURL = document.getElementById("tickets_url").value,
        email = document.getElementById("email").value,
        number = document.getElementById("phone_number").value,
        isMobile = document.getElementById("is_mobile").value,
        city = document.getElementById("city").value,
        street = document.getElementById("city").value,
        floor = document.getElementById("floor").value,
        postal = document.getElementById("postal").value,
        countryTitle = document.getElementById("country").value,
        location = document.getElementById("location").value,
        size = document.getElementById("size").value,
        isPublic = booleanToPlato(document.getElementById("public").value);

    //TODO Country details along rest of other event values
    const event = {
        _id: id,
        _title: title,
        _openDoors: openDoors,
        _price: price,
        _ticketsURL: ticketsURL,
        _description: description,
        _public: isPublic,
        _contactInfo: {
            _email: email,
            _phone: {
                _country: {
                    _title: countryTitle,
                    _indexes: localStorage.getItem("user_" + id + "_phone_country_indexes"),
                    _firstDigits: localStorage.getItem("user_" + id + "_phone_number_digits")
                },
                _numbers: number,
                _isMobile: isMobile
            },
            _address: {
                _city: city,
                _street: street,
                _floor: floor,
                _postal: postal
            },
            _country: {
                _title: countryTitle,
                _indexes: localStorage.getItem("user_" + id + "_phone_country_indexes"),
                _firstDigits: localStorage.getItem("user_" + id + "_phone_number_digits")
            }
        },
        _requests: getRequests({id: "user_" + id}),
        _location: location,
        _size: size
    };

    const response = await (await (fetch(apiEventCreate, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    }))).json();

    if (!response.error) {
        window.location.href = eventURL(response.element.primaryId);
        await renderMain();
    }
    else {
        document.getElementById("response_message").innerText =
            response.message === undefined ? "Something went wrong" : response.message;
    }
}

async function follow(users) {
    const response = await (await fetch(apiUserFollowURL,{
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(users)
    }));

    await renderUser(users[1].primaryId);
}

async function unfollow(users) {
    const response = await (await fetch(apiUserUnfollowURL,{
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(users)
    }));

    await renderUser(users[1].primaryId);
}