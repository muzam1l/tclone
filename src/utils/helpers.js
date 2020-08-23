function numFormatter(num) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(2) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num < 900) {
        return num; // if value < 1000, nothing to do
    }
}

/**
 * @returns input if good
 * @throws {Error} with msg 'message for front-end'}
 * @param {String} input - input to sanitize
 * @param type - one of name, username, password, custom
 * @param {Object} opts optional setings with sig { min_length, max_length, regex }
 */
function filterInput(input, type = 'custom', {
    min_length: min = 1,
    max_length: max = 70,
    regex: reg = null
} = {}) {
    let regexes = {
        username: RegExp(`^[_a-zA-Z0-9]{${min},${max}}$`),
        password: RegExp(`^\\S{${min},${max}}$`),
        name: RegExp(`.{${min},${max}}`),
    }
    if (!reg) {
        reg = regexes[type]
    }
    if (reg) {
        if (!reg.test(input)) {
            throw Error(`${type} must match regex: ${reg}`)
        }
    }
    //else custom
    else if (input.length > max || input.length < min) {
        throw Error(`inputs must be minimum ${min} and maximum ${max} characters`)
    }
    return input;
}

export { numFormatter, filterInput };