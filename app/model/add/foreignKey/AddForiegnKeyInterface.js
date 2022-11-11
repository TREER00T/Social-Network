let {
        devices,
        userBlockList,
        listOfUserE2Es,
        listOfUserGroups,
        listOfUserChannels
    } = require('./users'),
    {
        groupsUsers,
        groupsAdmins
    } = require('./groups'),
    {
        channelsUsers,
        channelsAdmins
    } = require('./channels');


module.exports = {

    async foreignKeys() {
        await devices();
        await groupsUsers();
        await groupsAdmins();
        await userBlockList();
        await channelsUsers();
        await channelsAdmins();
        await listOfUserE2Es();
        await listOfUserGroups();
        await listOfUserChannels();
    }

}