const calculateTip = (subtotal, tipPercent = 0.25) => subtotal + subtotal * tipPercent

module.exports = {
    calculateTip
}