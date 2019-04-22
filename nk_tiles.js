function Tiles(setting) {
    "use strict";
    
    let tilesWrap = document.querySelector(setting.tilesWrap);
    if(tilesWrap === null) {
        console.error(`Не найден селектор плиток ${setting.tilesWrap}`);
        return;
    }
    
    let tiles = tilesWrap.querySelectorAll(setting.tiles);
    let tilesCount = tilesWrap.querySelectorAll(setting.tiles).length;
    let cols = parseInt(getComputedStyle(tilesWrap).getPropertyValue('--cols'));
    if(!cols){
        console.error(`Не найдено свойство --cols в стиле элемента ${setting.tilesWrap}`);
        return;
    }
    let tilesArr = [];
    let matrixArr = [];
    let avgCols = 0;
    
    // funcs
    let setTiles = () => tilesWrap.querySelectorAll(setting.tiles);
    let setTilesCount = () => tilesWrap.querySelectorAll(setting.tiles).length;
    let setCols = () => cols = parseInt(getComputedStyle(tilesWrap).getPropertyValue('--cols'));
    
    function getTilesArr(){
        let colWidth = tilesWrap.clientWidth / cols;
        for (let i = 0; i < tilesCount; i++) {
            tilesArr.push([i, colWidth / parseFloat(tiles[i].dataset.ratio)]);
        }
        tilesArr = tilesArr.sort((a, b) => b[1] - a[1]);
    }
    
    function getMatrixArr(){
        
        for (let i = 0; i < cols; i++) { // first row
            matrixArr.push([[tilesArr[i]], tilesArr[i][1]]);
        }
        
        for (let i = cols; i < tilesArr.length; i++) { // uneven matrix
            let min = 0;
            for (let j = 0; j < matrixArr.length; j++) {
                if(matrixArr[j][1] < matrixArr[min][1]){
                    min = j;
                }
            }
            matrixArr[min][0].push(tilesArr[i]);
            matrixArr[min][1] += tilesArr[i][1]; // sum
        }
        
        for (let i = 0; i < cols; i++) { // avg ratio cols
            avgCols += matrixArr[i][1];
        }
        avgCols /= cols;
        tilesWrap.style.height = avgCols + 'px';
        
        let diff;
        for (let i = 0; i < cols; i++) { // even matrix
            diff = (matrixArr[i][1] - avgCols) / matrixArr[i][0].length;
            for (let j = 0; j < matrixArr[i][0].length; j++) {
                matrixArr[i][0][j][1] -= diff;
            }
            matrixArr[i][0].sort((a, b) => a[0] - b[0]);
        }
    }
    function clearStyles(){
        tilesWrap.style.height = 'unset';
        for (let i = 0; i < tilesCount; i++) {
            tiles[i].style.height = 'unset';
            tiles[i].style.order = 'unset';
        }
    }
    
    function rePaint(){
        let ord = 1;
        for (let i = 0; i < cols; i++) {
            matrixArr[i][0].forEach(function(item) {
                tiles[item[0]].style.height = item[1] + 'px';
                tiles[item[0]].style.order = ++ord;
            });
        }
    }
    
    function init(){
        if(tilesCount <= cols){
            let colWidth = tilesWrap.clientWidth / cols;
            for (let i = 0; i < tilesCount; i++) {
                avgCols += colWidth / parseFloat(tiles[i].dataset.ratio);
            }
            if(tilesCount > 2){
                avgCols /= cols;
            }
            for (let i = 0; i < tilesCount; i++) {
                tiles[i].style.height = avgCols + 'px';
            }
            tilesWrap.style.height = avgCols + 'px';
        } else {
            getTilesArr();
            getMatrixArr();
            rePaint();
        }
    };
    
    init();
    
    function reInit(){
        clearStyles();
        tiles = tilesWrap.querySelectorAll(setting.tiles);
        tilesCount = tilesWrap.querySelectorAll(setting.tiles).length;
        cols = parseInt(getComputedStyle(tilesWrap).getPropertyValue('--cols'));
        tilesArr = [];
        matrixArr = [];
        avgCols = 0;
        init();
    }
    
    //events
    window.onresize = function() {
        reInit();
    };
    
}