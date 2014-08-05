/**
 * Created by 文鹏 on 2014/7/26.
 */

$(function () {
    isRemember();
    var apiName;
    var data;
    /*点击登录按钮时触发*/
    $('.submit').on("click", function () {
        if ($('#username').val().trim() != '' && $('#password').val().trim() != '') {
            data = $("form#loginForm").serialize().trim();
            apiName = 'login';
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

    /*搜索图书信息*/
    $('.searchButton').on("click", "input", function () {
        var temp = $('#searchBox').val().trim();
        if (temp != '') {
            $('.bookList').hide();
            $('.searchInfo').prevUntil().remove();
            $('.searchInfo').empty();
            apiName = 'search';
            data = {
                keyword: temp
            };
            book().Api(apiName, data, function (returnData) {
                    if (returnData.Result) {
                        var searchInfo = returnData.Detail.BookData;
                        var html = '';
                        var rentInfo = returnData.Detail;
                        if (rentInfo == null || rentInfo == '' || rentInfo == undefined || rentInfo == 'NO_RECORD') {
                            var temp = $('.searchInfo');
                            if (temp) {
                                html += '<div class="bar"> ' +
                                    '<div class="fl"> ' +
                                    '<label>第<span class="blue" id="currentPage">0</span>页</label>/' +
                                    '<label>共<span class="blue" id="pages">0</span>页</label> ' +
                                    '</div> ' +
                                    '<span id="remove"><a>清除结果</a></span>' +
                                    '<div class="fr"> ' +
                                    '<a class="start">首页 </a>' +
                                    '<a class="next">下一页 </a>' +
                                    '<a class="before">上一页 </a>' +
                                    '</div> ' +
                                    '</div>';
                            }
                            temp.before(html).trigger('create');//在searchInfo之前插入内容
                            $('#remove').on("click", "a", function () {
                                $('.searchInfo').prevUntil().remove();
                                $('.searchInfo').empty().append('亲，您还没有搜索内容哦！');
                                $('.bookList').show();
                            });
                            html='';
                            html='亲，您这次神马都没有搜到哦，换个关键词试试呗！';
                            temp.append(html).trigger('create');
                        } else {
                            var temp = $('.searchInfo');
                            if (temp) {
                                html += '<div class="bar"> ' +
                                    '<div class="fl"> ' +
                                    '<label>第<span class="blue" id="currentPage">' + returnData.Detail.CurrentPage + '</span>页</label>/' +
                                    '<label>共<span class="blue" id="pages">' + returnData.Detail.Pages + '</span>页</label> ' +
                                    '</div> ' +
                                    '<span id="remove"><a>清除结果</a></span>' +
                                    '<div class="fr"> ' +
                                    '<a class="start">首页 </a>' +
                                    '<a class="next">下一页 </a>' +
                                    '<a class="before">上一页 </a>' +
                                    '</div> ' +
                                    '</div>';
                            }
                            temp.before(html).trigger('create');//在searchInfo之前插入内容
                            $('#remove').on("click", "a", function () {
                                $('.searchInfo').prevUntil().remove();
                                $('.searchInfo').empty().append('亲，您还没有搜索内容哦！');
                                $('.bookList').show();
                            });
                            html = '';
                            $.each(searchInfo, function (index, value) {
                                    html += '<div class="y_books"> ' +
                                        '<div class="y_books-header"> ' +
                                        '<p> ' +
                                        /*'<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false" >图书详情</a> ' +*/
                                        '</p> ' +
                                        '</div> ' +
                                        '<div class="y_books-body"> ' +
                                        '<p><label class="blue">《' + '<a href="moreInfo.html?id=' + value.ID + '" data-rel="external" data-ajax="false" >' + value.Title + '</a> ' + '》</label></p> ' +
                                        /*'<p><label class="blue">《' + value.Title + '》</label></p> ' +*/
                                        '</div> ' +
                                        '</div>';

                                }
                            );
                            temp.append(html).trigger('create');
                        }

                    } else {
                        alert('亲，不好意思，您的登录已经过期，请重新登陆!');
                        window.location.href = "index.html";
                    }
                }
            );
        }
        else {
            alert('关键字不能为空哦！');
        }
    });
});
