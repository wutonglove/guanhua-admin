const fs = require('fs');
const xlsx = require('node-xlsx');

var alldata = xlsx.parse('./1.xlsx');
var _data = alldata[3].data;
var njdata = arrToObj(alldata[0].data);
var xkdata = arrToObj(alldata[1].data);
var cdata = arrToObj(alldata[2].data);

function find(arr, fag, key) {
    key = key ? key : 'code';
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == fag) return i;
    }
    return -1;
}

function arrToObj(arr) {
    var obj = {};
    arr.forEach(function(item, index) {
        if (index === 0) return;
        obj[item[0]] = item[1];
    });
    return obj;
}

var data = [],
    njindex = 0,
    xkindex = 0,
    ceindex = 0,
    zindex = 0,
    jindex = 0,
    xjindex = 0,
    xxjindex = 0;

for (var i = 1; i < _data.length; i++) {
    var kong = 0;
    for (var j = 0; j < _data[i].length; j++) {
        var _cur = _data[i][j];
        if (_cur) {
            if (j === 0 && find(data, _cur) === -1) {
                // 年级
                data.push({ code: _cur * 1, name: njdata[_cur], data: [] });
                if (data.length > 1) {
                    njindex++;
                    xkindex = ceindex = zindex = jindex = xjindex = xxjindex = 0;
                }
            } else if (j === 1) {
                // 学科
                var _list = data[njindex].data;
                _list.push({ code: _cur * 1, name: xkdata[_cur], data: [] });
                if (_list.length > 1) {
                    xkindex++;
                    ceindex = zindex = jindex = xjindex = xxjindex = 0;
                }
            } else if (j === 2) {
                // 册
                var _list = data[njindex].data[xkindex].data;
                _list.push({ code: _cur * 1, name: cdata[_cur], data: [] });
                if (_list.length > 1) {
                    ceindex++;
                    zindex = jindex = xjindex = xxjindex = 0;
                }
            } else if (j === 3) {
                // 章
                var _list = data[njindex].data[xkindex].data[ceindex].data;
                _list.push({
                    code: _data[i][7],
                    name: _cur,
                    data: []
                });
                if (_list.length > 1) {
                    zindex++;
                    jindex = xjindex = xxjindex = 0;
                }
            } else if (j === 4) {
                // jie
                var _list =
                    data[njindex].data[xkindex].data[ceindex].data[zindex].data;
                _list.push({
                    code: _data[i][7],
                    name: _cur,
                    data: []
                });
                if (_list.length > 1) {
                    jindex++;
                    xjindex = xxjindex = 0;
                }
            } else if (j === 5) {
                var _list =
                    data[njindex].data[xkindex].data[ceindex].data[zindex].data[
                        jindex
                    ].data;
                _list.push({
                    code: _data[i][7],
                    name: _cur,
                    data: []
                });
                if (_list.length > 1) {
                    xjindex++;
                    xxjindex = 0;
                }
            } else if (j === 6) {
                var _list =
                    data[njindex].data[xkindex].data[ceindex].data[zindex].data[
                        jindex
                    ].data[xjindex].data;
                _list.push({
                    code: _data[i][7],
                    name: _cur,
                    data: []
                });
            }
        }
    }
}

// 学科
fs.writeFile('./xk.json', JSON.stringify(xkdata), function(err) {
    if (err) {
        throw err;
    }

    console.log('succ');
});

// 年纪
fs.writeFile('./nj.json', JSON.stringify(njdata), function(err) {
    if (err) {
        throw err;
    }

    console.log('succ');
});

// 册
fs.writeFile('./c.json', JSON.stringify(cdata), function(err) {
    if (err) {
        throw err;
    }

    console.log('succ');
});

// 章节
fs.writeFile('./kc.json', JSON.stringify(data), function(err) {
    if (err) {
        throw err;
    }

    console.log('succ');
});
