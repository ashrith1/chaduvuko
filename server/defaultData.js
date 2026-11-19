// Board of Intermediate Education :: Andhra Pradesh (BIEAP)
// 2nd Year - Maths, Physics, Chemistry Weightage of Marks (Chapter Wise) & Mathematics Exercises

export const defaultSyllabus = {
  Maths: [
    {
      id: 'm-1',
      name: 'Relations and Functions',
      weightage: 7,
      unit: 'Relations & Functions',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M'],
      exercises: ['Exercise 1(a)', 'Exercise 1(b)', 'Exercise 1(c)', 'Chapter 1 MCQs']
    },
    {
      id: 'm-2',
      name: 'Inverse Trigonometric Functions',
      weightage: 5,
      unit: 'Relations & Functions',
      breakdown: { '1M': 1, '2M': 0, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '4M'],
      exercises: ['Exercise 2(a)', 'Exercise 2(b)', 'Exercise 2(c)', 'Chapter 2 MCQs']
    },
    {
      id: 'm-3',
      name: 'Matrices',
      weightage: 7,
      unit: 'Algebra',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M'],
      exercises: ['Exercise 3(a)', 'Exercise 3(b)', 'Exercise 3(c)', 'Exercise 3(d)', 'Chapter 3 MCQs']
    },
    {
      id: 'm-4',
      name: 'Determinants',
      weightage: 15,
      unit: 'Algebra',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 1 },
      questionTypes: ['1M', '2M', '4M', '8M'],
      exercises: ['Exercise 4(a)', 'Exercise 4(b)', 'Exercise 4(c)', 'Exercise 4(d)', 'Exercise 4(e)', 'Exercise 4(f)', 'Chapter 4 MCQs']
    },
    {
      id: 'm-5',
      name: 'Continuity and Differentiability',
      weightage: 7,
      unit: 'Calculus',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M'],
      exercises: ['Exercise 5(a)', 'Exercise 5(b)', 'Exercise 5(c)', 'Exercise 5(d)', 'Exercise 5(e)', 'Exercise 5(f)', 'Exercise 5(g)', 'Exercise 5(h)', 'Chapter 5 MCQs']
    },
    {
      id: 'm-6',
      name: 'Application of Derivatives',
      weightage: 11,
      unit: 'Calculus',
      breakdown: { '1M': 1, '2M': 1, '4M': 0, '8M': 1 },
      questionTypes: ['1M', '2M', '8M'],
      exercises: ['Exercise 6(a)', 'Exercise 6(b)', 'Exercise 6(c)', 'Exercise 6(d)', 'Chapter 6 MCQs']
    },
    {
      id: 'm-7',
      name: 'Integrals',
      weightage: 23,
      unit: 'Calculus',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 2 },
      questionTypes: ['1M', '2M', '4M', '8M'],
      exercises: ['Exercise 7(a)', 'Exercise 7(b)', 'Exercise 7(c)', 'Exercise 7(d)', 'Exercise 7(e)', 'Exercise 7(f)', 'Exercise 7(g)', 'Exercise 7(h)', 'Exercise 7(i)', 'Exercise 7(j)', 'Chapter 7 MCQs']
    },
    {
      id: 'm-8',
      name: 'Application of Integrals',
      weightage: 5,
      unit: 'Calculus',
      breakdown: { '1M': 1, '2M': 0, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '4M'],
      exercises: ['Exercise 8(a)', 'Exercise 8(b)', 'Chapter 8 MCQs']
    },
    {
      id: 'm-9',
      name: 'Differential Equations',
      weightage: 11,
      unit: 'Calculus',
      breakdown: { '1M': 1, '2M': 1, '4M': 0, '8M': 1 },
      questionTypes: ['1M', '2M', '8M'],
      exercises: ['Exercise 9(a)', 'Exercise 9(b)', 'Exercise 9(c)', 'Exercise 9(d)', 'Exercise 9(e)', 'Exercise 9(f)', 'Chapter 9 MCQs']
    },
    {
      id: 'm-10',
      name: 'Vector Algebra',
      weightage: 15,
      unit: 'Vectors & 3D',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 1 },
      questionTypes: ['1M', '2M', '4M', '8M'],
      exercises: ['Exercise 10(a)', 'Exercise 10(b)', 'Exercise 10(c)', 'Exercise 10(d)', 'Exercise 10(e)', 'Chapter 10 MCQs']
    },
    {
      id: 'm-11',
      name: 'Three Dimensional Geometry',
      weightage: 10,
      unit: 'Vectors & 3D',
      breakdown: { '1M': 0, '2M': 1, '4M': 0, '8M': 1 },
      questionTypes: ['2M', '8M'],
      exercises: ['Exercise 11(a)', 'Exercise 11(b)', 'Chapter 11 MCQs']
    },
    {
      id: 'm-12',
      name: 'Linear Programming',
      weightage: 5,
      unit: 'Linear Programming',
      breakdown: { '1M': 1, '2M': 0, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '4M'],
      exercises: ['Exercise 12(a)', 'Chapter 12 MCQs']
    },
    {
      id: 'm-13',
      name: 'Probability',
      weightage: 15,
      unit: 'Probability',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 1 },
      questionTypes: ['1M', '2M', '4M', '8M'],
      exercises: ['Exercise 13(a)', 'Exercise 13(b)', 'Exercise 13(c)', 'Chapter 13 MCQs']
    }
  ],
  Physics: [
    {
      id: 'p-1',
      name: 'Electric Charges and Fields',
      weightage: 7,
      unit: 'Electrostatics',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'p-2',
      name: 'Electrostatic Potential and Capacitance',
      weightage: 10,
      unit: 'Electrostatics',
      breakdown: { '1M': 0, '2M': 1, '4M': 2, '8M': 0 },
      questionTypes: ['2M', '4M']
    },
    {
      id: 'p-3',
      name: 'Current Electricity',
      weightage: 7,
      unit: 'Current Electricity',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'p-4',
      name: 'Moving Charges and Magnetism',
      weightage: 10,
      unit: 'Magnetic Effects',
      breakdown: { '1M': 0, '2M': 1, '4M': 0, '8M': 1 },
      questionTypes: ['2M', '8M']
    },
    {
      id: 'p-5',
      name: 'Magnetism and Matter',
      weightage: 7,
      unit: 'Magnetic Effects',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'p-6',
      name: 'Electromagnetic Induction',
      weightage: 7,
      unit: 'EMI & AC',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'p-7',
      name: 'Alternating Currents',
      weightage: 7,
      unit: 'EMI & AC',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'p-8',
      name: 'Electromagnetic Waves',
      weightage: 3,
      unit: 'EM Waves',
      breakdown: { '1M': 1, '2M': 1, '4M': 0, '8M': 0 },
      questionTypes: ['1M', '2M']
    },
    {
      id: 'p-9',
      name: 'Ray Optics and Optical Instruments',
      weightage: 10,
      unit: 'Optics',
      breakdown: { '1M': 0, '2M': 1, '4M': 0, '8M': 1 },
      questionTypes: ['2M', '8M']
    },
    {
      id: 'p-10',
      name: 'Wave Optics',
      weightage: 7,
      unit: 'Optics',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'p-11',
      name: 'Dual Nature of Radiation and Matter',
      weightage: 10,
      unit: 'Modern Physics',
      breakdown: { '1M': 0, '2M': 1, '4M': 2, '8M': 0 },
      questionTypes: ['2M', '4M']
    },
    {
      id: 'p-12',
      name: 'Atoms',
      weightage: 7,
      unit: 'Modern Physics',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'p-13',
      name: 'Nuclei',
      weightage: 10,
      unit: 'Modern Physics',
      breakdown: { '1M': 0, '2M': 1, '4M': 0, '8M': 1 },
      questionTypes: ['2M', '8M']
    },
    {
      id: 'p-14',
      name: 'Semiconductor Devices',
      weightage: 7,
      unit: 'Electronic Devices',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    }
  ],
  Chemistry: [
    {
      id: 'c-1',
      name: 'Solutions',
      weightage: 9,
      unit: 'Physical Chemistry',
      breakdown: { '1M': 1, '2M': 2, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'c-2',
      name: 'Electro chemistry',
      weightage: 13,
      unit: 'Physical Chemistry',
      breakdown: { '1M': 1, '2M': 2, '4M': 2, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'c-3',
      name: 'Chemical Kinetics',
      weightage: 15,
      unit: 'Physical Chemistry',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 1 },
      questionTypes: ['1M', '2M', '4M', '8M']
    },
    {
      id: 'c-4',
      name: 'd-and f-Block Elements',
      weightage: 8,
      unit: 'Inorganic Chemistry',
      breakdown: { '1M': 0, '2M': 2, '4M': 1, '8M': 0 },
      questionTypes: ['2M', '4M']
    },
    {
      id: 'c-5',
      name: 'Coordination Compounds',
      weightage: 15,
      unit: 'Inorganic Chemistry',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 1 },
      questionTypes: ['1M', '2M', '4M', '8M']
    },
    {
      id: 'c-6',
      name: 'Haloalkanes and Haloarenes',
      weightage: 7,
      unit: 'Organic Chemistry',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'c-7',
      name: 'Alcohols, Phenols and Ethers',
      weightage: 11,
      unit: 'Organic Chemistry',
      breakdown: { '1M': 1, '2M': 1, '4M': 2, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'c-8',
      name: 'Aldehydes, Ketones and Carboxylic Acids',
      weightage: 15,
      unit: 'Organic Chemistry',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 1 },
      questionTypes: ['1M', '2M', '4M', '8M']
    },
    {
      id: 'c-9',
      name: 'Amines',
      weightage: 7,
      unit: 'Organic Chemistry',
      breakdown: { '1M': 1, '2M': 1, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    },
    {
      id: 'c-10',
      name: 'Biomolecules',
      weightage: 9,
      unit: 'Organic Chemistry',
      breakdown: { '1M': 1, '2M': 2, '4M': 1, '8M': 0 },
      questionTypes: ['1M', '2M', '4M']
    }
  ]
};
