--
-- PostgreSQL database dump
--

\restrict mMZH9ilkZBaFRla3V5nIF8gHSHkim5iZOrtXMxh4iQ2cVY6Sonxht7iMq7kX4sy

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-22 13:04:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 58901)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5184 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 58706)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 58705)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 58880)
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    id bigint NOT NULL,
    enrollment_id bigint NOT NULL,
    certificate_code character varying(100) NOT NULL,
    issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    file_path text
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 58879)
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.certificates ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.certificates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 235 (class 1259 OID 58849)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    content_id bigint NOT NULL,
    user_id bigint NOT NULL,
    parent_comment_id bigint,
    comment text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 58848)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.comments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 58826)
-- Name: content_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.content_progress (
    id bigint NOT NULL,
    enrollment_id bigint NOT NULL,
    content_id bigint NOT NULL,
    completed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.content_progress OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 58825)
-- Name: content_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.content_progress ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.content_progress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 229 (class 1259 OID 58778)
-- Name: contents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contents (
    id bigint NOT NULL,
    course_id bigint NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT contents_order_index_check CHECK ((order_index > 0))
);


ALTER TABLE public.contents OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 58777)
-- Name: contents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.contents ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.contents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 58749)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id bigint NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    category_id bigint NOT NULL,
    teacher_id bigint NOT NULL,
    level character varying(20) DEFAULT 'Beginner'::character varying,
    start_date date,
    end_date date,
    cover_image text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT courses_check CHECK (((end_date IS NULL) OR (start_date IS NULL) OR (end_date >= start_date))),
    CONSTRAINT courses_level_check CHECK (((level)::text = ANY ((ARRAY['Beginner'::character varying, 'Intermediate'::character varying, 'Advanced'::character varying])::text[])))
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 58748)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.courses ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.courses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 231 (class 1259 OID 58803)
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id bigint NOT NULL,
    student_id bigint NOT NULL,
    course_id bigint NOT NULL,
    enrolled_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at timestamp without time zone
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 58802)
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.enrollments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.enrollments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 58722)
-- Name: teacher_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher_applications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved_at timestamp without time zone,
    reviewed_by bigint,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT teacher_applications_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.teacher_applications OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 58721)
-- Name: teacher_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.teacher_applications ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.teacher_applications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 58684)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'student'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'student'::character varying, 'teacher'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 58683)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5164 (class 0 OID 58706)
-- Dependencies: 223
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description, created_at, updated_at) FROM stdin;
1	English	Kursus bahasa Inggris	2026-11-19 12:27:16.476899	2026-11-19 12:27:16.476899
2	Japanese	Kursus bahasa Jepang	2026-11-19 12:27:16.476899	2026-11-19 12:27:16.476899
3	Korean	Kursus bahasa Korea	2026-11-19 12:27:16.476899	2026-11-19 12:27:16.476899
4	French	Kursus bahasa Prancis	2026-11-19 12:27:16.476899	2026-11-19 12:27:16.476899
5	Spanish	Kursus bahasa Spanyol	2026-11-19 12:27:16.476899	2026-11-19 12:27:16.476899
6	European Portuguese	Kursus bahasa Portugis Eropa dari Portugal	2026-11-19 12:27:16.476899	2026-11-19 12:27:16.476899
13	Mandarin	Kursus bahasa Mandarin	2026-11-21 19:08:49.149625	2026-11-21 19:10:15.742587
\.


--
-- TOC entry 5178 (class 0 OID 58880)
-- Dependencies: 237
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (id, enrollment_id, certificate_code, issued_at, file_path) FROM stdin;
\.


--
-- TOC entry 5176 (class 0 OID 58849)
-- Dependencies: 235
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, content_id, user_id, parent_comment_id, comment, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5174 (class 0 OID 58826)
-- Dependencies: 233
-- Data for Name: content_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.content_progress (id, enrollment_id, content_id, completed_at) FROM stdin;
1	1	9	2026-11-19 12:38:51.347842
2	1	8	2026-11-22 00:51:13.307791
3	1	7	2026-11-22 00:52:35.637049
\.


