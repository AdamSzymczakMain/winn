// Plik: src/Components.js
// Tutaj są wszystkie ekrany (wygląd)

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Sparkles, Crown, Shield, Star, MessageCircle, Brain, Heart, ArrowLeft, Settings, X, Mail, MessageSquare } from 'lucide-react-native';

// --- STYLE ---
const styles = {
    gradient: { flex: 1, paddingTop: Platform.OS === 'android' ? 30 : 0 },
    h1: { fontSize: 32, color: 'white', fontWeight: '300', textAlign: 'center', marginBottom: 8 },
    sub: { fontSize: 16, color: '#94a3b8', textAlign: 'center', fontWeight: '300' },
    card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, padding: 20, marginBottom: 12, width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    cardSelected: { backgroundColor: 'rgba(51, 65, 85, 0.9)', borderColor: '#22c55e' },
    btnPrimary: { backgroundColor: '#d97706', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    btnGreen: { backgroundColor: '#16a34a', borderRadius: 12, paddingVertical: 16, width: '100%', alignItems: 'center', marginTop: 20 },
    btnPink: { backgroundColor: '#db2777', borderRadius: 12, paddingVertical: 16, width: '100%', alignItems: 'center', marginTop: 10, marginBottom: 10 },
    iconBox: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16, backgroundColor: '#7e22ce' },
    backBtn: { padding: 8, zIndex: 10 },
    // Modale
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#1e293b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48, borderTopWidth: 1, borderColor: '#334155' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, color: 'white', fontWeight: '600' },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#334155', gap: 16 }
};

// --- EKRANY ---

