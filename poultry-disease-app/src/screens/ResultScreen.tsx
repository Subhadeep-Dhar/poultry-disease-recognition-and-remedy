import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultScreen = () => (
  <View style={styles.container}>
    <Text>Result Screen</Text>
  </View>
);

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
export default ResultScreen;
