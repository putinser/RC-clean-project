# RC2App

React Native приложение без Expo, полностью настроенное с TypeScript, ESLint и Prettier.

## 📋 Содержание

- [Требования](#требования)
- [Установка](#установка)
- [Запуск приложения](#запуск-приложения)
- [Сборка для тестирования без Metro](#сборка-для-тестирования-без-metro)
- [Структура проекта](#структура-проекта)
- [Доступные скрипты](#доступные-скрипты)
- [Конфигурация](#конфигурация)
- [Разработка](#разработка)

## 🔧 Требования

Перед началом работы убедитесь, что у вас установлено:

- **Node.js**: >= 20.x
- **npm** или **yarn**
- **React Native CLI**: `npm install -g react-native-cli`

### Для Android разработки:
- Android Studio
- Android SDK
- Java Development Kit (JDK) 17 или выше
- Android emulator или физическое устройство

### Для iOS разработки (только macOS):
- Xcode (последняя версия)
- CocoaPods: `sudo gem install cocoapods`
- iOS Simulator или физическое устройство

## 🚀 Установка

1. Клонируйте репозиторий:
```bash
git clone <your-repo-url>
cd RC2App
```

2. Установите зависимости:
```bash
npm install
```

3. Для iOS установите pod зависимости:
```bash
cd ios && pod install && cd ..
```

## 📱 Запуск приложения

### Android

1. Запустите Metro bundler:
```bash
npm start
```

2. В другом терминале запустите Android приложение:
```bash
npm run android
```

Или используйте команду:
```bash
npx react-native run-android
```

### iOS (только macOS)

1. Запустите Metro bundler:
```bash
npm start
```

2. В другом терминале запустите iOS приложение:
```bash
npm run ios
```

Или используйте команду:
```bash
npx react-native run-ios
```

## 📦 Сборка для тестирования без Metro

Для ежедневной разработки используйте обычный `debug` — он работает с Metro, Fast Refresh и dev menu.

Для отправки заказчику или тестировщику собирайте **`debugEmbedded`**: JS-бандл вшит в приложение, Metro не нужен.

### Android

Собрать APK:

```bash
npm run android:apk
```

Готовый файл:

```
android/app/build/outputs/apk/debugEmbedded/app-debugEmbedded.apk
```

Установить на подключённое устройство:

```bash
npm run android:standalone
```

### iOS (только macOS)

Собрать и запустить с вшитым бандлом:

```bash
npm run ios:standalone
```

### Важно

- После изменений в JS пересобирайте `debugEmbedded` — Fast Refresh в этой сборке не работает.
- Это debug-сборка (`__DEV__ = true`), не release. Для продакшена используйте `assembleRelease`.
- Переменные из `.env` (react-native-config) вшиваются на этапе сборки — проверяйте `.env` перед отправкой APK.

## 📂 Структура проекта

```
RC2App/
├── android/              # Android нативный код
├── ios/                  # iOS нативный код
├── src/                  # Исходный код приложения
│   ├── assets/          # Изображения, шрифты и другие ресурсы
│   │   ├── images/
│   │   └── fonts/
│   ├── components/      # Переиспользуемые компоненты
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── TextInput.tsx
│   │   └── index.ts
│   ├── screens/         # Экраны приложения
│   │   ├── HomeScreen.tsx
│   │   └── index.ts
│   ├── navigation/      # Навигация (для добавления React Navigation)
│   ├── services/        # API и другие сервисы
│   │   ├── api.ts
│   │   └── index.ts
│   ├── utils/           # Утилиты и константы
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── index.ts
│   └── types/           # TypeScript типы
│       └── index.ts
├── __tests__/           # Тесты
├── App.tsx              # Корневой компонент
├── index.js             # Точка входа
├── package.json         # Зависимости и скрипты
├── tsconfig.json        # TypeScript конфигурация
├── .eslintrc.js         # ESLint конфигурация
├── .prettierrc.js       # Prettier конфигурация
└── README.md            # Документация

```

## 🛠 Доступные скрипты

```bash
# Запуск Metro bundler
npm start

# Запуск на Android (dev, с Metro)
npm run android

# Сборка APK для тестирования без Metro
npm run android:apk

# Установка debugEmbedded на устройство
npm run android:standalone

# Починить битый кэш Gradle (если settings-plugin.jar not found)
npm run android:fix-gradle

# Запуск на iOS (dev, с Metro)
npm run ios

# Запуск на iOS с вшитым бандлом (без Metro)
npm run ios:standalone

# Проверка кода с ESLint
npm run lint

# Запуск тестов
npm test
```

## ⚙️ Конфигурация

### TypeScript

TypeScript настроен с строгими правилами и алиасами путей:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@screens/*` → `src/screens/*`
- `@navigation/*` → `src/navigation/*`
- `@services/*` → `src/services/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`
- `@assets/*` → `src/assets/*`

Пример использования:
```typescript
import { Button } from '@components';
import { COLORS } from '@utils';
```

### ESLint & Prettier

Проект настроен с:
- React Native ESLint правилами
- TypeScript ESLint плагином
- Prettier для автоматического форматирования
- React Native специфичными правилами

Запустите линтер:
```bash
npm run lint
```

## 💻 Разработка

### Создание нового компонента

1. Создайте файл в `src/components/`:
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
```

2. Экспортируйте из `src/components/index.ts`:
```typescript
export * from './MyComponent';
```

### Добавление навигации

Для добавления React Navigation:

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
```

Для iOS:
```bash
cd ios && pod install && cd ..
```

### Работа с API

API сервис находится в `src/services/api.ts`. Пример использования:

```typescript
import { api } from '@services';

// GET запрос
const data = await api.get('/endpoint');

// POST запрос
const result = await api.post('/endpoint', { name: 'value' });
```

### Использование констант

Константы находятся в `src/utils/constants.ts`:

```typescript
import { COLORS, SIZES, FONT_SIZES } from '@utils';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    fontSize: FONT_SIZES.lg,
  },
});
```

## 🐛 Решение проблем

### Metro Bundler не запускается

```bash
# Очистите кеш Metro
npx react-native start --reset-cache
```

### Ошибки при сборке Android

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Gradle: `settings-plugin.jar` / `NoSuchFileException`

Битый кэш Gradle. `./gradlew` в этом состоянии не работает — сначала:

```bash
npm run android:fix-gradle
```

Затем снова:

```bash
npm run android:standalone
# или
npm run android:apk
```

### Ошибки при сборке iOS

```bash
cd ios
pod deintegrate
pod install
cd ..
npx react-native run-ios
```

### Ошибки с зависимостями

```bash
# Удалите node_modules и переустановите
rm -rf node_modules
npm install

# Для iOS также переустановите pods
cd ios
rm -rf Pods
pod install
cd ..
```

## 📚 Дополнительная информация

- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/)

## 📄 Лицензия

MIT

---

**Создано с ❤️ используя React Native**
