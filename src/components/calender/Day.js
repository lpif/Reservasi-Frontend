/**
 * Created by Razi on 2/22/2017.
 */

import React from 'react';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import {cyan500} from 'material-ui/styles/colors';
import axios from 'axios';
import ManageDate from '../../funtions/ManageDate';
import config from '../../../appConfig';

export default class Day extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schedules: [],
            showDetail: false,
            detail: '',
            isLoading: true
        };
        this.showDetail = this.showDetail.bind(this);
        this.closeDetail = this.closeDetail.bind(this);
    }

    componentDidMount() {
        this.getSchedule();
    }

    getSchedule() {
        if (this.props.date > 0) {
            this.setState({
                isLoading: true
            });

            const date = ManageDate.pad(this.props.date, 2);
            const month = ManageDate.pad(this.props.month, 2);
            const year = this.props.year;

            axios({
                url: config.API_SERVER + 'schedules/' + year + '-' + month + '-' + date,
                timeout: 10000,
                method: 'get',
            }).then(function (response) {
                this.setState({
                    schedules: response.data,
                    isLoading: false,
                });
            }.bind(this));
        }
    }

    showDetail(id) {
        this.setState({
            showDetail: true,
            detail: this.state.schedules[id]
        });
    }

    closeDetail() {
        this.setState({
            showDetail: false,
            detail: ''
        });
    }

    render() {
        const styles = {
            span: {
                display: "inline-block",
                verticalAlign: "top"
            },
            paperStyle: {
                position: "relative",
                width: "13vw",
                display: "inline-block",
                textAlign: "left",
                padding: "5px 10px 0 10px",
                fontSize: "110%",
                fontWeight: 600
            },
            fiveWeeks: {
                height: "15vh",
            },
            sixWeeks: {
                height: "13vh",
            },
            nanStyle: {
                backgroundColor: "#FAFAFA"
            },
            today: {
                backgroundColor: "#B3E5FC"
            },
            weekEnd: {
                color: "#D50000"
            },
            contentWrapper: {
                height: "10vh",
                overflowY: "auto"
            },
            scheduleStyle: {
                fontSize: 13,
                fontWeight: 400
            },
            dialogStyle: {
                width: "98%",
                maxWidth: "750px",
            },
            tableStyle: {
                textAlign: "left",
                marginTop: "20px"
            }
        };

        const actions = [
            <FlatButton
                label="Close"
                secondary={true}
                onTouchTap={this.closeDetail}
            />
        ];

        let detailModel = "";
        if (this.state.detail !== '') {
            const startTime = this.state.detail.start.substring(11, 16);
            const endTime = this.state.detail.end.substring(11, 16);
            const title = (
                this.state.detail.booking.title + " | " + startTime + " - " + endTime
            );

            let description = "-";
            if (this.state.detail.booking.description.length !== 0) {
                description = this.state.detail.booking.description;
            }

            const detailText = (
                <table style={styles.tableStyle}>
                    <tbody>
                    <tr>
                        <th>Category</th>
                        <th>:</th>
                        <th>{this.state.detail.booking.type.name}</th>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <th>:</th>
                        <th>{description}</th>
                    </tr>
                    <tr>
                        <th>Reserved by</th>
                        <th>:</th>
                        <th>{this.state.detail.booking.user.name}</th>
                    </tr>
                    </tbody>
                </table>
            );
            detailModel = (
                <Dialog
                    title={title}
                    actions={actions}
                    modal={false}
                    open={this.state.showDetail}
                    onRequestClose={this.closeDetail}
                    autoScrollBodyContent={true}
                    contentStyle={styles.dialogStyle}>
                    {detailText}
                </Dialog>
            );
        }

        let content;
        if (this.state.isLoading === true) {
            content = <CircularProgress size={30} thickness={5}/>
        }
        else {
            if (this.state.schedules.length > 0 && this.props.date > 0) {
                content = this.state.schedules.map(function (schedule, index) {
                    const startTime = schedule.start.substring(11, 16);
                    const endTime = schedule.end.substring(11, 16);
                    return (
                        <Chip
                            key={schedule.id.toString() + this.props.date.toString() + this.props.month.toString() + this.props.year.toString()}
                            onTouchTap={() => this.showDetail(index)}
                            style={styles.scheduleStyle}
                        >
                            {startTime + " - " + endTime}
                        </Chip>
                    );
                }.bind(this));
            }
        }

        const contentWrapper = (
            <div style={styles.contentWrapper}>
                {content}
            </div>
        );

        let heightPaper = styles.fiveWeeks;
        if (this.props.totalWeeks > 5) {
            heightPaper = styles.sixWeeks;
        }

        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth();
        const year = today.getFullYear();
        let todayStatus = "";
        if(date === this.props.date && month+1 === this.props.month && year === this.props.year) {
            todayStatus = <ActionGrade color={cyan500}/>;
        }

        let dayText = " ";
        if (this.props.date > 0) {
            if (this.props.day === 0 || this.props.day === 6) {
                dayText = (
                    <Paper style={Object.assign({}, styles.paperStyle, heightPaper)} zDepth={1}>
                        <div style={styles.weekEnd}>
                            <span>{this.props.date}</span>
                            <span style={{float: "right"}}>{todayStatus}</span>
                        </div>
                        {contentWrapper}
                    </Paper>
                );
            }
            else {
                dayText = (
                    <Paper style={Object.assign({}, styles.paperStyle, heightPaper)} zDepth={1}>
                        <div>
                            <span>{this.props.date}</span>
                            <span style={{float: "right"}}>{todayStatus}</span>
                        </div>
                        {contentWrapper}
                    </Paper>
                );
            }
        }
        else {
            dayText = (
                <Paper style={Object.assign({}, styles.paperStyle, styles.nanStyle, heightPaper)} zDepth={1}>
                    <div>&nbsp;</div>
                </Paper>
            );
        }

        return (
            <div style={Object.assign({}, styles.span, heightPaper)}>
                {detailModel}
                {dayText}
            </div>
        )
    }
}
