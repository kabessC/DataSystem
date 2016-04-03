(function(){
    // using jQuery, Django post request, code from django documents
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
            }
        }
    });

    /*
        Remove charts view 
        div content function
    */
    function removeDivContent(){
        $('#charts-box').html('');
    }


    //Gender ratio charts
    $('#gender-btn').click(function(){
        removeDivContent();
        var ec = echarts.init(document.getElementById('charts-box'));
        ec.showLoading();

        $.ajax({
            url: '/gender_ratio/',
            type: 'post',
            success: function(response){
                var data = JSON.parse(response);
                ec.hideLoading();
                //Gender ratio option
                var option = {
                        title : {
                            text: '北京理工大学珠海学院\n微博用户性别比例',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        toolbox:{
                            show: true,
                            orient: 'vertical',
                            feature: {
                                saveAsImage: {
                                    show: true,
                                    title: '用户性别比例'
                                },
                                restore: {
                                    show: true
                                },
                                dataView: {
                                    show: true
                                }
                            }
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: function(){
                                var list = [];
                                for ( var i in data ){
                                    list.push(i);
                                }
                                return list;
                            }()
                        },
                        series : [
                            {
                                name: 'Gender',
                                type: 'pie',
                                radius : '70%',
                                data: function(){
                                    var list = [];
                                    $.each(data, function(index, value){
                                        var obj = new Object();
                                        obj.value = parseInt(value);
                                        obj.name = index;
                                        list.push(obj);
                                        obj = null;
                                    });
                                    return list;
                                }(),
                                itemStyle:{ 
                                    normal:{ 
                                        label:{ 
                                            show: true, 
                                            formatter: '{b} : {c} ({d}%)' 
                                        }, 
                                        labelLine :{show:true},
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                                roseType:true
                            }
                        ]
                    };  //optin end

                ec.setOption(option);
            }
        });
    });//Gender ratio charts end


    $('#gender-weibo-btn').click(function(){
        removeDivContent();
        var ec = echarts.init(document.getElementById('charts-box'), 'dark');
        ec.showLoading();

        $.ajax({
            url: '/gender_weibo_count/',
            type: 'post',
            success: function(response){
                data = JSON.parse(response);
                ec.hideLoading();
                var labels = ['0-100', '100-1000', '1000-2000', '2000-5000', '5000-10000', '10000以上'];
                var option = {
                    title : {
                        text: '北京理工大学珠海学院\n用户性别与其微博数量比较情况',
                        x:'left'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    toolbox:{
                        show: true,
                        orient: 'vertical',
                        feature: {
                            saveAsImage: {
                                show: true,
                                title: '用户性别与其微博数量比较情况'
                            },
                            restore: {
                                show: true
                            },
                            dataView: {
                                show: true
                            },
                            magicType: {
                                type: ['line', 'bar', 'stack', 'tiled']
                            }
                        }
                    },
                    legend: {
                        data:function(){
                            var list = [];
                            for( var i = 0; i < data.length; i++){
                                for(var index in data[i]){
                                    list.push(index)
                                }
                            }
                            return list;
                        }()
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : labels
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : function(){
                        var list = [];
                        for(var i = 0; i < data.length; i++){
                            var obj = new Object();
                            $.each(data[i], function(index, value){
                                obj.name = index;
                                obj.type = 'bar';
                                obj.data = [];
                                for(var j = 0; j < labels.length; j++){
                                    $.each(value, function(x, y){
                                        if(x === labels[j]){
                                            obj.data.push(y);
                                        }
                                    });
                                }
                            });
                            list.push(obj);
                            obj = null;
                        }
                        return list;
                    }()
                };

                ec.setOption(option);
            }
        });
    });

    $('#gender-follow-btn').click(function(){
        removeDivContent();
        var ec = echarts.init(document.getElementById('charts-box'),'vintage');
        ec.showLoading();

        $.ajax({
            url: '/gender_follow_count/',
            type: 'post',
            success: function(response){
                data = JSON.parse(response);
                ec.hideLoading();
                var labels = ['0-200', '200-400', '400-600', '600-800', '800-1000', '1000以上'];
                var option = {
                    title : {
                        text: '北京理工大学珠海学院\n用户性别与其关注数量比较情况',
                        x:'left'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    toolbox:{
                        show: true,
                        orient: 'vertical',
                        feature: {
                            saveAsImage: {
                                show: true,
                                title: '用户性别与其关注数量比较情况'
                            },
                            restore: {
                                show: true
                            },
                            dataView: {
                                show: true
                            },
                            magicType: {
                                type: ['line', 'bar', 'stack', 'tiled']
                            }
                        }
                    },
                    legend: {
                        data:function(){
                            var list = [];
                            for( var i = 0; i < data.length; i++){
                                for(var index in data[i]){
                                    list.push(index)
                                }
                            }
                            return list;
                        }()
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : labels
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : function(){
                        var list = [];
                        for(var i = 0; i < data.length; i++){
                            var obj = new Object();
                            $.each(data[i], function(index, value){
                                obj.name = index;
                                obj.type = 'line';
                                obj.data = [];
                                for(var j = 0; j < labels.length; j++){
                                    $.each(value, function(x, y){
                                        if(x === labels[j]){
                                            obj.data.push(y);
                                        }
                                    });
                                }
                            });
                            list.push(obj);
                            obj = null;
                        }
                        return list;
                    }()
                };

                ec.setOption(option);
            }
        });
    });


    $('#gender-fans-btn').click(function(){
        removeDivContent();
        var ec = echarts.init(document.getElementById('charts-box'), 'vintage');
        ec.showLoading();

        $.ajax({
            url: '/gender_fans_count/',
            type: 'post',
            success: function(response){
                data = JSON.parse(response);
                ec.hideLoading();
                var labels = ['0-500', '500-1000', '1000-3000', '3000-5000', '5000-10000', '10000以上'];
                var option = {
                    title : {
                        text: '北京理工大学珠海学院\n用户性别与其粉丝数量比较情况',
                        x:'left'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    toolbox:{
                        show: true,
                        orient: 'vertical',
                        feature: {
                            saveAsImage: {
                                show: true,
                                title: '用户性别与其粉丝数量比较情况'
                            },
                            restore: {
                                show: true
                            },
                            dataView: {
                                show: true
                            },
                            magicType: {
                                type: ['line', 'bar', 'stack', 'tiled']
                            }
                        }
                    },
                    legend: {
                        data:function(){
                            var list = [];
                            for( var i = 0; i < data.length; i++){
                                for(var index in data[i]){
                                    list.push(index)
                                }
                            }
                            return list;
                        }()
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : labels
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : function(){
                        var list = [];
                        for(var i = 0; i < data.length; i++){
                            var obj = new Object();
                            $.each(data[i], function(index, value){
                                obj.name = index;
                                obj.type = 'bar';
                                obj.data = [];
                                for(var j = 0; j < labels.length; j++){
                                    $.each(value, function(x, y){
                                        if(x === labels[j]){
                                            obj.data.push(y);
                                        }
                                    });
                                }
                            });
                            list.push(obj);
                            obj = null;
                        }
                        return list;
                    }()
                };

                ec.setOption(option);
            }
        });
    });

    $('#client-compare').click(function(){
        removeDivContent();
        var ec = echarts.init(document.getElementById('charts-box'));
        ec.showLoading();

        $.ajax({
            url: '/client_compare/',
            type: 'post',
            success: function(response){
                data = JSON.parse(response);
                ec.hideLoading();
                console.log(data);
                var option = {
                    title: {
                        text: '北京理工大学珠海学院\n用户发布微博客户端情况',
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params) {
                            var tar = params[0];
                            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type : 'category',
                        splitLine: {show:false},
                        data : function(){
                            var list = [];
                            $.each(data, function(index, value){
                                if( index=== '总数'){
                                    list.unshift(index);
                                }else{
                                    list.push(index);
                                }
                            });
                            return list;
                        }()
                    },
                    yAxis: {
                        type : 'value'
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            stack:  '总量',
                            itemStyle: {
                                normal: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)'
                                },
                                emphasis: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)'
                                }
                            },
                            data: function(){
                                var list = [];
                                sum = parseInt(data['总数']);
                                f = 0;
                                $.each(data, function(index, value){
                                    if(index === '总数'){
                                        list.unshift(0);
                                    }else{
                                       f = sum - parseInt(value);
                                       list.push(f);
                                    }
                                    sum = f;
                                    console.log(f);
                                });

                                return list;
                            }()
                        },
                        {
                            name: '客户端类型',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            data:function(){
                                var list = [];
                                $.each(data, function(index, value){
                                    if( index === '总数'){
                                        list.unshift(parseInt(value));
                                    }else{
                                        list.push(parseInt(value));
                                    }
                                });
                                return list;
                            }()
                        }
                    ]
                };

                ec.setOption(option);

            }
        });
    });



    //微博原创与转发对比
    $('#weibo-compare').click(function(){
        removeDivContent();
        var ec = echarts.init(document.getElementById('charts-box'));
        ec.showLoading();

        $.ajax({
            url: '/weibo_compare/',
            type: 'post',
            success: function(response){
                data = JSON.parse(response);
                ec.hideLoading();
                data = JSON.parse(response);
                console.log(JSON.parse(response));
                var option = {
                    title:{
                        text: '北京理工大学珠海学院\n微博类型比例',
                        subtext: '其各自发布微博客户端占比'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    series: [
                        {
                            name:'微博类型',
                            type:'pie',
                            selectedMode: 'single',
                            radius: [0, '40%'],

                            label: {
                                normal: {
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: function(){
                                var list = [];
                                for(var i = 0; i < data.length; i++){
                                    $.each(data[i], function(n, v){
                                        var obj = new Object();
                                        obj.name = n;
                                        obj.value = parseInt(v[0]);
                                        list.push(obj);
                                        obj = null;
                                    });
                                } 
                                return list;
                            }()
                        },
                        {
                            name:'发布客户端类型',
                            type:'pie',
                            radius: ['55%', '75%'],
                            data: function(){
                                var list = [];
                                for(var i = 0; i < data.length; i++){
                                    $.each(data[i], function(n, client){
                                        $.each(client[1], function(client_name, num){
                                            var obj = new Object();
                                            obj.name = client_name;
                                            obj.value = parseInt(num);
                                            list.push(obj);
                                            obj = null;
                                        });
                                    });
                                }
                                console.log(list)
                                return list; 
                            }()
                        }
                    ]
                };
                ec.setOption(option);
            }
        });

    });

    //Time scatter
    $('#day-time').click(function(){
        removeDivContent();
        var ec = echarts.init(document.getElementById('charts-box'));
        ec.showLoading();

        $.ajax({
            url: '/day_time/',
            type: 'post',
            success: function(response){
                data = JSON.parse(response);
                ec.hideLoading();
                for( var j =0 ; j < 10; j++){
                    //new Date(data[j][0].replace(/-/g, "/"))
                    console.log(new Date(data[j][1]));
                }
                var option = {
                    title : {
                        text: '男性女性身高体重分布',
                        subtext: '抽样调查来自: Heinz  2003'
                    },
                    tooltip : {
                        trigger: 'axis',
                        showDelay : 0,
                        axisPointer:{
                            show: true,
                            type : 'cross',
                            lineStyle: {
                                type : 'dashed',
                                width : 1
                            }
                        }
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataZoom : {show: true},
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    xAxis : [
                        {
                            type : 'time',
                            scale:true,
                        }
                    ],
                    yAxis : [
                        {
                            type : 'time',
                            scale:true,
                        }
                    ],
                    series : [
                        {
                            name:'test',
                            type:'scatter',
                            data: data,
                        }
                    ]
                };
                    

                ec.setOption(option);
            }
        });
    });
    
    $('#weibo-update').click(function(){
        removeDivContent();
        var ec = echarts.init(document.getElementById('charts-box'));
        ec.showLoading();

        $.ajax({
            url: '/weibo_update/',
            type: 'post',
            success: function(response){
                data = JSON.parse(response);
                ec.hideLoading();
                days = ['周一','周二','周三','周四','周五','周六','周日'];
                var option = {
                    title: {
                        text: '北京理工大学珠海学院\n每日微博量'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox:{
                        show: true,
                        orient: 'vertical',
                        feature: {
                            saveAsImage: {
                                show: true,
                            },
                            restore: {
                                show: true
                            },
                            dataView: {
                                show: true
                            },
                            magicType: {
                                type: ['line', 'bar']
                            }
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: days
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        name: '微博量',
                        type: 'line',
                        data: function(){
                            var list = [];
                            for(var i = 0; i < days.length; i++){
                                list.push(parseInt(data[days[i]]));
                            }
                            return list;
                        }()
                    }]
                };
                ec.setOption(option);
            }
        });
    });
    /*age*/
    $('#gender-age-distribute').click(function(){
        removeDivContent();
        var ec = echarts.init(document.getElementById('charts-box'));
        ec.showLoading();

        option = {
    title : {
        text: '微博用户年龄层分布',
        x:'left'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
     legend: {
        x : 'center',
        y : 'bottom',
        data:['00s','90s','80s','70s','aother']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true,
                type: ['pie', 'funnel']
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'半径模式',
            type:'pie',
            radius : [15, 130],
            center : ['25%', 200],
            roseType : 'radius',
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            lableLine: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            data:[
                {value:56, name:'00s'},
                {value:621, name:'90s'},
                {value:98, name:'80s'},
                {value:5, name:'70s'},
                {value:604, name:'aother'}
            ]
        },
        {
            name:'面积模式',
            type:'pie',
            radius : [10, 150],
            center : ['75%', 200],
            roseType : 'area',
            data:[
                {value:56, name:'00s'},
                {value:621, name:'90s'},
                {value:98, name:'80s'},
                {value:5, name:'70s'},
                {value:604, name:'aother'}
            ]
        }
    ]
};

        ec.hideLoading();
        ec.setOption(option);
       /* $.ajax({
            url: '/age_distribute/',
            type: 'post',
            success: function(response){


            }
        });*/
    });
}());