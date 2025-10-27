import { useState } from 'react';
import { Activity, Loader2 } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { SymptomInput } from './components/SymptomInput';
import { DiagnosisResult } from './components/DiagnosisResult';
import { DiagnosisHistory, getSessionId } from './components/DiagnosisHistory';
import { analyzeSkinCondition } from './services/aiService';
import { supabase } from './lib/supabase';
import { DiagnosisResult as DiagnosisResultType } from './types/diagnosis';

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<DiagnosisResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  const handleAnalyze = async () => {
    if (!selectedImage || !symptoms.trim()) {
      alert('Please upload an image and describe your symptoms');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const diagnosis = await analyzeSkinCondition(selectedImage, symptoms);
      setResult(diagnosis);

      const sessionId = getSessionId();
      await supabase.from('diagnosis_history').insert({
        symptoms,
        disease: diagnosis.disease,
        confidence: diagnosis.confidence,
        session_id: sessionId
      });

      setHistoryKey(prev => prev + 1);
    } catch (error) {
      console.error('Error analyzing:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setSymptoms('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI Skin Diagnosis
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload a clear photo of your skin condition and describe your symptoms. Our AI will analyze the information and provide a preliminary assessment.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <ImageUpload
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
              />

              <SymptomInput value={symptoms} onChange={setSymptoms} />

              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !selectedImage || !symptoms.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Condition'
                  )}
                </button>

                {(selectedImage || symptoms) && !loading && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {result && (
              <DiagnosisResult result={result} />
            )}
          </div>

          <div className="lg:col-span-1">
            <DiagnosisHistory key={historyKey} />
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
          <p className="mb-2">
            This tool uses AI to provide preliminary assessments based on images and symptoms.
          </p>
          <p className="font-semibold text-gray-700">
            Always consult a healthcare professional for accurate diagnosis and treatment.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
