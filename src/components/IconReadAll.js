/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { readAllNotifications } from '../services/ReadAllNotifications';
import { setNotifications, setUnreadNotifications } from '../redux/actions/user';


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 24,
    width: 24,
    marginRight: 15
  },
  containerIcon: {
    marginLeft: 10,
    marginRight: 10,
    padding: 10
  },
  badge: {
    position: 'absolute',
    right: 5,
    top: 4,
  }
});

class IconMarkAllRead extends Component {
  markAllRead =async () => {
    const response = await readAllNotifications(this.props.user);
    if (response && response.SuccessList) {
      const { notifications } = this.props;
      notifications.forEach(element => {
        // eslint-disable-next-line no-param-reassign
        element.IsRead = true;
      });
      this.props.setNotifications(notifications);
      this.props.setUnreadNotifications(0);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.4} style={styles.containerIcon} onPress={() => this.markAllRead()}>
          <Icon size={24} color={this.props.color || this.props.primaryColor} name="check-square" />
        </TouchableOpacity>

      </View>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  user: state.user.user,
  unReadNotifications: state.user.unReadNotifications,
  messages: state.messageData.messages,
  notifications: state.user.notifications,
});

const mapDispatchToProps = dispatch => ({
  setNotifications: notifications => {
    dispatch(setNotifications(notifications));
  },
  setUnreadNotifications: count => {
    dispatch(setUnreadNotifications(count));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IconMarkAllRead);
