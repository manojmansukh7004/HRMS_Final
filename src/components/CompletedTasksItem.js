/* eslint-disable max-len */
import React, { Component, } from 'react';
import {
  Text, View, StyleSheet, Image
} from 'react-native';
import { Card } from 'react-native-paper';


const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 10,
  },
  view: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  strip: {
    width: 5,
    backgroundColor: '#33C038',
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25
  },
  textAttType: {
    fontSize: 16,
    marginLeft: 5,
  },
  textProcess: {
    fontSize: 14,
    alignSelf: 'flex-end'
  },
  textDate: {
    fontSize: 12,
    color: 'gray',
    alignSelf: 'flex-end'
  },
  flexRow: {
    flexDirection: 'row'
  },
  textName: {
    fontSize: 16
  },
  textPeriod: {
    marginTop: 10,
    fontSize: 11,
    color: 'gray',
  },
  image: {
    height: 12,
    width: 12,
  },
  imageView: {
    backgroundColor: '#A8A0FD',
    borderRadius: 10,
    padding: 7,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewStatus: {
    borderRadius: 15,
    borderColor: 'gray',
    borderWidth: 0.3,
    width: '100%',
    margin: 10,
    padding: 10,
  },
  imageStatus: {
    height: 12,
    width: 12,
  },
  centerVertical: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  flexStart: { justifyContent: 'flex-start', alignItems: 'flex-start', width: '55%' },
  flexEnd: { justifyContent: 'flex-end', alignItems: 'flex-end', width: '45%' }
});

export default class CompletedTasksItem extends Component {
  state={
    isExpanded: false,
  };

  onPress= () => {
    this.setState((prevState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  }

  render() {
    return (
      <Card elevation={2} style={styles.container} onPress={this.onPress}>

        <View style={styles.flexRow}>
          <View style={styles.strip} />
          <View style={styles.view}>
            <View style={styles.flexRow}>
              <View style={[styles.flexRow, styles.flexStart, { paddingEnd: 20 }]}>
                <View style={styles.imageView}>
                  <Image style={styles.image} source={require('../assets/images/ic_user_inbox.png')} />
                </View>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textAttType}>{this.props.item.Name}</Text>
              </View>

              <View style={styles.flexEnd}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textProcess}>{this.props.item.ProcessText}</Text>
              </View>
            </View>
            <Text style={styles.textDate}>{this.props.item.InitiatedDate}</Text>
            {
              this.state.isExpanded
                ? (
                  <View style={styles.viewStatus}>
                    <View style={[styles.flexRow, styles.centerVertical]}>
                      <Image
                        style={styles.imageStatus}
                        source={this.props.item.ApproverAction === 'Rejected'
                          ? require('../assets/images/ic_cross.png') : require('../assets/images/ic_check.png')}
                      />
                      <Text style={{ flex: 1, fontSize: 16, marginLeft: 10 }}>{this.props.item.ApproverAction}</Text>
                      <Text style={styles.textDate}>{this.props.item.ActionTakenOn}</Text>
                    </View>
                    <Text numberOfLines={3}>{this.props.item.ApproverComments}</Text>
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
