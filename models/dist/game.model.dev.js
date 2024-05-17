"use strict";

var db = require('../configs/db');

var mssql = require("mssql");

module.exports.getAll = function _callee() {
  var record, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(db.pool.request().query('select * from Game'));

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
          return regeneratorRuntime.awrap(db.pool.request().query("\n            SELECT * FROM Game\n            Where GameId = '".concat(id, "'\n        ")));

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
  var transaction, request, gameResult, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, categoryId, categoryRequest;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          transaction = new mssql.Transaction(db.pool);
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(transaction.begin());

        case 4:
          request = new mssql.Request(transaction); // Thêm các kiểu dữ liệu vào request

          request.input('GameId', mssql.NVarChar, data.GameId);
          request.input('Title', mssql.NVarChar, data.Title);
          request.input('AdminId', mssql.NVarChar, data.AdminId);
          request.input('Price', mssql.Decimal, data.Price);
          request.input('DiscountId', mssql.NVarChar, data.DiscountId);
          request.input('Description', mssql.NVarChar, data.Description);
          request.input('Images', mssql.Image, data.Images); // Chuyển đổi chuỗi Base64 thành Buffer

          request.input('DownloadLink', mssql.NVarChar, data.DownloadLink);
          request.input('Slug', mssql.NVarChar, data.Slug); // Chèn vào bảng Game

          _context3.next = 16;
          return regeneratorRuntime.awrap(request.query("\n            INSERT INTO Game (GameId, Title, AdminId, Price, DiscountId, Description, Images, DownloadLink, Slug)\n            VALUES (@GameId, @Title, @AdminId, @Price, @DiscountId, @Description, @Images, @DownloadLink, @Slug)\n        "));

        case 16:
          gameResult = _context3.sent;

          if (!(gameResult.rowsAffected && gameResult.rowsAffected[0] > 0)) {
            _context3.next = 52;
            break;
          }

          // Chèn vào bảng nối GameCategory
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 21;
          _iterator = data.CategoryId[Symbol.iterator]();

        case 23:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 33;
            break;
          }

          categoryId = _step.value;
          categoryRequest = new mssql.Request(transaction);
          categoryRequest.input('GameId', mssql.NVarChar, data.GameId);
          categoryRequest.input('CategoryId', mssql.NVarChar, categoryId);
          _context3.next = 30;
          return regeneratorRuntime.awrap(categoryRequest.query("\n                    INSERT INTO GameCategory (GameId, CategoryId)\n                    VALUES (@GameId, @CategoryId)\n                "));

        case 30:
          _iteratorNormalCompletion = true;
          _context3.next = 23;
          break;

        case 33:
          _context3.next = 39;
          break;

        case 35:
          _context3.prev = 35;
          _context3.t0 = _context3["catch"](21);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 39:
          _context3.prev = 39;
          _context3.prev = 40;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 42:
          _context3.prev = 42;

          if (!_didIteratorError) {
            _context3.next = 45;
            break;
          }

          throw _iteratorError;

        case 45:
          return _context3.finish(42);

        case 46:
          return _context3.finish(39);

        case 47:
          _context3.next = 49;
          return regeneratorRuntime.awrap(transaction.commit());

        case 49:
          return _context3.abrupt("return", {
            success: true,
            message: 'Bản ghi đã được chèn thành công.'
          });

        case 52:
          _context3.next = 54;
          return regeneratorRuntime.awrap(transaction.rollback());

        case 54:
          return _context3.abrupt("return", {
            success: false,
            message: 'Không có bản ghi nào được chèn.'
          });

        case 55:
          _context3.next = 63;
          break;

        case 57:
          _context3.prev = 57;
          _context3.t1 = _context3["catch"](1);
          _context3.next = 61;
          return regeneratorRuntime.awrap(transaction.rollback());

        case 61:
          console.error('Lỗi khi chèn bản ghi:', _context3.t1);
          return _context3.abrupt("return", {
            success: false,
            message: 'Lỗi khi chèn bản ghi.'
          });

        case 63:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 57], [21, 35, 39, 47], [40,, 42, 46]]);
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
          if (data.AdminId) updates.push("AdminId = '".concat(data.AdminId, "'"));
          if (data.CategoryId) updates.push("CategoryId = '".concat(data.CategoryId, "'"));
          if (data.Price) updates.push("Price = ".concat(data.Price));
          if (data.DiscountId) updates.push("DiscountId = ".concat(data.DiscountId));
          if (data.Description) updates.push("Description = '".concat(data.Description, "'"));
          if (data.Images) updates.push("Images = '".concat(data.Images, "'"));
          if (data.DownloadLink) updates.push("DownloadLink = '".concat(data.DownloadLink, "'"));
          if (data.Slug) updates.push("Slug = '".concat(data.Slug, "'"));

          if (!(updates.length === 0)) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", {
            success: false,
            message: 'Không có trường nào được cập nhật.'
          });

        case 13:
          query = "\n            UPDATE Game\n            SET ".concat(updates.join(', '), "\n            WHERE GameId = '").concat(id, "'\n        ");
          _context4.next = 16;
          return regeneratorRuntime.awrap(db.pool.request().query(query));

        case 16:
          record = _context4.sent;

          if (!(record.rowsAffected && record.rowsAffected[0] > 0)) {
            _context4.next = 21;
            break;
          }

          return _context4.abrupt("return", {
            success: true,
            message: 'Bản ghi đã được cập nhật thành công.'
          });

        case 21:
          return _context4.abrupt("return", {
            success: false,
            message: 'Không có bản ghi nào được cập nhật.'
          });

        case 22:
          _context4.next = 28;
          break;

        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](0);
          console.error('Lỗi khi cập nhật bản ghi:', _context4.t0);
          return _context4.abrupt("return", {
            success: false,
            message: 'Lỗi khi cập nhật bản ghi.'
          });

        case 28:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

module.exports["delete"] = function _callee5(id) {
  var result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(db.pool.request().query("\n            DELETE FROM Game \n            WHERE GameId = '".concat(id, "'\n        ")));

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