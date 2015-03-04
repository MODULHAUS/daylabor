var readyGo = require('domready')
var jtype = require('jtype')
var marked = require('marked')
marked.setOptions({
  smartyPants: true,
  sanitize: true
})

var viz = false

setTimeout(function(){
  if(!viz) document.body.style.visibility = 'visible';
},1.333)

readyGo(function(){

  var infos = document.querySelectorAll('.info')
  Array.prototype.forEach.call(infos, markem)
  function markem(el){
    el.innerHTML = marked(el.innerHTML)
    if(window.location.pathname.split('/')[1] === 'posted'){
      el.style.display = 'block'
    }
  }

  document.body.style.visibility = 'visible';
  viz = true
  var buzz = document.getElementById('buzzwords')
  var input = document.querySelector('textarea')
  
  var chars = document.getElementById('chars')
  buzz.addEventListener('paste', typo(110))
  input.addEventListener('paste', typo(330)) 
  buzz.addEventListener('keydown', typo(110))
  input.addEventListener('keydown', typo(330))

  function typo(count){
    return function (e){
      var self = this
      setTimeout(function(){
        var ct = self.value.length
        if(ct > count && e.keyCode !== 8) {
          e.preventDefault()
          self.value = self.value.slice(0,count)
        }
//        chars.textContent = self.value.length 
      },0)
    }
  }
})
