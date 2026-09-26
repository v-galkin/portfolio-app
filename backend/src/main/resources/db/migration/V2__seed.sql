-- ============================================================
--  V2: seed content (Vitalii Galkin)
--  Formerly src/main/resources/data.sql, which ran on every startup and re-inserted
--  seeded rows after they had been deleted in the admin panel. As a migration it runs once.
-- ============================================================

-- ── EXPERIENCES ──────────────────────────────────────────────
INSERT INTO experiences (company, role, start_date, end_date, location)
SELECT 'Direct Control', 'Lighting Controls Engineer', '2021-12', '2023-07', 'Mount Eden, Auckland'
    WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE role = 'Lighting Controls Engineer');

INSERT INTO experiences (company, role, start_date, end_date, location)
SELECT 'Direct Control', 'Lighting & HVAC Controls Technician', '2018-08', '2021-12', 'Mount Eden, Auckland'
    WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE role = 'Lighting & HVAC Controls Technician');

INSERT INTO experience_responsibilities (experience_id, responsibility)
SELECT id, 'Managed delivery of lighting control projects across commercial buildings, offices, stadiums, and universities — handling timelines, budgets, and client relationships from design through to completion'
FROM experiences WHERE role = 'Lighting Controls Engineer'
                   AND NOT EXISTS (SELECT 1 FROM experience_responsibilities er JOIN experiences e ON er.experience_id = e.id WHERE e.role = 'Lighting Controls Engineer');

INSERT INTO experience_responsibilities (experience_id, responsibility)
SELECT id, 'Created electrical and functional designs including drawings, integration specs, and client documentation based on project requirements'
FROM experiences WHERE role = 'Lighting Controls Engineer'
                   AND NOT EXISTS (SELECT 1 FROM experience_responsibilities WHERE responsibility LIKE 'Created electrical%');

INSERT INTO experience_responsibilities (experience_id, responsibility)
SELECT id, 'Trained and mentored new team members in system programming, commissioning, troubleshooting, and internal networking'
FROM experiences WHERE role = 'Lighting Controls Engineer'
                   AND NOT EXISTS (SELECT 1 FROM experience_responsibilities WHERE responsibility LIKE 'Trained and mentored%');

INSERT INTO experience_responsibilities (experience_id, responsibility)
SELECT id, 'Installed, configured, and commissioned lighting and HVAC control systems across a range of commercial projects, working to project specs and resolving issues through testing and inspections'
FROM experiences WHERE role = 'Lighting & HVAC Controls Technician'
                   AND NOT EXISTS (SELECT 1 FROM experience_responsibilities WHERE responsibility LIKE 'Installed, configured%');

INSERT INTO experience_responsibilities (experience_id, responsibility)
SELECT id, 'Provided end-user training on system operation and maintenance'
FROM experiences WHERE role = 'Lighting & HVAC Controls Technician'
                   AND NOT EXISTS (SELECT 1 FROM experience_responsibilities WHERE responsibility LIKE 'Provided end-user%');

INSERT INTO experience_responsibilities (experience_id, responsibility)
SELECT id, 'Kept detailed records of system settings, IP addresses, setpoints, alarms, and I/O configurations'
FROM experiences WHERE role = 'Lighting & HVAC Controls Technician'
                   AND NOT EXISTS (SELECT 1 FROM experience_responsibilities WHERE responsibility LIKE 'Kept detailed records%');

-- EDUCATION
INSERT INTO educations (institution, degree, field, start_date, end_date, location)
SELECT 'University of London', 'Bachelor of Science', 'Computer Science', '2023-04', '2026-03', 'Online'
    WHERE NOT EXISTS (SELECT 1 FROM educations WHERE institution = 'University of London');

INSERT INTO educations (institution, degree, field, start_date, end_date, location)
SELECT 'Toi Ohomai Institute of Technology', 'Diploma', 'Electrical Engineering', '2016-01', '2017-12', 'New Zealand'
    WHERE NOT EXISTS (SELECT 1 FROM educations WHERE institution = 'Toi Ohomai Institute of Technology');

