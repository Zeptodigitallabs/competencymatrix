export const SAMPLE_COMPETENCIES = [
  {
    id: "c1",
    name: "JavaScript",
    category: "Technical",
    levels: 5,
    linkedRoles: ["Frontend Engineer", "Fullstack Engineer"]
  },
  {
    id: "c2",
    name: "React",
    category: "Technical",
    levels: 5,
    linkedRoles: ["Frontend Engineer", "Fullstack Engineer"]
  },
  {
    id: "c3",
    name: "Communication",
    category: "Behavioral",
    levels: 5,
    linkedRoles: ["All"]
  },
  {
    id: "c4",
    name: "Problem Solving",
    category: "Behavioral",
    levels: 5,
    linkedRoles: ["All"]
  },
  {
    id: "c5",
    name: "Unit Testing",
    category: "Technical",
    levels: 5,
    linkedRoles: ["QA Engineer", "Frontend Engineer"]
  },
];

export const SAMPLE_ROLES = [
  { id: "r1", title: "Frontend Engineer", department: "Engineering" },
  { id: "r2", title: "Backend Engineer", department: "Engineering" },
  { id: "r3", title: "Fullstack Engineer", department: "Engineering" },
  { id: "r4", title: "QA Engineer", department: "Quality Assurance" },
  { id: "r5", title: "Engineering Manager", department: "Management" },
];

export const SAMPLE_EMPLOYEES = [
  {
    id: "e1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Frontend Engineer",
    department: "Engineering",
    competencies: [
      { competencyId: "c1", level: 4, lastAssessed: "2023-05-15" },
      { competencyId: "c2", level: 5, lastAssessed: "2023-06-01" },
      { competencyId: "c3", level: 3, lastAssessed: "2023-04-20" },
      { competencyId: "c4", level: 4, lastAssessed: "2023-04-20" },
    ],
    learningPath: ["c5"],
    managerId: "e5",
  },
  // ... other employee data ...
];

export const SAMPLE_TEAMS = [
  { id: "t1", name: "Frontend Team", members: ["e1", "e3"], managerId: "e5" },
  { id: "t2", name: "Backend Team", members: ["e2"], managerId: "e5" },
  { id: "t3", name: "QA Team", members: ["e4"], managerId: "e5" },
];
