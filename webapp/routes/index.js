var express = require("express");
var router = express.Router();

var Item = require("../models/item");
var Subject = require("../models/subject");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    errMsg: null,
    results: null,
    keyWord: null,
    resultCount: 0,
    totalPages: 0,
    offset: 0,
    currentPage: 0,
  });
});

/* GET search page. */
router.get("/search", function (req, res, next) {
  var query = req.query.txtTitle || "";
  var offset = req.query.startIndex || 0;
  var totalMatches = 0;

  query = query.trim(); 
  if (query == "") {
    res.render("index", {
      errMsg: null,
      results: null,
      keyWord: query,
      resultCount: 0,
      totalPages: 0,
      offset: 0,
      currentPage: 0,
    });
  } else if (/[^a-zA-Z0-9'\s]+/.test(query)) {
    res.render("index", {
      errMsg: "Error: Please supply valid query.",
      results: null,
      keyWord: query,
      resultCount: 0,
      totalPages: 0,
      offset: 0,
      currentPage: 0,
    });
  } else {
    Item.countMatches(query, function (err, results) {
      if (err) {
        console.error(err);
      } else {
        totalMatches = results["COUNT(*)"];
      }
    });

    Item.search(query, offset, function (err, results) {
      if (err) {
        console.error(err);
        res.render("index", {
          errMsg: "Error: Please try again.",
          results: null,
          keyWord: query,
          resultCount: 0,
          totalPages: 0,
          startIndex: 0,
          currentPage: 0,
        });
      } else if (results.length == 0) {
        res.render("index", {
          errMsg: "No titles found. Please try again with a different query.",
          results: null,
          keyWord: query,
          resultCount: 0,
          totalPages: 0,
          startIndex: 0,
          currentPage: 0,
        });
      } else {
        var totalPages = 1;
        if (totalMatches > 10) {
          totalPages = Math.ceil(totalMatches / 10);
        }
        res.render("index", {
          errMsg: null,
          results: results,
          keyWord: query,
          resultCount: totalMatches,
          totalPages: totalPages,
          startIndex: offset,
          prevIndex: Number(offset) - 10, 
          nextIndex: Number(offset) + 10,
          currentPage: Math.floor(Number(offset) / 10) + 1,
        });
      }
    });
  }
});

/* GET details page. */
router.get("/details", function (req, res, next) {
  var bookID = req.query.book_id;
  var bookSubject = null;

  Subject.retrieve(bookID, function (err, results) {
    if (err) {
      console.error(err);
    } else {
      bookSubject = results["Subject"];
      Item.retrieve(bookID, function (err, results) {
        if (err) {
          console.error(err);
        } else {
          res.render("details", {
            Title: results.ID,
            Author: results.AUTHOR,
            AdditionalAuthor: results.ADD_AUTHOR,
            CallNumber: results.CALLNO,
            PublicationInfo: results.PUB_INFO,
            Description: results.DESCRIPT,
            Series: results.SERIES,
            SubjectCategories: bookSubject,
          });
        }
      });
    }
  });
});

module.exports = router;
