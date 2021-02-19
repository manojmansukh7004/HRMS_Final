/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import {
  TouchableOpacity, View, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Badge } from 'react-native-paper';
import { connect } from 'react-redux';

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

class HamburgerIcon extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.unReadNotifications !== this.props.unReadNotifications;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.4} style={styles.containerIcon} onPress={() => this.props.navigation.navigate('Notifications')}>
          <Icon size={24} color={this.props.color || this.props.primaryColor} name="bell" />
          <Badge size={18} visible={this.props.unReadNotifications !== 0} style={styles.badge}>{this.props.unReadNotifications}</Badge>
        </TouchableOpacity>

      </View>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  notifications: state.user.notifications,
  user: state.user.user,
  unReadNotifications: state.user.unReadNotifications,
});

export default connect(
  mapStateToProps,
)(HamburgerIcon);
