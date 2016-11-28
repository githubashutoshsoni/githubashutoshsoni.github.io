

              loadCommentForm();

function loadCommentForm () {
  var comment = `  <hr><p class="h3">Give feedback of my work. You need to be looged in to access this feature </p>
  <textarea id="comment_text1" rows="5" cols="100" placeholder="Type here..."></textarea>
  <br>
  <input class="btn btn-primary" type="submit " id="submit" value="Submit" />
  <br>`;
  document.getElementById('comment').innerHTML = comment;

  var submit=document.getElementById('submit');
  submit.onclick=function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
      if(request.readyState===XMLHttpRequest.DONE)
      {
        if(request.status===200)
        {
          alert('sent successfully');
          submit.value='submit';
        }
        else{
          alert('unsuccessfuly');
        }
      }
    };
    var data= document.getElementById('comment_text1').value;
    request.open('POST','/pcomment',true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({data:data}));
    submit.value='submitting...'

  };

}
