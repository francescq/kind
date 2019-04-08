import JsonApi from '../../src/api/JsonApi';
import GamesMatcher from '../../src/api/GamesMatcher';
import db from './gamesTest.json';
import '@babel/polyfill';

describe('itempsApi', () => {
    let api;

    beforeEach(() => {
        const gamesMatcher = new GamesMatcher();
        api = new JsonApi(db.games, gamesMatcher);
    });

    describe('order', () => {
        it('should order by field asc', async () => {
            const items = await api.search('a', {
                size: 2,
                orderBy: 'name',
                order: 'asc',
            });

            expect(items.data[0].name).toEqual('aaa');
            expect(items.data[1].name).toEqual('abb');
        });

        it('should order by field desc', async () => {
            const items = await api.search('a', {
                size: 2,
                orderBy: 'name',
                order: 'desc',
            });

            expect(items.data[0].name).toEqual('aee');
            expect(items.data[1].name).toEqual('add');
        });
    });

    describe('search', () => {
        it('should return all items', async () => {
            const items = await api.search(null);

            expect(items.data.length).toEqual(0);
        });

        it('should filter by total match', async () => {
            const items = await api.search('aaa');

            expect(items.data.length).toBe(1);
        });

        it('should filter by partial match ', async () => {
            const items = await api.search('a');

            expect(items.data.length).toBe(5);
        });

        describe('fiels', () => {
            it('should OR filter by name', async () => {
                const items = await api.search('aaa');

                expect(items.data.length).toBe(1);
            });

            it('should OR filter by short', async () => {
                const items = await api.search('saa');

                expect(items.data.length).toBe(1);
            });
        });
    });

    describe('pagination', () => {
        it('should default to size 5 and page 1', async () => {
            const items = await api.search('s');

            expect(items.page.page).toBe(0);
            expect(items.page.size).toBe(5);
        });

        describe('page', () => {
            it('should return -1 if no result', async () => {
                const items = await api.search('foo', {
                    page: 4,
                    size: 1,
                });

                expect(items.page.page).toBe(-1);
            });

            it('should return the current page', async () => {
                const items = await api.search('a', {
                    page: 4,
                    size: 1,
                });

                expect(items.page.page).toBe(4);
            });

            it('overflowing should return the last page', async () => {
                const items = await api.search('a', {
                    page: 999,
                    size: 1,
                });

                expect(items.page.page).toBe(4);
            });
        });

        describe('data', () => {
            it('should returns itmes of given page', async () => {
                const pageZeroItems = await api.search('a', {
                    page: 0,
                    size: 2,
                });
                const pageOneItems = await api.search('a', {
                    page: 1,
                    size: 2,
                });

                expect(pageZeroItems.data[0].name).toEqual('aaa');
                expect(pageOneItems.data[0].name).toEqual('acc');
            });
        });

        describe('size', () => {
            it('should return pages of x element', async () => {
                const items = await api.search('a', {
                    page: 0,
                    size: 3,
                });

                expect(items.data.length).toBe(3);
                expect(items.page.size).toBe(3);
            });

            it('should return lenth 0 and size 1 if no results', async () => {
                const items = await api.search('foo', {
                    page: 1,
                    size: 1,
                });

                expect(items.data.length).toBe(0);
                expect(items.page.size).toBe(1);
            });
        });

        describe('totalPages', () => {
            it('should return totalPages 5', async () => {
                const items = await api.search('a', {
                    page: 1,
                    size: 1,
                });

                expect(items.page.totalPages).toBe(5);
            });

            it('should return 0 when the result is empty', async () => {
                const items = await api.search('foo', {
                    page: 1,
                    size: 1,
                });

                expect(items.page.totalPages).toBe(0);
            });
        });

        describe('data', () => {
            it('should return 1st page', async () => {
                const items = await api.search('a', {
                    page: 0,
                    size: 1,
                });

                expect(items.data[0].name).toEqual('aaa');
                expect(items.page.totalPages).toBe(5);
            });

            it('should return 2nd page', async () => {
                const items = await api.search('a', {
                    page: 1,
                    size: 1,
                });

                expect(items.data[0].name).toEqual('abb');
                expect(items.page.page).toBe(1);
            });

            it('overflowing should return last page', async () => {
                const items = await api.search('a', {
                    page: 999,
                    size: 1,
                });

                expect(items.data[0].name).toEqual('aee');
                expect(items.data.length).toBe(1);
            });
        });
    });
});
