function saveUser(user) {
    if (userIsLoggedIn()) {
        const id = user._primaryId;

        localStorage.setItem("user_id",id);
        localStorage.setItem("username",user._username);
        if (user._firstName !== undefined)
            localStorage.setItem("firstname",user._firstName);
        if (user._fullName !== undefined)
            localStorage.setItem("fullname", user._fullName);
        if (user._lastName !== undefined)
            localStorage.setItem("lastname",user._lastName);
        localStorage.setItem("description",user._description);
        localStorage.setItem("authority",user._authority);

        saveContactInformation({
            info: user._contactInfo,
            id: "user_" + id,
        });
        saveAlbums({
            albums: user._albums._data,
            id: "user_" + id
        });
        if (user._ratings._data !== undefined)
            saveRatings(user._ratings._data);
        saveEvents({
            events: user._events._data,
            id: "user_" + id
        });
        saveChatRooms({
            chatRooms: user._chatRooms._data,
            id: "user_" + id
        });
        saveSubscription(user._subscription);
        if (user._bulletins._data !== undefined) {
            saveBulletins({
                bulletins: user._bulletins._data,
                id: "user_" + id
            });
        }
        if (user._idols._data !== undefined) {
            saveIdols({
                idols: user._idols._data,
                id: "user_" + id
            });
        }
        if (user._fans._data !== undefined) {
            saveFans({
                fans: user._fans._data,
                id: "user_" + id
            });
        }
        if (user._gigs._data !== undefined) {
            saveGigs({
                gigs: user._gigs._data,
                id: "user_" + id
            });
        }
        if (user._bands._data !== undefined) {
            saveBands({
                bands: user._bands._data,
                id: "user_" + id
            });
        }

        localStorage.setItem("runner",
            (user._runner !== undefined ? user._runner :
                user._gearDescription !== undefined ? user._gearDescription : undefined));

        if (user._requests._data !== undefined)
            saveRequests(user._requests._data);
        if (user._members._data !== undefined) {
            saveMembers({
                members: user._members._data,
                id: "user_" + id
            });
        }

        localStorage.setItem("location", (user._location !== undefined ? user._location : undefined));
        localStorage.setItem("size", (user._size !== undefined ? user._size : undefined));
        localStorage.setItem("timestamp",user._timestamp);

        return getUser();
    }
    return undefined;
}

function saveContactInformation(item) {
    const index = (item.index !== undefined ? "_" + item.index : "");
    function generateKey(content) { return item.id + content + index; }

    localStorage.setItem(generateKey("_email"), item._email);
    localStorage.setItem(generateKey("_phone_country_title"), item._phone._country._title);
    localStorage.setItem(generateKey("_phone_country_indexes"), item._phone._country._indexes);
    localStorage.setItem(generateKey("_phone_number_digits"), item._phone._country._firstPhoneNumberDigits);
    localStorage.setItem(generateKey("_phone_numbers"), item._numbers);
    localStorage.setItem(generateKey("_phone_is_mobile"), item._mobile);
    localStorage.setItem(generateKey("_street"), item._street);
    localStorage.setItem(generateKey("_floor"), item._floor);
    localStorage.setItem(generateKey("_postal"), item._postal);
    localStorage.setItem(generateKey("_city"), item._city);
    localStorage.setItem(generateKey("_country_title"), item._country._title);
    localStorage.setItem(generateKey("_country_indexes"), item._country._indexes);
    localStorage.setItem(generateKey("_country_number_digits"), item._country._firstPhoneNumberDigits);
}

function saveAlbums(item) {
    const albums = item.albums;

    for (let i = 0; i < albums.length; i++) {
        function generateKey(content) {
            return item.id + content + (item.index !== undefined ? item.index + "_" + i : i);
        }

        localStorage.setItem(generateKey("_album_id_"), album._primaryId);
        localStorage.setItem(generateKey("_album_title_"), album._title);
        saveAlbumItems({
            album: album,
            id: item.id + "_album",
            index: i
        });
        savePrimitiveUser({
            user: album._author,
            id: item.id + "_album",
            index: i
        });
        localStorage.setItem(generateKey("_album_timestamp_"),album._timestamp);
    }
    localStorage.setItem(item.id + "_album_amount", (albums.length).toString());
}

