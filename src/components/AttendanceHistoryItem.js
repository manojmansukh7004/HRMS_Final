import React, { Component, } from 'react';
import {
  Text, View, StyleSheet, Image
} from 'react-native';
import { Card } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    marginStart: 8,
    marginEnd: 8,
    marginTop: 10
  },
  flexRow: {
    flexDirection: 'row'
  },
  strip1: {
    width: 5,
    backgroundColor: '#A8A0FD',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10
  },
  strip2: {
    width: 5,
    backgroundColor: '#FFBE86',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10
  },
  view: {
    flex: 1,
    padding: 8,
  },
  flexStart: { justifyContent: 'flex-start', alignItems: 'flex-start' },
  flexEnd: { justifyContent: 'flex-end', alignItems: 'flex-end' },
  primaryFont: { fontSize: 16 },
  secondaryFont: { fontSize: 12 },
  periodContainerWidth: { width: '30%' },
  leaveTypeWidth: { width: '70%' },
  periodContainer: {
    backgroundColor: '#ECECEC', padding: 5, borderRadius: 14, alignSelf: 'center'
  },
  label: {
    color: 'gray',
    fontSize: 14
  },
  rowSpacing: {
    marginTop: 5
  },
  imageStatus: {
    height: 12,
    width: 12,
    marginEnd: 5
  },
  centerVertical: {
    alignItems: 'center'
  },
});

export default class AttendanceHistoryItem extends Component {
  state={
    isExpanded: false,
  };

  onPress=() => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  }

  tConv24 = (time24) => {
    if (time24) {
      let ts = time24;
      const H = +ts.substr(0, 2);
      let h = (H % 12) || 12;
      h = (h < 10) ? (`0${h}`) : h;
      const ampm = H < 12 ? ' AM' : ' PM';
      ts = h + ts.substr(2, 3) + ampm;
      return ts;
    }
    return '00:00';
  };

  getType=(type) => {
    if (type) {
      const split = type.split(': ');
      const typeValue = split[0];
      const typeText = split[1];
      if (typeText) {
        return typeText;
      }
    }
    return null;
  }

  getColor=(status) => {
    if (status === 'Approved') {
      return {
        color: '#ADDB31'
      };
    } if (status === 'Rejected') {
      return {
        color: '#E76E54'
      };
    }
    return {
      color: '#75B9EE'
    };
  }

  render() {
    return (
      <Card elevation={2} style={styles.container} onPress={this.onPress}>
        <View style={styles.flexRow}>
          <View style={this.props.index % 2 === 0 ? styles.strip1 : styles.strip2} />
          <View style={styles.view}>

            <View style={styles.flexRow}>
              <Text style={[styles.flexStart, styles.leaveTypeWidth, styles.primaryFont]}>{this.getType(this.props.item.AttendanceType)}</Text>
              <View style={styles.periodContainerWidth}>
                <View style={[styles.flexEnd, styles.periodContainer]}>
                  <Text style={styles.secondaryFont}>{this.props.item.StartDate}</Text>
                </View>
              </View>
            </View>
            {this.state.isExpanded
              ? (
                <View>
                  <View style={styles.flexRow}>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.label}>Start Time: </Text>
                      <Text>{this.props.item.StartTime ? this.tConv24(this.props.item.StartTime) : '-- : --'}</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.label}>End Time: </Text>
                      <Text>{this.props.item.EndTime ? this.tConv24(this.props.item.EndTime) : '-- : --'}</Text>
                    </View>
                  </View>

                  <Text style={[styles.label, styles.rowSpacing]}>Reason :</Text>
                  <Text>{this.props.item.Reason ? this.props.item.Reason : '--'}</Text>

                  <View style={[styles.flexRow, styles.rowSpacing]}>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.label}>Initiation Date : </Text>
                      <Text>{this.props.item.InitiatedDate}</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.label}>Status :</Text>
                      <View style={[styles.flexRow, styles.centerVertical]}>
                        {this.props.item.Status === 'Approved'
                          ? (
                            <Image
                              style={styles.imageStatus}
                              source={require('../assets/images/ic_check.png')}
                            />
                          ) : null}

                        {this.props.item.Status === 'Rejected'
                          ? (
                            <Image
                              style={styles.imageStatus}
                              source={require('../assets/images/ic_cross.png')}
                            />
                          ) : null}
                        <Text style={this.getColor(this.props.item.Status)}>{this.props.item.Status}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.label, styles.rowSpacing]}>Approvers Comment</Text>
                  <Text>{this.props.item.ApprComments ? this.props.item.ApprComments : '--'}</Text>
                </View>
              )
              : null}
          </View>
        </View>
      </Card>
    );
  }
}
