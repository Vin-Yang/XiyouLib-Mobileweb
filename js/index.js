/**
 * Created by 文鹏 on 2014/7/26.
 */

$(function () {
    /*点击登录按钮时触发*/
    $('.submit').on("click tap", function () {
        if (valid()) {
            var data = $("form#loginForm").serialize();
            var apiName = 'login';
            user().Api(apiName, data, function (returnData) {
                if (returnData.Result) {
                    var Session = returnData.Detail;
                    window.location.href = "main.html?session=" + Session;
                }
            });
        }else{
            alert('亲，账号或密码错了哦！');
        }
    });
    function valid() {
        if ($('#username').val() == '') {
            alert("用户名不能为空!");
            return false;
        } else if ($('#password').val() == '') {
            alert("密码不能为空!");
            return false;
        } else {
            return true;
        }
    }
});
