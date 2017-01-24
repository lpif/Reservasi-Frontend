/**
 * Created by Razi on 12/26/2016.
 */

export default class ManageDate {
    static getReadableDate(dateObject) {
        if (dateObject !== null && dateObject !== undefined && dateObject.length !== 0) {
            const dayName = [
                'Sunday', 'Monday', 'Tuesday', 'Wednesday',
                'Thursday', 'Friday', 'Saturday',
            ];
            const monthName = [
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December',
            ];
            const date = dateObject.getDate();
            const day = parseInt(dateObject.getDay(), 10);
            const month = parseInt(dateObject.getMonth(), 10);
            const year = dateObject.getFullYear();

            return dayName[day] + ", " + date + " " + monthName[month] + " " + year;
        }
    }

    static getReadableTime(dateObject) {
        if (dateObject !== null && dateObject !== undefined && dateObject.length !== 0) {
            const hour = ManageDate.pad(parseInt(dateObject.getHours(), 10), 2);
            const minute = ManageDate.pad(parseInt(dateObject.getMinutes(), 10), 2);
            return hour+":"+minute;
        }
    }

    // http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
    static pad(num, size) {
        const s = "000000000" + num;
        return s.substr(s.length-size);
    }
}
