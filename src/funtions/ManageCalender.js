/**
 * Created by Razi on 2/22/2017.
 */

export default class ManageCalender {
    // http://stackoverflow.com/questions/2483719/get-weeks-in-month-through-javascript
    static weekCount(month, year) {
        const firstOfMonth = new Date(year, month-1, 1);
        const lastOfMonth = new Date(year, month, 0);
        const used = firstOfMonth.getDay() + lastOfMonth.getDate();
        return Math.ceil( used / 7);
    }

    // http://stackoverflow.com/questions/1184334/get-number-days-in-a-specified-month-using-javascript
    static daysInMonth(month,year) {
        return new Date(year, month, 0).getDate();
    }

    static firstDayInMonth(month, year) {
        return new Date(year, month, 1).getDay();
    }
}
