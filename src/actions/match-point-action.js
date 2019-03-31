import * as Types from './action-type'

export const MatchPointAction = {
    setMatchData: (matchData) => ({
        type: Types.SET_MATCH_DATA,
        matchData
    }),
    setCppList: (cppList) => ({
        type: Types.SET_CPP_LIST,
        cppList
    }),
    changeCollector: (oldCollectorId, newCollectorId) => ({
        type: Types.CHANGE_COLLECTOR,
        oldCollectorId, newCollectorId
    })
}