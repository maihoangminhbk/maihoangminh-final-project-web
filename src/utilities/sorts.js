/**
 * 
 * @param {*} array 
 * @param {*} order 
 * @param {*} key 
 * @returns 
 */

export const mapOrder = (array, order, key) => {
    array.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]))
    return array
}