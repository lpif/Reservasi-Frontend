/**
 * Created by Razi on 2/23/2017.
 */

import React from 'react';
import DayHeaderName from './DayHeaderName';
import Day from './Day';

export default class DayWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        return !(this.props.totalWeeks === nextProps.totalWeeks && this.props.totalDays === nextProps.totalDays && this.props.firstDay === nextProps.firstDay);
    }

    constructDays() {
        let month = [];
        let countDate = 1 - this.props.firstDay;
        for (let i = 0; i < this.props.totalWeeks; i++) {
            let week = [];
            for (let j = 0; j < 7; j++) {
                const dayTmp = (
                    <Day
                        key={"day-i" + i.toString() + "j" + j.toString() + this.props.month.toString() + this.props.year.toString()}
                        date={countDate}
                        month={this.props.month}
                        year={this.props.year}
                        day={j}
                        totalWeeks={this.props.totalWeeks}
                    />
                );
                week.push(dayTmp);
                countDate += 1;
                if (countDate > this.props.totalDays) countDate = -7;
            }
            const weekTmp = (
                <div key={"div" + i.toString() + this.props.month.toString() + this.props.year.toString()}>
                    {week}
                </div>
            );
            month.push(weekTmp);
        }
        return month;
    }

    render() {
        const dayConstructor = this.constructDays();
        const styles = {
            container: {
                width: "91vw",
                display: "inline-block",
                marginLeft: "4.2vw",
                marginBottom: "80px",
                height: "auto",
            }
        };
        return (
            <div style={styles.container}>
                <DayHeaderName />
                {dayConstructor}
            </div>
        )
    }
}
