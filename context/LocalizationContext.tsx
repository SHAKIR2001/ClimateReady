import React, { createContext, useContext, useEffect, useMemo, useCallback, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LanguageCode = 'en' | 'si' | 'ta';

type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

type TranslationParams = Record<string, string | number>;

interface LocalizationContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => Promise<void>;
  t: (key: string, params?: TranslationParams) => string;
  availableLanguages: { code: LanguageCode; labelKey: string }[];
  translateForLanguage: (code: LanguageCode, key: string, params?: TranslationParams) => string;
}

const STORAGE_KEY = 'preferred_language';

const availableLanguages: { code: LanguageCode; labelKey: string }[] = [
  { code: 'en', labelKey: 'languages.en' },
  { code: 'si', labelKey: 'languages.si' },
  { code: 'ta', labelKey: 'languages.ta' },
];

const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    languages: {
      en: 'English',
      si: 'Sinhala',
      ta: 'Tamil',
    },
    common: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
    },
    settings: {
      title: 'Settings',
      sections: {
        account: 'Account',
        sos: 'SOS Emergency',
        app: 'App Settings',
        about: 'About & Support',
      },
      items: {
        viewProfile: 'View & Edit Profile',
        changePassword: 'Change Password',
        emergencyContacts: 'Emergency Contacts',
        emergencyContactsValue: '{{count}} contacts added',
        sosSettings: 'SOS Settings',
        sosHistory: 'SOS History',
        shareBloodType: 'Share Blood Type',
        shareMedicalConditions: 'Share Medical Conditions',
        shareMedications: 'Share Medications',
        notifications: 'Notifications',
  notificationsSummaryAll: 'All alerts enabled',
  notificationsSummarySome: '{{count}} alerts enabled',
  notificationsSummaryNone: 'No alerts enabled',
        darkMode: 'Dark Mode',
        locationServices: 'Location Services',
        language: 'Language',
        languageModalTitle: 'Choose your language',
        languageUpdated: 'Language updated to {{language}}',
  languageUpdateError: 'Unable to update language. Please try again.',
        helpSupport: 'Help & Support',
        privacyPolicy: 'Privacy Policy',
        terms: 'Terms of Service',
        about: 'About ClimateReady',
        version: 'Version {{version}}',
      },
      signOut: 'Sign Out',
      languageNames: {
        en: 'English',
        si: 'Sinhala',
        ta: 'Tamil',
      },
      notificationPreferences: {
        title: 'Alert Preferences',
        description: 'Choose which weather alerts you want to receive.',
        helper: 'These choices apply to push notifications and the in-app alert list.',
        hazards: {
          rain: {
            title: 'Heavy rain alerts',
            description: 'Get notified when rainfall is expected to exceed your threshold.',
          },
          wind: {
            title: 'High wind alerts',
            description: 'Stay informed about strong winds that could affect safety.',
          },
          'temp-high': {
            title: 'High temperature alerts',
            description: 'Know when heat levels are forecast to reach risky levels.',
          },
          'temp-low': {
            title: 'Low temperature alerts',
            description: 'Receive updates when cold snaps are expected.',
          },
        },
        actions: {
          selectAll: 'Enable all',
          deselectAll: 'Disable all',
          save: 'Save preferences',
        },
        feedback: {
          saved: 'Alert preferences updated',
          noneSelected: 'Select at least one alert to stay informed.',
          error: 'Unable to save preferences. Please try again.',
        },
      },
    },
    home: {
      subtitle: 'Stay prepared, stay safe',
      sections: {
        alerts: 'Active Alerts',
        quickActions: 'Quick Actions',
        progress: 'Your Progress',
      },
      greetings: {
        morning: 'Good Morning 🌅',
        afternoon: 'Good Afternoon ☀️',
        evening: 'Good Evening 🌙',
      },
      quickActions: {
        safeZones: {
          title: 'Safe Zones',
          subtitle: 'Find nearby shelters',
        },
        toolkit: {
          title: 'Toolkit',
          subtitle: 'Emergency checklists',
        },
        community: {
          title: 'Community',
          subtitle: 'Connect with others',
        },
        mockAlerts: {
          title: 'Mock Alerts',
          subtitle: 'Test alert notifications',
        },
      },
      weather: {
        loading: 'Getting weather data...',
        unavailableTitle: 'Weather Unavailable',
        unavailableDescription: 'Unable to fetch weather data',
        permissionDenied: 'Permission to access location was denied',
        unableToGetLocation: 'Unable to get location',
        humidity: '💧 {{humidity}}%',
        wind: '💨 {{wind}} m/s',
      },
      alerts: {
        multipleHazards: 'Weather Alert',
        titles: {
          rain: 'Heavy Rain Forecast',
          wind: 'High Wind Forecast',
          tempHigh: 'High Temperature Forecast',
          tempLow: 'Low Temperature Forecast',
        },
        descriptions: {
          rain: 'Heavy rain ~ {{value}}mm/3h (≥ {{threshold}}mm)',
          wind: 'High wind {{value}} m/s (≥ {{threshold}} m/s)',
          tempHigh: 'High temp {{value}}°C (≥ {{threshold}}°C)',
          tempLow: 'Low temp {{value}}°C (≤ {{threshold}}°C)',
        },
        notificationFallback: 'Upcoming weather conditions exceed your thresholds.',
      },
      progress: {
        preparedness: 'Preparedness',
        preparednessSubtitle: '{{completed}}/{{total}} tasks',
        learning: 'Learning',
        learningSubtitle: '{{completed}}/{{total}} modules',
        trainingGame: 'Training Game',
        trainingSubtitle: '{{victories}} wins • {{games}} games',
        badges: 'Badges',
        badgesSubtitle: '{{count}} earned',
      },
      hero: {
        title: 'Stay Prepared, Stay Safe',
        subtitle: 'Your comprehensive emergency preparedness companion',
      },
    },
  },
  si: {
    languages: {
      en: 'ඉංග්‍රීසි',
      si: 'සිංහල',
      ta: 'දෙමළ',
    },
    common: {
      cancel: 'ඉවත්වන්න',
      confirm: 'තහවුරු කරන්න',
      close: 'වසන්න',
    },
    settings: {
      title: 'සැකසීම්',
      sections: {
        account: 'ගිණුම',
        sos: 'SOS හදිසි',
        app: 'යෙදුම් සැකසීම්',
        about: 'තොරතුරු හා සහාය',
      },
      items: {
        viewProfile: 'පැතිකඩ බලන්න හා සංස්කරණය කරන්න',
        changePassword: 'මුරපදය වෙනස් කරන්න',
        emergencyContacts: 'හදිසි සම්බන්ධතා',
        emergencyContactsValue: 'සම්බන්ධතා {{count}}ක් එක් කර ඇත',
        sosSettings: 'SOS සැකසීම්',
        sosHistory: 'SOS ඉතිහාසය',
        shareBloodType: 'ලේ වර්ගය බෙදාගන්න',
        shareMedicalConditions: 'වෛද්‍ය තත්ව බෙදාගන්න',
        shareMedications: 'ඖෂධ තොරතුරු බෙදාගන්න',
        notifications: 'දැනුම්දීම්',
  notificationsSummaryAll: 'සියලු දැනුම්දීම් සක්‍රියයි',
  notificationsSummarySome: 'දැනුම්දීම් {{count}}ක් සක්‍රියයි',
  notificationsSummaryNone: 'දැනුම්දීම් කිසිවක් සක්‍රිය කර නැත',
        darkMode: 'අඳුරු තීරු',
        locationServices: 'ස්ථාන සේවා',
        language: 'භාෂාව',
        languageModalTitle: 'ඔබගේ භාෂාව තෝරන්න',
        languageUpdated: '{{language}} භාෂාවට මාරු විය',
  languageUpdateError: 'භාෂාව යාවත්කාල කළ නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
        helpSupport: 'උදව් සහ සහාය',
        privacyPolicy: 'පුද්ගලත්ව ප්‍රතිපත්තිය',
        terms: 'සේවා කොන්දේසි',
        about: 'ClimateReady ගැන',
        version: 'පිටපත් {{version}}',
      },
      signOut: 'විස්සන්න',
      languageNames: {
        en: 'ඉංග්‍රීසි',
        si: 'සිංහල',
        ta: 'දෙමළ',
      },
      notificationPreferences: {
        title: 'දැනුම්දීම් කැමැත්ත',
        description: 'ඔබට ලැබීමට කැමති කාලගුණ දැනුම්දීම් තෝරන්න.',
        helper: 'මෙම තේරීම් තල්ලු දැනුම්දීම් සහ යෙදුමේ දැනුම් දැක්වීම් දෙකටම බලපායි.',
        hazards: {
          rain: {
            title: 'බර වැසි දැනුම්දීම්',
            description: 'වැසි ප්‍රමාණය ඔබේ සීමාව ඉක්මුවහොත් දැනුවත් වන්න.',
          },
          wind: {
            title: 'උසස් සුළං දැනුම්දීම්',
            description: 'බලවත් සුළං අවදානම් මට්ටම් ගැන සූදානම් වන්න.',
          },
          'temp-high': {
            title: 'උණුසුම් උෂ්ණත්ව දැනුම්දීම්',
            description: 'උෂ්ණත්වය අවදානම් මට්ටම් වෙත ළඟාවන විට දැනුවත් වන්න.',
          },
          'temp-low': {
            title: 'අඩු උෂ්ණත්ව දැනුම්දීම්',
            description: 'සිසිලට හුදකලා තත්ත්වයන් පෙර දැනගන්න.',
          },
        },
        actions: {
          selectAll: 'සියල්ල සක්‍රිය කරන්න',
          deselectAll: 'සියල්ල අක්‍රිය කරන්න',
          save: 'කැමැත්ත සුරකින්න',
        },
        feedback: {
          saved: 'දැනුම්දීම් කැමැත්ත යාවත්කාල විය',
          noneSelected: 'ආරක්ෂාව සඳහා අවම වශයෙන් එක් දැනුම්දීමක්වත් සක්‍රිය කරන්න.',
          error: 'කැමැත්ත සුරක්ෂිත කිරීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
        },
      },
    },
    home: {
      subtitle: 'සූදානම් වන්න, ආරක්ෂිතව සිටින්න',
      sections: {
        alerts: 'ක්‍රියාශීලී අනතුරු ඇඟවීම්',
        quickActions: 'වේගවත් ක්‍රියාමාර්ග',
        progress: 'ඔබගේ ප්‍රගතිය',
      },
      greetings: {
        morning: 'සුභ උදෑසනක් 🌅',
        afternoon: 'සුභ මධ්‍යහ්න වේලාවක් ☀️',
        evening: 'සුභ සැන්දෑවක් 🌙',
      },
      quickActions: {
        safeZones: {
          title: 'ආරක්ෂිත ප්‍රදේශ',
          subtitle: 'ආසන්න රැසවල වාසස්දන්',
        },
        toolkit: {
          title: 'මෙවලම් කට්ටලය',
          subtitle: 'හදිසි ලැයිස්තු',
        },
        community: {
          title: 'ප්‍රජාව',
          subtitle: 'අනෙකුත් අය සමඟ සම්බන්ධ වන්න',
        },
        mockAlerts: {
          title: 'අභ්‍යාස අනතුරු',
          subtitle: 'දැනුම්දීම් පිරික්සන්න',
        },
      },
      weather: {
        loading: 'කාලගුණ දත්ත ලබාගනිමින්...',
        unavailableTitle: 'කාලගුණය ලබාගත නොහැක',
        unavailableDescription: 'කාලගුණ දත්ත ලබා ගැනීමට නොහැකි විය',
        permissionDenied: 'ස්ථානයට ප්‍රවේශ වීමට අවසර නොලැබීය',
        unableToGetLocation: 'ස්ථානය ලබා ගැනීමට නොහැකි විය',
        humidity: '💧 ආර්ද්‍රතාව {{humidity}}%',
        wind: '💨 සුළං {{wind}} m/s',
      },
      alerts: {
        multipleHazards: 'කාලගුණ අනතුරු ඇඟවීම',
        titles: {
          rain: 'ඉහළ മഴ අනාවැකි',
          wind: 'ඉහළ සුළං අනාවැකි',
          tempHigh: 'ඉහළ උෂ්ණත්ව අනාවැකි',
          tempLow: 'අඩු උෂ්ණත්ව අනාවැකි',
        },
        descriptions: {
          rain: 'ඉහළ වැසි ~ {{value}}mm/3h (≥ {{threshold}}mm)',
          wind: 'ඉහළ සුළං {{value}} m/s (≥ {{threshold}} m/s)',
          tempHigh: 'ඉහළ උෂ්ණත්ව {{value}}°C (≥ {{threshold}}°C)',
          tempLow: 'අඩු උෂ්ණත්ව {{value}}°C (≤ {{threshold}}°C)',
        },
        notificationFallback: 'ඉදිරි කාලගුණ තත්ත්වයන් ඔබේ තීරු නියමයන් ඉක්මවයි.',
      },
      progress: {
        preparedness: 'සූදානම් බව',
        preparednessSubtitle: 'කාර්යයන් {{completed}}/{{total}}',
        learning: 'ඉගෙනීම',
        learningSubtitle: 'මොඩියුල {{completed}}/{{total}}',
        trainingGame: 'පුහුණු ක්‍රීඩාව',
        trainingSubtitle: 'ඊට {{victories}} ජයග්‍රහණ • ක්‍රීඩා {{games}}',
        badges: 'බැජ්',
        badgesSubtitle: 'ලභාගත් {{count}}',
      },
      hero: {
        title: 'සූදානම් වන්න, ආරක්ෂිතව සිටින්න',
        subtitle: 'ඔබගේ සම්පූර්ණ හදිසි සූදානම් සහාය',
      },
    },
  },
  ta: {
    languages: {
      en: 'ஆங்கிலம்',
      si: 'சிங்களம்',
      ta: 'தமிழ்',
    },
    common: {
      cancel: 'ரத்து செய்',
      confirm: 'உறுதிப்படுத்து',
      close: 'மூடு',
    },
    settings: {
      title: 'அமைப்புகள்',
      sections: {
        account: 'கணக்கு',
        sos: 'SOS அவசரம்',
        app: 'செயலி அமைப்புகள்',
        about: 'தகவலும் ஆதரவும்',
      },
      items: {
        viewProfile: 'சுயவிவரத்தைப் பார்க்கவும் திருத்தவும்',
        changePassword: 'கடவுச்சொல் மாற்று',
        emergencyContacts: 'அவசர தொடர்புகள்',
        emergencyContactsValue: '{{count}} தொடர்புகள் சேர்க்கப்பட்டன',
        sosSettings: 'SOS அமைப்புகள்',
        sosHistory: 'SOS வரலாறு',
        shareBloodType: 'இரத்த வகையை பகிர்',
        shareMedicalConditions: 'மருத்துவ நிலைகளை பகிர்',
        shareMedications: 'மருந்து தகவலை பகிர்',
        notifications: 'அறிவிப்புகள்',
  notificationsSummaryAll: 'அனைத்து எச்சரிக்கைகளும் இயக்கப்பட்டுள்ளது',
  notificationsSummarySome: '{{count}} எச்சரிக்கைகள் இயக்கப்பட்டுள்ளது',
  notificationsSummaryNone: 'எச்சரிக்கைகள் எதுவும் இயக்கப்படவில்லை',
        darkMode: 'இருள் பயன்முறை',
        locationServices: 'இட சேவைகள்',
        language: 'மொழி',
        languageModalTitle: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
        languageUpdated: '{{language}} மொழிக்கு மாற்றப்பட்டது',
  languageUpdateError: 'மொழியைப் புதுப்பிக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
        helpSupport: 'உதவி & ஆதரவு',
        privacyPolicy: 'தனியுரிமைக் கொள்கை',
        terms: 'சேவை விதிமுறைகள்',
        about: 'ClimateReady பற்றி',
        version: 'பதிப்பு {{version}}',
      },
      signOut: 'வெளியேறு',
      languageNames: {
        en: 'ஆங்கிலம்',
        si: 'சிங்களம்',
        ta: 'தமிழ்',
      },
      notificationPreferences: {
        title: 'எச்சரிக்கை முன்னுரிமைகள்',
        description: 'நீங்கள் பெற விரும்பும் வானிலை எச்சரிக்கைகளைத் தேர்ந்தெடுக்கவும்.',
        helper: 'இந்தத் தேர்வுகள் push அறிவிப்புகளுக்கும் செயலியின் எச்சரிக்கை பட்டியலுக்கும் பொருந்தும்.',
        hazards: {
          rain: {
            title: 'தீவிர மழை எச்சரிக்கைகள்',
            description: 'மழை உங்கள் வரம்பை மீறும் போது அறிவிப்பைப் பெறுங்கள்.',
          },
          wind: {
            title: 'அதிக காற்று எச்சரிக்கைகள்',
            description: 'பாதுகாப்பை பாதிக்கக்கூடிய பலமான காற்று பற்றித் தகவலறிந்திருங்கள்.',
          },
          'temp-high': {
            title: 'அதிக வெப்பநிலை எச்சரிக்கைகள்',
            description: 'வெப்பம் ஆபத்தான நிலையை அடையும் போது தெரிந்திருங்கள்.',
          },
          'temp-low': {
            title: 'குறைந்த வெப்பநிலை எச்சரிக்கைகள்',
            description: 'குளிர் அதிகரிக்கும் நிலைகளை முன்கூட்டியே உணருங்கள்.',
          },
        },
        actions: {
          selectAll: 'அனைத்தையும் இயக்கவும்',
          deselectAll: 'அனைத்தையும் முடக்கவும்',
          save: 'முன்னுரிமைகளை சேமிக்கவும்',
        },
        feedback: {
          saved: 'எச்சரிக்கை முன்னுரிமைகள் புதுப்பிக்கப்பட்டது',
          noneSelected: 'தகவலறிந்திருப்பதற்கு குறைந்தபட்சம் ஒரு எச்சரிக்கையை இயக்கவும்.',
          error: 'முன்னுரிமைகளைச் சேமிக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
        },
      },
    },
    home: {
      subtitle: 'தயார் இருங்கள், பாதுகாப்பாக இருங்கள்',
      sections: {
        alerts: 'செயலில் உள்ள எச்சரிக்கைகள்',
        quickActions: 'விரைவு செயல்கள்',
        progress: 'உங்கள் முன்னேற்றம்',
      },
      greetings: {
        morning: 'காலை வணக்கம் 🌅',
        afternoon: 'மதிய வணக்கம் ☀️',
        evening: 'மாலை வணக்கம் 🌙',
      },
      quickActions: {
        safeZones: {
          title: 'பாதுகாப்பு மண்டலம்',
          subtitle: 'அருகிலுள்ள தங்கும் இடங்கள்',
        },
        toolkit: {
          title: 'கருவிப்பெட்டி',
          subtitle: 'அவசர சரிபார்ப்பு பட்டியல்',
        },
        community: {
          title: 'சமூகம்',
          subtitle: 'மற்றவர்களுடன் இணைக',
        },
        mockAlerts: {
          title: 'பாசிட் எச்சரிக்கை',
          subtitle: 'அறிவிப்புகளைச் சோதிக்கவும்',
        },
      },
      weather: {
        loading: 'காலநிலை தரவைப் பெறுகிறது...',
        unavailableTitle: 'காலநிலையை பெற முடியவில்லை',
        unavailableDescription: 'காலநிலை தரவைக் கொண்டுவர இயலவில்லை',
        permissionDenied: 'இருப்பிட அணுகல் அனுமதி மறுக்கப்பட்டது',
        unableToGetLocation: 'இருப்பிடத்தை பெற முடியவில்லை',
        humidity: '💧 ஈரப்பதம் {{humidity}}%',
        wind: '💨 காற்று {{wind}} m/s',
      },
      alerts: {
        multipleHazards: 'காலநிலை எச்சரிக்கை',
        titles: {
          rain: 'கன மழை முன்னறிவிப்பு',
          wind: 'தீவிர காற்று முன்னறிவிப்பு',
          tempHigh: 'அதிக வெப்ப முன்னறிவிப்பு',
          tempLow: 'குறைந்த வெப்ப முன்னறிவிப்பு',
        },
        descriptions: {
          rain: 'கன மழை ~ {{value}}mm/3h (≥ {{threshold}}mm)',
          wind: 'காற்றின் வேகம் {{value}} m/s (≥ {{threshold}} m/s)',
          tempHigh: 'அதிக வெப்பம் {{value}}°C (≥ {{threshold}}°C)',
          tempLow: 'குறைந்த வெப்பம் {{value}}°C (≤ {{threshold}}°C)',
        },
        notificationFallback: 'வரவிருக்கும் காலநிலை நிலைகள் உங்கள் வரம்புகளை மீறுகின்றன.',
      },
      progress: {
        preparedness: 'தயார்நிலை',
        preparednessSubtitle: 'பணிகள் {{completed}}/{{total}}',
        learning: 'கற்றல்',
        learningSubtitle: 'தொகுதிகள் {{completed}}/{{total}}',
        trainingGame: 'பயிற்சி விளையாட்டு',
        trainingSubtitle: '{{victories}} வெற்றிகள் • {{games}} விளையாட்டுகள்',
        badges: 'பட்டைகள்',
        badgesSubtitle: '{{count}} பெற்றது',
      },
      hero: {
        title: 'தயார் இருங்கள், பாதுகாப்பாக இருங்கள்',
        subtitle: 'உங்கள் முழுமையான அவசர தயாரிப்பு துணை',
      },
    },
  },
};

