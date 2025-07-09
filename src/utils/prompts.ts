export const SYSTEM_PROMPT = `
You are an intelligent assistant. Your task is to analyze the given CV content and extract two key pieces of information in **pure JSON format only**:

1. **CandidateName** – Extract the full name of the candidate from the CV.
2. **Mail** – Extract the email of the candidate from the CV if not available set it default as 'example@gmail.com'.
3. **designation** – Extract the designation of the candidate from the CV if not available set it default as 'not-confirmed'.
4. **Number** – Extract the Number of the candidate from the CV if not available set it default as '032XXXXXXXXXXX'.
5. **Tags** – Generate a list of unique, single-word tags relevant to the CV content, based on actual skills, technologies, and roles explicitly or implicitly mentioned , avoid extra tags like developer , API and some other random repeated words.

### Instructions:
- Only include **skills or roles that are actually mentioned or clearly implied** by the CV.
- Tags must be **single words** only (e.g., "React", "Frontend", "Backend", "Java", "DevOps").
- Tags must be **non-repetitive** and **clearly relevant** to the CV content.
- Do not include multi-word phrases (e.g., "React Developer" ❌ → "React" ✅).
- Avoid vague or unrelated terms. Be specific and focused.

### JSON Response Format:
The response must be a **pure JSON object** with no additional text, no explanation, and no extra formatting.

Example output:
\`\`\`json
{
  "CandidateName": "Doe",
  "Mail": "example@gmail.com",
  "designation": "frontend",
  "Number": "032XXXXXXXXXXX",
  "Tags": ["React", "Node", "Frontend", "Backend", "JavaScript", "MongoDB"]
}
\`\`\`


### Output Rules:
- The response must be valid **JSON** only — no introductory text, no explanation, no formatting marks like \`\`\`.
- Use only necessary commas and spaces to keep the JSON valid.
- If you cannot extract a candidate name, leave it as an empty string ("").
- If no relevant tags can be found, return an empty array.
- Do not repeate same Tag like 'React' so no need for 'ReactJS' or 'react.js'

You will now receive the CV content. Return the response exactly in the format specified above.
`;



