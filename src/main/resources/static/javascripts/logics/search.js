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
    const city = document.getElementById("city_filtering").value,
        pastEvents = document.getElementById("include_past_events").value === "on",
        earliestDate = document.getElementById("earliest_date_filtering").value,
        latestDate = document.getElementById("latest_date_filtering").value,
        onlyFreeEvents = document.getElementById("only_free_events").value === "on";
        console.log("only free events",onlyFreeEvents);
        const priceRange = !onlyFreeEvents ? document.getElementById("price_range").value : undefined,
        searchForm = document.getElementById("search_selector_form").value;

    filteredSearch = {
        events: [],
        users: []
    }

    if (searchResponseElement !== undefined && document.getElementById("filter_section") !== undefined) {
        filteredSearch.events = searchResponseElement.events.filter((event) => {
            const include = (city !== undefined ?
                    event.contactInfo.address.city === city
                        : true) &&
                (pastEvents !== undefined ?
                    Date.now() <= Date.parse(event.openDoors)
                        : true) &&
                (earliestDate !== undefined ?
                    Date.parse(earliestDate) <= Date.parse(event.openDoors)
                        : true) &&
                (latestDate !== undefined ?
                    Date.parse(latestDate) >= Date.parse(event.openDoors)
                        : true) &&
                (onlyFreeEvents !== undefined ?
                    (onlyFreeEvents ?
                        event.price === undefined || event.price === 0
                            : true) : true) &&
                (priceRange !== undefined ?
                        event.price <= document.getElementById("price_range").value
                            : true) &&
                (searchForm === "EVENTS" || searchForm === "ANY");
            console.log("Include event:",include);
        });
        filteredSearch.users = searchResponseElement.users.filter((user) => {
            return user.contactInfo.address.city === city &&
                (searchForm === user.authority + "S" || searchForm === "ANY");
        });
    }

    await renderDashboard(filteredSearch);

    /*
    document.getElementById("city_filtering").value = city;
    document.getElementById("include_past_events").value = pastEvents;
    document.getElementById("earliest_date_filtering").value = earliestDate;
    document.getElementById("latest_date_filtering").value = latestDate;
    document.getElementById("only_free_events").value = onlyFreeEvents;
    document.getElementById("search_selector_form").value = searchForm;
    if (onlyFreeEvents)
        document.getElementById("price_range").value = priceRange;

     */
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