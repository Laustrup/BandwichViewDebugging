async function renderFrontpage(message) {
    if (userIsLoggedIn())
        window.location.href = profileURL;
    else {
        document.getElementById("main_content").innerHTML = `
            <section id="frontpage_information_section">
                <section id="welcome_detail_section">
                    <h2 class="title">Welcome</h2>
                    <p class="body_text">
                        Feel free to either login or signup,
                        otherwise browse some events underneath.
                    </p>
                </section>
                <section id="action_message_section">
                    ${(message !== undefined ? `<p class="body_text">${message}</p>` : `` )}
                    <div id="response_message"></div>
                </section>
            </section>
            <hr>
            <section id="events_section">
                <h3 class="title">
                    Events
                </h3>
                <div class="container_box">
                    ${await generateEventContainers()}
                </div>
            </section>
        `;
    }
}