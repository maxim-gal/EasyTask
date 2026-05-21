--
-- PostgreSQL database dump
--


-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.1

-- Started on 2026-05-15 12:11:20

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
-- TOC entry 4982 (class 1262 OID 25218)
-- Name: EasyTask; Type: DATABASE; Schema: -; Owner: postgres
--




\connect "EasyTask"

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
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 25294)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25273)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    event_date timestamp with time zone NOT NULL,
    priority character varying(10),
    is_private boolean DEFAULT false,
    completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    CONSTRAINT events_priority_check CHECK (((priority)::text = ANY ((ARRAY['high'::character varying, 'medium'::character varying, 'low'::character varying])::text[])))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25257)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100),
    password_hash text NOT NULL,
    full_name character varying(100),
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4976 (class 0 OID 25294)
-- Dependencies: 222
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.comments VALUES ('0041f793-a86d-423d-a375-59dc65e29f73', 'cc122e0a-5f66-4dd2-b5f7-673ff8a42306', '86f71ff8-00a5-4df7-b4db-6dc3e372dc1b', 'Коммент1', '2026-05-15 11:49:35.999612+03');
INSERT INTO public.comments VALUES ('b4bf5470-916f-471a-a803-83ead7cd8d0c', 'cc122e0a-5f66-4dd2-b5f7-673ff8a42306', 'ed89ee91-05cc-4663-8a6f-97d3c58f414a', 'Коммент2', '2026-05-15 11:49:35.999612+03');


--
-- TOC entry 4975 (class 0 OID 25273)
-- Dependencies: 221
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events VALUES ('48a55e51-e55b-4416-ba77-bd10435967f0', '86f71ff8-00a5-4df7-b4db-6dc3e372dc1b', 'Купить продукты', 'Молоко, хлеб, яйца', '2026-05-16 19:00:00+03', 'medium', true, false, '2026-05-15 11:49:35.999612+03', NULL);
INSERT INTO public.events VALUES ('c4b5614f-e51d-4409-8069-5dd8fc1c0c07', 'ed89ee91-05cc-4663-8a6f-97d3c58f414a', 'Закончить курсовую', 'Глава 3 и приложения', '2026-05-25 23:59:00+03', 'high', false, false, '2026-05-15 11:49:35.999612+03', NULL);
INSERT INTO public.events VALUES ('2b1df7b7-c9da-41f7-bf94-16b5aa6db40d', '7dbcda2f-1da7-4476-ba94-3daf97039d03', 'Позвонить в банк', 'Уточнить по кредиту', '2026-05-15 14:00:00+03', 'high', false, true, '2026-05-15 11:49:35.999612+03', NULL);
INSERT INTO public.events VALUES ('b63944ad-6aa1-45a6-b3f5-3cb2c1a7f29e', '86f71ff8-00a5-4df7-b4db-6dc3e372dc1b', 'Настроить бэкенд для EasyTask', 'Подключить PostgreSQL к серверу', '2026-05-22 15:00:00+03', 'high', false, false, '2026-05-15 12:02:07.963994+03', NULL);
INSERT INTO public.events VALUES ('cc122e0a-5f66-4dd2-b5f7-673ff8a42306', '86f71ff8-00a5-4df7-b4db-6dc3e372dc1b', 'Сдать отчёт по УП.11', 'Подготовить скриншоты и SQL', '2026-05-20 18:00:00+03', 'high', false, true, '2026-05-15 11:49:35.999612+03', '2026-05-15 12:03:46.489641+03');


--
-- TOC entry 4974 (class 0 OID 25257)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES ('86f71ff8-00a5-4df7-b4db-6dc3e372dc1b', 'demo', 'demo@example.com', 'hash_demo123', 'Демо Пользователь', NULL, '2026-05-15 11:49:35.999612+03', NULL);
INSERT INTO public.users VALUES ('ed89ee91-05cc-4663-8a6f-97d3c58f414a', 'alice', 'alice@example.com', 'hash_alice', 'Алиса Иванова', NULL, '2026-05-15 11:49:35.999612+03', NULL);
INSERT INTO public.users VALUES ('7dbcda2f-1da7-4476-ba94-3daf97039d03', 'bob', 'bob@example.com', 'hash_bob', 'Боб Смирнов', NULL, '2026-05-15 11:49:35.999612+03', NULL);


--
-- TOC entry 4821 (class 2606 OID 25306)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4816 (class 2606 OID 25288)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 25272)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4812 (class 2606 OID 25268)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 25270)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4822 (class 1259 OID 25320)
-- Name: idx_comments_event_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comments_event_id ON public.comments USING btree (event_id);


--
-- TOC entry 4823 (class 1259 OID 25321)
-- Name: idx_comments_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comments_user_id ON public.comments USING btree (user_id);


--
-- TOC entry 4817 (class 1259 OID 25318)
-- Name: idx_events_completed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_completed ON public.events USING btree (completed);


--
-- TOC entry 4818 (class 1259 OID 25319)
-- Name: idx_events_event_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_event_date ON public.events USING btree (event_date);


--
-- TOC entry 4819 (class 1259 OID 25317)
-- Name: idx_events_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_user_id ON public.events USING btree (user_id);


--
-- TOC entry 4825 (class 2606 OID 25307)
-- Name: comments comments_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4826 (class 2606 OID 25312)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4824 (class 2606 OID 25289)
-- Name: events events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-05-15 12:11:20

--
-- PostgreSQL database dump complete
--


