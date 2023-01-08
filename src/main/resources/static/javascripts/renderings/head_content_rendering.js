renderHead();

function renderHead() {
    let head = ``,
        endpoint = window.location.pathname.split('=');
    console.log("Current endpoint", endpoint);
    switch (endpoint[0]) {
        case "/welcome": {
            head = "Bandwich";
            break;
        }
        case "/profile": {
            head = "BANDWICH - logged in";
            break;
        }
        case "/dashboard": {
            head = "BANDWICH - dashboard";
            break;
        }
        case "/dashboard/?search_query": {
            head = "BANDWICH - search";
            break;
        }
        case "/?event": {
            head = "BANDWICH - event";
            break;
        }
        case "/?user": {
            head = "BANDWICH - user";
            break;
        }
        default: {
            head = "BANDWICH";
            break;
        }
    }
    document.getElementById("head_title").innerHTML = `${head}`;
}