import {StyleSheet} from 'react-native';

export const authFormStyles = StyleSheet.create({
  root: {
    width: '100%',
  },
  field: {
    marginBottom: 16,
  },
  linkWrap: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  link: {
    color: '#56d1fb',
    textAlign: 'center',
    fontSize: 15,
  },
  error: {
    marginBottom: 16,
    fontSize: 13,
    color: '#ec1c1c',
    textAlign: 'center',
  },
  successText: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    color: '#a6aab2',
    textAlign: 'center',
  },
});

export const authPopupStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#060b12',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#060b12',
  },
  loadingText: {
    color: '#a6aab2',
    fontSize: 14,
  },
  padding: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#464B52',
    backgroundColor: '#0F1115',
    padding: 24,
  },
  cardInvalid: {
    borderColor: '#EC1C1C66',
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E8ECF3',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#a6aab2',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#a6aab2',
  },
  helloIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#1BCD5466',
    backgroundColor: '#1BCD541A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  helloTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E8ECF3',
    textAlign: 'center',
  },
  helloName: {
    color: '#56d1fb',
  },
  helloSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#a6aab2',
    textAlign: 'center',
  },
  privacy: {
    marginTop: 24,
    fontSize: 12,
    lineHeight: 18,
    color: '#a6aab2',
    textAlign: 'center',
  },
  privacyLink: {
    color: '#56d1fb',
  },
  helloScreen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  helloButton: {
    marginTop: 24,
    width: '100%',
  },
});
