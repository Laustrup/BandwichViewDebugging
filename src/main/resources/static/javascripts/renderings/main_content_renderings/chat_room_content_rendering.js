async function renderChatRoom() {
    document.getElementById("main_content").innerHTML = `
        <section id="chat_rooms_container">
            <div class="wrapper">
                ${generateLeftSection()}
            </div>
        </section>
        <section id="chat_room_display">
            <div class="wrapper">
                ${generateRightSection()}
            </div>
        </section>
    `;
}

function generateLeftSection() {
    return `
        <section class="container" id="chat_room_windows_header">
            <div class="wrapper">
                <h4 class="title">
                    Chat rooms |
                </h4>
                <button onclick="${() => { sessionStorage.setItem("new_chat_room","true")}}" class="action_button">
                    New Chat room
                </button>
            </div>
        </section>
        <section class="container" id="chat_room_windos_container">
            <div class="wrapper">
                ${generateChatRoomWindows()}
            </div>
        </section>
    `;
}

function generateChatRoomWindows() {
    let chatRooms = getChatRooms(),
        windows;
    chatRooms.sort((a,b) => {
        return a._mails.sort((a,b) => {
            return date.parse(a._timestamp).toEpochMilli() -
                date.parse(b._timestamp).toEpochMilli()
        })[0] - b._mails.sort((a,b) => {
            return date.parse(a._timestamp).toEpochMilli() -
                date.parse(b._timestamp).toEpochMilli()
        })[0]
    });

    chatRooms.forEach((chatRoom) => {
        windows += `
            <div class="window">
                <div class="wrapper">
                    <a onclick="chooseChatRoom(${chatRoom})" class="pressable_title">
                        ${chatRoom.title}
                    </a>
                </div>
            </div>
        `;
    });

    return windows;
}

//TODO add setting href.
//TODO extra details for adding a user to chatroom
function generateRightSection() {
    let user = getUser(),
        chatRoom = getChosenChatRoom(),
        chatRooms = getChatRooms(),
        chatterTitles = "",
        mails = ``;
    if (chatRoom === undefined)
        chatRoom = chatRooms[0];

    chatRoom.chatters.forEach((chatter,index) => {
        chatterTitles += chatter.username;
        if (index < chatRoom.chatters.length)
            chatterTitles += ", ";
    });
    chatRoom.mails.sort((a,b) => {
        return Date.parse(a.timestamp).toEpochMilli() -
            Date.parse(b.timestamp).toEpochMilli();
    });
    chatRooms.mails.forEach((mail) => {
        const isEdited = (mail.isEdited ? `
            <p class="small_text">
                Is edited
            </p>
        ` : `` );
        const messageField = (mail.author.id === user.id ? `
            <input type="text" value="mail.content" class="message_content" id="${mail.id}_message_content" placeholder="Rewrite content">
            <label for="is_public">Is public:</label>
            <input type="checkbox" value="${mail.isPublic}" id="${mail.id}_is_public">
            <p class="small_text">
                Written: ${mail.timestamp}
            </p>
            <button class="action_button" onclick="editMessage(${mail.id})">Edit</button>
        ` : `
            <p class="message_content">
                ${mail.content}
            </p>
            <p class="small_text">
                Written: ${mail.timestamp}
            </p>
        `);
        if (mail.isSent && (mail.author.id === user.id || mail.isPublic))
            mails += `
                <div class="${(mail.author.id === user.id ? "user_message_container" : "message_container")}">
                    <div class="wrapper">
                        <a href="${userURL(mail.author.id)}" class="user_link">
                            ${mail.author.username}
                        </a>
                        ${messageField}
                        ${isEdited}
                    </div>
                </div>
            `;
    });

    return (chatRooms !== undefined &&
        sessionStorage.getItem("new_chat_room") === "false" ? `
        <section id="chat_room_header">
            <section id="chat_room_header_left_section">
                <div class="wrapper">
                    <h2>
                        ${chatRoom.title} |
                    </h2>
                    <p>
                        ${chatterTitles}
                    </p>
                </div>
            </section>
            <section id="chat_room_header_right_section">
                <div class="wrapper">
                    <a href="">
                        <img src="../static/images/settings-icon.png" alt="settings">
                    </a>
                </div>
            </section>
        </section>
        <section id="chat_room_messages">
            <div class="wrapper">
                ${mails}
            </div>
        </section>
        <section id="writing_section">
            <div class="wrapper">
                <label for="new_message_content">New message:</label>
                <input type="text" id="new_message_content" class="message_field" onchange="saveDraft(${{message: this, id: chatRoom.id}})" value="${getDraft(chatRoom.id)}" placeholder="Write message...">
                
                <label for="is_public">Is public:</label>
                <input type="checkbox" id="is_public">
                
                <button class="action_button" onclick="sendMessage()">Send</button>
            </div>
        </section>
    ` : `
        <section id="chat_room_header">
            <section id="chat_room_creation_section">
                <div class="wrapper">                    
                    <h4 class="title">
                        ${(sessionStorage.getItem("new_chat_room") === undefined &&
                        sessionStorage.getItem("new_chat_room") === "false" ? 
                        "Seems like you don't have a chat room yet..." : "Create a new chat room")}
                    </h4>
                    <p class="body_text">
                        Fields with * must be filled!
                        Send a message to create the chat room.
                    </p>
                    <label for="responsible_id">Reciever*:</label>
                    <input type="text" list="responsible_id" onchange="changeReceiverDataList(this)" placeholder="Write a username of a user...">
                    <datalist id="responsible_id"></datalist>
                    
                    <label for="title">Title:</label>
                    <input type="text" id="title" placeholder="Title of chat room...">
                </div>
            </section>
            <section id="chat_room_header_right_section">
                <div class="wrapper">
                    <a href="">
                        <img src="../static/images/settings-icon.png" alt="settings" class="button_image">
                    </a>
                </div>
            </section>
        </section>
            <section id="chat_room_messages">
                <div class="wrapper">
                    ${mails}
                </div>
            </section>
            <section id="writing_section">
                <div class="wrapper">
                    <label for="new_message_content">New message:</label>
                    <input type="text" id="new_message_content" class="message_field" onchange="saveDraft(${{message: this, id: chatRoom.id}})" value="${getDraft(chatRoom.id)}" placeholder="Write message...">
                    
                    <label for="is_public">Is public:</label>
                    <input type="checkbox" id="is_public">
                        
                    <button class="action_button" onclick="createChatRoom()">Send</button>
                </div>
            </section>
    `);
}