// ?debug=true
const queryParams = new URLSearchParams(window.location.search);
const debug = queryParams.get('debug');

if (debug && window.location.hostname === "specials.cdn.sports.ru") {
    window.location.href = 'https://sirena.sports.ru/hockeypicker/';
}