function clamp(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

function calculateMatchScore({ studentSkills = [], studentDisciplines = [], studentLocation = '', availability = 100, eligibility = 100, opportunity }) {
  const requiredSkills = new Set((opportunity.requiredSkills || []).map((skill) => skill && skill._id ? skill._id.toString() : skill.toString()));
  const matchingSkills = studentSkills.filter((skill) => requiredSkills.has(skill.skillId));
  const skillFit = requiredSkills.size === 0
    ? 100
    : (matchingSkills.reduce((sum, skill) => sum + clamp(skill.proficiency), 0) / (requiredSkills.size * 100)) * 100;

  const opportunityDisciplines = opportunity.disciplines || [];
  const domainFit = opportunityDisciplines.length === 0
    ? 100
    : (studentDisciplines.some((discipline) => opportunityDisciplines.includes(discipline)) ? 100 : 0);

  const normalizedStudentLocation = studentLocation.trim().toLowerCase();
  const opportunityLocation = (opportunity.location || '').trim().toLowerCase();
  const locationFit = !opportunityLocation || opportunity.remote || normalizedStudentLocation === opportunityLocation ? 100 : 0;

  const breakdown = {
    skillFit: Number(skillFit.toFixed(2)),
    domainFit,
    eligibility: clamp(eligibility),
    locationFit,
    availability: clamp(availability),
  };
  const score = Number(((breakdown.skillFit * 0.40) + (breakdown.domainFit * 0.20) + (breakdown.eligibility * 0.15) + (breakdown.locationFit * 0.15) + (breakdown.availability * 0.10)).toFixed(2));

  return { score, breakdown };
}

module.exports = { calculateMatchScore };