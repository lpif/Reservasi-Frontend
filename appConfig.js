var appConfig = {};

appConfig.API_SERVER   = 'http://api.lp.if.its.ac.id/api/v1/';
appConfig.MAX_REPEAT = {
    COUNT_DAY : 90,
    COUNT_WEEK : 8,
    COUNT_MONTH: 2,
    OCCURRENCES_DAY : 120,
    OCCURRENCES_WEEK : 18,
    OCCURRENCES_MONTH : 5
};

module.exports = appConfig;
