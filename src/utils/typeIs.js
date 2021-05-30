export default function typeIs(target, type) {
    return Object.prototype.toString.call(target) === `[object ${type}]`
}