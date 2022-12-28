import Util from "./Util";

export default {

    build(obj: any) {

        if (obj?.to)
            delete obj.to;

        let limit = obj?.limit,
            page = obj?.page,
            order = obj?.order,
            sort = obj?.sort,
            type = obj?.type,
            search = obj?.search,
            getLimit = !Util.isUndefined(limit) ? limit : 1,
            getSort = !Util.isUndefined(sort) ? sort : 'DESC',
            getOrder = !Util.isUndefined(order) ? order : 'id',
            getPage = !Util.isUndefined(page) ? page : 1,
            startFrom = (getPage - 1) * limit;

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