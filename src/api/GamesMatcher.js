export default class GamesMatcher {
    match(element, regex) {
        const names = element.name.match(regex);
        if (names) {
            return true;
        }

        const shorts = element.short.match(regex);
        if (shorts) {
            return true;
        }

        return false;
    }
}
