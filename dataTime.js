function dataFormat(time, format) {
    //判断入参 time 是否是毫秒数（数值）
    var re = /^[1-9]+[0-9]*]*$/;
    if (re.test(time)) {
        var date = new Date(time);
        const o = {
            "M+": date.getMonth() + 1, //month 月
            "D+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
        };
        if (/(Y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    } else {
        console.log("dataFormat", time)
    }

};

exports.dataTime = dataFormat;