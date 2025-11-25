// Plik: src/components/Modals.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X, Mail, MessageSquare, Star } from 'lucide-react-native';
import { styles } from '../styles';

// --- MODALE MENU ---

export const LanguageMenu = ({ visible, onClose, languages, currentLang, setLang, t }) => (
    // BŁĄD NAPRAWIONY: Dodano brakujący cudzysłów na końcu "slide"
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
    // BŁĄD NAPRAWIONY: Dodano brakujący cudzysłów na końcu "slide"
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