module.exports = {
  appenders: {
    console: {type: "console"},
    access: {type: "dateFile", filename: "./logs/access/access.log", pattern: ".yyyy-MM-dd",keepFileExt:true},
    system: {type: "dateFile", filename: "./logs/system/system.log", pattern: ".yyyy-MM-dd",keepFileExt:true},
    database: {type: "dateFile", filename: "./logs/database/database.log", pattern: ".yyyy-MM-dd",keepFileExt:true},
  },
  categories: {
    default: {appenders: ["console"], level: "trace"},
    access: {appenders: ["console","access"], level: "info"},
    system: {appenders: ["console","system"], level: "info"},
    database: {appenders: ["console","database"], level: "info"}
  },
  replaceConsole: true
};
