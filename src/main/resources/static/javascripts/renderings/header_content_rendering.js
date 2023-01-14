renderHeader();

function renderHeader() {
    let leftSection = ``,
        midSection = `
            <section>
                <div class="wrapper">
                    <input type="search" oninput="search()" placeholder="search"
                        value="${(searchResponseElement !== undefined ? searchResponseElement : "")}"
                        id="search-input">
                </div>
            </section>
        `,
        rightSection = ``;
    const user = getUser();
    if (user === undefined) {
        leftSection = `
            <section id="header_left">
                <div class="wrapper">
                    <div id="header_title">
                        <a href="${frontpageURL}" class="image_button">
                            <img id="header_logo" src="../static/images/logo.png" alt="BANDWICH">
                        </a>
                    </div>
                    |
                    <a href="${aboutURL}" class="navigation_tag">
                        about us
                    </a>
                </div>
            </section>
        `;
        rightSection = `
            <section id="header_right">
                <a href="${signupURL}" class="login_tag">
                    signup
                </a>
                |
                <a href="${loginURL}" class="login_tag">
                    login
                </a>
            </section> `;
    } else {
        leftSection = `
            <section id="header_left">
                <div class="wrapper">
                    <div id="header_title">
                        <a href="${frontpageURL}" class="image_button">
                            <img src="../static/images/logo.png" alt="BANDWICH">
                        </a>
                    </div>
                    |
                    <div id="navigation_bar">
                        <a href="${profileURL}" class="navigation_tag">
                            Profile
                        </a>
                        <a href="${dashboardURL()}" class="navigation_tag">
                            Dashboard
                        </a>
                        <a href="${chatRoomURL(user.chatRooms[0].id)}" class="navigation_tag">
                            Chat
                        </a>
                        <a href="${aboutURL}" class="navigation_tag">
                            about us
                        </a>
                    </div>
                </div>
            </section>
        `;
        rightSection = `
            <section id="header_right">
                <a href="${profileURL}" class="login_tag">
                    ${user.username}
                </a>
                |
                <a onclick="logout()" class="login_tag">
                    logout
                </a>
            </section> 
        `;
    }

    document.getElementById("header_content").innerHTML =
            leftSection +
            midSection +
            rightSection;
}