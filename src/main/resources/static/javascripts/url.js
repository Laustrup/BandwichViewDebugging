const isDeveloping = false;

//VIEW
const viewDomainURL = "http://" + (isDeveloping ? "localhost" : "bandwich.dk") + ":8082/";
const
    aboutURL = viewDomainURL + "about",
    frontpageURL = viewDomainURL + "welcome",
    profileURL = viewDomainURL + "profile",
    loginURL = viewDomainURL + "log_in",
    logoutURL = viewDomainURL + "log_out",
    signupURL = viewDomainURL + "sign_up";

function dashboardURL(searchQuery) {
    return viewDomainURL + "dashboard" + (searchQuery !== undefined ? "?search_query=" + searchQuery : "");
}
function chatRoomURL(id) {
    return viewDomainURL + "search?chat_room=" + id;
}
function eventURL(id) {
    return viewDomainURL + "search?event=" + id;
}
function userURL(id) {
    return viewDomainURL + "search?user=" + id;
}

//PERSISTENCE
const apiDomainURL = "http://" + (isDeveloping ? "localhost" : "bandwich.dk") + ":8081/api/";
const apiLoginURL = apiDomainURL + "user/login",
    apiChatRoomUpsert = apiDomainURL + "chat_room/upsert";

function apiUserGetURL(id) {
    return apiDomainURL + "user/get/" + id;
}
function apiUserEditURL(update) {
    return apiDomainURL + "user/update/" + update.username + "/" + update.confirmationPassword + "/" + update.newPassword;
}
const apiUserFollowURL = apiDomainURL + "user/follow",
    apiUserUnfollowURL = apiDomainURL + "user/unfollow";
function apiUserDelete(id) {
    return apiDomainURL + "user/" + (id === undefined ? "delete" : id);
}
function apiSearchURL(searchQuery) {
    return apiDomainURL + "user/search/" + searchQuery;
}
function apiCreateVenue(password) {
    return apiDomainURL + "venue/create/" + password;
}
function apiCreateArtist(password) {
    return apiDomainURL + "artist/create/" + password;
}
function apiCreateBand(password) {
    return apiDomainURL + "band/create/" + password;
}
function apiEventGet(id) {
    return apiDomainURL + "event/get" + (id !== undefined ? "/" + id : "");
}
const apiEventCreate = apiDomainURL + "event/create";
function apiEventUpdate() {
    return apiDomainURL + "event/update";
}
function apiEventDelete(id) {
    return apiDomainURL + "event/" + (id === undefined ? "delete" : id);
}
function apiParticipationUpsert() {
    return apiDomainURL + "event/upsert/participations";
}

async function changeURL(url) {
    changeURLWithoutRender(url);
    await renderMain();
}

function changeURLWithoutRender(url) {
    history.pushState({}, null, url);
}