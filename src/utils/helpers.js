import DOMPurify from 'dompurify';
/**
 * truncates text after n newlines
 * @param {String} text to trunaate 
 * @param {Number} lines number of lines to have
 */
export const truncateText = (text, lines) => {
    if (!text)
        return ''
    let n = 0, i = 0
    let length = text.length
    for (i = 0; i < length; i++)
        if (text[i] === '\n')
            if (n++ >= lines - 1)
                break
    return text.slice(0, i) + ((length > i + 1) ? ' ...' : '')
}

export function numFormatter(num) {
    if (num >= 1000 && num < 1000000) {
        return (num / 1000).toFixed(2) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num < 1000) {
        return num; // if value < 1000, nothing to do
    }
}

/**
 * @returns input if good
 * @throws {Error} with msg 'message for front-end'}
 * @param {String} input - input to sanitize
 * @param type - one of 'name', 'username', 'password', 'html', 'custom'
 * @param {Object} opts optional setings with sig { min_length, max_length, regex }
 */
export function filterInput(input = '', type = 'custom', {
    min_length: min = 1,
    max_length: max = 70,
    regex: reg = null,
    identifier = null
} = {}) {
    identifier = identifier || `input {${type}}`
    input = input.toString().trim()
    let regexes = {
        username: RegExp(`^[_a-zA-Z0-9]{${min},${max}}$`),
        password: RegExp(`^\\S{${min},${max}}$`),
        name: RegExp(`^.{${min},${max}}$`),
    }
    if (!reg) {
        reg = regexes[type]
    }
    if (reg) {
        if (!reg.test(input)) {
            throw Error(`${identifier} must match regex: ${reg} (range between ${min} and ${max} characters)`)
        }
    }
    //else custom || html
    if (type === 'html')
        input = DOMPurify.sanitize(input, { ALLOWED_TAGS: ['b'] }).trim()
    if (input.length > max || input.length < min) {
        throw Error(`${identifier} must be minimum ${min} and maximum ${max} characters`)
    }
    if (input.includes('\n')) // long text, strip of multiple newlines etc
        input = input.replace(/\n+/g, '\n').trim()
    return input;
}