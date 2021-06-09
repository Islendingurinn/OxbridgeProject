import Role from '../models/roles';

export const isAdmin = (roles: Role[]) => {
    for(const role of roles){
        if(role.code === 'ADMIN')
        return true;
    }
}