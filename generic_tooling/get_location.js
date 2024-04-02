/**
 * @example
 *     getLatitudeLongitude({fallback: [0,0]})
 *
 * @param {[String]} arg1.fallback - description
 * @returns {Promise} output - description
 *
 */
export function getLatitudeLongitude(arg) {
    const {fallback} = (arg||{})
    if (!navigator.geolocation) {
        if (!fallback) {
            throw Error(`unable to get location, it appears navigator.geolocation is not supported in the runtime`)
        }
        return Promise.resolve({ latitude: fallback[0], longitude: fallback[1] })
    }
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(function(position) {
            resolve(position.coords)
        })
    })
}