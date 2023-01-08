function getUser() {
    if (userIsLoggedIn()) {
        const id = parseInt(localStorage.getItem("user_id"));
        return {
            id: id,
            username: localStorage.getItem("username"),
            firstname: localStorage.getItem("firstname"),
            fullname: localStorage.getItem("fullname"),
            lastname: localStorage.getItem("lastname"),
            description: localStorage.getItem("description"),
            authority: localStorage.getItem("authority"),
            contactInfo: getContactInformation({ id: "user_" + id }),
            albums: getAlbums({ id: "user_" + id }),
            ratings: getRatings({ id: id }),
            events: getEvents({ id: "user_" + id }),
            chatRooms: getChatRooms({ id: "user_" + id }),
            subscription: {
                type: localStorage.getItem("subscription_type"),
                status: localStorage.getItem("subscription_status"),
                price: parseFloat(localStorage.getItem("subscription_price")),
                offer: {
                    expires: localStorage.getItem("subscription_offer_expires"),
                    type: localStorage.getItem("subscription_offer_type"),
                    effect: localStorage.getItem("subscription_offer_effect"),
                },
                cardId: parseInt(localStorage.getItem("subscription_card_id"))
            },
            bulletins: getBulletins({ id: "user_" + id }),
            idols: getIdols({ id: "user_" + id }),
            fans: getFans({ id: "user_" + id }),
            gigs: getGigs({ id: "user_" + id }),
            bands: getBands({ id: "user_" + id }),
            members: getMembers({ id: "user_" + id }),
            requests: getRequests({ id: "user_" + id }),
            runner: localStorage.getItem("runner"),
            location: localStorage.getItem("location"),
            size: parseInt(localStorage.getItem("size")),
            timestamp: localStorage.getItem("timestamp")
        };
    }
    return undefined;
}

function getContactInformation(item) {
    const index = (item.index !== undefined ? "_" + item.index : "");
    function generateKey(content) { return item.id + content + index; }

    return {
        email: localStorage.getItem(generateKey("_email")),
        phone: {
            country: {
                title: localStorage.getItem(generateKey("_phone_country_title")),
                indexes: localStorage.getItem(generateKey("_phone_country_indexes"))
            },
            firstDigits: localStorage.getItem(generateKey("_phone_number_digits")),
            numbers: localStorage.getItem(generateKey("_phone_numbers")),
            isMobile: localStorage.getItem(generateKey("_phone_is_mobile")),
        },
        address: {
            street: localStorage.getItem(generateKey("_street")),
            floor: localStorage.getItem(generateKey("_floor")),
            postal: localStorage.getItem(generateKey("_postal")),
            city: localStorage.getItem(generateKey("_city"))
        },
        country: {
            title: localStorage.getItem(generateKey("_country_title")),
            indexes: localStorage.getItem(generateKey("_country_indexes")),
            firstDigits: localStorage.getItem("_country_number_digits")
        }
    }
}

function getAlbums(item) {
    let albums = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_album_amount")); i++) {
        function generateKey(content) {
            return item.id + content + (item.index !== undefined ? item.index + "_" + i : i);
        }
        albums.push({
            id: localStorage.getItem(generateKey("_album_id_")),
            title: localStorage.getItem(generateKey("_album_title_")),
            items: getAlbumItems({
                id: item.id + "_album",
                index: i
            }),
            author: getPrimitiveUser({
                id: item.id + "_album",
                index: i
            }),
            timestamp: generateKey("_album_timestamp_")
        });
    }

    return albums;
}

function getAlbumItems(item) {
    let items = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_item_amount_" + item.index)); i++) {
        items.push({
            tags: getTags({
                id: item.id + "_album",
                index: i
            }),
            endpoint: localStorage.getItem(item.id + "_item_endpoint_" + item.index + "_" + i)
        });
    }

    return items;
}

function getTags(item) {
    let tags = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_tags_length_" + item.index)); i++) {
        tags.push(getPrimitiveUser({
            id: item.id + "_tag",
            index: i
        }));
    }

    return tags;
}

function getRatings() {
    let ratings = [];

    for (let i = 0; i < parseInt(localStorage.getItem("rating_amount")); i++) {
        ratings.push({
            value: localStorage.getItem("rating_value_" + i),
            comment: localStorage.getItem("rating_comment_" + i),
            judge: getPrimitiveUser({
                kind: "judge",
                index: i
            })
        });
    }

    return ratings;
}