function saveAlbumItems(item) {
    const album = item.album;

    for (let i = 0; i < album._items.length; i++) {
        const item = album._items._data[i],
            index = item.index + "_" + i;
        saveTags({
            tag: item._tags._data,
            id: item.id + "_album",
            index: i
        });
        localStorage.setItem(item.id + "_item_endpoint_" + index, item._endpoint);
    }
    localStorage.setItem(item.id + "_item_amount_" + item.index, (album._items._data.length).toString());
}

function saveTags(item) {
    for (let i = 0; i < item.length; i++)
        savePrimitiveUser({
            user: item.tag._author,
            id: item.id + "_tag",
            index: i
        });
    localStorage.setItem(item.id + "_tags_length_" + item.index, (item._tags._data.length).toString())
}

function saveRatings(ratings) {
    for (let i = 0; i < ratings.length; i++) {
        const rating = ratings[i];

        localStorage.setItem("rating_value_" + i, rating._value);
        localStorage.setItem("rating_comment_" + i, rating._comment);
        savePrimitiveUser({
            user: rating._judge,
            kind: "judge",
            index: i
        });
    }
    localStorage.setItem("rating_amount", (ratings.length).toString());
}

function saveEvents(item) {
    const events = item.events;

    for (let i = 0; i < events.length; i++) {
        const event = events[i],
            id = item.id + "_event",
            index = item.index + "_" + i;
        function generateKey(content) {
            return id + content + index;
        }
        localStorage.setItem(generateKey("_open_doors_"), event._openDoors);
        localStorage.setItem(generateKey("_start_"), event._start);
        localStorage.setItem(generateKey("_end_"), event._end);
        localStorage.setItem(generateKey("_length_"), event._length);
        localStorage.setItem(generateKey("_description_"), event._description);
        localStorage.setItem(generateKey("_is_voluntary_"), event._voluntary._argument);
        localStorage.setItem(generateKey("_is_public_"), event._public._argument);
        localStorage.setItem(generateKey("_is_cancelled_"), event._cancelled._argument);
        localStorage.setItem(generateKey("_is_sold_out_"), event._soldOut._argument);
        localStorage.setItem(generateKey("_location_"), event._location);
        localStorage.setItem(generateKey("_price_"), event._price);
        localStorage.setItem(generateKey("_tickets_url_"), event._ticketsURL);
        saveContactInformation({
            info: event._contactInfo,
            id: id,
            index: i
        });
        saveGigs({
            gigs: event._gigs._data,
            id: id,
            index: i
        });
        savePrimitiveUser({
            user: event._venue,
            type: "venue",
            kind: "event",
            id: id,
            index: i
        });
        saveParticipations({
            participations: event._participations,
            event: event,
            id: id,
            index: i
        });
        saveBulletins({
            bulletins: event._bulletins._data,
            id: id,
            index: i
        });
        saveAlbums({
            albums: event._albums._data,
            id: id,
            index: i
        });
    }
    localStorage.setItem(item.id + "_event_amount", events.length);
}

function saveParticipations(item) {
    const participations = item.participations;

    for (let i = 0; i < participations.length; i++) {
        const participation = participations[i],
            id = item.id,
            index = item.index + "_" + i;
        function generateKey(content) {
            return id + content + index;
        }

        savePrimitiveUser({
            user: participation._participant,
            type: "participant",
            kind: "participation",
            index: item.index,
            id: id
        });

        localStorage.setItem(generateKey("_id_"), item.event._primaryId);
        localStorage.setItem(generateKey("_open_doors_"), item.event._openDoors);
        localStorage.setItem(generateKey("_start_"), item.event._start);
        localStorage.setItem(generateKey("_end_"), item.event._end);
        localStorage.setItem(generateKey("_length_"), item.event._length);
        localStorage.setItem(generateKey("_description_"), item.event._description);
        localStorage.setItem(generateKey("_is_voluntary_"), item.event._voluntary._truth);
        localStorage.setItem(generateKey("_is_public_"), item.event._public._truth);
        localStorage.setItem(generateKey("_is_cancelled_"), item.event._cancelled._truth);
        localStorage.setItem(generateKey("_is_sold_out_"), item.event._soldOut._truth);
        localStorage.setItem(generateKey("_location_"), item.event._location);
        localStorage.setItem(generateKey("_price_"), item.event._price);
        localStorage.setItem(generateKey("_tickets_url_"), item.event._ticketsURL);
        localStorage.setItem(generateKey("_type_"), participation._type);
    }
    localStorage.setItem(item.id + "_participations_amount",participations.length);
}

