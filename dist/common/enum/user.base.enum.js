export var userRoles;
(function (userRoles) {
    userRoles["admin"] = "admin";
    userRoles["user"] = "user";
    userRoles["doctor"] = "doctor";
    userRoles["guest"] = "guest";
})(userRoles || (userRoles = {}));
export var userGender;
(function (userGender) {
    userGender["male"] = "male";
    userGender["female"] = "female";
})(userGender || (userGender = {}));
export var userProvider;
(function (userProvider) {
    userProvider["system"] = "system";
    userProvider["google"] = "google";
})(userProvider || (userProvider = {}));
export var userTokenEnum;
(function (userTokenEnum) {
    userTokenEnum["access"] = "access-token";
    userTokenEnum["refresh"] = "refresh-token";
})(userTokenEnum || (userTokenEnum = {}));
//# sourceMappingURL=user.base.enum.js.map