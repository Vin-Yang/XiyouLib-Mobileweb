/**
 * Created by 文鹏 on 2014/7/26.
 */

$(function () {
    /*点击登录按钮时触发*/
    $('.submit').on("click", function () {
        if ($('#username').val() != '' && $('#password').val() != '') {
            var data = $("form#loginForm").serialize();
            var apiName = 'login';
            user().Api(apiName, data, function (returnData) {
                if (returnData.Result) {
                    var Session = returnData.Detail;
                    window.location.href = "main.html?session=" + Session;
                } else {
                    alert('亲，账号或密码错了哦！');
                }
            });
        } else {
            alert('亲，用户名密码不能为空哦！');
        }
    });
});