export const WelcomeScreen = ({ t, onNavigate }) => (
  <LinearGradient colors={['#0f172a', '#581c87', '#0f172a']} style={styles.gradient}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <View style={{ marginBottom: 32 }}><Crown color="#fbbf24" size={80} strokeWidth={1.5} /></View>
      <Text style={styles.h1}>{t.welcome_h1}</Text>
      <View style={{ height: 1, width: 100, backgroundColor: '#fbbf24', marginBottom: 24, opacity: 0.5 }} />
      <Text style={[styles.sub, { color: '#cbd5e1', fontSize: 18 }]}>{t.welcome_sub1}</Text>
      <Text style={[styles.sub, { marginBottom: 48 }]}>{t.welcome_sub2}</Text>
      <View style={{ gap: 16, marginBottom: 48 }}>
        {[t.feat_1, t.feat_2, t.feat_3].map((item, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Sparkles size={18} color="#fbbf24" />
            <Text style={{ color: '#cbd5e1' }}>{item}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={() => onNavigate('goals')} style={styles.btnPrimary}>
        <Text style={{ color: '#0f172a', fontWeight: '600', fontSize: 16, marginRight: 8 }}>{t.welcome_btn}</Text>
        <ChevronRight color="#0f172a" size={20} />
      </TouchableOpacity>
      <Text style={{ color: '#64748b', fontSize: 12, marginTop: 32 }}>{t.welcome_footer}</Text>
    </View>
  </LinearGradient>
);

export const GoalsScreen = ({ t, onNavigate, selectedGoals, toggleGoal }) => {
    const goals = [
      { id: 'reply', title: t.goal_1_t, desc: t.goal_1_d, emoji: '💬' },
      { id: 'starting', title: t.goal_2_t, desc: t.goal_2_d, emoji: '📝' },
      { id: 'emotions', title: t.goal_3_t, desc: t.goal_3_d, emoji: '😔' }
    ];
    return (
      <LinearGradient colors={['#0f172a', '#581c87', '#0f172a']} style={styles.gradient}>
        <View style={{padding: 24, paddingTop: 40}}>
            <TouchableOpacity onPress={() => onNavigate('welcome')} style={styles.backBtn}><ArrowLeft color="#94a3b8" size={28} /></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={styles.iconBox}><Text style={{ fontSize: 24 }}>🎩</Text></View>
            <Text style={styles.h1}>{t.goals_title}</Text>
          </View>
          <View style={{ gap: 16 }}>
            {goals.map(goal => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <TouchableOpacity key={goal.id} onPress={() => toggleGoal(goal.id)} style={[styles.card, isSelected && styles.cardSelected]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <Text style={{ fontSize: 24 }}>{goal.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>{goal.title}</Text>
                      <Text style={{ color: '#94a3b8', fontSize: 12 }}>{goal.desc}</Text>
                    </View>
                    {isSelected && <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' }}><Text style={{color:'white', fontSize: 10}}>✓</Text></View>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity onPress={() => selectedGoals.length > 0 && onNavigate('personality')} style={[styles.btnGreen, { opacity: selectedGoals.length > 0 ? 1 : 0.5 }]} disabled={selectedGoals.length === 0}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{t.goals_btn} 🙌</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
};

export const PersonalityScreen = ({ t, onNavigate, selectedPersonality, setPersonality }) => {
    const personalities = [
      { id: 'assertive', label: t.pers_1, icon: '💪' },
      { id: 'confident', label: t.pers_2, icon: '😎' },
      { id: 'playful', label: t.pers_3, icon: '😜' },
      { id: 'empathetic', label: t.pers_4, icon: '😔' },
      { id: 'flirtatious', label: t.pers_5, icon: '💦' }
    ];
    return (
      <LinearGradient colors={['#0f172a', '#581c87', '#0f172a']} style={styles.gradient}>
        <View style={{padding: 24, paddingTop: 40}}>
            <TouchableOpacity onPress={() => onNavigate('goals')} style={styles.backBtn}><ArrowLeft color="#94a3b8" size={28} /></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={styles.iconBox}><Text style={{ fontSize: 24 }}>🎩</Text></View>
            <Text style={styles.h1}>{t.pers_title}</Text>
          </View>
          <View style={{ gap: 12 }}>
            {personalities.map(p => (
              <TouchableOpacity key={p.id} onPress={() => setPersonality(p.id)} style={[styles.card, selectedPersonality === p.id && styles.cardSelected]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <Text style={{ fontSize: 24 }}>{p.icon}</Text>
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', flex: 1 }}>{p.label}</Text>
                  {selectedPersonality === p.id && <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' }}><Text style={{color:'white', fontSize: 10}}>✓</Text></View>}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => selectedPersonality && onNavigate('subscription')} style={[styles.btnGreen, { opacity: selectedPersonality ? 1 : 0.5 }]} disabled={!selectedPersonality}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{t.pers_btn}</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
};

export const SubscriptionScreen = ({ t, onNavigate }) => (
    <LinearGradient colors={['#0f172a', '#581c87', '#0f172a']} style={styles.gradient}>
      <View style={{padding: 24, paddingTop: 40}}>
         <TouchableOpacity onPress={() => onNavigate('personality')} style={styles.backBtn}><ArrowLeft color="#94a3b8" size={28} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, alignItems: 'center' }}>
        <Text style={styles.h1}>{t.sub_title}</Text>
        <Text style={[styles.sub, { marginBottom: 32 }]}>{t.sub_desc}</Text>
        <View style={[styles.card, { backgroundColor: 'rgba(88, 28, 135, 0.4)', padding: 24, alignItems: 'center' }]}>
          <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', padding: 16, borderRadius: 16, borderBottomLeftRadius: 4, marginBottom: 16, width: '100%', alignSelf: 'flex-start' }}>
            <Text style={{ color: 'white', fontSize: 14 }}>{t.sub_chat1}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12, width: '100%', alignSelf: 'flex-end', justifyContent:'flex-end' }}>
            <View style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: 16, borderRadius: 16, borderBottomRightRadius: 4, flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 14 }}>{t.sub_chat2}</Text>
            </View>
             <View style={{ width: 32, height: 32, backgroundColor: '#334155', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}><Text>👤</Text></View>
          </View>
          <TouchableOpacity onPress={() => onNavigate('dashboard')} style={styles.btnPink}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{t.sub_btn} 🙌</Text>
          </TouchableOpacity>
          <Text style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', marginTop: 8 }}>{t.sub_price}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 24, marginTop: 16 }}>
             <Text style={{ color: '#64748b' }}>Email</Text>
             <Text style={{ color: '#64748b' }}>{t.sub_restore}</Text>
             <Text style={{ color: '#64748b' }}>{t.terms}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
);

export const DashboardScreen = ({ t, onNavigate, flag, onOpenLang, onOpenSettings }) => (
    <LinearGradient colors={['#2e1065', '#0f172a']} style={styles.gradient}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 40, height: 40, backgroundColor: '#7e22ce', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20 }}>🎩</Text>
          </View>
          <Text style={{ fontSize: 20, color: 'white', fontWeight: '300' }}>{t.welcome_h1}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity onPress={onOpenLang}><Text style={{ fontSize: 24 }}>{flag}</Text></TouchableOpacity>
          <TouchableOpacity onPress={onOpenSettings}><Settings color="white" size={24} /></TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <TouchableOpacity onPress={() => onNavigate('conversation')} style={styles.card}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ padding: 10, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 12, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}><MessageCircle color="#60a5fa" size={24} /></View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 4 }}>{t.dash_start}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>{t.dash_start_desc}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Star size={12} color="#fbbf24" fill="#fbbf24" /><Text style={{ color: '#fbbf24', fontSize: 12 }}>4.6M {t.hints}</Text></View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
           <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ padding: 10, backgroundColor: 'rgba(244, 63, 94, 0.2)', borderRadius: 12, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}><Heart color="#fb7185" size={24} /></View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 4 }}>{t.dash_awk}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>{t.dash_awk_desc}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Star size={12} color="#fbbf24" fill="#fbbf24" /><Text style={{ color: '#fbbf24', fontSize: 12 }}>2.9M {t.hints}</Text></View>
            </View>
          </View>
        </TouchableOpacity>
         <TouchableOpacity style={styles.card}>
           <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ padding: 10, backgroundColor: 'rgba(147, 51, 234, 0.2)', borderRadius: 12, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}><Brain color="#a855f7" size={24} /></View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 4 }}>{t.dash_reply}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>{t.dash_reply_desc}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Star size={12} color="#fbbf24" fill="#fbbf24" /><Text style={{ color: '#fbbf24', fontSize: 12 }}>6.3M {t.hints}</Text></View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
);

