import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { DiagnosisResult as DiagnosisResultType } from '../types/diagnosis';

interface DiagnosisResultProps {
  result: DiagnosisResultType;
}

export function DiagnosisResult({ result }: DiagnosisResultProps) {
  const confidenceColor = result.confidence >= 70 ? 'text-green-600' : 'text-amber-600';
  const progressColor = result.confidence >= 70 ? 'bg-green-500' : 'bg-amber-500';

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {result.confidence >= 70 ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-500" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {result.disease}
          </h3>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Confidence</span>
              <span className={`text-sm font-bold ${confidenceColor}`}>
                {result.confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${progressColor}`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
        <p className="text-sm text-gray-600">{result.description}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommendations</h4>
        <ul className="space-y-2">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span className="text-sm text-gray-600">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> This is an AI-based assessment and should not replace professional medical advice. Please consult a dermatologist for proper diagnosis and treatment.
          </p>
        </div>
      </div>
    </div>
  );
}
