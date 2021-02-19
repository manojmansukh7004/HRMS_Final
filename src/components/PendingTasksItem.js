/* eslint-disable max-len */
import React, { Component, } from 'react';
import {
  Text, View, StyleSheet, Image,
} from 'react-native';
import { Card } from 'react-native-paper';


const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 10,
    padding: 0
  },
  view: {
    flex: 1,
    padding: 10,
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
  textAttType: {
    flex: 1,
    fontSize: 16,
  },
  textProcess: {
    fontSize: 14,
    alignSelf: 'flex-end',
  },
  textDate: {
    fontSize: 12,
    marginTop: 5,
    color: 'gray',
    alignSelf: 'flex-end'
  },
  flexRow: {
    flexDirection: 'row'
  },
  textName: {
    fontSize: 16,
    marginStart: 5,
    marginEnd: 30
  },
  textPeriod: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
    marginStart: 25
  },
  image: {
    height: 12,
    width: 12,
  },
  imageView1: {
    backgroundColor: '#A8A0FD',
    borderRadius: 10,
    padding: 7,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageView2: {
    backgroundColor: '#FFBE86',
    borderRadius: 10,
    padding: 7,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerVertical: {
    alignItems: 'center',
  },
  flexStart: { justifyContent: 'flex-start', alignItems: 'flex-start', width: '55%' },
  flexEnd: { justifyContent: 'flex-end', alignItems: 'flex-end', width: '45%' }
});

export default class PendingTasksItem extends Component {
  render() {
    return (
      <Card elevation={2} style={styles.container} onPress={() => this.props.onPressItem(this.props.item)}>
        <View style={styles.flexRow}>
          <View style={this.props.index % 2 === 0 ? styles.strip1 : styles.strip2} />
          <View style={styles.view}>
            <View style={styles.flexRow}>
              <View style={[styles.flexRow, styles.flexStart, { paddingEnd: 10 }]}>
                <View style={this.props.index % 2 === 0 ? styles.imageView1 : styles.imageView2}>
                  <Image style={styles.image} source={require('../assets/images/ic_user_inbox.png')} />
                </View>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textName}>{this.props.item.NAME}</Text>
              </View>
              <View style={styles.flexEnd}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textProcess}>{this.props.item.ProcessText}</Text>
              </View>
            </View>
            <View style={styles.flexRow}>
              <View style={styles.flexStart}>
                {
                  this.props.item.BEGDA
                    ? <Text style={styles.textPeriod}>{`${this.props.item.BEGDA} - ${this.props.item.ENDDA}`}</Text> : null
                  }
              </View>
              <View style={styles.flexEnd}>
                <Text style={[styles.textDate]}>{this.props.item.IDATE}</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  }
}
