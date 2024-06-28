import React, { useState, useEffect } from "react";

function DateTimePicker({ Label, initialDateTime, onDateTimeChange }) {
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
    const [isShow, setIsShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(initialDateTime.date || "");
    const [selectedMonth, setSelectedMonth] = useState(initialDateTime.month || "");
    const [selectedYear, setSelectedYear] = useState(initialDateTime.year || new Date().getFullYear().toString());
    const [selectedHour, setSelectedHour] = useState(initialDateTime.hour || "");
    const [selectedMinute, setSelectedMinute] = useState(initialDateTime.minute || "");

    const handleTextboxClick = () => {
        setIsShow(!isShow);
    };

    const handleSetDateTime = () => {
        if (selectedDate && selectedMonth && selectedYear && selectedHour && selectedMinute) {
            const formattedDateTime = `${selectedDate} ${selectedMonth} ${selectedYear} ${selectedHour}:${selectedMinute}`;
            document.querySelector(`input[placeholder="${Label}"]`).value = formattedDateTime;
            setIsShow(false);
            onDateTimeChange({
                date: selectedDate,
                month: selectedMonth,
                year: selectedYear,
                hour: selectedHour,
                minute: selectedMinute
            });
        } else {
            if (typeof window !== 'undefined') {
                import('sweetalert2').then((Swal) => {
                    Swal.default.fire({
                        icon: 'error',
                        title: 'โปรดเลือกวันที่และเวลา',
                        showConfirmButton: false,
                        timer: 1500
                    });
                });
            }
        }
    };

    useEffect(() => {
        setSelectedDate(initialDateTime.date || '');
        setSelectedMonth(initialDateTime.month || '');
        setSelectedYear(initialDateTime.year || new Date().getFullYear().toString());
        setSelectedHour(initialDateTime.hour || '');
        setSelectedMinute(initialDateTime.minute || '');
    }, [initialDateTime]);

    return (
        <div className="items-center justify-center w-96">
            <div>{Label}</div>
            <input
                type="text"
                onClick={handleTextboxClick}
                placeholder={Label}
                readOnly
                className="w-52"
            />
            {isShow && (
                <div className="m-2 rounded-md p-2 mt-4 bg-slate-600 shadow-md w-auto">
                    <div>
                        <div>
                            <label>
                                วันที่:
                                <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                                    <option value="">วันที่</option>
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                    <option value="">เลือกเดือน</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={month}>{month}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <input
                                    type="number"
                                    placeholder="ปี"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="w-20"
                                />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label>
                            เวลา:
                            <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)}>
                                <option value="">เลือกชั่วโมง</option>
                                {hours.map((hour) => (
                                    <option key={hour} value={hour}>{hour}</option>
                                ))}
                            </select>
                        </label>
                        <label>

                            <select value={selectedMinute} onChange={(e) => setSelectedMinute(e.target.value)}>
                                <option value="">เลือกนาที</option>
                                {minutes.map((minute) => (
                                    <option key={minute} value={minute}>{minute}</option>
                                ))}
                            </select>
                            นาที:
                        </label>
                        <div><button className="bg-green-600" onClick={handleSetDateTime}>ตั้งค่า</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DateTimePicker;
