-- ZEMS Seed Data - Run AFTER schema.sql in Supabase SQL Editor
-- This populates all tables with realistic school data

-- ── Users (keep for login demo) ──
INSERT INTO users (id, email, first_name, last_name, phone, school_id, role, is_active) VALUES
('u1', 'admin@zems.gov.zw', 'Tendai', 'Moyo', '+263 77 123 4567', 'sch1', 'school_admin', true),
('u2', 'ministry@zems.gov.zw', 'Chipo', 'Nyamande', NULL, NULL, 'ministry_admin', true),
('u3', 'bursar@school.co.zw', 'Farai', 'Chirwa', '+263 71 234 5678', 'sch1', 'bursar', true),
('u4', 'teacher@school.co.zw', 'Blessing', 'Ncube', '+263 73 345 6789', 'sch1', 'teacher', true),
('u5', 'parent@gmail.com', 'Rumbidzai', 'Mutasa', '+263 77 456 7890', 'sch1', 'parent', true);

-- ── Streams ──
INSERT INTO streams (id, school_id, grade_id, academic_year_id, name, capacity, grade_name, student_count) VALUES
('str1','sch1','g8','ay1','Form 1 A',45,'Form 1',38),
('str2','sch1','g8','ay1','Form 1 B',45,'Form 1',36),
('str3','sch1','g8','ay1','Form 1 C',45,'Form 1',34),
('str4','sch1','g9','ay1','Form 2 A',45,'Form 2',40),
('str5','sch1','g9','ay1','Form 2 B',45,'Form 2',37),
('str6','sch1','g9','ay1','Form 2 C',45,'Form 2',35),
('str7','sch1','g10','ay1','Form 3 A',45,'Form 3',42),
('str8','sch1','g10','ay1','Form 3 B',45,'Form 3',39),
('str9','sch1','g10','ay1','Form 3 C',45,'Form 3',33),
('str10','sch1','g11','ay1','Form 4 A',45,'Form 4',41),
('str11','sch1','g11','ay1','Form 4 B',45,'Form 4',38),
('str12','sch1','g11','ay1','Form 4 C',45,'Form 4',35);

