export function DateDiff(startDateTime, endDateTime) {
    const startDate = new Date(startDateTime.year, startDateTime.month - 1, startDateTime.date, startDateTime.hour, startDateTime.minute);
    const endDate = new Date(endDateTime.year, endDateTime.month - 1, endDateTime.date, endDateTime.hour, endDateTime.minute);

    // คำนวณระยะเวลาระหว่างวันเวลาเริ่มต้นและสิ้นสุดในมิลลิวินาที
    const durationMs = endDate.getTime() - startDate.getTime();

    // แปลงระยะเวลาเป็นชั่วโมงและนาที
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours, minutes };
}

export function  formatDate(dateString) {
    const date = new Date(dateString);
    
    // Array of month names
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    
    // Get day, month, and year
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Format the date as "30 JUNE 2024"
    const formattedDate = `${day} ${month} ${year}`;
    
    return formattedDate;
}
