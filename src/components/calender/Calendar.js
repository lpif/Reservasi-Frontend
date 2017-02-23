/**
 * Created by Razi on 2/22/2017.
 */

import React from 'react';
import DayWrapper from './DayWrapper';
import IconButton from 'material-ui/IconButton';
import Left from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import Right from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import ManageCalender from '../../funtions/ManageCalender';

export default class Calendar extends React.Component {
    constructor() {
        super();
        this.monthNameList = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        this.state = {
            now: new Date(),
            day: 0,
            month: 0,
            monthName: "",
            year: 0,
            totalWeeks: 0,
            totalDays: 0,
            firstDay: 0,
            dayConstructor: []
        };

        this.nextMonth = this.nextMonth.bind(this);
        this.prevMonth = this.prevMonth.bind(this);
    }

    componentDidMount() {
        this.setState({
            day: this.state.now.getDate(),
            month: this.state.now.getMonth() + 1,
            monthName: this.monthNameList[this.state.now.getMonth()],
            year: this.state.now.getFullYear()
        }, () => this.updateMonthInfo());
    }

    updateMonthInfo() {
        this.setState({
            totalWeeks: ManageCalender.weekCount(this.state.month, this.state.year),
            totalDays: ManageCalender.daysInMonth(this.state.month, this.state.year),
            firstDay: ManageCalender.firstDayInMonth(this.state.month - 1, this.state.year)
        })
    }

    nextMonth() {
        let nextMonth = this.state.month + 1;
        if (nextMonth === 13) {
            this.setState({
                month: 1,
                monthName: "January",
                year: this.state.year + 1,
                dayConstructor: []
            }, () => this.updateMonthInfo());
        }
        else {
            this.setState({
                month: nextMonth,
                monthName: this.monthNameList[nextMonth - 1],
                dayConstructor: []
            }, () => this.updateMonthInfo());
        }
    }

    prevMonth() {
        let prevMonth = this.state.month - 1;
        if (prevMonth === 0) {
            this.setState({
                month: 12,
                monthName: "December",
                year: this.state.year - 1,
                dayConstructor: []
            }, () => this.updateMonthInfo());
        }
        else {
            this.setState({
                month: prevMonth,
                monthName: this.monthNameList[prevMonth - 1],
                dayConstructor: []
            }, () => this.updateMonthInfo());
        }
    }

    render() {
        const styles = {
            header: {
                width: "91vw",
                marginLeft: "4.2vw",
                marginBottom: "10px",
            },
            headerMonthYear: {
                width: "50%",
                fontSize: "270%",
                fontWeight: 700,
                display: "inline-block"
            },
            headerNav: {
                float: "right",
                width: "50%",
                display: "inline-block"
            },
            navStyle: {
                width: 52,
                height: 52,
                padding: 1
            },
            navIcon: {
                width: 50,
                height: 50
            },
            floatRight: {
                float: "right"
            }
        };

        return (
            <div>
                <div style={styles.header}>
                    <div style={styles.headerMonthYear}>
                        {this.state.monthName} {this.state.year}
                    </div>
                    <div style={styles.headerNav}>
                        <div style={styles.floatRight}>
                            <IconButton
                                tooltip="Prev"
                                iconStyle={styles.navIcon}
                                style={styles.navStyle}
                                onTouchTap={this.prevMonth}
                            >
                                <Left />
                            </IconButton>
                            <IconButton
                                tooltip="Next"
                                iconStyle={styles.navIcon}
                                style={styles.navStyle}
                                onTouchTap={this.nextMonth}
                            >
                                <Right />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <DayWrapper
                    month={this.state.month}
                    year={this.state.year}
                    totalWeeks={this.state.totalWeeks}
                    totalDays={this.state.totalDays}
                    firstDay={this.state.firstDay}
                />
            </div>
        )
    }
}