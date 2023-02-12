export default {

    build(obj: any) {

        let limit = obj?.limit,
            page = obj?.page,
            order = obj?.order,
            sort = obj?.sort,
            type = obj?.type,
            search = obj?.search,
            getLimit = Number(limit ?? 1),
            getSort = sort ?? 'DESC',
            getOrder = order ?? '_id',
            getPage = Number(page ?? 1),
            startFrom = (getPage - 1) * getLimit;

        return {
            type: type,
            sort: getSort,
            search: search,
            limit: getLimit,
            order: getOrder,
            startFrom: startFrom
        }

    }

}