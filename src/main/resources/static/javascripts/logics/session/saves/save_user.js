function saveUser(user) {
    if (!userIsLoggedIn()) {
        const id = user.primaryId;

        localStorage.setItem("user_id",id);
        localStorage.setItem("username",user.username);
        if (user.firstName !== undefined)
            localStorage.setItem("firstname",user.firstName);
        if (user.fullName !== undefined)
            localStorage.setItem("fullname", user.fullName);
        if (user.lastName !== undefined)
            localStorage.setItem("lastname",user.lastName);
        localStorage.setItem("description",user.description);
        localStorage.setItem("authority",user.authority);

        saveContactInformation({
            info: user.contactInfo,
            id: "user_" + id,
        });
        saveAlbums({
            albums: user.albums,
            id: "user_" + id
        });
        if (user.ratings !== undefined)
            saveRatings(user.ratings);
        saveEvents({
            events: user.events,
            id: "user_" + id
        });
        saveChatRooms({
            chatRooms: user.chatRooms,
            id: "user_" + id
        });
        saveSubscription(user.subscription);
        if (user.bulletins !== undefined) {
            saveBulletins({
                bulletins: user.bulletins,
                id: "user_" + id
            });
        }
        if (user.idols !== undefined) {
            saveIdols({
                idols: user.idols,
                id: "user_" + id
            });
        }
        if (user.fans !== undefined) {
            saveFans({
                fans: user.fans,
                id: "user_" + id
            });
        }
        if (user.gigs !== undefined) {
            saveGigs({
                gigs: user.gigs,
                id: "user_" + id
            });
        }
        if (user.bands !== undefined) {
            saveBands({
                bands: user.bands,
                id: "user_" + id
            });
        }

        localStorage.setItem("runner",
            (user.runner !== undefined ? user.runner :
                user.gearDescription !== undefined ? user.gearDescription : undefined));

        if (user.requests !== undefined)
            saveRequests(user.requests);
        if (user.members !== undefined) {
            saveMembers({
                members: user.members,
                id: "user_" + id
            });
        }

        localStorage.setItem("location", (user.location !== undefined ? user.location : undefined));
        localStorage.setItem("size", (user.size !== undefined ? user.size : undefined));
        localStorage.setItem("timestamp",user.timestamp);

        localStorage.setItem("user_is_logged_in",user.primaryId);
        return getUser();
    }
    return undefined;
}

function saveContactInformation(item) {
    const index = (item.index !== undefined ? "_" + item.index : "");
    function generateKey(content) { return item.id + content + index; }

    localStorage.setItem(generateKey("_email"), item.info.email);
    localStorage.setItem(generateKey("_phone_country_title"), item.info.phone.country.title);
    localStorage.setItem(generateKey("_phone_country_indexes"), item.info.phone.country.indexes);
    localStorage.setItem(generateKey("_phone_number_digits"), item.info.phone.country.firstPhoneNumberDigits);
    localStorage.setItem(generateKey("_phone_numbers"), item.info.phone.numbers);
    localStorage.setItem(generateKey("_phone_is_mobile"), item.info.phone.mobile);
    localStorage.setItem(generateKey("_street"), item.info.address.street);
    localStorage.setItem(generateKey("_floor"), item.info.address.floor);
    localStorage.setItem(generateKey("_postal"), item.info.address.postal);
    localStorage.setItem(generateKey("_city"), item.info.address.city);
    localStorage.setItem(generateKey("_country_title"), item.info.country.title);
    localStorage.setItem(generateKey("_country_indexes"), item.info.country.indexes);
    localStorage.setItem(generateKey("_country_number_digits"), item.info.country.firstPhoneNumberDigits);
}

function saveAlbums(item) {
    const albums = item.albums;

    for (let i = 0; i < albums.length; i++) {
        function generateKey(content) {
            return item.id + content + (item.index !== undefined ? item.index + "_" + i : i);
        }

        localStorage.setItem(generateKey("_album_id_"), album.primaryId);
        localStorage.setItem(generateKey("_album_title_"), album.title);
        saveAlbumItems({
            album: album,
            id: item.id + "_album",
            index: i
        });
        savePrimitiveUser({
            user: album.author,
            id: item.id + "_album",
            index: i
        });
        localStorage.setItem(generateKey("_album_timestamp_"),album.timestamp);
    }
    localStorage.setItem(item.id + "_album_amount", (albums.length).toString());
}

