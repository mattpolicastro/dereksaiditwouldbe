/*eslint linebreak-style: ["off", "unix"]*/
'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('weather', function(table) {
      table.string('DATE', 8);
      table.integer('TMAX');
      table.integer('TMIN');
      table.integer('TMAX_PRED');
      table.integer('TMIN_PRED');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('weather')
  ]);
};
