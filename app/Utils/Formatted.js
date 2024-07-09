export function formatNumber(num) {
    // Convert the number to a string with two decimal places
    let formattedNum = num.toFixed(2);

    // Split the number into integer and decimal parts
    let [integer, decimal] = formattedNum.split('.');

    // Add commas to the integer part
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Combine the integer part with the decimal part
    return `${integer}.${decimal}`;
}

export function firstCapital(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}