-- Création de la table 'reservations'
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL, -- 'yacht' ou 'catamaran'
  formule VARCHAR(255) NOT NULL, -- 'journee', 'golden', 'privatisation', 'basseseason'
  date_reservation DATE NOT NULL,
  adults INTEGER NOT NULL,
  children INTEGER NOT NULL DEFAULT 0,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telephone VARCHAR(255) NOT NULL,
  message TEXT,
  statut VARCHAR(50) NOT NULL DEFAULT 'en_attente', -- 'en_attente', 'confirmee', 'annulee'
  montant_total DECIMAL(10, 2) NOT NULL,
  montant_acompte DECIMAL(10, 2) NOT NULL,
  acompte_paye BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table 'disponibilites'
CREATE TABLE IF NOT EXISTS disponibilites (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL, -- 'yacht' ou 'catamaran'
  formule VARCHAR(255) NOT NULL, -- 'journee', 'golden', 'privatisation', 'basseseason'
  date DATE NOT NULL,
  places_disponibles INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Contrainte d'unicité pour éviter les doublons
  UNIQUE(type, formule, date)
);

-- Création d'un index pour accélérer les recherches par date
CREATE INDEX idx_disponibilites_date ON disponibilites(date);
CREATE INDEX idx_reservations_date ON reservations(date_reservation);

-- Création d'un trigger pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Appliquer le trigger aux deux tables
CREATE TRIGGER update_reservations_modtime
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_disponibilites_modtime
BEFORE UPDATE ON disponibilites
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Ajout d'une vue pour les réservations de la journée courante
CREATE OR REPLACE VIEW reservations_du_jour AS
SELECT * FROM reservations
WHERE date_reservation = CURRENT_DATE;

-- Ajout d'une vue pour les réservations à venir
CREATE OR REPLACE VIEW reservations_a_venir AS
SELECT * FROM reservations
WHERE date_reservation > CURRENT_DATE
ORDER BY date_reservation ASC;