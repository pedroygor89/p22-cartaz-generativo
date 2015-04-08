var APP,
    P5,
    DATA = {},
    DATA2 = null,
    FLAGS = []

// PROCESSAMENTO DE DADOS

function loadCSV(file,callback){

    var dsv = d3.dsv(',', 'text/plain')
    console.log('loading file',file[0])

    dsv(file[1])
        .row(function(d){
            return d
        })
        .get(function(error, rows){
            
            DATA[file[0]] = rows
            console.log('loaded file',file[0],error)
            if(callback){
                callback()
            }
        });
}

function loadDataset(arr,callback) {
    var count = 0
    var cbk = function(){
        count++
        if(count < arr.length){
            loadCSV(arr[count],cbk)
        } else {
            if(callback){
                callback()
            }
        }
    };
    loadCSV(arr[0],cbk)
}

// APP

APP = {

    p5: null,

    init: function(){
        
        // apaga carregando

        $('#years').text('')

        // location hash

        $(window).on('hashchange', function() {
            //alert(window.location.hash)
            APP.generate(window.location.hash)
        })

        // cria navegador

        APP.createNav()
        APP.p5 = new p5(APP.sketch)

    },

    createNav: function(){
        var data = d3.nest()
            .key(function(d) { return d.Edition; })
            .entries(DATA['olympics']);

        data.map(function(d,i){
            var key = d.key
            $('#years').append('<a href="#'+key+'">'+key+'</a>')
        })
    },

    generate: function(ano){
        
        var data = _.where(DATA['olympics'],{Edition: ano.substring(1)})

        data = d3.nest()
            .key(function(d) { return d["NOC"]; })
            .rollup(function(d) { return { medalhas: d.length, rotacao: Math.random() * 10 } })
            .map(data)

        console.log(data)

        DATA2 = data
    },

    sketch: function( p ) {

        var x = 100 
        var y = 100

        var w = 1200
        var h = 1200

        var opacidade = 5

        function loadFlag(id,alpha){
            FLAGS[id] = -1
            p.loadImage("data/flags/"+alpha+".png", function(img) {
                FLAGS[id] = img
                console.log("find", id, alpha)
            })
        }

        p.setup = function() {
            p.createCanvas(w, h)
            p.background(0)
            //p.blendMode(LIGHTEST)
        }

        p.draw = function() {

            //p.background(0)
            //console.log('draw')

            p.fill(0,opacidade)
            p.rect(0,0,w,h)

            if(DATA2){
                
                p.fill(255)
                p.noStroke()

                for (var prop in DATA2) {
                    if( DATA2.hasOwnProperty( prop ) ) {

                        //var medalhas = 500 / DATA2[prop].medalhas
                        var medalhas = DATA2[prop].medalhas
                        var rotacao = DATA2[prop].rotacao += (medalhas*0.5 + 10) * 0.001

                        var x = w * 0.5 + p.sin(rotacao) * (medalhas + 20)
                        var y = h * 0.5 + p.cos(rotacao) * (medalhas + 20) //* 0.75

                        var size = 10 + medalhas / 3

                        if(FLAGS[prop] && FLAGS[prop] != -1){
                            p.image(FLAGS[prop], x - size * 0.5, y - size * 0.5, size, size*3/4)
                        } else {
                            //p.rect(x - size * 0.5, y - size * 0.5, size, size)
                            if(!FLAGS[prop]){

                                var country = _.findWhere(DATA['countries'], {alpha3: prop})
                                if(country !== undefined){
                                    var alpha2 = country.alpha2.toLowerCase()
                                    loadFlag(prop,alpha2)
                                }
                            }
                        }
                    } 
                }
            }

        }
    }
    
}

// CARREGA DATASET E INICIA

loadDataset([
    ['countries','data/countries.csv'],
    ['olympics','data/olympic-medallists-1896-2008.csv']
], APP.init);