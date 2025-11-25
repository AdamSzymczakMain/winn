// Plik: src/components/MainFeatures.js - WSZYSTKIE FUNKCJE Z OPENAI API
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Copy,
  RefreshCw,
  Heart,
  AlertCircle,
} from 'lucide-react-native';
import { styles } from '../styles';

// KLUCZ API OPENAI
const OPENAI_API_KEY = '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';

// --- EKRANY GŁÓWNYCH FUNKCJONALNOŚCI ---

// 1. ROZPOCZNIJ ROZMOWĘ (ConversationScreen) - Z OPENAI API ✨
export const ConversationScreen = ({ t, onNavigate }) => {
  const [text, setText] = useState('');
  const [tonality, setTonality] = useState('casual');
  const [hasImage, setHasImage] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState(null);
  const [error, setError] = useState(null);

  // FUNKCJA GENEROWANIA ROZMOWY PRZEZ API
  const generateConversation = async () => {
    if (!text.trim() && !imageUri) return;

    setIsGenerating(true);
    setError(null);

    try {
      const toneDescriptions = {
        casual: 'swobodny, naturalny, z luzem - jak rozmowa z przyjacielem',
        apologetic: 'przepraszający, delikatny, empatyczny - okazujący skruchę',
        encouraging:
          'zachęcający, motywujący, pełen entuzjazmu - dodający otuchy',
      };

      // JEŚLI JEST ZDJĘCIE - użyj Vision API
      if (imageUri) {
        const messages = [
          {
            role: 'system',
            content: `Jesteś asystentem pomagającym rozpocząć rozmowy na podstawie zdjęć.

TON: ${toneDescriptions[tonality]}

ZADANIE: 
1. Przeanalizuj zdjęcie
2. Zidentyfikuj kontekst (osoba, miejsce, aktywność, sytuacja)
3. Wygeneruj kreatywne, naturalne rozpoczęcie rozmowy (2-4 zdania)

ZASADY:
- Odnieś się do tego, co widzisz na zdjęciu
- Bądź autentyczny i ciekawy
- Zadaj pytanie lub skomentuj coś konkretnego
- Dostosuj ton do wybranego stylu
- Możesz użyć emoji jeśli pasują
- Zwróć TYLKO sam tekst początkowy rozmowy, bez komentarzy`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Przeanalizuj to zdjęcie i wygeneruj rozpoczęcie rozmowy w tonie: ${
                  toneDescriptions[tonality]
                }

${text.trim() ? `Dodatkowy kontekst: ${text}` : ''}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUri,
                },
              },
            ],
          },
        ];

        const response = await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o', // Vision model
              messages: messages,
              temperature: 0.8,
              max_tokens: 400,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const generated = data.choices[0].message.content;

        setGeneratedText(generated);
      } else {
        // STANDARDOWA ANALIZA TEKSTU
        const messages = [
          {
            role: 'system',
            content: `Jesteś asystentem pomagającym rozpocząć rozmowy. 

TON: ${toneDescriptions[tonality]}

ZADANIE: Na podstawie opisu sytuacji wygeneruj krótki, naturalny tekst do rozpoczęcia rozmowy (2-4 zdania).

ZASADY:
- Bądź autentyczny i naturalny
- Dostosuj język do wybranego tonu
- Nie pisz zbyt formalnie
- Możesz użyć emoji jeśli pasują do tonu
- Zwróć TYLKO sam tekst, bez dodatkowych komentarzy`,
          },
          {
            role: 'user',
            content: `Sytuacja: ${text}

Wygeneruj rozpoczęcie rozmowy w tonie: ${toneDescriptions[tonality]}`,
          },
        ];

        const response = await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: messages,
              temperature: 0.8,
              max_tokens: 300,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const generated = data.choices[0].message.content;

        setGeneratedText(generated);
      }
    } catch (err) {
      console.error('Error generating conversation:', err);
      setError(t.conv_error || 'Wystąpił błąd. Spróbuj ponownie.');
    } finally {
      setIsGenerating(false);
    }
  };

  // WYBÓR ZDJĘCIA
  const handlePickImage = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert(t.conv_permission || 'Potrzebujemy dostępu do galerii!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        const uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setImageUri(uri);
        setHasImage(true);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // KOPIUJ TEKST
  const copyText = () => {
    alert(t.conv_copied || 'Skopiowano do schowka!');
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#2e1065', '#0f172a']}
      style={styles.gradient}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 24,
          paddingTop: 40,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => onNavigate('dashboard')}
          style={{ padding: 4 }}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 32,
              height: 32,
              backgroundColor: '#7e22ce',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>🎩</Text>
          </View>
          <Text style={{ color: 'white', fontSize: 18 }}>
            {t.welcome_h1} 😌
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={{ fontSize: 20 }}>🪄</Text>
          <Text style={{ fontSize: 20, color: 'white' }}>∞</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {error && (
          <View
            style={[
              styles.card,
              {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                marginBottom: 16,
              },
            ]}>
            <Text style={{ color: '#ef4444', fontSize: 14 }}>❌ {error}</Text>
          </View>
        )}

        {/* PODGLĄD ZDJĘCIA (jeśli dodane) */}
        {imageUri && (
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
                📸 {t.conv_image_preview || 'Zdjęcie do analizy'}
              </Text>
              <TouchableOpacity onPress={() => setImageUri(null)}>
                <Text style={{ color: '#ef4444', fontSize: 14 }}>
                  🗑️ {t.conv_remove || 'Usuń'}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.card,
                { padding: 0, overflow: 'hidden', marginBottom: 0 },
              ]}>
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: 250, resizeMode: 'cover' }}
              />
            </View>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: 'rgba(168, 85, 247, 0.1)',
                  borderColor: 'rgba(168, 85, 247, 0.3)',
                  marginTop: 12,
                },
              ]}>
              <Text style={{ color: '#a855f7', fontSize: 13 }}>
                💡 AI przeanalizuje to zdjęcie i zaproponuje kreatywne
                rozpoczęcie rozmowy!
              </Text>
            </View>
          </View>
        )}

        {/* OPIS SYTUACJI (opcjonalny gdy jest zdjęcie) */}
        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '500',
            marginBottom: 12,
          }}>
          {imageUri
            ? `${t.conv_context || 'Dodatkowy kontekst'} ${
                t.conv_optional || '(opcjonalnie)'
              }`
            : t.conv_placeholder}
        </Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={
            imageUri
              ? t.conv_context_placeholder ||
                'Możesz dodać dodatkowy kontekst...'
              : t.conv_placeholder || 'Opisz swoją sytuację...'
          }
          placeholderTextColor="#475569"
          multiline
          maxLength={700}
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            color: '#e2e8f0',
            borderRadius: 16,
            padding: 20,
            height: imageUri ? 120 : 200,
            textAlignVertical: 'top',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        />
        <Text
          style={{
            color: '#64748b',
            textAlign: 'right',
            fontSize: 12,
            marginTop: 8,
          }}>
          ✏️ {text.length}/700
        </Text>

        {/* LUB - SEPARATOR (tylko gdy nie ma zdjęcia) */}
        {!imageUri && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 24,
              marginBottom: 24,
            }}>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            />
            <Text
              style={{ color: '#64748b', marginHorizontal: 16, fontSize: 14 }}>
              {t.conv_or || 'lub'}
            </Text>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            />
          </View>
        )}

        {/* TONACJE */}
        <Text
          style={{
            color: 'white',
            marginTop: imageUri ? 24 : 0,
            marginBottom: 12,
            fontSize: 16,
          }}>
          {t.conv_tonalities}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}>
          {[
            { id: 'casual', label: t.ton_casual },
            { id: 'apologetic', label: t.ton_apol },
            { id: 'encouraging', label: t.ton_enc },
          ].map((tone) => (
            <TouchableOpacity
              key={tone.id}
              onPress={() => setTonality(tone.id)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor:
                  tonality === tone.id ? '#db2777' : 'rgba(30, 41, 59, 0.8)',
              }}>
              <Text style={{ color: 'white', fontSize: 14 }}>{tone.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* DODAJ ZDJĘCIE (tylko gdy nie ma zdjęcia) */}
        {!imageUri && (
          <View style={{ marginTop: 24 }}>
            <Text style={{ color: 'white', marginBottom: 8 }}>
              {t.conv_pers}{' '}
              <Text style={{ color: '#64748b', fontSize: 12 }}>
                (AI Vision)
              </Text>
            </Text>
            <TouchableOpacity
              onPress={handlePickImage}
              style={{
                borderWidth: 2,
                borderColor: 'rgba(234, 179, 8, 0.5)',
                borderStyle: 'dashed',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
              }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>📸</Text>
              <Text
                style={{ color: '#eab308', fontWeight: '600', fontSize: 16 }}>
                {t.conv_attach}
              </Text>
              <Text style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
                {t.conv_image_hint ||
                  'Dodaj zdjęcie osoby, miejsca lub aktywności'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* WYGENEROWANA ROZMOWA */}
        {generatedText && (
          <View
            style={[
              styles.card,
              {
                marginTop: 24,
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.3)',
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
              <Text
                style={{ color: '#22c55e', fontWeight: '600', fontSize: 16 }}>
                ✨ Wygenerowana rozmowa
              </Text>
              <TouchableOpacity onPress={copyText}>
                <Copy color="#22c55e" size={18} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 22 }}>
              {generatedText}
            </Text>
          </View>
        )}

        {/* PRZYCISK GENERUJ */}
        <TouchableOpacity
          onPress={generateConversation}
          disabled={(!text.trim() && !imageUri) || isGenerating}
          style={[
            styles.btnGreen,
            { opacity: (!text.trim() && !imageUri) || isGenerating ? 0.5 : 1 },
          ]}>
          {isGenerating ? (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <ActivityIndicator color="white" />
              <Text
                style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                {imageUri
                  ? t.conv_analyzing_image || 'Analizuję zdjęcie...'
                  : t.conv_generating || 'Generuję...'}
              </Text>
            </View>
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              {t.conv_gen} 🪄✨
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

// 2. NIEZRĘCZNA SYTUACJA (AwkwardSituationScreen) - Z OPENAI API ✨
export const AwkwardSituationScreen = ({ t, onNavigate }) => {
  const [situation, setSituation] = useState('');
  const [context, setContext] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [urgency, setUrgency] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'social', emoji: '👥', label: t.awk_cat_social || 'Towarzyska' },
    { id: 'romantic', emoji: '💕', label: t.awk_cat_romantic || 'Romantyczna' },
    { id: 'work', emoji: '💼', label: t.awk_cat_work || 'Zawodowa' },
    { id: 'family', emoji: '👨‍👩‍👧', label: t.awk_cat_family || 'Rodzinna' },
    { id: 'conflict', emoji: '⚡', label: t.awk_cat_conflict || 'Konflikt' },
  ];

  const urgencyLevels = [
    { id: 'low', emoji: '🟢', label: t.awk_urgency_low || 'Spokojnie' },
    {
      id: 'medium',
      emoji: '🟡',
      label: t.awk_urgency_medium || 'Umiarkowanie',
    },
    { id: 'high', emoji: '🔴', label: t.awk_urgency_high || 'Pilne!' },
  ];

  // FUNKCJA GENEROWANIA PRZEZ OPENAI API
  const generateAdvice = async () => {
    if (!situation.trim() || !selectedCategory) return;

    setIsGenerating(true);
    setError(null);

    try {
      const categoryLabel = categories.find(
        (c) => c.id === selectedCategory
      )?.label;
      const urgencyLabel = urgencyLevels.find((u) => u.id === urgency)?.label;

      const messages = [
        {
          role: 'system',
          content: `Jesteś ekspertem od relacji międzyludzkich i komunikacji. Pomagasz ludziom radzić sobie z niezręcznymi sytuacjami.

ZADANIE: Przeanalizuj niezręczną sytuację i wygeneruj kompleksową radę.

FORMAT ODPOWIEDZI (zwróć TYLKO poprawny JSON):
{
  "mainAdvice": "Główna rada (2-3 zdania)",
  "steps": [
    "Krok 1 z numerem",
    "Krok 2 z numerem",
    "Krok 3 z numerem",
    "Krok 4 z numerem"
  ],
  "whatToSay": [
    "Przykład 1 w cudzysłowie",
    "Przykład 2 w cudzysłowie",
    "Przykład 3 w cudzysłowie"
  ],
  "avoid": [
    "❌ Czego unikać 1",
    "❌ Czego unikać 2",
    "❌ Czego unikać 3",
    "❌ Czego unikać 4"
  ],
  "tips": "💡 Jedna dodatkowa wskazówka"
}

STYL:
- Empatyczny i wspierający
- Konkretny i praktyczny
- Bez osądzania
- Z psychologicznym podejściem`,
        },
        {
          role: 'user',
          content: `Sytuacja: ${situation}

${context ? `Dodatkowy kontekst: ${context}` : ''}

Kategoria: ${categoryLabel}
Pilność: ${urgencyLabel}

Wygeneruj kompleksową radę jak poradzić sobie z tą niezręczną sytuacją.`,
        },
      ];

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1200,
            response_format: { type: 'json_object' },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = JSON.parse(data.choices[0].message.content);

      const generatedAdvice = {
        situation: situation,
        category: categoryLabel,
        urgency: urgency,
        mainAdvice: aiResponse.mainAdvice,
        steps: aiResponse.steps,
        whatToSay: aiResponse.whatToSay,
        avoid: aiResponse.avoid,
        tips: aiResponse.tips,
      };

      setAdvice(generatedAdvice);
      setShowResult(true);
    } catch (err) {
      console.error('Error generating advice:', err);
      setError(
        t.awk_error ||
          'Wystąpił błąd podczas generowania rady. Spróbuj ponownie.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSituation('');
    setContext('');
    setSelectedCategory(null);
    setUrgency('medium');
    setAdvice(null);
    setShowResult(false);
    setError(null);
  };

  const copyAdvice = () => {
    alert(t.awk_copied || 'Skopiowano do schowka!');
  };

  if (!showResult) {
    return (
      <LinearGradient
        colors={['#0f172a', '#2e1065', '#0f172a']}
        style={styles.gradient}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 24,
            paddingTop: 40,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => onNavigate('dashboard')}
            style={{ padding: 4 }}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: '#fb7185',
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Heart color="white" size={18} />
            </View>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
              {t.dash_awk}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 0 }}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                borderColor: 'rgba(244, 63, 94, 0.3)',
                marginBottom: 24,
              },
            ]}>
            <Text style={{ color: '#fb7185', fontSize: 14, lineHeight: 20 }}>
              {t.awk_description ||
                'Opisz niezręczną sytuację, a wygenerujemy profesjonalną radę.'}
            </Text>
          </View>

          {error && (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  marginBottom: 16,
                },
              ]}>
              <Text style={{ color: '#ef4444', fontSize: 14 }}>❌ {error}</Text>
            </View>
          )}

          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 12,
            }}>
            {t.awk_category || 'Kategoria sytuacji'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, marginBottom: 24 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                  backgroundColor:
                    selectedCategory === cat.id
                      ? '#fb7185'
                      : 'rgba(30, 41, 59, 0.8)',
                  borderWidth: 1,
                  borderColor:
                    selectedCategory === cat.id
                      ? '#fb7185'
                      : 'rgba(255,255,255,0.1)',
                }}>
                <Text style={{ fontSize: 20, marginBottom: 4 }}>
                  {cat.emoji}
                </Text>
                <Text style={{ color: 'white', fontSize: 12 }}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 12,
            }}>
            {t.awk_situation || 'Opisz sytuację'}
          </Text>
          <TextInput
            value={situation}
            onChangeText={setSituation}
            placeholder={
              t.awk_situation_placeholder || 'Co się stało? Bądź szczery/a...'
            }
            placeholderTextColor="#475569"
            multiline
            maxLength={500}
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              color: '#e2e8f0',
              borderRadius: 16,
              padding: 20,
              height: 150,
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
              marginBottom: 8,
            }}
          />
          <Text
            style={{
              color: '#64748b',
              textAlign: 'right',
              fontSize: 12,
              marginBottom: 24,
            }}>
            {situation.length}/500
          </Text>

          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 12,
            }}>
            {t.awk_context || 'Dodatkowy kontekst'}{' '}
            <Text style={{ color: '#64748b', fontSize: 12 }}>
              (opcjonalnie)
            </Text>
          </Text>
          <TextInput
            value={context}
            onChangeText={setContext}
            placeholder={
              t.awk_context_placeholder || 'Kim są osoby zaangażowane?'
            }
            placeholderTextColor="#475569"
            multiline
            maxLength={300}
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              color: '#e2e8f0',
              borderRadius: 16,
              padding: 20,
              height: 100,
              textAlignVertical: 'top',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
              marginBottom: 8,
            }}
          />
          <Text
            style={{
              color: '#64748b',
              textAlign: 'right',
              fontSize: 12,
              marginBottom: 24,
            }}>
            {context.length}/300
          </Text>

          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 12,
            }}>
            {t.awk_urgency || 'Jak pilne?'}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
            {urgencyLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                onPress={() => setUrgency(level.id)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor:
                    urgency === level.id
                      ? 'rgba(244, 63, 94, 0.2)'
                      : 'rgba(30, 41, 59, 0.5)',
                  borderWidth: 2,
                  borderColor:
                    urgency === level.id ? '#fb7185' : 'rgba(255,255,255,0.1)',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>
                  {level.emoji}
                </Text>
                <Text style={{ color: 'white', fontSize: 12 }}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={generateAdvice}
            disabled={!situation.trim() || !selectedCategory || isGenerating}
            style={[
              styles.btnPink,
              {
                opacity:
                  !situation.trim() || !selectedCategory || isGenerating
                    ? 0.5
                    : 1,
                marginTop: 0,
                marginBottom: 40,
              },
            ]}>
            {isGenerating ? (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <ActivityIndicator color="white" />
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  {t.awk_analyzing || 'AI analizuje...'}
                </Text>
              </View>
            ) : (
              <Text
                style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                {t.awk_generate || 'Generuj radę'} 🪄✨
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0f172a', '#2e1065', '#0f172a']}
      style={styles.gradient}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 24,
          paddingTop: 40,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={resetForm} style={{ padding: 4 }}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
          {t.awk_your_advice || 'Twoja rada'}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={copyAdvice}>
            <Copy color="#94a3b8" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={generateAdvice}>
            <RefreshCw color="#94a3b8" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 0 }}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              borderColor: 'rgba(244, 63, 94, 0.3)',
              marginBottom: 20,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}>
            <Text style={{ fontSize: 20 }}>
              {categories.find((c) => c.id === selectedCategory)?.emoji}
            </Text>
            <Text style={{ color: '#fb7185', fontSize: 14, fontWeight: '600' }}>
              {advice.category}
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={{ fontSize: 18 }}>
              {urgencyLevels.find((u) => u.id === advice.urgency)?.emoji}
            </Text>
          </View>
          <Text style={{ color: '#cbd5e1', fontSize: 13, fontStyle: 'italic' }}>
            "{advice.situation.substring(0, 100)}
            {advice.situation.length > 100 ? '...' : ''}"
          </Text>
        </View>

        <View style={[styles.card, { marginBottom: 20 }]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
            <AlertCircle color="#fbbf24" size={20} />
            <Text style={{ color: '#fbbf24', fontSize: 16, fontWeight: '600' }}>
              {t.awk_main_advice || 'Główna rada'}
            </Text>
          </View>
          <Text style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 22 }}>
            {advice.mainAdvice}
          </Text>
        </View>

        <View style={[styles.card, { marginBottom: 20 }]}>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 16,
            }}>
            📋 {t.awk_steps || 'Konkretne kroki'}
          </Text>
          {advice.steps.map((step, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 20 }}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderColor: 'rgba(34, 197, 94, 0.3)',
              marginBottom: 20,
            },
          ]}>
          <Text
            style={{
              color: '#22c55e',
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 16,
            }}>
            💬 {t.awk_what_to_say || 'Co powiedzieć'}
          </Text>
          {advice.whatToSay.map((phrase, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 20 }}>
                • {phrase}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              marginBottom: 20,
            },
          ]}>
          <Text
            style={{
              color: '#ef4444',
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 16,
            }}>
            🚫 {t.awk_avoid || 'Czego unikać'}
          </Text>
          {advice.avoid.map((item, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 20 }}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              borderColor: 'rgba(168, 85, 247, 0.3)',
              marginBottom: 40,
            },
          ]}>
          <Text style={{ color: '#a855f7', fontSize: 14, lineHeight: 22 }}>
            {advice.tips}
          </Text>
        </View>

        <TouchableOpacity onPress={resetForm} style={styles.btnGreen}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {t.awk_new_situation || 'Nowa sytuacja'} ✨
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

