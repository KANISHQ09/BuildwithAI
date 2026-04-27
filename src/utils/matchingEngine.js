// Haversine distance between two lat/lng points (in km)
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) { return deg * (Math.PI / 180); }

// Smart matching algorithm
export function findBestMatches(need, volunteers, topN = 10) {
  const requiredSkillsMap = {
    'Healthcare': ['Nursing', 'First Aid', 'Pharmacy', 'Childcare', 'Nutrition Planning', 'Health Education', 'Blood Bank Management', 'Mental Health'],
    'Education': ['Teaching', 'Computer Training', 'Youth Mentoring', 'Mentoring', 'Child Psychology'],
    'Water & Sanitation': ['Water Purification', 'Plumbing', 'Well Digging', 'Pump Repair'],
    'Food Security': ['Supply Chain', 'Inventory Management', 'Driving', 'Logistics', 'Agriculture', 'Organic Farming'],
    'Infrastructure': ['Construction', 'Carpentry', 'Painting', 'Masonry', 'Electrical Work', 'Solar Installation', 'Plumbing'],
    'Safety': ['Counseling', 'Women Empowerment', 'Legal Aid', 'Public Speaking', 'Community Mobilization'],
    'Disaster Relief': ['Disaster Response', 'Swimming', 'Search & Rescue', 'First Aid', 'Emergency Transport', 'Driving'],
    'Livelihood': ['Sewing', 'Handicrafts', 'Agriculture', 'Organic Farming', 'Women Empowerment'],
    'Environment': ['Forest Conservation', 'Wildlife Monitoring', 'Community Patrol'],
    'Culture': ['Photography', 'Documentation', 'Public Speaking', 'Event Management'],
    'Governance': ['Data Entry', 'Survey Collection', 'Community Mobilization', 'Language Translation'],
  };

  const requiredSkills = requiredSkillsMap[need.category] || [];

  const scored = volunteers
    .filter(v => !v.assignedTasks.includes(need.id))
    .map(volunteer => {
      // Skill Match (40%)
      const matchedSkills = volunteer.skills.filter(s => requiredSkills.includes(s));
      const skillScore = requiredSkills.length > 0 ? (matchedSkills.length / Math.min(requiredSkills.length, 3)) * 100 : 50;

      // Proximity Score (35%)
      const distance = haversineDistance(
        need.location.lat, need.location.lng,
        volunteer.location.lat, volunteer.location.lng
      );
      const proximityScore = Math.max(0, 100 - (distance * 0.5));

      // Availability Score (25%)
      const availDays = volunteer.availability.days.length;
      const availScore = Math.min(100, (availDays / 5) * 100);

      // Experience bonus
      const expBonus = volunteer.experience === 'Expert' ? 10 : volunteer.experience === 'Intermediate' ? 5 : 0;

      const totalScore = Math.min(100, Math.round(
        (Math.min(100, skillScore) * 0.4) +
        (proximityScore * 0.35) +
        (availScore * 0.25) +
        expBonus * 0.1
      ));

      return {
        volunteer,
        score: totalScore,
        breakdown: {
          skillMatch: Math.min(100, Math.round(skillScore)),
          proximity: Math.round(proximityScore),
          availability: Math.round(availScore),
          distance: Math.round(distance),
          matchedSkills
        }
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return scored;
}

// Format date relative
export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Get initials from name
export function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// Category icon map
export const categoryIcons = {
  'Healthcare': 'medical_services',
  'Education': 'school',
  'Water & Sanitation': 'water_drop',
  'Food Security': 'restaurant',
  'Infrastructure': 'construction',
  'Safety': 'shield',
  'Disaster Relief': 'emergency',
  'Livelihood': 'work',
  'Environment': 'forest',
  'Culture': 'museum',
  'Governance': 'account_balance',
};
