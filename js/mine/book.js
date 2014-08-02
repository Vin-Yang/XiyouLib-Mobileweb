/**
 * Created by 文鹏 on 2014/7/30.
 */
(function () {
    var host = "http://172.20.0.20:18000";
    base().setHost(host);
    /*构造函数*/
    Book = function () {
    };
    Book.prototype.setHost = function (value) {
        host = value;
    };
    Book.prototype.Api = function (apiName, data, callback) {
        var api;
        switch (apiName) {
            case 'search':
                api = '/book/search';
                break;
            case 'detailById':
                api = '/book/detail/id/' + data;
                break;
            case 'detailByBarcode':
                api = '/book/detail/barcode/' + data;
                break;
            case 'getDouban':
                api = '/other/getDouban';
                break;
            default :
                callback(null);
        }
        base().Ajax(data, api, callback);
    };
})();
var book = function () {
    return new Book();
};
