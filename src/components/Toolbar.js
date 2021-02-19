import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    alignSelf: 'center',
    flex: 1
  },
  blankIcon: {
    height: 30,
    width: 30
  }
});

class Toolbar extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.unReadNotifications !== this.props.unReadNotifications;
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.primaryColor }]}>
        {
          this.props.headerLeft
        }
        <Text style={styles.title}>{this.props.title}</Text>

        {
          this.props.headerRight
            ? this.props.headerRight
            : <View style={styles.blankIcon} />
        }
      </View>
    );
  }
}
const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
  notifications: state.user.notifications,
  unReadNotifications: state.user.unReadNotifications,

});

export default connect(
  mapStateToProps,
)(Toolbar);
