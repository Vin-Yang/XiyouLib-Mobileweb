/**
 * Created by 文鹏 on 2014/7/26.
 */

$(function () {
    var host = "http://localhost:18000";
    $.ajaxSetup({
        type: "GET",
        dataType: "jsonp",
        jsonp: "callback"
    });
    $('#submit').on("click", function () {
        if (valid()) {
            var data = $("form#loginForm").serialize();
            var api = "/user/login";
            useLogin(data, api, function (returnData) {
                if (returnData.Result) {
                    var Session = returnData.Detail;
                    window.location.href = "main.html?session=" + Session;
                }
                else {
                    alert('用户名或密码错误！');
                }
            });
        }
    });
    function useLogin(data, api, callback) {
        $.ajax({
            url: host + api,
            data: data,
            success: function (res, status, xhr) {
                callback(res);
            }
        });
    }

    function valid() {
        if ($('#username').val() == '') {
            alert("用户名不能为空!");
            return false;
        }
        else if ($('#password').val() == '') {
            alert("密码不能为空!");
            return false;
        }
        else {
            return true;
        }
    }

    /*提交表单*/
    /*
     $('#submit').on("click ",function(){
     if(valid()){
     console.log("获取的用户名为:"+$('#username').val()+"密码为:"+$('#password').val());
     $.ajax({
     type:"GET",
     url:"http://localhost:18000/user/login",
     data:$("form#loginForm").serialize(),
     dataType:"jsonp",
     jsonp:"callback",
     success:function(res,status,xhr){
     if(res.Result){
     var Session=res.Detail;
     window.location.href="main.html?session="+Session;
     }
     else{
     alert('用户名或密码错误！')
     }
     }
     });
     }
     });*/
});
