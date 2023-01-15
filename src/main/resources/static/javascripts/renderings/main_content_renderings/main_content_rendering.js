renderMain().then();

async function renderMain() {
    //clearSearch();
    const isDeveloping = false;

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
        console.log("Current href:",url);

        switch (url[0]) {
            case frontpageURL: {
                await renderFrontpage();
                break;
            }
            case loginURL: {
                await renderLogin();
                break;
            }
            case logoutURL: {
                await logout();
                await renderFrontpage();
                break
            }
            case signupURL: {
                renderSignup();
                break;
            }
            case profileURL: {
                await renderProfile();
                break;
            }
            case dashboardURL() || dashboardURL() + "?search_query": {
                await renderDashboard();
                break;
            }
            case dashboardURL() + "?search_query": {
                if (searchResponseElement === undefined)
                    await search(url[1]);

                await renderDashboard(hasSorted ? sortedSearch : searchResponseElement);
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

function renderContent(content) {
    document.getElementById("main_content").innerHTML = content;
    let footer = document.getElementById("footer");
    footer.style.position = "absolute";
    footer.style.bottom = "0";
    footer.style.left = "0";
    footer.style.right = "0";
}