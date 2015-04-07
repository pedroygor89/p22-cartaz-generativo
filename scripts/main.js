var APP,
	DATA = []

// PROCESSAMENTO DE DADOS

function loadCSV(file,id,callback){

    // DVS para carregar CSV separado por ;

    var dsv = d3.dsv(',', 'text/plain')

    dsv(file[1])
        .row(function(d){
            return d
        })
        .get(function(error, rows){
            
            DATA[file[0]] = rows
            
            if(callback){
                callback(id)
            }
        });
}

function loadDataset(arr,callback) {
    var count = 0
    var id = 0
    var cbk = function(id){
        count++
        if(count < arr.length){
            loadCSV(arr[count], id, cbk)
        } else {
            if(callback){
                callback()
            }
        }
    };
    loadCSV(arr[0],id,cbk)
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