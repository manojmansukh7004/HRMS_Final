/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { connect } from 'react-redux';
import { SvgXml } from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  card: {
    borderRadius: 30,
    height: 55,
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  img: {
    height: 22,
    width: 22,
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10
  }
});

class HomeItem extends Component {
  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <View style={[styles.card, { backgroundColor: this.props.secondaryColor }]} activeOpacity={0.5}>
          <SvgXml
            width="45%"
            height="45%"
            xml={this.props.svg}
          />
        </View>
        <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.title, { color: this.props.textColor || this.props.primaryColor }]}>{this.props.title}</Text>

      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => ({
  primaryColor: state.theme.primaryColor,
  secondaryColor: state.theme.secondaryColor,
});

export default connect(
  mapStateToProps,
)(HomeItem);
