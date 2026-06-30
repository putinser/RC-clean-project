import {StyleSheet} from 'react-native';

export const primaryButtonStyles = StyleSheet.create({
  button: {
    height: 48,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#04d4f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    color: '#1D242E',
    fontSize: 16,
    fontWeight: '500',
  },
});
