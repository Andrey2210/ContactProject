DROP TABLE Contact;
DROP TYPE contactstatus;

CREATE TYPE contactstatus AS ENUM
    ('Active', 'Pending', 'Cancelled');

CREATE TABLE Contact
(
    id SERIAL PRIMARY KEY,
    first_name character varying(40),
    last_name character varying(80),
    status contactstatus
);

CREATE FUNCTION check_last_name() RETURNS trigger AS $check_last_name$
    BEGIN
        IF (TG_OP = 'UPDATE') THEN
            -- Check that lastName not empty
            IF NEW.last_name IS NULL THEN
                NEW.status := 'Pending';
            ELSE NEW.status := 'Active';
            END IF;
        END IF;
        RETURN NEW;
    END;
$check_last_name$ LANGUAGE plpgsql;

CREATE TRIGGER check_last_name BEFORE UPDATE ON Contact
    FOR EACH ROW EXECUTE PROCEDURE check_last_name();

-- INSERT INTO Contact (first_name, last_name, status) VALUES ('Ivan1', 'Ivanov1', 'Active');
-- INSERT INTO Contact (first_name, last_name, status) VALUES ('Ivan2', 'Ivanov2', 'Active');
-- INSERT INTO Contact (first_name, last_name, status) VALUES ('Ivan3', 'Ivanov3', 'Active');
-- INSERT INTO Contact (first_name, last_name, status) VALUES ('Ivan4', 'Ivanov4', 'Active');
-- INSERT INTO Contact (first_name, last_name, status) VALUES ('Ivan5', 'Ivanov5', 'Active');
-- INSERT INTO Contact (first_name, last_name, status) VALUES ('Ivan6', 'Ivanov6', 'Active');
-- INSERT INTO Contact (first_name, last_name, status) VALUES ('Ivan7', 'Ivanov7', 'Active');
-- INSERT INTO Contact (first_name, last_name, status) VALUES ('Ivan8', 'Ivanov8', 'Active');
