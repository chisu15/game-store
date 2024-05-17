"use strict";

var db = require('../configs/db');

module.exports.getAll = function _callee() {
  var record, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(db.pool.request().query('select * from Category'));

        case 3:
          record = _context.sent;
          result = record.recordset;
          return _context.abrupt("return", result);

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", _context.t0.message);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports.detail = function _callee2(id) {
  var record, result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(db.pool.request().query("\n            SELECT * FROM Category\n            Where CategoryId = '".concat(id, "'\n        ")));

        case 3:
          record = _context2.sent;
          result = record.recordset;
          return _context2.abrupt("return", result);

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", _context2.t0.message);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports.create = function _callee3(data) {
  var result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(db.pool.request().query("\n            INSERT INTO Category (CategoryId, Title, Description, Slug)\n            VALUES (\n                '".concat(data.CategoryId, "', \n                '").concat(data.Title, "',\n                '").concat(data.Description, "',\n                '").concat(data.Slug, "'\n            )")));

        case 3:
          result = _context3.sent;

          if (!(result.rowsAffected && result.rowsAffected[0] > 0)) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", {
            success: true,
            message: 'Bản ghi đã được chèn thành công.'
          });

        case 8:
          return _context3.abrupt("return", {
            success: false,
            message: 'Không có bản ghi nào được chèn.'
          });

        case 9:
          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          console.error('Lỗi khi chèn bản ghi:', _context3.t0);
          return _context3.abrupt("return", {
            success: false,
            message: 'Lỗi khi chèn bản ghi.'
          });

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

module.exports.update = function _callee4(id, data) {
  var updates, query, record;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          updates = [];
          if (data.Title) updates.push("Title = '".concat(data.Title, "'"));
          if (data.Description) updates.push("Description = '".concat(data.Description, "'"));
          if (data.Slug) updates.push("Slug = '".concat(data.Slug, "'"));

          if (!(updates.length === 0)) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", {
            success: false,
            message: 'Không có trường nào được cập nhật.'
          });

        case 7:
          query = "\n            UPDATE Category\n            SET ".concat(updates.join(', '), "\n            WHERE CategoryId = '").concat(id, "'\n        ");
          _context4.next = 10;
          return regeneratorRuntime.awrap(db.pool.request().query(query));

        case 10:
          record = _context4.sent;

          if (!(record.rowsAffected && record.rowsAffected[0] > 0)) {
            _context4.next = 15;
            break;
          }

          return _context4.abrupt("return", {
            success: true,
            message: 'Bản ghi đã được cập nhật thành công.'
          });

        case 15:
          return _context4.abrupt("return", {
            success: false,
            message: 'Không có bản ghi nào được cập nhật.'
          });

        case 16:
          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](0);
          console.error('Lỗi khi cập nhật bản ghi:', _context4.t0);
          return _context4.abrupt("return", {
            success: false,
            message: 'Lỗi khi cập nhật bản ghi.'
          });

        case 22:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

module.exports["delete"] = function _callee5(id) {
  var result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(db.pool.request().query("\n            DELETE FROM Category \n            WHERE CategoryId = '".concat(id, "'\n        ")));

        case 3:
          result = _context5.sent;
          _context5.next = 9;
          break;

        case 6:
          _context5.prev = 6;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", _context5.t0.message);

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 6]]);
};