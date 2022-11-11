let {
        users,
        devices,
        userBlockList,
        listOfUserE2Es,
        listOfUserGroups,
        listOfUserChannels
    } = require('./users'),
    {
        groups,
        groupsUsers,
        groupsAdmins
    } = require('./groups'),
    {
        channels,
        channelsUsers,
        channelsAdmins
    } = require('./channels'),
    {
        forwardContents
    } = require('../../model/create/common');


module.exports = {

    async tables() {

        await users();
        await groups();
        await devices();
        await channels();
        await groupsUsers();
        await groupsAdmins();
        await channelsUsers();
        await userBlockList();
        await listOfUserE2Es();
        await channelsAdmins();
        await forwardContents();
        await listOfUserGroups();
        await listOfUserChannels();

    }

}