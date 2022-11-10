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

    tables() {

        users();
        groups();
        devices();
        channels();
        groupsUsers();
        groupsAdmins();
        channelsUsers();
        userBlockList();
        listOfUserE2Es();
        channelsAdmins();
        forwardContents();
        listOfUserGroups();
        listOfUserChannels();

    }

}