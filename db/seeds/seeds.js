const format = require("pg-format");
const db = require("../connection");

const seed = ({
  fixturesData,
  responsesData,
  rolesData,
  teamsData,
  usersData,
  venuesData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS responses;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS fixtures;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS roles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS teams;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS venues;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE venues (
          venue_id SERIAL PRIMARY KEY,
          venue_name VARCHAR NOT NULL,
          venue_address_1 VARCHAR NOT NULL,
          venue_address_2 VARCHAR NOT NULL,
          venue_postcode VARCHAR,
          venue_phone VARCHAR,
          venue_latitude FLOAT,
          venue_longitude FLOAT
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE teams (
          team_id SERIAL PRIMARY KEY,
          team_name VARCHAR NOT NULL,
          venue_id INT REFERENCES venues(venue_id) NOT NULL,
          team_start_time VARCHAR NOT NULL,
          team_division VARCHAR NOT NULL
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          user_id SERIAL PRIMARY KEY,
          team_id INT REFERENCES teams(team_id) NOT NULL,
          user_name VARCHAR NOT NULL,
          user_address_1 VARCHAR,
          user_address_2 VARCHAR,
          user_postcode VARCHAR,
          user_dob DATE,
          user_phone VARCHAR,
          user_email VARCHAR NOT NULL,
          user_password VARCHAR NOT NULL
        )
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE roles (
          user_id INT PRIMARY KEY REFERENCES users(user_id) NOT NULL,
          player_bool BOOL,
          sec_bool BOOL,
          umpire_bool BOOL,
          organiser_bool BOOL
      )
    `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE fixtures (
          fixture_id SERIAL PRIMARY KEY,
          match_status VARCHAR NOT NULL,
          team1_id INT REFERENCES teams(team_id) NOT NULL,
          team2_id INT REFERENCES teams(team_id) NOT NULL,
          team1_score INT NOT NULL,
          team2_score INT NOT NULL,
          match_venue INT REFERENCES venues(venue_id) NOT NULL,
          match_date DATE NOT NULL
        )
      `);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE responses (
        response_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) NOT NULL,
        fixture_id INT REFERENCES fixtures(fixture_id) NOT NULL,
        response VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP
      )
      `);
    })
    .then(() => {
      const insertVenuesQueryStr = format(
        `INSERT INTO venues (venue_name, venue_address_1, venue_address_2, venue_postcode, venue_phone, venue_latitude, venue_longitude) VALUES %L`,
        venuesData.map(
          ({
            venue_name,
            venue_address_1,
            venue_address_2,
            venue_postcode,
            venue_phone,
            venue_latitude,
            venue_longitude,
          }) => [
            venue_name,
            venue_address_1,
            venue_address_2,
            venue_postcode,
            venue_phone,
            venue_latitude,
            venue_longitude,
          ]
        )
      );
      return db.query(insertVenuesQueryStr);
    })
    .then(() => {
      const insertTeamsQueryStr = format(
        `INSERT INTO teams (team_name, venue_id, team_start_time, team_division) VALUES %L`,
        teamsData.map(
          ({ team_name, venue_id, team_start_time, team_division }) => [
            team_name,
            venue_id,
            team_start_time,
            team_division,
          ]
        )
      );
      return db.query(insertTeamsQueryStr);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        `INSERT INTO users (team_id, user_name, user_address_1, user_address_2, user_postcode, user_dob, user_phone, user_email, user_password) VALUES %L`,
        usersData.map(
          ({
            team_id,
            user_name,
            user_address_1,
            user_address_2,
            user_postcode,
            user_dob,
            user_phone,
            user_email,
            user_password,
          }) => [
            team_id,
            user_name,
            user_address_1,
            user_address_2,
            user_postcode,
            user_dob,
            user_phone,
            user_email,
            user_password,
          ]
        )
      );
      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const insertRolesQueryStr = format(
        `INSERT INTO roles (user_id, player_bool, sec_bool, umpire_bool, organiser_bool) VALUES %L`,
        rolesData.map(
          ({ user_id, player_bool, sec_bool, umpire_bool, organiser_bool }) => [
            user_id,
            player_bool,
            sec_bool,
            umpire_bool,
            organiser_bool,
          ]
        )
      );
      return db.query(insertRolesQueryStr);
    })
    .then(() => {
      const insertFixturesQueryStr = format(
        `INSERT INTO fixtures (match_status, team1_id, team2_id, team1_score, team2_score, match_venue, match_date) VALUES %L`,
        fixturesData.map(
          ({
            match_status,
            team1_id,
            team2_id,
            team1_score,
            team2_score,
            match_venue,
            match_date,
          }) => [
            match_status,
            team1_id,
            team2_id,
            team1_score,
            team2_score,
            match_venue,
            match_date,
          ]
        )
      );
      return db.query(insertFixturesQueryStr);
    })
    .then(() => {
      const insertResponsesQueryStr = format(
        `INSERT INTO responses (user_id, fixture_id, response) VALUES %L`,
        responsesData.map(({ user_id, fixture_id, response }) => [
          user_id,
          fixture_id,
          response,
        ])
      );
      return db.query(insertResponsesQueryStr);
    });
};

module.exports = seed;
