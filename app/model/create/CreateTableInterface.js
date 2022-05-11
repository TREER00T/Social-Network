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
        groupsAdmins,
        reportGroups
    } = require('./groups'),
    {
        channels,
        channelsUsers,
        channelsAdmins,
        reportChannels
    } = require('./channels'),
    {
        forwardContents
    } = require('app/model/create/common');


module.exports = {

    tables() {

        users();
        groups();
        devices();
        channels();
        groupsUsers();
        groupsAdmins();
        reportGroups();
        channelsUsers();
        userBlockList();
        listOfUserE2Es();
        channelsAdmins();
        reportChannels();
        forwardContents();
        listOfUserGroups();
        listOfUserChannels();

    }

}