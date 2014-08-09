/**
 * Created by 文鹏 on 2014/7/26.
 */

$(function () {
    isRemember();
    var apiName;
    var data;
    var isFinished = true;
    /*点击登录按钮时触发*/
    $('.submit').on("click", function () {
        if ($('#username').val().trim() != '' && $('#password').val().trim() != '') {
            data = $("form#loginForm").serialize().trim();
            apiName = 'login';
            if (isFinished) {
                isFinished = false;
                user().Api(apiName, data, function (returnData) {
                    saveUserInfo();
                    if (returnData.Result) {
                        isFinished = true;
                        var Session = returnData.Detail;
                        window.location.href = "main.html?session=" + Session;
                    } else {
                        alert('亲，账号或密码错了哦！');
                        isFinished = true;
                    }
                });
            } else {
                alert('亲，您的小爪子点击的实在是太快了哦！');
            }

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
    isFinished = true;
    $('.searchButton').on("click", "input", function () {
        var temp0 = $('#searchBox').val().trim();
        if (temp0 != '') {
            $('.bookList').hide();
            $('.searchInfo').prevUntil().remove();
            $('.searchInfo').empty();
            apiName = 'search';
            data = {
                keyword: temp0
            };
            if (isFinished) {
                isFinished = false;
                book().Api(apiName, data, function (returnData) {
                        if (returnData.Result) {
                            isFinished = true;
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
                                html = '';
                                html = '亲，您这次神马都没有搜到哦，换个关键词试试呗！';
                                temp.append(html).trigger('create');
                            } else {
                                var countPage;
                                var pages;
                                var temp = $('.searchInfo');
                                if (temp) {
                                    countPage = returnData.Detail.CurrentPage;
                                    pages = returnData.Detail.Pages;
                                    html += '<div class="bar"> ' +
                                        '<div class="fl"> ' +
                                        '<label>第<span class="blue" id="currentPage">' + countPage + '</span>页</label>/' +
                                        '<label>共<span class="blue" id="pages">' + returnData.Detail.Pages + '</span>页</label> ' +
                                        '</div> ' +
                                        '<span id="remove"><a>清除结果</a></span>' +
                                        '<div class="fr"> ' +
                                        '<a class="start">首页 </a>' +
                                        '<a class="before">上一页 </a>' +
                                        '<a class="next">下一页 </a>' +
                                        '</div> ' +
                                        '</div>';
                                }
                                temp.before(html).trigger('create');//在searchInfo之前插入内容
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
                                $('#remove').on("click", "a", function () {
                                    $('.searchInfo').prevUntil().remove();
                                    $('.searchInfo').empty().append('亲，您还没有搜索内容哦！');
                                    $('.bookList').show();
                                });
                                var Page = 1;
                                var page;
                                isFinished = true;
                                $('.start').on("click", function () {
                                    Page = 1;
                                    apiName = 'search';
                                    page = Page;
                                    data = {
                                        keyword: temp0,
                                        page: page
                                    };
                                    if (isFinished) {
                                        isFinished = false;
                                        book().Api(apiName, data, function (returnData) {
                                            if (returnData.Result) {
                                                isFinished = true;
                                                countPage = returnData.Detail.CurrentPage;
                                                $('#currentPage').text(countPage);
                                                var searchInfo = returnData.Detail.BookData;
                                                var html = '';
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
                                                $('.searchInfo').empty().append(html).trigger('create');
                                            } else {
                                                alert('亲，不好意思,服务器实在是太忙了！');
                                                window.location.reload();
                                            }

                                        });

                                    } else {
                                        alert('亲，你的小爪子，点击的太快了，歇会哦！');
                                    }

                                });
                                isFinished = true;
                                $('.next').on("click", function () {
                                    apiName = 'search';
                                    page = Page + 1;
                                    if (page > pages) {
                                        page = Page - 1;
                                        alert('亲，这已经是最后一页了，没有下一页了呢！');
                                    } else {
                                        data = {
                                            keyword: temp0,
                                            page: page
                                        };
                                        if (isFinished) {
                                            isFinished = false;
                                            book().Api(apiName, data, function (returnData) {
                                                if (returnData.Result) {
                                                    isFinished = true;
                                                    countPage = returnData.Detail.CurrentPage;
                                                    $('#currentPage').text(countPage);
                                                    Page++;
                                                    var searchInfo = returnData.Detail.BookData;
                                                    var html = '';
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
                                                    $('.searchInfo').empty().append(html).trigger('create');
                                                } else {
                                                    alert('亲，不好意思,服务器实在是太忙了！');
                                                    window.location.reload();
                                                }

                                            });
                                        } else {
                                            alert('亲，你的小爪子点的太快了，歇会吧！');
                                        }

                                    }

                                });
                                isFinished = true;
                                $('.before').on("click", function () {
                                    apiName = 'search';
                                    page = Page - 1;
                                    if (page < 1) {
                                        page = Page + 1;
                                        alert('亲，已经是第一页了，没有上一页哦！');
                                    } else {
                                        data = {
                                            keyword: temp0,
                                            page: page
                                        };
                                        if (isFinished) {
                                            isFinished = false;
                                            book().Api(apiName, data, function (returnData) {
                                                if (returnData.Result) {
                                                    isFinished = true;
                                                    countPage = returnData.Detail.CurrentPage;
                                                    $('#currentPage').text(countPage);
                                                    Page--;
                                                    var searchInfo = returnData.Detail.BookData;
                                                    var html = '';
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
                                                    $('.searchInfo').empty().append(html).trigger('create');
                                                } else {
                                                    alert('亲，不好意思,服务器实在是太忙了！');
                                                    window.location.reload();
                                                }

                                            });

                                        } else {
                                            alert('亲，你的小爪子点击的太快了，歇会哦！');
                                        }

                                    }
                                });
                            }

                        } else {
                            alert('亲，不好意思,服务器实在是太忙了！');
                            window.location.reload();
                        }
                    }
                );
            } else {
                alert('亲，您的小爪子点击的实在是太快了哦！');
            }

        }
        else {
            alert('关键字不能为空哦！');
        }
    });

    /*图书借阅排行榜*/
    apiName = 'rank';
    data = {
        type: '1',
        size: 10
    };
    book().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var searchInfo = returnData.Detail;
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
                        '<p class="f14">排名:<span class="blue">' + value.Rank + '</span>     次数:<span class="blue">' + value.BorNum + '</span>     分类号:<span class="blue">' + value.Sort + '</span></p> ' +
                        '</div> ' +
                        '</div>';
                }
            );
            $('.borrowList').append(html).trigger('create');

        } else {
            alert('亲，服务器实在是太忙了！');
            window.location.reload();
        }
    });

    /*图书收藏排行榜*/
    apiName = 'rank';
    data = {
        type: '3',
        size: 10
    };
    book().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var searchInfo = returnData.Detail;
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
                        '<p class="f14">排名:<span class="blue">' + value.Rank + '</span>     次数:<span class="blue">' + value.BorNum + '</span></p> ' +
                        '</div> ' +
                        '</div>';
                }
            );
            $('.favList').append(html).trigger('create');

        } else {
            alert('亲，服务器实在是太忙了！');
            window.location.reload();
        }
    });

    /*图书检索排行榜*/
    apiName = 'rank';
    data = {
        type: '2',
        size: 10
    };
    book().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var searchInfo = returnData.Detail;
            html = '';
            $.each(searchInfo, function (index, value) {
                    html += '<div class="y_books"> ' +
                        '<div class="y_books-header"> ' +
                        '<p> ' +
                        /*'<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false" >图书详情</a> ' +*/
                        '</p> ' +
                        '</div> ' +
                        '<div class="y_books-body"> ' +
                        '<p><label class="blue">' + value.Title + '</label></p> ' +
                        /*'<p><label class="blue">《' + value.Title + '》</label></p> ' +*/
                        '<p class="f14">排名:<span class="blue">' + value.Rank + '</span>     次数:<span class="blue">' + value.BorNum + '</span></p> ' +
                        '</div> ' +
                        '</div>';
                }
            );
            $('.searchList').append(html).trigger('create');

        } else {
            alert('亲，服务器实在是太忙了！');
            window.location.reload();
        }
    });

    /*图书查看排行榜*/
    apiName = 'rank';
    data = {
        type: '5',
        size: 10
    };
    book().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var searchInfo = returnData.Detail;
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
                        '<p class="f14">排名:<span class="blue">' + value.Rank + '</span>     次数:<span class="blue">' + value.BorNum + '</span></p> ' +
                        '</div> ' +
                        '</div>';
                }
            );
            $('.checkList').append(html).trigger('create');

        } else {
            alert('亲，服务器实在是太忙了！');
            window.location.reload();
        }
    });
});
