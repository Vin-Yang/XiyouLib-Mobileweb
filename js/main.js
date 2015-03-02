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
    //用户类型
    var readerType;
    var isFinished;
    /*请求用户信息*/
    var apiName = 'info';
    var data = {"session": Session};
    user().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var Name = returnData.Detail.Name;
            var username = returnData.Detail.ID;
            var department = returnData.Detail.Department;
            readerType = returnData.Detail.ReaderType;
            var html = '';
            html += department + ' ' + Name;
            $('.name').append(html).attr('data-username', username);
        } else {
            alert('亲，不好意思，您的登录已经过期，请重新登陆!');
            window.location.href = "index.html";
        }
    });
    /*根据不同的用户类型决定不同的可借书数目*/
    //可借书总数
    var all;
    switch (readerType) {
        case '科生':
            all = 15;
            break;
        case '老师':
            all = 20;
            break;
        default :
            all = 15;
    }
    /*请求借书信息*/
    apiName = 'rent';

    user().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var html = '';
            var borrowingInfoHtml = '';
            //已借图书统计
            var alreadyBorrow = 0;
            //剩余可借图书统计
            var surplusBorrow = 0;
            //续借图书统计
            var reBorrow = 0;
            //超期统计
            var exceedBorrow = 0;

            var rentInfo = returnData.Detail;
            if (rentInfo == null || rentInfo == '' || rentInfo == undefined || rentInfo == 'NO_RECORD') {
                html += '亲，赶快借几本书看看吧，再不借你爸妈要生气了！';
            } else {
                $.each(rentInfo, function (index, value) {
                    alreadyBorrow++;
                    switch (value.State) {
                        case '本馆续借':
                            reBorrow++;
                            break;
                        case '过期暂停':
                            exceedBorrow++;
                            break;
                    }
                    if (value.CanRenew) {
                        html += '<div class="y_books"> ' +
                            '<div class="y_books-header"> ' +
                            '<p> ' +
                            /*'<a href="moreInfo.html?barcode=' + value.Barcode + '&session=' + Session + '" data-rel="external" data-ajax="false">图书详情</a> ' +*/
                            '</p> ' +
                            '</div> ' +
                            '<div class="y_books-body"> ' +
                            '<p><label class="blue">《' + '<a href="moreInfo.html?barcode=' + value.Barcode + '&session=' + Session + '" data-rel="external" data-ajax="false">' + value.Title + '</a> ' + '》</label></p> ' +
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
                            '<p><label class="blue">《' + '<a href="moreInfo.html?barcode=' + value.Barcode + '&session=' + Session + '" data-rel="external" data-ajax="false">' + value.Title + '</a> ' + '》</label></p>  ' +
                            /*'<p><label class="blue">《' + value.Title + '》</label></p>  ' +*/
                            '<p>到期时间:<label class="y_books-body-deadline">' + value.Date + '</label></p>  ' +
                            '<p>状态:<label class="y_books-body-deadline">' + value.State + '</label></p> ' +
                            '</div> ' +
                            '</div>';
                    }
                });
                surplusBorrow = all - alreadyBorrow;
            }
            borrowingInfoHtml += '<div class="borrowingInfo-left">' +
                ' <p>已借图书:<label class="blue">' + alreadyBorrow + '</label>本</p> ' +
                ' <p>续借图书:<label class="red">' + reBorrow + '</label>本</p> ' +
                '</div> ' +
                '<div class="borrowingInfo-right"> ' +
                '<p>剩余可借:<label class="green">' + surplusBorrow + '</label>本</p>  ' +
                '<p>超期图书:<label class="red">' + exceedBorrow + '</label>本</p> ' +
                '</div>';
            $('.borrowingInfo').append(borrowingInfoHtml).trigger('create');
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

    /*请求收藏信息*/
    apiName = 'favorite';
    user().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var html = '';
            var rentInfo = returnData.Detail;
            if (rentInfo == null || rentInfo == '' || rentInfo == undefined || rentInfo == 'NO_RECORD') {
                html += '亲，你这家伙太懒了，赶快去收藏几本图书去！';
            } else {
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
            }
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
            var html = '';
            var rentInfo = returnData.Detail;
            if (rentInfo == null || rentInfo == '' || rentInfo == undefined || rentInfo == 'NO_RECORD') {
                html += '我擦，你这货竟然连一本书都没借过！';
            } else {
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
            }
            $('.historyInfo').append(html).trigger('create');//加载框架的样式
        } else {
            alert('亲，不好意思，您的登录已经过期，请重新登陆!');
            window.location.href = "index.html";
        }

    });

    /*搜索图书信息*/
    isFinished = true;
    $('.searchButton').on("click", "input", function () {
        var temp0 = $('#searchBox').val().trim();
        if (temp0 != '') {
//            $('.bookList').hide();
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
                                /*if (temp) {
                                 html += '<div class="bar"> ' +
                                 '<div class="fl"> ' +
                                 '<label>第<span class="currentPage blue">0</span>页</label>/' +
                                 '<label>共<span class="pages blue">0</span>页</label> ' +
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
                                 //清除搜索内容
                                 $('#remove').on("click", "a", function () {
                                 $('.searchInfo').prevUntil().remove();
                                 $('.searchInfo').empty().append('亲，您还没有搜索内容哦！');
                                 $('.bookList').show();
                                 });
                                 html = '';*/
                                html = '亲，您这次神马都没有搜到哦，换个关键词试试呗！';
                                temp.append(html).trigger('create');
                            } else {
                                $('.bookList').hide();
                                var countPage;
                                var pages;
                                var temp = $('.searchInfo');
                                if (temp) {
                                    countPage = returnData.Detail.CurrentPage;
                                    pages = returnData.Detail.Pages;
                                    html += '<div class="bar"> ' +
                                        '<div class="fl"> ' +
                                        '<label>第<span class="currentPage blue">' + countPage + '</span>页</label>/' +
                                        '<label>共<span class="pages blue">' + returnData.Detail.Pages + '</span>页</label> ' +
                                        '</div> ' +
                                        '<span class="remove"><a>清除结果</a></span>' +
                                        '<div class="fr"> ' +
                                        '<a class="start">首页 </a>' +
                                        '<a class="before">上一页 </a>' +
                                        '<a class="next">下一页 </a>' +
                                        '</div> ' +
                                        '</div>';
                                }
                                temp.before(html).trigger('create');//在searchInfo之前插入内容
                                temp.after(html).trigger('create');//在searchInfo之后插入内容
                                //绑定搜索结果
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
                                //清除搜索内容
                                $('.remove').on("click", "a", function () {
                                    $('.searchInfo').prevUntil().remove();
                                    $('.searchInfo').nextUntil().eq(0).remove();
                                    $('.searchInfo').empty().append('亲，您还没有搜索内容哦！');
                                    $('.bookList').show();
                                });
                                var Page = 1;
                                var page;
                                //返回第一页
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
                                                $('.currentPage').text(countPage);
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
                                                            '<p><label class="blue">《' + '<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false" >' + value.Title + '</a> ' + '》</label></p> ' +
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
                                //下一页
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
                                                    $('.currentPage').text(countPage);
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
                                                                '<p><label class="blue">《' + '<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false" >' + value.Title + '</a> ' + '》</label></p> ' +
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
                                //上一页
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
                                                    $('.currentPage').text(countPage);
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
                                                                '<p><label class="blue">《' + '<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false" >' + value.Title + '</a> ' + '》</label></p> ' +
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


    /**排行榜**/
    apiName = 'rank';
    /*图书借阅排行榜*/
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
                        '<p><label class="blue">《' + '<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false" >' + value.Title + '</a> ' + '》</label></p> ' +
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
                        '<p><label class="blue">《' + '<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false" >' + value.Title + '</a> ' + '》</label></p> ' +
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
                        '<p><label class="blue">《' + '<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false" >' + value.Title + '</a> ' + '》</label></p> ' + /*'<p><label class="blue">《' + value.Title + '》</label></p> ' +*/
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
