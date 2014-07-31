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
    if (Id != null && Barcode == null) {
        apiName = 'detailById';
        data = Id;
    } else {
        apiName = 'detailByBarcode';
        data = Barcode;
    }
    book().Api(apiName, data, function (returnData) {
        if (returnData.Result) {
            var html = '';

            /*绑定基本信息*/
            /*图书馆提供的信息*/
            var title = returnData.Detail.Title;//书名
            var sort = returnData.Detail.Sort;//图书馆索书号
            var author = returnData.Detail.Author;//作者
            var isbn = returnData.Detail.ISBN;//标准号
            var pub = returnData.Detail.Pub;//出版社
            var id = returnData.Detail.ID;//图书馆内控制号
            /*有豆瓣时提供的信息*/
            var img;//图片
            var summary;//摘要
            var price;//价格
            var pages;//书的页数
            var binding;//装订
            var pubDate;//出版日期
            if (returnData.Detail.DoubanInfo != null) {
                img = returnData.Detail.DoubanInfo.Images.medium;
                summary = returnData.Detail.DoubanInfo.Summary;
                price = returnData.Detail.DoubanInfo.Price;
                pages = returnData.Detail.DoubanInfo.Pages;
                binding = returnData.Detail.DoubanInfo.Binding;
                pubDate = returnData.Detail.DoubanInfo.PubDate;
            } else {
                img = 'http://img3.douban.com/pics/book-default-medium.gif';
                summary = '抱歉亲，此书暂时还没有摘要呢！';
                price = '暂无';
                pages = '暂无';
                binding = '暂无';
                pubDate = '暂无';
            }
            html = '';
            html += '<div class="y_books"> ' +
                '<div class="y_books-header"> ' +
                '<p class="h20"></p> ' +
                '</div> ' +
                '<div class="y_books-body"> ' +
                '<p><img src="' + img + '" width="60px" height="60px"> ' +
                '书名:<label>《' + title + '》</label></p>  ' +
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
                        alert('亲，服务器实在是太忙了！');
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
                    '<div class="y_books-body"> ' +
                    '<p>书名:<label>《' + value.Title + '》</label></p>  ' +
                    '<p>作者:<label>' + value.Author + '</label></p>  ' +
                    '</div> ' +
                    '</div> '
            });
            $('.relInfo').append(html).trigger('create');//加载框架的样式
        } else {
            alert('亲，不好意思，服务器实在是太忙了！');
        }
    });
});
