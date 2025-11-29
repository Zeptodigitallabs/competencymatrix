import React from 'react';

const TeamLearningPaths = ({ employees, competencies }) => {
  // Get top skill gaps across the team
  const getTopSkillGaps = () => {
    const gapCounts = {};
    
    employees.forEach(emp => {
      Object.entries(emp.competencies || {}).forEach(([compId, level]) => {
        if (level < 3) { // Assuming 3 is the target level
          gapCounts[compId] = (gapCounts[compId] || 0) + 1;
        }
      });
    });

    return Object.entries(gapCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([compId, count]) => ({
        competency: competencies.find(c => c.id === compId),
        count,
        percentage: Math.round((count / employees.length) * 100)
      }))
      .filter(item => item.competency); // Filter out any undefined competencies
  };

  const topSkillGaps = getTopSkillGaps();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4">Team Skill Gaps</h3>
        <div className="space-y-4">
          {topSkillGaps.length > 0 ? (
            topSkillGaps.map(({ competency, count, percentage }) => (
              <div key={competency.id} className="border-l-4 border-yellow-400 pl-4 py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{competency.name}</h4>
                    <p className="text-sm text-gray-500">{competency.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{count} team members</div>
                    <div className="text-sm text-gray-500">{percentage}% of team</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No significant skill gaps identified.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4">Recommended Learning Paths</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 1, title: 'Frontend Development', skills: ['JavaScript', 'React', 'CSS'], members: 8 },
            { id: 2, title: 'Backend Development', skills: ['Node.js', 'Python', 'Databases'], members: 5 },
            { id: 3, title: 'DevOps Fundamentals', skills: ['Docker', 'CI/CD', 'AWS'], members: 3 },
          ].map(path => (
            <div key={path.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium mb-2">{path.title}</h4>
              <div className="flex flex-wrap gap-1 mb-3">
                {path.skills.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{path.members} team members</span>
                <button className="text-blue-600 hover:underline">View Path →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamLearningPaths;
