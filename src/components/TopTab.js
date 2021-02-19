/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MaterialTopTabBar } from 'react-navigation-tabs';

class TopTab extends Component {
  render() {
    return (
      <MaterialTopTabBar
        {...this.props}
        style={{ backgroundColor: this.props.primaryColor }}
        indicatorStyle={{
          borderBottomColor: this.props.secondaryColor,
          borderBottomWidth: 4,
        }}
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
)(TopTab);