export const ConversationScreen = ({ t, onNavigate }) => {
    const [text, setText] = React.useState('');
    const [tonality, setTonality] = React.useState(null);
    return (
      <LinearGradient colors={['#0f172a', '#2e1065', '#0f172a']} style={styles.gradient}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 24, paddingTop: 40, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => onNavigate('dashboard')} style={{ padding: 4 }}><ArrowLeft color="white" size={24} /></TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 32, height: 32, backgroundColor: '#7e22ce', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}><Text>🎩</Text></View>
            <Text style={{ color: 'white', fontSize: 18 }}>{t.welcome_h1} 😌</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}><Text style={{fontSize:20}}>🪄</Text><Text style={{fontSize:20, color:'white'}}>∞</Text></View>
        </View>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <TextInput value={text} onChangeText={setText} placeholder={t.conv_placeholder} placeholderTextColor="#475569" multiline maxLength={700} style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', color: '#e2e8f0', borderRadius: 16, padding: 20, height: 200, textAlignVertical: 'top', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Text style={{ color: '#64748b', textAlign: 'right', fontSize: 12, marginTop: 8 }}>✏️ {text.length}/700</Text>
          <Text style={{ color: 'white', marginTop: 24, marginBottom: 12, fontSize: 16 }}>{t.conv_tonalities}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }} contentContainerStyle={{gap: 12}}>
            {[t.ton_casual, t.ton_apol, t.ton_enc].map((tone, i) => (
              <TouchableOpacity key={i} onPress={() => setTonality(tone)} style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: tonality === tone ? '#db2777' : 'rgba(30, 41, 59, 0.8)' }}>
                <Text style={{ color: 'white', fontSize: 14 }}>{tone}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{ marginTop: 24 }}>
            <Text style={{ color: 'white', marginBottom: 8 }}>{t.conv_pers} <Text style={{ color: '#64748b', fontSize: 12 }}>(845k uses)</Text></Text>
            <TouchableOpacity style={{ borderWidth: 2, borderColor: 'rgba(234, 179, 8, 0.5)', borderStyle: 'dashed', padding: 16, borderRadius: 12, alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
              <Text style={{ color: '#eab308' }}>{t.conv_attach}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.btnGreen}><Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{t.conv_gen} 🪄✨</Text></TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
};

// --- MODALE MENU ---
export const LanguageMenu = ({ visible, onClose, languages, currentLang, setLang, t }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.language}</Text>
            <TouchableOpacity onPress={onClose}><X color="#94a3b8" /></TouchableOpacity>
          </View>
          {languages.map(lang => (
            <TouchableOpacity key={lang.code} style={styles.menuItem} onPress={() => { setLang(lang.code); onClose(); }}>
              <Text style={{ fontSize: 32 }}>{lang.flag}</Text>
              <Text style={{ color: 'white', fontSize: 18, flex: 1 }}>{lang.name}</Text>
              {currentLang === lang.code && <Text style={{ color: '#a855f7' }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
);

export const SettingsMenu = ({ visible, onClose, t }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.settings}</Text>
            <TouchableOpacity onPress={onClose}><X color="#94a3b8" /></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.menuItem}><MessageSquare color="#94a3b8" /><Text style={{color:'white', fontSize:16}}>{t.joindiscord}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}><Mail color="#94a3b8" /><Text style={{color:'white', fontSize:16}}>{t.contactus}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}><Star color="#94a3b8" /><Text style={{color:'white', fontSize:16}}>{t.rateus}</Text></TouchableOpacity>
          <View style={{ marginTop: 24, flexDirection:'row', justifyContent:'space-between' }}>
             <Text style={{ color: '#64748b' }}>{t.terms}</Text>
             <Text style={{ color: '#64748b' }}>{t.version}</Text>
             <Text style={{ color: '#64748b' }}>{t.privacy}</Text>
          </View>
        </View>
      </View>
    </Modal>
);