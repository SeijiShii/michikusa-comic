CREATE TABLE users (id TEXT PRIMARY KEY, is_guest BOOLEAN NOT NULL DEFAULT true, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE photos (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, r2_key TEXT NOT NULL, taken_at TIMESTAMPTZ, lat DOUBLE PRECISION, lng DOUBLE PRECISION, area TEXT, caption TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE comics (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, title TEXT, status TEXT NOT NULL DEFAULT 'draft', area TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE panels (id TEXT PRIMARY KEY, comic_id TEXT NOT NULL REFERENCES comics(id) ON DELETE CASCADE, "order" INTEGER NOT NULL, image_r2_key TEXT, speech TEXT, bubble_layout JSONB, style_prompt TEXT);
CREATE UNIQUE INDEX panels_comic_order ON panels(comic_id, "order");
CREATE TABLE payments (id TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, kind TEXT NOT NULL, status TEXT NOT NULL, amount_jpy INTEGER NOT NULL, comic_id TEXT, stripe_ref TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE UNIQUE INDEX payments_stripe_ref ON payments(stripe_ref);
