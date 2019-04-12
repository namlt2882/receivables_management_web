import * as Types from '../actions/action-type';

export class MatchData {
    isLoaded = false;
    matchSeries = [
        new MatchSeries(1000),
        new MatchSeries(3000),
        new MatchSeries(5000),
        new MatchSeries(5000, true),
    ];
    originCppModels = [];
    setCppModels = (cppList) => {
        this.isLoaded = true;
        this.originCppModels = cppList;
        this.matchSeries.forEach(series => {
            //create match data for each series
            let cppModels = cppList.map(cpp => {
                let w = getW(series.maxAmount);
                let cppModel = {
                    CollectorId: cpp.CollectorId,
                    CPP: cpp.CPP,
                    CurrentReceivable: cpp.CurrentReceivable,
                    TotalReceivableCount: cpp.TotalReceivableCount,
                    MatchPoint: calculateMatchPoint(cpp, w), //calculate match point
                    series: series
                }
                return cppModel;
            });
            cppModels.sort(sortCpp);
            series.cppModels = cppModels;
        });
    };
    sort = () => {
        this.matchSeries.forEach(series => {
            series.cppModels.sort(sortCpp);
        })
    };
    getCppByCollectorId = (collectorId) => {
        let rs = this.matchSeries.flatMap(series => {
            let arr = [];
            let tmp = series.cppModels.find(model => model.CollectorId === collectorId);
            if (tmp) {
                arr.push(tmp);
            }
            return arr;
        });
        let originCpp = this.originCppModels.find(model => model.CollectorId === collectorId);
        if (originCpp) {
            rs.push(originCpp);
        }
        return rs;
    };
    incrementCR = (collectorId, seed = 1) => {
        if (!collectorId) {
            return;
        }
        let cppModels = this.getCppByCollectorId(collectorId);
        cppModels.forEach(cpp => {
            let newCR = cpp.CurrentReceivable + seed;
            if (newCR < 0) {
                newCR = 0;
            }
            cpp.CurrentReceivable = newCR;
            if (cpp.MatchPoint !== undefined) {
                // no update match point for origin cpp
                let w = getW(cpp.series.maxAmount);
                cpp.MatchPoint = calculateMatchPoint(cpp, w);
            }
        })
        this.sort();
    }
    changeCollector = (oldCollectorId, newCollectorId) => {
        // update old collector id
        this.incrementCR(oldCollectorId, -1);
        // update new collector id
        this.incrementCR(newCollectorId);
    };
    suggestCollectorForReceivables = (receivables, callback = (receivableId, collectorId) => { }) => {
        // sort descending amount
        receivables.sort((r1, r2) => r1.amount - r2.amount);
        receivables.forEach(receivable => {
            let receivableId = receivable.id;
            let receivableAmount = receivable.amount;
            let collectorId;
            // --- START SUGGEST
            // step 1: find match series
            let matchSeries = this.matchSeries.find(series => series.isMatch(receivableAmount));
            if (matchSeries && matchSeries.cppModels.length > 0) {
                // step 2: choose first cpp models
                let model = matchSeries.cppModels[0];
                collectorId = model.CollectorId;
                // step 3: increment CR
                this.incrementCR(collectorId);
            }
            // --- END SUGGEST
            callback(receivableId, collectorId);
        })
    }
}

export class MatchSeries {
    constructor(maxAmount, isBigger) {
        this.maxAmount = maxAmount;
        if (isBigger) {
            this.isMatch = (amount) => (amount > maxAmount);
        } else {
            this.isMatch = (amount) => (amount <= maxAmount);
        }
    }
    maxAmount = 0;
    isMatch = (amount) => (amount <= 0);
    cppModels = [];
}

export const matchData = (state = new MatchData(),
    { type, matchData, cppList, oldCollectorId, newCollectorId }) => {
    switch (type) {
        case Types.SET_MATCH_DATA:
            state = matchData;
            return state;
        case Types.SET_CPP_LIST:
            state.setCppModels(cppList);
            return state;
        case Types.CHANGE_COLLECTOR:
            state.changeCollector(oldCollectorId, newCollectorId);
            return state;
        default: return state;
    }
}

export const calculateMatchPoint = (cppModel, w) => {
    let CR = cppModel.CurrentReceivable;
    if (CR <= 0) {
        CR = 1;
    }
    let matchPoint = (10 * w * cppModel.CPP) / CR;
    return matchPoint;
}

export const sortCpp = (cpp1, cpp2) => {
    return cpp2.MatchPoint - cpp1.MatchPoint;
}

const getW = (amount) => {
    if (amount <= 1000) {
        return 0.075;
    }
    if (amount <= 3000) {
        return 0.075;
    }
    if (amount <= 5000) {
        return 0.15;
    }
    return 0.3;
}

export const convertCurrency = (amount) => {
    return amount / 23000;
}