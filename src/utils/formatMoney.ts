export function formatVND(amount: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function formatNumber(number: number) {
    const roundedNumber = number.toFixed();
    return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
