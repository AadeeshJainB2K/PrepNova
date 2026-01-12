import postgres from "postgres";
import crypto from "crypto";

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://abhajain:2010@localhost:5432/prepnova";

async function seedExamData() {
  const sql = postgres(DATABASE_URL);
  
  try {
    console.log("🌱 Seeding Exam-Compass data...\n");
    
    // Sample exams data
    const exams = [
      {
        id: "jee-mains",
        name: "JEE Mains",
        full_name: "Joint Entrance Examination - Main",
        category: "Engineering",
        difficulty: "Hard",
        total_seats: 15000,
        estimated_applicants: 1200000,
        logo_url: "🎓",
        description: "JEE Main is a national level entrance exam conducted for admission to undergraduate engineering programs at NITs, IIITs, and other centrally funded technical institutions.",
        syllabus: JSON.stringify([
          { subject: "Physics", topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics"] },
          { subject: "Chemistry", topics: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"] },
          { subject: "Mathematics", topics: ["Algebra", "Calculus", "Coordinate Geometry", "Trigonometry", "Statistics"] }
        ]),
        career_paths: JSON.stringify([
          "IITs - Indian Institutes of Technology",
          "NITs - National Institutes of Technology",
          "IIITs - Indian Institutes of Information Technology",
          "GFTIs - Government Funded Technical Institutes"
        ]),
        exam_pattern: JSON.stringify({
          mode: "Computer Based Test (CBT)",
          duration: "3 hours",
          sections: ["Physics", "Chemistry", "Mathematics"],
          totalQuestions: 90,
          totalMarks: 300,
          marking: "+4 for correct, -1 for incorrect"
        }),
        eligibility: JSON.stringify({
          age: "No age limit",
          qualification: "10+2 with Physics, Chemistry, and Mathematics",
          percentage: "75% in 12th (65% for SC/ST)"
        }),
        is_active: true
      },
      {
        id: "neet",
        name: "NEET",
        full_name: "National Eligibility cum Entrance Test",
        category: "Medical",
        difficulty: "Very Hard",
        total_seats: 90000,
        estimated_applicants: 1800000,
        logo_url: "⚕️",
        description: "NEET is the single entrance examination for admission to MBBS/BDS courses in India in Medical/Dental Colleges.",
        syllabus: JSON.stringify([
          { subject: "Physics", topics: ["Mechanics", "Thermodynamics", "Electrodynamics", "Optics", "Modern Physics"] },
          { subject: "Chemistry", topics: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"] },
          { subject: "Biology", topics: ["Botany", "Zoology", "Human Physiology", "Genetics", "Ecology"] }
        ]),
        career_paths: JSON.stringify([
          "AIIMS - All India Institute of Medical Sciences",
          "Government Medical Colleges",
          "Private Medical Colleges",
          "Dental Colleges"
        ]),
        exam_pattern: JSON.stringify({
          mode: "Pen and Paper (Offline)",
          duration: "3 hours 20 minutes",
          sections: ["Physics", "Chemistry", "Biology"],
          totalQuestions: 200,
          totalMarks: 720,
          marking: "+4 for correct, -1 for incorrect"
        }),
        eligibility: JSON.stringify({
          age: "17-25 years",
          qualification: "10+2 with Physics, Chemistry, Biology",
          percentage: "50% in PCB (40% for SC/ST/OBC)"
        }),
        is_active: true
      },
      {
        id: "clat",
        name: "CLAT",
        full_name: "Common Law Admission Test",
        category: "Law",
        difficulty: "Medium",
        total_seats: 2500,
        estimated_applicants: 60000,
        logo_url: "⚖️",
        description: "CLAT is a centralized national level entrance exam for admission to undergraduate and postgraduate law programs.",
        syllabus: JSON.stringify([
          { subject: "English", topics: ["Comprehension", "Grammar", "Vocabulary"] },
          { subject: "Current Affairs", topics: ["National", "International", "Legal Affairs"] },
          { subject: "Legal Reasoning", topics: ["Legal Principles", "Case Studies"] },
          { subject: "Logical Reasoning", topics: ["Analytical", "Critical Thinking"] },
          { subject: "Quantitative Techniques", topics: ["Mathematics", "Data Interpretation"] }
        ]),
        career_paths: JSON.stringify([
          "National Law Universities (NLUs)",
          "Top Law Colleges",
          "Legal Practice",
          "Judiciary Services"
        ]),
        exam_pattern: JSON.stringify({
          mode: "Computer Based Test (CBT)",
          duration: "2 hours",
          sections: ["English", "Current Affairs", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
          totalQuestions: 120,
          totalMarks: 120,
          marking: "+1 for correct, -0.25 for incorrect"
        }),
        eligibility: JSON.stringify({
          age: "No age limit",
          qualification: "10+2 from recognized board",
          percentage: "45% in 12th"
        }),
        is_active: true
      },
      {
        id: "upsc-cse",
        name: "UPSC CSE",
        full_name: "Union Public Service Commission - Civil Services Examination",
        category: "Civil Services",
        difficulty: "Very Hard",
        total_seats: 1000,
        estimated_applicants: 1000000,
        logo_url: "🏛️",
        description: "UPSC CSE is conducted for recruitment to various Civil Services of the Government of India including IAS, IPS, IFS.",
        syllabus: JSON.stringify([
          { subject: "General Studies", topics: ["History", "Geography", "Polity", "Economy", "Environment", "Science & Technology"] },
          { subject: "Optional Subject", topics: ["Choose from 48 optional subjects"] },
          { subject: "Essay", topics: ["Current Affairs", "Philosophical", "Social Issues"] }
        ]),
        career_paths: JSON.stringify([
          "IAS - Indian Administrative Service",
          "IPS - Indian Police Service",
          "IFS - Indian Foreign Service",
          "IRS - Indian Revenue Service"
        ]),
        exam_pattern: JSON.stringify({
          mode: "Offline (Prelims & Mains) + Interview",
          duration: "Prelims: 2 hours each, Mains: 3 hours each",
          sections: ["Prelims (2 papers)", "Mains (9 papers)", "Interview"],
          totalMarks: 2025,
          marking: "Negative marking in Prelims only"
        }),
        eligibility: JSON.stringify({
          age: "21-32 years (relaxation for reserved categories)",
          qualification: "Bachelor's degree from recognized university",
          attempts: "6 attempts for General, 9 for OBC, Unlimited for SC/ST"
        }),
        is_active: true
      },
      {
        id: "cat",
        name: "CAT",
        full_name: "Common Admission Test",
        category: "Management",
        difficulty: "Hard",
        total_seats: 5000,
        estimated_applicants: 250000,
        logo_url: "💼",
        description: "CAT is a computer-based test for admission to MBA programs at IIMs and other top B-schools in India.",
        syllabus: JSON.stringify([
          { subject: "Verbal Ability", topics: ["Reading Comprehension", "Para Jumbles", "Sentence Correction"] },
          { subject: "Data Interpretation", topics: ["Tables", "Charts", "Graphs", "Caselets"] },
          { subject: "Logical Reasoning", topics: ["Arrangements", "Blood Relations", "Syllogisms"] },
          { subject: "Quantitative Ability", topics: ["Arithmetic", "Algebra", "Geometry", "Number Systems"] }
        ]),
        career_paths: JSON.stringify([
          "IIMs - Indian Institutes of Management",
          "Top B-Schools (FMS, XLRI, SPJIMR)",
          "Management Consulting",
          "Corporate Leadership"
        ]),
        exam_pattern: JSON.stringify({
          mode: "Computer Based Test (CBT)",
          duration: "2 hours",
          sections: ["VARC", "DILR", "QA"],
          totalQuestions: 66,
          totalMarks: 198,
          marking: "+3 for correct, -1 for incorrect"
        }),
        eligibility: JSON.stringify({
          age: "No age limit",
          qualification: "Bachelor's degree with 50% marks",
          percentage: "50% for General, 45% for SC/ST/PWD"
        }),
        is_active: true
      },
      {
        id: "gate",
        name: "GATE",
        full_name: "Graduate Aptitude Test in Engineering",
        category: "Engineering PG",
        difficulty: "Hard",
        total_seats: 100000,
        estimated_applicants: 900000,
        logo_url: "🔧",
        description: "GATE is an examination for admission to postgraduate programs in engineering, technology, and architecture.",
        syllabus: JSON.stringify([
          { subject: "Engineering Mathematics", topics: ["Linear Algebra", "Calculus", "Differential Equations", "Probability"] },
          { subject: "Core Subject", topics: ["Choose from 27 engineering disciplines"] },
          { subject: "General Aptitude", topics: ["Verbal Ability", "Numerical Ability"] }
        ]),
        career_paths: JSON.stringify([
          "M.Tech at IITs/NITs",
          "PSU Jobs (ONGC, NTPC, BHEL)",
          "Research Positions",
          "PhD Programs"
        ]),
        exam_pattern: JSON.stringify({
          mode: "Computer Based Test (CBT)",
          duration: "3 hours",
          sections: ["General Aptitude", "Engineering Mathematics", "Core Subject"],
          totalQuestions: 65,
          totalMarks: 100,
          marking: "+1/+2 for correct, -1/3 or -2/3 for incorrect"
        }),
        eligibility: JSON.stringify({
          age: "No age limit",
          qualification: "B.E./B.Tech or equivalent",
          percentage: "No minimum percentage required"
        }),
        is_active: true
      }
    ];
    
    console.log("📚 Inserting exams...");
    for (const exam of exams) {
      await sql`
        INSERT INTO exams ${sql(exam)}
        ON CONFLICT (id) DO NOTHING
      `;
      console.log(`   ✓ ${exam.name}`);
    }
    
    // Sample exam timelines
    console.log("\n📅 Inserting exam timelines...");
    const timelines = [
      { exam_id: "jee-mains", event_type: "registration", event_name: "Registration Opens", start_date: new Date("2026-02-01"), is_active: true },
      { exam_id: "jee-mains", event_type: "registration", event_name: "Registration Closes", start_date: new Date("2026-03-15"), is_active: true },
      { exam_id: "jee-mains", event_type: "admit_card", event_name: "Admit Card Release", start_date: new Date("2026-03-25"), is_active: true },
      { exam_id: "jee-mains", event_type: "exam", event_name: "Exam Date", start_date: new Date("2026-04-10"), is_active: true },
      { exam_id: "jee-mains", event_type: "result", event_name: "Result Declaration", start_date: new Date("2026-05-01"), is_active: true },
      
      { exam_id: "neet", event_type: "registration", event_name: "Registration Opens", start_date: new Date("2026-02-15"), is_active: true },
      { exam_id: "neet", event_type: "registration", event_name: "Registration Closes", start_date: new Date("2026-03-20"), is_active: true },
      { exam_id: "neet", event_type: "admit_card", event_name: "Admit Card Release", start_date: new Date("2026-04-01"), is_active: true },
      { exam_id: "neet", event_type: "exam", event_name: "Exam Date", start_date: new Date("2026-05-05"), is_active: true },
      { exam_id: "neet", event_type: "result", event_name: "Result Declaration", start_date: new Date("2026-06-10"), is_active: true },
    ];
    
    for (const timeline of timelines) {
      await sql`
        INSERT INTO exam_timelines (id, exam_id, event_type, event_name, start_date, is_active, created_at)
        VALUES (${crypto.randomUUID()}, ${timeline.exam_id}, ${timeline.event_type}, ${timeline.event_name}, ${timeline.start_date}, ${timeline.is_active}, NOW())
        ON CONFLICT DO NOTHING
      `;
    }
    console.log(`   ✓ Added ${timelines.length} timeline events`);
    
    // Sample mock questions
    console.log("\n❓ Inserting sample mock questions...");
    const questions = [
      {
        exam_id: "jee-mains",
        subject: "Physics",
        topic: "Mechanics",
        question: "A body of mass 2 kg is moving with a velocity of 10 m/s. What is its kinetic energy?",
        options: JSON.stringify(["50 J", "100 J", "150 J", "200 J"]),
        correct_answer: "100 J",
        explanation: "Kinetic Energy = (1/2)mv² = (1/2)(2)(10)² = 100 J",
        difficulty: "Easy",
        question_type: "MCQ",
        is_ai_generated: false
      },
      {
        exam_id: "jee-mains",
        subject: "Mathematics",
        topic: "Algebra",
        question: "If x² - 5x + 6 = 0, what are the roots?",
        options: JSON.stringify(["2, 3", "1, 6", "-2, -3", "0, 5"]),
        correct_answer: "2, 3",
        explanation: "Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3",
        difficulty: "Easy",
        question_type: "MCQ",
        is_ai_generated: false
      },
      {
        exam_id: "neet",
        subject: "Biology",
        topic: "Cell Biology",
        question: "Which organelle is known as the powerhouse of the cell?",
        options: JSON.stringify(["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"]),
        correct_answer: "Mitochondria",
        explanation: "Mitochondria produce ATP through cellular respiration, providing energy for the cell.",
        difficulty: "Easy",
        question_type: "MCQ",
        is_ai_generated: false
      }
    ];
    
    for (const q of questions) {
      await sql`
        INSERT INTO mock_questions (id, exam_id, subject, topic, question, options, correct_answer, explanation, difficulty, question_type, is_ai_generated, created_at)
        VALUES (${crypto.randomUUID()}, ${q.exam_id}, ${q.subject}, ${q.topic}, ${q.question}, ${q.options}, ${q.correct_answer}, ${q.explanation}, ${q.difficulty}, ${q.question_type}, ${q.is_ai_generated}, NOW())
      `;
    }
    console.log(`   ✓ Added ${questions.length} sample questions`);
    
    console.log("\n✅ Seed data inserted successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - ${exams.length} exams`);
    console.log(`   - ${timelines.length} timeline events`);
    console.log(`   - ${questions.length} mock questions`);
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await sql.end();
    process.exit(1);
  }
}

seedExamData();
