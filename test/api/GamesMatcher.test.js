import GamesMatcher from '../../src/api/GamesMatcher';

const testGame = {
    name: 'aaa',
    short: 'bbb',
    url: '/spel/sportspel/8-ball-pool/?language\u003dsv',
    tags: '',
    hasBoosters: false,
};

const matcher = new GamesMatcher();

describe('GamesMatcher', () => {
    beforeEach(() => {});

    it('should match by name', () => {
        const regex = new RegExp('aaa', 'i');

        const matches = matcher.match(testGame, regex);

        expect(matches).toBe(true);
    });

    it('should match by short insensitive', () => {
        const regex = new RegExp('bbb', 'i');

        const matches = matcher.match(testGame, regex);

        expect(matches).toBe(true);
    });
});
