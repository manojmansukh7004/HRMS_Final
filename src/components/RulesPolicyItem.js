/* eslint-disable max-len */
import React, { Component } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { connect } from 'react-redux';
import { SvgXml } from 'react-native-svg';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  card: {
    borderRadius: 30,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  img: {
    height: 24,
    width: 24,
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10
  }
});


class RulesPolicyItem extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => this.props.onPress()} style={styles.container}>
        <View style={[styles.card, { backgroundColor: this.props.primaryColor }]} onPress={this.props.onPress} activeOpacity={0.5}>
          <SimpleLineIcon name={this.props.icon} color="white" size={20} />
        </View>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{this.props.title}</Text>

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
)(RulesPolicyItem);
