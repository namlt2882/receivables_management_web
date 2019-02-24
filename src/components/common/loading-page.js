export const available = (action) => {
    new Promise(action).then(() => {
        setAvailable()
    });
}

export const loading = (action) => {
    new Promise(action).then(() => {
        setLoading()
    });
}

const setAvailable = () => {
    const ele = document.getElementById('ipl-progress-indicator')
    if (ele) {
        ele.classList.add('available')
    }
}

const setLoading = () => {
    const ele = document.getElementById('ipl-progress-indicator')
    if (ele) {
        ele.classList.remove('available')
    }
}
