export function DDMMYYY(dateval) {
    const shortMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    // ตรวจสอบว่า dateval ไม่เป็นค่าว่าง และไม่เป็น undefined
    if (!dateval) {
        dateval = new Date(); // ถ้าไม่มีค่าถูกส่งเข้ามาให้ใช้วันที่ปัจจุบัน
    }

    const formattedDate = `${dateval.getDate()}-${shortMonths[dateval.getMonth()]}-${dateval.getFullYear()}`;

    return formattedDate;
}

export function monthtext(m){
    const shortMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return shortMonths[m-1]
}

export function HHMM(dateval) {
    const date = new Date(dateval)
    // Get hours and minutes from the date
    const hours = String(date.getHours()).padStart(2, '0'); // Ensure two digits
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two digits

    // Concatenate hours and minutes with a colon in between
    return `${hours}:${minutes}`;
}

export function timeToHHMM(timeString) {
    // Split the time string by ':'
    const parts = timeString.split(':');

    // Extract hours and minutes
    const hours = parts[0];
    const minutes = parts[1];

    // Return formatted time
    return `${hours}:${minutes}`;
}

export function inadCharge(time,rate){
     let cost = 0;
    let [hours, minutes, seconds] = time.split(':').map(Number);
    
    console.log("h ", hours);
    console.log("m ", minutes);
    console.log("cost ", cost);
    if (minutes >= 1) {
        hours += 1; // Add 1 to cost if minutes are greater than or equal to 1
    }
    cost += hours * rate; // Add cost based on hours
    console.log("cost+ ", cost);
    console.log('cost ', cost);
    return (cost);

}

export function getDayOfWeek(date) {
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayIndex = new Date(date).getDay();
    return daysOfWeek[dayIndex];
}
export function TextToWord(n) {
    if (n < 0)
        return false;
    
    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    const single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double_digit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const below_hundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (n === 0) return 'Zero';
    
    // Recursive function to translate the number into words
    function translate(n) {
        let word = "";
        if (n < 10) {
            word = single_digit[n] + ' ';
        } else if (n < 20) {
            word = double_digit[n - 10] + ' ';
        } else if (n < 100) {
            let rem = translate(n % 10);
            word = below_hundred[(n - n % 10) / 10 - 2] + ' ' + rem;
        } else if (n < 1000) {
            word = single_digit[Math.trunc(n / 100)] + ' Hundred ' + translate(n % 100);
        } else if (n < 1000000) {
            word = translate(parseInt(n / 1000)).trim() + ' Thousand ' + translate(n % 1000);
        } else if (n < 1000000000) {
            word = translate(parseInt(n / 1000000)).trim() + ' Million ' + translate(n % 1000000);
        } else {
            word = translate(parseInt(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000);
        }
        return word;
    }
    
    // Get the result by translating the given number
    let result = translate(n);
    return result.trim() + ' ';
}

export function thbtxt(n){
    // Check if n is a string
    if (typeof n !== 'string') {
        return "Input is not a string";
    }

    // Check if n contains a decimal point
    const splitval = n.split('.');
    if (splitval.length !== 2) {
        return "Invalid input format. Please provide a number with a decimal point.";
    }

    // Convert integer part to words
    const fullnum = TextToWord(parseInt(splitval[0]));
    
    // Convert decimal part to words
    const digit = TextToWord(parseInt(splitval[1]));
    
    // Combine the integer and decimal parts into a single string
    let result = fullnum;
    if (digit !== 'Zero') {
        result += ' Baht and ' + digit + ' Satang';
    } else {
        result += ' Baht';
    }

    return result;
}
