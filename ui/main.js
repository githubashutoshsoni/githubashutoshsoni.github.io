function loadLoginForm () {
    var loginHtml = `
        <h2 >Login/Register to write your own article</h2>
        <div id="status"></div>
        <input class="form-control input-lg" type="text" id="username" placeholder="username" /><br>
        <input  type="password" class="form-control input-lg" id="password" placeholder="password" />
        <br/><br/>
        <input  type="submit" class="btn btn-primary btn-lg btn-block"  id="login_btn" value="Login" /><br>
        <input type="submit" class="btn btn-primary btn-lg btn-block" id="register_btn" value="Register" />
        `;
        $('#login_area').html(loginHtml);
    // Submit username/password to login
    var submit = document.getElementById('login_btn');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();

        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action

              if (request.status === 200) {

                       submit.value = 'Sucess!';
                }
                else if (request.status === 400) {
                    alert('Empty credentials');

                    var stat=`<div class="container">
                    <h2>Alert</h2>
                    <div class="alert alert-danger">
                    <strong>Warning!</strong> You cannot have empty characters in username. Please type your username or password
                    </div>
                    </div>
                    `;  $('#status').html(stat);

                     console.log('subm');
                  submit.value = 'empty credentials. Try again?';
              }

                else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
          }
          // Not done yet
        };

        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));
        submit.value = 'Logging in...';

    };

    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();

        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                var stat=`<div class="container">
    <h2>Alerts</h2>
    <div class="alert alert-success">
      <strong>Success!</strong>successfully registered to our website
    </div>
    </div>`
    ;
    $('#status').html(stat).delay(2000);

                  register.value = 'Registered!';
              }
              else if (request.status === 401) {
              var stat=`<div class="container">
  <h2>Alert</h2>
  <div class="alert alert-danger">
  <strong>Danger!</strong> You cannot have special characters in username
  </div>
</div>
`;  $('#status').html(stat);

                 console.log(stat);
                              submit.value = 'Try again?';
                          }
              else if (request.status === 400) {
                alert('Empty credentials');

                var stat=`<div class="container">
                <h2>Alert</h2>
                <div class="alert alert-danger">
                <strong>Danger!</strong> You cannot have empty characters in username or password! try again :)
                </div>
                </div>
                `;  $('#status').html(stat);

                submit.value = 'empty credentials. Try again?';
                  }
              else {
                var stat=`<div class="container">
                <h2>Alert</h2>
                <div class="alert alert-danger">
                <strong>Username already exists!</strong> username already exists try again with a different username :)
                </div>
                </div>
                `;  $('#status').html(stat);

                  register.value = 'Register';
              }
          }
        };

        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));
        register.value = 'Registering...';

    };
}

function loadLoggedInUser (username) {
  document.getElementById('login_area').innerHTML=` `;
    var logout = document.getElementById('logout');
    logout.innerHTML = `
        <h4 class="text-left" > Hi <i>${username}</i></h4>
        <a href="/logout">Logout</a>
    `;
     LoadWriteArticles();
}
  function LoadWriteArticles(){
  document.getElementById('wr-article').innerHTML=`
    <div class="text-left">
       <h5>Submit an Article</h5>
      <input type="text" id="article_title"  cols="30" placeholder="Enter your title here..."></textarea>
      <br/>
      <input type="text" id="article_heading" cols="30"  placeholder="Enter your heading here..."></textarea>
      <br>
      <textarea id="article_content" rows="4" cols="70"  placeholder="Enter your content here..."></textarea>
      <br>
      <br/>
      <input class="btn btn-primary " type="submit" id="submit" value="Submit" />
      <br>
  </div>
  <br>
      `;
      var submit =document.getElementById('submit');
      submit.onclick= function(){
  var request= new XMLHttpRequest();
  request.onreadystatechange=function(){
  if(request.readyState===XMLHttpRequest.DONE)
  {
      if(request.status===200)
      {
        alert('Article submitted!');
        submit.value='submited';
      }
      else{
        alert('could not submit articles');
      }
  };

  }
  var title=document.getElementById('article_title').value;
  var heading=document.getElementById('article_heading').value;
  var content=document.getElementById('article_content').value;
  request.open('POST','/submit-article');
  request.setRequestHeader('Content-Type','application/json');
  request.send(JSON.stringify({title:title,heading:heading,content:content}));
  submit.value='submitting wait...'
    };

    return;
  }
function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };

    request.open('GET', '/check-login', true);
    request.send(null);
}

function loadArticles () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('articles');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += `<li>
                    <a href="/articles/${articleData[i].title}">${articleData[i].heading}<br> by ${articleData[i].username}<br></a>
                    (${articleData[i].date.split('T')[0]})</li>`;
                }
                content += "</ul>"
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!')
            }
        }
    };

    request.open('GET', '/get-articles', true);
    request.send(null);
}


// The first thing to do is to check if the user is logged in!

function loadrules()
{
  document.getElementById('rules').innerHTML=`<ol class="pull-left">
    <li> you can write articles and get recognized.</li>
    <li> You can Improve Your English.</li>
    <li> Your articles can be read by friends if they Register on this site as well.</li>
    <li> Articles You write can be seen by anyone.</li>
        </ol>
  `;
  document.getElementById('myCaro').innerHTML=`

  <div class="container">
    <br>
    <div id="myCarousel" class="carousel slide" data-ride="carousel">
      <!-- Indicators -->
      <ol class="carousel-indicators">
        <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
        <li data-target="#myCarousel" data-slide-to="1"></li>
        <li data-target="#myCarousel" data-slide-to="2"></li>
        <li data-target="#myCarousel" data-slide-to="3"></li>
      </ol>

      <!-- Wrapper for slides -->
      <div class="carousel-inner" role="listbox">
        <div class="item active">
          <img src="/ui/newspaper.jpg" alt="newspaper" width="460" height="345">
          <div class="carousel-caption">
        <h3>Newspaper</h3>
        <p>Read Newspaper.</p>
      </div>

        </div>

        <div class="item">
          <img src="/ui/book.jpg" alt="books" width="460" height="345">
          <div class="carousel-caption">
        <h3>Books</h3>
        <p>Read books.</p>
      </div>

        </div>

        <div class="item">
          <img src="/ui/blog.jpg" alt="blog" width="460" height="345">
          <div class="carousel-caption">
        <h3>Make your blog</h3>
        <p>Write your own blog here.</p>
        </div>

        </div>

        <div class="item">
          <img src="/ui/blog2.jpg" alt="blog2" width="460" height="345">
          <div class="carousel-caption">
        <h3>What you're waiting for?</h3>
        <p>Go ahead and start typing your article straight away.</p>
        </div>
      </div>

      <!-- Left and right controls -->
      <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  </div>


`
  return;
}
loadrules();


loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!
loadArticles();
