export default {

    async all(arr: any[]) {
        for (const key in arr) {
            let item = await arr[key];

            if (item?.statusCode && item?.message)
                return item;
        }
        return arr.pop();
    }

}