function saveChatRooms(item) {
    const chatRooms = item.chatRooms;

    for (let i = 0; i < chatRooms; i++) {
        const chatRoom = chatRooms[i],
            id = item.id,
            index = item.index + "_" + i;
        function generateKey(content) { return id + content + index; }

        localStorage.setItem(generateKey("_chat_room_id_"), chatRoom._primaryId);
        localStorage.setItem(generateKey("_chat_room_title_"), chatRoom._title)
        saveMails({
            mails: chatRoom._mails._data,
            id: item.id + "_chat_room",
            index: i
        });
        saveChatters({
            chatters: chatRoom._chatters._data,
            id: item.id + "_chat_room",
            index: i
        });
        savePrimitiveUser({
            user: chatRoom._responsible,
            id: item.id + "_chat_room",
            kind: "responsible",
            index: i
        });
        localStorage.setItem(generateKey("_chat_room_answering_time_"), chatRoom._answeringTime);
        localStorage.setItem(generateKey("_chat_room_is_answered_"), chatRoom._answered);
    }
    localStorage.setItem(item.id + "_chat_room_amount_" + (item.index !== undefined ? item.index : ""), chatRooms.length);
}

function saveMails(item) {
    const mails = item.mails;

    for (let i = 0; i < mails.length; i++) {
        const mail = mails[i],
            id = item.id,
            index = (item.index !== undefined ? item.index + "_" + i : "");
        function generateKey(content) { return id + content + index; }

        localStorage.setItem(generateKey("_mail_id_"), mail._primaryId);
        savePrimitiveUser({
            user: mail._author,
            id: item.id + "_mail",
            kind: "author",
            index: i
        });
        localStorage.setItem(generateKey("_mail_content_"), mail._content);
        localStorage.setItem(generateKey("_mail_is_sent_"), mail._sent);
        localStorage.setItem(generateKey("_mail_is_edited_"), mail._edited._argument);
        localStorage.setItem(generateKey("_mail_is_public_"), mail._public);
        localStorage.setItem(generateKey("_timestamp_"), mail._timestamp);
    }
    localStorage.setItem(item.id + "_mail_amount_" + item.index, mails.length);
}

function saveChatters(item) {
    const chatters = item.chatters;

    for (let i = 0; i < chatters.length; i++) {
        const chatter = chatters[i];
        savePrimitiveUser({
            user: chatter,
            id: item.id,
            kind: "chatter",
            index: i
        });
    }
    localStorage.setItem(item.id + "_chatter_amount" + (item.index !== undefined ? "_" + item.index : ""), chatters.length);
}

function saveSubscription(subscription) {
    localStorage.setItem("subscription_type", subscription._type);
    localStorage.setItem("subscription_status", subscription._status);
    localStorage.setItem("subscription_price", subscription._price);
    localStorage.setItem("subscription_offer_expires", subscription._offer._expires);
    localStorage.setItem("subscription_offer_type", subscription._offer._type);
    localStorage.setItem("subscription_offer_effect", subscription._offer._effect);
    localStorage.setItem("subscription_card_id", (subscription._cardId).toString());
}

function saveBulletins(item) {
    const bulletins = item.bulletins;

    for (let i = 0; i < bulletins.length; i++) {
        const bulletin = bulletins[i],
            id = item.id,
            index = (item.index !== undefined ? item.index + "_" : "") + i;
        function generateKey(content) { return id + content + index; }

        localStorage.setItem(generateKey("_bulletin_id_"), bulletin._primaryId);
        savePrimitiveUser({
            user: bulletin._author,
            id: item.id + "_bulletin",
            kind: "author",
            index: i
        });
        localStorage.setItem(generateKey("_bulletin_content_"), bulletin._content);
        localStorage.setItem(generateKey("_bulletin_is_sent_"), (bulletin._sent).toString());
        localStorage.setItem(generateKey("_bulletin_is_edited_"), bulletin._edited._argument);
        localStorage.setItem(generateKey("_bulletin_is_public_"), (bulletin._public).toString())
    }
    localStorage.setItem(item.id + "_bulletin_amount", (bulletins.length).toString());
}