-- SKILLS
INSERT INTO skills (category)
SELECT 'Programming'
    WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Programming');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Python' FROM skills WHERE category = 'Programming'
                                  AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Programming' AND si.item = 'Python');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'JavaScript' FROM skills WHERE category = 'Programming'
                                      AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Programming' AND si.item = 'JavaScript');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'TypeScript' FROM skills WHERE category = 'Programming'
                                      AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Programming' AND si.item = 'TypeScript');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Java' FROM skills WHERE category = 'Programming'
                                AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Programming' AND si.item = 'Java');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'SQL' FROM skills WHERE category = 'Programming'
                               AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Programming' AND si.item = 'SQL');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'React' FROM skills WHERE category = 'Programming'
                                 AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Programming' AND si.item = 'React');

INSERT INTO skills (category)
SELECT 'AI & ML'
    WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'AI & ML');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'RoBERTa' FROM skills WHERE category = 'AI & ML'
                                   AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'AI & ML' AND si.item = 'RoBERTa');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'FinBERT' FROM skills WHERE category = 'AI & ML'
                                   AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'AI & ML' AND si.item = 'FinBERT');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Naive Bayes' FROM skills WHERE category = 'AI & ML'
                                       AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'AI & ML' AND si.item = 'Naive Bayes');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'SVM' FROM skills WHERE category = 'AI & ML'
                               AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'AI & ML' AND si.item = 'SVM');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Rule-Based Classification' FROM skills WHERE category = 'AI & ML'
                                                     AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'AI & ML' AND si.item = 'Rule-Based Classification');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'LLM Integration' FROM skills WHERE category = 'AI & ML'
                                           AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'AI & ML' AND si.item = 'LLM Integration');

INSERT INTO skills (category)
SELECT 'Automation'
    WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Automation');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'n8n' FROM skills WHERE category = 'Automation'
                               AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Automation' AND si.item = 'n8n');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Notion Workflows' FROM skills WHERE category = 'Automation'
                                            AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Automation' AND si.item = 'Notion Workflows');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'API Integration' FROM skills WHERE category = 'Automation'
                                           AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Automation' AND si.item = 'API Integration');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Claude (Anthropic)' FROM skills WHERE category = 'Automation'
                                              AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Automation' AND si.item = 'Claude (Anthropic)');

INSERT INTO skills (category)
SELECT 'Cloud & DevOps'
    WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Cloud & DevOps');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'AWS' FROM skills WHERE category = 'Cloud & DevOps'
                               AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Cloud & DevOps' AND si.item = 'AWS');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Docker' FROM skills WHERE category = 'Cloud & DevOps'
                                  AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Cloud & DevOps' AND si.item = 'Docker');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Swagger' FROM skills WHERE category = 'Cloud & DevOps'
                                   AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Cloud & DevOps' AND si.item = 'Swagger');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Git' FROM skills WHERE category = 'Cloud & DevOps'
                               AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Cloud & DevOps' AND si.item = 'Git');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Linux' FROM skills WHERE category = 'Cloud & DevOps'
                                 AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Cloud & DevOps' AND si.item = 'Linux');

INSERT INTO skills (category)
SELECT 'Engineering'
    WHERE NOT EXISTS (SELECT 1 FROM skills WHERE category = 'Engineering');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Systems Design' FROM skills WHERE category = 'Engineering'
                                          AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Engineering' AND si.item = 'Systems Design');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Automation Systems' FROM skills WHERE category = 'Engineering'
                                              AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Engineering' AND si.item = 'Automation Systems');

INSERT INTO skill_items (skill_id, item)
SELECT id, 'Controls Integration' FROM skills WHERE category = 'Engineering'
                                                AND NOT EXISTS (SELECT 1 FROM skill_items si JOIN skills s ON si.skill_id = s.id WHERE s.category = 'Engineering' AND si.item = 'Controls Integration');

-- CERTIFICATIONS
INSERT INTO certifications (name, issuer, date, credential_url)
SELECT 'IBM Applied AI Professional Certificate (V3)', 'IBM', '2024-01', NULL
    WHERE NOT EXISTS (SELECT 1 FROM certifications WHERE name = 'IBM Applied AI Professional Certificate (V3)');

INSERT INTO certifications (name, issuer, date, credential_url)
SELECT 'IBM AI Engineering Professional Certificate (V2)', 'IBM', '2024-01', NULL
    WHERE NOT EXISTS (SELECT 1 FROM certifications WHERE name = 'IBM AI Engineering Professional Certificate (V2)');

INSERT INTO certifications (name, issuer, date, credential_url)
SELECT 'Meta Front-End Developer Certificate', 'Meta', '2024-01', NULL
    WHERE NOT EXISTS (SELECT 1 FROM certifications WHERE name = 'Meta Front-End Developer Certificate');