function getEvents(item) {
    let events = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_event_amount")); i++) {
        const id = item.id + "_event",
            index = item.index + "_" + i;
        function generateKey(content) {
            return id + content + index;
        }
        events.push({
            openDoors: localStorage.getItem(generateKey("_open_doors_")),
            start: localStorage.getItem(generateKey("_start_")),
            end: localStorage.getItem(generateKey("_end_")),
            length: localStorage.getItem(generateKey("_length_")),
            description: localStorage.getItem(generateKey("_description_")),
            isVoluntary: localStorage.getItem(generateKey("_is_voluntary_")),
            is_public: localStorage.getItem(generateKey("_is_public_")),
            is_cancelled: localStorage.getItem(generateKey("_is_cancelled_")),
            is_sold_out: localStorage.getItem(generateKey("_is_sold_out_")),
            location: localStorage.getItem(generateKey("_location_")),
            price: localStorage.getItem(generateKey("_price_")),
            ticketsURL: localStorage.getItem(generateKey("_tickets_url_")),
            contactInformation: getContactInformation({
                id: id,
                index: i
            }),
            gigs: getGigs({
                id: id,
                index: i
            }),
            venue: getPrimitiveUser({
                type: "venue",
                kind: "event",
                id: id,
                index: i
            }),
            participations: getParticipations({
                id: id,
                index: i
            }),
            bulletins: getBulletins({
                id: id,
                index: i
            }),
            albums: getAlbums({
                id: id,
                index: i
            })
        });
    }

    return events;
}

function getGigs(item) {
    let gigs = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_gigs_amount_" + item.index)); i++) {
        const id = item.id + "_gig_" + gig._primaryId,
            index = i;
        function generateKey(content) {
            return id + content + index;
        }

        gigs.push({
            eventId: localStorage.getItem(generateKey("_event_id")),
            act: getAct({
                id: id,
                index: index
            }),
            start: localStorage.getItem(generateKey("_start_")),
            end: localStorage.getItem(generateKey("_end_"))
        });
    }

    return gigs;
}

function getAct(item) {
    let act = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_acts_" + item.index)); i++) {
        act.push(getPrimitiveUser({
            kind: "performer",
            id: item.id + "_act_" + act[i]._primaryId,
            index: i
        }));
    }

    return act;
}

function getParticipations(item) {
    let participations = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_participations_amount")); i++) {
        const id = item.id,
            index = item.index + "_" + i;
        function generateKey(content) {
            return id + content + index;
        }

        participations.push({
            user: getPrimitiveUser({
                type: "participant",
                kind: "participation",
                index: item.index,
                id: id
            }),
            event: {
                openDoors: localStorage.getItem(generateKey("_open_doors_")),
                start: localStorage.getItem(generateKey("_start_")),
                end: localStorage.getItem(generateKey("_end_")),
                length: localStorage.getItem(generateKey("_length_")),
                description: localStorage.getItem(generateKey("_description_")),
                isVoluntary: localStorage.getItem(generateKey("_is_voluntary_")),
                is_public: localStorage.getItem(generateKey("_is_public_")),
                is_cancelled: localStorage.getItem(generateKey("_is_cancelled_")),
                is_sold_out: localStorage.getItem(generateKey("_is_sold_out_")),
                location: localStorage.getItem(generateKey("_location_")),
                price: localStorage.getItem(generateKey("_price_")),
                ticketsURL: localStorage.getItem(generateKey("_tickets_url_"))
            },
            type: localStorage.getItem(generateKey("_type_"))
        });
    }

    return participations;
}

function getBulletins(item) {
    let bulletins = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_bulletin_amount")); i++) {
        const id = item.id,
            index = (item.index !== undefined ? item.index + "_" : "") + i;
        function generateKey(content) { return id + content + index; }

        bulletins.push({
            id: localStorage.getItem("_bulletin_id_"),
            author: getPrimitiveUser({
                id: item.id + "_bulletin",
                kind: "author",
                index: i
            }),
            content: localStorage.getItem(generateKey("_bulletin_content_")),
            isSent: localStorage.getItem(generateKey("_bulletin_is_sent_")),
            isEdited: localStorage.getItem(generateKey("_bulletin_is_edited_")),
            isPublic: localStorage.getItem(generateKey("_bulletin_is_public_"))
        });
    }

    return bulletins;
}

