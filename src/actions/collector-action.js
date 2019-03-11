import * as Types from './action-type'

export const CollectorAction = {
    setCollectors: (collectors) => {
        return {
            type: Types.SET_COLLECTOR_LIST,
            collectors
        }
    }
}
