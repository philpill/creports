--DROP TABLE IF EXISTS country, article, article_category, article_country, analysis;

CREATE TABLE IF NOT EXISTS country (id SERIAL PRIMARY KEY, name text NOT NULL);

CREATE TABLE IF NOT EXISTS article (id SERIAL PRIMARY KEY, domain text NOT NULL, url text NOT NULL, date date NOT NULL, content text, article text);

CREATE TABLE IF NOT EXISTS category (id SERIAL PRIMARY KEY, code text NOT NULL, topic text NOT NULL);

CREATE TABLE IF NOT EXISTS article_category (article_id SERIAL REFERENCES article(id), category_id SERIAL REFERENCES category(id), PRIMARY KEY (article_id, category_id) );

CREATE TABLE IF NOT EXISTS article_country (article_id SERIAL REFERENCES article(id), country_id SERIAL REFERENCES country(id), PRIMARY KEY (article_id, country_id) );

CREATE TABLE IF NOT EXISTS analysis (id SERIAL PRIMARY KEY, article_id SERIAL REFERENCES article(id), data text);