const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const loadLanguage = async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored === 'si' || stored === 'ta' || stored === 'en') {
        setLanguageState(stored);
      }
    };

    loadLanguage();
  }, []);

  const persistLanguage = useCallback(async (code: LanguageCode) => {
    setLanguageState(code);
    await AsyncStorage.setItem(STORAGE_KEY, code);
  }, []);

  const getTranslation = useCallback(
    (lang: LanguageCode, key: string): string | TranslationDictionary | undefined => {
      const parts = key.split('.');
      let node: string | TranslationDictionary | undefined = translations[lang];

      for (const part of parts) {
        if (node && typeof node === 'object') {
          node = (node as TranslationDictionary)[part];
        } else {
          node = undefined;
          break;
        }
      }

      return node as string | TranslationDictionary | undefined;
    },
    []
  );

  const applyParams = useCallback((template: string, params?: TranslationParams) => {
    if (!params) {
      return template;
    }

    return template.replace(/\{\{(.*?)\}\}/g, (_, token) => {
      const value = params[token.trim()];
      return value !== undefined ? String(value) : `{{${token}}}`;
    });
  }, []);

  const translate = useCallback(
    (key: string, params?: TranslationParams) => {
      const raw = getTranslation(language, key) ?? getTranslation('en', key);
      if (typeof raw !== 'string') {
        return key;
      }

      return applyParams(raw, params);
    },
    [applyParams, getTranslation, language]
  );

  const translateForLanguage = useCallback(
    (code: LanguageCode, key: string, params?: TranslationParams) => {
      const raw = getTranslation(code, key) ?? getTranslation('en', key);
      if (typeof raw !== 'string') {
        return key;
      }
      return applyParams(raw, params);
    },
    [applyParams, getTranslation]
  );

  const value = useMemo<LocalizationContextValue>(
    () => ({
      language,
      setLanguage: persistLanguage,
      t: translate,
      availableLanguages,
      translateForLanguage,
    }),
    [language, persistLanguage, translate, translateForLanguage]
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization(): LocalizationContextValue {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}
