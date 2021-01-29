import { Injectable } from '@nestjs/common';
import { IPermission } from './interfaces/permissions.interface'
import { values } from 'lodash'
import { PERMISSIONS_CONFIG } from '../permissions.config'

@Injectable()
export class PermissionsService {
    constructor() {}
    
    async findAll(): Promise<IPermission[]> {
        let permissions = []
        for(const module of Object.keys(PERMISSIONS_CONFIG)){
            let data = values(PERMISSIONS_CONFIG[module]).map(val => {
                const props = val.split("::")
                return { module: props[1], action: props[2], value: val}
            })
            permissions.push(...data)
        }
        return permissions
    }
}
