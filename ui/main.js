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
                       loadbio();
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
var more=document.getElementById("m_article");
more.onclick=function () {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
          var articles = document.getElementById('articles');
          if (request.status === 200) {
              var content = '<ul>';
              var articleData = JSON.parse(this.responseText);
              for (var i=0; i< articleData.length; i++) {
                  content += `<li>

                  <a href="/articles/${escapeHTML(articleData[i].title)}">${escapeHTML(articleData[i].heading)}<br></a> by ${articleData[i].username} (${articleData[i].date.split('T')[0]})
                <br>
                <div class="well well-sm contents">
                ${escapeHTML(articleData[i].content.substring(0,1000))}

                </div>
                  </li>`;
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
var less=document.getElementById("l_article");
less.onclick=function () {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
          var articles = document.getElementById('articles');
          if (request.status === 200) {
              var content = '<ul>';
              var articleData = JSON.parse(this.responseText);
              for (var i=0; i< articleData.length; i++) {
                  content += `<li>

                  <a href="/articles/${articleData[i].title}">${articleData[i].heading}<br></a> by ${articleData[i].username} (${articleData[i].date.split('T')[0]})
                <br>
                <div class="well well-sm contents">
                ${escapeHTML(articleData[i].content.substring(0,1000))}

                </div>
                  </li>`;
              }
              content += "</ul>"
              articles.innerHTML = content;
          } else {
              articles.innerHTML('Oops! Could not load all articles!')
          }
      }
  };

  request.open('GET', '/less-articles', true);
  request.send(null);
}



}

function escapeHTML (text)
{
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
    return $div.innerHTML;
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
          <img src="/ui/success.jpg" alt="newspaper" width="460" height="345">
          <div class="carousel-caption">
        <h3></h3>
        <p>“No matter how busy you may think you are, you must find time for reading, or surrender yourself to self-chosen ignorance.”
― Atwood H. Townsend"</p>
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
          <img src="/ui/newspaper.jpg" alt="newspaper" width="460" height="345">
          <div class="carousel-caption">
        <h3>Newspaper</h3>
        <p>“If you don't read the newspaper, you're uninformed. If you read the newspaper, you're mis-informed.”
            ― Mark Twain
            </p>
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

function loadprofile(){

  var profile=document.getElementById("profile");
  profile.onclick=function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var details = document.getElementById('details');
            if (request.status === 200) {
                var content = '<ul>';
                var profileData = JSON.parse(this.responseText);
                for (var i=0; i< profileData.length; i++) {
                    content += `<li>
                    ${profileData[i].name}<br></li>
                    <li>BIO:${profileData[i].bio}</li>

                          `;
                }
                content += "</ul>"
                details.innerHTML = content;
            } else {
                details.innerHTML('Oops! Could not load userdata!')
            }
        }
    };

    request.open('GET', '/namebio', true);
    request.send(null);
  }


}
function loadbio(){
document.getElementById("details").innerHTML=`<textarea value="name!" id="name" placeholder="name"></textarea>
<textarea value="enter your bio here" placeholder="Bio"  id="bio"></textarea>
<button id="submit-bio">submit</button>
`;

document.getElementById('submit-bio').onclick=function(){


      // Create a request object
      var request = new XMLHttpRequest();

      // Capture the response and store it in a variable
      request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            // Take some action

            if (request.status === 200) {

                     submit.value = 'Sucess!';
              }
              else{

                alert('sorry !couldnt submit your bio');
              }
        }
        // Not done yet
      };

      // Make the request
      var name = document.getElementById('name').value;
      var bio = document.getElementById('bio').value;
      request.open('POST', '/insertbio', true);
      request.setRequestHeader('Content-Type', 'application/json');
      request.send(JSON.stringify({name: name, bio: bio}));
      submit.value = 'submitting...';

  };
}
loadrules();


loadLogin();

loadArticles();

loadprofile();