function saveAlbumItems(item) {
    const album = item.album;

    for (let i = 0; i < album.items.length; i++) {
        const item = album.items[i],
            index = item.index + "_" + i;
        saveTags({
            tag: item.tags,
            id: item.id + "_album",
            index: i
        });
        localStorage.setItem(item.id + "_item_endpoint_" + index, item.endpoint);
    }
    localStorage.setItem(item.id + "_item_amount_" + item.index, (album.items.length).toString());
}

function saveTags(item) {
    for (let i = 0; i < item.length; i++)
        savePrimitiveUser({
            user: item.tag.author,
            id: item.id + "_tag",
            index: i
        });
    localStorage.setItem(item.id + "_tags_length_" + item.index, (item.tags.length).toString())
}

function saveRatings(ratings) {
    for (let i = 0; i < ratings.length; i++) {
        const rating = ratings[i];

        localStorage.setItem("rating_value_" + i, rating.value);
        localStorage.setItem("rating_comment_" + i, rating.comment);
        savePrimitiveUser({
            user: rating.judge,
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
        localStorage.setItem(generateKey("_open_doors_"), event.openDoors);
        localStorage.setItem(generateKey("_start_"), event.start);
        localStorage.setItem(generateKey("_end_"), event.end);
        localStorage.setItem(generateKey("_length_"), event.length);
        localStorage.setItem(generateKey("_description_"), event.description);
        localStorage.setItem(generateKey("_is_voluntary_"), event.voluntary);
        localStorage.setItem(generateKey("_is_public_"), event.public);
        localStorage.setItem(generateKey("_is_cancelled_"), event.cancelled);
        localStorage.setItem(generateKey("_is_sold_out_"), event.soldOut);
        localStorage.setItem(generateKey("_location_"), event.location);
        localStorage.setItem(generateKey("_price_"), event.price);
        localStorage.setItem(generateKey("_tickets_url_"), event.ticketsURL);
        saveContactInformation({
            info: event.contactInfo,
            id: id,
            index: i
        });
        saveGigs({
            gigs: event.gigs,
            id: id,
            index: i
        });
        savePrimitiveUser({
            user: event.venue,
            type: "venue",
            kind: "event",
            id: id,
            index: i
        });
        saveParticipations({
            participations: event.participations,
            event: event,
            id: id,
            index: i
        });
        saveBulletins({
            bulletins: event.bulletins,
            id: id,
            index: i
        });
        saveAlbums({
            albums: event.albums,
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
            user: participation.participant,
            type: "participant",
            kind: "participation",
            index: item.index,
            id: id
        });

        localStorage.setItem(generateKey("_id_"), item.event.primaryId);
        localStorage.setItem(generateKey("_open_doors_"), item.event.openDoors);
        localStorage.setItem(generateKey("_start_"), item.event.start);
        localStorage.setItem(generateKey("_end_"), item.event.end);
        localStorage.setItem(generateKey("_length_"), item.event.length);
        localStorage.setItem(generateKey("_description_"), item.event.description);
        localStorage.setItem(generateKey("_is_voluntary_"), item.event.voluntary.truth);
        localStorage.setItem(generateKey("_is_public_"), item.event.public.truth);
        localStorage.setItem(generateKey("_is_cancelled_"), item.event.cancelled.truth);
        localStorage.setItem(generateKey("_is_sold_out_"), item.event.soldOut.truth);
        localStorage.setItem(generateKey("_location_"), item.event.location);
        localStorage.setItem(generateKey("_price_"), item.event.price);
        localStorage.setItem(generateKey("_tickets_url_"), item.event.ticketsURL);
        localStorage.setItem(generateKey("_type_"), participation.type);
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

        localStorage.setItem(generateKey("_chat_room_id_"), chatRoom.primaryId);
        localStorage.setItem(generateKey("_chat_room_title_"), chatRoom.title)
        saveMails({
            mails: chatRoom.mails,
            id: item.id + "_chat_room",
            index: i
        });
        saveChatters({
            chatters: chatRoom.chatters,
            id: item.id + "_chat_room",
            index: i
        });
        savePrimitiveUser({
            user: chatRoom.responsible,
            id: item.id + "_chat_room",
            kind: "responsible",
            index: i
        });
        localStorage.setItem(generateKey("_chat_room_answering_time_"), chatRoom.answeringTime);
        localStorage.setItem(generateKey("_chat_room_is_answered_"), chatRoom.answered);
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

        localStorage.setItem(generateKey("_mail_id_"), mail.primaryId);
        savePrimitiveUser({
            user: mail.author,
            id: item.id + "_mail",
            kind: "author",
            index: i
        });
        localStorage.setItem(generateKey("_mail_content_"), mail.content);
        localStorage.setItem(generateKey("_mail_is_sent_"), mail.sent);
        localStorage.setItem(generateKey("_mail_is_edited_"), mail.edited);
        localStorage.setItem(generateKey("_mail_is_public_"), mail.public);
        localStorage.setItem(generateKey("_timestamp_"), mail.timestamp);
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
    localStorage.setItem("subscription_type", subscription.type);
    localStorage.setItem("subscription_status", subscription.status);
    localStorage.setItem("subscription_price", subscription.price);
    localStorage.setItem("subscription_offer_expires", subscription.offer.expires);
    localStorage.setItem("subscription_offer_type", subscription.offer.type);
    localStorage.setItem("subscription_offer_effect", subscription.offer.effect);
    localStorage.setItem("subscription_card_id", (subscription.cardId).toString());
}

function saveBulletins(item) {
    const bulletins = item.bulletins;

    for (let i = 0; i < bulletins.length; i++) {
        const bulletin = bulletins[i],
            id = item.id,
            index = (item.index !== undefined ? item.index + "_" : "") + i;
        function generateKey(content) { return id + content + index; }

        localStorage.setItem(generateKey("_bulletin_id_"), bulletin.primaryId);
        savePrimitiveUser({
            user: bulletin.author,
            id: item.id + "_bulletin",
            kind: "author",
            index: i
        });
        localStorage.setItem(generateKey("_bulletin_content_"), bulletin.content);
        localStorage.setItem(generateKey("_bulletin_is_sent_"), (bulletin.sent).toString());
        localStorage.setItem(generateKey("_bulletin_is_edited_"), bulletin.edited);
        localStorage.setItem(generateKey("_bulletin_is_public_"), (bulletin.public).toString())
    }
    localStorage.setItem(item.id + "_bulletin_amount", (bulletins.length).toString());
}

function saveIdols(item) {
    if (item.idols !== null) {
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
        const id = item.id + "_gig_" + gig.primaryId,
            index = i;
        function generateKey(content) {
            return id + content + index;
        }

        localStorage.setItem(generateKey("_event_id"), gig.event.primaryId);
        saveAct({
            act: gig.act,
            id: id,
            index: index
        });
        localStorage.setItem(generateKey("_start_"), gig.start);
        localStorage.setItem(generateKey("_end_"), gig.end);
    }
    localStorage.setItem(item.id + "_gigs_amount_" + item.index, gigs.length);
}

function saveAct(item) {
    const act = item.act;

    for (let i = 0; i < act.length; i++) {
        savePrimitiveUser({
            user: act[i],
            kind: "performer",
            id: item.id + "_act_" + act[i].primaryId,
            index: i
        });
    }
    localStorage.setItem(item.id + "_acts_" + item.index, act.length);
}

function saveBands(item) {
    const bands = item.bands;

    for (let i = 0; i < bands.length; i++) {
        const id = item.id + "_band_" + bands[i].primaryId;
        localStorage.setItem(item.id + "_band_id_" + i, bands[i].primaryId);
        savePrimitiveUser({
            user: bands[i],
            id: id,
            index: i
        });
        saveMembers({
            members: bands[i].members,
            id: id,
            index: i
        });
    }
    localStorage.setItem(item.id + "_band_amount", bands.length);
}

function saveRequests(requests) {
    for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        localStorage.setItem("request_primary_id_" + i, request.primaryId);
        localStorage.setItem("request_secondary_id_" + i, request.secondaryId);
        saveEvents({
            events: request.event,
            id: "request_" + request.primaryId + "_" + request.secondaryId,
            index: i
        });
        localStorage.setItem("request_approved_" + i, request.approved);
        localStorage.setItem("request_message_" + i, request.message);
    }
    localStorage.setItem("request_amount",requests.length);
}

function saveMembers(item) {
    const members = item.members;

    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        localStorage.setItem(item.id + "_member_id_" + (item.index !== undefined ? item.index + "_" + i : i),
            member.primaryId)
        savePrimitiveUser({
            user: member,
            type: "artist",
            kind: (item.index === undefined ? "of_this_user" : ""),
            id: item.id + "_" + member.primaryId,
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

    localStorage.setItem(id + "id_" + kind + type + index, user.primaryId);
    localStorage.setItem(id + "username_" + kind + type + index, user.username);
    if (user.firstName !== undefined)
        localStorage.setItem(id + "firstname_" + kind + type + index, user.firstName);
    if (user.fullName !== undefined)
        localStorage.setItem(id + "fullname" + kind + type + index, user.fullName);
    if (user.lastName !== undefined)
        localStorage.setItem(id + "lastname_" + kind + type + index, user.lastName);
    localStorage.setItem(id + "description_" + kind + type + index, user.description);
}