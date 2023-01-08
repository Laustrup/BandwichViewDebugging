renderMain().then();

async function renderMain() {
    clearSearch();
    const isDeveloping = true;

    if (isDeveloping) {
        document.getElementById("main_content").innerHTML = `
            <h3 class="title">Sorry...</h3>
            <h5 class="description">This website is being developed at the moment.</h5>

            <p class="body_text">Therefore no content is available.</p>
            <p class="body_text">We hope to fix this in the near future.</p>
        `;
    }
    else {
        let url = window.location.href.split("=");
        switch (url[0]) {
            case frontpageURL: {
                await renderFrontpage();
                break;
            }
            case loginURL: {
                renderLogin();
                break;
            }
            case signupURL: {
                renderSignup();
                break;
            }
            case profileURL: {
                await renderProfile();
                break;
            }
            case dashboardURL(): {
                await renderDashboard();
                break;
            }
            case viewDomainURL + "/?chat_room": {
                if (userIsLoggedIn())
                    await renderChatRoom();
                else
                    await renderFrontpage("You need to log in for viewing chat room page");
                break;
            }
            case (dashboardURL() + "/?search_query"): {
                await search(url[1]);
                await renderDashboard();
                break;
            }
            case (viewDomainURL + "/?event"): {
                await renderEvent({
                    id: url[1],
                    doFetch: true
                });
                break;
            }
            case (viewDomainURL + "/?user"): {
                await renderUser(url[1]);
                break;
            }
            default: {
                document.getElementById("main_content").innerHTML = `
                    <h3 class="title">Sorry...</h3>
                    <h5 class="description">The current page could not be rendered...</h5>
        
                    <p class="body_text">Therefore no content is available.</p>
                `;
            }
        }
    }
}