let searchResponseElement = undefined,
    filteredSearch = undefined,
    sortedSearch = undefined;

async function search(query) {
    searchResponseElement = (await (await fetch(apiSearchURL(query))).json())._element;
    window.location.href = dashboardURL(query);
    await renderDashboard();
}

function hasSearched() { return searchResponseElement !== undefined; }
function clearSearch() { searchResponseElement = undefined; }

async function filterSearch() {
    function filter() {
        if (searchResponseElement !== undefined && document.getElementById("filter_section") !== undefined) {
            filteredSearch = searchResponseElement;
            filteredSearch._events.filter((event) => {
                return (document.getElementById("city_filtering").value !== undefined ?
                        event._contactInfo._address._city === document.getElementById("city_filtering").value
                            : true) &&
                    (document.getElementById("include_past_events").value !== undefined ?
                        Date.now().toEpochMilli() <= Date.parse(event._openDoors).toEpochMilli()
                            : true) &&
                    (document.getElementById("earliest_date_filtering").value !== undefined ?
                        Date.parse(document.getElementById("earliest_date_filtering").value).toEpochMilli() <= Date.parse(event._openDoors).toEpochMilli()
                            : true) &&
                    (document.getElementById("latest_date_filtering").value !== undefined ?
                        Date.parse(document.getElementById("latest_date_filtering").value).toEpochMilli() >= Date.parse(event._openDoors).toEpochMilli()
                            : true) &&
                    (document.getElementById("only_free_events").value !== undefined ?
                        (document.getElementById("only_free_events").value ?
                            event._price === undefined || event._price === 0
                                : true) : true) &&
                    (document.getElementById("price_range") !== undefined &&
                        document.getElementById("price_range").value !== undefined ?
                            event._price <= document.getElementById("price_range").value
                                : true) &&
                    (document.getElementById("search_selector_form").value ?
                        document.getElementById("search_selector_form").value === event._authority
                            : true);
            });
            if (document.getElementById("city_filtering").value !== undefined)
                filteredSearch._users.filter((user) => {
                    return user._contactInfo._address._city === document.getElementById("city_filtering").value;
                });
        }
    }
    filter();

    await renderDashboard();
}

async function sortSearch() {
    sortedSearch = (filteredSearch !== undefined ? filteredSearch : searchResponseElement);
    if (document.getElementById("sorting") !== undefined) {
        switch (document.getElementById("sorting").value) {
            case "DON'T_SORT": {
                sortedSearch._users = (filteredSearch._users !== undefined ? filteredSearch._users : searchResponseElement._users);
                sortedSearch._events = (filteredSearch._events !== undefined ? filteredSearch._events : searchResponseElement._events);
                break;
            }
            case "EARLIEST_DATE": {
                sortedSearch._events.sort((a,b) => {
                    return Date.parse(a._openDoors).toEpochMilli() - Date.parse(b._openDoors).toEpochMilli();
                });
                break;
            }
            case "LATEST_DATE": {
                sortedSearch._events.sort((a,b) => {
                    return Date.parse(b._openDoors).toEpochMilli() - Date.parse(a._openDoors).toEpochMilli();
                });
                break;
            }
            case "HIGHEST_PRICE": {
                sortedSearch._events.sort((a,b) => {
                    return a._price - b._price;
                });
                break;
            }
            case "LOWEST_PRICE": {
                sortedSearch._events.sort((a,b) => {
                    return b._price - a._price;
                });
                break;
            }
            case "ALFABETICLY": {
                sortedSearch._users.sort((a,b) => { return a._username - b._username; });
                sortedSearch._events.sort((a,b) => { return a._title - b._title; });
            }
        }
    }

    await renderDashboard();
}