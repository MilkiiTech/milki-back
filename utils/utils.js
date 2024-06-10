exports.generatePassword= ()=>{
    return Math.floor(100000 + Math.random() * 900000);
}
exports.roles=["SUPER_ADMIN","MANAGER","LEADER","MEMBERS","ZONE_ADMIN","WOREDA_ADMIN"];