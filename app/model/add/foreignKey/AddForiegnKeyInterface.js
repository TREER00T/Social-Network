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

    foreignKeys() {
        devices();
        groupsUsers();
        groupsAdmins();
        userBlockList();
        channelsUsers();
        channelsAdmins();
        listOfUserE2Es();
        listOfUserGroups();
        listOfUserChannels();
    }

}