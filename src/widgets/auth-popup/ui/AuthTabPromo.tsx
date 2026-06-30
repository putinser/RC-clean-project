import {View, Text, StyleSheet} from 'react-native';
import {AuthPopupState} from '../model/authPopupState';

type AuthTabPromoProps = {
  state: AuthPopupState.LOGIN | AuthPopupState.REGISTER_START;
};

export const AuthTabPromo = ({state}: AuthTabPromoProps) => {
  const isRegister = state === AuthPopupState.REGISTER_START;

  return (
    <View style={[styles.root, isRegister ? styles.register : styles.login]}>
      {isRegister ? (
        <Text style={styles.text}>
          Если вы впервые регистрируетесь, получите{' '}
          <Text style={styles.highlight}>2 недели бесплатной</Text> экспертной
          подписки
        </Text>
      ) : (
        <Text style={styles.secondary}>
          Используйте email, указанный при регистрации
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    minHeight: 76,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  login: {
    borderColor: '#464B52',
    backgroundColor: '#181B22',
  },
  register: {
    borderColor: '#56d1fb40',
    backgroundColor: '#56d1fb14',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E8ECF3',
  },
  highlight: {
    fontWeight: '500',
    color: '#56d1fb',
  },
  secondary: {
    fontSize: 14,
    lineHeight: 20,
    color: '#a6aab2',
  },
});
