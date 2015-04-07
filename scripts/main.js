var APP,
    DATA = []

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
            .rollup(function(d) { return d.length; })
            .map(data)

        console.log(data)
    }
    
}

// CARREGA DATASET E INICIA

loadDataset([
    ['countries','data/countries.csv'],
    ['olympics','data/olympic-medallists-1896-2008.csv']
], APP.init);