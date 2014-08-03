/**
 * Created by 文鹏 on 2014/7/26.
 */

$(function () {
    isRemember();
    /*点击登录按钮时触发*/
    $('.submit').on("click", function () {
        if ($('#username').val().trim() != '' && $('#password').val().trim() != '') {
            var data = $("form#loginForm").serialize().trim();
            var apiName = 'login';
            user().Api(apiName, data, function (returnData) {
                saveUserInfo();
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

    /**cookie相关的函数**/
    /*判断是否记住了密码*/
    function isRemember() {
        if ($.cookie("rmbUser") == "true") {
            $("#loginkeeping").attr("checked", true);
            $("#username").val($.cookie("username"));
            $("#password").val($.cookie("password"));
        }
    }

    /*看是否记住密码若记住则保存*/
    function saveUserInfo() {
        if ($("#loginkeeping").is(':checked')) {
            var username = $("#username").val();
            var password = $("#password").val();
            $.cookie("rmbUser", "true", { expires: 7 }); // 存储一个带7天期限的 cookie
            $.cookie("username", username, { expires: 7 }); // 存储一个带7天期限的 cookie
            $.cookie("password", password, { expires: 7 }); // 存储一个带7天期限的 cookie
        }
        else {
            $.cookie("rmbUser", "false", { expires: -1 });
            $.cookie("username", '', { expires: -1 });
            $.cookie("password", '', { expires: -1 });
        }
    }
});
