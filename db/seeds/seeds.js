const mysql = require("mysql2");
const db = require("../connection");

const seed = ({
  usersData,
  quizData,
  rolesData,
  attemptsData,
  anoptionData,
  aoranData,
  apostrophesData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS attempts;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS quiz;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS roles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS aoran;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS anoption;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS apostrophes;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE quiz (
          quiz_id INT AUTO_INCREMENT PRIMARY KEY,
          quiz_type VARCHAR(255) NOT NULL
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE anoption (
          anoption_id INT AUTO_INCREMENT PRIMARY KEY,
          anoption_text VARCHAR(255) NOT NULL
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE apostrophes (
          apostrophe_id INT AUTO_INCREMENT PRIMARY KEY,
          apostrophe_phrase VARCHAR(255) NOT NULL,
          apostrophe_correct VARCHAR(255) NOT NULL,
          apostrophe_wrong1 VARCHAR(255) NOT NULL,
          apostrophe_wrong2 VARCHAR(255)
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE roles (
          role_id INT AUTO_INCREMENT PRIMARY KEY,
          role_title VARCHAR(255) NOT NULL
      )
    `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          user_id INT AUTO_INCREMENT PRIMARY KEY,
          user_role INT NOT NULL,
          FOREIGN KEY (user_role) REFERENCES roles(role_id),
          user_name VARCHAR(255) NOT NULL,
          user_password VARCHAR(255)
        )
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE attempts (
          attempt_id INT AUTO_INCREMENT PRIMARY KEY,
          attempt_user_id INT NOT NULL,
          FOREIGN KEY (attempt_user_id) REFERENCES users(user_id),
          attempt_quiz_id INT NOT NULL,
          FOREIGN KEY (attempt_quiz_id) REFERENCES quiz(quiz_id),
          attempt_created_at TIMESTAMP DEFAULT NOW(),
          attempt_question_count INT NOT NULL,
          attempt_correct_count INT NOT NULL
        )
      `);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE aoran (
        aoran_id INT AUTO_INCREMENT PRIMARY KEY,
        aoran_answer INT NOT NULL,
        FOREIGN KEY (aoran_answer) REFERENCES anoption(anoption_id),
        aoran_question VARCHAR(255) NOT NULL
      )
      `);
    })
    .then(() => {
      const insertQuizQueryStr = mysql.format(
        `INSERT INTO quiz (quiz_id, quiz_type) VALUES ?`,
        [quizData.map(({ quiz_id, quiz_type }) => [quiz_id, quiz_type])]
      );
      return db.query(insertQuizQueryStr);
    })
    .then(() => {
      const insertApostrophesQueryStr = mysql.format(
        `INSERT INTO apostrophes (apostrophe_id, apostrophe_phrase, apostrophe_correct, apostrophe_wrong1, apostrophe_wrong2) VALUES ?`,
        [
          apostrophesData.map(
            ({
              apostrophe_id,
              apostrophe_phrase,
              apostrophe_correct,
              apostrophe_wrong1,
              apostrophe_wrong2,
            }) => [
              apostrophe_id,
              apostrophe_phrase,
              apostrophe_correct,
              apostrophe_wrong1,
              apostrophe_wrong2,
            ]
          ),
        ]
      );
      return db.query(insertApostrophesQueryStr);
    })
    .then(() => {
      const insertRolesQueryStr = mysql.format(
        `INSERT INTO roles (role_id, role_title) VALUES ?`,
        [rolesData.map(({ role_id, role_title }) => [role_id, role_title])]
      );
      return db.query(insertRolesQueryStr);
    })
    .then(() => {
      const insertUsersQueryStr = mysql.format(
        `INSERT INTO users (user_id, user_name, user_password, user_role) VALUES ?`,
        [
          usersData.map(({ user_id, user_name, user_password, user_role }) => [
            user_id,
            user_name,
            user_password,
            user_role,
          ]),
        ]
      );
      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const insertAttemptsQueryStr = mysql.format(
        `INSERT INTO attempts (attempt_id, attempt_user_id, attempt_quiz_id, attempt_created_at, attempt_question_count, attempt_correct_count) VALUES ?`,
        [
          attemptsData.map(
            ({
              attempt_id,
              attempt_user_id,
              attempt_quiz_id,
              attempt_created_at,
              attempt_question_count,
              attempt_correct_count,
            }) => [
              attempt_id,
              attempt_user_id,
              attempt_quiz_id,
              attempt_created_at,
              attempt_question_count,
              attempt_correct_count,
            ]
          ),
        ]
      );
      return db.query(insertAttemptsQueryStr);
    })
    .then(() => {
      const insertAnOptionQueryStr = mysql.format(
        `INSERT INTO anoption (anoption_id, anoption_text) VALUES ?`,
        [
          anoptionData.map(({ anoption_id, anoption_text }) => [
            anoption_id,
            anoption_text,
          ]),
        ]
      );
      return db.query(insertAnOptionQueryStr);
    })
    .then(() => {
      const insertAorAnQueryStr = mysql.format(
        `INSERT INTO aoran (aoran_id, aoran_answer, aoran_question) VALUES ?`,
        [
          aoranData.map(({ aoran_id, aoran_answer, aoran_question }) => [
            aoran_id,
            aoran_answer,
            aoran_question,
          ]),
        ]
      );
      return db.query(insertAorAnQueryStr);
    });
};

module.exports = seed;
