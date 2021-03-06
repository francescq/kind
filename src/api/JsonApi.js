class JsonApi {
    constructor(db, matcher) {
        this.db = db;
        this.matcher = matcher;
    }

    _queryItems(query) {
        const regex = new RegExp(query, 'i');

        return this.db.filter(e => {
            if (!query) {
                return false;
            }

            return this.matcher.match(e, regex);
        });
    }

    _getPageMeta(answer) {
        const { page, size, orderBy, order } = this.pagination;

        const totalPages = Math.ceil(answer.length / size);

        const pageMeta = {};
        pageMeta.size = size;
        pageMeta.totalPages = totalPages;
        pageMeta.page = page < totalPages ? page : totalPages - 1;
        pageMeta.orderBy = orderBy;
        pageMeta.order = order;

        return pageMeta;
    }

    _applyOrder(answer) {
        const { orderBy, order } = this.pagination;

        if (!orderBy || !order) {
            return answer;
        }

        const myOrder = order === 'asc' ? 1 : -1;

        const isNumber = isNaN(answer[0][orderBy]) ? false : true;

        const compareString = (a, b) => {
            const aParam = a[orderBy];
            const bParam = b[orderBy];

            let compare = 0;

            if (aParam > bParam) {
                compare = 1;
            }
            if (aParam < bParam) {
                compare = -1;
            }

            return compare * myOrder;
        };

        const compareNumber = (a, b) => {
            const compare = parseInt(a[orderBy]) - parseInt(b[orderBy]);
            return compare * myOrder;
        };

        isNumber ? answer.sort(compareNumber) : answer.sort(compareString);

        // console.log(answer);

        return answer;
    }

    _getPage(orderedAnswer, page) {
        const start = page.page * page.size;
        const offset = start + page.size;

        const slicedPage = orderedAnswer.slice(start, offset);
        //console.log(start, offset, slicedPage);

        return slicedPage;
    }

    search(query, pagination = {}) {
        if (!pagination.page) {
            pagination.page = 0;
        }
        if (!pagination.size) {
            pagination.size = 5;
        }

        this.pagination = pagination;

        // console.log(
        //     `fetching items query:${query}, pagination: ${JSON.stringify(
        //         pagination
        //     )}`
        // );

        const willFetch = new Promise(resolve => {
            const result = {};
            const answer = this._queryItems(query);
            const orderedAnswer = this._applyOrder(answer);
            result.page = this._getPageMeta(orderedAnswer);

            result.data = this._getPage(orderedAnswer, result.page);

            resolve(result);
        });

        return willFetch;
    }
}

export default JsonApi;
