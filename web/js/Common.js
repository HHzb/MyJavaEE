function getAndSetLoginform() {
    // 1.动态选取dom id="login_form"的div
    var getHtmlString = $("#reg_login_form #login_form form").html();
    // alert(getHtmlString);
    $("#myModal .modal-body").html(getHtmlString);
}

function validate(curNodeOrCurEvent) { //是普通函数调用时参数是需要校验的input节点，是on类型响应函数调用时注入的参数是事件event
    var curNode = null;
    if (curNodeOrCurEvent.target == null) {
        普通函数调用
        //alert("each 调用");
        curNode = curNodeOrCurEvent;
    } else { //事件响应函数
        //alert("focus blue 调用");
        //curNode=curNodeOrCurEvent.target;
        curNode = this;
    }
    var retrunValue = true;
    var tipInfoId = curNode.name;
    var curValidateInfo = tipInfo[tipInfoId];
    var patt = curValidateInfo.patt;
    var curNodeValue = $(curNode).val();
    if (curNodeValue == "" || curNodeValue == null) {
        if (curNode == document.activeElement) {
            validateTip(curNode, "info");
        } else {
            validateTip(curNode, "normal");
        }
        retrunValue = false;
    } else {
        var checked = patt.test($(curNode).val());

        if (checked) {
            //二次密码校验
            if (tipInfoId == "pwd") {
                validateTip(curNode, "success");
            } //在老师的基础上，修改
            if (tipInfoId == "pwd2") {
                if (!(curNodeValue == $(pwd).val())) { //在老师的基础上，修改
                    tipInfo[tipInfoId].danger = "两次输入不一致";
                    validateTip(curNode, "danger");
                    retrunValue = false;
                } else {
                    validateTip(curNode, "success");
                } //在老师的基础上，修改
            } else if (tipInfoId == "email") {
                //alert(tipInfoId);
                //ajax校验
                var curDate = new Date();
                // $.ajaxSettings.async = false;//设置成同步，为了提交时的校验
                $.getJSON("ajax/regValidate.html?curTime=" + curDate.getTime(), curNodeValue, function (data, status, xhr) {
                    tipInfo[tipInfoId].danger = data.tip;
                    if (data.pass == "false") {
                        validateTip(curNode, "danger");
                        retrunValue = false; //????
                    }
                    return true;
                })
                // $.ajaxSettings.async = true;
            }

        } else {
            validateTip(curNode, "danger");
            retrunValue = false;
        }
    }
    // if (curNodeOrCurEvent.target == null) {//否则会阻止冒泡
    //     return retrunValue;
    // } else {
    //     console.log("type=" + curNodeOrCurEvent.type);
    //     console.log("bubbles=" + curNodeOrCurEvent.bubbles);
    //     console.log("currentTarget=" + curNodeOrCurEvent.currentTarget.name);
    //     return true;
    // }
    return retrunValue;
}

var tipInfo = {
    userName: {
        info: "请输入中文",
        danger: "用户名已被用",
        patt: /^[\u4e00-\u9fa5]+$/
    },
    email: {
        info: "邮箱是您登录的唯一账号，请谨慎填写",
        danger: "邮箱格式不正确",
        patt: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}/
    },
    mobile: {
        info: "请输入11位电话号码",
        danger: "电话号码输入有误，请重新输入",
        patt: /^((\(\d{2,3}\))|(\d{3}\-))?1[3,8,5]{1}\d{9}$/
    },
    pwd: {
        info: "请输入6位以上密码",
        danger: "请输入符合格式的密码",
        patt: /^\S{6,16}$/
    },
    pwd2: {
        info: "请再次输入密码",
        danger: "请重新输入格式正确",
        patt: /^\S{6,16}$/
    },
    loginEmail: {
        info: "请输入邮箱号码",
        danger: "邮箱格式有误，请重新输入",
        patt: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}/
    },
    loginPwd: {
        info: "请输入6位以上密码",
        danger: "请输入符合格式的密码",
        patt: /^\S{6,16}$/
    }
};

function validateTip(curNode, tipType) {
    var tipInfoId = curNode.name;
    var curValidateInfo = tipInfo[tipInfoId];
    var danger = curValidateInfo.danger;
    var info = curValidateInfo.info;
    switch (tipType) {
        case "normal":
            $(curNode).removeClass().addClass("border-info form-control");
            $(curNode).next().find("i").removeClass().addClass("fa fa-hand-o-left text-info");
            $(curNode).parent().next().hide();
            break;
        case "info":
            $(curNode).removeClass().addClass("border-info form-control");
            $(curNode).next().find("i").removeClass().addClass("fa fa-hand-o-left text-info");
            $(curNode).parent().next().removeClass().addClass("alert alert-info").html(info).show();
            break;
        case "success":
            $(curNode).removeClass().addClass("border-success form-control");
            $(curNode).next().find("i").removeClass().addClass("fa fa-check text-success");
            $(curNode).parent().next().hide();
            break;
        case "danger":
            $(curNode).removeClass().addClass("border-danger form-control");
            $(curNode).next().find("i").removeClass().addClass("fa fa-close text-danger");
            $(curNode).parent().next().removeClass().addClass("alert alert-danger").html(danger).show();
            break;
        default:

    }
}

function regSubmitCheck() {
    var returnValue = true;
    var focusNode = null;
    $("#reg_form input[validate='true']").each(function (index, curNode) {
        console.log("curNode=" + curNode.name);
        var isPass = curNode.className.indexOf("border-success") != -1 ? true : false;
        if (!isPass) {
            focusNode = curNode;
            returnValue = false;
            $(focusNode).focus();
            return false;
        }
    });
    //alert($(":radio[name='sex']:checked").val());
    if ($(":radio[name='sex']:checked").val() == null || $(":radio[name='sex']:checked").val() == undefined) {
        $("#sexTooltip").mouseover();
        returnValue = false;
    }
    if (!($("#agree").prop("checked"))) {
        $("#agree").mouseover();
        returnValue = false;
    }
    return returnValue;
}

// $(document).ready(
$(document).ready(function () {
    //$("#quickLogin").click(getAndSetLoginform);
    $('[data-toggle="tooltip"]').tooltip();
    //绑定input blur focus
    $("[validate='true']").on("focus blur", validate);
    // $("#regSubmit").click(regSubmitCheck);
    $("#regSubmit").on("focus click", regSubmitCheck);
})
// $(document).ready(
//     function () {
//         //$("#quickLogin").click(getAndSetLoginform);
//         $('[data-toggle="tooltip"]').tooltip();
//         //绑定input blur focus
//         $("[validate='true']").on("focus blur", validate);
//         // $("#regSubmit").click(regSubmitCheck);
//         $("#regSubmit").on("focus click", regSubmitCheck);
//     }
// );