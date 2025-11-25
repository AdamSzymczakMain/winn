// Plik: src/components/Onboarding.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Sparkles, Crown, ArrowLeft } from 'lucide-react-native';
import { styles } from '../styles';

// --- EKRANY ONBOARDINGOWE ---

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