function getChatRooms(item) {
    let chatRooms = [];

    for (let i = 0; i < parseInt(localStorage.getItem(
        item.id + "_chat_room_amount_" + (item.index !== undefined ? item.index : ""))); i++) {
        const id = item.id,
            index = item.index + "_" + i;
        function generateKey(content) { return id + content + index; }

        chatRooms.push({
            id: localStorage.getItem(generateKey("_chat_room_id_")),
            title: localStorage.getItem(generateKey("_chat_room_title_")),
            mails: getMails({
                id: item.id + "_chat_room",
                index: i
            }),
            chatters: getChatters({
                id: item.id + "_chat_room",
                index: i
            }),
            responsible: getPrimitiveUser({
                id: item.id + "_chat_room",
                kind: "responsible",
                index: i
            }),
            answeringTime: localStorage.getItem(generateKey("_chat_room_answering_time_")),
            isAnswered: localStorage.getItem(generateKey("_chat_room_is_answered_"))
        })
    }

    return chatRooms;
}

function getMails(item) {
    let mails = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_mail_amount_" + item.index)); i++) {
        const id = item.id,
            index = (item.index !== undefined ? item.index + "_" + i : "");
        function generateKey(content) { return id + content + index; }

        mails.push({
            id: localStorage.getItem(generateKey("_mail_id_")),
            author: getPrimitiveUser({
                id: item.id + "_mail",
                kind: "author",
                index: i
            }),
            content: localStorage.getItem(generateKey("_mail_content_")),
            isSent: localStorage.getItem(generateKey("_mail_is_sent_")),
            isEdited: localStorage.getItem(generateKey("_mail_is_edited_")),
            isPublic: localStorage.getItem(generateKey("_mail_is_public_")),
            timestamp: localStorage.getItem(generateKey("_timestamp_"))
        });
    }

    return mails;
}

function getChatters(item) {
    let chatters = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_chatter_amount_" + item.index)); i++) {
        chatters.push(getPrimitiveUser({
            id: item.id,
            kind: "chatter",
            index: i
        }));
    }

    return chatters;
}

function getIdols(item) {
    let idols = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_fan_amount")); i++) {
        idols.push(getPrimitiveUser({
            kind: "idol",
            id: item.id,
            index: i
        }));
    }

    return idols;
}

function getFans(item) {
    let fans = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_fan_amount")); i++) {
        fans.push(getPrimitiveUser({
            kind: "fan",
            id: item.id,
            index: i
        }));
    }

    return fans;
}

function getBands(item) {
    let bands = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_band_amount")); i++) {
        const id = item.id + "_band_" + localStorage.getItem(item.id + "_band_id_" + i);
        bands.push({
            id: parseInt(localStorage.getItem(item.id + "_band_id_" + i)),
            band: getPrimitiveUser({
                id: id,
                index: i
            }),
            members: getMembers({
                id: id,
                index: i
            })
        });
    }

    return bands;
}

function getMembers(item) {
    let members = [];

    for (let i = 0; i < parseInt(localStorage.getItem(item.id + "_member_amount")); i++) {
        members.push(getPrimitiveUser({
            type: "artist",
            kind: (item.index === undefined ? "of_this_user" : ""),
            id: item.id + "_" + localStorage.getItem(
                item.id + "_member_id_" + (item.index !== undefined ? item.index + "_" + i : i)),
            index: item.index + "_" + i
        }));
    }

    return members;
}

function getRequests() {
    let requests = [];

    for (let i = 0; i < parseInt(localStorage.getItem("request_amount")); i++) {
        const primaryId = parseInt(localStorage.getItem("request_primary_id_" + i)),
            secondaryId = parseInt(localStorage.getItem("request_secondary_id_" + i));

        requests.push({
            primaryId: primaryId,
            secondaryId: secondaryId,
            events: getEvents({
                id: "request_" + primaryId + "_" + secondaryId,
                index: i
            }),
            approved: localStorage.getItem("request_approved_" + i),
            message: localStorage.getItem("request_message_" + i)
        });
    }

    return requests;
}

function getPrimitiveUser(item) {
    const kind = (item.kind === undefined ? "" : item.kind + "_"),
        type = (item.type === undefined ? "" : item.type + "_"),
        index = (item.index === undefined ? "" : item.index),
        id = (item.id === undefined ? "" : item.id + "_");

    return {
        id: parseInt(localStorage.getItem(id + "id_" + kind + type + index)),
        username: localStorage.getItem(id + "username_" + kind + type + index),
        firstname: localStorage.getItem(id + "firstname_" + kind + type + index),
        fullname: localStorage.getItem(id + "fullname" + kind + type + index),
        lastname: localStorage.getItem(id + "lastname_" + kind + type + index),
        description: localStorage.getItem(id + "description_" + kind + type + index)
    };
}