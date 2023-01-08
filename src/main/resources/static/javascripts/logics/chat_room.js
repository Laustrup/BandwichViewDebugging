async function sendMessage() {
    const message = document.getElementById("new_message_content").value,
        isPublic = document.getElementById("is_public").value;
    let chatRoom = getChosenChatRoom();

    const user = getUser();
    chatRoom.mails.push(convertMailToAPI({
        chatRoom: chatRoom,
        author: user,
        content: message,
        sent: true,
        edited: constructPlato({boolean: false}),
        public: isPublic,
        timestamp: Date.now()
    }));
    await fetch(apiChatRoomUpsert, convertChatRoomToAPI(chatRoom));
}

async function editMessage(id) {
    const message = document.getElementById(id + "_message_content").value,
        isPublic = document.getElementById(id + "_is_public").value;
    let chatRoom = getChosenChatRoom(),
        editedChatRoom;

    const user = getUser();
    chatRoom.mails.forEach((mail) => {
        editedChatRoom.push(mail.id === id ? {
            chatRoom: chatRoom,
            author: user,
            content: message,
            sent: true,
            edited: constructPlato({boolean: true}),
            public: isPublic,
            timestamp: mail.timestamp
        } : editedChatRoom.push(mail));
    });

    const response = (await (await fetch(apiChatRoomUpsert, convertChatRoomToAPI(chatRoom))).json())._element;

    saveChatRooms({
        chatRooms: [response],
        id: "user_" + user.id
    });
}

//TODO Get responsible without calling api.
//TODO Be able to create multiple chatters.
async function createChatRoom() {
    const title = document.getElementById("title").value,
        message = document.getElementById("new_message_content").value,
        isPublic = document.getElementById("is_public").value,
        chatters = document.getElementById("chatters").value;

    const responsible = (await (await fetch(apiUserGetURL(
        document.getElementById("responsible_id").value))).json())._element;

    const user = getUser();
    await fetch(apiChatRoomUpsert, convertChatRoomToAPI({
        id: undefined,
        title: title,
        mails: [{
            chatRoom: {
                title: title,
                chatters: chatters,
                responsible: responsible
            },
            author: user,
            content: message,
            sent: true,
            edited: constructPlato({boolean: false}),
            public: isPublic,
            timestamp: Date.now()
        }],
        chatters: chatters,
        responsible: responsible
    }));
}

function saveDraft(draft) { sessionStorage.setItem(draft.id + "_draft",draft.message); }
function getDraft(id) {
    return (sessionStorage.getItem(id + "_draft") !== undefined ?
        sessionStorage.getItem(id + "_draft") : "");
}

async function changeReceiverDataList(search) {
    const response = (await (await fetch(apiSearchURL(search))).json())._element._users._data;
    let options = ``;
    response.forEach((user) => {
        options += `<option value="${user._id}">${user._username}</option>`;
    });

    document.getElementById("responsible_id").innerHTML = `
        <datalist>
            ${options}
        </datalist>
    `;
}

function chooseChatRoom(chatRoom) {
    sessionStorage.setItem("chosen_chat_room_id", chatRoom.id);
    sessionStorage.setItem("chosen_chat_room_title", chatRoom.title)
    saveMails({
        mails: chatRoom.mails._data,
        id: "chosen_chat_room"
    });
    saveChatters({
        chatters: chatRoom.chatters._data,
        id: "chosen_chat_room"
    });
    savePrimitiveUser({
        user: chatRoom.responsible,
        id: "chosen_chat_room",
        kind: "responsible"
    });
    sessionStorage.setItem("chosen_chat_room_answering_time", chatRoom.answeringTime);
    sessionStorage.setItem("chosen_chat_room_is_answered", chatRoom.isAnswered);
}

function getChosenChatRoom() {
    if (sessionStorage.getItem("chosen_chat_room_id") !== undefined)
        return {
            id: sessionStorage.getItem("chosen_chat_room_id"),
            title: sessionStorage.getItem("chosen_chat_room_title"),
            mails: getMails({id: "chosen_chat_room"}),
            chatters: getChatters({id: "chosen_chat_room"}),
            responsible: getPrimitiveUser({
                id: "chosen_chat_room",
                kind: "responsible"
            }),
            answeringTime: sessionStorage.getItem("chosen_chat_room_answering_time"),
            isAnswered: sessionStorage.getItem("chosen_chat_room_is_answered")
        };
    else
        return undefined;
}

function convertChatRoomFromAPI(chatRoom) {
    return {
        id: chatRoom._id,
        title: chatRoom._title,
        mails: chatRoom._mails,
        chatters: chatRoom._chatters,
        responsible: chatRoom._responsible,
        isAnswered: chatRoom._answered
    }
}

function convertChatRoomToAPI(chatRoom) {
    return {
        _id: chatRoom.id,
        _title: chatRoom.title,
        _mails: chatRoom.mails,
        _chatters: chatRoom.chatters,
        _responsible: chatRoom._responsible,
        _answeringTime: chatRoom.answeringTime,
        _answered: chatRoom.isAnswered
    }
}

function convertMailToAPI(mail) {
    return {
        _chatRoom: mail.chatRoom,
        _author: mail.author,
        _content: mail.content,
        _sent: mail.isSent,
        _edited: mail.isEdited,
        _public: mail.isPublic,
        _timestamp: mail.timestamp
    }
}