// Plik: src/components/Dashboard.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, MessageCircle, Heart, Brain, Star } from 'lucide-react-native';
import { styles } from '../styles';

// --- EKRAN DASHBOARDU ---

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
        {/* ROZPOCZNIJ ROZMOWĘ */}
        <TouchableOpacity onPress={() => onNavigate('conversation')} style={styles.card}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ padding: 10, backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 12, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle color="#60a5fa" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 4 }}>{t.dash_start}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>{t.dash_start_desc}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                <Text style={{ color: '#fbbf24', fontSize: 12 }}>4.6M {t.hints}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* NIEZRĘCZNA SYTUACJA */}
        <TouchableOpacity onPress={() => onNavigate('awkward')} style={styles.card}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ padding: 10, backgroundColor: 'rgba(244, 63, 94, 0.2)', borderRadius: 12, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}>
              <Heart color="#fb7185" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 4 }}>{t.dash_awk}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>{t.dash_awk_desc}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                <Text style={{ color: '#fbbf24', fontSize: 12 }}>2.9M {t.hints}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* SUGESTIE ODPOWIEDZI */}
        <TouchableOpacity onPress={() => onNavigate('replySuggestions')} style={styles.card}>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ padding: 10, backgroundColor: 'rgba(147, 51, 234, 0.2)', borderRadius: 12, height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}>
              <Brain color="#a855f7" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '500', marginBottom: 4 }}>{t.dash_reply}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>{t.dash_reply_desc}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                <Text style={{ color: '#fbbf24', fontSize: 12 }}>6.3M {t.hints}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
);