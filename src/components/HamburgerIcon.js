import React, { Component } from 'react';
import {
  TouchableOpacity, View, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  image: {
    height: 22,
    width: 28,
    marginLeft: 5,
  },
});

class HamburgerIcon extends Component {
    toggleDrawer = () => {
      this.props.navigation.toggleDrawer();
    };

    render() {
      return (
        <View style={styles.container}>
          <TouchableOpacity onPress={this.toggleDrawer}>
            <Icon name="navicon" size={36} color={this.props.color || this.props.primaryColor} />
          </TouchableOpacity>
        </View>
      );
    }
}


const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
});

export default connect(
  mapStateToProps,
)(HamburgerIcon);
