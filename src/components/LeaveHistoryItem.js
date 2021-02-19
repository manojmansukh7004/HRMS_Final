/* eslint-disable react/no-unescaped-entities */
import React, { Component, } from 'react';
import {
  Text, View, StyleSheet, Image
} from 'react-native';
import { Card } from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
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
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25
  },
  strip2: {
    width: 5,
    backgroundColor: '#FFBE86',
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25
  },
  view: {
    flex: 1,
    padding: 8,
  },
  flexStart: { justifyContent: 'flex-start', alignItems: 'flex-start' },
  flexEnd: { justifyContent: 'flex-end', alignItems: 'flex-end' },
  primaryFont: { fontSize: 16 },
  secondaryFont: { fontSize: 12 },
  periodContainerWidth: { width: '52%' },
  leaveTypeWidth: { width: '50%' },
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
  },
  centerVertical: {
    alignItems: 'center'
  },

});

export default class LeaveHistoryItem extends Component {
  state={
    isExpanded: false,
  };

  onPress=() => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  }

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
              <Text style={[styles.flexStart, styles.leaveTypeWidth, styles.primaryFont]}>{this.getType(this.props.item.LeaveType)}</Text>
              <View style={styles.periodContainerWidth}>
                <View style={[styles.flexEnd, styles.periodContainer]}>
                  <Text style={styles.secondaryFont}>
                    {this.props.item.StartDate}
                    {' '}
                      -
                    {' '}
                    {this.props.item.EndDate}
                  </Text>
                </View>
              </View>
            </View>
            {
                this.state.isExpanded
                  ? (
                    <View>
                      <View style={[styles.flexRow, styles.flexStart, styles.rowSpacing]}>
                        <Text style={styles.label}>Day's :</Text>
                        <Text style={{ marginStart: 3 }}>{this.props.item.AbsenceDays}</Text>
                      </View>
                      <Text style={[styles.label, styles.rowSpacing]}>Reason :</Text>
                      <Text>{this.props.item.Reason}</Text>
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
                  : null
            }
          </View>
        </View>
      </Card>
    );
  }
}
