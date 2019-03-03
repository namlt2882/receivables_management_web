import * as Types from './action-type'
import { fetch } from '../utils/api-caller'

export const CollectorAction = {
    setCollectors: (collectors) => {
        return {
            type: Types.SET_COLLECTOR_LIST,
            collectors
        }
    }
}