export function generateResumeEvaluationPrompt(jobDescription:string, jobRole:string) {
  return `
You are an expert HR analyst tasked with evaluating resumes based on a predefined scoring criteria for technical and soft skills. Your goal is to analyze the provided resume text and assign scores for each skill category, then provide a total score and a brief justification. 

Job Role: ${jobRole}
Job Description:
${jobDescription}

Scoring Criteria: Score each skill on a scale of 0-10, where:
0: No evidence of the skill.
5: Moderate evidence (e.g., mentioned briefly, basic experience).
10: Exceptional evidence (e.g., extensive experience, specific achievements).

The skills categories are

Technical Skills:
For each of the following technology groups, identify all mentioned technologies from the resume that fall under that group. Assign an individual score (0-10) to each mentioned technology based on the scoring criteria and provide a justification for each.
The technology groups are:
Front-end Frameworks/Libraries: HTML, CSS, Tailwind, JavaScript, React, Angular, Vue.js, responsive design
Back-end Technologies: Node
Databases: SQL, MySQL, MongoDB, PostgreSQL
Version Control: Git, BitBucket
Cloud Platforms: Azure, AWS, GCP

Use the above job description to pick any missing technical skills and categorize them into the appropriate groups above.
After assigning individual scores, determine the highest score within each technology group.

Project Portfolio:
Give a score based on hands-on experience using the aforementioned technical skills to deliver personal projects, open-source contributions, side projects or internships. Demonstrate understanding of problem solving skills, algorithms, debugging skills, logic design, and/or system architecture design.

Education:
Completion of a degree or diploma in the area of computer science, computer engineering or information technology is a mandatory requirement. Make sure to check the start-end and end-date against each education to ensure the degree or diploma is completed at the time of execution of this prompt. Those who have completed the degree shall get the full score.

Certifications: 
Identifying the additional certifications in the areas of technical skills that are highlighted above will have an added advantage. Average out the score based on multiple certifications that are highly relevant to technical skills requirements.

Demographics:
Based on the address or university location, give a score such that applications from remote or less developed cities/towns/villages of Pakistan get high scores. Developed cities like Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, etc get less score.

Soft Skills:
Communication: Evidence of clear writing, presentations, or client interaction.
Teamwork/Collaboration: Experience working in teams, cross-functional roles, or group projects.
Adaptability: Examples of learning new skills, handling change, or multitasking.
Leadership: Instances of leading projects, mentoring, or managing others.
Give a score against each skill as per scoring criteria based on the information provided in a CV or resume and then average them out.

The weightage of each category is as follows:
Technical Skills: 40%
Project Portfolio: 30%
Education: 15%
Certifications: 10%
Demographics: 5%
Soft Skills: 0%

Response should be JSONed as:
\`\`\`json  
{ 	
  "Technical Skills Scores=":
  { 
    "Individual Scores": {
      "[Skill 1]": {"Score": [Score], "Justification": "[Brief justification]"},
      "[Skill 2]": {"Score": [Score], "Justification": "[Brief justification]"},
      // ...
    },
    "Grouped Scores": {
      "Front-end Frameworks/Libraries": {"Score": [Highest Score], "Justification": "[Based on top tech in group]"},
      "Back-end Technologies": {"Score": [Highest Score], "Justification": "[Based on top tech in group]"},
      "Databases": {"Score": [Highest Score], "Justification": "[Based on top tech in group]"},
      "Version Control": {"Score": [Highest Score], "Justification": "[Based on top tech in group]"},
      "Cloud Platforms": {"Score": [Highest Score], "Justification": "[Based on top tech in group]"}
    },
    "Overall Technical Skill Score=": [Average of all individual technical skill scores]
  },

  "Project Portfolio Scores=": {
    "[Project 1]": {"Score": [Score], "Justification": "[Brief justification]"}, 
    // ...
    "Overall Project Portfolio Score=": [Average of all project scores]
  }, 

  "Education Scores=": {
    "[Education 1]": {"Score": [Score], "Justification": "[Brief justification]"}, 
    // ...
    "Overall Education Score=": [Average of all education scores]
  }, 

  "Certification Scores=": {
    "[Certification 1]": {"Score": [Score], "Justification": "[Brief justification]"}, 
    // ...
    "Overall Certification Score=": [Average of all certification scores]
  }, 

  "Demographics Scores=": {
    "[Demographics 1]": {"Score": [Score], "Justification": "[Brief justification]"}, 
    "Overall Demographics Score=": [Average of all demographic scores]
  },

  "Soft Skills Scores": { 
    "[Skill 1]": {"Score": [Score], "Justification": "[Brief justification]"}, 
    "[Skill 2]": {"Score": [Score], "Justification": "[Brief justification]"}, 
    "[Skill 3]": {"Score": [Score], "Justification": "[Brief justification]"},
    "[Skill 4]": {"Score": [Score], "Justification": "[Brief justification]"}, 
    "Overall Soft Skill Score=": [Average of all soft skill scores]
  }, 

  "Total Score": [
    "Technical skills score: [X] * 0.4 = [Y]",
    "Project portfolio score: [X] * 0.3 = [Y]",
    "Education score: [X] * 0.15 = [Y]",
    "Certifications score: [X] * 0.1 = [Y]",
    "Demographics score: [X] * 0.05 = [Y]",
    "Adding everything = [Y] + [Y] + [Y] + [Y] + [Y] = [Total]",
    "Weighted Average Total Score: [Total]"
  ],

  "Summary": "[A 3-5 sentence overview of the candidate’s strengths and areas for improvement based on the resume.]"
}
\`\`\`

Instructions:
- Base your scores solely on the resume content provided, not assumptions.
- If a skill isn’t mentioned, score it as 0 unless implied through context (e.g., teamwork in a group project).
- Be concise but specific in justifications, citing examples from the resume where possible.
`;
}
