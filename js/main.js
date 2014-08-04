/**
 * Created by 文鹏 on 2014/7/21.
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
var Session = getUrlParam("session");
if (Session == '' || Session == null) {
    window.location.href = "index.html";
}
$(function () {
    /*请求用户信息*/
    var apiName = 'info';
    var data = {"session": Session};
    user().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var Name = returnData.Detail.Name;
            var username = returnData.Detail.ID;
            var department = returnData.Detail.Department;
            var html = '';
            html += department + ' ' + Name;
            $('.name').append(html).attr('data-username', username);
        } else {
            alert('亲，不好意思，您的登录已经过期，请重新登陆!');
            window.location.href = "index.html";
        }
    });

    /*请求借书信息*/
    apiName = 'rent';
    user().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var rentInfo = returnData.Detail;
            var html = '';
            $.each(rentInfo, function (index, value) {
                if (value.CanRenew) {
                    html += '<div class="y_books"> ' +
                        '<div class="y_books-header"> ' +
                        '<p> ' +
                        /*'<a href="moreInfo.html?barcode=' + value.Barcode + '&session=' + Session + '" data-rel="external" data-ajax="false">图书详情</a> ' +*/
                        '</p> ' +
                        '</div> ' +
                        '<div class="y_books-body"> ' +
                        '<p><label class="blue">《' + '<a href="moreInfo.html?barcode=' + value.Barcode + '&session=' + Session + '" data-rel="external" data-ajax="false">'+ value.Title+'</a> ' + '》</label></p> ' +
                        /*'<p><label class="blue">《' + value.Title + '》</label></p> ' +*/
                        '<p>到期时间:<label class="y_books-body-deadline">' + value.Date + '</label></p> ' +
                        '<p class="y_books-body-borrow" data-barcode="' + value.Barcode + '" data-department_id="' + value.Department_id + '" data-library_id="' + value.Library_id + '"> ' +
                        '<a data-role="button" class="y_books-body-borrow-submit" data-inline="true">我要续借</a> ' +
                        '</p> ' +
                        '</div> ' +
                        '</div>';
                } else {
                    html += '<div class="y_books"> ' +
                        '<div class="y_books-header"> ' +
                        '<p> ' +
                        /*'<a href="moreInfo.html?barcode=' + value.Barcode + '&session=' + Session + '" data-rel="external" data-ajax="false">图书详情</a> ' +*/
                        '</p> ' +
                        '</div> ' +
                        '<div class="y_books-body"> ' +
                        '<p><label class="blue">《' + '<a href="moreInfo.html?barcode=' + value.Barcode + '&session=' + Session + '" data-rel="external" data-ajax="false">'+ value.Title+'</a> ' + '》</label></p>  ' +
                        /*'<p><label class="blue">《' + value.Title + '》</label></p>  ' +*/
                        '<p>到期时间:<label class="y_books-body-deadline">' + value.Date + '</label></p>  ' +
                        '<p>状态:<label class="y_books-body-deadline">' + value.State + '</label></p> ' +
                        '</div> ' +
                        '</div>';
                }
            });
            $('.bookInfo').append(html).trigger('create');
            var temp = [];
            var tempElement = $('.y_books-body-borrow');
            /*统计需要续借的书的必要信息*/
            $.each(tempElement, function (index, value) {
                temp[index] = {
                    'session': Session,
                    'barcode': $(value).attr('data-barcode'),
                    'department_id': $(value).attr('data-department_id'),
                    'library_id': $(value).attr('data-library_id')
                };
            });
            /*绑定续借事件*/
            $.each(tempElement, function (index, value) {
                $(this).on("click", "a", function () {
                    apiName = 'renew';
                    var data = temp[index];
                    user().Api(apiName, data, function (returnData) {
                        if (returnData.Result) {
                            console.log(returnData.Detail);
                            $(value).parent().find('p').eq(1).replaceWith('<p>到期时间:<label class="y_books-body-deadline">' + returnData.Detail + '</label></p>');
                            $(value).replaceWith('<p>状态:<label class="y_books-body-deadline">本馆续借</label></p>');
                        } else {
                            alert('亲，不好意思，服务器实在是太忙了！');
                        }
                    });
                });
            });
        } else {
            alert('亲，不好意思，您的登录已经过期，请重新登陆!');
            window.location.href = "index.html";
        }
    });

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
                            temp.before(html).trigger('create');//在searchInfo之前插入内容
                            $('#remove').on("click", "a", function () {
                                $('.searchInfo').prevUntil().remove();
                                $('.searchInfo').empty().append('亲，您还没有搜索内容哦！');
                                $('.bookList').show();
                            });
                        }
                        html = '';
                        $.each(searchInfo, function (index, value) {
                                html += '<div class="y_books"> ' +
                                    '<div class="y_books-header"> ' +
                                    '<p> ' +
                                    /*'<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false" >图书详情</a> ' +*/
                                    '</p> ' +
                                    '</div> ' +
                                    '<div class="y_books-body"> ' +
                                    '<p><label class="blue">《' + '<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false" >' + value.Title + '</a> ' + '》</label></p> ' +
                                    /*'<p><label class="blue">《' + value.Title + '》</label></p> ' +*/
                                    '</div> ' +
                                    '</div>';

                            }
                        );
                        temp.append(html).trigger('create');
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

    /*请求收藏信息*/
    apiName = 'favorite';
    user().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var rentInfo = returnData.Detail;
            var html = '';
            var temp1 = [];
            $.each(rentInfo, function (index, value) {
                temp1[index] = value.ID;
                html += '<div class="y_books"> ' +
                    '<div class="y_books-header"> ' +
                    '<p> ' +
                    /*'<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false">图书详情</a> ' +*/
                    '</p> ' +
                    '</div> ' +
                    '<div class="y_books-body"> ' +
                    '<p>' +
                    '<label class="blue">《' + '<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false">' + value.Title + '</a> ' + '》</label>' +
                    /*'<label class="blue">《' + value.Title + '》</label>' +*/
                    '</p>  ' +
                    '<p>图书馆索书号:<label>' + value.Sort + '</label></p>  ' +
                    '<p>作者:<label>' + value.Author + '</label></p>  ' +
                    '<p class="m_favourite">' +
                    '<a href="" data-role="button" data-icon="star" data-inline="true" class="content_btn">从收藏夹移除</a>' +
                    '</p> ' +
                    '</div> ' +
                    '</div>';
            });
            $('.favInfo').append(html).trigger('create');//加载框架的样式

            /*绑定删除收藏的图书事件*/
            var name = $('.name').attr('data-username');
            $.each($('.m_favourite'), function (index, value) {
                $(this).on("click", "a", function () {
                    apiName = 'delFav';
                    data = {
                        session: Session,
                        username: name,
                        id: temp1[index]
                    };
                    user().Api(apiName, data, function (returnData) {
                        if (returnData.Result) {
                            switch (returnData.Detail) {
                                case 'DELETED_SUCCEED':
                                    alert('恭喜亲，删除成功！');
                                    $(value).parent().parent().remove();
                                    break;
                                case 'DELETED_FAILED':
                                    alert('亲，删除失败了！');
                                    break;
                                case 'USER_NOT_LOGIN':
                                    alert('亲，你还没登录呢!');
                                    break;
                                case 'PARAM_ERROR':
                                    alert('参数错误，缺少参数！');
                                    break;
                                default :
                                    alert('亲，服务器实在是太忙了！');
                            }
                        } else {
                            alert('亲，服务器实在是太忙了！');
                        }
                    });
                });
            });
        } else {
            alert('亲，不好意思，您的登录已经过期，请重新登陆!');
            window.location.href = "index.html";
        }

    });

    /*请求借阅历史信息*/
    apiName = 'history';
    user().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var rentInfo = returnData.Detail;
            var html = '';
            $.each(rentInfo, function (index, value) {
                html += '<div class="y_books"> ' +
                    '<div class="y_books-header"> ' +
                    '<p> ' +
                    /*'<a href="moreInfo.html?barcode=' + value.Barcode + '&session=' + Session + '" data-rel="external" data-ajax="false">图书详情</a> ' +*/
                    '</p> ' +
                    '</div> ' +
                    '<div class="y_books-body"> ' +
                    '<p>' +
                    '<label class="blue">《' + '<a href="moreInfo.html?barcode=' + value.Barcode + '&session=' + Session + '" data-rel="external" data-ajax="false">' + value.Title + '</a> ' + '》</label>' +
                    /*'<label class="blue">《' + value.Title + '》</label>' +*/
                    '</p>  ' +
                    '<p>' +
                    '借书时间:<label>' + value.Date + '</label>' +
                    '</p>  ' +
                    '<p>' +
                    '操作类型:<label>' + value.Type + '</label>' +
                    '</p>  ' +
                    '</div> ' +
                    '</div>';
            });
            $('.historyInfo').append(html).trigger('create');//加载框架的样式
        } else {
            alert('亲，不好意思，您的登录已经过期，请重新登陆!');
            window.location.href = "index.html";
        }

    });
});
