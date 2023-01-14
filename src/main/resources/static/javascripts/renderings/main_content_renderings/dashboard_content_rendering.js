async function renderDashboard(search) {
    const user = getUser();
    document.getElementById("main_content").innerHTML = `
        <section id="welcoming_section">
            ${generateWelcomeSection()}
            <section id="action_message_section">
                <div id="response_message"></div>
            </section>
        </section>
        <section>
            ${search !== undefined ? generateSearchSection(search) : ``}
            <section id="attending_events_section">
                ${(userIsAttendingEvents(user) ? `
                    <h3 class="title">
                        Events you are attending at:
                    </h3>
                    <div class="container_box">
                        <div class="wrapper">
                            ${generateAttendingEventContainers()}
                        </div>
                    </div>
                ` : `
                    <h3 class="title">
                        At the moment you are not going to attend any events...
                    </h3>
                    <p class="description">
                        Feel welcome to browse for any interesting events.
                    </p>
                `)}
            </section>
            ${generateFollowingContent(user)}
            <section id="events_section">
                <h3 class="title">
                    New events of Bandwich:
                </h3>
                <div class="container_box">
                    <div class="wrapper">
                        ${await generateEventContainers()}
                    </div>
                </div>
            </section>
        </section>
        `;
}

function userIsAttendingEvents(user) {
    if (user !== undefined && user.events.length > 0) {
        user.events.forEach((event) => {
            event.participations.forEach((participation) => {
                if (participation.participant.primaryId === user.id)
                    return true;
            });
        });
    }
    return false;
}