import React, { Component } from 'react';
import {
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import AppContainer from './Routes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
});

class App extends Component {
  render() {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={this.props.primaryColor} />
        <SafeAreaView style={{ flex: 0, backgroundColor: this.props.primaryColor }} />
        <SafeAreaView style={styles.container}>
          <AppContainer />
        </SafeAreaView>
      </>
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
)(App);
