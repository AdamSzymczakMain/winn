// Plik: App.js
import React, { useState } from 'react';
import { View } from 'react-native';
// Importujemy dane i style
import { translations, languages } from './src/translations';
import { styles } from './src/styles';

// Importujemy ekrany z nowych plików
import { WelcomeScreen, GoalsScreen, PersonalityScreen, SubscriptionScreen } from './src/components/Onboarding';
import { DashboardScreen } from './src/components/Dashboard';
import { ConversationScreen, AwkwardSituationScreen, ReplySuggestionsScreen } from './src/components/MainFeatures';
import { LanguageMenu, SettingsMenu } from './src/components/Modals';

export default function App() {
  // --- STANY (Pamięć aplikacji) ---
  const [screen, setScreen] = useState('welcome');
  const [goals, setGoals] = useState([]);
  const [personality, setPersonality] = useState(null);
  const [langCode, setLangCode] = useState('pl');
  
  // Menu
  const [showLang, setShowLang] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // --- LOGIKA I POMOCNICY ---
  const t = translations[langCode] || translations['pl'];
  const currentFlag = languages.find(l => l.code === langCode)?.flag;

  const toggleGoal = (id) => {
    setGoals(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // --- WYŚWIETLANIE (Router) ---
  return (
    <View style={styles.container}>
      {/* Ekrany Onboardingu */}
      {screen === 'welcome' && <WelcomeScreen t={t} onNavigate={setScreen} />}
      {screen === 'goals' && (
        <GoalsScreen 
          t={t} 
          onNavigate={setScreen} 
          selectedGoals={goals} 
          toggleGoal={toggleGoal} 
        />
      )}
      {screen === 'personality' && (
        <PersonalityScreen 
          t={t} 
          onNavigate={setScreen} 
          selectedPersonality={personality} 
          setPersonality={setPersonality} 
        />
      )}
      {screen === 'subscription' && <SubscriptionScreen t={t} onNavigate={setScreen} />}
      
      {/* Ekran Dashboardu */}
      {screen === 'dashboard' && (
        <DashboardScreen 
          t={t} 
          onNavigate={setScreen} 
          flag={currentFlag}
          onOpenLang={() => setShowLang(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}
      
      {/* Ekrany Głównych Funkcji */}
      {screen === 'conversation' && <ConversationScreen t={t} onNavigate={setScreen} />}
      {screen === 'awkward' && <AwkwardSituationScreen t={t} onNavigate={setScreen} />}
      {screen === 'replySuggestions' && <ReplySuggestionsScreen t={t} onNavigate={setScreen} />}

      {/* Modale */}
      <LanguageMenu 
        visible={showLang} 
        onClose={() => setShowLang(false)} 
        languages={languages} 
        currentLang={langCode} 
        setLang={setLangCode} 
        t={t} 
      />
      
      <SettingsMenu 
        visible={showSettings} 
        onClose={() => setShowSettings(false)} 
        t={t} 
      />
    </View>
  );
}