/**
 * Created by 文鹏 on 2014/7/27.
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
var Session = getUrlParam("session");
console.log(Session);
var Barcode = getUrlParam("barcode");
console.log(Barcode);
var Id = getUrlParam("id");
console.log(Id);
if (Session == '' || Session == null) {
    window.location.href = "index.html";
}
$(function () {
    $('h1').next().attr('href', 'main.html?session=' + Session);
    /*获取图书详情*/
    var apiName;
    var data;
    /*选择哪种方式去查找详情*/
    if (Id != null && Barcode == null) {
        apiName = 'detailById';
        data = Id;
    } else {
        apiName = 'detailByBarcode';
        data = Barcode;
    }
    /*请求图书详情*/
    book().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var html = '';

            /*绑定基本信息*/
            /*图书馆提供的信息*/
            var title = returnData.Detail.Title;//书名
            var sort = returnData.Detail.Sort;//图书馆索书号
            var author = returnData.Detail.Author;//作者
            var isbn = returnData.Detail.ISBN;//标准号
            var Pub = returnData.Detail.Pub;//出版社
            var id = returnData.Detail.ID;//图书馆内控制号
            var Pages = returnData.Detail.Form;//书的页数
            var Summary = returnData.Detail.Summary;//图书摘要
            var favTimes = returnData.Detail.FavTimes;//收藏次数
            var subject = returnData.Detail.Subject;//主题分类
            var total = returnData.Detail.Total;//藏书总数
            var rentTimes = returnData.Detail.RentTimes;//数
            var available = returnData.Detail.Available;//可借书数
            var browseTimes = returnData.Detail.BrowseTimes;//可借书数

            /*必须有豆瓣时可以额外提供的信息*/
            var img;//图片
            var price;//价格
            var binding;//装订
            var pubDate;//出版日期

            /*需要择优选择信息*/
            var pages;
            var summary;
            var pub;

            /*对返回的数据进行容错判断*/
            if (returnData.Detail.DoubanInfo != null) {
                /*关于图书图片的情况判定*/
                if (returnData.Detail.DoubanInfo.Images == '' || returnData.Detail.DoubanInfo.Images == undefined || returnData.Detail.DoubanInfo.Images == null) {
                    img = 'http://img3.douban.com/pics/book-default-medium.gif';
                } else {
                    img = returnData.Detail.DoubanInfo.Images.medium;
                }
                /*关于图书价格的情况判定*/
                if (returnData.Detail.DoubanInfo.Price == '' || returnData.Detail.DoubanInfo.Price == undefined || returnData.Detail.DoubanInfo.Price == null) {
                    price = '暂无';
                } else {
                    price = returnData.Detail.DoubanInfo.Price;
                }

                /*关于图书装订的情况判定*/
                if (returnData.Detail.DoubanInfo.Binding == '' || returnData.Detail.DoubanInfo.Binding == undefined || returnData.Detail.DoubanInfo.Binding == null) {
                    binding = '暂无';
                } else {
                    binding = returnData.Detail.DoubanInfo.Binding;
                }

                /*关于图书出版日期的情况判定*/
                if (returnData.Detail.DoubanInfo.PubDate == '' || returnData.Detail.DoubanInfo.PubDate == undefined || returnData.Detail.DoubanInfo.PubDate == null) {
                    pubDate = '暂无';
                } else {
                    pubDate = returnData.Detail.DoubanInfo.PubDate;
                }

                /*关于摘要的情况判定*/
                if (returnData.Detail.DoubanInfo.Subarray == '' || returnData.Detail.DoubanInfo.Subarray == undefined || returnData.Detail.DoubanInfo.Subarray == null) {
                    if (Summary != '' && Summary != undefined && Summary != null) {
                        summary = Summary;
                    } else {
                        summary = '抱歉亲，此书暂时还没有摘要呢！';
                    }
                } else {
                    summary = returnData.Detail.DoubanInfo.Summary;
                }

                /*关于书的页数情况判定*/
                if (returnData.Detail.DoubanInfo.Pages == '' || returnData.Detail.DoubanInfo.Pages == undefined || returnData.Detail.DoubanInfo.Pages == null) {
                    if (Pages != '' && Pages != undefined && Pages != null) {
                        pages = Pages;
                    } else {
                        pages = '暂无';
                    }
                } else {
                    pages = returnData.Detail.DoubanInfo.Pages;
                }

                /*关于图书出版社情况判定*/
                if (returnData.Detail.DoubanInfo.Publisher == '' || returnData.Detail.DoubanInfo.Publisher == undefined || returnData.Detail.DoubanInfo.Publisher == null) {
                    if (Pub != '' && Pub != undefined && Pub != null) {
                        pub = Pub;
                    } else {
                        pub = '暂无';
                    }
                } else {
                    pub = returnData.Detail.DoubanInfo.Publisher;
                }
            
            } else {
                img = 'http://img3.douban.com/pics/book-default-medium.gif';
                price = '暂无';
                binding = '暂无';
                pubDate = '暂无';
                if (Summary != '' && Summary != undefined && Summary != null) {
                    summary = Summary;
                } else {
                    summary = '抱歉亲，此书暂时还没有摘要呢！';
                }
                if (Pages != '' && Pages != undefined && Pages != null) {
                    pages = Pages;
                } else {
                    pages = '暂无';
                }

                if (Pub != '' && Pub != undefined && Pub != null) {
                    pub = Pub;
                } else {
                    pub = '暂无';
                }
            }
            html = '';
            html += '<div class="y_books"> ' +
                '<div class="y_books-header"> ' +
                '<p class="h20"></p> ' +
                '</div> ' +
                '<div class="y_books-body"> ' +
                '<p><img src="' + img + '" width="60px" height="60px"> ' +
                '<label class="blue">《' + title + '》</label></p>  ' +
                '<p>图书馆索书号:<label>' + sort + '</label></p>  ' +
                '<p>作者:<label>' + author + '</label></p>  ' +
                '<p>页数:<label>' + pages + '</label></p>  ' +
                '<p>价格:<label>' + price + '</label></p>  ' +
                '<p>装订:<label>' + binding + '</label></p>  ' +
                '<p>出版社:<label>' + pub + '</label></p>  ' +
                '<p>出版日期:<label>' + pubDate + '</label></p>  ' +
                '<p>标准号:<label>' + isbn + '</label></p>  ' +
                '<p class="m_favourite">' +
                '<a href="" data-role="button" data-icon="star" data-inline="true" class="content_btn">加入收藏夹</a>' +
                '</p> ' +
                '</div> ' +
                '</div>';
            $('.basicInfo').append(html).trigger('create');//加载框架的样式

            /*绑定收藏图书事件*/
            $('.m_favourite').on("click", "a", function () {
                apiName = 'addFav';
                data = {
                    session: Session,
                    id: id
                };
                user().Api(apiName, data, function (returnData) {
                    if (returnData.Result) {
                        switch (returnData.Detail) {
                            case 'ADDED_SUCCEED':
                                alert('恭喜亲，收藏成功！');
                                break;
                            case 'ALREADY_IN_FAVORITE':
                                alert('亲，这本书已经收藏过了哦！');
                                break;
                            case 'ADDED_FAILED':
                                alert('Sorry,收藏失败了！');
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
                        alert('亲，不好意思，您的登录已经过期，请重新登陆!');
                        window.location.href = "index.html";
                    }
                });
            });

            /*绑定流通情况*/
            var CirculationInfo = returnData.Detail.CirculationInfo;
            html = '';
            $.each(CirculationInfo, function (index, value) {
                if (value.Date != null) {
                    html += '<div class="y_books"> ' +
                        '<div class="y_books-body"> ' +
                        '<p>条码:<label>' + value.Barcode + '</label></p>  ' +
                        '<p>状态:<label>' + value.Status + '</label></p>  ' +
                        '<p>所在书库:<label>' + value.Department + '</label></p>  ' +
                        '<p>应还日期:<label>' + value.Date + '</label></p> ' +
                        '</div> ' +
                        '</div> ';
                } else {
                    html += '<div class="y_books"> ' +
                        '<div class="y_books-body"> ' +
                        '<p>条码:<label>' + value.Barcode + '</label></p>  ' +
                        '<p>状态:<label>' + value.Status + '</label></p>  ' +
                        '<p>所在书库:<label>' + value.Department + '</label></p>  ' +
                        '</div> ' +
                        '</div> ';
                }
            });
            $('.cirInfo').append(html).trigger('create');//加载框架的样式

            /*绑定摘要*/
            html = '';
            html += summary;
            $('.absInfo').append(html).trigger('create');//加载框架的样式

            /*绑定相关图书*/
            var ReferBooks = returnData.Detail.ReferBooks;
            html = '';
            $.each(ReferBooks, function (index, value) {
                html += '<div class="y_books"> ' +
                    '<div class="y_books-header"> ' +
                    '<p> ' +
                    '<a href="moreInfo.html?id=' + value.ID + '&session=' + Session + '" data-rel="external" data-ajax="false">图书详情</a> ' +
                    '</p> ' +
                    '</div> ' +
                    '<div class="y_books-body"> ' +
                    '<p><label class="blue">《' + value.Title + '》</label></p>  ' +
                    '<p>作者:<label>' + value.Author + '</label></p>  ' +
                    '<p>控制号:<label>' + value.ID + '</label></p>  ' +
                    '</div> ' +
                    '</div> '
            });
            $('.relInfo').append(html).trigger('create');//加载框架的样式
        } else {
            alert('亲，不好意思，您的登录已经过期，请重新登陆!');
            window.location.href = "index.html";
        }
    });
});
