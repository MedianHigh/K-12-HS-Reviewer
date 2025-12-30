import { EducationalLevel, CurricularTrack, Subject, QuarterData, WeekData } from './types.ts';

const getPlaceholderWeeks = (subject: string, level: string, codePrefix: string): WeekData[] => [
  { name: "Week 1-2", melc: `Foundational concepts and primary competencies in ${subject} as defined by DepEd ${level} Curriculum Guide.`, code: `${codePrefix}-Q1-W1` },
  { name: "Week 3-4", melc: `Critical analysis and application of ${subject} principles in academic and real-world contexts.`, code: `${codePrefix}-Q1-W2` },
  { name: "Week 5-6", melc: `Advanced development of specialized skills and competency-based projects in ${subject}.`, code: `${codePrefix}-Q1-W3` },
  { name: "Week 7-8", melc: `Comprehensive synthesis of learning and performance task review for ${subject}.`, code: `${codePrefix}-Q1-W4` },
];

const getSubjectQuarters = (subject: string, level: string, codePrefix: string): QuarterData[] => {
  return ([1, 2, 3, 4] as const).map(q => ({
    number: q,
    weeks: getPlaceholderWeeks(subject, level, codePrefix).map(w => ({
      ...w,
      code: w.code.replace('Q1', `Q${q}`)
    }))
  }));
};

