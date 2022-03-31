module.exports = {
    COMMENT(text) {
        return `COMMENT '${text}'`;
    },

    PRIMARY_KEY(string) {
        return `primary key (${string})`;
    }
}