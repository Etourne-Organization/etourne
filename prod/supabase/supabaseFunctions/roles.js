"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleId = void 0;
const supabase_1 = require("../supabase");
const getRoleId = async (props) => {
    const { roleName } = props;
    const { data, error } = await supabase_1.supabase
        .from('Roles')
        .select('id')
        .eq('name', roleName);
    return { data, error };
};
exports.getRoleId = getRoleId;
