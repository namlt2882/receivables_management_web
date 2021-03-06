export const findInArray = function (arr, id) {
    var returnValue = null;
    arr.some((origin) => {
        if (origin.id === id) {
            returnValue = { ...origin };
            return true;
        } else {
            return false;
        }
    });
    return returnValue;
}

export const findAndEdit = function (arr, record) {
    var returnValue = null;
    arr.some((origin) => {
        if (origin.id === record.id) {
            origin = { ...record };
            returnValue = { ...origin };
            return true;
        } else {
            return false;
        }
    });
    return returnValue;
}

export const findAndRemove = function (arr, id) {
    var index = -1;
    arr.some((origin) => {
        index++;
        if (origin.id === id) {
            return true;
        } else {
            return false;
        }
    });
    if (index > -1) {
        arr.splice(index, 1);
        return true;
    } else {
        return false;
    }
}

export const doWithFirstOne = function (arr, id, callback) {
    var returnValue = null;
    arr.some((origin) => {
        if (origin.id === id) {
            callback(origin);
            returnValue = { ...origin };
            return true;
        } else {
            return false;
        }
    });
    return returnValue;
}

export const findIndex = function (arr, id) {
    let index = -1;
    arr.some((origin) => {
        index++;
        if (origin.id === id) {
            return true;
        } else {
            return false;
        }
    })
    return index;
}

export const IdGenerator = {
    IncrementSeed: -1,
    generateId: function () {
        IdGenerator.IncrementSeed = IdGenerator.IncrementSeed - 1;
        return IdGenerator.IncrementSeed;
    }
}

export const ifNullElseNull = (val) => {
    return val ? val : null;
}

export const ifNullElseString = (val) => {
    return val ? val : '';
}