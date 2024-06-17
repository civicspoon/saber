'use client'
// pages/index.js
import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function page() {
    const [value, onChange] = useState();

    return (
        <div>
                  <DateTimePicker onChange={onChange} value={value} format='yyyy MMM dd HH:MM' />

        </div>
    );
}

export default page;