function saveIdols(item) {
    const idols = item.idols;

    for (let i = 0; i < idols.length; i++) {
        savePrimitiveUser({
            user: idols[i],
            kind: "idol",
            id: item.id,
            index: i
        })
    }
    localStorage.setItem(item.id + "_idol_amount", idols.length);
}

function saveFans(item) {
    const fans = item.fans;

    for (let i = 0; i < fans.length; i++) {
        savePrimitiveUser({
            user: fans[i],
            kind: "fan",
            id: item.id,
            index: i
        });
    }
    localStorage.setItem(item.id + "_fan_amount", fans.length);
}

function saveGigs(item) {
    const gigs = item.gigs;

    for (let i = 0; i < gigs.length; i++) {
        const gig = gigs[i];
        const id = item.id + "_gig_" + gig._primaryId,
            index = i;
        function generateKey(content) {
            return id + content + index;
        }

        localStorage.setItem(generateKey("_event_id"), gig._event._primaryId);
        saveAct({
            act: gig._act,
            id: id,
            index: index
        });
        localStorage.setItem(generateKey("_start_"), gig._start);
        localStorage.setItem(generateKey("_end_"), gig._end);
    }
    localStorage.setItem(item.id + "_gigs_amount_" + item.index, gigs.length);
}

function saveAct(item) {
    const act = item.act;

    for (let i = 0; i < act.length; i++) {
        savePrimitiveUser({
            user: act[i],
            kind: "performer",
            id: item.id + "_act_" + act[i]._primaryId,
            index: i
        });
    }
    localStorage.setItem(item.id + "_acts_" + item.index, act.length);
}

function saveBands(item) {
    const bands = item.bands;

    for (let i = 0; i < bands.length; i++) {
        const id = item.id + "_band_" + bands[i]._primaryId;
        localStorage.setItem(item.id + "_band_id_" + i, bands[i]._primaryId);
        savePrimitiveUser({
            user: bands[i],
            id: id,
            index: i
        });
        saveMembers({
            members: bands[i]._members._data,
            id: id,
            index: i
        });
    }
    localStorage.setItem(item.id + "_band_amount", bands.length);
}

function saveRequests(requests) {
    for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        localStorage.setItem("request_primary_id_" + i, request._primaryId);
        localStorage.setItem("request_secondary_id_" + i, request._secondaryId);
        saveEvents({
            events: request._event,
            id: "request_" + request._primaryId + "_" + request._secondaryId,
            index: i
        });
        localStorage.setItem("request_approved_" + i, request._approved._argument);
        localStorage.setItem("request_message_" + i, request._message);
    }
    localStorage.setItem("request_amount",requests.length);
}

function saveMembers(item) {
    const members = item.members;

    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        localStorage.setItem(item.id + "_member_id_" + (item.index !== undefined ? item.index + "_" + i : i),
            member._primaryId)
        savePrimitiveUser({
            user: member,
            type: "artist",
            kind: (item.index === undefined ? "of_this_user" : ""),
            id: item.id + "_" + member._primaryId,
            index: item.index + "_" + i
        });
    }
    localStorage.setItem(item.id + "_member_amount", members.length);
}

function savePrimitiveUser(item) {
    const user = item.user,
        kind = (item.kind === undefined ? "" : item.kind + "_"),
        type = (item.type === undefined ? "" : item.type + "_"),
        index = (item.index === undefined ? "" : item.index),
        id = (item.id === undefined ? "" : item.id + "_");

    localStorage.setItem(id + "id_" + kind + type + index, user._primaryId);
    localStorage.setItem(id + "username_" + kind + type + index, user._username);
    if (user._firstName !== undefined)
        localStorage.setItem(id + "firstname_" + kind + type + index, user._firstName);
    if (user._fullName !== undefined)
        localStorage.setItem(id + "fullname" + kind + type + index, user._fullName);
    if (user._lastName !== undefined)
        localStorage.setItem(id + "lastname_" + kind + type + index, user._lastName);
    localStorage.setItem(id + "description_" + kind + type + index, user._description);
}