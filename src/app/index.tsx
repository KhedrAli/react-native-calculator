import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  I18nManager,
} from 'react-native';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const isRTL = I18nManager.isRTL;

  // التعامل مع ضغط الأزرار
  const handlePress = (value: string) => {
    setErrorMessage('');

    if (value === 'AC') {
      setDisplay('0');
      setExpression('');
      return;
    }

    if (value === '=') {
      calculateResult();
      return;
    }

    if (value === '+/-') {
      if (display !== '0' && display !== 'Error') {
        if (display.startsWith('-')) {
          setDisplay(display.slice(1));
          setExpression(expression.slice(1));
        } else {
          setDisplay('-' + display);
          setExpression('-' + expression);
        }
      }
      return;
    }

    // شروط منع تكرار الرموز المتتالية (السماح بالأقواس فقط)
    const operators = ['+', '-', '×', '÷', '%'];
    const lastChar = expression.slice(-1);

    if (operators.includes(value)) {
      if (expression === '' && value !== '-') return;
      if (operators.includes(lastChar)) {
        // استبدال العملية الأخيرة بالجديدة
        setExpression(expression.slice(0, -1) + value);
        return;
      }
    }

    // تحديث الشاشة والمعادلة
    if (display === '0' || display === 'Error') {
      setDisplay(value);
      setExpression(value);
    } else {
      setDisplay(display + value);
      setExpression(expression + value);
    }
  };

  // دالة الحساب الحذرة (Try/Catch)
  const calculateResult = () => {
    if (!expression) return;

    try {
      // فحص القسمة على صفر
      if (/\/\s*0(?!\d)/.test(expression.replace(/÷/g, '/'))) {
        setErrorMessage('لا يمكن القسمة على صفر');
        setDisplay('Error');
        return;
      }

      let formattedExpr = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100');

      const result = new Function(`return ${formattedExpr}`)();

      if (isNaN(result) || !isFinite(result)) {
        setErrorMessage('خطيئة حسابية غير معرفة');
        setDisplay('Error');
      } else {
        const resultString = String(result);
        setDisplay(resultString);
        setExpression(resultString);
      }
    } catch (error) {
      setErrorMessage('صيغة المعادلة غير صحيحة');
      setDisplay('Error');
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* زر التبديل (هلال / شمس) بدون مكتبات خارجية */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          onPress={() => setIsDarkMode(!isDarkMode)}
          style={[styles.themeBtn, { backgroundColor: theme.btnSystem }]}
        >
          <Text style={{ fontSize: 20 }}>{isDarkMode ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>
      </View>

      {/* الشاشة */}
      <View style={[styles.screenContainer, { alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
        <Text style={[styles.expressionText, { color: theme.textSecondary }]}>
          {expression || ' '}
        </Text>
        <Text
          style={[styles.displayText, { color: theme.textPrimary }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {display}
        </Text>
        {errorMessage ? (
          <Text style={styles.errorBanner}>{errorMessage}</Text>
        ) : null}
      </View>

      {/* لوحة الأزرار */}
      <View style={[styles.keypad, { backgroundColor: theme.keypadBg }]}>
        {/* الصف الأول */}
        <View style={styles.row}>
          <Button label="AC" type="action" onPress={handlePress} theme={theme} />
          <Button label="(" type="operator" onPress={handlePress} theme={theme} />
          <Button label=")" type="operator" onPress={handlePress} theme={theme} />
          <Button label="÷" type="operator" onPress={handlePress} theme={theme} />
        </View>

        {/* الصف الثاني */}
        <View style={styles.row}>
          <Button label="7" type="num" onPress={handlePress} theme={theme} />
          <Button label="8" type="num" onPress={handlePress} theme={theme} />
          <Button label="9" type="num" onPress={handlePress} theme={theme} />
          <Button label="×" type="operator" onPress={handlePress} theme={theme} />
        </View>

        {/* الصف الثالث */}
        <View style={styles.row}>
          <Button label="4" type="num" onPress={handlePress} theme={theme} />
          <Button label="5" type="num" onPress={handlePress} theme={theme} />
          <Button label="6" type="num" onPress={handlePress} theme={theme} />
          <Button label="-" type="operator" onPress={handlePress} theme={theme} />
        </View>

        {/* الصف الرابع */}
        <View style={styles.row}>
          <Button label="1" type="num" onPress={handlePress} theme={theme} />
          <Button label="2" type="num" onPress={handlePress} theme={theme} />
          <Button label="3" type="num" onPress={handlePress} theme={theme} />
          <Button label="+" type="operator" onPress={handlePress} theme={theme} />
        </View>

        {/* الصف الخامس والأخير (مع زر الصفر وزر النقطة والكبسولة البرتقالية للتصاميم العادية) */}
        <View style={styles.row}>
          <Button label="+/-" type="action" onPress={handlePress} theme={theme} />
          <Button label="0" type="num" onPress={handlePress} theme={theme} />
          <Button label="." type="num" onPress={handlePress} theme={theme} />
          <TouchableOpacity
            style={styles.equalsButton}
            onPress={() => handlePress('=')}
            activeOpacity={0.8}
          >
            <Text style={styles.equalsText}>=</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// زر الأرقام والعمليات
function Button({ label, type, onPress, theme }: any) {
  let btnStyle = styles.numBtn;
  let textStyle = { color: theme.textPrimary };

  if (type === 'action') {
    btnStyle = styles.actionBtn;
    textStyle = { color: '#FF2A6D' };
  } else if (type === 'operator') {
    btnStyle = styles.operatorBtn;
    textStyle = { color: theme.textSecondary };
  }

  return (
    <TouchableOpacity
      style={[btnStyle, { backgroundColor: theme.btnBg }]}
      onPress={() => onPress(label)}
    >
      <Text style={[styles.btnText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const darkTheme = {
  bg: '#17181A',
  keypadBg: '#212327',
  btnBg: '#292B2F',
  btnSystem: '#292B2F',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
};

const lightTheme = {
  bg: '#F7F8FA',
  keypadBg: '#FFFFFF',
  btnBg: '#F2F3F5',
  btnSystem: '#E5E6EA',
  textPrimary: '#1C1C1E',
  textSecondary: '#6C6C70',
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  themeBtn: {
    width: 44,
    height: 44,
    marginTop:22,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  expressionText: { fontSize: 20, marginBottom: 8 },
  displayText: { fontSize: 54, fontWeight: 'bold' },
  errorBanner: {
    color: '#FF2A6D',
    fontSize: 14,
    marginTop: 6,
    fontWeight: 'bold',
  },
  keypad: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  numBtn: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  operatorBtn: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { fontSize: 24, fontWeight: '500' },
  equalsButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: '#FF2A6D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  equalsText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
});