var express = require('express');
var router = express.Router();


var pg = require('pg');


var config = {
		  user: 'postgres', //env var: PGUSER
		  database: 'book', //env var: PGDATABASE
		  password: 'postgres', //env var: PGPASSWORD
		  host: 'localhost', // Server hosting the postgres database
		  port: 5432, //env var: PGPORT
		  max: 10, // max number of clients in the pool
		  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
		};
//var connection = new pg.Client(config);

var mysql = require('mysql');
var DATABASE = 'book';
var db_config = {
  user: 'root',
  password: 'password',
  host: 'localhost',
  port: '3306',
  database: DATABASE
};
var connection = new pg.Client(config);
connection.connect(function(err) {
	if (err) {
		console.log("Database Connection didnt happen because : ", err);
		setTimeout(handleDisconnect, 1000);
	}
});


/* GET home page. */
router.get('/', ensureAuthenticated,function(req, res){
	
	BooksSQL = 'SELECT * FROM books'
	connection.query(BooksSQL, function(err, rows, fields) {
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }
	           // res.render('index',{page_title:"Books",data:rows.rows,crtuser:req.session.passport.user.rows[0].id});
		 	res.render('index',{page_title:"Books",data:rows.rows,crtuser:req.session.passport.user.id});
	         });
});

router.get('/addbook', ensureAuthenticated,function(req, res){
	  res.render('add_book',{page_title:"Add Book"});
});


router.post('/insertbook', ensureAuthenticated,function(req, res){
	data =[req.body.bookname,req.body.isbncode,req.body.catalogue,req.session.passport.user.id];
Books_insert_SQL = "INSERT INTO books(bname,isbncode,catalogue,ctuserid) values($1,$2,$3,$4)";
		connection.query(Books_insert_SQL,data,function(err, rows, fields) {
			 if(err){
		           console.log("Error Selecting : %s ",err );
			 }
			 res.redirect('/');
		                           
		});
});

router.get('/editbook', ensureAuthenticated,function(req, res){
	var id = req.query.id;
	Books_edit_SQL = "SELECT * FROM books WHERE id=$1";
	connection.query(Books_edit_SQL,[id],function(err, rows, fields) {
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }
	            res.render('edit_book',{page_title:"Books",data:rows.rows});
	         });
});


router.post('/updatebook', ensureAuthenticated,function(req, res){
	var id = req.body.id;
	data =[req.body.bookname,req.body.isbncode,req.body.catalogue,id];
	Books_update_SQL = "UPDATE books SET bname=($1),isbncode=($2),catalogue=($3) WHERE id=($4)";
		connection.query(Books_update_SQL,data,function(err, rows, fields) {
			 if(err){
		           console.log("Error Selecting : %s ",err );
			 }
			 res.redirect('/');
		});
});

router.get('/delete', ensureAuthenticated,function(req, res){
	var id = req.query.id;
	Books_edit_SQL = "DELETE FROM books  WHERE id=($1)";
	connection.query(Books_edit_SQL,[id],function(err, rows, fields) {
		 if(err){
	           console.log("Error Selecting : %s ",err );
		 }
		 		res.redirect('/');
	         });
});

router.get('/search', ensureAuthenticated,function(req, res){
	var search_str = req.query.srch;
	Books_search_SQL = "SELECT * FROM books WHERE bname LIKE $1 OR isbncode LIKE $1";
	connection.query(Books_search_SQL,['%' + search_str + '%'], function(err, rows, fields) {
			 if(err){
		           console.log("Error Selecting : %s ",err );
			 }
			 
			 	res.render('index',{page_title:"Books",data:rows.rows,crtuser:req.session.passport.user.id});
		     });
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {    
		return next();
	} 
	res.redirect('/users/login')
}

module.exports = router;