--
-- TOC entry 5170 (class 0 OID 58778)
-- Dependencies: 229
-- Data for Name: contents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contents (id, course_id, title, content, order_index, created_at, updated_at) FROM stdin;
1	1	Simple Past Tense	Learn how to use the simple past tense to describe activities that happened in the past.	3	2026-11-19 12:36:29.230637	2026-11-19 12:36:29.230637
2	1	Simple Present Tense	Learn how to use the simple present tense to describe habits and daily activities.	2	2026-11-19 12:36:29.230637	2026-11-19 12:36:29.230637
3	1	Introduction to Pronouns	Learn subject pronouns such as I, You, We, They, He, She, and It.	1	2026-11-19 12:36:29.230637	2026-11-19 12:36:29.230637
4	2	Shopping Conversation	Learn basic expressions used when buying items in a shop.	3	2026-11-19 12:36:29.230637	2026-11-19 12:36:29.230637
5	2	Asking for Directions	Learn how to ask where places are and understand simple directions.	2	2026-11-19 12:36:29.230637	2026-11-19 12:36:29.230637
6	2	At School	Learn simple conversations between students and teachers at school.	1	2026-11-19 12:36:29.230637	2026-11-19 12:36:29.230637
7	3	Numbers and Time	Learn English numbers from one to twenty and how to ask and tell the time.	3	2026-11-19 12:36:29.230637	2026-11-19 12:36:29.230637
8	3	Introducing Yourself	Learn how to introduce yourself. Examples: My name is John. I am a student. I am from Indonesia.	2	2026-11-19 12:36:29.230637	2026-11-19 12:36:29.230637
9	3	Greetings and Introductions	Learn basic greetings such as Hello, Good morning, Good afternoon, and Good evening. Learn how to introduce yourself by saying your name.	1	2026-11-19 12:36:29.230637	2026-11-19 12:36:29.230637
\.


--
-- TOC entry 5168 (class 0 OID 58749)
-- Dependencies: 227
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, name, description, category_id, teacher_id, level, start_date, end_date, cover_image, created_at, updated_at) FROM stdin;
1	English Grammar Basics	Mempelajari dasar tata bahasa Inggris dengan penjelasan dan contoh sederhana.	1	2	Beginner	\N	\N	\N	2026-11-19 12:33:01.949774	2026-11-19 12:33:01.949774
2	Daily English Conversation	Belajar percakapan bahasa Inggris yang digunakan dalam kehidupan sehari-hari.	1	2	Beginner	\N	\N	\N	2026-11-19 12:33:01.949774	2026-11-19 12:33:01.949774
3	English for Beginners	Belajar dasar bahasa Inggris dari nol, mulai dari salam, kosakata, dan percakapan sederhana.	1	2	Beginner	\N	\N	\N	2026-11-19 12:33:01.949774	2026-11-19 12:33:01.949774
4	English Grammar Basics	Mempelajari dasar tata bahasa Inggris dengan penjelasan dan contoh sederhana.	1	2	Beginner	\N	\N	\N	2026-11-20 22:17:16.56221	2026-11-20 22:17:16.56221
5	Daily English Conversation	Belajar percakapan bahasa Inggris yang digunakan dalam kehidupan sehari-hari.	1	2	Beginner	\N	\N	\N	2026-11-20 22:17:16.56221	2026-11-20 22:17:16.56221
6	English for Beginners	Belajar dasar bahasa Inggris dari nol, mulai dari salam, kosakata, dan percakapan sederhana.	1	2	Beginner	\N	\N	\N	2026-11-20 22:17:16.56221	2026-11-20 22:17:16.56221
8	Mandarin for Begginers	Mandarin for Begginers	13	11	Beginner	\N	\N	\N	2026-11-21 22:45:33.886595	2026-11-21 23:09:10.750591
9	Japanese for Begginers	Japanese for Begginers	2	13	Beginner	\N	\N	\N	2026-11-21 23:14:40.305993	2026-11-21 23:14:40.305993
10	Korean for Intermediate	Korean for Intermediate	3	12	Intermediate	\N	\N	\N	2026-11-21 23:38:38.115401	2026-11-21 23:38:38.115401
\.


--
-- TOC entry 5172 (class 0 OID 58803)
-- Dependencies: 231
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, student_id, course_id, enrolled_at, completed_at) FROM stdin;
2	7	6	2026-11-21 21:24:31.2234	\N
3	15	8	2026-11-21 23:22:27.291903	\N
1	3	3	2026-11-19 12:38:27.896185	2026-11-22 01:07:59.476601
\.


--
-- TOC entry 5166 (class 0 OID 58722)
-- Dependencies: 225
-- Data for Name: teacher_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_applications (id, user_id, status, requested_at, approved_at, reviewed_by, updated_at) FROM stdin;
1	2	approved	2026-11-19 12:30:37.032711	2026-11-19 12:30:37.032711	1	2026-11-19 12:30:37.032711
\.


