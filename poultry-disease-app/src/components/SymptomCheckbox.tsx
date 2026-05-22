import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SymptomCheckbox = () => (
  <View style={styles.container}>
    <Text>Symptom Checkbox</Text>
  </View>
);

const styles = StyleSheet.create({ container: { flexDirection: 'row', alignItems: 'center', margin: 8 } });

export default SymptomCheckbox;
