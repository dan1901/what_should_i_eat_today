var express = require('express');
var router = express.Router();
var meat_model = require('../model/food').food;

global.g_query = [];
global.title = '오늘 뭐먹지';
/* GET home page. */
router.get('/', function(req, res) {
    //console.log(req.body);

    meat_model.count().exec(function(count_error, count_result) {
        if (count_error) {
            console.error(count_error);
            res.render('error', {
                message: count_error,
                error: {
                    status: 400,
                    stack: count_error
                }
            });
        } else {
            res.render('index', {
                title: title,
                tab1: '메뉴 찾기',
                tab2: '메뉴 등록하기',
                total_count: count_result,
                data: [],
                page_count: 1
            });
        }
    });

});


function on_off(value) {
    console.log('val', value);
    var ret_value = false;
    if (value[Object.keys(value)] == 'on') {
        ret_value = true;
    }
    console.log(ret_value);
    return ret_value;
}

router.get('/search', function(req, res) {
    var data = req.query.data;
    var query = [];
    for (obj in data) {
        data[obj][Object.keys(data[obj])] = on_off(data[obj]);
    }
    meat_model.count().exec(function(count_error, count_result) {
        if (count_error) {
            res.render('error', {
                message: count_error,
                error: {
                    status: 400,
                    stack: count_error
                }
            });
        } else {
            meat_model.find({ $and: data }, { _id: false, __v: false }).exec(function(find_error, find_result) {
                if (find_error) {
                    res.render('error', {
                        message: find_error,
                        error: {
                            status: 500,
                            stack: find_error
                        }
                    });
                } else {
                    for (obj in find_result) {
                        g_query.push(find_result[obj]);
                    }
                }

            });
        }
    });
});

router.get('/search/result', function(req, res) {
    console.log(g_query);
    res.json('result');
    g_query = [];
});


router.post('/add', function(req, res) {
    console.log(req.body);
    var data = req.body;

    var conv_obj = new meat_model({
        meat: data.meat,
        spicy: data.spicy,
        soup: data.soup,
        name: data.name
    });
    conv_obj.save(function(gagu_add_error) {
        if (gagu_add_error) {
            console.error(gagu_add_error)

        } else {
            console.log('save success');
        }

    });
});


module.exports = router;