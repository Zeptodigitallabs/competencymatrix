import React from 'react';
import CompetencyLibraryView from '../../components/competency-library/CompetencyLibraryView';

const CompetencyLibraryPage = ({
  competencies,
  onAddCompetency,
  onEditCompetency,
  onDeleteCompetency
}) => {
  return (
    <CompetencyLibraryView
      competencies={competencies}
      onAddCompetency={onAddCompetency}
      onEditCompetency={onEditCompetency}
      onDeleteCompetency={onDeleteCompetency}
    />
  );
};

export default CompetencyLibraryPage;
