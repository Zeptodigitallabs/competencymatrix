import React from 'react';
import TeamLearningPaths from '../../components/team/TeamLearningPaths';

const TeamLearningPage = ({ employees, competencies }) => {
  return (
    <TeamLearningPaths 
      employees={employees}
      competencies={competencies}
    />
  );
};

export default TeamLearningPage;