// 3. SUGESTIE ODPOWIEDZI (ReplySuggestionsScreen) - Z OPENAI API ✨
export const ReplySuggestionsScreen = ({ t, onNavigate }) => {
  const [messageText, setMessageText] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedTone, setSelectedTone] = useState('balanced');
  const [error, setError] = useState(null);

  const tones = [
    { id: 'friendly', emoji: '😊', label: t.tone_friendly || 'Przyjazny' },
    {
      id: 'professional',
      emoji: '💼',
      label: t.tone_professional || 'Profesjonalny',
    },
    { id: 'balanced', emoji: '⚖️', label: t.tone_balanced || 'Zrównoważony' },
    { id: 'flirty', emoji: '😏', label: t.tone_flirty || 'Zalotny' },
    { id: 'witty', emoji: '🎭', label: t.tone_witty || 'Dowcipny' },
  ];

  const getToneDescription = (toneId) => {
    const descriptions = {
      friendly:
        'przyjazny, ciepły i otwarty - używaj emoji, bądź entuzjastyczny',
      professional:
        'profesjonalny, formalny ale ciepły - używaj grzecznościowych zwrotów',
      balanced:
        'zrównoważowany - ani zbyt formalny ani zbyt casualowy, uniwersalny',
      flirty:
        'zalotny, subtelnie flirtujący - użyj emoji, bądź zabawny i intrygujący',
      witty: 'dowcipny, sarkastyczny - używaj humoru, żartów, bądź kreatywny',
    };
    return descriptions[toneId] || descriptions.balanced;
  };

  const generateSuggestions = async () => {
    if (!messageText.trim() && !imageUri) return;

    setIsGenerating(true);
    setError(null);

    try {
      if (imageUri) {
        await analyzeImageAndGenerate();
      } else {
        await generateTextSuggestions();
      }
    } catch (err) {
      console.error('Error:', err);
      setError(t.reply_error || 'Wystąpił błąd. Spróbuj ponownie.');
      setIsGenerating(false);
    }
  };

  const generateTextSuggestions = async () => {
    const messages = [
      {
        role: 'system',
        content: `Jesteś asystentem pomagającym użytkownikom tworzyć inteligentne odpowiedzi na wiadomości. 

ZADANIE: Wygeneruj dokładnie 3 różne, spersonalizowane odpowiedzi na otrzymaną wiadomość.

TON ODPOWIEDZI: ${getToneDescription(selectedTone)}

FORMAT ODPOWIEDZI (zwróć TYLKO poprawny JSON):
{
  "replies": [
    {
      "text": "Treść pierwszej odpowiedzi (najlepsza opcja)",
      "why": "Krótkie wyjaśnienie dlaczego ta odpowiedź jest dobra (30-60 znaków)"
    },
    {
      "text": "Treść drugiej odpowiedzi (alternatywa)",
      "why": "Krótkie wyjaśnienie dlaczego ta odpowiedź jest dobra (30-60 znaków)"
    },
    {
      "text": "Treść trzeciej odpowiedzi (inna opcja)",
      "why": "Krótkie wyjaśnienie dlaczego ta odpowiedź jest dobra (30-60 znaków)"
    }
  ]
}

ZASADY:
- Każda odpowiedź musi być inna i unikalna
- Dostosuj styl do wybranej tonacji
- Odpowiedzi powinny być naturalne, nie robotyczne
- Wyjaśnienia "why" powinny być konkretne
- Nie używaj markdown, tylko czysty tekst
- Zwróć TYLKO JSON, bez dodatkowego tekstu`,
      },
      {
        role: 'user',
        content: `Otrzymana wiadomość: "${messageText}"

Wygeneruj 3 odpowiedzi w stylu: ${getToneDescription(selectedTone)}`,
      },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.8,
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    const parsedResponse = JSON.parse(aiResponse);

    const generated = {
      originalMessage: messageText,
      tone: tones.find((t) => t.id === selectedTone)?.label,
      replies: parsedResponse.replies,
    };

    setSuggestions(generated);
    setShowResult(true);
    setIsGenerating(false);
  };

  const analyzeImageAndGenerate = async () => {
    const messages = [
      {
        role: 'system',
        content: `Jesteś asystentem analizującym zrzuty ekranu rozmów i generującym inteligentne odpowiedzi.

ZADANIE:
1. Przeanalizuj zrzut ekranu konwersacji
2. Zidentyfikuj ostatnią wiadomość, na którą trzeba odpowiedzieć
3. Wygeneruj 3 spersonalizowane odpowiedzi

TON ODPOWIEDZI: ${getToneDescription(selectedTone)}

FORMAT (zwróć TYLKO JSON):
{
  "detected_message": "Wykryta ostatnia wiadomość z obrazu",
  "replies": [
    {
      "text": "Pierwsza odpowiedź",
      "why": "Wyjaśnienie (30-60 znaków)"
    },
    {
      "text": "Druga odpowiedź",
      "why": "Wyjaśnienie (30-60 znaków)"
    },
    {
      "text": "Trzecia odpowiedź",
      "why": "Wyjaśnienie (30-60 znaków)"
    }
  ]
}`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Przeanalizuj ten zrzut ekranu konwersacji i wygeneruj 3 odpowiedzi w stylu: ${getToneDescription(
              selectedTone
            )}`,
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUri,
            },
          },
        ],
      },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.8,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    const parsedResponse = JSON.parse(aiResponse);

    const generated = {
      originalMessage: parsedResponse.detected_message || 'Wiadomość z obrazu',
      tone: tones.find((t) => t.id === selectedTone)?.label,
      replies: parsedResponse.replies,
      fromImage: true,
    };

    setSuggestions(generated);
    setShowResult(true);
    setIsGenerating(false);
  };

  const resetForm = () => {
    setMessageText('');
    setImageUri(null);
    setSelectedTone('balanced');
    setSuggestions(null);
    setShowResult(false);
    setError(null);
  };

  const handlePickImage = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert(t.reply_permission || 'Potrzebujemy dostępu do galerii!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        const uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setImageUri(uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert(t.reply_error_picker || 'Błąd podczas wyboru zdjęcia');
    }
  };

  const copyReply = (text) => {
    alert(`${t.reply_copied || 'Skopiowano'}: "${text.substring(0, 30)}..."`);
  };

  if (!showResult) {
    return (
      <LinearGradient
        colors={['#0f172a', '#2e1065', '#0f172a']}
        style={styles.gradient}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 24,
            paddingTop: 40,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => onNavigate('dashboard')}
            style={{ padding: 4 }}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 32,
                height: 32,
                backgroundColor: '#a855f7',
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontSize: 18 }}>💬</Text>
            </View>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
              {t.dash_reply}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 0 }}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderColor: 'rgba(168, 85, 247, 0.3)',
                marginBottom: 24,
              },
            ]}>
            <Text style={{ color: '#a855f7', fontSize: 14, lineHeight: 20 }}>
              {t.reply_description ||
                'Wklej wiadomość lub dodaj zrzut ekranu, a AI wygeneruje 3 inteligentne odpowiedzi.'}
            </Text>
          </View>

          {error && (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  marginBottom: 24,
                },
              ]}>
              <Text style={{ color: '#ef4444', fontSize: 14 }}>❌ {error}</Text>
            </View>
          )}

          {!imageUri && (
            <>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 12,
                }}>
                {t.reply_message || 'Wiadomość do odpowiedzi'}
              </Text>
              <TextInput
                value={messageText}
                onChangeText={setMessageText}
                placeholder={
                  t.reply_placeholder || 'Wklej tutaj otrzymaną wiadomość...'
                }
                placeholderTextColor="#475569"
                multiline
                maxLength={600}
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  color: '#e2e8f0',
                  borderRadius: 16,
                  padding: 20,
                  height: 180,
                  textAlignVertical: 'top',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.1)',
                  marginBottom: 8,
                }}
              />
              <Text
                style={{
                  color: '#64748b',
                  textAlign: 'right',
                  fontSize: 12,
                  marginBottom: 24,
                }}>
                {messageText.length}/600
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 24,
                }}>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }}
                />
                <Text
                  style={{
                    color: '#64748b',
                    marginHorizontal: 16,
                    fontSize: 14,
                  }}>
                  {t.reply_or || 'lub'}
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }}
                />
              </View>
            </>
          )}

          {imageUri ? (
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 12,
                }}>
                {t.reply_screenshot || 'Zrzut ekranu'}
              </Text>
              <View style={[styles.card, { padding: 0, overflow: 'hidden' }]}>
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: '100%', height: 300, resizeMode: 'contain' }}
                />
              </View>
              <TouchableOpacity
                onPress={() => setImageUri(null)}
                style={{ marginTop: 12, alignItems: 'center' }}>
                <Text style={{ color: '#ef4444', fontSize: 14 }}>
                  🗑️ {t.reply_remove_image || 'Usuń zdjęcie'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handlePickImage}
              style={{
                borderWidth: 2,
                borderColor: 'rgba(234, 179, 8, 0.5)',
                borderStyle: 'dashed',
                padding: 20,
                borderRadius: 12,
                alignItems: 'center',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                marginBottom: 32,
              }}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>📸</Text>
              <Text
                style={{ color: '#eab308', fontWeight: '600', fontSize: 16 }}>
                {t.reply_add_screenshot || 'Dodaj zrzut ekranu'}
              </Text>
              <Text style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
                {t.reply_ai_analyze || 'AI przeanalizuje rozmowę'}
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '500',
              marginBottom: 12,
            }}>
            {t.reply_tone || 'Styl odpowiedzi'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, marginBottom: 32 }}>
            {tones.map((tone) => (
              <TouchableOpacity
                key={tone.id}
                onPress={() => setSelectedTone(tone.id)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                  backgroundColor:
                    selectedTone === tone.id
                      ? '#a855f7'
                      : 'rgba(30, 41, 59, 0.8)',
                  borderWidth: 1,
                  borderColor:
                    selectedTone === tone.id
                      ? '#a855f7'
                      : 'rgba(255,255,255,0.1)',
                }}>
                <Text style={{ fontSize: 20, marginBottom: 4 }}>
                  {tone.emoji}
                </Text>
                <Text style={{ color: 'white', fontSize: 12 }}>
                  {tone.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={generateSuggestions}
            disabled={(!messageText.trim() && !imageUri) || isGenerating}
            style={[
              styles.btnGreen,
              {
                opacity:
                  (!messageText.trim() && !imageUri) || isGenerating ? 0.5 : 1,
                marginTop: 0,
                marginBottom: 40,
              },
            ]}>
            {isGenerating ? (
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <ActivityIndicator color="white" />
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  {t.reply_analyzing || 'AI analizuje...'}
                </Text>
              </View>
            ) : (
              <Text
                style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                {t.reply_generate || 'Generuj odpowiedzi'} 🪄✨
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0f172a', '#2e1065', '#0f172a']}
      style={styles.gradient}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 24,
          paddingTop: 40,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={resetForm} style={{ padding: 4 }}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>
          {t.reply_your_suggestions || 'Twoje sugestie'}
        </Text>
        <TouchableOpacity onPress={generateSuggestions}>
          <RefreshCw color="#94a3b8" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 0 }}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              borderColor: 'rgba(168, 85, 247, 0.3)',
              marginBottom: 20,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}>
            <Text style={{ fontSize: 18 }}>
              {tones.find((t) => t.id === selectedTone)?.emoji}
            </Text>
            <Text style={{ color: '#a855f7', fontSize: 14, fontWeight: '600' }}>
              {suggestions.tone}
            </Text>
            {suggestions.fromImage && (
              <View
                style={{
                  backgroundColor: 'rgba(251, 191, 36, 0.2)',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 8,
                  marginLeft: 4,
                }}>
                <Text style={{ color: '#fbbf24', fontSize: 10 }}>
                  📸 Z obrazu
                </Text>
              </View>
            )}
          </View>
          <Text style={{ color: '#cbd5e1', fontSize: 13, fontStyle: 'italic' }}>
            "{suggestions.originalMessage.substring(0, 80)}
            {suggestions.originalMessage.length > 80 ? '...' : ''}"
          </Text>
        </View>

        {suggestions.replies.map((reply, index) => (
          <View
            key={index}
            style={[
              styles.card,
              {
                marginBottom: 16,
                borderWidth: 2,
                borderColor:
                  index === 0
                    ? 'rgba(168, 85, 247, 0.5)'
                    : 'rgba(255,255,255,0.1)',
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor:
                    index === 0 ? '#a855f7' : 'rgba(148, 163, 184, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                  {index + 1}
                </Text>
              </View>
              {index === 0 && (
                <View
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 12,
                    marginLeft: 8,
                  }}>
                  <Text
                    style={{
                      color: '#a855f7',
                      fontSize: 12,
                      fontWeight: '600',
                    }}>
                    ⭐ {t.reply_recommended || 'Polecane'}
                  </Text>
                </View>
              )}
            </View>

            <View
              style={{
                backgroundColor: 'rgba(148, 163, 184, 0.05)',
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                borderLeftWidth: 3,
                borderLeftColor: index === 0 ? '#a855f7' : '#64748b',
              }}>
              <Text style={{ color: '#e2e8f0', fontSize: 15, lineHeight: 22 }}>
                {reply.text}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 8,
                marginBottom: 12,
              }}>
              <Text style={{ fontSize: 16 }}>💡</Text>
              <Text
                style={{
                  color: '#94a3b8',
                  fontSize: 13,
                  lineHeight: 18,
                  flex: 1,
                }}>
                {reply.why}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => copyReply(reply.text)}
              style={{
                backgroundColor: 'rgba(168, 85, 247, 0.15)',
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: 'rgba(168, 85, 247, 0.3)',
              }}>
              <Copy color="#a855f7" size={16} />
              <Text
                style={{ color: '#a855f7', fontWeight: '600', fontSize: 14 }}>
                {t.reply_copy || 'Kopiuj odpowiedź'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <View
          style={[
            styles.card,
            {
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              borderColor: 'rgba(251, 191, 36, 0.3)',
              marginBottom: 20,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}>
            <Text style={{ fontSize: 18 }}>💡</Text>
            <Text style={{ color: '#fbbf24', fontSize: 16, fontWeight: '600' }}>
              {t.reply_tips || 'Wskazówki'}
            </Text>
          </View>
          <Text style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 20 }}>
            {t.reply_tips_text ||
              'Te odpowiedzi zostały wygenerowane przez AI. Możesz je dopasować do siebie!'}
          </Text>
        </View>

        <View style={{ gap: 12, marginBottom: 40 }}>
          <TouchableOpacity onPress={resetForm} style={styles.btnGreen}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
              {t.reply_new_message || 'Nowa wiadomość'} ✨
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={generateSuggestions}
            style={[
              styles.btnPrimary,
              {
                marginTop: 0,
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                borderWidth: 2,
                borderColor: '#a855f7',
              },
            ]}>
            <RefreshCw color="#a855f7" size={18} />
            <Text
              style={{
                color: '#a855f7',
                fontWeight: '600',
                fontSize: 16,
                marginLeft: 8,
              }}>
              {t.reply_regenerate || 'Wygeneruj ponownie'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