--
-- TOC entry 5162 (class 0 OID 58684)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, role, created_at, updated_at) FROM stdin;
7	nana	nana@gmail.com	$2b$10$lAVAGQ1qzielUcEpq9k9Nu.6xedxvd4Q/Kw1.HJ9/VQrlZ5WnOpEu	student	2026-11-21 01:25:52.456682	2026-11-21 01:25:52.456682
8	test_api_01	test_api_01@example.com	$2b$10$8QAcnjG1Pkm5nN9xeJRRAueXgOWK7Cm4Ap.exm3yZE/rmppE4MPFa	student	2026-11-21 01:32:21.962569	2026-11-21 01:32:21.962569
1	admin_linguaspace	admin@linguaspace.test	$2b$10$euqgHnUfqlA6FBSVRAfI9.pLI7kUFNeJTXmUVD/U10yqIViwTgVSy	admin	2026-11-19 12:29:42.114899	2026-11-19 12:29:42.114899
2	teacher_english	teacher@linguaspace.test	$2b$10$dzsibQ5xr3bkOsi5EjnE0OmiX0AaCrjgmIvUK7kQwbzXGo9i.RsX6	teacher	2026-11-19 12:29:42.114899	2026-11-19 12:29:42.114899
10	caca	caca@gmail.com	$2b$10$hLEel8uqs.cbOwpyxulzled/k3HxTtB7eNKor.puqunH9Q3Z9RJse	student	2026-11-21 16:47:35.974372	2026-11-21 16:47:35.974372
12	seonsaengnim	seonsaengnim_korea@linguaspace.com	$2b$10$8Wy5yFaYwoXiAm7aiaHuF.sB95b4/MuPF3aGsawLpTcjafgLGa.Tm	teacher	2026-11-21 22:00:15.356885	2026-11-21 22:00:15.356885
14	professora	professora_portugis@linguaspace.com	$2b$10$hKPOV8/6dFSTnK3NT9OMVO71A4bMFWVn4rCfm3qnE69pQYDIxmFw.	teacher	2026-11-21 22:07:17.37394	2026-11-21 22:07:17.37394
11	laoshi	laoshi_mandarin@linguaspace.com	$2b$10$HVyAXl8FJN4YMcsnc5fmcO817cpPJ/zLjFZ6Ig1Dhs1l2u3q9dklO	teacher	2026-11-21 21:58:05.485261	2026-11-21 22:35:33.980532
13	sensei	sensei_japan@linguaspace.com	$2b$10$vAI3KxN9nWOE0g8jBN0el./oV/BL2c0neai/XvDkniKkpLEA/oHxu	teacher	2026-11-21 22:01:10.704007	2026-11-21 22:35:58.932646
15	mateo	mateo@gmail.com	$2b$10$Hn.ZgYF0RkG.nWYZv6DlIOX/Ym.BltZQVOXaXcfoNz.Oz1QQ3zAF.	student	2026-11-21 23:20:54.070697	2026-11-21 23:20:54.070697
3	student_demo	student@linguaspace.test	$2b$10$QL/PiLTVJuHhdaUImSpxJOVOT7ZaWSdjEv.N7behJbC9UmHeTAKvy	student	2026-11-19 12:29:42.114899	2026-11-22 00:11:31.364457
\.


--
-- TOC entry 5185 (class 0 OID 0)
-- Dependencies: 222
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 14, true);


--
-- TOC entry 5186 (class 0 OID 0)
-- Dependencies: 236
-- Name: certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificates_id_seq', 1, false);


--
-- TOC entry 5187 (class 0 OID 0)
-- Dependencies: 234
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- TOC entry 5188 (class 0 OID 0)
-- Dependencies: 232
-- Name: content_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.content_progress_id_seq', 3, true);


--
-- TOC entry 5189 (class 0 OID 0)
-- Dependencies: 228
-- Name: contents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contents_id_seq', 11, true);


--
-- TOC entry 5190 (class 0 OID 0)
-- Dependencies: 226
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 10, true);


--
-- TOC entry 5191 (class 0 OID 0)
-- Dependencies: 230
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 3, true);


--
-- TOC entry 5192 (class 0 OID 0)
-- Dependencies: 224
-- Name: teacher_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_applications_id_seq', 2, true);


--
-- TOC entry 5193 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 15, true);


--
-- TOC entry 4964 (class 2606 OID 58720)
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- TOC entry 4966 (class 2606 OID 58718)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 58895)
-- Name: certificates certificates_certificate_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_certificate_code_key UNIQUE (certificate_code);


