/**
 * Created by 文鹏 on 2014/7/21.
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
Session = getUrlParam("session");
if (Session == '' || Session == null) {
    window.location.href = "../error.html";
}
$(function () {
    var HOST = "http://localhost:18000";
    $.ajaxSetup({
        type: "GET",
        dataType: "jsonp",
        jsonp: "callback"
    });

    $.ajax({
        data: {"session": Session},
        url: HOST + "/user/info",
        success: function (res, status, xhr) {
            //alert(res.Detail.Name);
            var Name = res.Detail.Name;
            var html = '';
            html += Name;
            $('.name').append(html);
        }
    });
    $.ajax({
        url: HOST + "/user/rent",
        data: {"session": Session},
        success: function (res, status, xhr) {
            //console.log(res.Detail);
            var html = '';
            var rentInfo = res.Detail;
            $.each(rentInfo, function (index, value) {
                if (value.CanRenew) {
                    html += '<div class="y_books"> ' +
                        '<div class="y_books-header"> ' +
                        '<p> ' +
                        '<a href="moreInfo.html" data-rel="external" data-ajax="false">图书详情</a> ' +
                        '</p> ' +
                        '</div> ' +
                        '<div class="y_books-body"> ' +
                        '<p>书名:<label>《' + value.Title + '》</label></p> ' +
                        '<p>书号:<label>' + value.Barcode + '</label></p> ' +
                        '<p>到期时间:<label class="y_books-body-deadline">' + value.Date + '</label></p> ' +
                        '<p class="y_books-body-borrow"> ' +
                        '<a data-role="button" class="y_books-body-borrow-submit" data-inline="true">我要续借</a> ' +
                        '</p> ' +
                        '</div> ' +
                        '</div>';
                }
                else {
                    html += '<div class="y_books"> ' +
                        '<div class="y_books-header"> ' +
                        '<p> ' +
                        '<a href="moreInfo.html" data-rel="external" data-ajax="false">图书详情</a> ' +
                        '</p> ' +
                        '</div> ' +
                        '<div class="y_books-body"> ' +
                        '<p>书名:<label>《' + value.Title + '》</label></p>  ' +
                        '<p>书号:<label>' + value.Barcode + '</label></p>  ' +
                        '<p>到期时间:<label class="y_books-body-deadline">' + value.Date + '</label></p>  ' +
                        '<p>状态:<label class="y_books-body-deadline">' + value.State + '</label></p> ' +
                        '</div> ' +
                        '</div>';
                }
            });
            $('.bookInfo').append(html).trigger('create');
        }
    });


    $('.y_books-body-borrow-submit').on("");
    $(document).on("pageinit", "#borrow", function () {
        $("body").on("swipeleft", function () {
            $.mobile.changePage('search.html');
        });
    });
});