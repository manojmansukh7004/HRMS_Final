import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';

class BottomBarIcon extends Component {
  render() {
    return (
      <Icon
        name={this.props.name}
        size={20}
        color={this.props.focused ? this.props.secondaryColor : 'gray'}
      />
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
});

export default connect(
  mapStateToProps,
)(BottomBarIcon);