--
-- TOC entry 4998 (class 2606 OID 58893)
-- Name: certificates certificates_enrollment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_enrollment_id_key UNIQUE (enrollment_id);


--
-- TOC entry 5000 (class 2606 OID 58891)
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 58863)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 58837)
-- Name: content_progress content_progress_enrollment_id_content_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_progress
    ADD CONSTRAINT content_progress_enrollment_id_content_id_key UNIQUE (enrollment_id, content_id);


--
-- TOC entry 4990 (class 2606 OID 58835)
-- Name: content_progress content_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_progress
    ADD CONSTRAINT content_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 4978 (class 2606 OID 58796)
-- Name: contents contents_course_id_order_index_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_course_id_order_index_key UNIQUE (course_id, order_index);


--
-- TOC entry 4980 (class 2606 OID 58794)
-- Name: contents contents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (id);


--
-- TOC entry 4974 (class 2606 OID 58766)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 58812)
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 58814)
-- Name: enrollments enrollments_student_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_student_id_course_id_key UNIQUE (student_id, course_id);


--
-- TOC entry 4968 (class 2606 OID 58735)
-- Name: teacher_applications teacher_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_applications
    ADD CONSTRAINT teacher_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 4971 (class 2606 OID 58737)
-- Name: teacher_applications teacher_applications_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_applications
    ADD CONSTRAINT teacher_applications_user_id_key UNIQUE (user_id);


--
-- TOC entry 4958 (class 2606 OID 58703)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4960 (class 2606 OID 58699)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4962 (class 2606 OID 58701)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4991 (class 1259 OID 58944)
-- Name: comments_content_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comments_content_id_index ON public.comments USING btree (content_id);


--
-- TOC entry 4994 (class 1259 OID 58945)
-- Name: comments_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comments_user_id_index ON public.comments USING btree (user_id);


--
-- TOC entry 4986 (class 1259 OID 58943)
-- Name: content_progress_content_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX content_progress_content_id_index ON public.content_progress USING btree (content_id);


--
-- TOC entry 4976 (class 1259 OID 58941)
-- Name: contents_course_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contents_course_id_index ON public.contents USING btree (course_id);


--
-- TOC entry 4972 (class 1259 OID 58939)
-- Name: courses_category_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX courses_category_id_index ON public.courses USING btree (category_id);


--
-- TOC entry 4975 (class 1259 OID 58940)
-- Name: courses_teacher_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX courses_teacher_id_index ON public.courses USING btree (teacher_id);


--
-- TOC entry 4981 (class 1259 OID 58942)
-- Name: enrollments_course_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX enrollments_course_id_index ON public.enrollments USING btree (course_id);


--
-- TOC entry 4969 (class 1259 OID 58946)
-- Name: teacher_applications_status_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX teacher_applications_status_index ON public.teacher_applications USING btree (status);


--
-- TOC entry 5013 (class 2606 OID 58896)
-- Name: certificates certificates_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id);


--
-- TOC entry 5010 (class 2606 OID 58864)
-- Name: comments comments_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.contents(id);


--
-- TOC entry 5011 (class 2606 OID 58874)
-- Name: comments comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.comments(id);


--
-- TOC entry 5012 (class 2606 OID 58869)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5008 (class 2606 OID 58843)
-- Name: content_progress content_progress_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_progress
    ADD CONSTRAINT content_progress_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.contents(id);


--
-- TOC entry 5009 (class 2606 OID 58838)
-- Name: content_progress content_progress_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.content_progress
    ADD CONSTRAINT content_progress_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id);


--
-- TOC entry 5005 (class 2606 OID 58797)
-- Name: contents contents_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 5003 (class 2606 OID 58767)
-- Name: courses courses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 5004 (class 2606 OID 58772)
-- Name: courses courses_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id);


--
-- TOC entry 5006 (class 2606 OID 58820)
-- Name: enrollments enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 5007 (class 2606 OID 58815)
-- Name: enrollments enrollments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id);


--
-- TOC entry 5001 (class 2606 OID 58743)
-- Name: teacher_applications teacher_applications_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_applications
    ADD CONSTRAINT teacher_applications_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- TOC entry 5002 (class 2606 OID 58738)
-- Name: teacher_applications teacher_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_applications
    ADD CONSTRAINT teacher_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-11-22 13:04:33

--
-- PostgreSQL database dump complete
--

\unrestrict mMZH9ilkZBaFRla3V5nIF8gHSHkim5iZOrtXMxh4iQ2cVY6Sonxht7iMq7kX4sy

