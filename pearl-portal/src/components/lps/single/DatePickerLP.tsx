import { useState } from 'react';
import DatePicker from '../../shared/DatePicker';

const DatePickerLPComponent = () => {
    const minimumDate = new Date('2019-10-01');
    const maximumDate = new Date();
    const [date, setDate] = useState<any>(null);

    /**
    * Sets the start date
    * @param date
    */
    const handleTimestampStartChange = (date: any) => {
        setDate(date);
    };

    return (
        <DatePicker disabled={false}
            onChange={handleTimestampStartChange}
            minDate={minimumDate}
            maxDate={maximumDate}
            isStartDate={false}
            label={'Date'} />
    );
};

export default DatePickerLPComponent;