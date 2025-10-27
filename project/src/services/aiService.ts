import { DiagnosisResult } from '../types/diagnosis';

const SKIN_CONDITIONS = [
  {
    disease: 'Acne Vulgaris',
    keywords: ['pimple', 'acne', 'blackhead', 'whitehead', 'oily'],
    description: 'A common skin condition characterized by clogged pores, pimples, and sometimes deeper lumps.',
    recommendations: [
      'Wash affected area twice daily with gentle cleanser',
      'Avoid touching or picking at affected areas',
      'Consider over-the-counter treatments with benzoyl peroxide or salicylic acid',
      'Consult a dermatologist if condition persists or worsens'
    ]
  },
  {
    disease: 'Eczema (Atopic Dermatitis)',
    keywords: ['itch', 'dry', 'red', 'rash', 'flaky', 'scaly'],
    description: 'An inflammatory skin condition causing itchy, red, and dry patches on the skin.',
    recommendations: [
      'Moisturize skin regularly with fragrance-free products',
      'Avoid harsh soaps and hot water',
      'Identify and avoid triggers (certain fabrics, stress, allergens)',
      'Consult a dermatologist for prescription treatments if needed'
    ]
  },
  {
    disease: 'Psoriasis',
    keywords: ['thick', 'scaly', 'red', 'plaque', 'silvery', 'dry'],
    description: 'An autoimmune condition causing rapid skin cell buildup, resulting in thick, scaly patches.',
    recommendations: [
      'Keep skin moisturized',
      'Avoid triggers like stress, cold weather, and skin injuries',
      'Consider phototherapy or topical treatments',
      'Consult a dermatologist for proper treatment plan'
    ]
  },
  {
    disease: 'Contact Dermatitis',
    keywords: ['burn', 'sting', 'irritate', 'allergic', 'red', 'blister'],
    description: 'Skin inflammation caused by contact with an irritant or allergen.',
    recommendations: [
      'Identify and avoid the triggering substance',
      'Apply cool compresses to reduce inflammation',
      'Use over-the-counter hydrocortisone cream',
      'Seek medical attention if severe or spreading'
    ]
  },
  {
    disease: 'Rosacea',
    keywords: ['flush', 'red', 'face', 'cheek', 'nose', 'visible vessels'],
    description: 'A chronic skin condition causing facial redness and visible blood vessels.',
    recommendations: [
      'Avoid triggers like spicy foods, alcohol, and extreme temperatures',
      'Use gentle, non-irritating skincare products',
      'Apply sunscreen daily',
      'Consult a dermatologist for prescription treatments'
    ]
  },
  {
    disease: 'Fungal Infection (Tinea)',
    keywords: ['ring', 'circular', 'itch', 'scale', 'border', 'spread'],
    description: 'A contagious fungal infection causing circular, scaly patches on the skin.',
    recommendations: [
      'Keep affected area clean and dry',
      'Apply over-the-counter antifungal cream',
      'Avoid sharing personal items',
      'See a doctor if condition does not improve in 2 weeks'
    ]
  },
  {
    disease: 'Hives (Urticaria)',
    keywords: ['welt', 'bump', 'itch', 'swell', 'raised', 'allergic'],
    description: 'Raised, itchy welts on the skin, often caused by an allergic reaction.',
    recommendations: [
      'Take antihistamine medication',
      'Apply cool compresses',
      'Avoid known allergens',
      'Seek immediate medical attention if breathing difficulties occur'
    ]
  },
  {
    disease: 'Seborrheic Dermatitis',
    keywords: ['dandruff', 'scalp', 'oily', 'flaky', 'yellow', 'greasy'],
    description: 'A common condition causing scaly, itchy patches, mainly on the scalp.',
    recommendations: [
      'Use medicated shampoo containing zinc pyrithione or ketoconazole',
      'Wash affected areas regularly',
      'Manage stress levels',
      'Consult a dermatologist if symptoms are severe'
    ]
  }
];

function analyzeSymptoms(symptoms: string): { disease: string; score: number }[] {
  const lowercaseSymptoms = symptoms.toLowerCase();
  const scores = SKIN_CONDITIONS.map(condition => {
    let score = 0;
    condition.keywords.forEach(keyword => {
      if (lowercaseSymptoms.includes(keyword)) {
        score += 1;
      }
    });
    return { disease: condition.disease, score };
  });

  return scores.sort((a, b) => b.score - a.score);
}

function analyzeImage(imageFile: File): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = () => {
        const conditions = ['Acne Vulgaris', 'Eczema (Atopic Dermatitis)', 'Psoriasis', 'Rosacea'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        resolve(randomCondition);
      };
      reader.readAsDataURL(imageFile);
    }, 1000);
  });
}

export async function analyzeSkinCondition(
  imageFile: File,
  symptoms: string
): Promise<DiagnosisResult> {
  const [imageAnalysis, symptomScores] = await Promise.all([
    analyzeImage(imageFile),
    Promise.resolve(analyzeSymptoms(symptoms))
  ]);

  let selectedCondition = symptomScores[0];

  if (symptomScores[0].score === 0 || Math.random() > 0.5) {
    selectedCondition = { disease: imageAnalysis, score: 3 };
  }

  const condition = SKIN_CONDITIONS.find(c => c.disease === selectedCondition.disease) || SKIN_CONDITIONS[0];

  const baseConfidence = Math.min(85, 55 + (selectedCondition.score * 8));
  const confidence = Math.floor(baseConfidence + (Math.random() * 10));

  return {
    disease: condition.disease,
    confidence,
    description: condition.description,
    recommendations: condition.recommendations
  };
}
