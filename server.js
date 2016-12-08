var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');
var usern;
var config = {
    user: 'githubashutoshsoni',
    database: 'githubashutoshsoni',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

function createTemplate (data) {
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;

    var htmlTemplate = `
    <html>
      <head>
          <title>
              ${title}
          </title>
          <meta name="viewport" content="width=device-width ,initial scale=1">
          <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
       <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet" integrity="sha256-MfvZlkHCEqatNoGiOXveE8FIwMzZg4W85qfrfIFBfYc= sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
       <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
       <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
       <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>


        <link href="/ui/style.css" rel="stylesheet" />

      </head>
      <body>
          <div class="container">
          <nav class="navbar navbar-inverse">
            <div class="container-fluid">
              <div class="navbar-header">
                <a class="navbar-brand" href="/">Blogging</a>
              </div>
              <ul class="nav navbar-nav">
                <li class="active"><a href="/">Home</a></li>
                <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="/ui/Introduction">About me <span class="caret"></span></a>
                  <ul class="dropdown-menu">
                    <li><a href="/introduction">profile</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>

              <div>
                  <a href="/">Home</a>
              </div>
              <hr/>
              <h3 >
                  ${heading}
              </h3>
              <div class="glyphicon glyphicon-time">
                  ${date.toDateString()}
              </div>
              <br>
              <div class="container well well-sm ">
                ${content}
              </div>
              <hr/>
              <h4>Comments</h4>
              <div id="comment_form" class="">
              </div>

              <div id="comments" >
                Loading comments...
              </div>

          </div>
          <footer>



          </footer>
          <script type="text/javascript" src="/ui/article.js"></script>
      </body>
    </html>
    `;
    return htmlTemplate;
}


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/Introduction1', function (req, res) {
 var htmlTemplate = `<!doctype html>
<html>
    <head>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class="container">
            <div class="center">
                <img id='pp' src="http://goo.gl/L0pk6U" class="img-medium"/>
            </div>
            <h3>About me</h3>
            <p>

                Hi. My name is Ashutosh Soni.<br>
                I am a student.<br>
                I love programming.<br>
                I love hacking.<br>
                I am looking forward to developing more interactive webapp(s).<br>


            </p>

            <hr/>
            <h3>Currently:</h3>
            <p>
                  Student in SRMU
            </p>
            <hr/>
            <h3>
            Home Town
            </h3>
            <p>
                Jaipur
            </p>
            <hr/>
            <h3>
                Hobbies
            </h3>
            <p> Games, Movies, Gardening, Music, Tv, Programming </p>

            <hr/>

            <input type="submit" value="click for more info" id="sub"> <span id="bigdata">hello </span></input>
            <input type="text" value="comment" id="icomment"> </input>
            <ul id="usercomment" ></ul>

        </div>
        <script type="text/javascript" src="/ui/main.js">
        </script>
    </body>
</html>`;
    return htmlTemplate;

});


function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});


app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "tanmai", "password": "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   if(!username.trim() || !password.trim()){
     res.status(400).send('Username or password field blank.');   //Err if blank,tabs and space detected.
  }

  else if(!/^[a-zA-Z0-9_#.]+$/.test(username))  //If username contains other than a-z,A-Z,0-9 then true.
         {
                   res.status(401).send('Your username contains special characters other than _#.');
          }
  else{
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
   }
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   if(!username.trim() || !password.trim()){
     res.status(400).send('Username or password field blank.');   //Err if blank,tabs and space detected.
  }
else{
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {

                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}

                res.send('credentials correct!');

              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
   }
});


app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
             usern=result.rows[0].username
              res.send(result.rows[0].username);
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});

var pool = new Pool(config);

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

app.get('/articles/:articleName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
        }
    }
  });
});

app.get('/ui/:fileName', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', req.params.fileName));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});

app.post('/intro-comment-submit', function (req, res) {
   // Check if the user is logged in
   var comment=req.body.usercomment;

    if (req.session && req.session.auth && req.session.auth.userId) {
      pool.query('INSERT INTO comment VALUES ($1)', [comment], function (err, result) {
         if (err) {
             res.status(500).send(err.toString());
         } else {
             res.send('comment added  successfully');

         }
      });


    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

app.get('/introduction', function (req, res) {
      res.send(`<!doctype html>
      <html>
          <head> <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" rel="stylesheet">
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet" integrity="sha256-MfvZlkHCEqatNoGiOXveE8FIwMzZg4W85qfrfIFBfYc= sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>


              <link href="/ui/style.css" rel="stylesheet" />

          </head>
          <body>


            <div id="nav-bar">Loading navigation bar...</div>

            <div class="container-fluid bg-1 text-center">
              <h3>I am Ashutosh Soni</h3>
              <img src="http://goo.gl/L0pk6U" class="img-circle" >
              <h3>I love Programming<br> I love Travelling<br> </h3>
            </div>

        </div>
                <hr/>
              </div>
              <div class="container-fluid bg-2 text-center">
                <h3 >Currently:</h3>
                <p>
                  Student in SRMU<br>
                  Pursuing bachelor degree in Computer Science and Engineering<br>
                  Did my schooling in SJTSJV

                </p>
              </div>
                <hr/>
                <div class="container-fluid bg-3 text-center">
              <h3>Home Town: </h3>Nagaur<br>
              <img src="https://goo.gl/SWfyYk" class="img-circle" height="100px" width="100px" ><br>
                  <h3>lives in :</h3>Chennai

                  </div>
              <hr/>
                <div class="container-fluid bg-1 text-center">

                  <h3>  Hobbies:</h3>
                  <p>
                    Games<br>Movies<br>Music<br>Tv<br>Programming

                </p>
              </div>

              <div id="comment"></div>


            <footer id="foot">

            </footer>

            <script type="text/javascript" src="/ui/temp.js">
            </script>
            <script type="text/javascript" src="/ui/imain.js">
            </script>

          </body>
          </html>
`);
});



app.post('/pcomment',function(req,res){
  var content=req.body.data;
  if (req.session && req.session.auth && req.session.auth.userId){
  pool.query('insert into profilecomment (user_id,comment) values ($1,$2)',[req.session.auth.userId, content], function(err,result){
    if(err){
      res.status(500).send(err.toString());
    }
    else{
      res.status(200).send('comment-inserted');
    }
  });
}
else{
  res.status(403).send('Only logged in users can comment');
}
  });


app.post('/submit-article',function(req,res){
    if (req.session && req.session.auth && req.session.auth.userId){

      pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
          if (err) {
             res.status(500).send(err.toString());
          } else {
             var usern=result.rows[0].username;
             console.log(usern);
                   pool.query('insert into article (title,heading,content,username) values ($1,$2,$3,$4)',[req.body.title,req.body.heading,req.body.content,usern],function(err,result){
                     if(err){
                       console.log(err);
                       res.status(500).send(err.toString());

                     }
                     else{
                       res.status(200).send('Article-Inserted successfully');
                     }
                   });
          }
      });
    }
    else{
      res.status(403).send('Only logged in users can comment');
    }
  });
