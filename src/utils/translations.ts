// utils/translations.ts
const translationDictionary: Record<string, string> = {
  // الكلمات الأساسية المحسنة
  'issues': 'مشاكل',
  'problems': 'مشاكل', 
  'error': 'خطأ',
  'errors': 'أخطاء',
  'bug': 'خلل',
  'bugs': 'أخطاء',
  'failure': 'فشل',
  'failures': 'إخفاقات',
  'not': 'غير',
  'no': 'لا',
  'yes': 'نعم',
  'working': 'يعمل',
  'functioning': 'يعمل',
  'operational': 'تشغيلي',
  
  // التقنية
  'hardware': 'عتاد',
  'software': 'برمجيات',
  'network': 'شبكة',
  'networking': 'شبكات',
  'email': 'بريد إلكتروني',
  'communication': 'اتصالات',
  'printer': 'طابعة',
  'peripheral': 'ملحق',
  'peripherals': 'ملحقات',
  'security': 'أمان',
  'access': 'وصول',
  'performance': 'أداء',
  'system': 'نظام',
  'updates': 'تحديثات',
  'patching': 'ترقيع',
  'cloud': 'سحابة',
  'server': 'خادم',
  'servers': 'خوادم',
  'data': 'بيانات',
  'backup': 'نسخ احتياطي',
  'recovery': 'استعادة',
  'user': 'مستخدم',
  'account': 'حساب',
  'management': 'إدارة',
  'mobile': 'محمول',
  'device': 'جهاز',
  'devices': 'أجهزة',
  'remote': 'عن بُعد',
  'other': 'أخرى',
  'it': 'تقنية معلومات',
  
  // الأجهزة
  'camera': 'كاميرا',
  'usb': 'يو إس بي',
  'port': 'منفذ',
  'ports': 'منافذ',
  'wi-fi': 'واي فاي',
  'wifi': 'واي فاي',
  'screen': 'شاشة',
  'display': 'عرض',
  'battery': 'بطارية',
  'charging': 'شحن',
  'audio': 'صوت',
  'bluetooth': 'بلوتوث',
  'connectivity': 'اتصال',
  'keyboard': 'لوحة مفاتيح',
  'mouse': 'فأرة',
  'hard': 'صلب',
  'disk': 'قرص',
  'slow': 'بطيء',
  'booting': 'إقلاع',
  'noise': 'ضجيج',
  'found': 'موجود',
  'responding': 'يستجيب',
  
  // الأفعال
  'installation': 'تثبيت',
  'connecting': 'اتصال',
  'detected': 'مكتشف',
  'overheating': 'ارتفاع حرارة',
  'flickering': 'وميض',
  'crashes': 'تعطل',
  'application': 'تطبيق',
  'operating': 'تشغيل',
  'blue': 'أزرق',
  
  // إضافات جديدة من البيانات
  'powering': 'تشغيل',
  'on': 'تشغيل',
  'chasrging': 'شحن',
  'foundd': 'موجود',
  'bootxing': 'إقلاع',
  'from': 'من',
};

// دالة ترجمة محسنة
export const smartTranslate = (englishText: string): string => {
  if (!englishText || typeof englishText !== 'string') {
    return '';
  }

  const text = englishText.trim();
  if (!text) return '';

  // تحويل النص لحالة خاصة للترجمة
  const lowerText = text.toLowerCase();
  
  // إذا النص كامل موجود في القاموس
  if (translationDictionary[lowerText]) {
    return translationDictionary[lowerText];
  }

  // تقسيم النص إلى كلمات مع الحفاظ على الرموز الخاصة
  const words = text.split(/(\s+|\&|\-)/).filter(word => word.trim());
  
  // ترجمة كل كلمة مع الحفاظ على الهيكل
  const translatedWords = words.map(word => {
    const cleanWord = word.toLowerCase().replace(/[^\w\u0600-\u06FF]/g, '');
    
    // تخطي المسافات والرموز
    if (word.trim() === '' || /^[\s\&\-\/]$/.test(word)) {
      return word;
    }
    
    // إذا الكلمة موجودة في القاموس
    if (translationDictionary[cleanWord]) {
      return translationDictionary[cleanWord];
    }
    
    // إذا الكلمة بها أرقام أو رموز خاصة
    if (/[\d@#$%^&*()]/.test(cleanWord)) {
      return word;
    }
    
    // البحث عن كلمات متشابهة
    const similarTranslation = findBestMatch(cleanWord);
    if (similarTranslation) {
      return similarTranslation;
    }
    
    // إذا الكلمة قصيرة (أقل من 3 أحرف) أو غير معروفة
    return cleanWord.length <= 3 ? word : `${word}`;
  });

  const result = translatedWords.join('').replace(/\s+/g, ' ').trim();
  
  // إذا معظم الكلمات مترجمة، نعيد النتيجة
  const englishWords = text.split(/\s+/).filter(w => w.length > 2);
  const arabicWords = result.split(/\s+/).filter(w => /[\u0600-\u06FF]/.test(w));
  
  if (arabicWords.length >= englishWords.length * 0.3) {
    return result;
  }
  
  return result !== text ? result : text;
};

// دالة محسنة للعثور على أفضل تطابق
const findBestMatch = (word: string): string | null => {
  // البحث عن تطابق كامل أولاً
  if (translationDictionary[word]) {
    return translationDictionary[word];
  }
  
  // البحث عن كلمات تحتوي على أو تبدأ بنفس الأحرف
  const possibleMatches = Object.keys(translationDictionary).filter(
    dictWord => {
      // تطابق جزئي
      return dictWord.includes(word) || 
             word.includes(dictWord) ||
             dictWord.startsWith(word) ||
             word.startsWith(dictWord);
    }
  );
  
  if (possibleMatches.length > 0) {
    // نعيد أفضل تطابق (الأطول أولاً)
    const bestMatch = possibleMatches.sort((a, b) => b.length - a.length)[0];
    return translationDictionary[bestMatch];
  }
  
  return null;
};