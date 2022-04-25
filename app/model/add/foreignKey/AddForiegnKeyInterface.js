let {
        devices,
        userBlockList,
        listOfUserE2Es,
        listOfUserGroups,
        listOfUserChannels
    } = require('./users'),
    {
        groupsUsers,
        groupsAdmins,
        reportGroups
    } = require('./groups'),
    {
        channelsUsers,
        channelsAdmins,
        reportChannels
    } = require('./channels');


module.exports = {

    foreignKeys() {
        devices();
        groupsUsers();
        groupsAdmins();
        reportGroups();
        userBlockList();
        channelsUsers();
        reportChannels();
        channelsAdmins();
        listOfUserE2Es();
        listOfUserGroups();
        listOfUserChannels();
    }

}