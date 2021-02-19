/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable radix */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Dimensions, Image, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import Moment from 'moment';
import { months } from '../config/Constants';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {
    alignSelf: 'center',
    alignItems: 'center',
    height: 100,
  },
  container: {
    width: width - 40,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10
  },
  itemContainer: {
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  itemIcon: {
    height: 20,
    width: 20,
  },
  textItem: {
    marginLeft: 10,
    fontSize: 16
  }
});

class CalenderModal extends Component {
  constructor(props) {
    super(props);
    this.currentDate = new Date();
    this.item = this.props.item;
  }


  renderItem = (text) => (
    <TouchableOpacity onPress={() => this.props.onOptionSelected(text, this.props.item)} style={styles.itemContainer}>
      <Image style={styles.itemIcon} source={text === 'Leave Application' ? require('../assets/images/ic_modal1.png') : require('../assets/images/ic_modal2.png')} />
      <Text style={styles.textItem}>{text}</Text>
    </TouchableOpacity>
  )

  renderItems = item => {
    const actionsData = this.props.legendActions.filter(action => {
      let q = '';
      if (item.WeeklyOff === 'YES') {
        q = 'Weekly Off';
      } else if (item.Holiday === 'YES') {
        q = 'Holiday';
      }
      return action.LegendName === q;
    });
    let selectedDate = Moment(item.Date).format('YYYY-MM-DD');
    selectedDate = Moment(selectedDate);
    let arrBtn = [];
    let now = Moment().format('YYYY-MM-DD');
    now = Moment(now);
    const leaveBackdated = this.props.policyConfig.filter(policy => policy.keyField === 'BackDated');

    const attBackdated = this.props.policyConfig.filter(policy => policy.keyField === 'AttBackDated');

    const leaveAppValidDate = Moment(Moment(now, 'YYYY-MM-DD').subtract(Number(leaveBackdated[0].valueField), 'days').format('YYYY-MM-DD'));
    const attAppValidDate = Moment(Moment(now, 'YYYY-MM-DD').subtract(Number(attBackdated[0].valueField), 'days').format('YYYY-MM-DD'));
    // eslint-disable-next-line no-unused-vars
    let AttOrLeave = 'AttReg';
    let AttOrLeaveText = 'Attendance';
    if (item.Leave === 'YES') {
      AttOrLeave = 'Leave';
      AttOrLeaveText = 'Leave';
    }
    if (Number(item.UwlId) > 0 && item.IsApproved === '1') {
      const obj = {
        text: `Cancel ${AttOrLeaveText}`,
        type: 'Cancel'
      };
      arrBtn.push(obj);
    } else if (Number(item.UwlId) > 0 && item.IsApproved === '0') {
      const obj = {
        text: `PullOut ${AttOrLeaveText}`,
        type: 'PullOut'
      };
      arrBtn.push(obj);
    } else {
      if (now > selectedDate && selectedDate > attAppValidDate && (item.UwlId === '0' || item.UwlId === '' || item.UwlId === undefined)) {
        const obj = {
          text: 'Attendance Regularization',
          type: 'AttReg'
        };
        arrBtn.push(obj);
      }
      if (selectedDate > leaveAppValidDate && (item.UwlId === '0' || item.UwlId === '' || item.UwlId === undefined)) {
        const obj = {
          text: 'Leave Application',
          type: 'Leave'
        };
        arrBtn.push(obj);
      }
    }

    if (actionsData.length > 0) {
      for (let i = 0; i < actionsData.length; i++) {
        for (let j = 0; j < arrBtn.length; j++) {
          if (arrBtn[j].type === actionsData[i].ActionNotApplicable) {
            arrBtn.splice(j, 1);
          }
        }
      }
    }
    // if (Yesterday == $(spanDay).parent().parent().find('.fc-day-top')
    //   .attr('data-date') && $(spanDay).attr('IsNightShift') == '1') {
    //   arrBtn = $.grep(arrBtn, (actions) => actions.value != 'AttReg');
    // }

    if (item.LeaveAppStatus === 'Under Cancellation' || item.AttendanceAppStatus === 'Under Cancellation') {
      arrBtn = [];
      const obj = {
        text: `${AttOrLeaveText} Under Cancellation`,
        type: 'UnderCancellation'
      };
      arrBtn.push(obj);
    }

    if (arrBtn.length > 0) {
      return (
        <View>
          {
             arrBtn.map(i => this.renderItem(i.text))
          }
        </View>
      );
    }

    return null;
  }

  render() {
    if (this.props.item) {
      let selectedDate = Moment(this.props.item.Date).format('YYYY-MM-DD');
      selectedDate = Moment(selectedDate);
      let now = Moment().format('YYYY-MM-DD');
      now = Moment(now);

      if (selectedDate >= now && (this.props.item.WeeklyOff === 'YES' || this.props.item.Holiday === 'YES')) {
        return null;
      }

      const items = this.renderItems(this.props.item);
      if (items) {
        return (
          <Modal
            style={styles.modal}
            isVisible={this.props.isVisible}
            onBackdropPress={this.props.hideModal}
            onBackButtonPress={this.props.hideModal}
          >
            {
              this.props.item
                ? (
                  <View style={styles.container}>
                    <Text style={{ fontSize: 16, marginBottom: 6, }}>
                      {
                      `${months[parseInt(this.props.item.Date.substring(4, 6) - 1)]} ${this.props.item.Date.substring(6, 8)}      `
                      }
                      <Text style={{ fontSize: 14, marginBottom: 6, textAlign: 'right' }}>{`${this.props.item.TimeIn === '00:00' ? '' : `In: ${this.props.item.TimeIn}`}    ${this.props.item.TimeOut === '00:00' ? '' : `Out: ${this.props.item.TimeOut}`}`}</Text>
                    </Text>
                    {
                      items
                    }

                  </View>
                ) : null
            }

          </Modal>
        );
      }
    } return null;
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  policyConfig: state.policy.policyConfig,
  legendActions: state.legendActions.legendActions
});

export default connect(
  mapStateToProps,
)(CalenderModal);
