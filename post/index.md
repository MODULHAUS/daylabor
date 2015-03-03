# Post Up

All posts have a 6 hour TTL.  You can delete your active entries by clicking __bounce__ on the [main page](/).  Retarding posts may be deleted.

<div id="post">
  <form id="postUp" action="/contact" method="POST">
    <label for="handle">Name, aka Alias</label>
    <input type="text" id="handle" name="handle" placeholder="zero kill"></input>
    <Label>Which payment methods do you accept?</label>
    <br />
    <input type="checkbox" name="bitcoin" id="bitcoin" checked>
      <label for="bitcoin">Bitcoin</label></input>
    <input type="checkbox" name="cash" id="cash" checked>
      <label for="cash">Cash</label></input>
    <input type="checkbox" name="credit" id="credit" checked>
      <label for="credit">Credit Cards</label></input>
    <input type="checkbox" name="checks" id="checks" >
      <label for="checks">Checks</label></input>
    <br/>
    <label for="buzzwords">Comma Separated Buzzwords.  <span>110 char max</span></label>
    <input type="text" id="buzzwords" name="buzzwords" placeholder="javascript, html, css, crypto"></input>
    <label for="info">Gloats, Boasts, n Infoz. <span>330 char max</span></label>
    <textarea name="info" id="info" rows="11" cols="80" placeholder="# Markdown Supported"></textarea>
    <button id="sumbit">Post Up</button>
    <p><span id="chars">0</span> of 330 characters used</p>
  </form>
</div>
