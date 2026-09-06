const { calculateMatchScore } = require('../src/services/matchingService');

describe('Explainable Match Score', () => {
  test('uses the mandated five-factor weighted formula', () => {
    const result = calculateMatchScore({
      studentSkills: [{ skillId: 'skill-1', proficiency: 80 }],
      studentDisciplines: ['Ayurveda'],
      studentLocation: 'Pune',
      eligibility: 100,
      availability: 60,
      opportunity: { requiredSkills: ['skill-1'], disciplines: ['Ayurveda'], location: 'Pune' },
    });

    expect(result.breakdown).toEqual({ skillFit: 80, domainFit: 100, eligibility: 100, locationFit: 100, availability: 60 });
    expect(result.score).toBe(88);
  });
});