// --- SPFL DATA GENERATORS ---
const getSPFLMelcs = (grade: number, lang: string): QuarterData[] => {
  const code = `SPFL-${lang.substring(0,3).toUpperCase()}${grade}`;
  
  // FRENCH
  if (lang === 'French') {
    if (grade === 7) return [
      { number: 1, weeks: [
        { name: "Week 1-2", melc: "Recognize the sound of every given letter (vowels and consonants).", code: `${code}-Q1-W1` },
        { name: "Week 3-4", melc: "Recognize different letters of the alphabet through pictures.", code: `${code}-Q1-W2` },
        { name: "Week 5-6", melc: "Recognize correct pronunciation of the alphabet.", code: `${code}-Q1-W3` },
        { name: "Week 7-8", melc: "Read basic words correctly.", code: `${code}-Q1-W4` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-2", melc: "Recognize numbers from 1 to 100.", code: `${code}-Q2-W1` },
        { name: "Week 3-4", melc: "Introduce oneself (name, age, address).", code: `${code}-Q2-W2` },
        { name: "Week 5-6", melc: "Communicate using basic greetings (Self, Family, Home).", code: `${code}-Q2-W3` },
        { name: "Week 7-8", melc: "Communicate using basic greetings (Friends, School).", code: `${code}-Q2-W4` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-3", melc: "Name body parts and commonly used objects.", code: `${code}-Q3-W1` },
        { name: "Week 4-6", melc: "Describe people, places, and things using common adjectives.", code: `${code}-Q3-W2` },
        { name: "Week 7-8", melc: "Recognize words expressing daily routine and time.", code: `${code}-Q3-W3` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-3", melc: "Talk about one's interests and ask basic questions.", code: `${code}-Q4-W1` },
        { name: "Week 4-6", melc: "Use short sentences to give directions and express feelings.", code: `${code}-Q4-W2` },
        { name: "Week 7-8", melc: "Construct sentences following a given pattern.", code: `${code}-Q4-W3` }
      ]}
    ];
    if (grade === 8) return [
      { number: 1, weeks: [
        { name: "Week 1-3", melc: "Recognize signs and symbols (Streets, Safety, Maps).", code: `${code}-Q1-W1` },
        { name: "Week 4-6", melc: "Talk about likes, dislikes, activities and hobbies.", code: `${code}-Q1-W2` },
        { name: "Week 7-8", melc: "Construct answers to Yes/No and WH- questions.", code: `${code}-Q1-W3` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-3", melc: "Give simple instructions, directions, or commands.", code: `${code}-Q2-W1` },
        { name: "Week 4-6", melc: "Listen to identify cause and/or effect.", code: `${code}-Q2-W2` },
        { name: "Week 7-8", melc: "Write simple commands in negative form.", code: `${code}-Q2-W3` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-3", melc: "Use polite expressions to answer questions.", code: `${code}-Q3-W1` },
        { name: "Week 4-6", melc: "Share basic information (grocery items, places).", code: `${code}-Q3-W2` },
        { name: "Week 7-8", melc: "Respond to basic questions.", code: `${code}-Q3-W3` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-4", melc: "Write about recent actions or experiences using simple sentences.", code: `${code}-Q4-W1` },
        { name: "Week 5-8", melc: "Narrate an experience in the past using simple sentence constructions.", code: `${code}-Q4-W2` }
      ]}
    ];
  }

  // GERMAN
  if (lang === 'German') {
    if (grade === 7) return [
      { number: 1, weeks: [
        { name: "Week 1-2", melc: "Appreciate the language and culture.", code: `${code}-Q1-W1` },
        { name: "Week 3-4", melc: "Introduce oneself (name, age, address).", code: `${code}-Q1-W2` },
        { name: "Week 5-6", melc: "Recognize basic greetings (self, family, school).", code: `${code}-Q1-W3` },
        { name: "Week 7-8", melc: "Recognize numbers 1-100 and sounds of letters.", code: `${code}-Q1-W4` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-3", melc: "Name body parts and common objects through listening.", code: `${code}-Q2-W1` },
        { name: "Week 4-6", melc: "Recognize words expressing daily routine and habitual actions.", code: `${code}-Q2-W2` },
        { name: "Week 7-8", melc: "Distinguish simple Yes/No and Wh- questions.", code: `${code}-Q2-W3` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-3", melc: "Talk about one's interests.", code: `${code}-Q3-W1` },
        { name: "Week 4-6", melc: "Use short sentences to express directions.", code: `${code}-Q3-W2` },
        { name: "Week 7-8", melc: "Express likes and dislikes properly.", code: `${code}-Q3-W3` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-3", melc: "Construct sentences following a given pattern.", code: `${code}-Q4-W1` },
        { name: "Week 4-6", melc: "Understand the basic writing system.", code: `${code}-Q4-W2` },
        { name: "Week 7-8", melc: "Engage in simple conversation and present a short skit.", code: `${code}-Q4-W3` }
      ]}
    ];
  }

  // SPANISH
  if (lang === 'Spanish') {
    if (grade === 7) return [
      { number: 1, weeks: [
        { name: "Week 1-3", melc: "Recognize the sound of every given letter.", code: `${code}-Q1-W1` },
        { name: "Week 4-6", melc: "Recognize letters through pictures.", code: `${code}-Q1-W2` },
        { name: "Week 7-8", melc: "Recognize correct pronunciation of the alphabet.", code: `${code}-Q1-W3` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-3", melc: "Introduce oneself (name, age, nationality).", code: `${code}-Q2-W1` },
        { name: "Week 4-6", melc: "Communicate using basic greetings.", code: `${code}-Q2-W2` },
        { name: "Week 7-8", melc: "Recognize numbers 1-100.", code: `${code}-Q2-W3` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-4", melc: "Name body parts and common objects through listening.", code: `${code}-Q3-W1` },
        { name: "Week 5-8", melc: "Recognize words expressing daily routine.", code: `${code}-Q3-W2` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-3", melc: "Talk about one's interests.", code: `${code}-Q4-W1` },
        { name: "Week 4-6", melc: "Use short sentences (directions, questions).", code: `${code}-Q4-W2` },
        { name: "Week 7-8", melc: "Construct sentences following a pattern.", code: `${code}-Q4-W3` }
      ]}
    ];
    if (grade === 8) return [
      { number: 1, weeks: [
        { name: "Week 1-4", melc: "Recognize signs and symbols (streets, buildings).", code: `${code}-Q1-W1` },
        { name: "Week 5-8", melc: "Talk about likes and dislikes.", code: `${code}-Q1-W2` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-4", melc: "Give simple instructions, directions or commands.", code: `${code}-Q2-W1` },
        { name: "Week 5-8", melc: "Listen to identify cause and effect.", code: `${code}-Q2-W2` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-4", melc: "Use polite expressions to answer questions.", code: `${code}-Q3-W1` },
        { name: "Week 5-8", melc: "Share basic information.", code: `${code}-Q3-W2` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-4", melc: "Write about recent actions or experiences.", code: `${code}-Q4-W1` },
        { name: "Week 5-8", melc: "Narrate an experience in the past.", code: `${code}-Q4-W2` }
      ]}
    ];
  }

  // MANDARIN
  if (lang === 'Mandarin') {
    if (grade === 7) return [
      { number: 1, weeks: [
        { name: "Week 1-2", melc: "Recognize sounds of initial and final letters.", code: `${code}-Q1-W1` },
        { name: "Week 3-4", melc: "Recognize letters/pinyin through pictures.", code: `${code}-Q1-W2` },
        { name: "Week 5-8", melc: "Recognize correct pronunciation and tones.", code: `${code}-Q1-W3` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-3", melc: "Introduce oneself (name, age, nationality).", code: `${code}-Q2-W1` },
        { name: "Week 4-6", melc: "Communicate using basic greetings.", code: `${code}-Q2-W2` },
        { name: "Week 7-8", melc: "Recognize numbers 1-100.", code: `${code}-Q2-W3` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-4", melc: "Name body parts and objects; recognize adjectives.", code: `${code}-Q3-W1` },
        { name: "Week 5-8", melc: "Recognize words for daily routine (time, days, months).", code: `${code}-Q3-W2` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-3", melc: "Talk about one's interests.", code: `${code}-Q4-W1` },
        { name: "Week 4-6", melc: "Use short sentences (directions, questions, feelings).", code: `${code}-Q4-W2` },
        { name: "Week 7-8", melc: "Construct sentences based on picture clues.", code: `${code}-Q4-W3` }
      ]}
    ];
  }

  // KOREAN
  if (lang === 'Korean') {
    if (grade === 7) return [
      { number: 1, weeks: [
        { name: "Week 1-2", melc: "Recognize the sound of every given letter (Hangeul).", code: `${code}-Q1-W1` },
        { name: "Week 3-6", melc: "Recognize letters of the alphabet through pictures (Vowels/Consonants).", code: `${code}-Q1-W2` },
        { name: "Week 7-8", melc: "Recognize correct pronunciation.", code: `${code}-Q1-W3` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-4", melc: "Introduce oneself (Nationality, Topic Marker).", code: `${code}-Q2-W1` },
        { name: "Week 5-8", melc: "Communicate using basic greetings (Daily Life).", code: `${code}-Q2-W2` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-4", melc: "Recognize words for daily routine (Time, Dates).", code: `${code}-Q3-W1` },
        { name: "Week 5-8", melc: "Name body parts and common objects.", code: `${code}-Q3-W2` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-4", melc: "Talk about one's interests (Making Appointments).", code: `${code}-Q4-W1` },
        { name: "Week 5-6", melc: "Construct sentences following a pattern.", code: `${code}-Q4-W2` },
        { name: "Week 7-8", melc: "Use short sentences (Directions, Questions).", code: `${code}-Q4-W3` }
      ]}
    ];
  }

  // Generic fallback
  return getSubjectQuarters(`${lang} Language`, `SPFL Grade ${grade}`, code);
};

// --- SPJ DATA GENERATORS ---
const getSPJWeeks = (grade: number): QuarterData[] => {
  const code = `SPJ${grade}`;
  
  if (grade === 7) {
    return [
      { number: 1, weeks: [
        { name: "Week 1-2", melc: "Define journalism, types, and RA 7079.", code: `${code}-Q1-W1` },
        { name: "Week 3-4", melc: "Explain news characteristics, elements, and angles.", code: `${code}-Q1-W2` },
        { name: "Week 5-6", melc: "Write summary lead and novelty lead.", code: `${code}-Q1-W3` },
        { name: "Week 7-8", melc: "Write straight news and news feature.", code: `${code}-Q1-W4` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-2", melc: "Explain duties of a copyreader and use copyreading symbols.", code: `${code}-Q2-W1` },
        { name: "Week 3-4", melc: "Identify types of headlines and write headlines.", code: `${code}-Q2-W2` },
        { name: "Week 5-6", melc: "Explain nature of editorial and write editorial of commendation.", code: `${code}-Q2-W3` },
        { name: "Week 7-8", melc: "Write editorial of criticism, argumentation or persuasion.", code: `${code}-Q2-W4` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-2", melc: "Distinguish kinds of sports stories (Advanced, Coverage).", code: `${code}-Q3-W1` },
        { name: "Week 3-4", melc: "Write sports feature and sports editorial.", code: `${code}-Q3-W2` },
        { name: "Week 5-6", melc: "Write human interest feature and character sketch.", code: `${code}-Q3-W3` },
        { name: "Week 7-8", melc: "Write science news and science feature.", code: `${code}-Q3-W4` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-2", melc: "Copyreading procedures and symbols.", code: `${code}-Q4-W1` },
        { name: "Week 3-4", melc: "Introduction to Photojournalism and Caption Writing.", code: `${code}-Q4-W2` },
        { name: "Week 5-6", melc: "Introduction to Desktop Publishing (Layout).", code: `${code}-Q4-W3` },
        { name: "Week 7-8", melc: "Evaluating and Producing School Publication.", code: `${code}-Q4-W4` }
      ]}
    ];
  }
  
  if (grade === 8) {
    return [
      { number: 1, weeks: [
        { name: "Week 1-2", melc: "Write composite news and in-depth news.", code: `${code}-Q1-W1` },
        { name: "Week 3-4", melc: "Write investigative news.", code: `${code}-Q1-W2` },
        { name: "Week 5-6", melc: "Write film or book reviews.", code: `${code}-Q1-W3` },
        { name: "Week 7-8", melc: "Write column and science article.", code: `${code}-Q1-W4` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-2", melc: "Utilize software tools for page layout.", code: `${code}-Q2-W1` },
        { name: "Week 3-4", melc: "Design front page and news/opinion pages.", code: `${code}-Q2-W2` },
        { name: "Week 5-6", melc: "Design features page and science page.", code: `${code}-Q2-W3` },
        { name: "Week 7-8", melc: "Design sports page.", code: `${code}-Q2-W4` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-3", melc: "Create an 8-page newsletter layout.", code: `${code}-Q3-W1` },
        { name: "Week 4-6", melc: "Create infographics and design a magazine.", code: `${code}-Q3-W2` },
        { name: "Week 7-8", melc: "Explain principles of web page design.", code: `${code}-Q3-W3` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-3", melc: "Write news, opinion, and feature stories for publication.", code: `${code}-Q4-W1` },
        { name: "Week 4-5", melc: "Write science and sports stories; take photos.", code: `${code}-Q4-W2` },
        { name: "Week 6-8", melc: "Design for print and online publication.", code: `${code}-Q4-W3` }
      ]}
    ];
  }

  if (grade === 9) {
    return [
      { number: 1, weeks: [
        { name: "Week 1-2", melc: "Explain principles of radio broadcast and laws.", code: `${code}-Q1-W1` },
        { name: "Week 3-4", melc: "Evaluate radio scripts and station ID.", code: `${code}-Q1-W2` },
        { name: "Week 5-6", melc: "Observe technical rules in radio news writing and infomercials.", code: `${code}-Q1-W3` },
        { name: "Week 7-8", melc: "Write a 5-minute radio news broadcast script.", code: `${code}-Q1-W4` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-2", melc: "Determine persons involved and duties in radio program.", code: `${code}-Q2-W1` },
        { name: "Week 3-4", melc: "Speak with modulated voice and read news stories.", code: `${code}-Q2-W2` },
        { name: "Week 5-6", melc: "Use sound effects and music; edit news reports.", code: `${code}-Q2-W3` },
        { name: "Week 7-8", melc: "Deliver a radio broadcast simulation.", code: `${code}-Q2-W4` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-2", melc: "Write breaking news, flash reports, and commentary.", code: `${code}-Q3-W1` },
        { name: "Week 3-4", melc: "Construct announcements and advertisements.", code: `${code}-Q3-W2` },
        { name: "Week 5-6", melc: "Compose feature story and documentary for radio.", code: `${code}-Q3-W3` },
        { name: "Week 7-8", melc: "Deliver field report and live report; conduct interviews.", code: `${code}-Q3-W4` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-3", melc: "Identify segments and choose sound effects for radio news.", code: `${code}-Q4-W1` },
        { name: "Week 4-5", melc: "Develop script and simulate 5-minute radio broadcast.", code: `${code}-Q4-W2` },
        { name: "Week 6-8", melc: "Produce radio news via podcasting and live streaming.", code: `${code}-Q4-W3` }
      ]}
    ];
  }

  if (grade === 10) {
    return [
      { number: 1, weeks: [
        { name: "Week 1-2", melc: "Cite history and principles of TV broadcasting.", code: `${code}-Q1-W1` },
        { name: "Week 3-4", melc: "Write different forms of stories for TV broadcast.", code: `${code}-Q1-W2` },
        { name: "Week 5-6", melc: "Write breaking news and plan TV broadcast.", code: `${code}-Q1-W3` },
        { name: "Week 7-8", melc: "Write a TV broadcast script.", code: `${code}-Q1-W4` }
      ]},
      { number: 2, weeks: [
        { name: "Week 1-2", melc: "Create advertorial and advocacy campaigns.", code: `${code}-Q2-W1` },
        { name: "Week 3-4", melc: "Create TV advertisements and sports/weather/entertainment segments.", code: `${code}-Q2-W2` },
        { name: "Week 5-6", melc: "Write business segment and identify current issues.", code: `${code}-Q2-W3` },
        { name: "Week 7-8", melc: "Write a comprehensive TV broadcast script.", code: `${code}-Q2-W4` }
      ]},
      { number: 3, weeks: [
        { name: "Week 1-2", melc: "Determine functions of TV personnel and play roles.", code: `${code}-Q3-W1` },
        { name: "Week 3-4", melc: "Speak using appropriate volume and tone.", code: `${code}-Q3-W2` },
        { name: "Week 5-6", melc: "Deliver news report and live/field report.", code: `${code}-Q3-W3` },
        { name: "Week 7-8", melc: "Design mock studio and manipulate equipment.", code: `${code}-Q3-W4` }
      ]},
      { number: 4, weeks: [
        { name: "Week 1-2", melc: "Create station ID and OBB for TV broadcast.", code: `${code}-Q4-W1` },
        { name: "Week 3-4", melc: "Apply visuals, edit videos, and use technical applications.", code: `${code}-Q4-W2` },
        { name: "Week 5-6", melc: "Develop script and simulate 6-minute TV broadcast.", code: `${code}-Q4-W3` },
        { name: "Week 7-8", melc: "Produce a TV broadcast through online platforms.", code: `${code}-Q4-W4` }
      ]}
    ];
  }

  return getSubjectQuarters("Journalism", `Grade ${grade}`, code);
};

const createGradeTrack = (program: string, grade: number, level: EducationalLevel, subjects: Array<{name: string, icon: string, desc: string, code: string}>): CurricularTrack => ({
  id: `${program.toLowerCase().replace(/\s+/g, '-')}-g${grade}`,
  name: `${program} - Grade ${grade}`,
  level: level,
  subjects: subjects.map(s => ({
    id: `${program.toLowerCase()}-g${grade}-${s.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: s.name,
    description: s.desc,
    icon: s.icon,
    quarters: getSubjectQuarters(s.name, program, `${s.code}${grade}`)
  }))
});

const createSPJTrack = (grade: number): CurricularTrack => ({
  id: `spj-g${grade}`,
  name: `SPJ - Grade ${grade}`,
  level: EducationalLevel.SPECIALIZED,
  subjects: [{
    id: `spj-g${grade}-journalism`,
    name: grade === 7 ? 'Journalism I (Print)' : grade === 8 ? 'Journalism II (Layout)' : grade === 9 ? 'Journalism III (Radio)' : 'Journalism IV (TV)',
    description: grade === 7 ? 'Basics of News and Editorial Writing' : grade === 8 ? 'Advanced Writing and Design' : grade === 9 ? 'Radio Broadcasting and Scripting' : 'TV Broadcasting and Production',
    icon: grade === 7 ? '📰' : grade === 8 ? '🗞️' : grade === 9 ? '🎙️' : '🎥',
    quarters: getSPJWeeks(grade)
  }]
});

const createSHSTrack = (name: string, subjects: Array<{name: string, icon: string, desc: string, code: string, category: 'Core' | 'Applied' | 'Specialized'}>): CurricularTrack => ({
  id: `shs-${name.toLowerCase().replace(/\s+/g, '-')}`,
  name: `SHS: ${name}`,
  level: EducationalLevel.SHS,
  subjects: subjects.map(s => ({
    id: `shs-${name.toLowerCase()}-${s.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: s.name,
    description: s.desc,
    icon: s.icon,
    category: s.category,
    quarters: getSubjectQuarters(s.name, 'SHS', s.code)
  }))
});

// JHS Standard Subjects List (Grades 7-10)
const jhsBaseSubjects = (grade: number) => [
  { name: 'English', icon: '📖', desc: 'Language and Literature', code: `ENG${grade}` },
  { name: 'Filipino', icon: '🇵🇭', desc: 'Wika at Panitikan', code: `FIL${grade}` },
  { name: 'Mathematics', icon: '📐', desc: 'Algebra, Geometry, Statistics', code: `MTH${grade}` },
  { name: 'Science', icon: '🧬', desc: 'Biology, Chemistry, Physics, Earth Science', code: `SCI${grade}` },
  { name: 'Araling Panlipunan', icon: '🏛️', desc: 'History and Economics', code: `AP${grade}` },
  { name: 'EsP', icon: '💖', desc: 'Edukasyon sa Pagpapakatao', code: `ESP${grade}` },
  { name: 'Music', icon: '🎵', desc: 'Music Appreciation and Production', code: `MUS${grade}` },
  { name: 'Arts', icon: '🎨', desc: 'Art History and Creation', code: `ART${grade}` },
  { name: 'Physical Education', icon: '🏃', desc: 'Fitness and Sports', code: `PE${grade}` },
  { name: 'Health', icon: '🍎', desc: 'Health and Wellness', code: `HLT${grade}` },
  { name: 'TLE', icon: '🛠️', desc: 'Technology and Livelihood Education', code: `TLE${grade}` },
];

// SHS COLLECTIONS (Core, Applied, specialized)
const shsCore = [
  { name: '21st Century Literature', icon: '📚', desc: 'Philippines and the World.', code: 'EN12Lit', category: 'Core' as const },
  { name: 'Contemp. Philippine Arts', icon: '🎨', desc: 'Art forms from the regions.', code: 'CAR11/12', category: 'Core' as const },
  { name: 'Disaster Readiness & RR', icon: '🚨', desc: 'Disaster risks and reduction.', code: 'DRR11/12', category: 'Core' as const },
  { name: 'Earth and Life Science', icon: '🌍', desc: 'Life, Earth, and the Universe.', code: 'S11/12ES', category: 'Core' as const },
  { name: 'Earth Science', icon: '🌋', desc: 'Planet Earth and its systems.', code: 'S11ES', category: 'Core' as const },
  { name: 'General Mathematics', icon: '🔢', desc: 'Functions, business math, logic.', code: 'M11GM', category: 'Core' as const },
  { name: 'Intro to Philosophy', icon: '🤔', desc: 'The Human Person.', code: 'PPT11/12', category: 'Core' as const },
  { name: 'Komunikasyon at Pananaliksik', icon: '🇵🇭', desc: 'Wika at Kulturang Pilipino.', code: 'F11PT', category: 'Core' as const },
  { name: 'Media & Info Literacy', icon: '💻', desc: 'Media, Information, and Tech.', code: 'MIL11/12', category: 'Core' as const },
  { name: 'Oral Communication', icon: '🗣️', desc: 'Communication in context.', code: 'EN11/12OC', category: 'Core' as const },
  { name: 'Pagbasa at Pagsusuri', icon: '📖', desc: 'Tungo sa Pananaliksik.', code: 'F11PB', category: 'Core' as const },
  { name: 'Personal Development', icon: '🧠', desc: 'Self-development and stress.', code: 'EsP-PD11/12', category: 'Core' as const },
  { name: 'Physical Education', icon: '🏃', desc: 'Fitness, sports, and health.', code: 'PEH11/12', category: 'Core' as const },
  { name: 'Physical Science', icon: '⚛️', desc: 'Physics and Chemistry principles.', code: 'S11/12PS', category: 'Core' as const },
  { name: 'Reading & Writing Skills', icon: '✍️', desc: 'Academic reading and writing.', code: 'EN11/12RWS', category: 'Core' as const },
  { name: 'Statistics & Probability', icon: '📊', desc: 'Random variables, sampling.', code: 'M11/12SP', category: 'Core' as const },
  { name: 'Understanding Culture', icon: '🤝', desc: 'Society and Politics.', code: 'UCSP11/12', category: 'Core' as const },
];

const shsApplied = [
  { name: 'Empowerment Tech', icon: '💾', desc: 'ICT for professional tracks.', code: 'CS_ICT11/12', category: 'Applied' as const },
  { name: 'EAPP', icon: '📝', desc: 'English for Academic Purposes.', code: 'CS_EN11/12A', category: 'Applied' as const },
  { name: 'Entrepreneurship', icon: '💼', desc: 'Business principles and plans.', code: 'CS_EP11/12B', category: 'Applied' as const },
  { name: 'Filipino (Akademik)', icon: '📘', desc: 'Piling Larang: Akademik.', code: 'CS_FA11/12', category: 'Applied' as const },
  { name: 'Filipino (Isports)', icon: '🏀', desc: 'Piling Larang: Isports.', code: 'CS_FI11/12', category: 'Applied' as const },
  { name: 'Filipino (Sining)', icon: '🎭', desc: 'Piling Larang: Sining.', code: 'CS_FSD11/12', category: 'Applied' as const },
  { name: 'Filipino (Tech-Voc)', icon: '🛠️', desc: 'Piling Larang: Tech-Voc.', code: 'CS_FTV11/12', category: 'Applied' as const },
  { name: 'Inquiries & Immersion', icon: '🔍', desc: 'Research project.', code: 'CS_RS12', category: 'Applied' as const },
  { name: 'Practical Research 1', icon: '📊', desc: 'Qualitative research.', code: 'CS_RS11', category: 'Applied' as const },
  { name: 'Practical Research 2', icon: '📉', desc: 'Quantitative research.', code: 'CS_RS12', category: 'Applied' as const },
];

// Specialized Programs Subjects (SPA, SPS, etc.)
const spaSubjects = [
  { name: 'Creative Writing', icon: '🖋️', desc: 'Fundamentals of poetics, fiction, and scriptwriting.', code: 'SPA_CW' },
  { name: 'Dance', icon: '💃', desc: 'Folkdance, ballet, and contemporary choreography.', code: 'SPA_DA' },
  { name: 'Media Arts', icon: '📽️', desc: 'Photography, filmmaking, and digital storytelling.', code: 'SPA_MA' },
  { name: 'Music', icon: '🎵', desc: 'Theory, performance, and cultural musicality.', code: 'SPA_MU' },
  { name: 'Theater Arts', icon: '🎭', desc: 'Acting, staging, and dramatic production.', code: 'SPA_TA' },
  { name: 'Visual Arts', icon: '🖼️', desc: 'Painting, sculpture, and design principles.', code: 'SPA_VA' },
];

const spsSubjects = [
  { name: 'Biomechanics', icon: '🏃', desc: 'Movement analysis and corrective physics.', code: 'SPS_BM' },
  { name: 'Exercise Physiology', icon: '🫀', desc: 'Human biology and sports conditioning.', code: 'SPS_EP' },
  { name: 'Sports Injury', icon: '🩹', desc: 'Prevention and basic first aid care.', code: 'SPS_SI' },
  { name: 'Sports Nutrition', icon: '🥗', desc: 'Dietary planning for peak performance.', code: 'SPS_SN' },
  { name: 'Psychosocial Skills', icon: '🧠', desc: 'Motivation and leadership in sports.', code: 'SPS_PS' },
];

const sptveG7Subjects = [
  { name: 'Intro to Specializations', icon: '🛠️', desc: 'Exploratory course in various technologies.', code: 'SPTVE_EXPL' },
  { name: 'Technical Drawing', icon: '📐', desc: 'Foundational sketching and drafting skills.', code: 'SPTVE_MTDR' },
];

const sptveG8_10Subjects = [
  { name: 'Agri-Fishery Arts', icon: '🌾', desc: 'Crop production and aquaculture.', code: 'SPTVE_AF' },
  { name: 'Home Economics', icon: '🍳', desc: 'Cookery, beauty care, and garments.', code: 'SPTVE_HE' },
  { name: 'Industrial Arts', icon: '⚙️', desc: 'Automotive, electronics, and welding.', code: 'SPTVE_IA' },
  { name: 'ICT', icon: '💻', desc: 'Computer systems and networking.', code: 'SPTVE_ICT' },
];

// STE Subjects (Science, Technology, and Engineering)
const steG7Subjects = [
  { name: 'Environmental Science', icon: '🌍', desc: 'Ecological concepts and resources.', code: 'STE_ES' },
  { name: 'Computer Science 1', icon: '💻', desc: 'Basics of computing and software.', code: 'STE_CS1' },
];

const steG8Subjects = [
  { name: 'Biotechnology', icon: '🧬', desc: 'Cells, heredity, and traditional biotech.', code: 'STE_BIO' },
  { name: 'Computer Science 2', icon: '🎨', desc: 'Photo editing and digital design.', code: 'STE_CS2' },
];

const steG9Subjects = [
  { name: 'Consumer Chemistry', icon: '🧪', desc: 'Organic compounds and food chemistry.', code: 'STE_CHEM' },
  { name: 'Research 1', icon: '🔍', desc: 'Scientific methods and proposal writing.', code: 'STE_RES1' },
];

const steG10Subjects = [
  { name: 'Electronics', icon: '🔌', desc: 'Circuits, robotics, and binary logic.', code: 'STE_ELEC' },
  { name: 'Research 2', icon: '📝', desc: 'Data analysis and project defense.', code: 'STE_RES2' },
];

// Arts and Design Track Subjects
const artsDesignSubjects = [
    { name: 'Performing Arts Appr.', icon: '🎭', desc: 'Apprenticeship (Music).', code: 'AD_AEPMU12', category: 'Specialized' as const },
    { name: 'Creative Industries 1', icon: '🎨', desc: 'Arts Appreciation.', code: 'AD_ADP11', category: 'Specialized' as const },
    { name: 'Creative Industries 2', icon: '💃', desc: 'Performing Arts.', code: 'AD_CIP11', category: 'Specialized' as const },
    { name: 'Filipino Identity', icon: '🇵🇭', desc: 'Identity in the Arts.', code: 'AD_DFI12', category: 'Specialized' as const },
    { name: 'Integrating Elements', icon: '🧩', desc: 'Principles of Organization.', code: 'AD_EPA12', category: 'Specialized' as const },
    { name: 'Leadership in Arts', icon: '👔', desc: 'Management in Arts.', code: 'AD_LMA12', category: 'Specialized' as const },
    { name: 'Phys & Personal Dev', icon: '🧘', desc: 'Development in Arts.', code: 'AD_PPD12', category: 'Specialized' as const },
    { name: 'Production', icon: '🎬', desc: 'Performing Arts Production.', code: 'AD_PPA12', category: 'Specialized' as const },
];

// Sports Track Subjects
const sportsSubjects = [
    { name: 'Apprenticeship', icon: '🏟️', desc: 'Off-Campus.', code: 'SP_APA12', category: 'Specialized' as const },
    { name: 'Fitness Leadership', icon: '🏋️', desc: 'Sports & Recreation.', code: 'SP_LS12', category: 'Specialized' as const },
    { name: 'Fitness Testing', icon: '⏱️', desc: 'Exercise Programming.', code: 'SP_FT11', category: 'Specialized' as const },
    { name: 'Coaching Basics', icon: '📋', desc: 'Fundamentals of Coaching.', code: 'SP_FC11', category: 'Specialized' as const },
    { name: 'Human Movement', icon: '🏃', desc: 'Movement Analysis.', code: 'SP_HM11', category: 'Specialized' as const },
    { name: 'Practicum', icon: '🏆', desc: 'In-Campus.', code: 'SP_PRA12', category: 'Specialized' as const },
    { name: 'Psychosocial Aspects', icon: '🧠', desc: 'Sports and Exercise.', code: 'SP_PS11', category: 'Specialized' as const },
    { name: 'Safety & First Aid', icon: '⛑️', desc: 'Injury Management.', code: 'SP_SFA11', category: 'Specialized' as const },
    { name: 'Sports Officiating', icon: '🏁', desc: 'Activity Management.', code: 'SP_SO11', category: 'Specialized' as const },
];

const createSPFLTrack = (grade: number): CurricularTrack => ({
  id: `spfl-g${grade}`,
  name: `SPFL - Grade ${grade}`,
  level: EducationalLevel.SPECIALIZED,
  subjects: [
    { 
      id: `spfl-g${grade}-spanish`, 
      name: 'Spanish', 
      description: 'Foreign Language: Spanish', 
      icon: '🇪🇸', 
      quarters: getSPFLMelcs(grade, 'Spanish') 
    },
    { 
      id: `spfl-g${grade}-mandarin`, 
      name: 'Mandarin', 
      description: 'Foreign Language: Mandarin Chinese', 
      icon: '🇨🇳', 
      quarters: getSPFLMelcs(grade, 'Mandarin')
    },
    { 
      id: `spfl-g${grade}-french`, 
      name: 'French', 
      description: 'Foreign Language: French', 
      icon: '🇫🇷', 
      quarters: getSPFLMelcs(grade, 'French') 
    },
    {
      id: `spfl-g${grade}-german`,
      name: 'German',
      description: 'Foreign Language: German',
      icon: '🇩🇪',
      quarters: getSPFLMelcs(grade, 'German')
    },
    {
      id: `spfl-g${grade}-korean`,
      name: 'Korean',
      description: 'Foreign Language: Korean',
      icon: '🇰🇷',
      quarters: getSPFLMelcs(grade, 'Korean')
    }
  ]
});

export const CURRICULUM_DATA: CurricularTrack[] = [
  // JHS REGULAR - Full DepEd Subject List
  {
    id: 'jhs-7',
    name: 'JHS Grade 7',
    level: EducationalLevel.JHS,
    subjects: jhsBaseSubjects(7).map(s => ({
        id: `jhs7-${s.name.toLowerCase()}`,
        ...s,
        description: s.desc,
        quarters: getSubjectQuarters(s.name, 'JHS Grade 7', s.code)
    }))
  },
  {
    id: 'jhs-8',
    name: 'JHS Grade 8',
    level: EducationalLevel.JHS,
    subjects: jhsBaseSubjects(8).map(s => ({
        id: `jhs8-${s.name.toLowerCase()}`,
        ...s,
        description: s.desc,
        quarters: getSubjectQuarters(s.name, 'JHS Grade 8', s.code)
    }))
  },
  {
    id: 'jhs-9',
    name: 'JHS Grade 9',
    level: EducationalLevel.JHS,
    subjects: jhsBaseSubjects(9).map(s => ({
        id: `jhs9-${s.name.toLowerCase()}`,
        ...s,
        description: s.desc,
        quarters: getSubjectQuarters(s.name, 'JHS Grade 9', s.code)
    }))
  },
  {
    id: 'jhs-10',
    name: 'JHS Grade 10',
    level: EducationalLevel.JHS,
    subjects: jhsBaseSubjects(10).map(s => ({
        id: `jhs10-${s.name.toLowerCase()}`,
        ...s,
        description: s.desc,
        quarters: getSubjectQuarters(s.name, 'JHS Grade 10', s.code)
    }))
  },

  // SPECIALIZED PROGRAMS
  createGradeTrack('SPA', 7, EducationalLevel.SPECIALIZED, spaSubjects),
  createGradeTrack('SPA', 8, EducationalLevel.SPECIALIZED, spaSubjects),
  createGradeTrack('SPA', 9, EducationalLevel.SPECIALIZED, spaSubjects),
  createGradeTrack('SPA', 10, EducationalLevel.SPECIALIZED, spaSubjects),

  // SPJ - JOURNALISM
  createSPJTrack(7),
  createSPJTrack(8),
  createSPJTrack(9),
  createSPJTrack(10),

  createGradeTrack('SPS', 7, EducationalLevel.SPECIALIZED, spsSubjects),
  createGradeTrack('SPS', 8, EducationalLevel.SPECIALIZED, spsSubjects),
  createGradeTrack('SPS', 9, EducationalLevel.SPECIALIZED, spsSubjects),
  createGradeTrack('SPS', 10, EducationalLevel.SPECIALIZED, spsSubjects),

  // SPFL - FOREIGN LANGUAGE
  createSPFLTrack(7),
  createSPFLTrack(8),
  createSPFLTrack(9),
  createSPFLTrack(10),

  createGradeTrack('SPTVE', 7, EducationalLevel.SPECIALIZED, sptveG7Subjects),
  createGradeTrack('SPTVE', 8, EducationalLevel.SPECIALIZED, sptveG8_10Subjects),
  createGradeTrack('SPTVE', 9, EducationalLevel.SPECIALIZED, sptveG8_10Subjects),
  createGradeTrack('SPTVE', 10, EducationalLevel.SPECIALIZED, sptveG8_10Subjects),

  // STE TRACK
  createGradeTrack('STE', 7, EducationalLevel.SPECIALIZED, steG7Subjects),
  createGradeTrack('STE', 8, EducationalLevel.SPECIALIZED, steG8Subjects),
  createGradeTrack('STE', 9, EducationalLevel.SPECIALIZED, steG9Subjects),
  createGradeTrack('STE', 10, EducationalLevel.SPECIALIZED, steG10Subjects),

  // SHS ACADEMIC TRACKS - Comprehensive List
  createSHSTrack('Core Subjects', shsCore),
  createSHSTrack('Applied Subjects', shsApplied),
  createSHSTrack('STEM Strand', [
    { name: 'Basic Calculus', icon: '∫', desc: 'Limits, Derivatives, Integrals.', code: 'STEM_BC11', category: 'Specialized' },
    { name: 'Biology 1', icon: '🧬', desc: 'Cells, Energy, Genetics.', code: 'STEM_BIO11/12', category: 'Specialized' },
    { name: 'Biology 2', icon: '🌿', desc: 'Organisms, Evolution, Ecology.', code: 'STEM_BIO11/12', category: 'Specialized' },
    { name: 'General Chemistry 1', icon: '🧪', desc: 'Matter, Atoms, Reactions.', code: 'STEM_GC11', category: 'Specialized' },
    { name: 'General Chemistry 2', icon: '⚗️', desc: 'Liquids, Solids, Solutions.', code: 'STEM_GC11', category: 'Specialized' },
    { name: 'General Physics 1', icon: '🏎️', desc: 'Mechanics, Waves, Heat.', code: 'STEM_GP12', category: 'Specialized' },
    { name: 'General Physics 2', icon: '⚡', desc: 'Electricity, Magnetism, Optics.', code: 'STEM_GP12', category: 'Specialized' },
    { name: 'Pre-Calculus', icon: '📐', desc: 'Conics, Trigonometry.', code: 'STEM_PC11', category: 'Specialized' },
  ]),
  createSHSTrack('ABM Strand', [
    { name: 'Applied Economics', icon: '💹', desc: 'Economics and business.', code: 'ABM_AE12', category: 'Specialized' },
    { name: 'Business Ethics', icon: '⚖️', desc: 'Social Responsibility.', code: 'ABM_ESR12', category: 'Specialized' },
    { name: 'Business Finance', icon: '💰', desc: 'Financial management.', code: 'ABM_BF12', category: 'Specialized' },
    { name: 'Business Math', icon: '➕', desc: 'Mathematics for business.', code: 'ABM_BM11', category: 'Specialized' },
    { name: 'Accounting 1', icon: '📒', desc: 'Fundamentals of ABM 1.', code: 'ABM_FABM11', category: 'Specialized' },
    { name: 'Accounting 2', icon: '🧾', desc: 'Fundamentals of ABM 2.', code: 'ABM_FABM12', category: 'Specialized' },
    { name: 'Org & Management', icon: '🏢', desc: 'Concepts and theories.', code: 'ABM_AOM11', category: 'Specialized' },
    { name: 'Principles of Marketing', icon: '📣', desc: 'Marketing strategies.', code: 'ABM_PM11', category: 'Specialized' },
  ]),
  createSHSTrack('HUMSS Strand', [
    { name: 'Community Engagement', icon: '🤝', desc: 'Solidarity and Citizenship.', code: 'HUMSS_CSC12', category: 'Specialized' },
    { name: 'Creative Nonfiction', icon: '📝', desc: 'Literary essays/memoirs.', code: 'HUMSS_CNF11/12', category: 'Specialized' },
    { name: 'Creative Writing', icon: '✒️', desc: 'Fiction, Poetry, Drama.', code: 'HUMSS_CW/MP11/12', category: 'Specialized' },
    { name: 'Culminating Activity', icon: '🎓', desc: 'Portfolio/Project.', code: 'HUMSS_CA12', category: 'Specialized' },
    { name: 'DIASS', icon: '🧠', desc: 'Counseling, Social Work.', code: 'HUMSS_DIASS', category: 'Specialized' },
    { name: 'DISS', icon: '🌍', desc: 'Social Science Disciplines.', code: 'HUMSS_DISS', category: 'Specialized' },
    { name: 'World Religions', icon: '⛩️', desc: 'Belief Systems.', code: 'HUMSS_WRB12', category: 'Specialized' },
    { name: 'Malikhaing Pagsulat', icon: '✍️', desc: 'Creative Writing (Filipino).', code: 'HUMSS_CW/MP11/12', category: 'Specialized' },
    { name: 'Politics & Governance', icon: '🏛️', desc: 'Philippine Government.', code: 'HUMSS_PG12', category: 'Specialized' },
    { name: 'Trends & Critical Thinking', icon: '🌐', desc: '21st Century Trends.', code: 'HUMSS_MCT12', category: 'Specialized' },
  ]),
  createSHSTrack('Arts and Design', artsDesignSubjects),
  createSHSTrack('Sports Track', sportsSubjects)
];