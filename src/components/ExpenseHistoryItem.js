import React, { Component } from 'react';
import { Card } from 'react-native-paper';
import {
  View, StyleSheet, Text, Image
} from 'react-native';
import Moment from 'moment';

const styles = StyleSheet.create({
  label: {
    color: '#C1BDBD',
    fontSize: 12
  },

  container: {
    borderRadius: 5,
    marginStart: 8,
    marginEnd: 8,
    marginTop: 10,
    padding: 0
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

export default class ExpenseHistoryItem extends Component {
  state = {
    isExpanded: false,
  };

  onPress=() => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
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
    Moment.locale('en');
    return (
      <Card elevation={2} style={styles.container} onPress={this.onPress}>
        <View style={styles.flexRow}>
          <View style={this.props.index % 2 === 0 ? styles.strip1 : styles.strip2} />
          <View style={styles.view}>
            <View style={styles.flexRow}>
              <View style={{ width: '72%' }}>
                <Text style={styles.label}>Expense Type</Text>
                <Text>{this.props.item.ExpenseTypeName}</Text>
              </View>
              <View style={{ width: '28%' }}>
                <Text style={styles.label}>Expense Amt</Text>
                <Text>{`${this.props.item.Currency} ${this.props.item.ExpenseAmount}`}</Text>
              </View>
            </View>
            {this.state.isExpanded ? (
              <View>
                <View style={styles.flexRow}>
                  <View style={[styles.rowSpacing, { width: '36%' }]}>
                    <Text style={styles.label}>Expense Date</Text>
                    <Text>{Moment(this.props.item.ExpenseDate, 'DD-MM-YYYY').format('DD-MMM-YYYY')}</Text>
                  </View>
                  <View style={[styles.rowSpacing, { width: '36%' }]}>
                    <Text style={styles.label}>Submission Date</Text>
                    <Text>{Moment(this.props.item.InitiatedDate, 'DD-MM-YYYY').format('DD-MMM-YYYY')}</Text>
                  </View>
                  <View style={[styles.rowSpacing, { width: '28%' }]}>
                    <Text style={styles.label}>Verified Amt</Text>
                    <Text>{this.props.item.VerifiedAmount ? `${this.props.item.Currency} ${this.props.item.VerifiedAmount}` : '--'}</Text>
                  </View>
                </View>

                <View style={styles.flexRow}>
                  <View style={[styles.rowSpacing, { width: '36%' }]}>
                    <Text style={styles.label}>Status</Text>
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
                  <View style={styles.rowSpacing}>
                    <Text style={styles.label}>Expense Place</Text>
                    <Text>{this.props.item.ExpensePlace ? `${this.props.item.ExpensePlace}` : '--'}</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </Card>
    );
  }
}
