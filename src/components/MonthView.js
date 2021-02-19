import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 22,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  containerWeek: {
    marginBottom: 4,
    marginTop: 4,
    flex: 1,
    height: 20
  },
  textWeek: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12
  },
  textDay: {
    flex: 1,
    fontSize: 15,
    padding: 4,
    textAlign: 'center'
  },
  btnText: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


class MonthView extends Component {
  getDayColor = item => {
    if (item.item) {
      /* if (item.item.Holiday === 'YES') {
        return this.props.holidayColor;
      }
      if (item.item.Leave === 'YES') {
        return this.props.leaveColor;
      }
      if (item.item.AttStatus === 'Absent') {
        return this.props.absentColor;
      }
      if (item.item.AttStatus === 'MissingPunches') {
        return this.props.missingPunchColor;
      }
      if (item.item.AttStatus === 'Weekly Off') {
        return this.props.weeklyOffColor;
      }
      if (item.item.AttStatus === 'Offsite') {
        return this.props.presentColor;
      }
      if (item.item.AttStatus === 'Work From Home') {
        return this.props.presentColor;
      }
      if (item.item.AttStatus === 'Outstation Business Tour') {
        return this.props.presentColor;
      }
      if (item.item.AttStatus === 'Training') {
        return this.props.presentColor;
      }
      return 'white'; */
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.props.calenderLegends.length; i++) {
        if (item.item.AttStatus === this.props.calenderLegends[i].LegendName) {
          return this.props.calenderLegends[i].LegendColorCode;
        }
      }
    }
    return 'white';
  }

  getTextColor = item => {
    if (item.item) {
      if (item.item.AttStatus === '') {
        return 'black';
      }
      return 'white';
    }
    return 'black';
  }

  render() {
    let rows = [];
    rows = this.props.data.map((row, rowIndex) => {
      const rowItems = row.map((item) => (

        rowIndex === 0 ? (
          <View style={styles.containerWeek}>
            <Text style={styles.textWeek}>{item.day ? item.day : ''}</Text>
          </View>
        )
          : (
            <TouchableOpacity
              style={[styles.btnText, { backgroundColor: this.getDayColor(item) }]}
              disabled={!item.item}
              onPress={() => this.props.onPress(item)}
            >
              <Text style={[styles.textDay, { color: this.getTextColor(item) }]}>
                {item.day ? item.day : ''}
              </Text>
            </TouchableOpacity>
          )


      ));
      return <View style={styles.container}>{rowItems}</View>;
    });

    return <View>{rows}</View>;
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  presentColor: state.theme.presentColor,
  absentColor: state.theme.absentColor,
  holidayColor: state.theme.holidayColor,
  weeklyOffColor: state.theme.weeklyOffColor,
  leaveColor: state.theme.leaveColor,
  missingPunchColor: state.theme.missingPunchColor,
  calenderLegends: state.theme.calenderLegends,
});

export default connect(
  mapStateToProps,
)(MonthView);
