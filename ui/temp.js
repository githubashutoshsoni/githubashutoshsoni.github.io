function loadnav(){
  document.getElementById('nav-bar').innerHTML=`
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
`
return;
}
function loadfooter(){
  document.getElementById('foot').innerHTML=`
        <div class="container row-footer ";>
            <div class="row row-footer">
	        <div class="col-xs-5 col-xs-offset-1 col-sm-2 col-sm-offset-1">
                    <h5>Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="/Introduction">About me</li>

                        <li><a href="index.html#">Contact</a></li>
                    </ul>
                </div>
	        <div class="col-xs-6 col-sm-5">
                    <h5>I live in Chennai </h5>
                    <i class="fa fa-phone"></i> 9840523023<br>
                    <i class="fa fa-envelope"></i>m.ashutoshsoni@gmail.com
                    </address>
                    </div>
                    <div class="col-xs-12 col-sm-4">
                    <div class="nav navbar-nav">
                    <a href="https://www.facebook.com/narutosh.uzuoni"><i id="social-fb" class="fa fa-facebook-square fa-3x social"></i></a>
                    <a href="https://twitter.com/ashutoshsoni16"><i id="social-tw" class="fa fa-twitter-square fa-3x social"></i></a>               </div>
                    <div class="col-xs-12">

                    </div>

                    </div>


                    </div>
            <p class="text-center"> made with <i class="fa fa-heart"> by Ashutosh Soni</i></p>

                    `

                    return;
                  }

                  loadnav();
                  loadfooter();
