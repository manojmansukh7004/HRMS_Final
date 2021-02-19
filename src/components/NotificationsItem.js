import React, { Component, } from 'react';
import {
  Text, View, StyleSheet, Image
} from 'react-native';
import { connect } from 'react-redux';
import { Card } from 'react-native-paper';

const styles = StyleSheet.create({
  flexColumn: {
    flexDirection: 'column',
  },
  flextRow: {
    flexDirection: 'row'
  },
  container: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
  },
  subContainer: {
    flexDirection: 'column',
    flex: 1,
    padding: 8,
  },
  imageView: {
    borderRadius: 12,
    padding: 12,
    height: 22,
    width: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 14,
    width: 14,
  },
  view: {
    alignItems: 'center',
  },
  centerVertical: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textBody: {
    fontSize: 14,
    marginLeft: 5,
    marginEnd: 10,
    textAlign: 'left',
    paddingEnd: 15
  },

  flexEnd: {
    justifyContent: 'flex-end',
    alignItems: 'stretch'
  },
  selfAlign: {
    alignSelf: 'flex-end'
  },
  timeText: {
    fontSize: 12,
    marginEnd: 5
  }
});

class NotificationsItem extends Component {
  render() {
    return (
      <Card elevation={2} style={styles.container} onPress={() => this.props.onPressItem()}>
        <View style={[styles.subContainer, { backgroundColor: this.props.item.IsRead ? 'white' : '#E7EAED' }]}>
          <View style={[styles.flextRow, styles.view]}>
            <View style={[styles.imageView, { backgroundColor: this.props.secondaryColor }]}>
              <Image style={styles.image} source={require('../assets/images/ic_user_inbox.png')} />
            </View>
            <Text ellipsizeMode="tail" style={styles.textBody}>{this.props.item.NotificationText}</Text>
          </View>
          {/* <Text style={[styles.selfAlign, styles.timeText]}>08:40 AM</Text> */}
        </View>
      </Card>
    );
  }
}


const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  notifications: state.user.notifications,
});


export default connect(
  mapStateToProps,
)(NotificationsItem);
