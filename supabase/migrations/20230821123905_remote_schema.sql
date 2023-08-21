
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."create_profile_for_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
with org as (
  insert into public.organizations DEFAULT VALUES RETURNING id
)

  insert into public.users (user_id, avatar, name, organization_id)
  values (new.id, new.raw_user_meta_data->>'picture', new.raw_user_meta_data->>'name', (select id from org));
  return new;
end;$$;

ALTER FUNCTION "public"."create_profile_for_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "customer_id" "text",
    "name" "text",
    "reference" "text",
    "subscription_id" "uuid"
);

ALTER TABLE "public"."organizations" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "stripe_id" "text",
    "status" "text",
    "period_end" timestamp without time zone,
    "price_id" "text"
);

ALTER TABLE "public"."subscriptions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "created_at" timestamp with time zone DEFAULT "now"(),
    "avatar" "text",
    "name" character varying,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "role" bigint DEFAULT '0'::bigint NOT NULL
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organization_customer_id_key" UNIQUE ("customer_id");

ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organization_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organization_subscription_id_key" UNIQUE ("subscription_id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscription_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscription_stripe_id_key" UNIQUE ("stripe_id");

ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE SET DEFAULT;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");

CREATE POLICY "Enable delete for users based on user_id" ON "public"."users" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable read access for all users" ON "public"."organizations" FOR SELECT TO "authenticated" USING (("id" IN ( SELECT "users"."organization_id"
   FROM "public"."users"
  WHERE ("users"."user_id" = "auth"."uid"()))));

CREATE POLICY "Enable read access for user with correct user_id" ON "public"."users" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Enable read for user" ON "public"."subscriptions" FOR SELECT TO "authenticated" USING (("id" IN ( SELECT "organizations"."subscription_id"
   FROM "public"."organizations"
  WHERE ("organizations"."id" IN ( SELECT "users"."organization_id"
           FROM "public"."users"
          WHERE ("users"."user_id" = "auth"."uid"()))))));

CREATE POLICY "Enable update for users based on user_id" ON "public"."users" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."create_profile_for_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_profile_for_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_profile_for_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations" TO "service_role";

GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
