// Plik: src/styles.js
import { Platform } from 'react-native';

export const styles = {
    // Ogólne
    container: { flex: 1, backgroundColor: '#0f172a' },
    gradient: { flex: 1, paddingTop: Platform.OS === 'android' ? 30 : 0 },
    h1: { fontSize: 32, color: 'white', fontWeight: '300', textAlign: 'center', marginBottom: 8 },
    sub: { fontSize: 16, color: '#94a3b8', textAlign: 'center', fontWeight: '300' },
    backBtn: { padding: 8, zIndex: 10 },
    iconBox: { width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16, backgroundColor: '#7e22ce' },

    // Karty i przyciski
    card: { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderRadius: 16, padding: 20, marginBottom: 12, width: '100%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    cardSelected: { backgroundColor: 'rgba(51, 65, 85, 0.9)', borderColor: '#22c55e' },
    btnPrimary: { backgroundColor: '#d97706', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 20, shadowColor: "#d97706", shadowOpacity: 0.3, elevation: 5 },
    btnGreen: { backgroundColor: '#16a34a', borderRadius: 12, paddingVertical: 16, width: '100%', alignItems: 'center', marginTop: 20, shadowColor: "#16a34a", shadowOpacity: 0.3, elevation: 5 },
    btnPink: { backgroundColor: '#db2777', borderRadius: 12, paddingVertical: 16, width: '100%', alignItems: 'center', marginTop: 10, marginBottom: 10, shadowColor: "#db2777", shadowOpacity: 0.3, elevation: 5 },
    
    // Modale
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#1e293b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48, borderTopWidth: 1, borderColor: '#334155' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, color: 'white', fontWeight: '600' },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#334155', gap: 16 }
};