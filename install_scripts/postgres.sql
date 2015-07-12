--DROP TABLE IF EXISTS location, article, article_category, article_country;

CREATE TABLE IF NOT EXISTS location (id SERIAL PRIMARY KEY, name text NOT NULL);

CREATE TABLE IF NOT EXISTS article (id SERIAL PRIMARY KEY, domain text NOT NULL, url text NOT NULL, date date NOT NULL, content text, article text);

CREATE TABLE IF NOT EXISTS category (id SERIAL PRIMARY KEY, code text NOT NULL, topic text NOT NULL);

CREATE TABLE IF NOT EXISTS article_category (article_id SERIAL REFERENCES article(id), category_id SERIAL REFERENCES category(id), PRIMARY KEY (article_id, category_id) );

CREATE TABLE IF NOT EXISTS article_location (article_id SERIAL REFERENCES article(id), location_id SERIAL REFERENCES location(id), PRIMARY KEY (article_id, location_id) );