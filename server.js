var fs = require('fs')
var http = require('http')
var body = require('body/form')
var router = require('router')
var uuid = require('uuid')
var stat = require('ecstatic')(__dirname + '/public')
var template = require('html-template')
var createdb = require('./lib/db')
var db = createdb('messages', true) // TTL
var sessionStore = require('./lib/sessions.js')(createdb('sessions'), true)
var through2 = require('through2')
var through = require('through')
var bind = require('tcp-bind')
var arg = require('minimist')(process.argv)
var Router = require('router')


//bind(arg.p)
//process.setgid(arg.g)
//process.setuid(arg.u)
var ttl = 1000 * 60 * 60 * 6;

var router = Router()
router.get('/posted/:id', function(req, res){
  console.log(req.params.id)
  db.get('posted!' +  req.params.id, 
    function(err, data){
      console.log(err, data)
      var key = data
      var rs = db.createReadStream({gte:key, lt:key+'~'})
      tinplate(req, res, rs)
    }
  )
})

var server = http.createServer(function(req, res){
  sessionStore(req, res, function(){
    router(req, res, function(){
      if(req.method == 'POST' && req.url == '/contact'){
        body(req, res, function(err, body){
          if(err) console.log(err)
          else{
            body.session = req.session
            body.id = uuid.v1()
            var now = new Date().toISOString()
            var key = 'messages!' + now + '!' + body.session.id
            db.put(
              key,
              JSON.stringify(body),
              {ttl: ttl}
            )
            console.log(body.id, key)
            db.put('posted!'+ body.id, key, {ttl: ttl}) 
            res.end('HOPE THIS HELPS')
          }
        })    
      }
      else if(req.url == '/messages'){
        if(req.method == 'POST'){
          body(req, res, function(err, body){
            if (body.pass == arg.pass){
                var r = db.createReadStream({
                gt: 'messages!',
                lt: 'messages!~'
              })
              r.pipe(through2.obj(
                function(row, enc, next){
                  this.push(row.value + '\n')
                  next()
                }
              )).pipe(res)
            }
            else res.writeHead(304, {'Location':'/messages'})
          })
        }
        else stat(req, res)
      }
      else if(!(req.url === '/')) stat(req, res)
      else {
        var html = template()
        var hacker = html.template('hacker')
        fs.createReadStream(__dirname + '/public/index.html').pipe(html).pipe(res)
        var r = db.createReadStream({
            gt: 'messages!',
            lt: 'messages!~'
        })
        r.pipe(through(
          function(data){
            var data = JSON.parse(data.value)
            console.log(data)
            var own = req.session.id === data.session.id
            hacker.write({
               '[key=bounce]': own ? '<a class=bounce href=/posted/'+data.id+'>bounce</a>' : '',
              '[key=handle]':'<a class=alias href=/posted/'+data.id+'>@'+data.handle+'</a>',
              '[key=hourly]':data.hourly,
              '[key=buzzwords]':data.buzzwords
            })
          },
          function(){hacker.end()}
        ))
      }
    })
  })
})

server.listen(11005)

function tinplate(req, res, db){
  var html = template()
  var hacker = html.template('hacker')
  fs.createReadStream(__dirname + '/public/index.html').pipe(html).pipe(res)
  db.pipe(through(
    function(data){
      var data = JSON.parse(data.value)
      console.log(data)
      var own = req.session.id === data.session.id
      hacker.write({
         '[key=bounce]': own ? '<a class=bounce href=/posted/'+data.id+'>bounce</a>' : '',
        '[key=handle]':data.handle,
        '[key=hourly]':data.hourly,
        '[key=buzzwords]':data.buzzwords,
        '[key=info]':data.info
      })
    },
    function(){hacker.end()}
  ))
}
