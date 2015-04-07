var APP,
    DATA = []

// PROCESSAMENTO DE DADOS

function loadCSV(file,id,callback){

    var dsv = d3.dsv(',', 'text/plain')

    dsv(file[1])
        .row(function(d){
            return d
        })
        .get(function(error, rows){
            
            DATA[file[0]] = rows
            
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
        console.log('Hello, d3!')
        console.log(DATA['countries'])
    }
}

// CARREGA DATASET E INICIA

loadDataset([
    ['countries','data/countries.csv'],
    ['olympics','data/summer-olympic-medallists-1896-2008.csv']
], APP.init);