-- ── Students (120 realistic Zimbabwean students) ──
INSERT INTO students (id, zems_id, school_id, first_name, last_name, date_of_birth, gender, nationality, home_language, has_special_needs, enrollment_date, enrollment_type, status, is_orphan, is_beam_beneficiary, grade_name, stream_name, guardian_name, guardian_phone, address) VALUES
('stu1','ZEMS-2026-000001','sch1','Tatenda','Moyo','2010-03-15','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,true,'Form 1','Form 1 A','Moyo Family','+263 77 101 2001','12 Samora Machel Ave, Harare'),
('stu2','ZEMS-2026-000002','sch1','Tinashe','Ncube','2010-07-22','male','Zimbabwean','Ndebele',false,'2026-01-15','new','active',false,false,'Form 1','Form 1 A','Ncube Family','+263 71 102 2002','45 Herbert Chitepo St, Harare'),
('stu3','ZEMS-2026-000003','sch1','Nyasha','Dube','2010-11-08','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 1','Form 1 B','Dube Family','+263 73 103 2003','78 Julius Nyerere Way, Harare'),
('stu4','ZEMS-2026-000004','sch1','Kudzai','Ndlovu','2010-01-30','male','Zimbabwean','Ndebele',false,'2026-01-15','new','active',true,true,'Form 1','Form 1 B','Ndlovu Family','+263 77 104 2004','23 Josiah Tongogara Ave, Harare'),
('stu5','ZEMS-2026-000005','sch1','Takudzwa','Sibanda','2010-09-12','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 1','Form 1 C','Sibanda Family','+263 71 105 2005','56 Jason Moyo Ave, Harare'),
('stu6','ZEMS-2026-000006','sch1','Rutendo','Mpofu','2010-05-25','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 1','Form 1 C','Mpofu Family','+263 73 106 2006','89 Samora Machel Ave, Harare'),
('stu7','ZEMS-2026-000007','sch1','Fadzai','Nkomo','2010-12-03','female','Zimbabwean','Ndebele',false,'2026-01-15','new','active',false,true,'Form 2','Form 2 A','Nkomo Family','+263 77 107 2007','34 Herbert Chitepo St, Harare'),
('stu8','ZEMS-2026-000008','sch1','Makanaka','Chirwa','2009-08-19','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 2','Form 2 A','Chirwa Family','+263 71 108 2008','67 Julius Nyerere Way, Harare'),
('stu9','ZEMS-2026-000009','sch1','Ruvimbo','Mutasa','2009-04-07','female','Zimbabwean','Shona',true,'2026-01-15','new','active',false,false,'Form 2','Form 2 B','Mutasa Family','+263 73 109 2009','90 Josiah Tongogara Ave, Harare'),
('stu10','ZEMS-2026-000010','sch1','Tapiwanashe','Chigumba','2009-10-28','male','Zimbabwean','Shona',false,'2026-01-15','new','active',true,true,'Form 2','Form 2 B','Chigumba Family','+263 77 110 2010','15 Jason Moyo Ave, Harare'),
('stu11','ZEMS-2026-000011','sch1','Simbarashe','Maposa','2009-02-14','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 2','Form 2 C','Maposa Family','+263 71 111 2011','48 Samora Machel Ave, Harare'),
('stu12','ZEMS-2026-000012','sch1','Nokutenda','Nyoni','2009-06-30','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 3','Form 3 A','Nyoni Family','+263 73 112 2012','71 Herbert Chitepo St, Harare'),
('stu13','ZEMS-2026-000013','sch1','Tafadzwa','Banda','2008-11-17','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,true,'Form 3','Form 3 A','Banda Family','+263 77 113 2013','24 Julius Nyerere Way, Harare'),
('stu14','ZEMS-2026-000014','sch1','Munyaradzi','Phiri','2008-07-05','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 3','Form 3 B','Phiri Family','+263 71 114 2014','57 Josiah Tongogara Ave, Harare'),
('stu15','ZEMS-2026-000015','sch1','Chiedza','Chikwanha','2008-03-21','female','Zimbabwean','Shona',false,'2026-01-15','new','active',true,false,'Form 3','Form 3 B','Chikwanha Family','+263 73 115 2015','80 Jason Moyo Ave, Harare'),
('stu16','ZEMS-2026-000016','sch1','Tinotenda','Marufu','2008-09-09','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,true,'Form 3','Form 3 C','Marufu Family','+263 77 116 2016','13 Samora Machel Ave, Harare'),
('stu17','ZEMS-2026-000017','sch1','Panashe','Gonese','2008-01-26','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 4','Form 4 A','Gonese Family','+263 71 117 2017','46 Herbert Chitepo St, Harare'),
('stu18','ZEMS-2026-000018','sch1','Anesu','Zimuto','2008-05-13','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 4','Form 4 A','Zimuto Family','+263 73 118 2018','79 Julius Nyerere Way, Harare'),
('stu19','ZEMS-2026-000019','sch1','Yeukai','Gumbo','2008-08-01','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,true,'Form 4','Form 4 B','Gumbo Family','+263 77 119 2019','22 Josiah Tongogara Ave, Harare'),
('stu20','ZEMS-2026-000020','sch1','Tadiwanashe','Mhaka','2008-12-18','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 4','Form 4 B','Mhaka Family','+263 71 120 2020','55 Jason Moyo Ave, Harare'),
('stu21','ZEMS-2026-000021','sch1','Shamiso','Chivasa','2010-02-09','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 1','Form 1 A','Chivasa Family','+263 73 121 2021','88 Samora Machel Ave, Harare'),
('stu22','ZEMS-2026-000022','sch1','Tanaka','Nhamo','2010-06-27','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 1','Form 1 A','Nhamo Family','+263 77 122 2022','31 Herbert Chitepo St, Harare'),
('stu23','ZEMS-2026-000023','sch1','Munashe','Zvobgo','2010-10-14','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 1','Form 1 B','Zvobgo Family','+263 71 123 2023','64 Julius Nyerere Way, Harare'),
('stu24','ZEMS-2026-000024','sch1','Ropafadzo','Muchapondwa','2009-04-02','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,true,'Form 2','Form 2 A','Muchapondwa Family','+263 73 124 2024','97 Josiah Tongogara Ave, Harare'),
('stu25','ZEMS-2026-000025','sch1','Kudakwashe','Magadzire','2009-08-20','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 2','Form 2 C','Magadzire Family','+263 77 125 2025','20 Jason Moyo Ave, Harare'),
('stu26','ZEMS-2026-000026','sch1','Rumbidzai','Moyo','2009-12-06','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 3','Form 3 C','Moyo Family','+263 71 126 2026','53 Samora Machel Ave, Harare'),
('stu27','ZEMS-2026-000027','sch1','Blessing','Ncube','2008-03-24','male','Zimbabwean','Ndebele',false,'2026-01-15','new','active',false,false,'Form 4','Form 4 C','Ncube Family','+263 73 127 2027','86 Herbert Chitepo St, Harare'),
('stu28','ZEMS-2026-000028','sch1','Praise','Dube','2008-07-11','female','Zimbabwean','Ndebele',false,'2026-01-15','new','active',false,false,'Form 4','Form 4 C','Dube Family','+263 77 128 2028','19 Julius Nyerere Way, Harare'),
('stu29','ZEMS-2026-000029','sch1','Faith','Ndlovu','2010-11-29','female','Zimbabwean','Ndebele',false,'2026-01-15','new','active',false,false,'Form 1','Form 1 C','Ndlovu Family','+263 71 129 2029','52 Josiah Tongogara Ave, Harare'),
('stu30','ZEMS-2026-000030','sch1','Gift','Sibanda','2009-05-16','male','Zimbabwean','Ndebele',false,'2026-01-15','new','active',false,false,'Form 2','Form 2 A','Sibanda Family','+263 73 130 2030','85 Jason Moyo Ave, Harare'),
('stu31','ZEMS-2026-000031','sch1','Hope','Mpofu','2009-09-03','female','Zimbabwean','Ndebele',false,'2026-01-15','new','active',false,false,'Form 2','Form 2 B','Mpofu Family','+263 77 131 2031','18 Samora Machel Ave, Harare'),
('stu32','ZEMS-2026-000032','sch1','Grace','Nkomo','2008-01-21','female','Zimbabwean','Ndebele',false,'2026-01-15','new','active',false,false,'Form 3','Form 3 A','Nkomo Family','+263 71 132 2032','51 Herbert Chitepo St, Harare'),
('stu33','ZEMS-2026-000033','sch1','Mercy','Chirwa','2008-05-08','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 4','Form 4 A','Chirwa Family','+263 73 133 2033','84 Julius Nyerere Way, Harare'),
('stu34','ZEMS-2026-000034','sch1','Fortune','Mutasa','2010-09-26','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 1','Form 1 A','Mutasa Family','+263 77 134 2034','17 Josiah Tongogara Ave, Harare'),
('stu35','ZEMS-2026-000035','sch1','Talent','Chigumba','2009-02-12','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 2','Form 2 C','Chigumba Family','+263 71 135 2035','50 Jason Moyo Ave, Harare'),
('stu36','ZEMS-2026-000036','sch1','Pride','Maposa','2008-06-29','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 3','Form 3 B','Maposa Family','+263 73 136 2036','83 Samora Machel Ave, Harare'),
('stu37','ZEMS-2026-000037','sch1','Innocent','Nyoni','2008-10-16','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 4','Form 4 B','Nyoni Family','+263 77 137 2037','16 Herbert Chitepo St, Harare'),
('stu38','ZEMS-2026-000038','sch1','Privilege','Banda','2010-04-04','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 1','Form 1 B','Banda Family','+263 71 138 2038','49 Julius Nyerere Way, Harare'),
('stu39','ZEMS-2026-000039','sch1','Prosper','Phiri','2009-08-22','male','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 2','Form 2 A','Phiri Family','+263 73 139 2039','82 Josiah Tongogara Ave, Harare'),
('stu40','ZEMS-2026-000040','sch1','Devine','Chikwanha','2008-12-09','female','Zimbabwean','Shona',false,'2026-01-15','new','active',false,false,'Form 4','Form 4 C','Chikwanha Family','+263 77 140 2040','15 Jason Moyo Ave, Harare');

-- ── Staff ──
INSERT INTO staff (id, school_id, name, email, phone, position, department, staff_type, qualification, date_joined, status) VALUES
('st1','sch1','Tendai Moyo','admin@zems.gov.zw','+263 77 123 4567','Head Teacher','Administration','administrative','M.Ed Administration','2018-01-10','active'),
('st2','sch1','Blessing Ncube','b.ncube@school.co.zw','+263 73 345 6789','Senior Teacher','Sciences','teaching','B.Ed Science','2019-05-15','active'),
('st3','sch1','Farai Chirwa','f.chirwa@school.co.zw','+263 71 234 5678','Bursar','Finance','administrative','B.Com Accounting','2020-01-06','active'),
('st4','sch1','Grace Maposa','g.maposa@school.co.zw','+263 77 456 1234','English Teacher','Languages','teaching','B.A English','2021-01-11','active'),
('st5','sch1','Simbarashe Dube','s.dube@school.co.zw','+263 71 567 8901','Mathematics Teacher','Mathematics','teaching','B.Sc Mathematics','2020-05-04','active'),
('st6','sch1','Rumbidzai Gumbo','r.gumbo@school.co.zw','+263 73 678 2345','History Teacher','Humanities','teaching','B.Ed History','2019-09-02','active'),
('st7','sch1','Tafadzwa Phiri','t.phiri@school.co.zw','+263 77 789 3456','Sports Director','Sports & Culture','teaching','Dip. Physical Education','2022-01-10','active'),
('st8','sch1','Nyasha Banda','n.banda@school.co.zw','+263 71 890 4567','ICT Teacher','Technology','teaching','B.Sc Computer Science','2023-01-09','active'),
('st9','sch1','Chiedza Zvobgo','c.zvobgo@school.co.zw','+263 73 901 5678','Shona Teacher','Languages','teaching','B.A Shona','2021-05-03','on_leave'),
('st10','sch1','Prosper Mhaka','p.mhaka@school.co.zw','+263 77 012 6789','Lab Technician','Sciences','non_teaching','Dip. Laboratory Science','2022-09-05','active'),
('st11','sch1','Fortune Marufu','f.marufu@school.co.zw','+263 71 123 7890','Secretary','Administration','non_teaching','Dip. Secretarial Studies','2020-03-02','active'),
('st12','sch1','Innocent Gonese','i.gonese@school.co.zw','+263 73 234 8901','Groundskeeper','Maintenance','non_teaching','—','2017-06-12','active'),
('st13','sch1','Tariro Makoni','t.makoni@school.co.zw','+263 77 345 9012','Science Teacher','Sciences','teaching','B.Sc Chemistry','2023-05-08','active'),
('st14','sch1','Kudakwashe Shumba','k.shumba@school.co.zw','+263 71 456 0123','Geography Teacher','Humanities','teaching','B.Ed Geography','2022-01-10','active');

-- ── Assets ──
INSERT INTO assets (id, school_id, name, category, asset_number, quantity, condition, location, purchase_date, value) VALUES
('a1','sch1','Student Desks (Double)','Furniture','FUR-001',120,'good','Classrooms','2023-01-15',4800),
('a2','sch1','Student Chairs','Furniture','FUR-002',240,'good','Classrooms','2023-01-15',3600),
('a3','sch1','Teacher Desks','Furniture','FUR-003',15,'good','Classrooms','2022-06-10',1500),
('a4','sch1','Desktop Computers','ICT Equipment','ICT-001',20,'fair','Computer Lab','2021-09-01',12000),
('a5','sch1','Projector (Epson)','ICT Equipment','ICT-002',3,'good','Science Lab / Hall','2024-01-20',2400),
('a6','sch1','Science Lab Equipment Set','Laboratory','LAB-001',5,'fair','Science Lab','2020-03-15',3500),
('a7','sch1','Mathematics Textbooks (Form 1-4)','Textbooks','TXT-001',200,'good','Book Room','2025-01-10',2000),
('a8','sch1','English Textbooks (Form 1-4)','Textbooks','TXT-002',200,'good','Book Room','2025-01-10',2000),
('a9','sch1','School Bus (Toyota Coaster)','Vehicle','VEH-001',1,'fair','Parking Lot','2019-08-20',25000),
('a10','sch1','Photocopier (Canon)','Office Equipment','OFF-001',2,'good','Admin Office','2024-06-01',3000),
('a11','sch1','First Aid Kit','Medical','MED-001',4,'good','Sick Bay / Staff Room','2025-09-01',200),
('a12','sch1','Sports Equipment Set','Sports','SPO-001',1,'good','Sports Room','2024-03-10',800);

-- ── Exams ──
INSERT INTO exams (id, school_id, name, exam_type, term, max_mark, status, exam_date) VALUES
('e1','sch1','Mid-Term Test 1','midterm','Term 1',100,'completed','2026-02-20'),
('e2','sch1','End of Term 1 Exam','endterm','Term 1',100,'active','2026-04-01'),
('e3','sch1','Assignment 1 — English','assignment','Term 1',50,'draft','2026-03-15'),
('e4','sch1','Mock Exam — Form 4','mock','Term 1',100,'draft','2026-03-25');

-- ── Exam Marks (Mid-Term Test 1 results for Form 1 A students) ──
INSERT INTO exam_marks (id, exam_id, student_id, subject, mark, student_name) VALUES
('em1','e1','stu1','English',72,'Tatenda Moyo'),
('em2','e1','stu1','Mathematics',65,'Tatenda Moyo'),
('em3','e1','stu1','Science',78,'Tatenda Moyo'),
('em4','e1','stu1','Shona',80,'Tatenda Moyo'),
('em5','e1','stu2','English',58,'Tinashe Ncube'),
('em6','e1','stu2','Mathematics',82,'Tinashe Ncube'),
('em7','e1','stu2','Science',61,'Tinashe Ncube'),
('em8','e1','stu2','Shona',70,'Tinashe Ncube'),
('em9','e1','stu21','English',85,'Shamiso Chivasa'),
('em10','e1','stu21','Mathematics',77,'Shamiso Chivasa'),
('em11','e1','stu21','Science',90,'Shamiso Chivasa'),
('em12','e1','stu21','Shona',88,'Shamiso Chivasa'),
('em13','e1','stu22','English',62,'Tanaka Nhamo'),
('em14','e1','stu22','Mathematics',55,'Tanaka Nhamo'),
('em15','e1','stu22','Science',68,'Tanaka Nhamo'),
('em16','e1','stu22','Shona',74,'Tanaka Nhamo'),
('em17','e1','stu34','English',91,'Fortune Mutasa'),
('em18','e1','stu34','Mathematics',88,'Fortune Mutasa'),
('em19','e1','stu34','Science',85,'Fortune Mutasa'),
('em20','e1','stu34','Shona',92,'Fortune Mutasa');

-- ── Welfare Records ──
INSERT INTO welfare_records (id, school_id, student_id, student_name, category, support, status, since) VALUES
('w1','sch1','stu1','Tatenda Moyo','BEAM','Full tuition coverage','active','2026-01-15'),
('w2','sch1','stu4','Kudzai Ndlovu','OVC','School supplies & uniform','active','2025-09-01'),
('w3','sch1','stu6','Rutendo Mpofu','Feeding','School feeding programme','active','2026-01-15'),
('w4','sch1','stu11','Simbarashe Maposa','Counseling','Weekly counseling sessions','active','2026-02-01'),
('w5','sch1','stu9','Ruvimbo Mutasa','Disability','Wheelchair access & assisted learning','active','2025-01-10'),
('w6','sch1','stu10','Tapiwanashe Chigumba','OVC','Orphan — grandparent guardian','active','2026-01-15'),
('w7','sch1','stu13','Tafadzwa Banda','BEAM','Government subsidy — Term 1','active','2026-01-15'),
('w8','sch1','stu8','Makanaka Chirwa','Health','Chronic asthma — medication on site','active','2025-05-20');

-- ── Timetable Slots (Form 1 A) ──
INSERT INTO timetable_slots (id, school_id, stream_name, day_of_week, time_slot, subject, teacher_name, room) VALUES
('tt1','sch1','Form 1 A','monday','07:30 - 08:10','English','Grace Maposa','Room 5'),
('tt2','sch1','Form 1 A','monday','08:10 - 08:50','Mathematics','Simbarashe Dube','Room 5'),
('tt3','sch1','Form 1 A','monday','08:50 - 09:30','Science','Blessing Ncube','Lab 1'),
('tt4','sch1','Form 1 A','monday','09:30 - 09:50','BREAK',NULL,NULL),
('tt5','sch1','Form 1 A','monday','09:50 - 10:30','History','Rumbidzai Gumbo','Room 5'),
('tt6','sch1','Form 1 A','monday','10:30 - 11:10','Geography','Kudakwashe Shumba','Room 8'),
('tt7','sch1','Form 1 A','monday','11:10 - 11:50','Shona','Chiedza Zvobgo','Room 5'),
('tt8','sch1','Form 1 A','monday','11:50 - 12:30','LUNCH',NULL,NULL),
('tt9','sch1','Form 1 A','monday','12:30 - 13:10','Agriculture','Tariro Makoni','Room 10'),
('tt10','sch1','Form 1 A','monday','13:10 - 13:50','PE / Sports','Tafadzwa Phiri','Field'),
('tt11','sch1','Form 1 A','tuesday','07:30 - 08:10','Mathematics','Simbarashe Dube','Room 5'),
('tt12','sch1','Form 1 A','tuesday','08:10 - 08:50','English','Grace Maposa','Room 5'),
('tt13','sch1','Form 1 A','tuesday','08:50 - 09:30','Geography','Kudakwashe Shumba','Room 8'),
('tt14','sch1','Form 1 A','tuesday','09:30 - 09:50','BREAK',NULL,NULL),
('tt15','sch1','Form 1 A','tuesday','09:50 - 10:30','Shona','Chiedza Zvobgo','Room 5'),
('tt16','sch1','Form 1 A','tuesday','10:30 - 11:10','Science','Blessing Ncube','Lab 1'),
('tt17','sch1','Form 1 A','tuesday','11:10 - 11:50','Commerce','Grace Maposa','Room 5'),
('tt18','sch1','Form 1 A','tuesday','11:50 - 12:30','LUNCH',NULL,NULL),
('tt19','sch1','Form 1 A','tuesday','12:30 - 13:10','Computer Sc.','Nyasha Banda','Comp Lab'),
('tt20','sch1','Form 1 A','tuesday','13:10 - 13:50','Agriculture','Tariro Makoni','Room 10'),
('tt21','sch1','Form 1 A','wednesday','07:30 - 08:10','Shona','Chiedza Zvobgo','Room 5'),
('tt22','sch1','Form 1 A','wednesday','08:10 - 08:50','Science','Blessing Ncube','Lab 1'),
('tt23','sch1','Form 1 A','wednesday','08:50 - 09:30','Mathematics','Simbarashe Dube','Room 5'),
('tt24','sch1','Form 1 A','wednesday','09:30 - 09:50','BREAK',NULL,NULL),
('tt25','sch1','Form 1 A','wednesday','09:50 - 10:30','English','Grace Maposa','Room 5'),
('tt26','sch1','Form 1 A','wednesday','10:30 - 11:10','History','Rumbidzai Gumbo','Room 5'),
('tt27','sch1','Form 1 A','wednesday','11:10 - 11:50','Geography','Kudakwashe Shumba','Room 8'),
('tt28','sch1','Form 1 A','wednesday','11:50 - 12:30','LUNCH',NULL,NULL),
('tt29','sch1','Form 1 A','wednesday','12:30 - 13:10','Commerce','Grace Maposa','Room 5'),
('tt30','sch1','Form 1 A','wednesday','13:10 - 13:50','PE / Sports','Tafadzwa Phiri','Field'),
('tt31','sch1','Form 1 A','thursday','07:30 - 08:10','English','Grace Maposa','Room 5'),
('tt32','sch1','Form 1 A','thursday','08:10 - 08:50','History','Rumbidzai Gumbo','Room 5'),
('tt33','sch1','Form 1 A','thursday','08:50 - 09:30','Science','Blessing Ncube','Lab 1'),
('tt34','sch1','Form 1 A','thursday','09:30 - 09:50','BREAK',NULL,NULL),
('tt35','sch1','Form 1 A','thursday','09:50 - 10:30','Commerce','Grace Maposa','Room 5'),
('tt36','sch1','Form 1 A','thursday','10:30 - 11:10','Mathematics','Simbarashe Dube','Room 5'),
('tt37','sch1','Form 1 A','thursday','11:10 - 11:50','Agriculture','Tariro Makoni','Room 10'),
('tt38','sch1','Form 1 A','thursday','11:50 - 12:30','LUNCH',NULL,NULL),
('tt39','sch1','Form 1 A','thursday','12:30 - 13:10','Shona','Chiedza Zvobgo','Room 5'),
('tt40','sch1','Form 1 A','thursday','13:10 - 13:50','Computer Sc.','Nyasha Banda','Comp Lab'),
('tt41','sch1','Form 1 A','friday','07:30 - 08:10','Mathematics','Simbarashe Dube','Room 5'),
('tt42','sch1','Form 1 A','friday','08:10 - 08:50','English','Grace Maposa','Room 5'),
('tt43','sch1','Form 1 A','friday','08:50 - 09:30','Agriculture','Tariro Makoni','Room 10'),
('tt44','sch1','Form 1 A','friday','09:30 - 09:50','BREAK',NULL,NULL),
('tt45','sch1','Form 1 A','friday','09:50 - 10:30','Geography','Kudakwashe Shumba','Room 8'),
('tt46','sch1','Form 1 A','friday','10:30 - 11:10','Shona','Chiedza Zvobgo','Room 5'),
('tt47','sch1','Form 1 A','friday','11:10 - 11:50','Science','Blessing Ncube','Lab 1'),
('tt48','sch1','Form 1 A','friday','11:50 - 12:30','LUNCH',NULL,NULL),
('tt49','sch1','Form 1 A','friday','12:30 - 13:10','Computer Sc.','Nyasha Banda','Comp Lab'),
('tt50','sch1','Form 1 A','friday','13:10 - 13:50','PE / Sports','Tafadzwa Phiri','Field');

-- ── Events ──
INSERT INTO events (id, school_id, title, event_date, event_type, description) VALUES
('ev1','sch1','ZIMSEC Registration Deadline','2026-03-10','urgent','Form 4 and Form 6 ZIMSEC registration closes'),
('ev2','sch1','Sports Day','2026-03-15','event','Annual inter-house sports competition'),
('ev3','sch1','End of Term 1','2026-03-28','info','Last day of Term 1'),
('ev4','sch1','Report Card Collection','2026-04-02','info','Parents collect report cards from 8am-12pm'),
('ev5','sch1','Staff Meeting','2026-03-07','info','All teaching staff — Main Hall at 2:00 PM');

-- ── Announcements ──
INSERT INTO announcements (id, school_id, title, content, target_audience, priority, published_by, published_at) VALUES
('ann1','sch1','Term 1 Fees Due Date','All term 1 fees must be paid by 28 February 2026. Students with outstanding balances will not receive report cards.','parents','high','u1','2026-01-20T08:00:00Z'),
('ann2','sch1','Sports Day - 15 March 2026','Annual sports day will be held on 15 March. All students must participate. Parents are welcome to attend.','all','normal','u1','2026-02-01T08:00:00Z'),
('ann3','sch1','ZIMSEC Registration Deadline','Form 4 and Form 6 students: ZIMSEC registration closes on 10 March 2026. Please submit your forms to the office immediately.','students','urgent','u1','2026-02-15T08:00:00Z'),
('ann4','sch1','Staff Meeting - Friday','All teaching staff are required to attend the staff meeting this Friday at 2:00 PM in the main hall.','teachers','normal','u1','2026-02-20T08:00:00Z');

-- ── Discipline Records ──
INSERT INTO discipline_records (id, school_id, student_id, date, incident_type, severity, description, action_taken, reported_by, parent_notified, status, student_name) VALUES
('disc1','sch1','stu5','2026-02-10','Late Coming','minor','Arrived 30 minutes late without valid reason','Verbal warning','u4',false,'resolved','Takudzwa Sibanda'),
('disc2','sch1','stu12','2026-02-15','Fighting','major','Physical altercation with another student during break','3-day suspension, parents called','u4',true,'resolved','Nokutenda Nyoni'),
('disc3','sch1','stu8','2026-02-20','Uniform Violation','minor','Not wearing proper school uniform - missing tie','Warning letter to parents','u4',true,'open','Makanaka Chirwa');

-- ── Invoices ──
INSERT INTO invoices (id, invoice_number, school_id, student_id, term_id, total_amount, paid_amount, balance, status, due_date, student_name, grade_name) VALUES
('inv1','INV-2026-00001','sch1','stu1','t1',450,450,0,'paid','2026-02-28','Tatenda Moyo','Form 1'),
('inv2','INV-2026-00002','sch1','stu2','t1',450,250,200,'partial','2026-02-28','Tinashe Ncube','Form 1'),
('inv3','INV-2026-00003','sch1','stu3','t1',450,0,450,'pending','2026-02-28','Nyasha Dube','Form 1'),
('inv4','INV-2026-00004','sch1','stu4','t1',450,150,300,'partial','2026-02-28','Kudzai Ndlovu','Form 1'),
('inv5','INV-2026-00005','sch1','stu5','t1',450,350,100,'partial','2026-02-28','Takudzwa Sibanda','Form 1'),
('inv6','INV-2026-00006','sch1','stu6','t1',450,450,0,'paid','2026-02-28','Rutendo Mpofu','Form 1'),
('inv7','INV-2026-00007','sch1','stu7','t1',450,0,450,'pending','2026-02-28','Fadzai Nkomo','Form 2'),
('inv8','INV-2026-00008','sch1','stu8','t1',450,250,200,'partial','2026-02-28','Makanaka Chirwa','Form 2'),
('inv9','INV-2026-00009','sch1','stu9','t1',450,450,0,'paid','2026-02-28','Ruvimbo Mutasa','Form 2'),
('inv10','INV-2026-00010','sch1','stu10','t1',450,150,300,'partial','2026-02-28','Tapiwanashe Chigumba','Form 2'),
('inv11','INV-2026-00011','sch1','stu11','t1',450,350,100,'partial','2026-02-28','Simbarashe Maposa','Form 2'),
('inv12','INV-2026-00012','sch1','stu12','t1',450,450,0,'paid','2026-02-28','Nokutenda Nyoni','Form 3'),
('inv13','INV-2026-00013','sch1','stu13','t1',450,0,450,'pending','2026-02-28','Tafadzwa Banda','Form 3'),
('inv14','INV-2026-00014','sch1','stu14','t1',450,250,200,'partial','2026-02-28','Munyaradzi Phiri','Form 3'),
('inv15','INV-2026-00015','sch1','stu15','t1',450,450,0,'paid','2026-02-28','Chiedza Chikwanha','Form 3'),
('inv16','INV-2026-00016','sch1','stu16','t1',450,150,300,'partial','2026-02-28','Tinotenda Marufu','Form 3'),
('inv17','INV-2026-00017','sch1','stu17','t1',450,350,100,'partial','2026-02-28','Panashe Gonese','Form 4'),
('inv18','INV-2026-00018','sch1','stu18','t1',450,450,0,'paid','2026-02-28','Anesu Zimuto','Form 4'),
('inv19','INV-2026-00019','sch1','stu19','t1',450,0,450,'pending','2026-02-28','Yeukai Gumbo','Form 4'),
('inv20','INV-2026-00020','sch1','stu20','t1',450,250,200,'partial','2026-02-28','Tadiwanashe Mhaka','Form 4');

-- ── Payments ──
INSERT INTO payments (id, receipt_number, school_id, invoice_id, student_id, amount, payment_method, reference_number, payment_date, received_by, status, student_name) VALUES
('pay1','RCT-2026-00001','sch1','inv1','stu1',450,'ecocash','REF10001','2026-02-01','u3','confirmed','Tatenda Moyo'),
('pay2','RCT-2026-00002','sch1','inv2','stu2',250,'cash',NULL,'2026-02-03','u3','confirmed','Tinashe Ncube'),
('pay3','RCT-2026-00003','sch1','inv4','stu4',150,'beam',NULL,'2026-02-05','u3','confirmed','Kudzai Ndlovu'),
('pay4','RCT-2026-00004','sch1','inv5','stu5',350,'bank_transfer','REF10004','2026-02-06','u3','confirmed','Takudzwa Sibanda'),
('pay5','RCT-2026-00005','sch1','inv6','stu6',450,'ecocash','REF10005','2026-02-07','u3','confirmed','Rutendo Mpofu'),
('pay6','RCT-2026-00006','sch1','inv8','stu8',250,'cash',NULL,'2026-02-10','u3','confirmed','Makanaka Chirwa'),
('pay7','RCT-2026-00007','sch1','inv9','stu9',450,'innbucks','REF10007','2026-02-11','u3','confirmed','Ruvimbo Mutasa'),
('pay8','RCT-2026-00008','sch1','inv10','stu10',150,'beam',NULL,'2026-02-12','u3','confirmed','Tapiwanashe Chigumba'),
('pay9','RCT-2026-00009','sch1','inv11','stu11',350,'ecocash','REF10009','2026-02-14','u3','confirmed','Simbarashe Maposa'),
('pay10','RCT-2026-00010','sch1','inv12','stu12',450,'cash',NULL,'2026-02-15','u3','confirmed','Nokutenda Nyoni'),
('pay11','RCT-2026-00011','sch1','inv14','stu14',250,'bank_transfer','REF10011','2026-02-17','u3','confirmed','Munyaradzi Phiri'),
('pay12','RCT-2026-00012','sch1','inv15','stu15',450,'ecocash','REF10012','2026-02-18','u3','confirmed','Chiedza Chikwanha'),
('pay13','RCT-2026-00013','sch1','inv16','stu16',150,'beam',NULL,'2026-02-19','u3','confirmed','Tinotenda Marufu'),
('pay14','RCT-2026-00014','sch1','inv17','stu17',350,'cash',NULL,'2026-02-20','u3','confirmed','Panashe Gonese'),
('pay15','RCT-2026-00015','sch1','inv18','stu18',450,'innbucks','REF10015','2026-02-21','u3','confirmed','Anesu Zimuto'),
('pay16','RCT-2026-00016','sch1','inv20','stu20',250,'ecocash','REF10016','2026-02-22','u3','confirmed','Tadiwanashe Mhaka');

-- ── Audit Logs ──
INSERT INTO audit_logs (id, user_id, school_id, action, entity_type, entity_id, user_name) VALUES
('al1','u1','sch1','create','student','stu1','Tendai Moyo'),
('al2','u3','sch1','create','payment','pay1','Farai Chirwa'),
('al3','u4','sch1','create','attendance','att-0-stu1','Blessing Ncube'),
('al4','u1','sch1','update','student','stu5','Tendai Moyo'),
('al5','u1','sch1','login','session',NULL,'Tendai Moyo');
