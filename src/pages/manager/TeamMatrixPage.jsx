import React from 'react';
import TeamCompetencyMatrix from '../../components/team/TeamCompetencyMatrix';

const TeamMatrixPage = ({ employees, competencies }) => {
  return (
    <TeamCompetencyMatrix 
      employees={employees}
      competencies={competencies}
    />
  );
};

export default TeamMatrixPage;
