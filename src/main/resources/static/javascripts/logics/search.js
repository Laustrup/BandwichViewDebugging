let searchResponseElement = undefined,
    filteredSearch = undefined,
    sortedSearch = undefined,
    hasSorted = false;

async function search(query) {
    if (query === undefined)
        query = document.getElementById("search-input").value;

    if (query !== "") {
        console.log("Search:",query);
        sessionStorage.setItem("has_searched","TRUE");
        searchResponseElement = await fetchElement({
            url: apiSearchURL(query),
            method: POST
        });
    }

    if (document.getElementById("search-input").value !== undefined)
        document.getElementById("search-input").value = query;

    changeURLWithoutRender(dashboardURL(query));
    await renderDashboard(searchResponseElement);
}

function hasSearched() {
    return sessionStorage.getItem("has_searched") !== undefined;
}
function clearSearch() {
    searchResponseElement = undefined;
    sessionStorage.setItem("has_searched",undefined);
}

async function filterSearch() {
    function filter() {
        if (searchResponseElement !== undefined && document.getElementById("filter_section") !== undefined) {
            filteredSearch = searchResponseElement;
            filteredSearch.events.filter((event) => {
                return (document.getElementById("city_filtering").value !== undefined ?
                        event.contactInfo.address.city === document.getElementById("city_filtering").value
                            : true) &&
                    (document.getElementById("include_past_events").value !== undefined ?
                        Date.now().toEpochMilli() <= Date.parse(event.openDoors).toEpochMilli()
                            : true) &&
                    (document.getElementById("earliest_date_filtering").value !== undefined ?
                        Date.parse(document.getElementById("earliest_date_filtering").value).toEpochMilli() <= Date.parse(event.openDoors).toEpochMilli()
                            : true) &&
                    (document.getElementById("latest_date_filtering").value !== undefined ?
                        Date.parse(document.getElementById("latest_date_filtering").value).toEpochMilli() >= Date.parse(event.openDoors).toEpochMilli()
                            : true) &&
                    (document.getElementById("only_free_events").value !== undefined ?
                        (document.getElementById("only_free_events").value ?
                            event.price === undefined || event.price === 0
                                : true) : true) &&
                    (document.getElementById("price_range") !== undefined &&
                        document.getElementById("price_range").value !== undefined ?
                            event.price <= document.getElementById("price_range").value
                                : true) &&
                    (document.getElementById("search_selector_form").value ?
                        document.getElementById("search_selector_form").value === event.authority
                            : true);
            });
            if (document.getElementById("city_filtering").value !== undefined)
                filteredSearch.users.filter((user) => {
                    return user.contactInfo.address.city === document.getElementById("city_filtering").value;
                });
        }
    }
    filter();

    await renderDashboard(searchResponseElement);
}

async function sortSearch() {
    sortedSearch = (filteredSearch !== undefined ? filteredSearch : searchResponseElement);
    hasSorted = true;
    if (document.getElementById("sorting") !== undefined) {
        switch (document.getElementById("sorting").value) {
            case "DON'T_SORT": {
                sortedSearch.users = (filteredSearch.users !== undefined ? filteredSearch.users : searchResponseElement.users);
                sortedSearch.events = (filteredSearch.events !== undefined ? filteredSearch.events : searchResponseElement.events);
                break;
            }
            case "EARLIEST_DATE": {
                sortedSearch.events.sort((a,b) => {
                    return Date.parse(a.openDoors).toEpochMilli() - Date.parse(b.openDoors).toEpochMilli();
                });
                break;
            }
            case "LATEST_DATE": {
                sortedSearch.events.sort((a,b) => {
                    return Date.parse(b.openDoors).toEpochMilli() - Date.parse(a.openDoors).toEpochMilli();
                });
                break;
            }
            case "HIGHEST_PRICE": {
                sortedSearch.events.sort((a,b) => {
                    return a.price - b.price;
                });
                break;
            }
            case "LOWEST_PRICE": {
                sortedSearch.events.sort((a,b) => {
                    return b.price - a.price;
                });
                break;
            }
            case "ALFABETICLY": {
                sortedSearch.users.sort((a,b) => { return a.username - b.username; });
                sortedSearch.events.sort((a,b) => { return a.title - b.title; });
            }
        }
    }

    await renderDashboard();
}